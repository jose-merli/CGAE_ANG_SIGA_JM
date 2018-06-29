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
import { DatosIntegrantesItem } from "../../../models/DatosIntegrantesItem";
import { DatosIntegrantesObject } from "../../../models/DatosIntegrantesObject";
import { DatosPersonaJuridicaComponent } from "../datosPersonaJuridica/datosPersonaJuridica.component";
/*** COMPONENTES ***/

@Component({
  selector: "app-datos-integrantes",
  templateUrl: "./datos-integrantes.component.html",
  styleUrls: ["./datos-integrantes.component.scss"]
})
export class DatosIntegrantesComponent implements OnInit {
  usuarios_rol: any[];
  usuarios_perfil: any[];
  usuarios_activo: any[];
  cols: any = [];
  datos: any[];
  searchIntegrantes = new DatosIntegrantesObject();
  datosActivos: any[];
  select: any[];
  msgs: Message[] = [];
  rowsPerPage: any = [];
  showDatosGenerales: boolean = true;
  pButton;
  historico: boolean = false;
  editar: boolean = false;
  buscar: boolean = false;
  disabledRadio: boolean = false;
  disabled: boolean = false;
  selectMultiple: boolean = false;
  only: boolean = true;
  blockCrear: boolean = true;
  selectedItem: number = 10;
  first: number = 0;
  activo: boolean = false;
  dniCorrecto: boolean;
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  permisosTree: any;
  permisosArray: any[];
  derechoAcceso: any;
  activacionEditar: boolean;
  selectAll: boolean = false;
  progressSpinner: boolean = false;
  numSelected: number = 0;
  usuarioBody: any[];
  openFicha: boolean = false;
  idPersona: String;
  body: DatosIntegrantesItem = new DatosIntegrantesItem();
  datosIntegrantes: DatosIntegrantesObject = new DatosIntegrantesObject();

  columnasTabla: any = [];

  // Obj extras
  body1: DatosIntegrantesItem = new DatosIntegrantesItem();
  body2: DatosIntegrantesItem = new DatosIntegrantesItem();

  @ViewChild("table") table;
  selectedDatos;

  constructor(
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private location: Location,
    private fichasPosibles: DatosPersonaJuridicaComponent
  ) {}

  ngOnInit() {
    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    if (this.usuarioBody != undefined) {
      this.idPersona = this.usuarioBody[0].idPersona;
    }
    this.cols = [
      { field: "nifCif", header: "administracion.usuarios.literal.NIF" },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "apellidos",
        header: "gratuita.mantenimientoTablasMaestra.literal.apellidos"
      },
      {
        field: "fechaHistorico",
        header: "administracion.usuarios.literal.fechaAlta"
      },
      { field: "cargo", header: "censo.busquedaComisiones.literal.cargos" },
      {
        field: "liquidacionComoSociedad",
        header: "censo.busquedaClientes.literal.liquidacion"
      },
      {
        field: "ejerciente",
        header: "censo.consultaDatosGenerales.literal.ejerciente"
      },
      {
        field: "capitalSocial",
        header: "censo.consultaComponentesJuridicos.literal.Participacion"
      }
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

    this.search();
  }
  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }
  // funciones de relleno de datos fantasmas

  pInputText;

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
    }
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = !fichaPosible.activa;
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
  search() {
    this.historico = false;
    let searchObject = new DatosIntegrantesItem();
    searchObject.idPersona = this.idPersona;
    searchObject.historico = false;
    this.buscar = false;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    this.selectAll = false;
    this.sigaServices
      .postPaginado("integrantes_search", "?numPagina=1", searchObject)
      .subscribe(
        data => {
          console.log(data);
          this.progressSpinner = false;
          this.searchIntegrantes = JSON.parse(data["body"]);
          this.datos = this.searchIntegrantes.datosIntegrantesItem;
          if (this.datos.length == 1) {
            this.body = this.datos[0];
            this.only = true;
          } else {
            this.only = false;
          }
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {}
      );
  }
  setItalic(datoH) {
    if (datoH.fechaBajaCargo == null) return false;
    else return true;
  }
  consultarIntegrante(id) {
    if (!this.selectMultiple) {
      var ir = null;
      ir = id[0];
      ir.editar = false;
      sessionStorage.removeItem("integrante");
      sessionStorage.setItem("integrante", JSON.stringify(ir));
      this.router.navigate(["detalleIntegrante"]);
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
  anadirIntegrante() {
    let dummy = {
      integrante: true
    };
    sessionStorage.removeItem("newIntegrante");
    sessionStorage.setItem("newIntegrante", JSON.stringify(dummy));
    this.router.navigate(["/busquedaGeneral"]);
  }
  searchHistorico() {
    this.historico = true;
    let searchObject = new DatosIntegrantesItem();
    searchObject.idPersona = this.idPersona;
    searchObject.historico = true;
    this.buscar = false;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    this.selectAll = false;
    this.sigaServices
      .postPaginado("integrantes_search", "?numPagina=1", searchObject)
      .subscribe(
        data => {
          console.log(data);
          this.progressSpinner = false;
          this.searchIntegrantes = JSON.parse(data["body"]);
          this.datos = this.searchIntegrantes.datosIntegrantesItem;
          this.table.paginator = true;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {}
      );
  }

  borrar(selectedItem) {
    let deleteIntegrantes = new DatosIntegrantesObject();
    deleteIntegrantes.datosIntegrantesItem = selectedItem;
    this.sigaServices
      .post("integrantes_delete", deleteIntegrantes.datosIntegrantesItem)
      .subscribe(
        data => {
          console.log(data);
        },
        err => {
          console.log(err);
        },
        () => {
          this.editar = false;
          this.dniCorrecto = null;
          this.disabledRadio = false;
          this.search();
        }
      );
  }
  goToDetails(selectedDatos) {
    console.log(selectedDatos);
    if (!this.selectMultiple) {
      var ir = null;
      if (selectedDatos && selectedDatos.length > 0) {
        ir = selectedDatos[0];
      }
      // sessionStorage.removeItem("integrante");
      // sessionStorage.setItem("integrante", JSON.stringify(ir));
      // this.router.navigate(["detalleIntegrante"]);
    } else {
      this.editar = false;
      this.numSelected = this.selectedDatos.length;
      this.dniCorrecto = null;
    }
  }
}
