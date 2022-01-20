import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { FicherosAdeudosItem } from '../../../../models/sjcs/FicherosAdeudosItem';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-tabla-adeudos',
  templateUrl: './tabla-adeudos.component.html',
  styleUrls: ['./tabla-adeudos.component.scss']
})
export class TablaAdeudosComponent implements OnInit {
  cols;
  msgs;

  selectedDatos = [] ;
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

  @ViewChild("table") table: DataTable;

  constructor( private changeDetectorRef: ChangeDetectorRef, private router: Router, private persistenceService: PersistenceService) { }

  ngOnInit() {
    this.selectedDatos = [];
    this.selectAll = false;

    this.getCols();
  }

  navigateTo(dato){
    sessionStorage.setItem("FicherosAdeudosItem", JSON.stringify(dato));
    this.persistenceService.setFiltros(this.filtro);

    this.router.navigate(['/gestionAdeudos']);
  }
  
  descargarFicheroAdeudo(){

  }
  
  getCols() {
    this.cols = [
      { field: "idDisqueteCargos", header: "administracion.grupos.literal.id", width: "5%" },
      { field: "fechaCreacion", header: "informesycomunicaciones.comunicaciones.busqueda.fechaCreacion", width: "10%" },
      { field: "nombreabreviado", header: "facturacionPyS.ficherosAdeudos.serie", width: "20%" },
      { field: "descripcion", header: "menu.facturacion", width: "20%" },
      { field: "cuentaEntidad", header: "facturacion.seriesFactura.cuentaBancaria", width: "15%" },
      { field: "sufijo", header: "administracion.parametrosGenerales.literal.sufijo", width: "10%" },
      { field: "numRecibos", header: 'facturacionPyS.ficherosAdeudos.numRecibos', width: "10%" },
      { field: "totalRemesa", header: "facturacionSJCS.facturacionesYPagos.importeTotal", width: "10%" },
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

  clear() {
    this.msgs = [];
  }
}
