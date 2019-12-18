import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DataTable } from '../../../../../../../../node_modules/primeng/primeng';
import { TranslateService } from '../../../../../../commons/translate';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { EventoObject } from '../../../../../../models/EventoObject';
import { CommonsService } from '../../../../../../_services/commons.service';

@Component({
  selector: 'app-tabla-calendario-agenda-laboral',
  templateUrl: './tabla-calendario-agenda-laboral.component.html',
  styleUrls: ['./tabla-calendario-agenda-laboral.component.scss']
})
export class TablaCalendarioAgendaLaboralComponent implements OnInit {

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
  institucionActual;
  message;
  buscadores = []
  initDatos;
  nuevo: boolean = false;
  progressSpinner: boolean = false;
  permisoEscritura: boolean = false;

  //Resultados de la busqueda
  @Input() datos;

  @ViewChild("table") table: DataTable;

  @Output() searchHistoricalSend = new EventEmitter<boolean>();


  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService
  ) { }

  ngOnInit() {

    sessionStorage.removeItem("calendarioLaboralAgenda");

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));

    if (this.persistenceService.getHistorico() != undefined) {
      this.historico = this.persistenceService.getHistorico();
    }
    this.getInstitucion();
  }

  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
    });

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

  openTab(evento) {


    if (!this.selectAll && !this.selectMultiple) {
      this.progressSpinner = true;
      this.persistenceService.setDatos(evento.data);
      sessionStorage.setItem("calendarioLaboralAgenda", "true");
      this.router.navigate(["/fichaEventos"]);
    } else {

      if (evento.data.fechaBaja == undefined && this.historico) {
        this.selectedDatos.pop();
      } else if (this.institucionActual == "2000") {
        if (evento.data.title == 'Fiesta Autonómica') {
          this.selectedDatos.pop();
        }
      } else {
        if (evento.data.title == 'Fiesta Autonómica' || evento.data.title == 'Fiesta Nacional') {
          this.selectedDatos.pop();
        }
      }

    }
  }

  checkPermisosDelete() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (!this.permisoEscritura || ((!this.selectMultiple || !this.selectAll) && this.selectedDatos.length == 0)) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.delete();
      }
    }
  }

  delete() {

    let eventoDelete = new EventoObject();
    eventoDelete.eventos = this.selectedDatos;
    this.sigaServices.post("calendarioLaboralAgenda_deleteFestivos", eventoDelete).subscribe(

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

  checkPermisosActivate() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (!this.permisoEscritura || ((!this.selectMultiple || !this.selectAll) && this.selectedDatos.length == 0)) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.activate();
      }
    }
  }

  activate() {
    let eventoActivate = new EventoObject();
    eventoActivate.eventos = this.selectedDatos;
    this.sigaServices.post("calendarioLaboralAgenda_activateFestivos", eventoActivate).subscribe(
      data => {

        this.selectedDatos = [];
        this.searchHistoricalSend.emit(true);
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



  setItalic(dato) {
    if (dato.fechaBaja == null) return false;
    else return true;
  }

  getCols() {

    this.cols = [
      { field: "start", header: "censo.resultadosSolicitudesModificacion.literal.fecha" },
      { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre" },
      { field: "fiestaLocalPartido", header: "justiciaGratuita.maestros.calendarioLaboralAgenda.fiestaLocalPartidoJudicial" }
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

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSelectAll() {
    if (this.selectAll) {
      if (this.institucionActual == "2000") {
        if (this.historico) {
          this.selectedDatos = this.datos.filter(dato => (dato.fechaBaja != undefined && dato.fechaBaja != null) && dato.title != 'Fiesta Autonómica');
        } else {
          this.selectedDatos = this.datos.filter(dato => dato.title != 'Fiesta Autonómica');
        }
      } else {
        if (this.historico) {
          this.selectedDatos = this.datos.filter(dato => (dato.fechaBaja != undefined && dato.fechaBaja != null && dato.title != 'Fiesta Autonómica' && dato.title != 'Fiesta Nacional'));
        } else {

          this.selectedDatos = this.datos.filter(dato => dato.title != 'Fiesta Autonómica' && dato.title != 'Fiesta Nacional');
        }
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

  isSelectMultiple() {
    if (this.permisoEscritura) {

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
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
    this.seleccion = false;
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
