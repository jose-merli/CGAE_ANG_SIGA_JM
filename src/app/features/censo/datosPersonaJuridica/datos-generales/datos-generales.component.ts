import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { esCalendar } from "../../../../utils/calendar";
import { Message } from "primeng/components/common/api";
import { Location } from "@angular/common";
import { SigaServices } from "./../../../../_services/siga.service";

/*** COMPONENTES ***/
import { DatosGeneralesComponent } from "./../../../../new-features/censo/ficha-colegial/datos-generales/datos-generales.component";
import { DatosGeneralesItem } from "./../../../../../app/models/DatosGeneralesItem";
import { DatosGeneralesObject } from "./../../../../../app/models/DatosGeneralesObject";
import { Subscription } from "rxjs/Subscription";
import { cardService } from "./../../../../_services/cardSearch.service";

import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ControlAccesoDto } from "../../../../models/ControlAccesoDto";
import { TranslateService } from "../../../../commons/translate";

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
  etiquetasPersonaJuridicaSelecionados: any[] = [];
  comboIdentificacion: any[];
  comboTipo: any[] = [];
  idiomas: any[];
  usuarioBody: any[];
  edadCalculada: String;
  textSelected: String = "{0} etiquetas seleccionados";
  idPersona: String;
  tipoPersonaJuridica: String;
  datos: any[];
  selectedTipo: any;
  idiomaPreferenciaSociedad: String;

  existeImagen: boolean = false;
  imagenPersonaJuridica: any;

  cuentaIncorrecta: Boolean = false;

  @ViewChild(DatosGeneralesComponent)
  datosGeneralesComponent: DatosGeneralesComponent;

  @ViewChild("table") table;

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

  constructor(
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private location: Location,
    private cardService: cardService,
    private sanitizer: DomSanitizer,
    private sigaServices: SigaServices
  ) {
    this.formBusqueda = this.formBuilder.group({
      cif: null
    });
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
    this.checkAcceso();
  }
  continueOnInit() {
    this.busquedaIdioma();

    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    if (sessionStorage.getItem("crearnuevo") != null) {
      this.editar = true;
      this.abreCierraFicha();
    }

    if (this.usuarioBody[0] != undefined) {
      this.idPersona = this.usuarioBody[0].idPersona;
      this.tipoPersonaJuridica = this.usuarioBody[0].tipo;
    }

    // estamos en modo edicion (NO en creacion)
    if (this.idPersona != undefined) {
      this.datosGeneralesSearch();
      this.cargarImagen(this.body.idPersona);
    }
    this.textFilter = "Elegir";

    this.sigaServices.get("busquedaPerJuridica_etiquetas").subscribe(
      n => {
        // coger todas las etiquetas
        this.comboEtiquetas = n.combooItems;
      },
      err => {
        console.log(err);
      },
      () => {
        if (this.body.idPersona != undefined || this.body.idPersona != null) {
          this.obtenerEtiquetasPersonaJuridicaConcreta();
        }
      }
    );

    // Combo de identificación
    this.sigaServices.get("busquedaPerJuridica_tipo").subscribe(
      n => {
        this.comboIdentificacion = n.combooItems;
      },
      error => {}
    );

    this.comboTipo.push(this.tipoPersonaJuridica);
  }
  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "120";
    let derechoAcceso;
    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisosTree = JSON.parse(data.body);
        let permisosArray = permisosTree.permisoItems;
        derechoAcceso = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        if (derechoAcceso == 3) {
          this.activacionEditar = true;
        } else {
          this.activacionEditar = false;
        }
        this.continueOnInit();
      }
    );
  }

  obtenerEtiquetasPersonaJuridicaConcreta() {
    this.sigaServices
      .post("busquedaPerJuridica_etiquetasPersona", this.body)
      .subscribe(
        n => {
          // coger etiquetas de una persona juridica
          this.etiquetasPersonaJuridica = JSON.parse(n["body"]).combooItems;
          // en cada busqueda vaciamos el vector para añadir las nuevas etiquetas
          this.etiquetasPersonaJuridicaSelecionados = [];
          this.etiquetasPersonaJuridica.forEach((value: any, index: number) => {
            this.etiquetasPersonaJuridicaSelecionados.push(value.value);
          });
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
            let newTipo = this.comboIdentificacion.find(
              item => item.value == this.body.tipo
            );
            this.comboTipo.push(newTipo.label);
          }
          this.showGuardar = false;
          this.editar = false;
        }
      );
  }

  getTipo(event) {
    // this.selectedTipo = event.value;
    this.body.tipo = event.value;
    console.log(this.body.tipo);
  }

  createLegalPerson() {
    this.sigaServices.post("datosGenerales_insert", this.body).subscribe(
      data => {
        this.body.fechaConstitucion = new Date();
        this.showSuccess();
        console.log(data);
      },
      error => {
        this.personaSearch = JSON.parse(error["error"]);
        this.showFail(JSON.stringify(this.personaSearch.error.description));
        console.log(error);
      }
    );
  }

  guardar() {
    if (sessionStorage.getItem("crearnuevo") != null) {
      // comprobacion de cif
      if (this.isValidCIF(this.body.nif)) {
        this.body.idPersona = this.idPersona;

        if (this.etiquetasPersonaJuridicaSelecionados != undefined) {
          this.body.grupos = [];
          this.etiquetasPersonaJuridicaSelecionados.forEach(
            (value: String, key: number) => {
              this.body.grupos.push(value);
            }
          );
        }
        this.body.idioma = this.idiomaPreferenciaSociedad;
        this.body.tipo = this.selectedTipo.value;
        this.sigaServices
          .post("busquedaPerJuridica_create", this.body)
          .subscribe(
            data => {
              this.showSuccess();
              let respuesta = JSON.parse(data["body"]);
              this.idPersona = respuesta.id;
              sessionStorage.removeItem("crearnuevo");
              // pasamos el idPersona creado para la nueva sociedad
              if (this.file != undefined) {
                this.guardarImagen(this.idPersona);
              }
              this.cargarImagen(this.idPersona);
              this.datosGeneralesSearch();
              this.obtenerEtiquetasPersonaJuridicaConcreta();
              this.cardService.searchNewAnnounce.next(this.idPersona);
              this.editar = false;
            },
            error => {
              console.log(error);
              this.showError();
            }
          );
      } else {
        this.showFail("el cif introducido no es correcto");
      }
    } else {
      this.body.idPersona = this.idPersona; //"2005005356";

      // guardar imagen en bd y refresca header.component
      // datosGenerales_update o busquedaPerJuridica_update
      if (this.etiquetasPersonaJuridicaSelecionados != undefined) {
        this.body.grupos = [];
        this.etiquetasPersonaJuridicaSelecionados.forEach(
          (value: String, key: number) => {
            this.body.grupos.push(value);
          }
        );
      }
      this.body.idioma = this.idiomaPreferenciaSociedad;
      if (this.file != undefined) {
        this.guardarImagen(this.body.idPersona);
      }

      this.sigaServices.post("busquedaPerJuridica_update", this.body).subscribe(
        data => {
          this.cargarImagen(this.body.idPersona);
          this.showSuccess();
          console.log(data);
        },
        error => {
          this.personaSearch = JSON.parse(error["error"]);
          this.showFail(JSON.stringify(this.personaSearch.error.description));
          console.log(error);
        },
        () => {
          this.datosGeneralesSearch();
          this.obtenerEtiquetasPersonaJuridicaConcreta();
        }
      );
    }
  }

  restablecer() {
    // si ya existe la sociedad
    if (sessionStorage.getItem("crearnuevo") == null) {
      this.datosGeneralesSearch();
      this.obtenerEtiquetasPersonaJuridicaConcreta();
      this.cargarImagen(this.body.idPersona);
      this.file = undefined;
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
          this.showFail("messages.general.error.ficheroNoExiste");
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
          console.log(data);
          this.file = undefined;
        },
        error => {
          console.log(error);
        }
      );
  }

  uploadImage(event: any) {
    // guardamos la imagen en front para despues guardarla, siempre que tenga extension de imagen
    let fileList: FileList = event.target.files;

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
    if (this.activacionEditar == true) {
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
      this.body.nif != "" &&
      this.body.nif != undefined &&
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
      } else if (!this.editar && this.file != undefined) {
        this.showGuardar = true;
      } else {
        this.showGuardar = false;
      }
    } else {
      this.showGuardar = false;
    }

    // if (this.body.cuentaContable.length != 24) {
    //   this.cuentaIncorrecta = true;
    // } else {
    //   this.cuentaIncorrecta = false;
    // }
  }

  onlySpaces(str) {
    let i = 0;
    var ret;
    ret = true;
    while (i < str.length) {
      if (str[i] != " ") {
        ret = false;
      }
      i++;
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
      summary: "Incorrecto",
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: mensaje
    });
  }

  clear() {
    this.msgs = [];
  }
}
