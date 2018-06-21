import { OldSigaServices } from "../../../_services/oldSiga.service";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  Input,
  HostListener,
  SystemJsNgModuleLoader
} from "@angular/core";
import { CalendarModule } from "primeng/calendar";
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
import { TableModule } from "primeng/table";
import { SigaServices } from "./../../../_services/siga.service";
import { DropdownModule } from "primeng/dropdown";
import { DataTable } from "primeng/datatable";
import { TranslateService } from "../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { ButtonModule } from "primeng/button";
import { Router, ActivatedRoute } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { GrowlModule } from "primeng/growl";
import { ConfirmationService } from "primeng/api";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { ComboItem } from "./../../../../app/models/ComboItem";
import { MultiSelectModule } from "primeng/multiSelect";
import { ControlAccesoDto } from "./../../../../app/models/ControlAccesoDto";
import { Location, getLocaleDateTimeFormat, DatePipe } from "@angular/common";
import { Observable } from "rxjs/Rx";
import { BusquedaFisicaItem } from "./../../../../app/models/BusquedaFisicaItem";
import { BusquedaJuridicaItem } from "./../../../../app/models/BusquedaJuridicaItem";
import { BusquedaJuridicaObject } from "./../../../../app/models/BusquedaJuridicaObject";
import { BusquedaFisicaObject } from "./../../../../app/models/BusquedaFisicaObject";
import { DatosNotarioItem } from "../../../models/DatosNotarioItem";
/*** COMPONENTES ***/
import { DatosRetencionesObject } from "../../../../app/models/DatosRetencionesObject";
import { DatosRetencionesItem } from "../../../../app/models/DatosRetencionesItem";
import { DatosPersonaJuridicaComponent } from "../datosPersonaJuridica/datosPersonaJuridica.component";
export enum KEY_CODE {
  ENTER = 13
}
@Component({
  selector: "app-datos-retenciones",
  templateUrl: "./datos-retenciones.component.html",
  styleUrls: ["./datos-retenciones.component.scss"]
})
export class DatosRetencionesComponent implements OnInit {
  formBusqueda: FormGroup;
  cols: any = [];
  colsFisicas: any = [];
  colsJuridicas: any = [];
  tiposRetenciones: any[];
  colegios_seleccionados: any[];
  datos: any[];
  select: any[];
  es: any = esCalendar;
  selectedValue: string = "simple";
  textSelected: String = "{0} perfiles seleccionados";
  persona: String;
  // selectedDatos: any = []
  body: DatosRetencionesItem = new DatosRetencionesItem();
  newRetencion: DatosRetencionesItem = new DatosRetencionesItem();
  searchRetenciones: DatosRetencionesObject = new DatosRetencionesObject();
  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = false;
  showDatosFacturacion: boolean = false;
  isVolver: boolean = true;
  isCrear: boolean = false;
  isEditar: boolean = true;
  isEliminar: boolean = true;
  rowsPerPage: any = [];
  selectMultiple: boolean = false;
  progressSpinner: boolean = false;
  textFilter: String = "Elegir";
  buscar: boolean = false;
  selectAll: boolean = false;
  msgs: any[];
  usuarioBody: any[];
  selectedItem: number = 10;
  idPersona: String;
  @ViewChild("table") table;
  selectedDatos;
  tipoCIF: String;
  openFicha: boolean = false;
  masFiltros: boolean = false;
  labelFiltros: string;

