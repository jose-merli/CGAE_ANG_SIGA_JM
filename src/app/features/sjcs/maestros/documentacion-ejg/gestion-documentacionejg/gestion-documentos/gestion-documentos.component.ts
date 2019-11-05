import { Component, OnInit, Input, Output, ChangeDetectorRef, ViewChild, EventEmitter, SimpleChanges } from '@angular/core';
import { TranslateService } from '../../../../../../commons/translate';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { DataTable, ConfirmationService } from '../../../../../../../../node_modules/primeng/primeng';
import { DocumentacionEjgObject } from '../../../../../../models/sjcs/DocumentacionEjgObject';
import { UpperCasePipe } from '../../../../../../../../node_modules/@angular/common';

@Component({
  selector: 'app-gestion-documentos',
  templateUrl: './gestion-documentos.component.html',
  styleUrls: ['./gestion-documentos.component.scss']
})
export class GestionDocumentosComponent implements OnInit {
  [x: string]: any;
  rowsPerPage: any = [];
  cols: any[] = [];
  msgs: any;

  openFicha: boolean = true;
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;
  message;
  filtros;
  nuevo: boolean = true;
  progressSpinner: boolean = false;
  permisos: boolean = false;
  updateDocumentos = [];
  datosInicial;
  body;
  selectionMode: string = "multiple";
  @Input() modoEdicion: boolean = false;
  @Input() idTipoDoc;
  //Resultados de la busqueda
  @Input() datos;
  @ViewChild("tabla") tabla;


  @Output() searchHistoricalSend = new EventEmitter<boolean>();


  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.getCols();
    // this.datos = this.persistenceService.getDatos();

    if (this.datos != null && this.datos != undefined) {
      this.modoEdicion = true;
      this.datosInicial = JSON.parse(JSON.stringify((this.datos)));
    }


