import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataTable, ConfirmationService } from '../../../../../../../../node_modules/primeng/primeng';
import { TranslateService } from '../../../../../../commons/translate';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { PrisionObject } from '../../../../../../models/sjcs/PrisionObject';
import { ComisariaObject } from '../../../../../../models/sjcs/ComisariaObject';
import { CommonsService } from '../../../../../../_services/commons.service';

@Component({
  selector: 'app-tabla-comisarias',
  templateUrl: './tabla-comisarias.component.html',
  styleUrls: ['./tabla-comisarias.component.scss']
})
export class TablaComisariasComponent implements OnInit {

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
  @Input() institucionActual;
  @ViewChild("table") table: DataTable;

  @Output() searchHistoricalSend = new EventEmitter<boolean>();


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

    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));

    if (this.persistenceService.getHistorico() != undefined) {
      this.historico = this.persistenceService.getHistorico();
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
        this.confirmDelete();
      }
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
            summary: "Cancelar",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  isSelectMultiple() {
    this.selectAll = false;
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

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    if (!this.selectAll && !this.selectMultiple) {
      this.progressSpinner = true;
      if (evento.data.idInstitucion != this.institucionActual)
        evento.data.institucionVal = false;
      this.persistenceService.setDatos(evento.data);


      this.router.navigate(["/gestionComisarias"]);
    } else {

      if (evento.data.idInstitucion != this.institucionActual) {
        this.selectedDatos.pop();
      } else if (evento.data.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }
    }
  }

  delete() {

    let comisariaDelete = new ComisariaObject();
    comisariaDelete.comisariaItems = this.selectedDatos;
    this.sigaServices.post("busquedaComisarias_deleteComisarias", comisariaDelete).subscribe(

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
    let comisariaActivate = new ComisariaObject();
    comisariaActivate.comisariaItems = this.selectedDatos;
    this.sigaServices.post("busquedaComisarias_activateComisarias", comisariaActivate).subscribe(
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
      { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre", width: "40%" },
      { field: "codigoExt", header: "general.codeext", width: "15%" },
      { field: "domicilio", header: "censo.consultaDirecciones.literal.direccion", width: "15%" },
      { field: "nombrePoblacion", header: "censo.consultaDirecciones.literal.poblacion", width: "15%" },
      { field: "nombreProvincia", header: "censo.datosDireccion.literal.provincia", width: "15%" }

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
    if (this.permisoEscritura) {
      this.selectedDatos = this.datos.filter(dato => dato.idInstitucion == this.institucionActual);
      if (!this.historico) {
        if (this.selectAll) {
          this.selectMultiple = true;
          // this.selectedDatos = this.datos;
          this.numSelected = this.datos.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      } else {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.selectedDatos.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null)
          this.numSelected = this.selectedDatos.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
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
