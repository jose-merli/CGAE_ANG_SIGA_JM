import { OldSigaServices } from "../../../_services/oldSiga.service";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  Input,
  HostListener
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
import { Location } from "@angular/common";
import { Observable } from "rxjs/Rx";
import { BusquedaFisicaItem } from "./../../../../app/models/BusquedaFisicaItem";
import { BusquedaJuridicaItem } from "./../../../../app/models/BusquedaJuridicaItem";
import { BusquedaJuridicaObject } from "./../../../../app/models/BusquedaJuridicaObject";
import { BusquedaFisicaObject } from "./../../../../app/models/BusquedaFisicaObject";
import { DatosNotarioItem } from "../../../models/DatosNotarioItem";

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-busqueda-general",
  templateUrl: "./busqueda-general.component.html",
  styleUrls: ["./busqueda-general.component.scss"]
})
export class BusquedaGeneralComponent {
  formBusqueda: FormGroup;
  cols: any = [];
  colsFisicas: any = [];
  colsJuridicas: any = [];
  colegios_rol: any[];
  colegios_seleccionados: any[];
  datos: any[];
  select: any[];
  es: any = esCalendar;
  selectedValue: string = "simple";
  textSelected: String = "{0} perfiles seleccionados";
  persona: String;
  // selectedDatos: any = []
  bodyFisica: BusquedaFisicaItem = new BusquedaFisicaItem();
  bodyJuridica: BusquedaJuridicaItem = new BusquedaJuridicaItem();
  searchFisica: BusquedaFisicaObject = new BusquedaFisicaObject();
  searchJuridica: BusquedaJuridicaObject = new BusquedaJuridicaObject();
  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = false;
  showDatosFacturacion: boolean = false;
  rowsPerPage: any = [];
  selectMultiple: boolean = false;
  progressSpinner: boolean = false;
  textFilter: String = "Elegir";
  buscar: boolean = false;
  selectAll: boolean = false;
  msgs: any[];
  selectedItem: number = 10;
  @ViewChild("table") table;
  selectedDatos;
  tipoCIF: String;

