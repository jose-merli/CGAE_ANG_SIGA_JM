import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { USER_VALIDATIONS } from "../../../../../properties/val-properties";
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { ConfirmationService } from 'primeng/primeng';
import { SortEvent } from '../../../../../../../node_modules/primeng/api';
import { FacturacionDTO } from '../../../../../models/sjcs/FacturacionDTO';
import { FacturacionItem } from '../../../../../models/sjcs/FacturacionItem';
import { checkAndUpdateElementInline } from '@angular/core/src/view/element';

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
 
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;

  message;
  permisos: boolean = false;

  initDatos;
  progressSpinner: boolean = false;

  @Input() datos;
  
  @ViewChild("table") tabla;
  
  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
    if (this.persistenceService.getPermisos()) {
      this.permisos = true;
    } else {
      this.permisos = false;
    }
  }

  seleccionaFila(evento) {
    if (!this.selectMultiple) {
      this.persistenceService.setDatos(evento.data);
      this.router.navigate(["/fichaFacturacion"]);
    } 
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
    this.seleccion = false;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  isSelectMultiple() {
    if (this.permisos) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    }
    // this.volver();
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

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }
  getCols() {

    this.cols = [
      { field: "fechaDesde", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaDesde" },
      { field: "fechaHasta", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaHasta" },
      { field: "nombre", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.nombre" },
      { field: "regularizacion", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.regularizacion" },
      { field: "importeTotal", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.total" },
      { field: "importePendiente", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.pendiente" },
      { field: "importePagado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.pagado" },
      { field: "fechaEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado" },
      { field: "desEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado" }
    ];
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

  checkDelete(selectedDatos){
    let encontrado = false;

    if(selectedDatos.idEstado!='30'){
      encontrado=true;
      for(let i=0; i<this.datos.length; i++){
        if(this.datos[i].idFacturacion==selectedDatos.idFacturacion && this.datos[i].idInstitucion==selectedDatos.idInstitucion &&
          this.datos[i].fechaEstado>selectedDatos.fechaEstado){
            encontrado=false;
            break;
          }
      }
    }
    return encontrado;
  }

  confirmDelete(selectedDatos) {
    if(this.checkDelete(selectedDatos)){
      let mess = this.translateService.instant(
        "messages.deleteConfirmation"
      );
      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          this.delete(selectedDatos)
        },
        reject: () => {
          this.msgs = [
            {
              severity: "info",
              summary: "Cancelar",
              detail: this.translateService.instant(
                "general.message.accion.cancelada"
              )
            }
          ];
        }
      });
    }else{
      this.msgs = [];
      this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("Error"),
      detail: this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.mensajeErrorEliminar")
    });
    }
  }

  delete(selectedDatos) {
    this.progressSpinner = true;
    this.sigaServices.post("facturacionsjcs_eliminarFacturacion",selectedDatos.idFacturacion).subscribe(
			data => {
        console.log(data);
        this.showSuccessDelete();
      },
      err => {
        console.log(err); 
        this.progressSpinner = false;
        this.showFail();
      },
      () => {
        this.progressSpinner = false;
        this.tabla.reset();
      }
    );
  }

  showSuccessDelete() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("messages.deleted.success")
    });
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.mensajeErrorEliminar")
    });
  }
}
