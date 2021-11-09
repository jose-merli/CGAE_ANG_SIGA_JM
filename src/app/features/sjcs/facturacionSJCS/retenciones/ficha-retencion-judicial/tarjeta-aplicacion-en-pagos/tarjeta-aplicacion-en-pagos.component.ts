import { Component, OnInit, Output, AfterViewInit, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { RetencionesAplicadasItem } from '../../../../../../models/sjcs/RetencionesAplicadasItem';
import { RetencionesRequestDto } from '../../../../../../models/sjcs/RetencionesRequestDTO';
import { Enlace } from '../ficha-retencion-judicial.component'
import { RetencionesService } from '../../retenciones.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { RetencionesAplicadasObject } from '../../../../../../models/sjcs/RetencionesAplicadasObject';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../../../_services/commons.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarjeta-aplicacion-en-pagos',
  templateUrl: './tarjeta-aplicacion-en-pagos.component.html',
  styleUrls: ['./tarjeta-aplicacion-en-pagos.component.scss']
})
export class TarjetaAplicacionEnPagosComponent implements OnInit, AfterViewInit {

  showTarjeta: boolean = false;
  historico: boolean = false;
  modoSeleccion = "multiple";
  selectedItem: number = 10;
  selectAll;
  datos: RetencionesAplicadasItem[] = [];
  selectedDatos: RetencionesAplicadasItem[] = [];
  numSelected = 0;
  rowsPerPage: any = [];
  cols;
  msgs = [];
  progressSpinner: boolean = false;
  permisoEscritura: boolean;

  @ViewChild("table") tabla: Table;

  @Output() addEnlace = new EventEmitter<Enlace>();
  @Output() showMessage = new EventEmitter<any>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private retencionesService: RetencionesService,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private commonsService: CommonsService,
    private router: Router) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaRetTarjetaAplicacionEnPagos).then(respuesta => {

      this.permisoEscritura = respuesta;

      if (this.permisoEscritura == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      this.getCols();
      if (this.retencionesService.modoEdicion) {
        this.getRetencionesAplicadas(false);
      }

    }).catch(error => console.error(error));

  }

  ngAfterViewInit() {

    const enlace: Enlace = {
      id: 'facSJCSFichaRetAplEnPag',
      ref: document.getElementById('facSJCSFichaRetAplEnPag')
    };

    this.addEnlace.emit(enlace);
  }

  getCols() {

    this.cols = [
      { field: "numColegiado", header: "facturacionSJCS.retenciones.nColegiado", width: "8%" },
      { field: "nombre", header: "facturacionSJCS.retenciones.nombre", width: "16%" },
      { field: "fechaInicio", header: "facturacionSJCS.retenciones.fechaIniNoti", width: "10%" },
      { field: "nombreDestinatario", header: "facturacionSJCS.retenciones.destinatario", width: "14%" },
      { field: "anioMes", header: "facturacionSJCS.retenciones.anioMes", width: "8%" },
      { field: "importeRetenido", header: "facturacionSJCS.retenciones.impRetenido", width: "10%" },
      { field: "fechaDesde", header: "facturacionSJCS.retenciones.fechaPago", width: "10%" },
      { field: "importePago", header: "facturacionSJCS.retenciones.impPago", width: "8%" },
      { field: "pagoRelacionado", header: "facturacionSJCS.retenciones.pago", width: "16%" }
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

  onChangeSelectAll() {

    if (this.selectAll === true) {

      if (this.historico) {
        this.selectedDatos = this.datos.filter(el => !this.isHistorico(el));
      } else {
        this.selectedDatos = this.datos;
      }

      this.numSelected = this.datos.length;

    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  onHideTarjeta() {
    if (!this.retencionesService.modoEdicion) {
      this.showTarjeta = false;
    } else {
      this.showTarjeta = !this.showTarjeta;
    }
  }

  actualizaDesSeleccionados() {
    this.numSelected = this.selectedDatos.length;
  }

  actualizaSeleccionados(event) {

    if (this.historico && this.isHistorico(event.data)) {
      this.selectedDatos.pop();
    }

    this.numSelected = this.selectedDatos.length;
  }

  mostrarHistorico() {
    this.getRetencionesAplicadas(true);
    this.historico = true;
    this.tabla.reset();
  }

  ocultarHistorico() {
    this.getRetencionesAplicadas(false);
    this.historico = false;
    this.tabla.reset();
  }

  isHistorico(item: RetencionesAplicadasItem) {
    return (item.fechaFin && (null != item.fechaFin || Date.now() >= item.fechaFin.getTime()));
  }

  getRetencionesAplicadas(historico: boolean) {

    const payload: RetencionesRequestDto = new RetencionesRequestDto();
    payload.historico = historico;
    payload.idRetenciones = this.retencionesService.retencion.idRetencion;

    this.progressSpinner = true;

    this.sigaServices.post("retenciones_buscarRetencionesAplicadas", payload).subscribe(
      data => {
        const res: RetencionesAplicadasObject = JSON.parse(data.body);

        if (res.error != null && res.error.description != null && res.error.code != null && res.error.code.toString() == "500") {
          this.showMessage.emit({
            severity: "error",
            summary: this.translateService.instant("general.message.incorrect"),
            detail: this.translateService.instant(res.error.description.toString())
          });
        } else {
          this.datos = res.retencionesAplicadasItemList;
        }

        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      });
  }

}