import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../../../../../commons/translate';
// import { CertificacionFacItem } from '../../../../../../models/sjcs/CertificacionesItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-tarjeta-facturacion',
  templateUrl: './tarjeta-facturacion.component.html',
  styleUrls: ['./tarjeta-facturacion.component.scss']
})
export class TarjetaFacturacionComponent implements OnInit {
  progressSpinner;
  permisos;
  datosTablaFact=[];
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
  buscadores = [];

  @Input() idCertificacion;
  @Input() modoEdicion;
  @Output() changeModoEdicion = new EventEmitter<boolean>();
  @ViewChild("tabla") tabla;
  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.getCols();
  }

  getCols(){
    
    this.cols = [
      { field: "fechaDesde", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaDesde", width: "10%" },
      { field: "fechaHasta", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaHasta", width: "10%" },
      { field: "nombre", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.nombre", width: "20%" },
      { field: "grupoFacturacion", header: "justiciaGratuita.oficio.turnos.grupofacturacion", width: "10%" },
      { field: "importeTurno", header: "facturacionSJCS.baremosDeGuardia.turno", width: "5%" },
      { field: "importeGuardia", header: "facturacionSJCS.baremosDeGuardia.guardia", width: "5%" },
      { field: "importeEjg", header: "justiciaGratuita.ejg.datosGenerales.EJG", width: "5%" },
      { field: "importeSoj", header: "justiciaGratuita.ejg.busquedaAsuntos.SOJ", width: "5%" },
      { field: "importeTotal", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.total", width: "5%" },

      { field: "pendiente", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.pendiente", width: "5%" },
      { field: "pagado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.pagado", width: "5%" },
      { field: "regul", header: "facturacionSJCS.fichaCertificacion.regul", width: "5%" },
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

  reabrir(){

  }

  nuevo(){

  }

  restablecer(){

  }

  save(){

  }

  confirmDelete(){
    let mess = this.translateService.instant(
      "messages.deleteConfirmation"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.deleteFacturacion();
      },
      reject: () => {
        this.showMessage("info", "Info", this.translateService.instant("general.message.accion.cancelada"));
      }
    });
  }
  deleteFacturacion(){
    
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
      // this.selectedDatos = this.datosTablaFact;
      // this.numSelected = this.datosTablaFact.length;
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

}
