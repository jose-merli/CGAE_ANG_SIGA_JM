import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '../../../../../node_modules/@angular/router';
import { ConfirmationService, DataTable } from '../../../../../node_modules/primeng/primeng';
import { PersistenceService } from '../../../_services/persistence.service';
import { SigaServices } from '../../../_services/siga.service';
import { TranslateService } from '../../../commons/translate';



@Component({
  selector: 'app-tabla-generalSJCS',
  templateUrl: './tabla-generalSJCS.component.html',
  styleUrls: ['./tabla-generalSJCS.component.scss']
})
export class TablaGeneralSJCSComponent implements OnInit {


  rowsPerPage: any = [];
  cols;
  msgs;
  @Input() institucionActual;

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
  permisoEscritura: boolean = true;

  //Resultados de la busqueda
  @Input() datos;

  @ViewChild("table") table: DataTable;

  @Output() searchHistoricalSend = new EventEmitter<boolean>();


  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));

    if (this.persistenceService.getHistorico() != undefined) {
      this.historico = this.persistenceService.getHistorico();
    }
  }
  confirmDelete() {
    let mess = this.translateService.instant(
      "messages.deleteConfirmation"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.delete()
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

  searchHistorical() {

    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    this.searchHistoricalSend.emit(this.historico);
    this.selectAll = false
    if (this.selectMultiple) {
      this.selectMultiple = false;
    }
  }


  backWithData(evento) {

    //Bloquear el desplegable del estado de colegiado a ejerciente
    if (sessionStorage.getItem("pantalla") == "gestionEjg" && sessionStorage.getItem("tarjeta") == "ServiciosTramit"){
      let persona = sessionStorage.setItem("buscadorGeneral", JSON.stringify((evento)));
      sessionStorage.removeItem("tarjeta");
      sessionStorage.removeItem("pantalla");
    }
    else this.persistenceService.setDatos(evento.data);
    this.location.back();

  }

  delete() {

    let procuradorDelete = undefined;
    procuradorDelete.procuradorItems = this.selectedDatos;
    this.sigaServices.post("busquedaGeneralSJCS_deleteGeneralSJCS", procuradorDelete).subscribe(

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
    let procuradorActivate = undefined;
    procuradorActivate.procuradorItems = this.selectedDatos;
    this.sigaServices.post("busquedaGeneralSJCS_activateGeneralSJCS", procuradorActivate).subscribe(
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
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {

    this.cols = [
      { field: "abreviatura", header: "censo.busquedaClientesAvanzada.literal.colegio" },
      { field: "nColegiado", header: "censo.resultadosSolicitudesModificacion.literal.nColegiado" },
      { field: "descripcion", header: "menu.justiciaGratuita.componentes.estadoColegial" },
      { field: "nif", header: "administracion.usuarios.literal.NIF" },
      { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre" },
      { field: "inscritoturno", header: "gratuita.busquedaSJCS.tipoFiltro.inscritosTurno" },
      { field: "inscritoguardia", header: "gratuita.busquedaSJCS.tipoFiltro.inscritosGuardia" },
      { field: "guardiasPendientes", header: "gratuita.busquedaSJCS.literal.guardiasPendientes" },
      { field: "telefono", header: "censo.ws.literal.telefono" },

      // { field: "residencia", header: "censo.datosDireccion.literal.provincia" }

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
