import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef, ViewChild } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { TranslateService } from '../../../../../commons/translate';
import { ConfirmationService } from 'primeng/api';
import { CommonsService } from '../../../../../_services/commons.service';
import { DataTable } from 'primeng/datatable';
import { DocumentacionEjgItem } from '../../../../../models/sjcs/DocumentacionEjgItem';
import { saveAs } from "file-saver/FileSaver";
import { UnidadFamiliarEJGItem } from '../../../../../models/sjcs/UnidadFamiliarEJGItem';

@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.component.html',
  styleUrls: ['./documentacion.component.scss']
})
export class DocumentacionComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaDocumentacion: string;
  openFicha: boolean = false;
  nuevo;
  body: DocumentacionEjgItem = new DocumentacionEjgItem();
  bodyInicial: DocumentacionEjgItem = new DocumentacionEjgItem();
  item: EJGItem;
  ficheros;
  rowsPerPage: any = [];
  cols;
  msgs;
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  buscadores = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  nDocumentos;
  documentos: DocumentacionEjgItem[] = [];

  colsModal = [
    { field: 'tipo', header: "censo.busquedaClientesAvanzada.literal.tipoCliente" },
    { field: 'numeroTelefono', header: "administracion.parametrosGenerales.literal.valor" }
  ];

  progressSpinner: boolean;
  @ViewChild("table") table: DataTable;
  historico: boolean;
  solicitantes: UnidadFamiliarEJGItem[] = [];

  showModal: boolean = false;
  resaltadoDatos: boolean = false;

  comboPresentador;
  comboTipoDocumentacion;
  comboDocumentos;

  resaltadoDatosGenerales: boolean = false;

  fichaPosible = {
    key: "documentacion",
    activa: false
  }

  activacionTarjeta: boolean = false;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Input() openTarjetaDocumentacion;

  constructor(private sigaServices: SigaServices, private persistenceService: PersistenceService,
    private translateService: TranslateService, private confirmationService: ConfirmationService,
    private commonsServices: CommonsService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.persistenceService.getDatos()) {
      this.resaltadoDatos = true;
      this.nuevo = false;
      this.modoEdicion = true;
      this.item = this.persistenceService.getDatos();
      this.getDocumentos(this.item);
      this.getCols();
      this.getComboPresentador();
      this.getComboTipoDocumentacion();
      this.getComboDocumentos();
    } else {
      this.nuevo = true;
      this.modoEdicion = false;
      this.item = new EJGItem();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaDocumentacion == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
  }

  esFichaActiva(key) {

    return this.fichaPosible.activa;
  }

  abreCierraFicha(key) {
    this.resaltadoDatosGenerales = true;
    if (
      key == "documentacion" &&
      !this.activacionTarjeta
    ) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  getDocumentos(selected) {
    this.progressSpinner = true;
    this.sigaServices.post("gestionejg_getDocumentos", selected).subscribe(
      n => {
        this.documentos = JSON.parse(n.body).ejgDocItems;
        if (this.documentos) {
          this.documentos.forEach(element => {
            if (!element.presentador && element.parentesco) {
              element.presentador_persona = element.presentador_persona + " (" + element.parentesco + " )";
            }
          });
        }
        this.nDocumentos = this.documentos.length;
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
      }
    );
  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }
  openTab(evento) {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }
    if (!this.selectAll && !this.selectMultiple) {
      // this.progressSpinner = true;
      // this.datosEJG();

    } else {
      if (evento.data.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }
    }
  }
  getCols() {
    //docuemntos o recorrer el array?
    //if(this.documentos != undefined && this.documentos.presentador != undefined){
    this.cols = [
      { field: "flimite_presentacion", header: "justiciaGratuita.ejg.datosGenerales.FechaLimPresentacion" },
      { field: "presentador", header: "justiciaGratuita.ejg.documentacion.Presentador" },
      { field: "descripcionDoc", header: "justiciaGratuita.ejg.documentacion.Documento" },
      { field: "regEntrada", header: "justiciaGratuita.ejg.documentacion.RegistroEntrada" },
      { field: "regSalida", header: "justiciaGratuita.ejg.documentacion.RegistroSalida" },
      { field: "f_presentacion", header: "censo.consultaDatosGenerales.literal.fechaPresentacion" },
      { field: "propietario", header: "justiciaGratuita.ejg.documentacion.Propietario" },
    ];
    /* }else{
      this.cols = [
        { field: "flimite_presentacion", header: "justiciaGratuita.ejg.datosGenerales.FechaLimPresentacion", width: "10%" },
        { field: "presentador_persona", header: "justiciaGratuita.ejg.documentacion.Presentador", width: "20%" },
        { field: "documentoDesc", header: "justiciaGratuita.ejg.documentacion.Documento", width: "20%" },
        { field: "regEntrada", header: "justiciaGratuita.ejg.documentacion.RegistroEntrada", width: "15%" },
        { field: "regSalida", header: "justiciaGratuita.ejg.documentacion.RegistroSalida", width: "15%" },
        { field: "f_presentacion", header: "censo.consultaDatosGenerales.literal.fechaPresentacion", width: "10%" },
        { field: "propietario", header: "justiciaGratuita.ejg.documentacion.Propietario", width: "10%" },
      ];
    }   */
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

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSelectAll() {
    if (this.permisoEscritura) {
      if (this.selectAll) {
        this.selectMultiple = true;
        this.selectedDatos = this.documentos;
        this.numSelected = this.selectedDatos.length;
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectMultiple = false;
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
  delete() {
  this.progressSpinner = true;

    this.sigaServices.post("gestionejg_eliminarDocumentosEjg", this.selectedDatos).subscribe(
      data => {
        let resp = data;
        let error = JSON.parse(data.body).error;

        if (resp.statusText == 'OK') {
          this.progressSpinner = false;
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
          this.selectedDatos = [];
          //this.deseleccionarTodo = true;
          this.getDocumentos(this.item);
          this.showModal = false;
        } else {
          if (error != null && error.description != null && error.description != '') {
            this.showMsg('error', 'Error', this.translateService.instant(error.description));
          } else {
            this.showMsg('error', 'Error', this.translateService.instant('general.message.error.realiza.accion'));
          }
        }

      },
      err => {
        console.log(err);
        this.progressSpinner = false;
        this.showMsg('error', 'Error', this.translateService.instant('general.mensaje.error.bbdd'));
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  disabledDelete() {
    if (!this.selectMultiple && !this.selectAll) {
      return true;
    } else {
      if ((!this.selectedDatos) ||
        ((this.selectedDatos.length == 0))) {
        return true;
      } else {
        return false;
      }
    }
  }

  subirFichero(event: any) {

    let fileList: FileList = event.files;
    let file: File = fileList[0];

    this.sigaServices
      .postSendFileAndParameters("gestionEjg_uploadFile", file, this.body.idDocumentacion)
      .subscribe(
        data => {
          this.progressSpinner = false;

          if (data["error"].code == 200) {
            this.showMessage("success", "Correcto", data["error"].message);
          } else if (data["error"].code == null) {
            this.showMessage("info", "Información", data["error"].message);
          }
        },
        error => {
          this.showMessage("info", "Información", "Se ha producido un error al cargar el fichero, vuelva a intentarlo de nuevo pasados unos minutos");
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  checkPermisosDownload() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.download();
    }
  }
  download() {
    this.progressSpinner = true;

    //this.body.nuevoEJG=!this.modoEdicion;

    this.sigaServices.post("gestionejg_descargarDocumentacion", this.body).subscribe(
      n => {
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }
  checkPermisosConfirmDelete() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.confirmDelete();
    }
  }
  checkPermisosPrint() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.print();
    }
  }

  checkNewDoc() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.disabledNewDoc()) {
        this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
        this.resaltadoDatos = true;
      } else {
        this.newDoc();
      }
    }
  }

  disabledNewDoc() {
    if (this.body.idDocumento != null && this.body.idTipoDocumento != null && this.body.presentador != null) {
      return false;
    }
    else return true;
  }
  print() {

  }

  rest() {
    this.body = this.bodyInicial;
  }

  actualizar() {
    this.sigaServices.post("gestionejg_actualizarDocumentacionEjg", this.body).subscribe(
      data => {
        let resp = data;
        let error = JSON.parse(data.body).error;

        if (resp.statusText == 'OK') {
          this.progressSpinner = false;
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
          this.selectedDatos = [];
          //this.deseleccionarTodo = true;
          this.getDocumentos(this.item);
          this.showModal = false;
        } else {
          if (error != null && error.description != null && error.description != '') {
            this.showMsg('error', 'Error', this.translateService.instant(error.description));
          } else {
            this.showMsg('error', 'Error', this.translateService.instant('general.message.error.realiza.accion'));
          }
        }

      },
      err => {
        this.progressSpinner = false;
        this.showMsg('error', 'Error', this.translateService.instant('general.mensaje.error.bbdd'));
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }
  newDoc() {
    //this.showModal = true;

    let peticion: DocumentacionEjgItem = this.body;
    peticion.anio = Number(this.item.annio);
    peticion.numero = Number(this.item.numero);
    peticion.idTipoEjg = Number(this.item.tipoEJG);

    this.sigaServices.post("gestionejg_crearDocumentacionEjg", peticion).subscribe(
      data => {
        let resp = data;
        let error = JSON.parse(data.body).error;

        if (resp.statusText == 'OK') {
          this.progressSpinner = false;
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
          this.selectedDatos = [];
          //this.deseleccionarTodo = true;
          this.getDocumentos(this.item);
          this.showModal = false;
        } else {
          if (error != null && error.description != null && error.description != '') {
            this.showMsg('error', 'Error', this.translateService.instant(error.description));
          } else {
            this.showMsg('error', 'Error', this.translateService.instant('general.message.error.realiza.accion'));
          }
        }

      },
      err => {
        this.progressSpinner = false;
        this.showMsg('error', 'Error', this.translateService.instant('general.mensaje.error.bbdd'));
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  cerrarDialog() {
    this.showModal = false;
  }

  cancelaAnadirDoc() {
    this.showModal = false;
  }

  openModal() {
    this.showModal = true;
    if (this.selectedDatos.length > 0) {
      this.body = this.selectedDatos[0];
      if (this.body.flimite_presentacion != undefined && this.body.flimite_presentacion != null)
        this.body.flimite_presentacion = new Date(this.body.flimite_presentacion);
      if (this.body.f_presentacion != undefined && this.body.f_presentacion != null)
        this.body.f_presentacion = new Date(this.body.f_presentacion);
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }
    else {
      this.body = new DocumentacionEjgItem();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }
  }

  fillFechaLimPre(event) {
    this.body.flimite_presentacion = event;
  }

  fillFechaPre(event) {
    this.body.f_presentacion = event;
  }

  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsServices.styleObligatorio(evento);
    }
  }

  getComboPresentador() {
    this.progressSpinner = true;

    this.sigaServices.get("gestionejg_comboPresentadores").subscribe(
      n => {
        this.comboPresentador = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboPresentador);
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  getComboTipoDocumentacion() {
    this.progressSpinner = true;

    this.sigaServices.get("gestionejg_comboTipoDocumentacion").subscribe(
      n => {
        this.comboTipoDocumentacion = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboTipoDocumentacion);
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  getComboDocumentos() {
    this.progressSpinner = true;

    this.sigaServices.get("gestionejg_comboDocumentos").subscribe(
      n => {
        this.comboDocumentos = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboDocumentos);
        //añadimos el elemento "Todos" que hara que se añadan todos los elementos del combo.
        //Se tendria que cambia en un futuro por una etiqueta que se tradujera segun el lenguaje.
        //general.boton.marcarTodos
        this.comboDocumentos.push({ label: "Todos", value: "-1" });
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  consultaUnidadFamiliar() {
    this.progressSpinner = true;

    //let nombresol = this.body.nombreApeSolicitante;

    this.sigaServices.post("gestionejg_unidadFamiliarEJG", this.item).subscribe(
      n => {

        let familiares = JSON.parse(n.body).unidadFamiliarEJGItems;
        this.progressSpinner = false;

        if (familiares != undefined) {
          //Se buscan los familiares activos
          let familiaresActivos = familiares.filter(
            (dato) => /*dato.fechaBaja != undefined && */ dato.fechaBaja == null);
          this.solicitantes.push(familiaresActivos.filter(
            (dato) => dato.uf_solicitante == "1")[0]);
        }
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  descargarArchivos() {

    this.progressSpinner = true;

    /* let docADescargar = [];

    this.selectedDatos.forEach(el => {
      let row: Row = this.rowGroups.slice(el, el + 1)[0];

      let doc = new DocumentacionEjgItem();
      doc.idDocumentacionejg = row.cells[6].value;
      doc.nombreFichero = row.cells[3].value;
      doc.idFichero = row.cells[7].value;

      docADescargar.push(doc);
    }); */

    this.sigaServices.postDownloadFiles("designacion_descargarDocumentosDesigna", this.selectedDatos).subscribe(
      data => {

        let blob = null;

        if (this.selectedDatos.length == 1) {

          let mime = this.getMimeType(this.selectedDatos[0].nombreFichero.substring(this.selectedDatos[0].nombreFichero.lastIndexOf("."), this.selectedDatos[0].nombreFichero.length));
          blob = new Blob([data], { type: mime });
          saveAs(blob, this.selectedDatos[0].nombreFichero);
        } else {

          blob = new Blob([data], { type: "application/zip" });
          saveAs(blob, "documentosEjg.zip");
        }
        this.selectedDatos = [];
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );

  }

  getMimeType(extension: string): string {

    let mime: string = "";

    switch (extension.toLowerCase()) {

      case ".doc":
        mime = "application/msword";
        break;
      case ".docx":
        mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
      case ".pdf":
        mime = "application/pdf";
        break;
      case ".jpg":
        mime = "image/jpeg";
        break;
      case ".png":
        mime = "image/png";
        break;
      case ".rtf":
        mime = "application/rtf";
        break;
      case ".txt":
        mime = "text/plain";
        break;
    }

    return mime;
  }
}

