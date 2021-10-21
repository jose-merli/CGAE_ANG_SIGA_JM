import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  HostListener
} from "@angular/core";
import { DataTable } from "primeng/datatable";
import { EnviosMasivosItem } from "./../../../models/ComunicacionesItem";
import { ComunicacionesSearchItem } from "./../../../models/ComunicacionesSearchItem";
import { ComunicacionesObject } from "./../../../models/ComunicacionesObject";
import { TranslateService } from "../../../commons/translate/translation.service";
import { SigaServices } from "./../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { Router } from "@angular/router";
import { esCalendar } from "../../../utils/calendar";
import { ProgramarItem } from "../../../models/ProgramarItem";
import { FichaColegialGeneralesItem } from "../../../models/FichaColegialGeneralesItem";
import { CommonsService } from '../../../_services/commons.service';
import { NuevaComunicacionItem } from "../../../models/NuevaComunicacionItem";
import { ComboItem } from "../../../models/ComboItem";

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-comunicaciones",
  templateUrl: "./comunicaciones.component.html",
  styleUrls: ["./comunicaciones.component.scss"],
  host: {
    "(document:keypress)": "onKeyPress($event)"
  }
})
export class ComunicacionesComponent implements OnInit {
  body: EnviosMasivosItem = new EnviosMasivosItem();
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  showResultados: boolean = false;
  msgs: Message[];
  tiposEnvio: any[];
  estados: any[];
  clasesComunicaciones: any[];
  es: any = esCalendar;
  showProgramar: boolean = false;
  bodyProgramar: ProgramarItem = new ProgramarItem();
  eliminarArray: any[];
  progressSpinner: boolean = false;
  searchComunicaciones: ComunicacionesObject = new ComunicacionesObject();
  bodySearch: ComunicacionesSearchItem = new ComunicacionesSearchItem();
  estado: number;
  currentDate: Date = new Date();
  loaderEtiquetas: boolean = false;
  fichaBusqueda: boolean = true;
  showDatosDestinatarios: boolean = true;
  destinatario: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  colegios: any[] = [];
  colegios_seleccionados: any[] = [];
  busquedaDestinatarioDisabled: boolean = false;
  personaBody: any;
  usuario: any[] = [];
  @ViewChild("table") table: DataTable;
  selectedDatos;

  //VARIABLES CREACIÓN NUEVA COMUNICACIÓN
  showNuevaComm: boolean = false;
  bodyNuevaComm: NuevaComunicacionItem = new NuevaComunicacionItem();
  selectedDocsNuevaComm : any [] = [];
  comboJuzgado: any[] = [];
  colsDocNuevaComm = [
    { field: 'name', header: "censo.cargaMasivaDatosCurriculares.literal.nombreFichero" }
  ];
  comboModelos: ComboItem[];