  private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private location: Location,
    public datepipe: DatePipe
  ) {
    this.formBusqueda = this.formBuilder.group({
      cif: null,
      fechaNacimiento: new FormControl(null, Validators.required),
      fechaIncorporacion: new FormControl(null),
      fechaFacturacion: new FormControl(null)
    });
  }

  ngOnInit() {
    this.persona = "f";
    this.colsFisicas = [
      { field: "fechaInicio", header: "Fecha Desde" },
      { field: "fechaFin", header: "Fecha Hasta" },
      { field: "descripcionRetencion", header: "Tipo Rentencion IRPF" },
      { field: "porcentajeRetencion", header: "Porcentaje" }
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
    this.getTiposRetenciones();

    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    if (this.usuarioBody != undefined)
      this.idPersona = this.usuarioBody[0].idPersona;
    this.checkStatusInit();
    this.search();
  }
  getTiposRetenciones() {
    this.sigaServices.get("retenciones_tipoRetencion").subscribe(
      n => {
        this.tiposRetenciones = n.maestroRetencionItem;
      },
      err => {
        console.log(err);
      }
    );
  }
  onChangeForm() {
    console.log("AQUI LLEGA");
  }
  isValidDNI(dni: String): boolean {
    return (
      dni &&
      typeof dni === "string" &&
      /^[0-9]{8}([A-Za-z]{1})$/.test(dni) &&
      dni.substr(8, 9).toUpperCase() ===
        this.DNI_LETTERS.charAt(parseInt(dni.substr(0, 8), 10) % 23)
    );
  }
  isValidIBAN(iban: String): boolean {
    return (
      iban &&
      typeof iban === "string" &&
      /ES\d{2}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}|ES\d{22}/.test(iban)
    );
  }
  checkTypeCIF(value: String): boolean {
    if (this.isValidDNI(value)) {
      this.tipoCIF = "10";
      return true;
    } else if (this.isValidNIE(value)) {
      this.tipoCIF = "40";
      return true;
    } else if (this.isValidPassport(value)) {
      this.tipoCIF = "30";
      return true;
    } else {
      this.tipoCIF = "50";
      return false;
    }
  }
  isValidPassport(dni: String): boolean {
    return (
      dni && typeof dni === "string" && /^[a-z]{3}[0-9]{6}[a-z]?$/i.test(dni)
    );
  }
  isValidNIE(nie: String): boolean {
    return (
      nie &&
      typeof nie === "string" &&
      /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i.test(nie)
    );
  }
  isValidCIF(cif: String): boolean {
    return (
      cif &&
      typeof cif === "string" &&
      /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/.test(cif)
    );
  }

  checkStatusInit() {
    this.cols = this.colsFisicas;
  }
  volver() {
    this.search();
    this.isVolver = true;
    this.isCrear = false;
  }
  crear() {
    this.isVolver = false;
    this.isCrear = true;
    let value = this.table.first;
    // this.createArrayEdit(dummy, value);
    let valur2 = new Date().setMilliseconds(new Date().getMilliseconds());

    this.datos[0].fechaFin = this.datepipe.transform(
      new Date(valur2 - 86400000),
      "dd-MM-yyyy"
    );
    let dummy = {
      fechaInicio: this.datepipe.transform(new Date(valur2), "dd-MM-yyyy"),
      fechaFin: "-",
      descripcionRetencion: "",
      porcentajeRetencion: "-"
    };
    this.datos = [dummy, ...this.datos];

    console.log(this.datos);
    this.table.reset();
  }
  confirmEdit() {}
  confirmarBorrar() {}
  search() {
    this.progressSpinner = true;
    this.body.idPersona = this.idPersona;
    this.body.idInstitucion = "";
    this.body.idLenguaje = "";

    this.sigaServices
      .postPaginado("retenciones_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          console.log(data);

          this.searchRetenciones = JSON.parse(data["body"]);
          this.datos = this.searchRetenciones.retencionesItemList;
          this.progressSpinner = false;
          console.log("DATOS: " + this.datos.toString);
          // this.searchCatalogo = JSON.parse(data["body"]);
          // this.datosEdit = this.searchCatalogo.catalogoMaestroItem;
          // this.datosHist = this.searchCatalogo.catalogoMaestroItem;
        },
        err => {}
      );
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  isBuscar() {
    this.buscar = true;
  }

  irFichaColegial(id) {
    console.log(id);
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
    }
  }

  verMasFiltros() {
    this.masFiltros = !this.masFiltros;
  }

  abrirFicha() {
    this.openFicha = !this.openFicha;
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
    } else {
      this.selectedDatos = [];
    }
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }
}
