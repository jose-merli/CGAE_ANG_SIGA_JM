import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Table } from '../../../../../../../node_modules/primeng/table';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../_services/commons.service';

@Component({
  selector: 'app-tabla-cartas-facturacion-pago',
  templateUrl: './tabla-cartas-facturacion-pago.component.html',
  styleUrls: ['./tabla-cartas-facturacion-pago.component.scss']
})
export class TablaCartasFacturacionPagoComponent implements OnInit {

  msgs = [];
  rowsPerPage: any = [];
  cols;

  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;

  progressSpinner: boolean = false;
  permisoEscritura: boolean = false;
  modoBusqueda;

  @ViewChild("table") tabla: Table;
  @Input() datos = [];

  constructor(private changeDetectorRef: ChangeDetectorRef, private persistenceService: PersistenceService, private commonsService: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    if(this.persistenceService.getFiltros() != undefined){
      this.modoBusqueda = this.persistenceService.getFiltros().modoBusqueda;
    }

    this.getCols();
 
  }

  getCols(){

    if(this.modoBusqueda == "f"){
      this.getColsFacturacion();
    }else if(this.modoBusqueda == "p"){
      this.getColsPago();
    }else{
      this.modoBusqueda="f";
      this.getColsFacturacion();
    }

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

 
  getColsFacturacion() {

    this.cols = [
      { field: "ncolegiado", header: "censo.resultadosSolicitudesModificacion.literal.nColegiado", width: "10%" },
      { field: "nombreCol", header: "justiciaGratuita.justiciables.literal.colegiado", width: "20%" },
      { field: "nombreFac", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.facturacion", width: "20%" },
      { field: "importeOficio", header: "menu.justiciaGratuita.Turnos", width: "10%" },
      { field: "importeGuardia", header: "menu.justiciaGratuita.guardia.guardias", width: "10%" },
      { field: "importeEjg", header: "justiciaGratuita.ejg.datosGenerales.EJG", width: "10%" },
      { field: "importeSoj", header: "censo.busquedaClientes.noResidente", width: "10%" },
      { field: "importeTotal", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.total", width: "10%" }

    ];   
  }

  getColsPago() {

    this.cols = [
      { field: "ncolegiado", header: "censo.resultadosSolicitudesModificacion.literal.nColegiado", width: "10%" },
      { field: "nombreCol", header: "justiciaGratuita.justiciables.literal.colegiado", width: "15%" },
      { field: "nombrePago", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.pago", width: "20%" },
      { field: "totalImportesjcs", header: "menu.justiciaGratuita", width: "8%" },
      { field: "importeTotalMovimientos", header: "menu.facturacionSJCS.mantenimientoMovimientos", width: "5%" },
      { field: "totalImporteBruto", header: "facturacionSJCS.facturacionesYPagos.literal.bruto", width: "8%" },
      { field: "totalImporteIrpf", header: "facturacionSJCS.facturacionesYPagos.literal.irpf", width: "5%" },
      { field: "importeTotalRetenciones", header: "facturacionSJCS.facturacionesYPagos.literal.retenciones", width: "8%" },
      { field: "importeTotal", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.total", width: "5%" },
      { field: "nombreDest", header: "informesycomunicaciones.comunicaciones.fichaRegistroComunicacion.destinatarios.singular", width: "15%" }

    ];

  }
  
  clear() {
    this.msgs = [];
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
      this.numSelected = 0;
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onChangeSelectAll() {
		if (this.permisoEscritura) {
			if (this.selectAll === true) {
				this.selectMultiple = false;
				this.selectedDatos = this.datos;
				this.numSelected = this.datos.length;
				
			} else {
				this.selectedDatos = [];
				this.numSelected = 0;
			}

		}
  }
  
  actualizaSeleccionados(selectedDatos) {
		this.numSelected = selectedDatos.length;
  }
  
  checkPermisosComunicar() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.comunicar();
    }
  }

  comunicar(){

  }

}
