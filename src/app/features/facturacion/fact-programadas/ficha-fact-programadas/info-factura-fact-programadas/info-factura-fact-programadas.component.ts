import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/message';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { FacFacturacionprogramadaItem } from '../../../../../models/FacFacturacionprogramadaItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-info-factura-fact-programadas',
  templateUrl: './info-factura-fact-programadas.component.html',
  styleUrls: ['./info-factura-fact-programadas.component.scss']
})
export class InfoFacturaFactProgramadasComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  @Input() modoEdicion: boolean;
  @Input() openTarjetaInfoFactura;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<FacFacturacionprogramadaItem>();

  @Input() bodyInicial: FacFacturacionprogramadaItem;

  resaltadoDatos: boolean = false;

  // Elementos para la tabla
  @ViewChild("table") table: DataTable;
  rowsPerPage = [];
  selectedItem: number = 10;
  selectedDatos = [];
  cols = [];
  buscadores = [];
  selectAll: boolean;
  selectMultiple: boolean;
  datos: any[] = [];

  constructor(
    private commonsService: CommonsService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private persistenceService: PersistenceService
  ) { }

  ngOnInit() {
    this.getCols();
  }

  // Definición de las columnas
  getCols() {
    this.cols = [
      { field: "momento", header: "facturacion.factProgramadas.serieFactu.momento", width: "20%" },
      { field: "descripcion", header: "general.description", width: "30%" },
      { field: "numFacturas", header: "facturacion.factProgramadas.serieFactu.numFactu", width: "30%" },
      { field: "total", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.total", width: "10%" }, 
      { field: "totalPendiente", header: "facturacion.factProgramadas.serieFactu.totalPendiente", width: "10%" }
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

  // ENlace al buscador de facturas
  navigateToFacturas() {
    let filtros = { facturacion: this.bodyInicial.idProgramacion };
    this.persistenceService.setFiltros(filtros);
    sessionStorage.setItem("volver", JSON.stringify(true));

    this.router.navigate(["/facturas"]);
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

  // Estilo obligatorio
  styleObligatorio(evento: string) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaInfoFactura;
  }

  abreCierraFicha(key): void {
    this.openTarjetaInfoFactura = !this.openTarjetaInfoFactura;
    this.opened.emit(this.openTarjetaInfoFactura);
    this.idOpened.emit(key);
  }

  // Mensajes en pantalla

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
