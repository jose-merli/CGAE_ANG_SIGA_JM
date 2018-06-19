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

/*** COMPONENTES ***/
import { FichaColegialComponent } from "./../../../new-features/censo/ficha-colegial/ficha-colegial.component";
import { DatosGeneralesComponent } from "./../../../new-features/censo/ficha-colegial/datos-generales/datos-generales.component";
import { DatosColegialesComponent } from "./../../../new-features/censo/ficha-colegial/datos-colegiales/datos-colegiales.component";
import { DatosGeneralesItem } from "./../../../../app/models/DatosGeneralesItem";
import { DatosGeneralesObject } from "./../../../../app/models/DatosGeneralesObject";
import { MultiSelectModule } from "primeng/multiSelect";
 
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
  comboIdentificacion: any[];
  comboTipo: any[] = [];
  fecha;
  idiomas: any[] = [
    { label: "Seleccione un idioma", value: "" },
    { label: "Castellano", value: "castellano" },
    { label: "Catalá", value: "catalan" },
    { label: "Euskara", value: "euskera" },
    { label: "Galego", value: "gallego" }
  ];
  usuarioBody: any[];
  edadCalculada: String;
  textSelected: String = "{0} grupos seleccionados";
  idPersona: String;
  tipoPersonaJuridica: String;
  datos: any[];
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
    private sigaServices: SigaServices,
    private headerGestionEntidadService: HeaderGestionEntidadService
  ) {
    this.formBusqueda = this.formBuilder.group({
      cif: null
    });
  }

  ngOnInit() {
    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));

    this.idPersona = this.usuarioBody[0].idPersona;
    this.tipoPersonaJuridica = this.usuarioBody[0].tipo;

    this.datosGeneralesSearch();

    this.textFilter = "Elegir";
    this.sigaServices.get("busquedaPerJuridica_etiquetas").subscribe(
      n => {
        this.comboEtiquetas = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    // Combo de identificación
    this.sigaServices.get("busquedaPerJuridica_tipo").subscribe(
      n => {
        this.comboIdentificacion = n.combooItems;
      },
      error => {}
    );

    // Combo de tipo persona
    // this.sigaServices.get("datosGenerales_tipo").subscribe(
    //   n => {
    //     this.comboTipo = n.combooItems;
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );

    this.comboTipo.push(this.tipoPersonaJuridica);

    // if (sessionStorage.getItem("idPersona") != null) {
    //   this.sigaServices
    //     .postPaginado(
    //       "datos_generales_search",
    //       "?numPagina=1",
    //       sessionStorage.getItem("idPersona")
    //     )
    //     .subscribe(
    //       data => {
    //         console.log(data);
    //         // this.search = JSON.parse(data["body"]);
    //         // this.datos = this.search.contadorItems;
    //         // console.log(this.datos);
    //         this.table.reset();
    //       },
    //       err => {
    //         console.log(err);
    //       }
    //     );
    //   sessionStorage.removeItem("idPersona");
    // }

    // this.cols = [
    //   { field: "tipoDireccion", header: "Tipo dirección" },
    //   { field: "direccion", header: "Dirección" },
    //   { field: "cp", header: "Código postal" },
    //   { field: "poblacion", header: "Población" },
    //   { field: "telefono", header: "Teléfono" },
    //   { field: "fax", header: "Fax" },
    //   { field: "movil", header: "Movil" },
    //   { field: "email", header: "Email" },
    //   { field: "preferente", header: "Preferente" }
    // ];

    // this.select = [
    //   { label: "", value: null },
    //   { label: "NIF", value: "nif" },
    //   { label: "Pasaporte", value: "pasaporte" },
    //   { label: "NIE", value: "nie" }
    // ];

    // this.datosDirecciones = [
    //   {
    //     id: 0,
    //     tipoDireccion:
    //       "CensoWeb, Despacho, Facturación, Guardia, Guía Judicial, Pública, Revista, Traspaso a organos judiciales",
    //     direccion: "C/ CARDENAL CISNEROS 42-1º",
    //     cp: "03660",
    //     poblacion: "Novelda",
    //     telefono: "99999",
    //     fax: "2434344",
    //     movil: "88888",
    //     email: "email@redabogacia.org",
    //     preferente: "correo,Mail,Fax,SMS"
    //   }
    // ];

    // this.rowsPerPage = [
    //   {
    //     label: 10,
    //     value: 10
    //   },
    //   {
    //     label: 20,
    //     value: 20
    //   },
    //   {
    //     label: "Todo",
    //     value: this.datosDirecciones.length
    //   }
    // ];

    // this.generos = [
    //   { label: "", value: "" },
    //   { label: "Mujer", value: "M" },
    //   { label: "Hombre", value: "H" }
    // ];
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
          this.body = this.personaSearch.personaJuridicaItems[0];
        },
        error => {
          this.personaSearch = JSON.parse(error["error"]);
          this.showFail(JSON.stringify(this.personaSearch.error.description));
          console.log(error);
          this.progressSpinner = false;
        }
      );
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
    this.body.idPersona = this.idPersona; //"2005005356";

    // guardar imagen en bd y refresca header.component
    // datosGenerales_update

    this.sigaServices.post("datosGenerales_update", this.body).subscribe(
      data => {
        this.showSuccess();
        console.log(data);
      },
      error => {
        this.personaSearch = JSON.parse(error["error"]);
        this.showFail(JSON.stringify(this.personaSearch.error.description));
        console.log(error);
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

            this.imagenURL = this.imagenURL + "?random=" + new Date().getTime();

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

  restablecer() {
    this.datosGeneralesSearch();
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

  abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = true;
  }

  cerrarFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = false;
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  onAbrirTodoClick() {
    this.showAll = !this.showAll;
    this.fichasPosibles.forEach((ficha: any) => {
      ficha.activa = this.showAll;
    });
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
    if (
      this.body.nif != "" &&
      this.body.nif != undefined &&
      (this.body.abreviatura != "" && this.body.abreviatura != undefined) &&
      (this.body.denominacion != "" && this.body.denominacion != undefined) &&
      this.body.fechaConstitucion != undefined &&
      (this.body.nif != "" && this.body.nif.length >= 9)
    ) {
      this.showGuardar = false;
    } else {
      this.showGuardar = true;
    }
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

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: mensaje
    });
  }
}