  masFiltros: boolean = false;
  labelFiltros: string;
  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "colegiales",
      activa: false
    },
    {
      key: "facturacion",
      activa: false
    }
  ];
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
    private location: Location
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
      { field: "nif", header: "NIF/CIF" },
      { field: "nombre", header: "Nombre" },
      { field: "apellidos", header: "Apellidos" },
      { field: "colegio", header: "Colegio" },
      { field: "numeroColegiado", header: "Numero de Colegiado" },
      { field: "situacion", header: "Estado colegial" },
      { field: "residente", header: "Residencia" }
    ];
    this.colsJuridicas = [
      { field: "tipo", header: "Tipo" },
      { field: "nif", header: "NIF/CIF" },
      { field: "denominacion", header: "Denominacion" },
      { field: "fechaConstitucion", header: "Fecha Constitucion" },
      { field: "abreviatura", header: "Abreviatura" },
      { field: "numeroIntegrantes", header: "Número de integrantes" }
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
    this.sigaServices.get("busquedaPer_colegio").subscribe(
      n => {
        this.colegios_rol = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
    this.checkStatusInit();
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
  checkTypeCIF(value: String): boolean {
    if (this.isValidDNI(value)) {
      this.tipoCIF = "10";
      return true;
    } else if (this.isValidCIF(value)) {
      this.tipoCIF = "20";
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
  changeColsAndData() {
    if (this.persona == "f") {
      this.cols = this.colsFisicas;
      this.colegios_seleccionados = [];
      this.datos = [];
    } else {
      this.cols = this.colsJuridicas;
      this.colegios_seleccionados = [];
      this.datos = [];
    }
  }
  checkStatusInit() {
    if (this.persona == "f") {
      this.cols = this.colsFisicas;
    } else {
      this.cols = this.colsJuridicas;
    }
  }

  search() {
    this.progressSpinner = true;
    if (this.persona == "f") {
      if (this.bodyFisica.nif == undefined) {
        this.bodyFisica.nif = "";
      }
      if (this.colegios_seleccionados != undefined) {
        this.bodyFisica.idInstitucion = [];
        this.colegios_seleccionados.forEach((value: ComboItem, key: number) => {
          this.bodyFisica.idInstitucion.push(value.value);
        });
      } else {
        this.bodyFisica.idInstitucion = [];
      }
      if (this.bodyFisica.nombre == undefined) {
        this.bodyFisica.nombre = "";
      }
      if (this.bodyFisica.primerApellido == undefined) {
        this.bodyFisica.primerApellido = "";
      }
      if (this.bodyFisica.segundoApellido == undefined) {
        this.bodyFisica.segundoApellido = "";
      }
      if (this.bodyFisica.numeroColegiado == undefined) {
        this.bodyFisica.numeroColegiado = "";
      }
      this.checkTypeCIF(this.bodyFisica.nif);
      this.sigaServices
        .postPaginado(
          "busquedaPer_searchFisica",
          "?numPagina=1",
          this.bodyFisica
        )
        .subscribe(
          data => {
            console.log(data);
            this.progressSpinner = false;
            this.searchFisica = JSON.parse(data["body"]);
            this.datos = [];
            this.datos = this.searchFisica.busquedaFisicaItems;
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          },
          () => {
            if (
              this.datos.length == 0 ||
              this.datos == null ||
              this.datos == undefined
            ) {
              if (
                this.bodyFisica.nif != null &&
                this.bodyFisica.nif != undefined
              )
                if (this.bodyFisica.nombre.trim() == "")
                  if (
                    this.bodyFisica.primerApellido.trim() == "" &&
                    this.bodyFisica.segundoApellido.trim() == "" &&
                    this.bodyFisica.numeroColegiado.trim() == ""
                  ) {
                    this.noDataFoundWithDNI();
                  }
            }
          }
        );
    } else {
      if (this.bodyJuridica.tipo == undefined) {
        this.bodyJuridica.tipo = "";
      }
      if (this.bodyJuridica.nif == undefined) {
        this.bodyJuridica.nif = "";
      }
      if (this.bodyJuridica.denominacion == undefined) {
        this.bodyJuridica.denominacion = "";
      }
      if (this.bodyJuridica.numColegiado == undefined) {
        this.bodyJuridica.numColegiado = "";
      }
      this.bodyJuridica.idInstitucion = [];
      this.colegios_seleccionados.forEach((value: ComboItem, key: number) => {
        this.bodyJuridica.idInstitucion.push(value.value);
      });
      this.checkTypeCIF(this.bodyJuridica.nif);
      this.sigaServices
        .postPaginado(
          "busquedaPer_searchJuridica",
          "?numPagina=1",
          this.bodyJuridica
        )
        .subscribe(
          data => {
            console.log(data);
            this.progressSpinner = false;
            this.searchJuridica = JSON.parse(data["body"]);
            this.datos = this.searchJuridica.busquedaPerJuridicaItems;

            // this.table.paginator = true;
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          },
          () => {
            if (
              this.datos.length == 0 ||
              this.datos == null ||
              this.datos == undefined
            ) {
              if (
                this.bodyJuridica.nif != null &&
                this.bodyJuridica.nif != undefined
              )
                if (this.bodyJuridica.denominacion.trim() == "")
                  this.noDataFoundWithDNI();
            }
          }
        );
    }
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
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  isBuscar() {
    this.buscar = true;
  }

  irFichaColegial(id) {
    if (sessionStorage.getItem("ficha") == "Y") {
    }
    if (!this.selectMultiple && !this.selectAll) {
      if (
        sessionStorage.getItem("notario") != null ||
        sessionStorage.getItem("notario") != undefined
      ) {
        sessionStorage.removeItem("notario");
        this.checkTypeCIF(id[0].nif);
        id[0].tipoIdentificacion = this.tipoCIF;
        sessionStorage.setItem("notario", JSON.stringify(id));
        this.location.back();
      } else {
        this.checkTypeCIF(id[0].nif);
        id[0].tipoIdentificacion = this.tipoCIF;

        sessionStorage.setItem("notario", JSON.stringify(id));
        this.location.back();
      }
    }
  }

  noDataFoundWithDNI() {
    let mess = "";
    if ((this.persona = "J")) {
      mess =
        "No existe ningun elemento con el NIF seleccionado, ¿Desea crear un elemento?";
    } else {
      mess =
        "No existe ningun elemento con el CIF seleccionado, ¿Desea crear un elemento?";
    }

    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        let notarioNIF = new DatosNotarioItem();
        if (this.bodyFisica.nif != null || this.bodyFisica.nif != undefined) {
          notarioNIF.nif = this.bodyFisica.nif;
        } else {
          notarioNIF.nif = this.bodyJuridica.nif;
        }

        notarioNIF.tipoIdentificacion = this.tipoCIF;
        notarioNIF.nombre = "";
        let notariosNEW = [];
        notariosNEW.push(notarioNIF);

        sessionStorage.removeItem("notario");

        sessionStorage.setItem("notario", JSON.stringify(notariosNEW));
        this.location.back();
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancel",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
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

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
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
