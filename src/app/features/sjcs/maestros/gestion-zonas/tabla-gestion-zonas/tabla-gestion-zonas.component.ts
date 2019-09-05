import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, Output, EventEmitter, AfterContentInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { findIndex } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ZonasObject } from '../../../../../models/sjcs/ZonasObject';
import { SigaServices } from '../../../../../_services/siga.service';
import { DataTable } from 'primeng/primeng';
import { PersistenceService } from '../../../../../_services/persistence.service';

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

  initDatos;
  nuevo: boolean = false;
  progressSpinner: boolean = false;

  //Resultados de la busqueda
  @Input() datos;
  //Combo partidos judiciales
  @Input() comboPJ;

  @Output() searchZonasSend = new EventEmitter<boolean>();

  @ViewChild("table") table: DataTable;

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService
  ) { }

  ngOnInit() {


    if (this.persistenceService.historico != undefined) {
      this.historico = this.persistenceService.historico;
    }

    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
  }

  openZonegroupTab(evento) {

    if (!this.selectAll && !this.selectMultiple) {
      this.persistenceService.historico = this.historico;
      this.router.navigate(["/fichaGrupoZonas"], { queryParams: { idZona: this.selectedDatos[0].idzona } });
    } else {

      if (evento.data.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }

    }
  }

  delete() {

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
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
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
    let zonasActivate = new ZonasObject();
    zonasActivate.zonasItems = this.selectedDatos
    this.sigaServices.post("fichaZonas_activateGroupZones", zonasActivate).subscribe(
      data => {

        this.selectedDatos = [];
        this.searchZonasSend.emit(true);
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {

        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
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
    this.persistenceService.historico = this.historico;
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
      this.selectMultiple = true;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectMultiple = false;
    }
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
      this.numSelected = 0;
    } else {
      // this.pressNew = false;
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
    // this.volver();
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
