import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable, Message } from 'primeng/primeng';
import { FicherosDevolucionesItem } from '../../../../../models/FicherosDevolucionesItem';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-tabla-ficheros-devoluciones',
  templateUrl: './tabla-ficheros-devoluciones.component.html',
  styleUrls: ['./tabla-ficheros-devoluciones.component.scss']
})
export class TablaFicherosDevolucionesComponent implements OnInit, OnChanges {
  
  msgs: Message[] = [];
  progressSpinner: boolean = false;
  permisoEscritura: boolean = true;

  //Resultados de la busqueda
  @Input() datos: FicherosDevolucionesItem[];
  @Input() filtro;
  @Output() busqueda = new EventEmitter<boolean>();

  // Elementos para la tabla
  @ViewChild("table") table: DataTable;
  rowsPerPage = [];
  selectedItem: number = 10;
  selectedDatos = [];
  cols = [];
  buscadores = [];
  selectAll: boolean;
  selectMultiple: boolean;

  constructor(
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    this.getCols();
  }

  // Se actualiza cada vez que cambien los inputs
  ngOnChanges() {
    this.selectedDatos = [];
  }

  // Definición de las columnas
  getCols() {
    this.cols = [
      { field: "idDisqueteDevoluciones", header: "justiciaGratuita.oficio.designas.interesados.identificador", width: "10%" },
      { field: "fechaCreacion", header: "informesycomunicaciones.enviosMasivos.fechaCreacion", width: "10%" },
      { field: "cuentaEntidad", header: "facturacion.seriesFactura.bancoEntidad", width: "60%" },
      { field: "numRecibos", header: "facturacionPyS.ficherosAdeudos.numRecibos", width: "10%" }, 
      { field: "facturacion", header: "facturacionSJCS.facturacionesYPagos.importeTotal", width: "10%" }
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

  confirmDescargar(){
    
  }

  // Abrir ficha de fichero de devoluciones
  openTab(dato) {

    sessionStorage.setItem("FicherosDevolucionesItem", JSON.stringify(dato));
    this.persistenceService.setFiltros(this.filtro);

    this.router.navigate(["/fichaFicherosDevoluciones"]);
  }

  // Resultados por página
  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  // Checkbox de seleccionar todo
  onChangeSelectAll(): void {
      if (this.selectAll) {
        this.selectMultiple = true;
        this.selectedDatos = this.datos;
      } else {
        this.selectedDatos = [];
        this.selectMultiple = false;
      }
  }

  // FUnciones de utilidad

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
