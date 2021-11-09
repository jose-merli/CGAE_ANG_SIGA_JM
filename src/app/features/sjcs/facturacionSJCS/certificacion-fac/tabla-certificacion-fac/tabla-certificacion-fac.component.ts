import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate';
import { CertificacionFacItem } from '../../../../../models/sjcs/CertificacionFacItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-tabla-certificacion-fac',
  templateUrl: './tabla-certificacion-fac.component.html',
  styleUrls: ['./tabla-certificacion-fac.component.scss']
})
export class TablaCertificacionFacComponent implements OnInit {

  selectedDatos;
  selectedItem: number = 10;
  rowsPerPage: any = [];
  cols;
  msgs;
  selectionMode: String = "multiple";
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  selectAll: boolean = false;
  first: any;
  initDatos: any;
  buscadores = [];
  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService) { }

  @Input() datos;
  @Input() permisoEscritura;
  @Output() delete = new EventEmitter<CertificacionFacItem>();
  @ViewChild("tabla") tabla;
  @ViewChild("tablaFoco") tablaFoco: ElementRef;
  ngOnInit() {
    if (this.persistenceService.getPaginacion() != undefined) {
      let paginacion = this.persistenceService.getPaginacion();
      this.persistenceService.clearPaginacion();

      this.first = paginacion.paginacion;
      this.selectedItem = paginacion.selectedItem;
    }

    this.getCols();
    if(this.datos != null || this.datos != undefined){
      this.initDatos = JSON.parse(JSON.stringify((this.datos)));
    }else{
      
    }
    
  }

  getCols(){
    
      this.cols = [
        { field: "periodo", header: "justiciaGratuita.guardia.gestion.periodo", width: "10%" },
        { field: "nombre", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.nombre", width: "10%" },
        { field: "importeTurno", header: "justiciaGratuita.sjcs.designas.DatosIden.turno", width: "20%" },
        { field: "importeGuardia", header: "menu.justiciaGratuita.GuardiaMenu", width: "10%" },
        { field: "importeEjg", header: "justiciaGratuita.ejg.datosGenerales.EJG", width: "10%" },
        { field: "importeSoj", header: "justiciaGratuita.ejg.busquedaAsuntos.SOJ", width: "10%" },
        { field: "importeTotal", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.total", width: "10%" },
        { field: "estado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado", width: "10%" }
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

  delCert(){
    if (undefined != this.selectedDatos.idFacturacion || null != this.selectedDatos.idFacturacion) {

      let mess = this.translateService.instant(
        "messages.deleteConfirmation"
      );
      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          this.delete.emit(this.selectedDatos);
        },
        reject: () => {
          this.showMessage("info", "Info", this.translateService.instant("general.message.accion.cancelada"));
        }
      });

    }
  }

  modificarCert(){

  }

  selectDesSelectFila(){
    this.numSelected = this.selectedDatos.length;
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

  disabledEliminar() {
    if (undefined != this.selectedDatos && this.selectedDatos.length != 1) {
      return true;
    } else {
      return false;
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
}
