import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { JusticiableObject } from '../../../../../models/sjcs/JusticiableObject';
import { DataTable } from 'primeng/primeng';
import { Router } from '@angular/router';
import { JusticiableBusquedaObject } from '../../../../../models/sjcs/JusticiableBusquedaObject';

@Component({
  selector: 'app-tabla-justiciables',
  templateUrl: './tabla-justiciables.component.html',
  styleUrls: ['./tabla-justiciables.component.scss']
})
export class TablaJusticiablesComponent implements OnInit {

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
    private persistenceService: PersistenceService
  ) { }

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


    // if (!this.selectAll && !this.selectMultiple) {
    //   this.progressSpinner = true;
    //   this.persistenceService.setDatos(evento.data);
    //   sessionStorage.setItem("calendarioLaboralAgenda", "true");
    //   this.router.navigate(["/fichaEventos"]);
    // } else {

    //   if (evento.data.fechaBaja == undefined && this.historico) {
    //     this.selectedDatos.pop();
    //   } else if (this.institucionActual == "2000") {
    //     if (evento.data.title == 'Fiesta Autonómica') {
    //       this.selectedDatos.pop();
    //     }
    //   } else {
    //     if (evento.data.title == 'Fiesta Autonómica' || evento.data.title == 'Fiesta Nacional') {
    //       this.selectedDatos.pop();
    //     }
    //   }

    // }
  }

  delete() {

    let justiciablesDelete = new JusticiableBusquedaObject();
    justiciablesDelete.justiciableBusquedaItems = this.selectedDatos;
    this.sigaServices.post("calendarioLaboralAgenda_deleteFestivos", justiciablesDelete).subscribe(

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

  activate() {
    let justiciablesActivate = new JusticiableBusquedaObject();
    justiciablesActivate.justiciableBusquedaItems = this.selectedDatos;
    this.sigaServices.post("calendarioLaboralAgenda_activateFestivos", justiciablesActivate).subscribe(
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
      { field: "nif", header: "Identificador" },
      { field: "nombre", header: "Apellidos, Nombre" },
      { field: "fechaModificacion", header: "Fecha Modificación" },
      { field: "asuntos", header: "Asuntos" },
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

  onChangeSelectAll() {
    // if (this.selectAll) {

    //   if (this.historico) {
    //     this.selectedDatos = this.datos.filter(dato => (dato.fechaBaja != undefined && dato.fechaBaja != null) || dato.title == 'Fiesta Autonómica');
    //   } else {
    //     this.selectedDatos = this.datos.filter(dato => dato.title != 'Fiesta Autonómica');
    //   }

    //   if (this.selectedDatos != undefined && this.selectedDatos.length > 0) {
    //     this.selectMultiple = true;
    //     this.numSelected = this.selectedDatos.length;
    //   }

    // } else {
    //   this.selectedDatos = [];
    //   this.numSelected = 0;
    //   this.selectMultiple = false;
    // }

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
