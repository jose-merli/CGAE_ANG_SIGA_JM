import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { Table } from 'primeng/table';
import { CertificacionesItem } from '../../../../../../models/sjcs/CertificacionesItem';
import { EstadoCertificacionItem } from '../../../../../../models/sjcs/EstadoCertificacionItem';
import { ESTADO_CERTIFICACION } from '../../certificacion-fac.component';
import { CommonsService } from '../../../../../../_services/commons.service';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacionSJCS';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { Router } from '@angular/router';
import { Enlace } from '../ficha-certificacion-fac.component';
import { SigaServices } from '../../../../../../_services/siga.service';
import { FileUpload } from 'primeng/primeng';

@Component({
  selector: 'app-tarjeta-datos-generales-fiFac',
  templateUrl: './tarjeta-datos-generales-certificacion.component.html',
  styleUrls: ['./tarjeta-datos-generales-certificacion.component.scss']
})
export class TarjetaDatosGeneralesCertificacionComponent implements OnInit, OnChanges, AfterViewInit {

  showDatosGenerales: boolean = true;
  progressSpinner: boolean = false;
  msgs: any[];
  permisoEscritura: boolean = true;
  selectedItem: number = 10;
  rowsPerPage: any = [];
  cols: any[] = [];
  nombreInicial: string;
  file: File = undefined;

  @Input() modoEdicion: boolean = false;
  @Input() certificacion: CertificacionesItem = new CertificacionesItem();
  @Input() estadosCertificacion: EstadoCertificacionItem[] = [];
  @Input() esCAM: boolean = false;
  @Input() esXunta: boolean = false;

  @Output() guardarEvent = new EventEmitter<boolean>();
  @Output() reabrirEvent = new EventEmitter<boolean>();
  @Output() cerrarEvent = new EventEmitter<boolean>();
  @Output() descargarEvent = new EventEmitter<boolean>();
  @Output() restablecerEvent = new EventEmitter<string>();
  @Output() getListaEstadosEvent = new EventEmitter<string>();
  @Output() subirFicheroCAMEvent = new EventEmitter<File>();
  @Output() addEnlace = new EventEmitter<Enlace>();

  @ViewChild("tabla") tabla: Table;
  @ViewChild("pUploadFile") pUploadFile: FileUpload;
  filtrosAux;

