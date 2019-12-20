import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormBuilder, FormGroup } from "@angular/forms";
import { esCalendar } from "../../../../utils/calendar";
import { Message } from "primeng/components/common/api";
import { Location } from "@angular/common";
import { AutoComplete, Dialog, Calendar } from "primeng/primeng";

import { SigaServices } from "./../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { PersonaJuridicaItem } from "./../../../../../app/models/PersonaJuridicaItem";
/*** COMPONENTES ***/
import { DatosGeneralesComponent } from "./../../../../new-features/censo/ficha-colegial/datos-generales/datos-generales.component";
import { DatosGeneralesItem } from "./../../../../../app/models/DatosGeneralesItem";
import { DatosGeneralesObject } from "./../../../../../app/models/DatosGeneralesObject";
import { ComboItem } from "../../../../models/ComboItem";

import { Subscription } from "rxjs/Subscription";
import { cardService } from "./../../../../_services/cardSearch.service";
import { ControlAccesoDto } from "./../../../../../app/models/ControlAccesoDto";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { NullAstVisitor } from "../../../../../../node_modules/@angular/compiler";
import { ComboEtiquetasItem } from "../../../../models/ComboEtiquetasItem";

@Component({
  selector: "app-datos-generales",
  templateUrl: "./datos-generales.component.html",
  styleUrls: ["./datos-generales.component.scss"]
})
export class DatosGenerales implements OnInit {
  uploadedFiles: any[] = [];
  formBusqueda: FormGroup;
  cols: any = [];
  datosDirecciones: any[];
  select: any[];
  es: any = esCalendar;
  msgs: Message[];
  body: DatosGeneralesItem = new DatosGeneralesItem();
  bodyviejo: DatosGeneralesItem = new DatosGeneralesItem();
  suscripcionBusquedaNuevo: Subscription;
  bodyPersonaJuridica: PersonaJuridicaItem = new PersonaJuridicaItem();
  personaSearch: DatosGeneralesObject = new DatosGeneralesObject();
  fichasActivas: Array<any> = [];
  todo: boolean = false;
  textFilter: String;
  selectedDatos: any = [];
  activacionEditar: boolean = false;
  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = false;
  showDatosFacturacion: boolean = false;
  rowsPerPage: any = [];
  showAll: boolean = false;
  showGuardar: boolean = false;
  progressSpinner: boolean = false;
  openFicha: boolean = false;
  displayAuditoria: boolean = false;

  selectedItem: number = 10;
  selectedDoc: string = "NIF";
  newDireccion: boolean = false;
  nuevo: boolean = false;
  identificacionValida: boolean;

  editar: boolean = false;
  archivoDisponible: boolean = false;
  file: File = undefined;
  base64String: any;
  source: any;
  imageBase64: any;
  imagenURL: any;
  generos: any[];
  tratamientos: any[];
  comboEtiquetas: any[];
  etiquetasPersonaJuridica: any[];
  etiquetasPersonaJuridicaSelecionados: ComboEtiquetasItem[] = [];
  comboIdentificacion: any[];
  comboTipo: any[] = [];
  idiomas: any[];
  usuarioBody: any;
  edadCalculada: String;
  textSelected: String = "{0} etiquetas seleccionados";
  idPersona: String;
  tipoPersonaJuridica: String;
  datos: any[];
  selectedTipo: any;
  idiomaPreferenciaSociedad: String;
  camposDesactivados: boolean = false;
  existeImagen: boolean = false;
  imagenPersonaJuridica: any;

  cuentaIncorrecta: Boolean = false;
  showGuardarAuditoria: boolean = false;

  ocultarMotivo: boolean = undefined;

  contadorNoCorrecto: boolean = false;

  isValidate: boolean;

  items: Array<ComboEtiquetasItem> = new Array<ComboEtiquetasItem>();
  newItems: Array<ComboEtiquetasItem> = new Array<ComboEtiquetasItem>();
  item: ComboEtiquetasItem = new ComboEtiquetasItem();
  createItems: Array<ComboEtiquetasItem> = new Array<ComboEtiquetasItem>();

  control: boolean = false;
  checked: boolean = false;
  autocompletar: boolean = false;
  isCrear: boolean = false;
  closable: boolean = false;
  isFechaInicioCorrect: boolean = false;
  isFechaBajaCorrect: boolean = false;
  isTrue: boolean = false;
  historico: boolean = false;
  isClose: boolean = false;
  disabledAction: boolean = false;

