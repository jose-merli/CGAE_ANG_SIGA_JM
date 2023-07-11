import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '../../../../../node_modules/@angular/router';
import { DataTable } from '../../../../../node_modules/primeng/primeng';
import { PersistenceService } from '../../../_services/persistence.service';
import { SigaServices } from '../../../_services/siga.service';
import { TranslateService } from '../../translate';

@Component({
  selector: 'app-tabla-buscador-procurador',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss']
})
export class TablaBuscadorProcuradorComponent implements OnInit {
  rowsPerPage: any = [];
  cols;
  msgs;

  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;

  message;

  initDatos;
  nuevo: boolean = false;
  progressSpinner: boolean = false;
  permisoEscritura: boolean = false;
  @Input() datos;

  @ViewChild("table") table: DataTable;

  @Output() searchHistoricalSend = new EventEmitter<boolean>();

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));

    if (this.persistenceService.getHistorico() != undefined) {
      this.historico = this.persistenceService.getHistorico();
    }
  }

  actualizaSeleccionados(selectedDatos) {

  }

  getCols() {
    this.cols = [
      { field: "nifCif", header: "administracion.usuarios.literal.NIFCIF" },
      { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre" },
      { field: "nombreApe", header: "gratuita.mantenimientoTablasMaestra.literal.apellidos" },
      { field: "idInstitucion", header: "censo.busquedaClientesAvanzada.literal.colegio" },
      { field: "nColegiado", header: "censo.resultadoDuplicados.numeroColegiado" },
      { field: "estadoColegial", header: "menu.justiciaGratuita.componentes.estadoColegial" },
      { field: "residencia", header: "censo.busquedaClientes.noResidente" },

    ];

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

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  openTab() { }

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
