import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DataTable } from 'primeng/primeng';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { ProcedimientoObject } from '../../../../../../models/sjcs/ProcedimientoObject';

@Component({
  selector: 'app-procedimientos-juzgado',
  templateUrl: './procedimientos-juzgado.component.html',
  styleUrls: ['./procedimientos-juzgado.component.scss']
})
export class ProcedimientosJuzgadoComponent implements OnInit {


  //Resultados de la busqueda
  @Input() datos;
  @Input() modoEdicion;

  @ViewChild("table") table: DataTable;

  rowsPerPage: any = [];
  cols;
  msgs;

  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  historico: boolean = false;
  openFicha: boolean = false;
  selectionMode = "multiple";

  procedimientos = [];

  initSelectedDatos;
  progressSpinner: boolean = false;

  constructor(private changeDetectorRef: ChangeDetectorRef, private persistenceService: PersistenceService, private sigaServices: SigaServices, private translateService: TranslateService) { }

  ngOnInit() {

    this.validateHistorical();
    this.getCols();
    this.getProcess();

  }

  ngAfterViewInit(): void {
    if (this.modoEdicion) {
      this.getProcJuged();
    }
  }

  getProcess() {
    if (this.modoEdicion) {
      this.progressSpinner = true;
    }

    this.sigaServices.get("gestionJuzgados_searchProcess").subscribe(
      n => {
        this.procedimientos = n.procedimientosItems;
        this.progressSpinner = false;

      },
      err => {
        console.log(err);
        this.progressSpinner = false;

      }
    );
  }

  getProcJuged() {

    this.sigaServices
      .getParam("gestionJuzgados_searchProcJudged", "?idJuzgado=" + this.datos.idJuzgado).subscribe(
        n => {
          this.selectedDatos = n.procedimientosItems;
          this.initSelectedDatos = JSON.parse(JSON.stringify((this.selectedDatos)));

          if (this.selectedDatos != undefined && this.selectedDatos.length > 0) {
            this.selectMultiple = true;
          }

        },
        err => {
          console.log(err);
        }
      );
  }

  rest() {
    if (this.initSelectedDatos != undefined) {
      this.selectedDatos = JSON.parse(JSON.stringify(this.initSelectedDatos));
    } else {
      this.selectedDatos = [];
    }

  }

  setItalic(dato) {
    if (dato.fechaBaja == null) return false;
    else return true;
  }


  save() {

    let procedimientoDTO = new ProcedimientoObject();
    procedimientoDTO.procedimientosItems = this.selectedDatos;
    procedimientoDTO.idJuzgado = this.datos.idJuzgado

    this.sigaServices.post("gestionJuzgados_associateProcess", procedimientoDTO).subscribe(
      data => {
        this.initSelectedDatos = JSON.parse(JSON.stringify((this.selectedDatos)));
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {

        if (err.error != undefined && JSON.parse(err.error).error.description != "") {
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

  validateHistorical() {
    if (this.persistenceService.getDatos() != undefined) {

      if (this.persistenceService.getDatos().fechabaja != null) {
        this.historico = true;
        this.selectionMode = "null";
      } else {
        this.historico = false;
        this.selectionMode = "multiple";

      }
    }
  }

  getCols() {

    this.cols = [
      { field: "codigo", header: "administracion.parametrosGenerales.literal.codigo" },
      { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre" },
      { field: "importe", header: "formacion.fichaCurso.tarjetaPrecios.importe" },
      { field: "jurisdiccion", header: "menu.justiciaGratuita.maestros.Jurisdiccion" }

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
      this.selectedDatos = this.procedimientos;
      this.numSelected = this.procedimientos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectMultiple = false;
    }
  }

  isSelectMultiple() {

    if (!this.historico) {
      if (this.selectedDatos != undefined && this.selectedDatos.length == 0) {
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
  }


  actualizaSeleccionados() {

    if (this.selectedDatos == undefined || this.selectedDatos.length == 0) {
      this.numSelected = 0;
      this.selectMultiple = false;

    } else {
      this.numSelected = this.selectedDatos.length;
      this.selectMultiple = true;

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

  abreCierraFicha() {
    if (this.modoEdicion) {
      this.openFicha = !this.openFicha;

    }
  }

}
