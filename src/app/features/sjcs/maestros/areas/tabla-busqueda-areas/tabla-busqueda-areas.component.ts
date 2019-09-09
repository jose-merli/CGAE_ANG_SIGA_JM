import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, Output, EventEmitter, AfterContentInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { findIndex } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AreasObject } from '../../../../../models/sjcs/AreasObject';
import { SigaServices } from '../../../../../_services/siga.service';
import { TableModule } from 'primeng/table';

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
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {

    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
  }

  seleccionaFila(evento) {
    if (!this.selectAll && !this.selectMultiple) {
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
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
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
    if (this.selectAll === true) {
      // this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  // activate() {
  //   let AreasActivate = new AreasObject();
  //   AreasActivate.areasItems = this.selectedDatos
  //   this.sigaServices.post("fichaAreas_activateGroupZones", AreasActivate).subscribe(
  //     data => {

  //       this.selectedDatos = [];
  //       this.searchAreasSend.emit(true);
  //       this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
  //       this.progressSpinner = false;
  //     },
  //     err => {

  //       if (err != undefined && JSON.parse(err.error).error.description != "") {
  //         this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
  //       } else {
  //         this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
  //       }
  //       this.progressSpinner = false;
  //     },
  //     () => {
  //       this.progressSpinner = false;
  //     }
  //   );
  // }

  searchAreas() {
    this.historico = !this.historico;
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
