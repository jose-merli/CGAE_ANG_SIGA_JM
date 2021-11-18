import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable, Message } from 'primeng/primeng';
import { FacFacturacionprogramadaItem } from '../../../../models/FacFacturacionprogramadaItem';
import { SerieFacturacionItem } from '../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';

@Component({
  selector: 'app-tabla-facturaciones',
  templateUrl: './tabla-facturaciones.component.html',
  styleUrls: ['./tabla-facturaciones.component.scss']
})
export class TablaFacturacionesComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  permisoEscritura: boolean = false;

  //Resultados de la busqueda
  @Input() datos: FacFacturacionprogramadaItem[];
  
  @Output() busqueda = new EventEmitter<boolean>();

  datosMostrados: FacFacturacionprogramadaItem[];
  historico: boolean;

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
    private commonsService: CommonsService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private persistenceService: PersistenceService
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
    this.filterDatosByHistorico();
  }

  // Definición de las columnas
  getCols() {
    this.cols = [
      { field: "nombreAbreviado", header: "Serie Facturación", width: "5%" },
      { field: "descripcion", header: "enviosMasivos.literal.descripcion", width: "20%" },
      { field: "compraSuscripcion", header: "Compras / Suscripción", width: "10%" },
      { field: "desde", header: "Desde", width: "10%" },
      { field: "hasta", header: "Hasta", width: "10%" },
      { field: "fechaPrevistaGeneracion", header: "Fecha prevista generación", width: "10%" },
      { field: "fechaConfirmacion", header: "Fecha confirmación", width: "10%" },
      { field: "importe", header: "Importe total", width: "5%" },
      { field: "estado", header: "Estado", width: "20%" }
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
        this.selectedDatos = this.datosMostrados;
      } else {
        this.selectedDatos = [];
        this.selectMultiple = false;
      }
  }

  // Botón de ocultar o mostrar histórico
  toggleHistorico(): void {
    this.historico = !this.historico;

    this.filterDatosByHistorico();

    this.selectedDatos = [];
    this.table.reset();
    this.selectAll = false;
    if (this.selectMultiple) {
      this.selectMultiple = false;
    }

    setTimeout(() => {
      this.commonsService.scrollTablaFoco('tablaFoco');
      this.commonsService.scrollTop();
    }, 5);
  }

  // Mostrar u ocultar histórico
  filterDatosByHistorico(): void {
    if (this.historico)
      this.datosMostrados = this.datos.filter(dato => dato.archivarFact == "1");
    else
      this.datosMostrados = this.datos.filter(dato => dato.archivarFact == "0");
  }

  // Abrir ficha de serie facturación
  openTab(selectedRow) {
    let facturacionProgramadaItem: FacFacturacionprogramadaItem = selectedRow;
    sessionStorage.setItem("facturacionProgramadaItem", JSON.stringify(facturacionProgramadaItem));
    this.router.navigate(["/fichaFactProgramadas"]);
  }

  calcBadgeEstado(idEstado: string): string {
    return "success";
  }

  confirmEliminar(): void {

  }

  confirmArchivar(): void {

  }

  confirmDesarchivar(): void {

  }

}
