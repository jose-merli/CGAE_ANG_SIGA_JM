import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/components/overlaypanel/overlaypanel';
import { Table } from 'primeng/table';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { AplicacionRetencionItem } from '../../../../../models/sjcs/AplicacionRetencionItem';
import { AplicacionRetencionObject } from '../../../../../models/sjcs/AplicacionRetencionObject';
import { AplicacionRetencionRequestDTO } from '../../../../../models/sjcs/AplicacionRetencionRequestDTO';
import { RetencionesAplicadasItem } from '../../../../../models/sjcs/RetencionesAplicadasItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { RetencionesService } from '../retenciones.service';
import { Router } from '@angular/router';
import { RetencionesItem } from '../../../../../models/sjcs/RetencionesItem';

@Component({
  selector: 'app-tabla-busqueda-retenciones-aplicadas',
  templateUrl: './tabla-busqueda-retenciones-aplicadas.component.html',
  styleUrls: ['./tabla-busqueda-retenciones-aplicadas.component.scss']
})
export class TablaBusquedaRetencionesAplicadasComponent implements OnInit {

  @Input() permisoEscritura: boolean;
  @Input() datos: RetencionesAplicadasItem[] = [];

  @Output() buscarEvent = new EventEmitter<boolean>();

  @ViewChild("table") tabla: Table;
  @ViewChild("tablaFoco") tablaFoco: ElementRef;
  @ViewChild("op") op: OverlayPanel;

  modoSeleccion = "multiple";
  selectedItem: number = 10;
  selectAll;
  selectedDatos: RetencionesAplicadasItem[] = [];
  numSelected = 0;
  rowsPerPage: any = [];
  cols;
  msgs = [];
  progressSpinner: boolean = false;
  historico: boolean = false;
  datosAplicacionRetencion: AplicacionRetencionItem[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private retencionesService: RetencionesService,
    private router: Router) { }

  ngOnInit() {
    this.getCols();
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
      { field: "pagoRelacionado", header: "facturacionSJCS.retenciones.pago", width: "16%" },
      { field: "aplicaciones", header: "facturacionSJCS.retenciones.aplicaciones", width: "16%" }
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

  clear() {
    this.msgs = [];
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
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
    this.buscarEvent.emit(true);
    this.historico = true;
    this.tabla.reset();
  }

  ocultarHistorico() {
    this.buscarEvent.emit(false);
    this.historico = false;
    this.tabla.reset();
  }

  isHistorico(item: RetencionesAplicadasItem) {
    return (item.fechaFin && (null != item.fechaFin || Date.now() >= item.fechaFin.getTime()));
  }




  getAplicacionesRetenciones(item: RetencionesAplicadasItem, event: any) {

    const payload: AplicacionRetencionRequestDTO = new AplicacionRetencionRequestDTO();
    payload.idPersona = item.idPersona;
    payload.fechaPagoDesde = item.fechaDesde;
    payload.fechaPagoHasta = item.fechaHasta;

    this.progressSpinner = true;

    this.sigaServices.post("retenciones_buscarAplicacionesRetenciones", payload).subscribe(
      data => {
        const res: AplicacionRetencionObject = JSON.parse(data.body);

        if (res.error != null && res.error.description != null && res.error.code != null && res.error.code.toString() == "500") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(res.error.description.toString()));
        } else {
          this.datosAplicacionRetencion = res.aplicacionRetencionItemList;
          this.op.toggle(event);
        }

        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );

  }

  openFicha(dato: RetencionesAplicadasItem) {
    this.retencionesService.modoEdicion = true;

    const retencionItem = new RetencionesItem();
    retencionItem.idRetencion = dato.idRetencion;
    retencionItem.idPersona = dato.idPersona;
    this.retencionesService.retencion = retencionItem;

    this.router.navigate(["/fichaRetencionJudicial"]);
  }

}
