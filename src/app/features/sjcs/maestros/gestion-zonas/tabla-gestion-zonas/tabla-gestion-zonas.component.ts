import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, Output, EventEmitter, AfterContentInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { findIndex } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ZonasObject } from '../../../../../models/sjcs/ZonasObject';
import { SigaServices } from '../../../../../_services/siga.service';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../_services/commons.service';

@Component({
  selector: 'app-tabla-gestion-zonas',
  templateUrl: './tabla-gestion-zonas.component.html',
  styleUrls: ['./tabla-gestion-zonas.component.scss']
})
export class TablaGestionZonasComponent implements OnInit {


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
  permisoEscritura: boolean = false;

  initDatos;
  nuevo: boolean = false;
  progressSpinner: boolean = false;

  //Resultados de la busqueda
  @Input() datos;
  //Combo partidos judiciales
  @Input() comboPJ;

  @Output() searchZonasSend = new EventEmitter<boolean>();
  buscadores = []
  @ViewChild("table") table;

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService
  ) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    if (this.persistenceService.getHistorico() != undefined) {
      this.historico = this.persistenceService.getHistorico();
    }

    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
  }

  openZonegroupTab(evento) {

    if (!this.selectAll && !this.selectMultiple) {
      this.persistenceService.setHistorico(this.historico);
      this.router.navigate(["/fichaGrupoZonas"], { queryParams: { idZona: this.selectedDatos[0].idzona } });
    } else {

      if (evento.data.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }

    }
  }

  checkPermisosDelete(selectedDatos) {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (!this.permisoEscritura || ((!this.selectMultiple || !this.selectAll) && this.selectedDatos.length == 0)) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.confirmDelete(selectedDatos);
      }

    }
  }


  confirmDelete(selectedDatos) {
    let mess = this.translateService.instant(
      "messages.deleteConfirmation"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.delete(selectedDatos)
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancel",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  delete(selectedDatos) {

    let zonasDelete = new ZonasObject();
    zonasDelete.zonasItems = this.selectedDatos
    this.sigaServices.post("fichaZonas_deleteGroupZones", zonasDelete).subscribe(
      data => {

        this.selectedDatos = [];
        this.searchZonasSend.emit(false);
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
    let zonasActivate = new ZonasObject();
    zonasActivate.zonasItems = this.selectedDatos
    this.sigaServices.post("fichaZonas_activateGroupZones", zonasActivate).subscribe(
      data => {
        this.historico = false;
        this.persistenceService.setHistorico(this.historico);
        this.selectedDatos = [];
        this.searchZonasSend.emit(true);
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

  searchZonas() {
    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    this.searchZonasSend.emit(this.historico);

  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {

    this.cols = [
      { field: "descripcionzona", header: "justiciaGratuita.maestros.zonasYSubzonas.grupoZona.cabecera" },
      { field: "descripcionsubzona", header: "justiciaGratuita.maestros.zonasYSubzonas.zona" },
      { field: "descripcionpartido", header: "agenda.fichaEvento.tarjetaGenerales.partidoJudicial" }
    ];
    this.cols.forEach(element => this.buscadores.push(""));
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

  isSelectMultiple() {
    if (this.permisoEscritura) {
      this.selectAll = false;
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
