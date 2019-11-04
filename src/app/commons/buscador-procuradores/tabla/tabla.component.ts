import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DataTable } from '../../../../../node_modules/primeng/primeng';
import { TranslateService } from '../../translate';
import { Router } from '../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../_services/siga.service';
import { PersistenceService } from '../../../_services/persistence.service';
import { ProcuradoresItem } from '../../../models/sjcs/ProcuradoresItem';
import { ProcuradoresObject } from '../../../models/sjcs/ProcuradoresObject';

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
    this.numSelected = selectedDatos.length;
    this.seleccion = false;
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



  delete() {

    let procuradorDelete = new ProcuradoresObject();
    procuradorDelete.procuradorItems = this.selectedDatos;
    this.sigaServices.post("busquedaComisarias_deleteComisarias", procuradorDelete).subscribe(

      data => {

        this.selectedDatos = [];
        this.searchHistoricalSend.emit(false);
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {

        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  openTab(evento) {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    if (!this.selectAll && !this.selectMultiple) {
      // this.progressSpinner = true;
      // this.persistenceService.setDatos(evento.data);
      // this.router.navigate(["/gestionComisarias"]);
    } else {

      if (evento.data.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }

    }
  }

  onChangeSelectAll() {
    if (this.selectAll) {

      if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null);
      } else {
        this.selectedDatos = this.datos;
      }

      if (this.selectedDatos != undefined && this.selectedDatos.length > 0) {
        this.selectMultiple = true;
        this.numSelected = this.selectedDatos.length;
      }

    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectMultiple = false;
    }

  }

  searchHistorical() {

    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    this.searchHistoricalSend.emit(this.historico);
    this.selectAll = false
    if (this.selectMultiple) {
      this.selectMultiple = false;
    }

  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  isSelectMultiple() {
    if (this.permisoEscritura) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectAll = false;

      } else {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
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

  clear() {
    this.msgs = [];
  }
}
