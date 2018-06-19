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
import { ConfirmationService } from "primeng/api";
import { TooltipModule } from "primeng/tooltip";
import { ChipsModule } from "primeng/chips";
import { RadioButtonModule } from "primeng/radiobutton";
import { FileUploadModule } from "primeng/fileupload";
import { MultiSelectModule } from "primeng/multiSelect";

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
import { DatosRegistralesItem } from "./../../../../app/models/DatosRegistralesItem";
import { DatosRegistralesObject } from "./../../../../app/models/DatosRegistralesObject";
import { DatosPersonaJuridicaComponent } from "../datosPersonaJuridica/datosPersonaJuridica.component";

@Component({
  selector: "app-datos-registrales",
  templateUrl: "./datos-registrales.component.html",
  styleUrls: ["./datos-registrales.component.scss"]
})
export class DatosRegistralesComponent implements OnInit {
  uploadedFiles: any[] = [];
  formBusqueda: FormGroup;
  cols: any = [];
  datosDirecciones: any[];
  select: any[];
  es: any = esCalendar;
  msgs: Message[];
  body: DatosRegistralesItem = new DatosRegistralesItem();
  bodyviejo: DatosRegistralesItem = new DatosRegistralesItem();
  personaSearch: DatosRegistralesObject = new DatosRegistralesObject();

  fichasActivas: Array<any> = [];
  todo: boolean = false;
  textFilter: String = "Elegir";
  selectedDatos: any = [];

  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = false;
  showDatosFacturacion: boolean = false;
  rowsPerPage: any = [];
  showAll: boolean = false;

  selectedItem: number = 10;
  selectedDoc: string = "NIF";
  newDireccion: boolean = false;

  editar: boolean = false;
  archivoDisponible: boolean = false;
  file: File = undefined;
  base64String: any;
  source: any;
  imageBase64: any;
  imagenURL: any;
  generos: any[];
  tratamientos: any[];
  actividadesDisponibles: any[];
  fecha;

  fechaConst: Date;
  fechaBaja: Date;
  fechaReg: Date;
  fechaCanc: Date;

  selectActividad: any[];
  idiomas: any[] = [
    { label: "", value: "" },
    { label: "Castellano", value: "castellano" },
    { label: "Catalá", value: "catalan" },
    { label: "Euskara", value: "euskera" },
    { label: "Galego", value: "gallego" }
  ];
  textSelected: String = "{0} grupos seleccionados";
  idPersona: String;
  idPersonaEditar: String;
  datos: any[];
  @ViewChild(DatosRegistralesComponent)
  datosRegistralesComponent: DatosRegistralesComponent;