  constructor(private changeDetectorRef: ChangeDetectorRef, private commonsService: CommonsService, private translateService: TranslateService,
    private router: Router, private sigaServices: SigaServices) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaCerTarjetaDatosGenerales).then(respuesta => {

      this.permisoEscritura = respuesta;

      if (this.permisoEscritura == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      this.getCols();

      if (this.modoEdicion && this.certificacion && this.certificacion != null && this.certificacion.idCertificacion && this.certificacion.idCertificacion != null
        && this.certificacion.idCertificacion.length > 0) {
        this.getListEstados(this.certificacion.idCertificacion);
        this.nombreInicial = this.certificacion.nombre;
      }

    }).catch(error => console.error(error));
    if(sessionStorage.getItem("filtrosBusquedaCerti")){
      this.filtrosAux = JSON.parse(sessionStorage.getItem("filtrosBusquedaCerti"));
    }
  }

  onHideDatosGenerales() {
    // this.showDatosGenerales != this.showDatosGenerales;
  }

  getCols() {

    this.cols = [
      { field: "fechaEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado", width: "33%" },
      { field: "proceso", header: "facturacionSJCS.fichaCertificacion.proceso", width: "33%" },
      { field: "estado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado", width: "33%" },

    ];

    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];

  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  disabledSubirFichero(){
    if(this.esCAM &&  ["7"].includes(this.certificacion.idEstadoCertificacion)){
      return false
    }
    return true;
  }


  getListEstados(idCertificacion: string) {
    if (idCertificacion && idCertificacion != null && idCertificacion.trim().length > 0) {
      this.getListaEstadosEvent.emit(idCertificacion);
    }
  }

  disabledDescargar() {
    let respuesta = true;

    if (this.permisoEscritura && this.modoEdicion) {

      if (!this.esCAM && ["7", "3"].includes(this.certificacion.idEstadoCertificacion)) {
        respuesta = false;
      }

      if (this.esCAM && ["7","6","3"].includes(this.certificacion.idEstadoCertificacion)) {
        respuesta = false;
      }
      

    }

    return respuesta;
  }

  descargar() {

    if (!this.disabledDescargar()) {
      this.descargarEvent.emit(true);
    }

  }

  uploadFile(event: any) {

    if (this.permisoEscritura && this.esCAM) {

      // guardamos la imagen en front para despues guardarla, siempre que tenga extension de imagen
      let fileList: FileList = event.files;

      let nombreCompletoArchivo = fileList[0].name;
      let extensionArchivo = nombreCompletoArchivo.substring(
        nombreCompletoArchivo.lastIndexOf("."),
        nombreCompletoArchivo.length
      );

      if (extensionArchivo == null) {
        // Mensaje de error de formato de imagen y deshabilitar boton guardar
        this.file = undefined;
      } else {
        // se almacena el archivo para habilitar boton guardar
        this.file = fileList[0];
        this.subirFicheroCAMEvent.emit(this.file);
        this.pUploadFile.clear();
      }

    }

  }

  disabledReabrir(): boolean {
    let respuesta = false;

    if (!this.permisoEscritura || !this.modoEdicion || this.certificacion == undefined || this.certificacion == null || this.certificacion.idCertificacion == undefined || this.certificacion.idCertificacion == null
      || !this.isCerrada()) {
      respuesta = true;
    }

    return respuesta;
  }

  reabrir() {

    if (!this.disabledReabrir() && this.isCerrada()) {
      this.reabrirEvent.emit(true);
    }
  }


  disabledCerrar(): boolean {
    let respuesta = false;

    if (!this.permisoEscritura || !this.modoEdicion || (!["1", "3", "6"].includes(this.certificacion.idEstadoCertificacion))) {
      respuesta = true;
    }

    return respuesta;

  }

  cerrarEnviar() {

    if (!this.disabledCerrar()) {
      if(this.certificacion.idEstadoCertificacion == "6"   && this.esCAM){
            sessionStorage.setItem("fichaCAM", JSON.stringify(this.certificacion));
            this.router.navigate(['/fichaEnvioCam']);
            
      }else{
        this.cerrarEvent.emit(true);
      }
    }
  }

  disabledSave(): boolean {
    let respuesta = false;

    if (!this.permisoEscritura || this.certificacion.nombre == this.nombreInicial || ["2", "7"].includes(this.certificacion.idEstadoCertificacion)) {
      respuesta = true;
    }

    return respuesta;
  }

  save() {

    if (!this.disabledSave()) {
      this.guardarEvent.emit(true);
    }
  }

  disablebRestablecer(): boolean {
    let respuesta = false;

    if (!this.permisoEscritura || !this.modoEdicion || this.certificacion.nombre == this.nombreInicial || ["2", "7"].includes(this.certificacion.idEstadoCertificacion)) {
      respuesta = true;
    }

    return respuesta;
  }

  restablecer() {
    if (!this.disablebRestablecer()) {
      this.restablecerEvent.emit(this.certificacion.idCertificacion);
    }
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

  marcarObligatorio(tipoCampo: string, valor) {
    let resp = false;

    if (tipoCampo == 'input' && (valor == undefined || valor == null || valor.trim().length == 0)) {
      resp = true;
    }

    return resp;
  }

  isCerrada() {
    return this.certificacion.idEstadoCertificacion == ESTADO_CERTIFICACION.ESTADO_CERTIFICACION_CERRADA;
  }

  isValidando() {
    return this.certificacion.idEstadoCertificacion == ESTADO_CERTIFICACION.ESTADO_CERTIFICACION_VALIDANDO;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.certificacion && changes.certificacion.currentValue) {
      this.nombreInicial = changes.certificacion.currentValue.nombre;
    }
  }

  ngAfterViewInit() {

    const enlace: Enlace = {
      id: 'fichaCertDatosGenerales',
      ref: document.getElementById('fichaCertDatosGenerales')
    };

    this.addEnlace.emit(enlace);
  }

}
