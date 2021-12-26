import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { CertificacionesItem } from '../../../../../../models/sjcs/CertificacionesItem';
import { MovimientosVariosAsoCerItem } from '../../../../../../models/sjcs/MovimientosVariosAsoCerItem';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../../../_services/commons.service';
import { Enlace } from '../ficha-certificacion-fac.component';

@Component({
  selector: 'app-tarjeta-movimientos-varios-asociados',
  templateUrl: './tarjeta-movimientos-varios-asociados.component.html',
  styleUrls: ['./tarjeta-movimientos-varios-asociados.component.scss']
})
export class TarjetaMovimientosVariosAsociadosComponent implements OnInit {
  showTarjeta: boolean = false;
  selectedDatos: MovimientosVariosAsoCerItem[] = [];
  selectionMode: string = "multiple";
  selectedItem: number = 10;
  numSelected: number = 0;
  rowsPerPage: any = [];
  progressSpinner: boolean = false;
  permisoEscritura: boolean = false;
  cols: any[] = [];
  msgs: any[] = [];
  selectAll: boolean = false;

  @ViewChild("tabla") tabla;

  @Input() modoEdicion: boolean = false;
  @Input() certificacion: CertificacionesItem = new CertificacionesItem();
  @Input() datos: MovimientosVariosAsoCerItem[] = [];

  @Output() addEnlace = new EventEmitter<Enlace>();
  @Output() getMovimientosAsoEvent = new EventEmitter<string>();

  constructor(private changeDetectorRef: ChangeDetectorRef, private commonsService: CommonsService,
    private router: Router, private translateService: TranslateService) { }

  ngOnInit() {
    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaCerTarjetaMvariosAso).then(respuesta => {

      this.permisoEscritura = respuesta;

      if (this.permisoEscritura == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      this.getCols();

      if (this.modoEdicion) {
        this.getMovimientosAso();
      }

    }).catch(error => console.error(error));
  }

  getCols() {

    this.cols = [
      { field: "numColegiado", header: "censo.resultadoDuplicados.numeroColegiado", width: "11.5%" },
      { field: "apellidos", header: "facturacionSJCS.facturacionesYPagos.apellidos", width: "18%" },
      { field: "nombre", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.nombre", width: "11.5%" },
      { field: "descripcion", header: "general.description", width: "18%" },
      { field: "asunto", header: "justiciaGratuita.sjcs.designas.DatosIden.asunto", width: "18%" },
      { field: "fechaAlta", header: "administracion.usuarios.literal.fechaAlta", width: "11.5%" },
      { field: "importe", header: "facturacionSJCS.tarjGenFac.importe", width: "11.5%" }
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

  onHideTarjeta() {
    if (this.modoEdicion) {
      this.showTarjeta = !this.showTarjeta;
    } else {
      this.showTarjeta = false;
    }
  }

  actualizaDesSeleccionados() {
    this.numSelected = this.selectedDatos.length;
  }

  actualizaSeleccionados(event) {
    this.numSelected = this.selectedDatos.length;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  getMovimientosAso() {
    this.getMovimientosAsoEvent.emit(this.certificacion.idCertificacion);
  }

  enviar() {

  }

  descargarLog() {

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

  ngAfterViewInit() {

    const enlace: Enlace = {
      id: 'fichaCertMovAso',
      ref: document.getElementById('fichaCertMovAso')
    };

    this.addEnlace.emit(enlace);
  }
}