  @ViewChild("table") table;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private location: Location,
    private confirmationService: ConfirmationService,
    private sigaServices: SigaServices,
    private headerGestionEntidadService: HeaderGestionEntidadService,
    private fichasPosibles: DatosPersonaJuridicaComponent
  ) {
    this.formBusqueda = this.formBuilder.group({
      cif: null
    });
  }

  ngOnInit() {
    this.desactivadoGuardar();
    this.bodyviejo = JSON.parse(sessionStorage.getItem("usuarioBody"));
    if (this.bodyviejo != null) {
      this.body.idPersona = this.bodyviejo[0].idPersona;
      this.idPersonaEditar = this.bodyviejo[0].idPersona;
      sessionStorage.removeItem("usuarioBody");
      this.search();
    }
    this.body.idPersona = this.bodyviejo[0].idPersona;
    this.sigaServices
      .postPaginado("datosRegistrales_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          console.log(data);
          this.personaSearch = JSON.parse(data["body"]);
          if (this.personaSearch.datosRegistralesItems.length > 0)
            this.body = this.personaSearch.datosRegistralesItems[0];
          // this.datos = this.personaSearch.busquedaJuridicaItems;
        },
        err => {
          console.log(err);
        }
      );

    this.sigaServices.get("datosRegistrales_actividadesDisponible").subscribe(
      n => {
        this.actividadesDisponibles = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    this.sigaServices.get("datosRegistrales_actividadesPersona").subscribe(
      n => {
        this.body.actividades = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
    // this.sigaServices
    //   .post("datosRegistrales_actividadesPersona", this.body)
    //   .subscribe(
    //     n => {
    //       this.body.combooItems = n.combooItems;
    //     },
    //     err => {
    //       console.log(err);
    //     }
    //   );

    // datosRegistrales_search

    this.select = [
      { label: "", value: null },
      { label: "NIF", value: "nif" },
      { label: "Pasaporte", value: "pasaporte" },
      { label: "NIE", value: "nie" }
    ];

    this.generos = [
      { label: "", value: "" },
      { label: "Mujer", value: "M" },
      { label: "Hombre", value: "H" }
    ];
  }

  search() {
    this.sigaServices
      .postPaginado("datosRegistrales_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          console.log(data);
          this.personaSearch = JSON.parse(data["body"]);
          this.body = this.personaSearch.datosRegistralesItems[0];
          this.body.idPersona = this.idPersonaEditar;
          this.selectActividad = this.body.actividades;
          // this.datos = this.personaSearch.busquedaJuridicaItems;
        },
        err => {
          console.log(err);
        }
      );
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  guardar() {
    this.arreglarFechas();
    if (this.selectActividad != undefined) {
      this.body.actividades = [];
      this.selectActividad.forEach((value: ComboItem, key: number) => {
        this.body.actividades.push(value.value);
      });
    }
    if (this.body.companiaAseg == undefined) {
      this.body.companiaAseg = "";
    }
    if (this.body.numeroPoliza == undefined) {
      this.body.numeroPoliza = "";
    }
    console.log(this.body);
    this.sigaServices.post("datosRegistrales_update", this.body).subscribe(
      data => {
        this.showSuccess();
        console.log(data);
      },
      err => {
        this.showFail();
        console.log(err);
      }
    ),
      () => {
        this.search();
      };
  }

  transformaFecha(FechaJSON) {
    let fechaFinal;
    if (FechaJSON.length > 12) {
      FechaJSON = FechaJSON.substring(1, 11);
      let fechaFormateada: any[] = FechaJSON.split("-");
      // fechaFormateada[2] = parseInt(fechaFormateada[2]) + 1;
      fechaFinal =
        fechaFormateada[1] +
        "-" +
        fechaFormateada[2] +
        "-" +
        fechaFormateada[0];
    } else {
      let fechaFormateada: any[] = FechaJSON.split("-");
      fechaFinal =
        fechaFormateada[0] +
        "-" +
        fechaFormateada[1] +
        "-" +
        fechaFormateada[2];
    }
    return new Date(fechaFinal);
  }

  arreglarFechas() {
    let fechaConst1 = JSON.stringify(this.body.fechaConstitucion);
    let fechaBaja1 = JSON.stringify(this.body.fechaFin);
    let fechaReg1 = JSON.stringify(this.body.fechaRegistro);
    let fechaCanc1 = JSON.stringify(this.body.fechaCancelacion);

    if (fechaConst1 != undefined) {
      this.body.fechaConstitucion = this.transformaFecha(fechaConst1);
    }
    if (fechaBaja1 != undefined) {
      this.body.fechaFin = this.transformaFecha(fechaBaja1);
    }
    if (fechaReg1 != undefined) {
      this.body.fechaRegistro = this.transformaFecha(fechaReg1);
    }
    if (fechaCanc1 != undefined) {
      this.body.fechaCancelacion = this.transformaFecha(fechaCanc1);
    }
  }

  desactivadoGuardar() {
    if (
      this.body.objetoSocial != undefined &&
      !this.onlySpaces(this.body.objetoSocial) &&
      this.body.resena != undefined &&
      !this.onlySpaces(this.body.resena) &&
      this.body.fechaConstitucion != undefined &&
      this.body.identificadorRegistroProvincial != undefined &&
      !this.onlySpaces(this.body.identificadorRegistroProvincial) &&
      this.body.numeroRegistro != undefined &&
      !this.onlySpaces(this.body.numeroRegistro) &&
      this.body.fechaRegistro != undefined
    ) {
      return false;
    } else {
      return true;
    }
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

  restablecer() {
    this.arreglarFechas();
    this.search();
  }

  toSociedadProfesional() {
    let mess = this.translateService.instant(
      "¿Está seguro de que desea traspasar esta sociedad a Sociedad Profesional?"
    );
    let icon = "fas fa-book";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Confirmed",
            detail: "Sociedad traspasada correctamente"
          }
        ];
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Rejected",
            detail: "Acción cancelada por el usuario"
          }
        ];
      }
    });
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  onHideDatosColegiales() {
    this.showDatosColegiales = !this.showDatosColegiales;
  }
  onHideDatosFacturacion() {
    this.showDatosFacturacion = !this.showDatosFacturacion;
  }

  onChangeRowsPerPages(event) {
    console.log(event);
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
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
    this.fichasPosibles.getFichasPosibles().forEach((ficha: any) => {
      ficha.activa = this.showAll;
    });
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.getFichasPosibles().filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }
}
