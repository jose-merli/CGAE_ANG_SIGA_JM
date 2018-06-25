import { OldSigaServices } from "../../../../_services/oldSiga.service";
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
import { esCalendar } from "../../../../utils/calendar";
import { TableModule } from "primeng/table";
import { SigaServices } from "./../../../../_services/siga.service";
import { DropdownModule } from "primeng/dropdown";
import { DataTable } from "primeng/datatable";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../../properties/val-properties";
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
import { ComboItem } from "./../../../../../app/models/ComboItem";
import { MultiSelectModule } from "primeng/multiSelect";
import { ControlAccesoDto } from "./../../../../../app/models/ControlAccesoDto";
import { Location, getLocaleDateTimeFormat, DatePipe } from "@angular/common";
import { Observable } from "rxjs/Rx";
import { BusquedaFisicaItem } from "./../../../../../app/models/BusquedaFisicaItem";
import { BusquedaJuridicaItem } from "./../../../../../app/models/BusquedaJuridicaItem";
import { BusquedaJuridicaObject } from "./../../../../../app/models/BusquedaJuridicaObject";
import { BusquedaFisicaObject } from "./../../../../../app/models/BusquedaFisicaObject";
import { DatosNotarioItem } from "../../../../models/DatosNotarioItem";
import { DatosIntegrantesItem } from "../../../../models/DatosIntegrantesItem";
import { DatosIntegrantesObject } from "../../../../models/DatosIntegrantesObject";
/*** COMPONENTES ***/

@Component({
  selector: "app-detalleIntegrante",
  templateUrl: "./detalleIntegrante.component.html",
  styleUrls: ["./detalleIntegrante.component.scss"]
})
export class DetalleIntegranteComponent implements OnInit {
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

  openFicha: boolean = false;

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
    private location: Location
  ) {}

  ngOnInit() {
    this.cols = [
      { field: "nif", header: "administracion.usuarios.literal.NIF" },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      { field: "apellidos", header: "Apellidos" },
      { field: "fechaInicioCargo", header: "Fecha de alta - fecha de baja" },
      { field: "cargos", header: "Cargos del integrante" },
      { field: "liquidacionComoSociedad", header: "Liquidación como sociedad" },
      { field: "ejerciente", header: "Ejerciente" },
      { field: "participacion", header: "Participación en la sociedad" }
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
    // Descomentar si se quiere probar
    this.unInteg();
    this.masDe1Integ();
  }
  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }
  // funciones de relleno de datos fantasmas
  masDe1Integ() {
    this.body1.nombre = "JACINTO";
    this.datos.push(this.body1);
    this.body2.nombre = "ALBERTO";
    this.datos.push(this.body2);
  }
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
  unInteg() {
    this.body.nifCif = "String";
    this.body.nombre = "PEPE";
    this.body.apellidos1 = "String";
    this.body.apellidos2 = "String";
    this.body.cargo = "String";
    this.body.cargo = "String";
    this.body.fechaCargo = "String";
    this.body.fechaBajaCargo = "String";
    this.body.numColegiado = "String";
    this.body.idTipoColegio = "String";

    this.datos.push(this.body);
  }

  abrirFicha() {
    this.openFicha = !this.openFicha;
  }
  search() {
    this.historico = true;
    this.buscar = false;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    this.selectAll = false;
    this.sigaServices
      .postPaginado("busquedaPerJuridica_history", "?numPagina=1", this.body)
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
  searchHistorico() {
    this.historico = true;
    this.buscar = false;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    this.selectAll = false;
    this.sigaServices
      .postPaginado("busquedaPerJuridica_history", "?numPagina=1", this.body)
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
}
