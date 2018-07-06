import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  Input
} from "@angular/core";
import { OldSigaServices } from "../../../_services/oldSiga.service";

import {
  /*** MODULOS ***/
  NgModule
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalendarModule } from "primeng/calendar";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DropdownModule } from "primeng/dropdown";
import { CheckboxModule } from "primeng/checkbox";
import { ButtonModule } from "primeng/button";
import { DataTableModule } from "primeng/datatable";
// import { MenubarModule } from 'primeng/menubar';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from "primeng/autocomplete";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TooltipModule } from "primeng/tooltip";
import { ChipsModule } from "primeng/chips";
import { RadioButtonModule } from "primeng/radiobutton";
import { FileUploadModule } from "primeng/fileupload";

import { Http, Response } from "@angular/http";
import { MenuItem } from "primeng/api";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { SelectItem } from "primeng/api";
import { esCalendar } from "../../../utils/calendar";
import { Router } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { Location } from "@angular/common";

import { SigaServices } from "./../../../_services/siga.service";
import { SigaWrapper } from "../../../wrapper/wrapper.class";
import { TranslateService } from "../../../commons/translate/translation.service";
import { HeaderGestionEntidadService } from "./../../../_services/headerGestionEntidad.service";
import { ComboItem } from "./../../../../app/models/ComboItem";

/*** COMPONENTES ***/
import { FichaColegialComponent } from "./../../../new-features/censo/ficha-colegial/ficha-colegial.component";
import { DatosGeneralesComponent } from "./../../../new-features/censo/ficha-colegial/datos-generales/datos-generales.component";
import { DatosColegialesComponent } from "./../../../new-features/censo/ficha-colegial/datos-colegiales/datos-colegiales.component";
import { DatosGeneralesItem } from "./../../../../app/models/DatosGeneralesItem";
import { DatosGeneralesObject } from "./../../../../app/models/DatosGeneralesObject";
import { MultiSelectModule } from "primeng/multiSelect";
import { Subscription } from "rxjs/Subscription";
import { cardService } from "./../../../_services/cardSearch.service";
import { ControlAccesoDto } from "./../../../../app/models/ControlAccesoDto";

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

  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = false;
  showDatosFacturacion: boolean = false;
  rowsPerPage: any = [];
  showAll: boolean = false;
  showGuardar: boolean = false;
  progressSpinner: boolean = false;

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
  activacionEditar: boolean;
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
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private location: Location,
    private cardService: cardService,
    private sigaServices: SigaServices,
    private headerGestionEntidadService: HeaderGestionEntidadService
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
    this.checkAcceso();
    this.busquedaIdioma();
    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));

    if (sessionStorage.getItem("crearnuevo") != null) {
      this.editar = true;
      this.abreCierraFicha("generales");
    }
    if (this.usuarioBody[0] != undefined) {
      this.idPersona = this.usuarioBody[0].idPersona;
      this.tipoPersonaJuridica = this.usuarioBody[0].tipo;
    }
    if (this.idPersona != undefined) {
      this.datosGeneralesSearch();
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

      this.sigaServices.post("busquedaPerJuridica_update", this.body).subscribe(
        data => {
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

      let lenguajeeImagen: boolean = false;
      if (this.file != undefined) {
        this.sigaServices
          .postSendFileAndParameters(
            "personaJuridica_uploadFotografia",
            this.file,
            this.body.idPersona
          )
          .subscribe(
            data => {
              console.log(data);
              this.file = undefined;
              this.archivoDisponible = false;

              // this.imagenURL =
              //   this.sigaServices.getNewSigaUrl() +
              //   this.sigaServices.getServucePath(
              //     "personaJuridica_cargarFotografia"
              //   ) +
              //   "?random=" +
              //   new Date().getTime();

              this.imagenURL = this.sigaServices.post(
                "personaJuridica_cargarFotografia",
                this.body
              );

              this.imagenURL =
                this.imagenURL + "?random=" + new Date().getTime();

              var ajsdka = this.imagenURL;
              if (!lenguajeeImagen) {
                this.showSuccessUploadedImage();
              }
            },
            err => {
              console.log(err);
            }
          );
      }
    }
  }

  restablecer() {
    this.datosGeneralesSearch();
    this.obtenerEtiquetasPersonaJuridicaConcreta();
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
      this.showFailUploadedImage();
    } else {
      // se almacena el archivo para habilitar boton guardar
      this.file = fileList[0];
      this.archivoDisponible = true;
    }
  }

  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (this.activacionEditar == true) {
      fichaPosible.activa = !fichaPosible.activa;
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

  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    console.log("image", this.uploadedFiles);
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "File Uploaded", detail: "" });
  }

  backTo() {
    this.location.back();
  }

  onChangeForm() {
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
    ) {
      if (
        this.editar &&
        (this.body.fechaConstitucion != undefined ||
          this.body.fechaConstitucion != null)
      ) {
        if (this.body.nif.length == 9 && this.isValidCIF(this.body.nif)) {
          this.showGuardar = true;
        }
      } else if (!this.editar) {
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
