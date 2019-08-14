import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, Output, EventEmitter, AfterContentInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { findIndex } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ZonasObject } from '../../../../../models/sjcs/ZonasObject';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-tabla-gestion-zonas',
  templateUrl: './tabla-gestion-zonas.component.html',
  styleUrls: ['./tabla-gestion-zonas.component.scss']
})
export class TablaGestionZonasComponent implements OnInit {


  rowsPerPage: any = [];
  colsZona;
  colsPartidoJudicial;
  msgs;

  selectedItemZona: number = 10;
  selectAllZona;
  selectedDatosZona = [];
  numSelectedZona = 0;
  selectMultipleZona: boolean = false;
  seleccionZonas: boolean = false;
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

  @ViewChild("tablaZonas") tablaZonas;

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {

    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
  }

  openZonegroupTab(selectedDatos) {

    if (!this.selectAllZona && !this.selectMultipleZona) {
      this.router.navigate(["/fichaGrupoZonas"], { queryParams: { idZona: this.selectedDatosZona[0].idzona } });
    }

  }

  delete() {

    let zonasDelete = new ZonasObject();
    zonasDelete.zonasItems = this.selectedDatosZona
    this.sigaServices.post("fichaZonas_deleteGroupZones", zonasDelete).subscribe(
      data => {

        this.selectedDatosZona = [];
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
    zonasActivate.zonasItems = this.selectedDatosZona
    this.sigaServices.post("fichaZonas_activateGroupZones", zonasActivate).subscribe(
      data => {

        this.selectedDatosZona = [];
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
    this.searchZonasSend.emit(this.historico);

  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {

    this.colsZona = [
      { field: "descripcionzona", header: "Grupo Zona" },
      { field: "descripcionsubzona", header: "Zona" },
      { field: "descripcionpartido", header: "Partidos Judiciales" }
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
    this.selectedItemZona = event.value;
    this.changeDetectorRef.detectChanges();
    this.tablaZonas.reset();
  }

  onChangeSelectAllZonas() {
    if (this.selectAllZona) {
      this.selectMultipleZona = true;
      this.selectedDatosZona = this.datos;
      this.numSelectedZona = this.datos.length;
    } else {
      this.selectedDatosZona = [];
      this.numSelectedZona = 0;
      this.selectMultipleZona = false;
    }
  }

  isSelectMultipleZona() {
    this.selectMultipleZona = !this.selectMultipleZona;
    if (!this.selectMultipleZona) {
      this.selectedDatosZona = [];
      this.numSelectedZona = 0;
    } else {
      // this.pressNew = false;
      this.selectAllZona = false;
      this.selectedDatosZona = [];
      this.numSelectedZona = 0;
    }
    // this.volver();
  }


  actualizaSeleccionados(selectedDatos) {
    this.numSelectedZona = selectedDatos.length;
    this.seleccionZonas = false;
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
