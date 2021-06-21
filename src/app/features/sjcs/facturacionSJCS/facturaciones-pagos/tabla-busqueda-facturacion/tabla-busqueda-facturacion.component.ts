import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, Output, EventEmitter, ElementRef } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { ConfirmationService } from 'primeng/primeng';
import { SortEvent } from '../../../../../../../node_modules/primeng/api';
import { FacturacionItem } from '../../../../../models/sjcs/FacturacionItem';

@Component({
  selector: 'app-tabla-busqueda-facturacion',
  templateUrl: './tabla-busqueda-facturacion.component.html',
  styleUrls: ['./tabla-busqueda-facturacion.component.scss']
})
export class TablaBusquedaFacturacionComponent implements OnInit {
  rowsPerPage: any = [];
  cols;
  msgs;
  buscadores = [];
  selectedItem: number = 10;
  selectionMode: String = "multiple";

  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  selectAll: boolean = false;

  message;
  first = 0;
  initDatos;

  @Input() datos;
  @Input() filtroSeleccionado;
  @Input() permisos;

  @Output() delete = new EventEmitter<FacturacionItem>();

  @ViewChild("tabla") tabla;
  @ViewChild("tablaFoco") tablaFoco: ElementRef;

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    if (this.persistenceService.getPaginacion() != undefined) {
      let paginacion = this.persistenceService.getPaginacion();
      this.persistenceService.clearPaginacion();

      this.first = paginacion.paginacion;
      this.selectedItem = paginacion.selectedItem;
    }

    this.getCols();

    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
  }

  selectDesSelectFila() {
    this.numSelected = this.selectedDatos.length;
  }

  openFicha(datos) {

    let paginacion = {
      paginacion: this.tabla.first,
      selectedItem: this.selectedItem
    };

    this.persistenceService.setPaginacion(paginacion);

    datos.filtroSeleccionado = this.filtroSeleccionado;

    this.persistenceService.setDatos(datos);

    if (this.filtroSeleccionado == "facturacion") {
      this.router.navigate(["/fichaFacturacion"]);
    }

    if (this.filtroSeleccionado == "pagos") {
      this.router.navigate(["/fichaPagos"]);
    }

  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
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

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order * result);
    });
  }

  getCols() {
    if (this.filtroSeleccionado == "facturacion") {
      this.cols = [
        { field: "fechaDesde", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaDesde", width: "10%" },
        { field: "fechaHasta", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaHasta", width: "10%" },
        { field: "nombre", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.nombre", width: "20%" },
        { field: "regularizacion", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.regularizacion", width: "10%" },
        { field: "importeTotal", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.total", width: "10%" },
        { field: "importePendiente", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.pendiente", width: "10%" },
        { field: "importePagado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.pagado", width: "10%" },
        { field: "fechaEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado", width: "10%" },
        { field: "desEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado", width: "10%" }
      ];
    } else if (this.filtroSeleccionado == "pagos") {
      this.cols = [
        { field: "fechaDesde", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaDesde", width: "10%" },
        { field: "fechaHasta", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaHasta", width: "10%" },
        { field: "nombre", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.nombre", width: "20%" },
        { field: "abreviatura", header: "facturacionSJCS.facturacionesYPagos.conceptos", width: "15%" },
        { field: "porcentaje", header: "facturacionSJCS.facturacionesYPagos.porcentaje", width: "10%" },
        { field: "cantidad", header: "facturacionSJCS.facturacionesYPagos.cantidad", width: "10%" },
        { field: "fechaEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado", width: "10%" },
        { field: "desEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado", width: "15%" }
      ];
    }

    this.cols.forEach(it => this.buscadores.push(""));
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

  // checkDelete(selectedDatos) {
  //   let encontrado = false;

  //   if (selectedDatos.idEstado != '30') {
  //     encontrado = true;
  //     for (let i = 0; i < this.datos.length; i++) {
  //       if (this.datos[i].idFacturacion == selectedDatos.idFacturacion && this.datos[i].idInstitucion == selectedDatos.idInstitucion &&
  //         this.datos[i].fechaEstado > selectedDatos.fechaEstado) {
  //         encontrado = false;
  //         break;
  //       }
  //     }
  //   }
  //   return encontrado;
  // }

  confirmDelete(selectedDatos) {
    if (undefined != selectedDatos.idFacturacion || null != selectedDatos.idFacturacion) {
      // if (this.checkDelete(selectedDatos)) {
      let mess = this.translateService.instant(
        "messages.deleteConfirmation"
      );
      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          this.delete.emit(selectedDatos);
        },
        reject: () => {
          this.showMessage("info", "Info", this.translateService.instant("general.message.accion.cancelada"));
        }
      });
      /*} else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.mensajeErrorEliminar"));
      }*/
    }
  }

  disabledEliminar() {
    if (undefined != this.selectedDatos && this.selectedDatos.length != 1) {
      return true;
    } else {
      return false;
    }
  }
}
