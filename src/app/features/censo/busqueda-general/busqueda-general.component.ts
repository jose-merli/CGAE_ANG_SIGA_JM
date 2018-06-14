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

  buscar: boolean = false;
  selectAll: boolean = false;

  selectedItem: number = 10;
  @ViewChild("table") table;
  selectedDatos;

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
      { field: "primerApellido", header: "Apellidos" },
      { field: "colegio", header: "Colegio" },
      { field: "numColegiado", header: "Numero de Colegiado" },
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
        let first = { label: "", value: "" };
        this.colegios_rol.unshift(first);
      },
      err => {
        console.log(err);
      }
    );
    this.checkStatusInit();
  }

  changeColsAndData() {
    if (this.persona == "f") {
      this.cols = this.colsFisicas;
    } else {
      this.cols = this.colsJuridicas;
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
      if (this.bodyFisica.numColegiado == undefined) {
        this.bodyFisica.numColegiado = "";
      }
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
            this.datos = this.searchFisica.busquedaFisicaItems;
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          },
          () => {
            // if (sessionStorage.getItem("first") != null) {
            //   let first = JSON.parse(sessionStorage.getItem("first")) as number;
            //   this.table.first = first;
            //   sessionStorage.removeItem("first");
            // }
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
            // if (sessionStorage.getItem("first") != null) {
            //   let first = JSON.parse(sessionStorage.getItem("first")) as number;
            //   this.table.first = first;
            //   sessionStorage.removeItem("first");
            // }
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
    if (!this.selectMultiple && !this.selectAll) {
      var ir = null;
      if (id && id.length > 0) {
        ir = id[0].numColegiado;
      }
      this.router.navigate(["/fichaColegial", ir]);
    }
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
