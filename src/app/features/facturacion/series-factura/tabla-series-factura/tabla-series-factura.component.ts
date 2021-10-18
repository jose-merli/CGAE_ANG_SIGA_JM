import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../models/SeriesFacturacionItem';
import { PersistenceService } from '../../../../_services/persistence.service';

@Component({
  selector: 'app-tabla-series-factura',
  templateUrl: './tabla-series-factura.component.html',
  styleUrls: ['./tabla-series-factura.component.scss']
})
export class TablaSeriesFacturaComponent implements OnInit {

  //Resultados de la busqueda
  @Input() datos;
  
  @Output() searchHistoricalSend = new EventEmitter<boolean>();
  @Output() busqueda = new EventEmitter<boolean>();

  @ViewChild("table") table: DataTable;

  cols;
  msgs;

  rowsPerPage = [];
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  selectDatos: SerieFacturacionItem = new SerieFacturacionItem();
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;
  permisoEscritura: boolean = false;
  buscadores = [];
  initDatos;
  message;
  progressSpinner: boolean = false;

  constructor(
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    this.selectedDatos = [];

    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));

    if (this.persistenceService.getHistorico() != undefined) {
      this.historico = this.persistenceService.getHistorico();
    }
  }

  getCols() {
    this.cols = [
      { field: "abreviatura", header: "gratuita.definirTurnosIndex.literal.abreviatura", width: "10%" },
      { field: "descripcion", header: "enviosMasivos.literal.descripcion", width: "20%" },
      { field: "cuentaBancaria", header: "facturacion.seriesFactura.cuentaBancaria", width: "15%" },
      { field: "sufijo", header: "administracion.parametrosGenerales.literal.sufijo", width: "10%" },
      { field: "tiposIncluidos", header: "facturacion.seriesFactura.tipoProductos", width: "20%" },
      { field: "fasesAutomaticas", header: "facturacion.seriesFactura.fasesAutomaticas", width: "20%" }
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

  collapseTiposIncluidos(tiposIncluidos: string[]): string {
    let res = "";

    if (tiposIncluidos.length != 0) {
      res = tiposIncluidos[0];
    }

    if (tiposIncluidos.length > 1) {
      res += "... y " + (tiposIncluidos.length - 1).toString() + " más";
    }

    return res;
  }

  isHistorico(dato): boolean {
    return dato['fechaBaja'] != undefined && dato['fechaBaja'] == null;
  }

  toggleHistorico(): void {
    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    this.busqueda.emit(this.historico);

    this.selectAll = false;
    if (this.selectMultiple) {
      this.selectMultiple = false;
    }
  }

  clickFila(event) {
    console.log(event);
    if (event.data && this.historico && !event.data.fechaBaja) {
      this.selectedDatos.pop();
    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSelectAll(): void {
    if (this.permisoEscritura) {
      if (!this.historico) {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datos;
          this.numSelected = this.datos.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      } else {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datos.filter((dato) => dato.fechaBaja != undefined && dato.fechaBaja != null);
          this.numSelected = this.selectedDatos.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      }
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

  checkPermisos() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
      return false;
    } else {
      return true;
    }
  }

  clear() { }
  
}
