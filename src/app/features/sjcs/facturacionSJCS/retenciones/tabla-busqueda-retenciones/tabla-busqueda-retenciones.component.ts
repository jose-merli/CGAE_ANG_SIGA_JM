import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ConfirmationService } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { RetencionesItem } from '../../../../../models/sjcs/RetencionesItem';
import { Router } from '@angular/router';
import { RetencionesService } from '../retenciones.service';
@Component({
  selector: 'app-tabla-busqueda-retenciones',
  templateUrl: './tabla-busqueda-retenciones.component.html',
  styleUrls: ['./tabla-busqueda-retenciones.component.scss']
})
export class TablaBusquedaRetencionesComponent implements OnInit {

  @Input() permisoEscritura: boolean;
  @Input() datos: RetencionesItem[] = [];

  @Output() buscarEvent = new EventEmitter<boolean>();
  @Output() eliminarEvent = new EventEmitter<{ retenciones: RetencionesItem[], historico: boolean }>();

  @ViewChild("table") tabla: Table;
  @ViewChild("tablaFoco") tablaFoco: ElementRef;
  modoSeleccion = "multiple";
  selectedItem: number = 10;
  selectAll;
  selectedDatos: RetencionesItem[] = [];
  numSelected = 0;
  rowsPerPage: any = [];
  cols;
  msgs;

  historico: boolean = false;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private router: Router,
    private retencionesService: RetencionesService) { }

  ngOnInit() {
    this.getCols();
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

  getCols() {

    this.cols = [
      { field: "ncolegiado", header: "facturacionSJCS.retenciones.nColegiado", width: "12%" },
      { field: "nombre", header: "facturacionSJCS.retenciones.nombre", width: "14%" },
      { field: "tipoRetencion", header: "facturacionSJCS.retenciones.tipoRetencion", width: "12%" },
      { field: "importe", header: "facturacionSJCS.retenciones.importeRetener", width: "12%" },
      { field: "restante", header: "facturacionSJCS.retenciones.importeRestante", width: "12%" },
      { field: "fechaInicio", header: "facturacionSJCS.retenciones.fechaIniNoti", width: "12%" },
      { field: "fechaFin", header: "facturacionSJCS.retenciones.fechaFinNoti", width: "12%" },
      { field: "nombreDestinatario", header: "facturacionSJCS.retenciones.destinatario", width: "14%" }
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

  isHistorico(item: RetencionesItem) {
    return (item.fechaFin && (null != item.fechaFin || Date.now() >= item.fechaFin.getTime()));
  }

  confirmDelete() {
    if (this.permisoEscritura && this.selectedDatos != undefined && this.selectedDatos.length > 0) {

      let mess = this.translateService.instant(
        "messages.deleteConfirmation"
      );
      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          this.eliminar();
        },
        reject: () => {
          this.showMessage("info", "Info", this.translateService.instant("general.message.accion.cancelada"));
        }
      });

    }
  }

  eliminar() {
    this.eliminarEvent.emit({ retenciones: this.selectedDatos, historico: this.historico });
    this.tabla.reset();
    this.numSelected = 0;
  }

  openFicha(dato: RetencionesItem) {
    this.retencionesService.modoEdicion = true;
    this.retencionesService.retencion = dato;
    this.router.navigate(["/fichaRetencionJudicial"]);
  }

}