  etiqueta: String;
  arrayInicial: String[] = [];

  fechaDesde: Date;
  fechaHasta: Date;
  fechaHoy: Date;
  index: any = 0;

  mensaje: String = "";

  updateItems: Map<String, ComboEtiquetasItem> = new Map<
    String,
    ComboEtiquetasItem
    >();

  @ViewChild("auto")
  autoComplete: AutoComplete;

  @ViewChild("dialog")
  dialog: Dialog;

  @ViewChild("calendar")
  calendar: Calendar;

  @ViewChild(DatosGeneralesComponent)
  datosGeneralesComponent: DatosGeneralesComponent;

  @ViewChild("table")
  table;

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "direcciones",
      activa: false
    },
    {
      key: "colegiales",
      activa: false
    },
    {
      key: "bancarios",
      activa: false
    },
    {
      key: "cv",
      activa: false
    }
  ];

  tarjeta: string;

  constructor(
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private location: Location,
    private cardService: cardService,
    private sigaServices: SigaServices,
    private sanitizer: DomSanitizer,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private datepipe: DatePipe
  ) {
    this.formBusqueda = this.formBuilder.group({
      cif: null
    });
    this.progressSpinner = false;
  }

  isValidCIF(cif: String): boolean {
    return (
      cif &&
      typeof cif === "string" &&
      /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/.test(cif)
    );
  }

  ngOnInit() {
    // dentro de este metodo se llama a continueOnInit()
    if (sessionStorage.getItem("disabledAction") == "true") {
      this.disabledAction = true;
    } else {
      this.disabledAction = false;
    }

    this.checkAcceso();

    this.getComboIdentificacion();
  }
  continueOnInit() {
    this.busquedaIdioma();

    if (sessionStorage.getItem("historicoSociedad") != null) {
      this.camposDesactivados = true;
    }
    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    if (sessionStorage.getItem("crearnuevo") != null) {
      this.editar = true;
      this.abreCierraFicha();
    }

    if (sessionStorage.getItem("nuevoRegistro") == null) {
      if (this.usuarioBody[0] != undefined) {
        this.idPersona = this.usuarioBody[0].idPersona;
        this.tipoPersonaJuridica = this.usuarioBody[0].tipo;
      }

      // estamos en modo edicion (NO en creacion)
      if (this.idPersona != undefined) {
        this.editar = true;
        this.datosGeneralesSearch();
        this.cargarImagen(this.body.idPersona);
      }
      this.textFilter = "Elegir";

      if (this.body.idPersona != undefined || this.body.idPersona != null) {
        this.obtenerEtiquetasPersonaJuridicaConcreta();
      }
    } else {
      this.body.nif = this.usuarioBody[0].nif;
      this.tipoPersonaJuridica = this.usuarioBody[0].tipo;
      this.body.denominacion = this.usuarioBody[0].denominacion;
      this.body.abreviatura = this.usuarioBody[0].abreviatura;
      this.body.fechaConstitucion = this.usuarioBody[0].fechaConstitucion;
      if (this.usuarioBody[0].fechaBaja != null) {
        this.body.fechaBaja = this.usuarioBody[0].fechaBaja;
      }

      this.getComboIdentificacion();
    }

    // obtener parametro para saber si se oculta la auditoria
    let parametro = {
      valor: "OCULTAR_MOTIVO_MODIFICACION"
    };

    this.sigaServices
      .post("busquedaPerJuridica_parametroColegio", parametro)
      .subscribe(
        data => {
          let parametroOcultarMotivo = JSON.parse(data.body);
          if (parametroOcultarMotivo.parametro == "S" || parametroOcultarMotivo.parametro == "s") {
            this.ocultarMotivo = true;
          } else if (parametroOcultarMotivo.parametro == "N" || parametroOcultarMotivo.parametro == "n") {
            this.ocultarMotivo = false;
          } else {
            this.ocultarMotivo = undefined;
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  getComboIdentificacion() {
    // Combo de identificación
    this.sigaServices.get("busquedaPerJuridica_tipo").subscribe(
      n => {
        this.comboIdentificacion = n.combooItems;
      },
      error => { }, () => {
        if (sessionStorage.getItem("nuevoRegistro") != null && sessionStorage.getItem("nuevoRegistro") === "true") {
          this.onChangeForm();
        }
      }
    );

    this.comboTipo.push(this.tipoPersonaJuridica);
  }

  obtenerEtiquetasPersonaJuridicaConcreta() {
    this.sigaServices
      .post("fichaDatosGenerales_etiquetasPersona", this.body)
      .subscribe(
        n => {
          // coger etiquetas de una persona juridica
          this.etiquetasPersonaJuridica = JSON.parse(
            n["body"]
          ).comboEtiquetasItems;

          // en cada busqueda vaciamos el vector para añadir las nuevas etiquetas
          this.etiquetasPersonaJuridicaSelecionados = [];
          this.etiquetasPersonaJuridica.forEach((value: any, index: number) => {
            this.etiquetasPersonaJuridicaSelecionados.push(value);
            // this.generalBody.
          });

          this.etiquetasPersonaJuridicaSelecionados.forEach(
            (value: any, index: number) => {
              let pruebaComboE: ComboEtiquetasItem = new ComboEtiquetasItem();
              pruebaComboE = value;
              this.updateItems.set(value.idGrupo, pruebaComboE);
            }
          );

          this.createItems = this.etiquetasPersonaJuridicaSelecionados;
        },
        err => {
          console.log(err);
        }
      );
  }

  busquedaIdioma() {
    this.sigaServices.get("etiquetas_lenguaje").subscribe(
      n => {
        this.idiomas = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  datosGeneralesSearch() {
    this.progressSpinner = true;

    this.body.idPersona = this.idPersona;
    this.body.idLenguaje = "";
    this.body.idInstitucion = "";
    this.sigaServices
      .postPaginado(
        "busquedaPerJuridica_datosGeneralesSearch",
        "?numPagina=1",
        this.body
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.personaSearch = JSON.parse(data["body"]);
          if (this.personaSearch.personaJuridicaItems.length != 0) {
            this.body = this.personaSearch.personaJuridicaItems[0];
            this.selectedTipo = this.body.tipo;
          } else {
            this.body = new DatosGeneralesItem();
          }
          this.comprobarValidacion();
        },
        error => {
          this.personaSearch = JSON.parse(error["error"]);
          this.showFail(JSON.stringify(this.personaSearch.error.description));
          console.log(error);
          this.progressSpinner = false;
        },
        () => {
          // obtengo los idiomas y establecer el del la persona jurídica
          this.idiomaPreferenciaSociedad = this.body.idLenguajeSociedad;
          // si esta en modo edicion y guarda => rellenar tipo
          if (this.editar) {
            this.comboTipo = [];

            if (this.body.tipo != undefined) {
              let newTipo = this.comboIdentificacion.find(
                item => item.value == this.body.tipo
              );
              this.comboTipo.push(newTipo.label);
            }
          }
          this.showGuardar = false;
          this.editar = false;
          // restablece motivo de auditoria
          this.body.motivo = undefined;
        }
      );
  }

  getTipo(event) {
    this.body.tipo = event.value;
  }

  createLegalPerson() {
    this.sigaServices.post("datosGenerales_insert", this.body).subscribe(
      data => {
        this.body.fechaConstitucion = new Date();
        this.showSuccess();
      },
      error => {
        this.personaSearch = JSON.parse(error["error"]);
        this.showFail(JSON.stringify(this.personaSearch.error.description));
        console.log(error);
      }
    );
  }

  guardar() {
    this.progressSpinner = true;
    if (sessionStorage.getItem("nuevoRegistro") != null) {
      // comprobacion de cif
      if (this.isValidCIF(this.body.nif)) {
        this.body.idPersona = this.idPersona;
        this.body.idioma = this.idiomaPreferenciaSociedad;
        this.body.tipo = this.selectedTipo.value;
        this.body.etiquetas = this.createItems;
        // this.body.motivo = "registro creado";

        console.log("BODY", this.body);

        this.sigaServices
          .post("busquedaPerJuridica_create", this.body)
          .subscribe(
            data => {
              let respuesta = JSON.parse(data["body"]);
              this.idPersona = respuesta.id;
            },
            error => {
              let e = JSON.parse(error["error"]).error;
              if (e.message == "messages.censo.nifcifExiste2") {
                this.showFail(e.message);
                this.progressSpinner = false;
                this.showGuardar = false;
              }
            },
            () => {

              sessionStorage.removeItem("nuevoRegistro");
              this.cerrarAuditoria();
              let arrayPersonaJuridica = new Array<PersonaJuridicaItem>();
              this.bodyPersonaJuridica = new PersonaJuridicaItem();
              this.bodyPersonaJuridica.idPersona = this.idPersona;
              this.bodyPersonaJuridica.nif = this.body.nif;
              let selectedComboTipo = this.comboIdentificacion.find(
                item => item.value == this.body.tipo
              );
              this.bodyPersonaJuridica.tipo = selectedComboTipo.label;
              arrayPersonaJuridica.push(this.bodyPersonaJuridica);

              sessionStorage.setItem(
                "usuarioBody",
                JSON.stringify(arrayPersonaJuridica)
              );

              // pasamos el idPersona creado para la nueva sociedad
              if (this.file != undefined) {
                this.guardarImagen(this.idPersona);
              }
              this.cargarImagen(this.idPersona);

              this.body.idPersona = this.idPersona;
              this.obtenerEtiquetasPersonaJuridicaConcreta();
              this.datosGeneralesSearch();
              this.comboTipo = [];
              this.comboTipo.push(selectedComboTipo.label);
              this.editar = false;
              this.showSuccess();
              this.cardService.searchNewAnnounce.next(this.idPersona);
              this.autocompletar = false;
              this.progressSpinner = false;
            }
          );
      }
    } else {
      this.body.etiquetas = [];
      this.body.idioma = this.idiomaPreferenciaSociedad;

      for (let i in this.etiquetasPersonaJuridicaSelecionados) {
        this.body.etiquetas[i] = this.etiquetasPersonaJuridicaSelecionados[
          i
        ];

        if (this.body.etiquetas[i].value != "" && this.body.etiquetas[i].value != null &&
          this.body.etiquetas[i].value != undefined) {
          this.body.etiquetas[i].idGrupo = this.body.etiquetas[i].value
        }
      }

      // let finalUpdateItems: any[] = [];
      // this.updateItems.forEach((valorMap: ComboEtiquetasItem, key: string) => {
      //   this.etiquetasPersonaJuridicaSelecionados.forEach(
      //     (valorSeleccionados: any, index: number) => {
      //       if (
      //         valorSeleccionados.idGrupo == valorMap.idGrupo &&
      //         valorSeleccionados.label == valorMap.label &&
      //         valorSeleccionados.idInstitucion == valorMap.idInstitucion
      //       ) {
      //         finalUpdateItems.push(valorMap);
      //       } else if (
      //         valorSeleccionados.value == valorMap.idGrupo &&
      //         valorSeleccionados.label == valorMap.label &&
      //         valorSeleccionados.idInstitucion == valorMap.idInstitucion
      //       ) {
      //         finalUpdateItems.push(valorMap);
      //       }
      //     }
      //   );
      // });

      // this.body.etiquetas = finalUpdateItems;

      // this.body.motivo = "registro actualizado";

      // pasamos el idPersona creado para la nueva sociedad
      if (this.file != undefined) {
        this.guardarImagen(this.idPersona);
      }

      this.sigaServices.post("busquedaPerJuridica_update", this.body).subscribe(
        data => { },
        error => {
          this.personaSearch = JSON.parse(error["error"]);
          this.showFail(JSON.stringify(this.personaSearch.error.description));
          this.progressSpinner = false;
        },
        () => {
          this.updateItems.clear();
          this.cerrarAuditoria();
          this.cargarImagen(this.body.idPersona);
          this.datosGeneralesSearch();
          this.obtenerEtiquetasPersonaJuridicaConcreta();
          this.showSuccess();
          this.autocompletar = false;
          this.progressSpinner = false;
        }
      );
    }

    //sessionStorage.removeItem("crearnuevo");
  }

  restablecer() {
    // si ya existe la sociedad
    if (sessionStorage.getItem("crearnuevo") == null) {
      this.datosGeneralesSearch();
      this.obtenerEtiquetasPersonaJuridicaConcreta();
      this.cargarImagen(this.body.idPersona);
      this.file = undefined;
      // Para las etiquetas
      this.autocompletar = false;
    } else {
      this.body.nif = "";
      this.selectedTipo = [];
      this.body.fechaConstitucion = null;
      this.body.fechaBaja = null;
      this.body.denominacion = "";
      this.body.abreviatura = "";
      this.idiomaPreferenciaSociedad = "";
      this.body.cuentaContable = "";
      this.body.anotaciones = "";
      this.etiquetasPersonaJuridicaSelecionados = [];

      this.showGuardar = false;
      // Para las etiquetas
      this.autocompletar = false;
    }
  }

  cargarImagen(idPersona: String) {
    let datosParaImagenJuridica: DatosGeneralesItem = new DatosGeneralesItem();
    datosParaImagenJuridica.idPersona = idPersona;

    this.sigaServices
      .postDownloadFiles(
        "personaJuridica_cargarFotografia",
        datosParaImagenJuridica
      )
      .subscribe(data => {
        const blob = new Blob([data], { type: "text/csv" });
        if (blob.size == 0) {
          this.existeImagen = false;
        } else {
          let urlCreator = window.URL;
          this.imagenPersonaJuridica = this.sanitizer.bypassSecurityTrustUrl(
            urlCreator.createObjectURL(blob)
          );
          this.existeImagen = true;
        }
      });
  }

  guardarImagen(idPersona: String) {
    this.sigaServices
      .postSendFileAndParameters(
        "personaJuridica_uploadFotografia",
        this.file,
        idPersona
      )
      .subscribe(
        data => {
          this.file = undefined;
          this.cargarImagen(this.idPersona);
        },
        error => {
          console.log(error);
        }
      );
  }

  uploadImage(event: any) {
    // guardamos la imagen en front para despues guardarla, siempre que tenga extension de imagen
    let fileList: FileList = event.files;

    let nombreCompletoArchivo = fileList[0].name;
    let extensionArchivo = nombreCompletoArchivo.substring(
      nombreCompletoArchivo.lastIndexOf("."),
      nombreCompletoArchivo.length
    );

    if (
      extensionArchivo == null ||
      extensionArchivo.trim() == "" ||
      !/\.(gif|jpg|jpeg|tiff|png)$/i.test(extensionArchivo.trim().toUpperCase())
    ) {
      // Mensaje de error de formato de imagen y deshabilitar boton guardar
      this.file = undefined;
      this.archivoDisponible = false;
      this.existeImagen = false;
      this.showFailUploadedImage();
    } else {
      // se almacena el archivo para habilitar boton guardar
      this.file = fileList[0];
      this.archivoDisponible = true;
      //
      this.existeImagen = true;
      let urlCreator = window.URL;
      this.imagenPersonaJuridica = this.sanitizer.bypassSecurityTrustUrl(
        urlCreator.createObjectURL(this.file)
      );
    }

    // para comprobar los cambios de la imagen tambien
    this.onChangeForm();
  }

  abreCierraFicha() {
    // let fichaPosible = this.getFichaPosibleByKey(key);
    if (this.tarjeta == '2' || this.tarjeta == '3') {
      // fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }

  backTo() {
    this.location.back();
  }

  onChangeForm() {
    // modo creacion
    if (this.editar) {
      if (this.body.nif.length == 9 && this.isValidCIF(this.body.nif)) {
        // rellena el filtro tipo según el cif aplicado
        this.selectedTipo = this.comboIdentificacion.find(
          item => item.value == this.body.nif[0]
        );

        // si no corresponde con ninguna sociedad => otro tipo de sociedad
        if (this.selectedTipo == undefined) {
          this.selectedTipo = this.comboIdentificacion.find(
            item => item.value == "V"
          );
        }

        this.identificacionValida = true;
      } else {
        this.selectedTipo = this.comboIdentificacion[0];
        this.identificacionValida = false;
      }
    }

    if (
      this.body.abreviatura != "" &&
      this.body.abreviatura != undefined &&
      !this.onlySpaces(this.body.abreviatura) &&
      this.body.nif != "" &&
      this.body.nif != undefined &&
      !this.onlySpaces(this.body.nif) &&
      this.body.denominacion != "" &&
      this.body.denominacion != undefined &&
      !this.onlySpaces(this.body.denominacion) &&
      this.body.fechaConstitucion != undefined &&
      !this.onlySpaces(this.body.nif) &&
      this.idiomaPreferenciaSociedad != "" &&
      this.idiomaPreferenciaSociedad != undefined
      //this.file != undefined
    ) {
      if (
        this.editar &&
        (this.body.fechaConstitucion != undefined ||
          this.body.fechaConstitucion != null)
      ) {
        if (this.body.nif.length == 9 && this.isValidCIF(this.body.nif)) {
          this.showGuardar = true;
        }
      } else {
        this.showGuardar = true;
      }
    } else {
      this.showGuardar = false;
    }

    this.comprobarValidacion();
  }

  comprobarAuditoria() {
    // modo creación
    if (sessionStorage.getItem("crearnuevo") != null) {
      this.guardar();
    }
    // modo edición
    else {
      // mostrar la auditoria depende de un parámetro que varía según la institución
      this.body.motivo = undefined;

      if (this.ocultarMotivo) {
        this.guardar();
      } else {
        this.displayAuditoria = true;
        this.showGuardarAuditoria = false;
      }
    }
  }

  cerrarAuditoria() {
    this.displayAuditoria = false;
  }

  comprobarCampoMotivo() {
    if (
      this.body.motivo != undefined &&
      this.body.motivo != "" &&
      this.body.motivo.trim() != ""
    ) {
      this.showGuardarAuditoria = true;
    } else {
      this.showGuardarAuditoria = false;
    }
  }

  onlySpaces(str) {
    let i = 0;
    var ret;
    ret = true;
    if (str != null) {
      while (i < str.length) {
        if (str[i] != " ") {
          ret = false;
        }
        i++;
      }
    }

    return ret;
  }

  showSuccessUploadedImage() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant(
        "general.message.logotipo.actualizado"
      )
    });
  }

  showFailUploadedImage() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: "Formato incorrecto de imagen seleccionada"
    });
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showError() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  showCustomFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(mensaje)
    });
  }

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(mensaje)
    });
  }

  clear() {
    this.msgs = [];
  }

  comprobarValidacion() {
    if (
      (this.body.nif != undefined && this.body.nif.length == 9) &&
      this.isValidCIF(this.body.nif) &&
      !this.onlySpaces(this.body.denominacion) &&
      (this.body.fechaConstitucion != undefined ||
        this.body.fechaConstitucion != null) &&
      this.body.denominacion != "" &&
      this.body.denominacion != undefined &&
      !this.onlySpaces(this.body.denominacion)
    ) {
      this.isValidate = true;
    } else {
      this.isValidate = false;
    }
    this.cardService.newCardValidator$.subscribe(data => {
      data.map(result => {
        result.cardGeneral = this.isValidate;
      });
      console.log(data);
      console.log("DAtos generales", this.progressSpinner);
    });
  }

  habilitarAutocompletar(event) {
    if (event) {
      this.autocompletar = true;
    } else {
      this.autocompletar = false;
    }
  }

  disabledAutocomplete() {
    this.autocompletar = true;
  }

  // ETIQUETAS

  filterLabelsMultiple(event) {
    let etiquetasPuestas = [];
    if (this.etiquetasPersonaJuridicaSelecionados) {
      etiquetasPuestas = this.etiquetasPersonaJuridicaSelecionados;
    }
    this.sigaServices.get("busquedaPerJuridica_etiquetas").subscribe(
      n => {
        // coger todas las etiquetas
        let etiquetasSugerencias = this.filterLabel(event.query, n.comboItems);

        if (etiquetasPuestas.length > 0) {
          this.comboEtiquetas = [];

          etiquetasSugerencias.forEach(element => {
            let find = etiquetasPuestas.find(x => x.label === element.label);
            if (find == undefined) {
              this.comboEtiquetas.push(element);
            }
          });
        } else {
          this.comboEtiquetas = etiquetasSugerencias;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  filterLabel(query, etiquetas: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < etiquetas.length; i++) {
      let etiqueta = etiquetas[i];

      if (etiqueta.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(etiqueta);
      }
    }

    if (filtered.length == 0) {
      this.control = true;
    } else {
      this.control = false;
    }

    return filtered;
  }

  // Evento para detectar la etiqueta de nueva creación
  onKeyUp(event) {
    if (event.keyCode == 13) {
      event.currentTarget.value = "";
    }
  }

  isNotContains(event): boolean {
    var keepGoing = true;
    this.updateItems.forEach(element => {
      if (keepGoing) {
        if (element.idGrupo == event.value && element.idInstitucion == event.idInstitucion) {
          keepGoing = false;
        }
      }
    });

    return keepGoing;
  }

  isNotContainsEtiq(event): boolean {
    var keepGoing = true;
    this.etiquetasPersonaJuridicaSelecionados.forEach(element => {
      if (element.label == event.label) {
        keepGoing = false;
      }
    });

    return keepGoing;
  }

  // Evento para detectar una etiqueta existente
  onSelect(event) {
    if (event) {
      if (this.isNotContains(event)) {
        // Variable controlador del deshabilitar fechas
        this.historico = false;

        // Rellenamos los valores de la etiqueta
        this.item = new ComboEtiquetasItem();
        this.item.idGrupo = event.value;
        this.item.label = event.label;
        this.item.idInstitucion = event.idInstitucion;

        // this.mensaje = this.translateService.instant(
        //   "censo.etiquetas.literal.rango"
        // );

        this.createItems.push(this.item);
        this.updateItems.set(this.item.idGrupo, this.item);

        if (
          this.body.abreviatura != "" &&
          this.body.abreviatura != undefined &&
          !this.onlySpaces(this.body.abreviatura) &&
          this.body.nif != "" &&
          this.body.nif != undefined &&
          !this.onlySpaces(this.body.nif) &&
          this.body.denominacion != "" &&
          this.body.denominacion != undefined &&
          !this.onlySpaces(this.body.denominacion) &&
          this.body.fechaConstitucion != undefined &&
          !this.onlySpaces(this.body.nif) &&
          this.idiomaPreferenciaSociedad != "" &&
          this.idiomaPreferenciaSociedad != undefined
        ) {
          this.showGuardar = true;
        }
      } else {
        // Si existe en el array, lo borramos para que no queden registros duplicados
        for (
          let i = 0;
          i < this.etiquetasPersonaJuridicaSelecionados.length;
          i++
        ) {
          if (
            this.etiquetasPersonaJuridicaSelecionados[i].idGrupo == undefined
          ) {
            if (
              this.etiquetasPersonaJuridicaSelecionados[i].label == event.label &&
              this.etiquetasPersonaJuridicaSelecionados[i].idInstitucion == event.idInstitucion
            ) {
              this.etiquetasPersonaJuridicaSelecionados.splice(i, 1);
            }
          } else {
            if (
              this.etiquetasPersonaJuridicaSelecionados[i].idGrupo ==
              event.value &&
              this.etiquetasPersonaJuridicaSelecionados[i].idInstitucion == event.idInstitucion
            ) {
              this.etiquetasPersonaJuridicaSelecionados.splice(i, 1);
              this.onUnselect(event);
            }
          }
        }
        if (
          this.updateItems.size >
          this.etiquetasPersonaJuridicaSelecionados.length
        ) {
          this.updateItems.delete(event.value);
        }
      }
    }
  }

  onUnselect(event) {
    if (event) {
      if (event.value == undefined) {
        this.updateItems.delete(event.idGrupo);
        this.showGuardar = true;
      } else {
        this.updateItems.delete(event.value);
        this.showGuardar = true;
      }
    }
  }

  deleteLabel(item) {
    for (let i = 0; i < this.etiquetasPersonaJuridicaSelecionados.length; i++) {
      if (this.etiquetasPersonaJuridicaSelecionados[i].idGrupo == undefined) {
        if (this.etiquetasPersonaJuridicaSelecionados[i].label == item.label &&
          this.etiquetasPersonaJuridicaSelecionados[i].idInstitucion == item.idInstitucion) {
          this.etiquetasPersonaJuridicaSelecionados.splice(i, 1);
        }
      } else {
        if (
          this.etiquetasPersonaJuridicaSelecionados[i].idGrupo == item.value &&
          this.etiquetasPersonaJuridicaSelecionados[i].idInstitucion == item.idInstitucion
        ) {
          this.etiquetasPersonaJuridicaSelecionados.splice(i, 1);
          this.onUnselect(event);
        }
      }
    }
  }

  closeDialogConfirmation(item) {
    // this.checked = false;
    // if (this.isCrear) {
    //   // Borramos el residuo de la etiqueta
    //   this.autoComplete.multiInputEL.nativeElement.value = null;
    // } else {
    //   // Borramos el residuo de la etiqueta vieja
    //   this.deleteLabel(item);
    // }
    // // Borramos las fechas
    // this.item = new ComboEtiquetasItem();
    // this.item.fechaInicio = null;
    // this.item.fechaBaja = null;
  }

  validateFields() {
    if (
      this.item.fechaInicio != undefined &&
      this.item.fechaInicio != null
      // this.item.fechaBaja != undefined &&
      // this.item.fechaBaja != null &&
      // this.validateFinalDate() == true
    ) {
      this.fechaHoy = this.transformaFecha(this.item.fechaInicio);
      this.isTrue = true;
    } else {
      this.isTrue = false;
    }
  }

  transformaFecha(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate = jsonDate.slice(1, -1);
    if (rawDate.length < 14) {
      let splitDate = rawDate.split("/");
      let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
      fecha = new Date((arrayDate += "T00:00:00.001Z"));
    } else {
      fecha = new Date(fecha);
    }
    return fecha;
  }

  aceptDialogConfirmation(item) {
    // this.checked = false;
    // if (this.isCrear) {
    //   let newItem = new ComboEtiquetasItem();
    //   newItem = item;
    //   newItem.fechaInicio = this.datepipe.transform(
    //     newItem.fechaInicio,
    //     "dd/MM/yyyy"
    //   );
    //   newItem.fechaBaja = this.datepipe.transform(
    //     newItem.fechaBaja,
    //     "dd/MM/yyyy"
    //   );
    //   this.createItems.push(newItem);
    //   this.updateItems.set(newItem.label, newItem);
    //   if (this.isNotContainsEtiq(newItem)) {
    //     this.etiquetasPersonaJuridicaSelecionados.push(newItem);
    //   }
    //   this.autoComplete.multiInputEL.nativeElement.value = null;
    // } else {
    //   let oldItem = new ComboEtiquetasItem();
    //   oldItem = item;
    //   oldItem.fechaInicio = this.datepipe.transform(
    //     oldItem.fechaInicio,
    //     "dd/MM/yyyy"
    //   );
    //   oldItem.fechaBaja = this.datepipe.transform(
    //     oldItem.fechaBaja,
    //     "dd/MM/yyyy"
    //   );
    //   this.createItems.push(oldItem);
    //   this.updateItems.set(oldItem.idGrupo, oldItem);
    // }
    // // Dehabilitamos el guardar para los próximos
    // this.isTrue = false;
    // // Habilitamos el botón guardar, dado que se ha detectado un cambio
    // if (
    //   this.body.abreviatura != "" &&
    //   this.body.abreviatura != undefined &&
    //   !this.onlySpaces(this.body.abreviatura) &&
    //   this.body.nif != "" &&
    //   this.body.nif != undefined &&
    //   !this.onlySpaces(this.body.nif) &&
    //   this.body.denominacion != "" &&
    //   this.body.denominacion != undefined &&
    //   !this.onlySpaces(this.body.denominacion) &&
    //   this.body.fechaConstitucion != undefined &&
    //   !this.onlySpaces(this.body.nif) &&
    //   this.idiomaPreferenciaSociedad != "" &&
    //   this.idiomaPreferenciaSociedad != undefined
    // ) {
    //   this.showGuardar = true;
    // }
  }

  validateFinalDate(): boolean {
    if (this.item.fechaBaja != undefined && this.item.fechaBaja != null) {
      if (this.item.fechaInicio >= this.item.fechaBaja) {
        this.isFechaBajaCorrect = false;
      } else {
        this.isFechaBajaCorrect = true;
      }
    }

    return this.isFechaBajaCorrect;
  }

  onBlur(event) {
    event.currentTarget.value = "";
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  fillFechaConstitucion(event) {
    this.body.fechaConstitucion = event;
    this.onChangeForm();
  }

  detectFechaConstitucionInput(event) {
    this.body.fechaConstitucion = event;
    this.onChangeForm();
  }

  fillFechaBaja(event) {
    this.item.fechaBaja = event;
    this.validateFields();
  }

  detectFechaBajaInput(event) {
    this.item.fechaBaja = event;
    this.validateFields();
  }

  fillFechaInicio(event) {
    this.item.fechaInicio = event;
    this.validateFields();
  }

  detectFechaInicioInput(event) {
    this.item.fechaInicio = event;
    this.validateFields();
  }

  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "285";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjeta = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        this.continueOnInit();
      }
    );
  }
}
