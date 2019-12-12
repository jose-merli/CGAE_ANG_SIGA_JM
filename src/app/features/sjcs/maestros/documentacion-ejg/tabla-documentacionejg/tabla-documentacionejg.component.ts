import { Component, OnInit, Input, Output, ChangeDetectorRef, ViewChild, EventEmitter } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { DataTable, ConfirmationService } from '../../../../../../../node_modules/primeng/primeng';
import { DocumentacionEjgObject } from '../../../../../models/sjcs/DocumentacionEjgObject';
import { CommonsService } from '../../../../../_services/commons.service';

@Component({
  selector: 'app-tabla-documentacionejg',
  templateUrl: './tabla-documentacionejg.component.html',
  styleUrls: ['./tabla-documentacionejg.component.scss']
})
export class TablaDocumentacionejgComponent implements OnInit {
  [x: string]: any;
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
  buscadores = [];
  initDatos;
  nuevo: boolean = false;
  progressSpinner: boolean = false;
  permisoEscritura: boolean = false;

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

  editElementDisabled() {
    this.datos.forEach(element => {
      element.editable = false
      element.overlayVisible = false;
    });
  }

  searchHistorical() {
    this.historico = !this.historico;
    if (this.historico) {

      this.editElementDisabled();
      this.editMode = false;
      this.nuevo = false;
      this.selectMultiple = false;
      this.selectionMode = "single";
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
    else {
      this.selectMultiple = false;
      this.selectionMode = "single";
    }
    // this.selectAll = false;
    // this.selectedDatos = [];
    // this.selectMultiple = false;
    // this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    this.searchHistoricalSend.emit(this.historico);

  }

  openTab(evento) {

    if (!this.selectAll && !this.selectMultiple) {
      this.progressSpinner = true;
      // if (this.historico) {
      this.persistenceService.setHistorico(this.historico);
      // }
      // else {
      //   this.persistenceService.setHistorico(this.historico);
      // }
      this.persistenceService.setDatos(evento.data);
      this.router.navigate(["/gestiondocumentacionejg"]);
    } else {

      if (evento.data.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }

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
        this.deleteTipoDoc()
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

  deleteTipoDoc() {

    let tipoDocDelete = new DocumentacionEjgObject();
    tipoDocDelete.documentacionejgItems = this.selectedDatos;
    this.sigaServices.post("busquedaDocumentacionEjg_deleteTipoDoc", tipoDocDelete).subscribe(

      data => {

        this.selectedDatos = [];
        this.searchHistoricalSend.emit(false);
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        this.selectMultiple = false;
        this.selectAll = false;

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
        this.selectMultiple = false;
        this.selectAll = false;
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
    let docActivate = new DocumentacionEjgObject();
    docActivate.documentacionejgItems = this.selectedDatos;
    this.sigaServices.post("busquedaDocumentacionEjg_deleteTipoDoc", docActivate).subscribe(
      data => {

        this.selectedDatos = [];
        this.searchHistoricalSend.emit(true);
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        this.selectMultiple = false;
        this.selectAll = false;
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
        this.selectMultiple = false;
        this.selectAll = false;
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
      { field: "abreviaturaTipoDoc", header: "administracion.parametrosGenerales.literal.abreviaturaTipoDocumento", width: "18%" },
      { field: "descripcionTipoDoc", header: "administracion.parametrosGenerales.literal.descripcionTipoDocumento", width: "32%" },
      { field: "abreviaturaDoc", header: "administracion.parametrosGenerales.literal.abreviaturaDocumento", width: "18%" },
      { field: "descripcionDoc", header: "administracion.parametrosGenerales.literal.descripcionDocumentos", width: "32%" },
    ];
    this.cols.forEach(it => this.buscadores.push(""));

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
    if (this.selectAll === true) {
      if (this.nuevo) this.datos.shift();
      this.nuevo = false;
      this.editMode = false;
      this.selectMultiple = false;
      this.editElementDisabled();

      if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null);
        this.selectMultiple = true;
        this.selectionMode = "single";
      } else {
        this.selectedDatos = this.datos;
        this.selectMultiple = false;
        this.selectionMode = "single";
      }
      this.selectionMode = "multiple";
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectAll = false;
      this.selectMultiple = false;
      this.selectionMode = "single";
      // if (this.historico){

      // }
      //   this.selectMultiple = true;
      // this.selectionMode = "multiple";
    }

  }

  isSelectMultiple() {
    if (this.permisoEscritura) {
      if (this.nuevo) this.datos.shift();
      this.editElementDisabled();
      this.editMode = false;
      this.nuevo = false;
      this.selectMultiple = !this.selectMultiple;

      if (!this.selectMultiple) {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectionMode = "single";
      } else {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectionMode = "multiple";
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
