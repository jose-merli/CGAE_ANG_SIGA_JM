import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable } from 'primeng/primeng';
import { PersistenceService } from '../../../../_services/persistence.service';

@Component({
  selector: 'app-tabla-facturas',
  templateUrl: './tabla-facturas.component.html',
  styleUrls: ['./tabla-facturas.component.scss']
})
export class TablaFacturasComponent implements OnInit {

  cols;
  msgs;

  selectedDatos = [];
  rowsPerPage = [];
  buscadores = [];

  selectedItem: number = 10;
  numSelected = 0;

  selectMultiple: boolean = false;
  selectAll: boolean = false;
  historico: boolean = false;
  permisoEscritura: boolean = false;
  progressSpinner: boolean = false;

  @Input() datos;
  @Input() filtro;

  // de donde viene este child??
  @ViewChild("table") table: DataTable;

  constructor(private changeDetectorRef: ChangeDetectorRef, 
    private router: Router, 
    private persistenceService: PersistenceService) { }

  ngOnInit() {

    this.selectedDatos = [];
    this.selectAll = false;

    this.getCols();
  }

  /*
  navigateTo(dato){
    sessionStorage.setItem("FicherosAbonosItem", JSON.stringify(dato));
    this.persistenceService.setFiltros(this.filtro);

    this.router.navigate(['/gestionFicherosTransferencias']);
  }
  */

getCols() {
  this.cols = [
    { field: "numeroFactura", header: "facturacion.productos.nFactura", width: "9%" }, 
    { field: "fechaEmision", header: "facturacion.facturas.fechaEmision'", width: "9%" }, 
    { field: "facturacion", header: "menu.facturacion", width: "15%" }, 
    { field: "numeroColegiado", header: "facturacion.facturas.numeroColegiadoIdentificador", width: "9%" }, 
    { field: "idCiente", header: "facturacion.productos.Cliente", width: "15%" }, 
    { field: "importefacturado", header: "facturacion.facturas.importeTotal", width: "9%" }, 
    { field: "importeAdeudadoPendiente", header: "facturacion.facturas.importePendiente", width: "9%" }, 
    { field: "estado", header: "censo.nuevaSolicitud.estado", width: "9%" }, 
    { field: "comunicacionesFacturas", header: "facturacion.facturas.comunicacionCorto", width: "7%" }, 
    { field: "ultimaComunicacion", header: "facturacion.facturas.ultimaComunicacion", width: "9%" }, 
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

selectFila(event) {
  this.numSelected = event.length;
}

unselectFila(event) {
  this.selectAll = false;
  this.numSelected = event.length;
}

onChangeRowsPerPages(event) {
  this.selectedItem = event.value;
  this.changeDetectorRef.detectChanges();
  this.table.reset();
}

onChangeSelectAll() {
  if (this.selectAll) {
    this.selectMultiple = false;
    this.selectedDatos = this.datos;
    this.numSelected = this.datos.length;
  } else {
    this.selectedDatos = [];
    this.numSelected = 0;
    this.selectMultiple = true;
  }
}

}
