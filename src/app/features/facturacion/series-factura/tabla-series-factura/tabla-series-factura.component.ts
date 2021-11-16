import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-tabla-series-factura',
  templateUrl: './tabla-series-factura.component.html',
  styleUrls: ['./tabla-series-factura.component.scss']
})
export class TablaSeriesFacturaComponent implements OnInit {

  //Resultados de la busqueda
  @Input() datos;
  
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
  message;
  progressSpinner: boolean = false;

  datosMostrados: SerieFacturacionItem[];

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private confirmationService: ConfirmationService,
    private persistenceService: PersistenceService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    this.selectedDatos = [];

    this.getCols();
  }

  // Se actualiza cada vez que cambien los inputs
  ngOnChanges() {
    this.selectedDatos = [];
    this.filterDatosByHistorico();
  }

  getCols() {
    this.cols = [
      { field: "abreviatura", header: "gratuita.definirTurnosIndex.literal.abreviatura", width: "10%" },
      { field: "descripcion", header: "enviosMasivos.literal.descripcion", width: "20%" },
      { field: "cuentaBancaria", header: "facturacion.seriesFactura.cuentaBancaria", width: "10%" },
      { field: "sufijo", header: "administracion.parametrosGenerales.literal.sufijo", width: "15%" },
      { field: "tiposIncluidos", header: "facturacion.seriesFactura.tipoProductos", width: "25%" },
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

  // Muestra solo el primer tipo incluido
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
    return dato.fechaBaja != undefined && dato.fechaBaja != null;
  }

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
      this.datosMostrados = this.datos.filter((dato) => this.isHistorico(dato));
    else
      this.datosMostrados = this.datos.filter((dato) => !this.isHistorico(dato));
  }

  selectFila(event) {
    this.selectAll = this.datosMostrados.length == this.selectedDatos.length;
  }

  unselectFila(event) {
    this.selectAll = false;
    if (this.selectMultiple) {
      this.selectMultiple = false;
    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSelectAll(): void {
    if (this.permisoEscritura) {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datosMostrados;
          this.numSelected = this.datosMostrados.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
    }
  }

  // Eliminar series de facturación

  confirmEliminar(): void {
    let mess = "Se va a proceder a dar de baja las series de facturación seleccionadas ¿Desea continuar?";
    let icon = "fa fa-eraser";

    this.confirmationService.confirm({
      //key: "asoc",
      message: mess,
      icon: icon,
      accept: () => {
        this.progressSpinner = true;
        this.eliminar();
      },
      reject: () => {
        this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
      }
    });
  }

  eliminar(): void {
    this.sigaServices.post("facturacionPyS_eliminaSerieFacturacion", this.selectedDatos).subscribe(
      data => {
        this.busqueda.emit();
        this.showMessage("success", "Eliminar", "Las series de facturación han sido dadas de baja con exito.");
        this.progressSpinner = false;
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      }
    );
  }

  // Reactivar series de facturación

  confirmReactivar(): void {
    let mess = "Se va a proceder a reactivar las series de facturación seleccionadas ¿Desea continuar?";
    let icon = "fa fa-eraser";

    this.confirmationService.confirm({
      //key: "asoc",
      message: mess,
      icon: icon,
      accept: () => {
        this.progressSpinner = true;
        this.reactivar();
      },
      reject: () => {
        this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
      }
    });
  }

  reactivar(): void {
    this.sigaServices.post("facturacionPyS_reactivarSerieFacturacion", this.selectedDatos).subscribe(
      data => {
        this.busqueda.emit();
        this.showMessage("success", "Reactivar", "Las series de facturación han sido reactivadas con éxito.");
        this.progressSpinner = false;
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      }
    );
  }

  // Abrir ficha de serie facturación
  openTab(selectedRow) {
    let serieFacturacionItem: SerieFacturacionItem = selectedRow;
    sessionStorage.setItem("serieFacturacionItem", JSON.stringify(serieFacturacionItem));
    this.router.navigate(["/datosSeriesFactura"]);
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

  clear() {
    this.msgs = [];
  }
  
}