    if (this.persistenceService.getPermisos() != undefined) {
      this.permisos = this.persistenceService.getPermisos();
    }
    this.validateHistorical();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.historico == false) {
      this.selectMultiple = false;
      this.selectionMode = "single"
    }
    this.selectedDatos = [];
    this.updateDocumentos = [];
    this.nuevo = false;
    if (this.datos != null && this.datos != undefined)
      this.datosInicial = JSON.parse(JSON.stringify(this.datos));
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
        this.deleteDoc()
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
    if (this.historico && this.permisos) {

      this.editElementDisabled();
      this.editMode = false;
      this.nuevo = false;
      this.selectMultiple = true;

      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectionMode = "multiple";
    }
    else {
      this.selectMultiple = false;
      this.selectionMode = "single";
    }
    // this.selectAll = false;
    // this.selectMultiple = false;
    // this.historico = !this.historico;
    // this.persistenceService.setHistorico(this.historico);
    this.searchHistoricalSend.emit(this.historico);

  }

  callSaveService(url) {
    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (this.nuevo) {
          this.nuevo = false;
        }

        this.bodyInicial = JSON.parse(JSON.stringify(this.datos));
        this.searchHistoricalSend.emit(false);

        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;

      },
      err => {

        if (JSON.parse(err.error).error.description != "") {
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

  deleteDoc() {

    let tipoDocDelete = new DocumentacionEjgObject();
    tipoDocDelete.documentacionejgItems = this.selectedDatos;
    this.sigaServices.post("gestionDocumentacionEjg_deleteDoc", tipoDocDelete).subscribe(

      data => {

        this.selectedDatos = [];
        if (this.historico == false) {
          this.searchHistoricalSend.emit(false);
        } else {
          this.searchHistorical();
        }

        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.selectAll = false;
        this.selectMultiple = false;
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
        this.selectMultiple = false;
        this.progressSpinner = false;
      }
    );
  }

  edit(evento) {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = [];
    }
    if (!this.nuevo && this.permisos) {

      if (!this.selectAll && !this.selectMultiple && !this.historico) {

        this.datos.forEach(element => {
          element.editable = false;
          element.overlayVisible = false;
        });

        evento.data.editable = true;
        this.editMode = true;

        this.selectedDatos = [];
        this.selectedDatos.push(evento.data);

        let findDato = this.datosInicial.find(item => item.abreviaturaDoc === this.selectedDatos[0].abreviaturaDoc && item.descripcionDoc === this.selectedDatos[0].descripcionDoc && item.codigoExt === this.selectedDatos[0].codigoExt);

        this.selectedBefore = findDato;
      } else {
        if ((evento.data.fechabaja == null || evento.data.fechabaja == undefined) && this.historico) {
          if (this.selectedDatos[0] != undefined) {
            this.selectedDatos.pop();
          } else {
            this.selectedDatos = [];
          }
        }

      }

    }
  }
  activate() {
    let docActivate = new DocumentacionEjgObject();
    docActivate.documentacionejgItems = this.selectedDatos;
    this.sigaServices.post("gestionDocumentacionEjg_deleteDoc", docActivate).subscribe(
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
        this.progressSpinner = false;
      }
    );
  }

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }
  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {

    this.cols = [

      { field: "abreviaturaDoc", header: "administracion.parametrosGenerales.literal.abreviatura" },
      { field: "descripcionDoc", header: "administracion.parametrosGenerales.literal.descripcionDocumentos" },
      { field: "codigoExt", header: "justiciaGratuita.maestros.fundamentosResolucion.codigoExterno" },

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
      if (this.historico)
        this.selectMultiple = true;
      this.selectionMode = "multiple";
    }

  }

  isSelectMultiple() {
    if (this.permisos && !this.historico) {
      if (this.nuevo) this.datos.shift();
      this.editElementDisabled();
      this.editMode = false;
      this.nuevo = false;
      this.selectMultiple = !this.selectMultiple;

      if (!this.selectMultiple) {
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
  //


  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
    this.seleccion = false;
  }

  newDocumento() {
    this.editMode = false;
    this.seleccion = false;
    this.selectionMode = "single";
    this.nuevo = true;
    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }


    let Documento = {
      abreviaturaDoc: undefined,
      descripcionDoc: undefined,
      codigoDescripcion: undefined,
      idDocumento: undefined,
      idTipoDocumento: this.idTipoDoc,
      editable: true
    };
    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();
    if (this.datos.length == 0) {
      this.datos.push(Documento);
    } else {
      this.datos = [Documento, ...this.datos];
    }

  }
  changeAbreviatura(dato) {

    let findDato = this.datosInicial.find(item => item.idDocumento === dato.idDocumento);

    if (findDato != undefined) {
      if (dato.abreviaturaDoc != findDato.abreviaturaDoc) {
        let findUpdate = this.updateDocumentos.find(item => item.abreviaturaDoc === dato.abreviaturaDoc);

        if (findUpdate == undefined) {
          this.updateDocumentos.push(dato);
        }
      }
    }

  }
  changeCodigoExt(dato) {

    let findDato = this.datosInicial.find(item => item.idDocumento === dato.idDocumento);

    if (findDato != undefined) {
      if (dato.codigoExt != findDato.codigoExt) {
        let findUpdate = this.updateDocumentos.find(item => item.codigoExt === dato.codigoExt);

        if (findUpdate == undefined) {
          this.updateDocumentos.push(dato);
        }
      }
    }

  }


  changeDescripcion(dato) {

    let findDato = this.datosInicial.find(item => item.idDocumento === dato.idDocumento);

    if (findDato != undefined) {
      if (dato.descripcionDoc != findDato.descripcionDoc) {
        let findUpdate = this.updateDocumentos.find(item => item.descripcionDoc === dato.descripcionDoc);

        if (findUpdate == undefined) {
          this.updateDocumentos.push(dato);
        }
      }
    }

  }


  save() {
    this.progressSpinner = true;
    let url = "";
    if (this.datos[0].idDocumento == null || this.datos[0].idDocumento == undefined) {
      this.body = this.datos[0]
      url = "gestionDocumentacionEjg_createDoc";
      this.callSaveService(url);
    } else {
      this.body = new DocumentacionEjgObject();
      this.body.documentacionejgItems = this.updateDocumentos;
      url = "gestionDocumentacionEjg_updateDoc";
      this.callSaveService(url);
    }

  }
  disabledSave() {
    if (this.nuevo) {
      if (this.datos[0].abreviaturaDoc != undefined && this.datos[0].descripcionDoc != undefined && this.datos[0].abreviaturaDoc != undefined) {
        return false;
      } else {
        return true;
      }

    } else {
      if (!this.historico && (this.updateDocumentos != undefined && this.updateDocumentos.length > 0) && this.permisos) {
        return false;
      } else {
        return true;
      }
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

  editElementDisabled() {
    this.datos.forEach(element => {
      element.editable = false
      element.overlayVisible = false;
    });
  }
  rest() {
    if (this.datosInicial != undefined) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }
    this.selectAll = false;
    this.selectMultiple = false;
    this.editElementDisabled();
    this.selectedDatos = [];
    this.updateDocumentos = [];
    this.nuevo = false;
    this.editMode = false;
    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();
  }

}


