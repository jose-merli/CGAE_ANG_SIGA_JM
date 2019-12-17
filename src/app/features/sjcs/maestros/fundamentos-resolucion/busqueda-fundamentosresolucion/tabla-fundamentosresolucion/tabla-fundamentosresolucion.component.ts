import { Component, OnInit, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { FundamentoResolucionObject } from '../../../../../../models/sjcs/FundamentoResolucionObject';
import { TranslateService } from '../../../../../../commons/translate';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { ConfirmationService } from '../../../../../../../../node_modules/primeng/primeng';
import { CommonsService } from '../../../../../../_services/commons.service';

@Component({
  selector: 'app-tabla-fundamentosresolucion',
  templateUrl: './tabla-fundamentosresolucion.component.html',
  styleUrls: ['./tabla-fundamentosresolucion.component.scss']
})
export class TablaFundamentosresolucionComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  msgs;
  buscadores = []
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  progressSpinner: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;

  @Input() datos = [];
  permisoEscritura: boolean = true;

  @ViewChild("table") table;

  @Output() searchHistoricalSend = new EventEmitter<boolean>();


  constructor(private changeDetectorRef: ChangeDetectorRef, private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private translateService: TranslateService, private router: Router, private confirmationService: ConfirmationService,
    private commonsService: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getHistorico() != undefined) {
      this.historico = this.persistenceService.getHistorico();
    }

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    this.getCols();
  }

  checkPermisosDelete() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if(!this.permisoEscritura || ((!this.selectMultiple || !this.selectAll) && this.selectedDatos.length == 0)){
				this.msgs = this.commonsService.checkPermisoAccion();
      }else{
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
            summary: "Cancel",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  openTab(evento) {


    if (!this.selectAll && !this.selectMultiple) {
      this.progressSpinner = true;
      this.persistenceService.setDatos(evento.data);
      this.router.navigate(["/gestionFundamentosResolucion"]);
    } else {

      if (evento.data.fechaBaja == undefined && this.historico) {
        this.selectedDatos.pop();
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

  delete() {

    let fundamentosDelete = new FundamentoResolucionObject();
    fundamentosDelete.fundamentoResolucionItems = this.selectedDatos;
    this.sigaServices.post("gestionFundamentosResolucion_deleteFundamentosResolucion", fundamentosDelete).subscribe(

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
      if(!this.permisoEscritura || ((!this.selectMultiple || !this.selectAll) && this.selectedDatos.length == 0)){
				this.msgs = this.commonsService.checkPermisoAccion();
      }else{
        this.activate();
      }
    }
  }

  activate() {

    let fundamentosActivate = new FundamentoResolucionObject();
    fundamentosActivate.fundamentoResolucionItems = this.selectedDatos;

    this.sigaServices.post("gestionFundamentosResolucion_activateFundamentosResolucion", fundamentosActivate).subscribe(
      data => {

        this.selectedDatos = [];
        this.searchHistoricalSend.emit(true);
        this.selectMultiple = false;
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
      { field: "codigoExt", header: "justiciaGratuita.maestros.fundamentosResolucion.codigoExterno", width: "20%" },
      { field: "descripcionFundamento", header: "enviosMasivos.literal.descripcion", width: "60%" },
      { field: "descripcionResolucion", header: "justiciaGratuita.maestros.fundamentosResolucion.resolucion", width: "20%" }

    ];
    this.cols.forEach(it => this.buscadores.push(""))
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
      this.numSelected = this.datos.length;

      if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechaBaja != undefined && dato.fechaBaja != null);
      } else {
        this.selectedDatos = this.datos;
      }

    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectMultiple = false;
    }

  }

  isSelectMultiple() {
    if (this.permisoEscritura) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectAll = false;
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
