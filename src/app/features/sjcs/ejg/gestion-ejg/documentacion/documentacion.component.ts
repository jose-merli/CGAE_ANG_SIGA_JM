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
import { DatePipe } from '@angular/common';
import { elementEnd } from '@angular/core/src/render3/instructions';

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
  tiposCabecera: string = "";

  colsModal = [
    { field: 'fecha', header: "dato.jgr.guardia.saltcomp.fecha" },
    { field: 'nombre', header: "censo.cargaMasivaDatosCurriculares.literal.nombreFichero" }
  ];

  progressSpinner: boolean;
  @ViewChild("tableDocumentacion") tableDocumentacion: DataTable;
  historico: boolean;
  solicitantes: UnidadFamiliarEJGItem[] = [];

  showModal: boolean = false;
  resaltadoDatos: boolean = false;

  comboPresentador;
  comboTipoDocumentacion;
  comboDocumentos: any [];

  resaltadoDatosGenerales: boolean = false;

  ficheroTemporal: File = null;

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
    private commonsServices: CommonsService, private changeDetectorRef: ChangeDetectorRef,
    private datepipe: DatePipe,) { }

  ngOnInit() {
    if (this.persistenceService.getDatos()) {

      this.resaltadoDatos = true;
      this.nuevo = false;
      this.modoEdicion = true;
      this.item = this.persistenceService.getDatos();
      this.getCols();
      this.getComboPresentador();
      this.getComboTipoDocumentacion();
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
    // this.progressSpinner = true;
    this.sigaServices.post("gestionejg_getDocumentos", selected).subscribe(
      n => {
        this.documentos = JSON.parse(n.body).ejgDocItems;
        if (this.documentos != null && this.documentos != undefined) {
          this.tiposCabecera = "";
          this.documentos.forEach(element => {
            if (!element.presentador && element.parentesco) {
              element.presentador_persona = element.presentador_persona + " (" + element.parentesco + " )";
            }
            //Cuando el presentador seleccionado no es un solicitante
            // if (!element.presentador && element.idMaestroPresentador) {
            if (element.idMaestroPresentador) {
              element.presentador = element.idMaestroPresentador.toString();
              //Valor de la columna presentador
              this.comboPresentador.forEach(pres => {
                if (pres.value == element.presentador) element.presentador_persona = pres.label;
              });
            }
            //Cuando el presentador es un solicitante
            else if (element.presentador) {
              element.presentador = "S_" + element.presentador;
              //Valor de la columna presentador
              this.comboPresentador.forEach(pres => {
                if (pres.value == element.presentador) element.presentador_persona = pres.label;
              });
            }
            //Se escribe los tipos de documento presentados en la cabecera
            if (this.documentos.length <= 3 && this.documentos.length > 0) {
              if (this.tiposCabecera != "") this.tiposCabecera += ", ";
              this.tiposCabecera += element.labelDocumento;
            }
          });
          //Si se esta introducido un nuevo documento
          //se añade el iddocumentacion al body actual
          if (this.showModal && this.body.idDocumentacion == null) {
            //Actualmente, la ultima documentaciom introducido conincide con la ultima documentacion de la lista
            //Se asigna el valor de iddocumentacion para que se pueda asignar ficheros
            this.body.idDocumentacion = this.documentos[this.documentos.length - 1].idDocumentacion;
            //Para evitar que se produzcan errores al pulsar el botón "Reestablecer"
            this.bodyInicial = JSON.parse(JSON.stringify(this.body));
          }

          //Si se esta actualizando o creando los documentos cuando se ha introducido un nuevo fichero
          //se añade el iddocumento al body actual
          if (this.showModal && this.body.idFichero == null) {
            let documentacion = this.documentos.find(
              item => item.idDocumentacion == this.body.idDocumentacion
            );
            if (documentacion != undefined) {
              this.body.idFichero = documentacion.idFichero;
              this.bodyInicial = JSON.parse(JSON.stringify(this.body));
            }
          }

          if(this.ficheroTemporal != null && this.ficheroTemporal != undefined) this.subirFichero();
        }
        this.nDocumentos = this.documentos.length;
        // this.progressSpinner = false;
        if (this.tableDocumentacion != undefined) this.tableDocumentacion.reset();
      },
      err => {
        //this.progressSpinner = false;
      }
    );
  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {
    
    this.cols = [
      { field: "flimite_presentacion", header: "justiciaGratuita.ejg.datosGenerales.FechaLimPresentacion" },
      { field: "presentador_persona", header: "justiciaGratuita.ejg.documentacion.Presentador" },
      { field: "labelDocumento", header: "justiciaGratuita.ejg.documentacion.Documento" },
      { field: "regEntrada", header: "justiciaGratuita.ejg.documentacion.RegistroEntrada" },
      { field: "regSalida", header: "justiciaGratuita.ejg.documentacion.RegistroSalida" },
      { field: "f_presentacion", header: "censo.consultaDatosGenerales.literal.fechaPresentacion" },
      { field: "propietarioDes", header: "justiciaGratuita.ejg.documentacion.Propietario" },
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
    this.tableDocumentacion.reset();
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
    this.selectAll = false;
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

  deleteDocumentacion() {
    this.progressSpinner = true;

    this.sigaServices.post("gestionejg_eliminarDocumentacionEjg", this.selectedDatos).subscribe(
      data => {
        let resp = data;
        let error = JSON.parse(data.body).error;

        if (resp.statusText == 'OK') {
          this.progressSpinner = false;
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
          this.selectedDatos = [];
          //this.deseleccionarTodo = true;
          this.getDocumentos(this.item);
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
      }
    );
  }


  deleteDocumentos() {
    this.progressSpinner = true;

    this.sigaServices.post("gestionejg_eliminarDocumentosEjg", this.bodyInicial).subscribe(
      data => {
        let resp = data;
        let error = JSON.parse(data.body).error;

        if (resp.statusText == 'OK') {
          this.progressSpinner = false;
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
          //this.selectedDatos = [];
          //this.deseleccionarTodo = true;
          this.getDocumentos(this.item);
          // this.showModal = false;
          this.body.idFichero = null;
          this.body.nombreFichero = null;
          this.bodyInicial = JSON.parse(JSON.stringify(this.body));
          this.ficheros = [];
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

  seleccionarFichero(event: any) {

    let fileList: FileList = event.files;
    this.ficheroTemporal = fileList[0];

    this.body.nombreFichero = this.ficheroTemporal.name;
    if (this.bodyInicial.f_presentacion != null && this.bodyInicial.f_presentacion != undefined) {
      this.ficheros = [{
        "fecha": this.datepipe.transform(this.bodyInicial.f_presentacion, 'dd/MM/yyyy'),
        "nombre": this.body.nombreFichero
      }]
    } else {
      this.ficheros = [{
        "fecha": this.translateService.instant("justiciaGratuita.ejg.documentacion.noFechaPre"),
        "nombre": this.body.nombreFichero
      }]
    }
  }

  subirFichero() {

    this.progressSpinner = true;

    // let fileList: FileList = event.files;
    // let file: File = fileList[0];

    let idDocumentacion : string = this.body.idDocumentacion.toString();
    //Si se ha seleccionado la opcion "Todos" en el desplegable "Documento"
    if(this.body.idDocumento == -1){
      //Se resta 2 teniendo en cuenta el elemento "Todos" y el elemento ya introducido anteriormente
      for(var i = 0; i < this.comboDocumentos.length-2; i++){
        //Vamos a obtener un string con los indices de todos los nuevos documentos creados
        idDocumentacion += "," +this.documentos[this.documentos.length - this.comboDocumentos.length + 1 + i].idDocumentacion;
      }
    }

    this.sigaServices
      .postSendFileAndParameters("gestionejg_subirDocumentoEjg", this.ficheroTemporal, idDocumentacion)
      .subscribe(
        data => {
          if (data["error"].code == 200) {
            this.showMessage("success", "Correcto", data["error"].message);
            this.body.nombreFichero = this.ficheroTemporal.name;
            this.ficheroTemporal = null;
            this.getDocumentos(this.item);
            this.selectedDatos = [];
            this.numSelected = 0;

            
            
            if(this.body.idDocumento == -1){
              this.body.idDocumento = this.documentos[this.documentos.length-1].idDocumento;
            }
            
            this.bodyInicial = JSON.parse(JSON.stringify(this.body));
            
          } else if (data["error"].code == null) {
            this.showMessage("info", this.translateService.instant("general.message.informacion"), data["error"].message);
          }
          this.progressSpinner = false;
        },
        error => {
          //Maximo de tamaño permitido actualmente al hacer peticiones al back (5242880)
          if (this.ficheroTemporal.size > 5242880) this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.ejg.documentacion.tamMax"));
          else this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.ejg.documentacion.errorFich"));
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  download() {
    this.progressSpinner = true;

    //this.body.nuevoEJG=!this.modoEdicion;
    let documentos: any[] = [];
    if (this.selectedDatos.length == 0) documentos.push(this.body);
    else documentos = this.selectedDatos;

    this.sigaServices.postDownloadFiles("gestionejg_descargarDocumentosEjg", documentos).subscribe(
      data => {
        let blob = null;

        // Se comprueba si todos los documentos asociados no tiene ningún fichero 
        let documentoAsociado = documentos.find(item => item.nombreFichero != null)
        if (documentoAsociado != undefined) {
          if (documentos.length == 1) {
            if (documentos[0].nombreFichero != null) {
              let mime = this.getMimeType(documentos[0].nombreFichero.substring(documentos[0].nombreFichero.lastIndexOf("."), documentos[0].nombreFichero.length));
              blob = new Blob([data], { type: mime });
              saveAs(blob, documentos[0].nombreFichero);
            }
          } else {
            blob = new Blob([data], { type: "application/zip" });
            saveAs(blob, "documentos.zip");
          }
        }
        else this.showMessage("error", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.ejg.documentacion.noFich"));

        this.selectedDatos = [];
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
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
          this.bodyInicial = JSON.parse(JSON.stringify(this.body));
          if (this.bodyInicial.f_presentacion != null && this.bodyInicial.f_presentacion != undefined) {
            this.ficheros = [{
              "fecha": this.datepipe.transform(this.bodyInicial.f_presentacion, 'dd/MM/yyyy'),
              "nombre": this.body.nombreFichero
            }]
          } else {
            this.ficheros = [{
              "fecha": this.translateService.instant("justiciaGratuita.ejg.documentacion.noFechaPre"),
              "nombre": this.body.nombreFichero
            }]
          }
          this.subirFichero();
        } else {
          if (error != null && error.description != null && error.description != '') {
            this.showMsg('error', 'Error', this.translateService.instant(error.description));
          } else {
            this.showMsg('error', 'Error', this.translateService.instant('general.message.error.realiza.accion'));
          }
        }

      },
      err => {
        this.showMsg('error', 'Error', this.translateService.instant('general.mensaje.error.bbdd'));
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }
  newDoc() {
    //this.showModal = true;
    this.progressSpinner = true;

    let peticion: DocumentacionEjgItem = this.body;
    peticion.anio = Number(this.item.annio);
    peticion.numero = Number(this.item.numero);
    peticion.idTipoEjg = Number(this.item.tipoEJG);

    this.sigaServices.post("gestionejg_crearDocumentacionEjg", peticion).subscribe(
      data => {
        this.progressSpinner = false;
        let resp = data;
        let error = JSON.parse(data.body).error;

        if (resp.statusText == 'OK') {
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
          this.selectedDatos = [];
          //this.deseleccionarTodo = true;
          this.getDocumentos(this.item);
          //this.showModal = false;
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
      }
      // ,
      // () => {
      //   this.progressSpinner = false;
      // }
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

  checkPermisosSubirFichero(event) {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.body.idDocumentacion != null) this.subirFichero();
      else {
        this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant("justiciaGratuita.ejg.documentacion.disNew") }];
      }
    }
  }

  openModal(datos) {
    this.showModal = true;
    this.ficheroTemporal = null;
    if (datos != null) {
      this.selectedDatos = [];
      this.body = datos;
      this.getComboDocumentos();
      if (this.body.flimite_presentacion != undefined && this.body.flimite_presentacion != null)
        this.body.flimite_presentacion = new Date(this.body.flimite_presentacion);
      if (this.body.f_presentacion != undefined && this.body.f_presentacion != null)
        this.body.f_presentacion = new Date(this.body.f_presentacion);
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      if (this.bodyInicial.idFichero) {
        if (this.bodyInicial.f_presentacion != null && this.bodyInicial.f_presentacion != undefined) {
          this.ficheros = [{
            "fecha": this.datepipe.transform(this.bodyInicial.f_presentacion, 'dd/MM/yyyy'),
            "nombre": this.bodyInicial.nombreFichero
          }]
        } else {
          this.ficheros = [{
            "fecha": this.translateService.instant("justiciaGratuita.ejg.documentacion.noFechaPre"),
            "nombre": this.bodyInicial.nombreFichero
          }]
        }
      }
      else this.ficheros = [];
    }
    else {
      this.ficheros = [];
      //Se obtiene el combo de presentadores cada vez que se crea una nueva documentacion
      //Para cubrir la posibilidad de nuevos solicitantes o de solicitantes eliminados
      this.getComboPresentador();
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
    //this.progressSpinner = true;

    this.sigaServices.get("gestionejg_comboPresentadores").subscribe(
      n => {
        this.comboPresentador = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboPresentador);
        //this.progressSpinner = false;
        //Se buscan los solicitantes del EJG
        this.sigaServices.post("gestionejg_unidadFamiliarEJG", this.item).subscribe(
          n => {

            let familiares = JSON.parse(n.body).unidadFamiliarEJGItems;
            this.progressSpinner = false;

            if (familiares != undefined) {
              //Se buscan los solicitantes
              this.solicitantes = familiares.filter(
                (dato) => dato.uf_solicitante == "1");

              //Se añaden los solicitantes de la unidad familiar
              this.solicitantes.forEach(element => {
                //En el caso que sea un solicitante normal
                if (element.uf_enCalidad == "2") {
                  this.comboPresentador.push({
                    label: element.pjg_nombrecompleto + " (" + this.translateService.instant('justiciaGratuita.justiciables.rol.solicitante') + ")",
                    value: "S_" + element.uf_idPersona
                  });
                }
                //En el caso que sea el solicitante pprincipal
                else {
                  this.comboPresentador.push({
                    label: element.pjg_nombrecompleto + " (" + this.translateService.instant('justiciaGratuita.justiciables.unidadFamiliar.solicitantePrincipal') + ")",
                    value: "S_" + element.uf_idPersona
                  });
                }
              })
            }

            //Se ubica aqui la llamada al método para obtener la tabla para evitar que
            //no se tenga el comboPresentador definido a la hora de obtener su columna
            if(!this.showModal)this.getDocumentos(this.item);
            // this.progressSpinner = false;
          },
          err => {
            // this.progressSpinner = false;
          }
        );

      },
      err => {
        // this.progressSpinner = false;
      }
    );
  }

  getComboTipoDocumentacion() {
    //this.progressSpinner = true;

    this.sigaServices.get("gestionejg_comboTipoDocumentacion").subscribe(
      n => {
        this.comboTipoDocumentacion = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboTipoDocumentacion);
        // this.progressSpinner = false;
      },
      err => {
        // this.progressSpinner = false;
      }
    );
  }

  getComboDocumentos() {
    if (this.body.idTipoDocumento != null && this.body.idTipoDocumento != undefined) {
      this.progressSpinner = true;

      this.sigaServices.getParam("gestionejg_comboDocumentos", "?idTipoDocumentacion=" + this.body.idTipoDocumento).subscribe(
        n => {
          this.comboDocumentos = n.combooItems;
          this.commonsServices.arregloTildesCombo(this.comboDocumentos);
          //añadimos el elemento "Todos" que hara que se añadan todos los elementos del combo.
          if (this.comboDocumentos.length > 1) this.comboDocumentos.push({ label: this.translateService.instant('justiciaGratuita.ejg.documentacion.todosDoc'), value: "-1" });
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        }
      );
    }
    else {
      this.comboDocumentos = [];
    }
  }

  descargarArchivos() {

    this.progressSpinner = true;

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

