import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataTable, ConfirmationService } from '../../../../../../node_modules/primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { Router } from '../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../_services/siga.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { ComisariaObject } from '../../../../models/sjcs/ComisariaObject';
import { CommonsService } from '../../../../_services/commons.service';
import { ActasItem } from '../../../../models/sjcs/ActasItem';

@Component({
  selector: 'app-tabla-actas',
  templateUrl: './tabla-actas.component.html',
  styleUrls: ['./tabla-actas.component.scss']
})
export class TablaActasComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  msgs;
  buscadores = [];
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

  //Resultados de la busqueda
  @Input() datos;
  @Input() filtro;
  @Input() permisos;
  @Input() institucionActual;
  @ViewChild("table") table: DataTable;

  @Output() searchHistoricalSend = new EventEmitter<boolean>();
  @Output() actaBorrada = new EventEmitter<any>();


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

    console.log("Tabla Actas, this.datos -> ", this.datos);

    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
    if (this.persistenceService.getHistorico() != undefined) {
      this.historico = this.persistenceService.getHistorico();
    }

  }

  openTab(evento) {


    console.log("evento -> ", evento);

    this.progressSpinner = true;

    this.persistenceService.setDatos(evento);
    
    localStorage.setItem('filtrosActa', JSON.stringify(this.filtro));
    localStorage.setItem('actasItem', JSON.stringify(evento));

    this.router.navigate(["/fichaGestionActas"]);

    
  }

  delete() {

    let actaItem: any[] = [];
    let i = 0;
    this.selectedDatos.forEach(element => {
      actaItem[i] =
      {
        'anioacta': (element.anioacta != null && element.anioacta != undefined) ? element.anioacta.toString() : element.anioacta,
        'idacta': (element.idacta != null && element.idacta != undefined) ? element.idacta.toString() : element.idacta
      };
      i++;
    });

    this.sigaServices.post("filtrosacta_borrar", actaItem).subscribe(

      data => {

        this.selectedDatos = [];

        if(JSON.parse(data.body).status == "OK"){
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }else{
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(data.body).error.description);

        }

        this.progressSpinner = false;
        this.actaBorrada.emit(this.filtro);
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }


  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {

    this.cols = [
      { field: "numeroacta", header: "sjcs.actas.numeroacta", width: "15%" },
      { field: "fecharesolucion", header: "justiciaGratuita.ejg.datosGenerales.FechaResolucion", width: "15%" },
      { field: "fechareunion", header: "justiciaGratuita.ejg.datosGenerales.FechaReunion", width: "15%" },
      { field: "nombrepresidente", header: "justiciaGratuita.ejg.datosGenerales.Presidente", width: "15%" },
      { field: "nombresecretario", header: "justiciaGratuita.ejg.datosGenerales.Secretario", width: "15%" }

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

  selectedRow(selectedDatos) {

    if (this.selectedDatos == undefined) {

      this.selectedDatos = []

    }

    if (selectedDatos != undefined) {

      this.numSelected = selectedDatos.length;

      if (this.numSelected == 1) {

        this.selectMultiple = false;

      } else {

        this.selectMultiple = true;

      }

    }
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.editElementDisabled();
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
    this.selectMultiple = true;
  }

  editElementDisabled() {
    this.datos.forEach(element => {
      element.editable = false
      element.overlayVisible = false;
    });
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
