import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, Output, EventEmitter, AfterContentInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { findIndex } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AreasObject } from '../../../../../models/sjcs/AreasObject';
import { SigaServices } from '../../../../../_services/siga.service';
import { TableModule } from 'primeng/table';
import { PersistenceService } from '../../../../../_services/persistence.service';


@Component({
  selector: 'app-tabla-busqueda-areas',
  templateUrl: './tabla-busqueda-areas.component.html',
  styleUrls: ['./tabla-busqueda-areas.component.scss']
})
export class TablaBusquedaAreasComponent implements OnInit {


  rowsPerPage: any = [];
  cols;
  colsPartidoJudicial;
  msgs;

  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;

  message;
  permisos: boolean = false;

  initDatos;
  nuevo: boolean = false;
  progressSpinner: boolean = false;

  //Resultados de la busqueda
  @Input() datos;
  //Combo partidos judiciales
  @Input() comboPJ;

  @Output() searchAreasSend = new EventEmitter<boolean>();

  @ViewChild("tabla") tabla;

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService
  ) { }

  ngOnInit() {
    this.getCols();
    this.historico = this.persistenceService.getHistorico()
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
    if (this.persistenceService.getPermisos()) {
      this.permisos = true;
    } else {
      this.permisos = false;
    }
  }

  seleccionaFila(evento) {
    if (!this.selectAll && !this.selectMultiple) {
      this.persistenceService.setDatos(this.selectedDatos[0]);
      this.router.navigate(["/fichaGrupoAreas"], { queryParams: { idArea: this.selectedDatos[0].idArea } });
    } else {
      if (evento.data.fechabaja == undefined && this.historico == true) {
        this.selectedDatos.pop();
      }
    }

  }

  delete() {
    let AreasDelete = new AreasObject();
    AreasDelete.areasItems = this.selectedDatos
    this.sigaServices.post("fichaAreas_deleteAreas", AreasDelete).subscribe(
      data => {
        this.selectedDatos = [];
        this.searchAreasSend.emit(false);
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
        this.historico = false;
        this.selectAll = false;
      }
    );
  }

  onChangeSelectAll() {
    this.selectMultiple = false;

    if (this.selectAll === true) {
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
      if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null);
      } else {
        this.selectedDatos = this.datos;
      }
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }

  }

  searchAreas() {
    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico)
    this.searchAreasSend.emit(this.historico);

  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {

    this.cols = [
      { field: "nombreArea", header: "menu.justiciaGratuita.maestros.Area" },
      { field: "nombreMateria", header: "menu.justiciaGratuita.maestros.Materia" },
      { field: "jurisdicciones", header: "menu.justiciaGratuita.maestros.Jurisdiccion" }
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
    this.tabla.reset();
  }

  isSelectMultiple() {
    if (this.permisos) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        // this.pressNew = false;
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
      }
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