  constructor(
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.selectedItem = 10;

    sessionStorage.removeItem("crearNuevaCom");

    this.getComboColegios();
    this.getComboJuzgado();
    this.getTipoEnvios();
    this.getEstadosEnvios();
    this.getClasesComunicaciones();
    this.getComboModelos();

    let objPersona = null;

    this.sigaServices.get("usuario_logeado").subscribe(n => {
      this.usuario = n.usuarioLogeadoItem;
      /*if (this.usuario[0].perfiles.indexOf("Abogado") > -1 || this.usuario[0].perfiles.indexOf("Abogado Inscrito") > -1) {
        sessionStorage.setItem("permisoAbogado", "true");
      }*/
      if (this.usuario[0].idPerfiles.indexOf("ABG") > -1 || this.usuario[0].perfiles.indexOf("NCL") > -1
        || this.usuario[0].idPerfiles.indexOf("ABI") > -1) {
        sessionStorage.setItem("permisoAbogado", "true");
      }
      if (this.usuario[0].idPerfiles.indexOf("ADM") == -1 && this.usuario[0].idPerfiles.indexOf("ADG") == -1) {
        if (sessionStorage.getItem("personaBody") != null) {
          this.personaBody = JSON.parse(sessionStorage.getItem("personaBody"));
          // Obtenemos el desatinatario     
          let persona = this.personaBody.idPersona;
          let institucionPersona = this.personaBody.idInstitucion;

          objPersona = {
            idPersona: persona,
            idInstitucion: institucionPersona
          }
        }
      }
    });

    if (JSON.parse(sessionStorage.getItem("isLetrado")) == true) {
      if (sessionStorage.getItem("personaBody") != null) {
        this.personaBody = JSON.parse(sessionStorage.getItem("personaBody"));
        // Obtenemos el desatinatario     
        let persona = this.personaBody.idPersona;
        let institucionPersona = this.personaBody.idInstitucion;

        objPersona = {
          idPersona: persona,
          idInstitucion: institucionPersona
        }
      }

    } else if (sessionStorage.getItem("filtroIdPersona") != null && sessionStorage.getItem("filtroIdInstitucion") != null) {
      // Obtenemos el desatinatario     
      let persona = sessionStorage.getItem("filtroIdPersona");
      let institucionPersona = sessionStorage.getItem("filtroIdInstitucion");

      objPersona = {
        idPersona: persona,
        idInstitucion: institucionPersona
      }
    }

    if (objPersona != null) {
      this.sigaServices.post("busquedaPer_institucion", objPersona).subscribe(
        data => {
          let persona = JSON.parse(data["body"]);
          if (persona && persona.colegiadoItem) {
            this.destinatario = persona.colegiadoItem[0];
          } else if (persona && persona.noColegiadoItem) {
            this.destinatario = persona.noColegiadoItem[0];
          }

          this.bodySearch.nombre = this.destinatario.soloNombre;
          this.bodySearch.apellidos = this.destinatario.apellidos1 + " " + this.destinatario.apellidos2;
          this.bodySearch.apellidos2 = this.destinatario.apellidos2;
          this.bodySearch.apellidos1 = this.destinatario.apellidos1;
          this.bodySearch.nif = this.destinatario.nif;
          this.bodySearch.numColegiado = this.destinatario.numColegiado;
          this.bodySearch.idInstitucion = this.destinatario.idInstitucion;
        },
        err => {
          let msg = this.translateService.instant("informesYcomunicaciones.comunicaciones.mensaje.error.obtenerPersona");
          this.showFail(msg);
          console.log(err);
        },
        () => {
          //this.buscar();
        }
      );

      // Deshabilitamos los botones
      this.busquedaDestinatarioDisabled = true;
    }

    if (sessionStorage.getItem("filtrosCom") != null) {
      this.bodySearch = JSON.parse(sessionStorage.getItem("filtrosCom"));
      this.bodySearch.fechaCreacion = this.bodySearch.fechaCreacion
        ? new Date(this.bodySearch.fechaCreacion)
        : null;
      this.bodySearch.fechaProgramacion = this.bodySearch.fechaProgramacion
        ? new Date(this.bodySearch.fechaProgramacion)
        : null;
      this.buscar();
    }

    this.cols = [
      { field: "claseComunicacion", header: "comunicaciones.literal.claseComunicaciones" },
      { field: "destinatario", header: "informesycomunicaciones.comunicaciones.busqueda.destinatario" },
      { field: "fechaCreacion", header: "informesycomunicaciones.enviosMasivos.fechaCreacion" },
      { field: "fechaProgramada", header: "enviosMasivos.literal.fechaProgramacion" },
      { field: "tipoEnvio", header: "enviosMasivos.literal.tipoEnvio" },
      { field: "estadoEnvio", header: "enviosMasivos.literal.estado" }
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

  // Mensajes
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  clear() {
    this.msgs = [];
  }

  getComboColegios() {
    this.sigaServices.get("modelos_colegio").subscribe(
      n => {
        this.colegios = n.combooItems;
        // this.colegios.unshift({ label: "", value: "" });
      },
      err => {
        console.log(err);
      }
    );
  }

  getTipoEnvios() {
    this.sigaServices.get("enviosMasivos_tipo").subscribe(
      data => {
        this.tiposEnvio = data.combooItems;
        this.tiposEnvio.unshift({ label: "Seleccionar", value: "" });
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
        this.tiposEnvio.map(e => {
          let accents =
            "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
          let accentsOut =
            "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  getEstadosEnvios() {
    this.sigaServices.get("enviosMasivos_estado").subscribe(
      data => {
        this.estados = data.combooItems;
        // this.estados.unshift({ label: "Seleccionar", value: "" });
      },
      err => {
        console.log(err);
      }
    );
  }

  getClasesComunicaciones() {
    this.sigaServices.get("comunicaciones_claseComunicaciones").subscribe(
      data => {
        this.clasesComunicaciones = data.combooItems;
        // this.clasesComunicaciones.unshift({ label: "Seleccionar", value: "" });
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
        this.clasesComunicaciones.map(e => {
          let accents =
            "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
          let accentsOut =
            "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  //MËTODOS NUEVA COMUNICACIÓN
  //Método para mostrar la ventana de creación de comunicación estandar
  nueva(){
    this.showNuevaComm = true;
    //Crear objeto especifico para el formulario de nueva comunicación
    this.bodyNuevaComm = new NuevaComunicacionItem();
    this.bodyNuevaComm.fechaEfecto = new Date();
  }

  isNuevaDisabled(){
    //"Existirá un permiso específico en la aplicación para habilitar o no a cada usuario el botón de Nueva comunicación."
    //Insertar proceso, insertar permisos del proceso e implmentar método apra obtener valor de permiso asociado.
    //"Adicionalmente, para que esté disponible esta acción, el colegio tendrá que tener activada en la tabla de parámetros de configuración la integración con PNJ."
    //Comprobar a que parametro hace referencia e implmentar servicio para obtener su valor.
    return false;
  }

  cerrarDialogNueva(){
    this.showNuevaComm = false;
  }

  seleccionarFichero(event: any) {

    let fileList: FileList = event.files;
    let ficheroTemporal = fileList[0];

      this.bodyNuevaComm.docs.push(ficheroTemporal);
  }

  checkSaveNuevaComm(){
    // let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    // if (msg != undefined) {
    //   this.msgs = msg;
    // } 
    // else {
      if (this.checkCamposObligatoriosNuevaComm()) this.saveNuevaComm();
      else {
        this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      }
    // }
  }

  checkCamposObligatoriosNuevaComm(){
    let campoVacio: boolean = false;
    if(this.bodyNuevaComm.fechaEfecto == null ||
      this.bodyNuevaComm.asunto == null || this.bodyNuevaComm.asunto.trim() == "" ){
        campoVacio = true;
    }
    return !campoVacio;
  }

  saveNuevaComm(){
    this.progressSpinner = true;

    let docs = JSON.parse(JSON.stringify(this.bodyNuevaComm.docs));
    let peticion = JSON.parse(JSON.stringify(this.bodyNuevaComm));
    peticion.docs= [];
    
    this.sigaServices.postSendFileAndComunicacion ("comunicaciones_saveNuevaComm", docs, peticion).subscribe(
      data => {
        
        let resp = data;

        if (resp.status == 'OK') {
          this.progressSpinner = false;
          this.msgs = [{severity:'success', summary: this.translateService.instant('general.message.correct'), detail: this.translateService.instant('general.message.accion.realizada')}];
        }
        else{
          this.msgs = [{severity:'error',summary: 'Error',detail: this.translateService.instant('general.mensaje.error.bbdd')}];

        }

      },
      err => {
        this.progressSpinner = false;
        this.msgs = [{severity:'error',summary: 'Error',detail: this.translateService.instant('general.mensaje.error.bbdd')}];
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  deleteDocumentos(){
    for(let doc of this.selectedDocsNuevaComm){
      let indexDoc = this.bodyNuevaComm.docs.findIndex(el => el.webkitRelativePath == doc.webkitRelativePath);
      this.selectedDocsNuevaComm.splice(indexDoc, 1);
      this.selectedDocsNuevaComm[0].inde
      //filter((drink, index) => drink !== idx);
    }
    //Alternativa
    let indexesDoc = [];
    for(let doc of this.selectedDocsNuevaComm){
      indexesDoc.push(doc.index);
      //
    }
    this.bodyNuevaComm.docs.filter((doc, index) => !indexesDoc.includes(index));
    this.selectedDocsNuevaComm = [];
  }

  getComboJuzgado() {
    this.sigaServices.get("combo_comboJuzgadoDesignaciones").subscribe(
      n => {
        this.comboJuzgado = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboJuzgado);
      },
      err => {
      }
    );
  }

  
  getComboModelos() {
    //Se introduce un segundo parametro ya que lo requiere el servicio post per
    //este body no se tiene en consideracion en el back (modelosClasesComunicacion)
    this.sigaServices.post("comunicaciones_modelosComunicacion", "").subscribe(
      n => {
        this.comboModelos = JSON.parse(n.body).combooItems;
        this.commonsService.arregloTildesCombo(this.comboModelos);
      },
      err => {
      }
    );
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  isSelectMultiple() {
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

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  buscar() {
    this.showResultados = true;
    this.progressSpinner = true;
    sessionStorage.removeItem("comunicacionesSearch");
    sessionStorage.removeItem("filtrosCom");
    this.getResultados();
  }

  

  getResultados() {
    this.sigaServices
      .postPaginado("comunicaciones_search", "?numPagina=1", this.bodySearch)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.searchComunicaciones = JSON.parse(data["body"]);
          this.datos = this.searchComunicaciones.enviosMasivosItem;
          this.datos.forEach(element => {
            element.fechaProgramada = element.fechaProgramada
              ? new Date(element.fechaProgramada)
              : null;
            element.fechaCreacion = new Date(element.fechaCreacion);
          });
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.table.reset();
          setTimeout(()=>{
            this.commonsService.scrollTablaFoco('tablaFoco');
          }, 5);
        }
      );
  }

  isButtonDisabled() {
    if (this.bodySearch.fechaCreacion != null) {
      return false;
    }
    return true;
  }

  cancelar(dato) {

    let msg = this.translateService.instant("informesYcomunicaciones.comunicaciones.mensaje.cancelar.datosEnvios");
    this.confirmationService.confirm({
      // message: this.translateService.instant("messages.deleteConfirmation"),
      message:
        "¿Está seguro de cancelar los" + dato.length + "envíos seleccionados",
      icon: "fa fa-trash-alt",
      accept: () => {
        this.confirmarCancelar(dato);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  confirmarCancelar(dato) {
    this.eliminarArray = [];
    dato.forEach(element => {
      let objEliminar = {
        idEstado: element.idEstado,
        idEnvio: element.idEnvio,
        fechaProgramacion: new Date(element.fechaProgramada)
      };
      this.eliminarArray.push(objEliminar);
    });
    this.sigaServices
      .post("enviosMasivos_cancelar", this.eliminarArray)
      .subscribe(
        data => {
          this.showSuccess(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.envio.cancelado"));
        },
        err => {
          this.showFail(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.envio.error.cancelar"));
          console.log(err);
        },
        () => {
          this.buscar();
          this.table.reset();
        }
      );
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (
      event.keyCode === KEY_CODE.ENTER &&
      this.bodySearch.fechaCreacion != null
    ) {
      this.buscar();
    }
  }

  programar(dato) {
    this.showProgramar = false;
    dato.forEach(element => {
      element.fechaProgramada = new Date(this.bodyProgramar.fechaProgramada);
    });
    this.sigaServices.post("enviosMasivos_programar", dato).subscribe(
      data => {
        this.showSuccess(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.envio.programado"));
      },
      err => {
        this.showFail(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.envio.error.programar"));
        console.log(err);
      },
      () => {
        this.buscar();
        this.table.reset();
      }
    );
  }

  navigateTo(dato) {
    this.estado = dato[0].idEstado;
    if (this.estado != 5) {
      // this.body.estado = dato[0].estado;
      this.router.navigate(["/fichaRegistroComunicacion"]);
      sessionStorage.setItem("comunicacionesSearch", JSON.stringify(dato[0]));
      sessionStorage.setItem("filtrosCom", JSON.stringify(this.bodySearch));
    } else if (this.estado == 5) {
      //this.showInfo("La comunicación está en proceso, no puede editarse");
      this.showInfo(this.translateService.instant("informesycomunicaciones.comunicaciones.envioProcess"));
      this.selectedDatos = [];
    }
  }
  fila(dato) {
    this.estado = dato[0].idEstado;
  }

  onShowProgamar(dato) {
    this.showProgramar = true;

    // if (!this.selectMultiple) {
    this.bodyProgramar.fechaProgramada = dato[0].fechaProgramacion;
    // }
  }

  /*
función para que no cargue primero las etiquetas de los idiomas*/

  isCargado(key) {
    if (key != this.translateService.instant(key)) {
      this.loaderEtiquetas = false;
      return key;
    } else {
      this.loaderEtiquetas = true;
    }
  }

  limpiar() {
    if (JSON.parse(sessionStorage.getItem("isLetrado")) == true) {
      this.bodySearch.descripcion = "";
      this.bodySearch.fechaCreacion = undefined;
      this.bodySearch.fechaProgramacion = undefined;
      this.bodySearch.idClaseComunicacion = "";
      this.bodySearch.idEstado = "";
      this.datos = [];
    } else {
      this.bodySearch = new ComunicacionesSearchItem();
      this.datos = [];
    }
  }

  abreCierraFicha() {
    this.fichaBusqueda = !this.fichaBusqueda;
  }

  onHideDatosDestinatarios() {
    this.showDatosDestinatarios = !this.showDatosDestinatarios;
  }

  duplicar(dato) {
    let envioDuplicar = dato[0];

    let datoDuplicar = {
      idEnvio: envioDuplicar.idEnvio,
      idTipoEnvios: envioDuplicar.idTipoEnvios,
      idPlantillaEnvios: envioDuplicar.idPlantillaEnvios
    }

    this.sigaServices.post("enviosMasivos_duplicar", datoDuplicar).subscribe(
      data => {
        this.showSuccess(this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.correctDuplicado"));

        let datoDuplicado = JSON.parse(data["body"]).enviosMasivosItem;
        datoDuplicado.forEach(element => {
          if (element.fechaProgramada != null) {
            element.fechaProgramada = new Date(element.fechaProgramada);
          }
          element.fechaCreacion = new Date(element.fechaCreacion);
        });
        sessionStorage.setItem("ComunicacionDuplicada", "true");
        sessionStorage.setItem("enviosMasivosSearch", JSON.stringify(datoDuplicado[0]));
        this.router.navigate(["/fichaRegistroEnvioMasivo"]);
      },
      err => {
        this.showFail(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.errorDuplicarEnvio"));
        console.log(err);
      }
    );
  }


  fillFechaCreacion(event) {
    this.bodySearch.fechaCreacion = event;
  }

  fillFechaProgramacion(event) {
    this.bodySearch.fechaProgramacion = event;
  }

  fillFechaProgramada(event) {
    this.bodyProgramar.fechaProgramada = event;
  }

  fillNuevaFechaEfecto(event) {
    this.bodyNuevaComm.fechaEfecto = event;
  }

}
