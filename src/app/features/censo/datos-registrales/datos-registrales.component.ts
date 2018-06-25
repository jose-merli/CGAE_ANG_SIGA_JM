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

  fechaConstitucion: Date;
  fechaFin: Date;
  fechaCancelacion: Date;
  fechaRegistro: Date;

  sociedadProfesional: Boolean;
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
    }

    this.search();
    console.log(this.body);

    this.sigaServices.get("datosRegistrales_actividadesDisponible").subscribe(
      n => {
        this.actividadesDisponibles = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    this.getActividadesPersona();

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

  getActividadesPersona() {
    this.sigaServices
      .post("datosRegistrales_actividadesPersona", this.body)
      .subscribe(
        data => {
          this.body.actividades = [];
          let seleccionadas = JSON.parse(data["body"]).combooItems;
          seleccionadas.forEach((value: any, index: number) => {
            this.body.actividades.push(value.value);
          });
        },
        err => {
          console.log(err);
        }
      );
  }

  search() {
    this.body.idPersona = this.idPersonaEditar;
    this.getActividadesPersona();
    this.sigaServices
      .postPaginado("datosRegistrales_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          console.log(data);
          this.personaSearch = JSON.parse(data["body"]);
          this.body = this.personaSearch.datosRegistralesItems[0];
          if (this.body == undefined) {
            this.body = new DatosRegistralesItem();
          } else {
            this.body.idPersona = this.idPersonaEditar;
            this.fechaConstitucion = this.body.fechaConstitucion;
            this.fechaFin = this.body.fechaFin;
            this.fechaCancelacion = this.body.fechaCancelacion;
            this.fechaRegistro = this.body.fechaRegistro;
          }
          if (this.body.sociedadProfesional == "1") {
            this.sociedadProfesional = true;
          } else if (this.body.sociedadProfesional == "0") {
            this.sociedadProfesional = false;
          }
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
    this.body.idPersona = this.idPersonaEditar;
    if (this.selectActividad != undefined) {
      this.body.actividades = [];
      this.selectActividad.forEach((value: ComboItem, key: number) => {
        this.body.actividades.push(value.value);
      });
    } else {
      this.body.actividades = [];
    }
    if (this.body.companiaAseg == undefined) this.body.companiaAseg = "";

    if (this.body.numeroPoliza == undefined) this.body.numeroPoliza = "";

    if (this.sociedadProfesional == true) {
      this.body.sociedadProfesional = "1";
    } else {
      this.body.sociedadProfesional = "0";
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
      },
      () => {
        this.search();
      }
    );
  }

  arreglarFechas() {
    if (this.fechaConstitucion != undefined) {
      this.body.fechaConstitucion = this.transformaFecha(
        this.fechaConstitucion
      );
    }
    if (this.fechaFin != undefined) {
      this.body.fechaFin = this.transformaFecha(this.fechaFin);
    }
    if (this.fechaRegistro != undefined) {
      this.body.fechaRegistro = this.transformaFecha(this.fechaRegistro);
    }
    if (this.fechaCancelacion != undefined) {
      this.body.fechaCancelacion = this.transformaFecha(this.fechaCancelacion);
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

  desactivadoGuardar() {
    if (
      this.body.objetoSocial != undefined &&
      !this.onlySpaces(this.body.objetoSocial) &&
      this.body.resena != undefined &&
      !this.onlySpaces(this.body.resena) &&
      this.fechaConstitucion != undefined &&
      this.body.identificadorRegistroProvincial != undefined &&
      !this.onlySpaces(this.body.identificadorRegistroProvincial) &&
      this.body.numeroRegistro != undefined &&
      !this.onlySpaces(this.body.numeroRegistro) &&
      this.fechaRegistro != undefined
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
