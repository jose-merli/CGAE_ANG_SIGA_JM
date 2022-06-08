import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { CertificacionesItem } from '../../../../../../models/sjcs/CertificacionesItem';

import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { saveAs } from "file-saver/FileSaver";
import { SigaStorageService } from '../../../../../../siga-storage.service';
import { VPacjgAlcActErrorCamItem } from '../../../../../../models/sjcs/VPacjgAlcActErrorCamItem';
import { TramitarCerttificacionRequestDTO } from '../../../../../../models/sjcs/TramitarCerttificacionRequestDTO';
import { forEach } from '@angular/router/src/utils/collection';

export interface Enlace {
  id: string;
  ref: any;
}

export const OPERACION_REINTEGROS = 28;

@Component({
  selector: 'app-ficha-envio-cam',
  templateUrl: './ficha-envio-cam.component.html',
  styleUrls: ['./ficha-envio-cam.component.scss']
})
export class FichaEnvioCamComponent implements OnInit {

  modoEdicion: boolean = false;
  permisoEscritura: any;
  progressSpinner: boolean = false;
  certificacion: CertificacionesItem = new CertificacionesItem();
 esCAM: boolean = false;
  esXunta: boolean = false;

  selectedDatos: VPacjgAlcActErrorCamItem[] = [];
  selectedItem: number = 10;
  rowsPerPage: any = [];
  cols: any[];
  msgs: any[];
  selectionMode: string = "multiple";
  numSelected: number = 0;
  selectMultiple: boolean = false;
  selectAll: boolean = false;
  @ViewChild("tabla") tabla;
  datos: VPacjgAlcActErrorCamItem[] = [];
  filtrosAux;
  listaFacturaciones:[];
  constructor(
    private location: Location,
    private changeDetectorRef: ChangeDetectorRef,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    private sigaService: SigaServices,
    private sigaStorageService: SigaStorageService
  ) { }
  
  getCols() {

    this.cols = [
      { field: "errorDescripcionAux", header: "", width: "100%" },
    ];

    this.rowsPerPage = [
      {  label: 10,  value: 10},
      //{   label: 20,  value: 20}
    ];

   
  }
  datosDefault(){
    let defaultOption1:VPacjgAlcActErrorCamItem = new VPacjgAlcActErrorCamItem();
    defaultOption1.errorDescripcionAux = "Cerrar Certificación y NO generar fichero para subir a la CAM(no modifica datos)";
    defaultOption1.codigoError = "NINGUNO";

    let defaultOption2:VPacjgAlcActErrorCamItem = new VPacjgAlcActErrorCamItem();
    defaultOption2.errorDescripcionAux = "ATENCIÓN: generar fichero completo con todos los errores. SOLO EN CASO DE BORRADO TOTAL POR LA CAM";
    defaultOption2.codigoError = "TODOS";

    this.datos.push(defaultOption1);
    this.datos.push(defaultOption2)
    
  }


  ngOnInit() {
    this.getCols();
    if(sessionStorage.getItem("filtrosBusquedaCerti")){
      this.filtrosAux = JSON.parse(sessionStorage.getItem("filtrosBusquedaCerti"));
      sessionStorage.removeItem("filtrosBusquedaCerti")
    }
      if (sessionStorage.getItem("fichaCAM")) {
        this.certificacion = JSON.parse(sessionStorage.getItem("fichaCAM"));
        sessionStorage.removeItem("fichaCAM");
        console.log("SI")
        console.log(this.certificacion)
        this.getErroresLista(this.certificacion.idCertificacion)
        this.getFactCertificaciones(this.certificacion.idCertificacion)
        
      }

  }

  getErroresLista(idCertificacion: String) {
    this.progressSpinner = true
    this.sigaService.post("certificaciones_buscarErroresCAM", idCertificacion).subscribe(
      data => {
        this.datosDefault();
      let listaErrores= JSON.parse(data.body).listaPcajgAlcActErrorCam;
      listaErrores.forEach(x =>{
        this.datos.push(x);
      });
     
      console.log( JSON.parse(data.body))  
      //this.buscar = true;
        this.progressSpinner = false;
        //if (this.datos.length != 0) {
         // this.partidaPresupuestaria = this.datos[0].idPartidaPresupuestaria
        //}
        let error = JSON.parse(data.body).error;

        if (error != undefined && error != null && error.description != null) {
          if (error.code == '200') {
            this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        }

        //this.resetSelect();

      },
      err => {
        if (err.status == '403' || err.status == 403) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        } else {
          if (err != undefined && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        }
        this.progressSpinner = false;
      }
    );
  }

  formatDescripcion(element:VPacjgAlcActErrorCamItem){
    return "["+element.codigoError+"] " + element.errorDescripcion + "(" + element.cuenta + ")";
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

  volver() {
    if(this.filtrosAux){
      sessionStorage.setItem("filtrosBusquedaCerti", JSON.stringify(this.filtrosAux));
    }
    sessionStorage.setItem("edicionDesdeTablaCerti", JSON.stringify(this.certificacion));
    this.location.back();
  }

 
  actuDesSeleccionados() {
    this.numSelected = this.selectedDatos.length;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }
  getFactCertificaciones(idCertificacion: String) {
    this.progressSpinner = true
    this.sigaService.post("certificaciones_getFactCertificaciones", idCertificacion).subscribe(
      data => {
        this.listaFacturaciones = JSON.parse(data.body).facturacionItem;
        //this.buscar = true;
        this.progressSpinner = false;

        let error = JSON.parse(data.body).error;

        if (error != undefined && error != null && error.description != null) {
          if (error.code == '200') {
            this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        }

        //this.resetSelect();

      },
      err => {
        if (err.status == '403' || err.status == 403) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        } else {
          if (err != undefined && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        }
        this.progressSpinner = false;
      }
    );
  }
  onChangeSelectAll() {

    if (this.selectAll === true) {
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;

    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }


  cerrarEnviar() {

      this.progressSpinner = true;

      

      const payload = new TramitarCerttificacionRequestDTO();
      payload.idCertificacion = this.certificacion.idCertificacion;
      payload.facturacionItemList = this.listaFacturaciones;
      payload.tipoFichero = this.selectedDatos[0].codigoError

      this.sigaService.post("certificaciones_tramitarCertificacion", payload).subscribe(
        data => {
          this.progressSpinner = false;

          const res = JSON.parse(data.body);

          if (res.error && res.error != null && res.error.description != null && res.error.description.toString().trim().length > 0 && res.status == 'KO' && (res.error.code == '500' || res.error.code == '400')) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(res.error.description.toString()));
          } else {
            //Volver a la ficha normal--
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          }
        },
        err => {
          this.progressSpinner = false;
          if (err && (err.status == '403' || err.status == 403)) {
            sessionStorage.setItem("codError", "403");
            sessionStorage.setItem(
              "descError",
              this.translateService.instant("generico.error.permiso.denegado")
            );
            this.router.navigate(["/errorAcceso"]);
          }
        }
      );

    
  }
}

