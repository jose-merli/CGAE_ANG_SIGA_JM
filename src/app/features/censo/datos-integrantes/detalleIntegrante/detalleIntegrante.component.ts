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
import { CommonModule } from "@angular/common";
import { DataTableModule } from "primeng/datatable";
import { ConfirmationService } from "primeng/api";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { ComboItem } from "./../../../../../app/models/ComboItem";
import { MultiSelectModule } from "primeng/multiselect";
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
  es: any = esCalendar;
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
  isDisablednifCif: boolean = true;
  isDisabledNombre: boolean = true;
  isDisabledApellidos1: boolean = true;
  isDisabledApellidos2: boolean = true;
  isDisabledTipoColegio: boolean = true;
  isDisabledProvincia: boolean = true;
  isDisabledNumColegio: boolean = true;
  isDisabledFechaFinCargo: boolean = true;
  selectedItem: number = 10;
  first: number = 0;
  activo: boolean = false;
  dniCorrecto: boolean;
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  permisosTree: any;
  permisosArray: any[];
  usuarioBody: any[];
  cargosArray: any[];
  colegiosArray: any[];
  provinciasArray: any[];
  derechoAcceso: any;
  activacionEditar: boolean;
  selectAll: boolean = false;
  update: boolean = true;
  progressSpinner: boolean = false;
  numSelected: number = 0;
  masFiltros: boolean = false;
  openFicha: boolean = false;
  fichasPosibles: any[];
  body: DatosIntegrantesItem = new DatosIntegrantesItem();
  datosIntegrantes: DatosIntegrantesObject = new DatosIntegrantesObject();
  fechaCarga: Date;
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
    this.body = JSON.parse(sessionStorage.getItem("integrante"));
    if (
      sessionStorage.getItem("nIntegrante") != null ||
      sessionStorage.getItem("nIntegrante") != undefined
    ) {
      this.beanNewIntegrante();
    } else {
      this.todoDisable();
      var a = JSON.parse(sessionStorage.getItem("integrante"));
      if (a.fechaCargo != null || a.fechaCargo != undefined) {
        this.fechaCarga = a.fechaCargo;
      }
    }

    this.editar = this.body.editar;
    this.editar = true;
    this.fichasPosibles = [
      {
        key: "identificacion",
        activa: this.editar
      },
      {
        key: "colegiacion",
        activa: this.editar
      },
      {
        key: "vinculacion",
        activa: this.editar
      }
    ];
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
    this.sigaServices.get("integrantes_tipoColegio").subscribe(
      n => {
        this.colegiosArray = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
    this.sigaServices.get("integrantes_provincias").subscribe(
      n => {
        this.provinciasArray = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
    this.sigaServices.get("integrantes_cargos").subscribe(
      n => {
        this.cargosArray = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }
  verMasFiltros() {
    this.masFiltros = !this.masFiltros;
  }
  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }
  backTo() {
    sessionStorage.removeItem("nIntegrante");
    sessionStorage.removeItem("integrante");
    this.router.navigate(["fichaPersonaJuridica"]);
  }
  pInputText;
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

  arreglarFechas() {
    if (this.fechaCarga != undefined) {
      this.body.fechaCargo = this.transformaFecha(this.fechaCarga);
    }
  }

  beanNewIntegrante() {
    var ir = null;
    this.body = new DatosIntegrantesItem();
    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));

    ir = JSON.parse(sessionStorage.getItem("nIntegrante"));
    this.body.completo = ir[0].completo;
    if (ir[0].completo) {
      this.todoDisable();
      this.ajustarPantallaParaAsignar();

      if (ir[0].idPersona != null) {
        this.body.idPersona = ir[0].idPersona;
        this.body.idPersonaIntegrante = ir[0].idPersona;
      }
      if (ir[0].colegio != null) {
        this.body.idInstitucion = ir[0].colegio;
        this.body.idInstitucionIntegrante = ir[0].colegio;
      }
      if (ir[0].fechaAlta != null) {
        this.body.fechaCargo = ir[0].fechaAlta;
        this.fechaCarga = ir[0].fechaAlta;
      } else if (ir[0].fechaConstitucion != null) {
        this.body.fechaCargo = ir[0].fechaConstitucion;
        this.fechaCarga = ir[0].fechaConstitucion;
      }

      if (ir[0].nif != null) {
        this.body.nifCif = ir[0].nif;
      }
      if (ir[0].nombre != null) {
        this.body.nombre = ir[0].nombre;
      } else if (ir[0].denominacion != null) {
        this.body.nombre = ir[0].denominacion;
      }

      if (ir[0].apellidos != null) {
        this.body.apellidos = ir[0].apellidos;
      }
      if (ir[0].primerApellido != null) {
        this.body.apellidos1 = ir[0].primerApellido;
      }
      if (ir[0].segundoApellido != null) {
        this.body.apellidos2 = ir[0].segundoApellido;
      }
      if (ir[0].nombre != null && ir[0].apellidos) {
        this.body.nombreCompleto = ir[0].nombre + " " + ir[0].apellidos;
      }

      if (ir[0].numeroColegiado != null) {
        this.body.numColegiado = ir[0].numeroColegiado;
      } else if (ir[0].numColegiado != null) {
        this.body.numColegiado = ir[0].numColegiado;
      }
      this.body.idPersonaPadre = this.usuarioBody[0].idPersona;
      this.body.tipoIdentificacion = ir[0].tipoIdentificacion;
    } else {
      this.body.nifCif = ir[0].nifCif;
      this.body.idPersonaPadre = this.usuarioBody[0].idPersona;
      this.body.tipoIdentificacion = ir[0].tipoIdentificacion;
      this.todoDisable();
      this.ajustarPantallaParaCrear();
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
  ajustarPantallaParaCrear() {
    this.isDisablednifCif = true;
    this.isDisabledNombre = false;
    this.isDisabledApellidos1 = false;
    this.isDisabledApellidos2 = false;
    this.isDisabledTipoColegio = false;
    this.isDisabledProvincia = false;
    this.isDisabledNumColegio = true;
    this.isDisabledFechaFinCargo = true;
  }
  ajustarPantallaParaAsignar() {
    this.isDisablednifCif = true;
    this.isDisabledNombre = true;
    this.isDisabledApellidos1 = true;
    this.isDisabledApellidos2 = true;
    this.isDisabledTipoColegio = false;
    this.isDisabledProvincia = false;
    this.isDisabledNumColegio = true;
    this.isDisabledFechaFinCargo = true;
  }

  todoDisable() {
    this.isDisablednifCif = true;
    this.isDisabledNombre = true;
    this.isDisabledApellidos1 = true;
    this.isDisabledApellidos2 = true;
    this.isDisabledTipoColegio = true;
    this.isDisabledProvincia = true;
    this.isDisabledNumColegio = true;
    this.isDisabledFechaFinCargo = true;
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
  search() {
    this.historico = false;
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

  guardar() {
    if (
      sessionStorage.getItem("nIntegrante") != null ||
      sessionStorage.getItem("nIntegrante") != undefined
    ) {
      this.crearIntegrante();
    } else {
      this.updateIntegrante();
    }
  }


  showFail(message: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: message
    });
  }

  updateIntegrante() {
    let updateIntegrante = new DatosIntegrantesItem();
    let isParticipacionNumerico = false;
    if (this.fechaCarga != undefined && this.fechaCarga != null) {
      this.arreglarFechas();
      updateIntegrante.fechaCargo = this.body.fechaCargo;
    } else {
      updateIntegrante.fechaCargo = "";
    }
    if (this.body.cargo != undefined && this.body.cargo != null) {
      updateIntegrante.cargo = this.body.cargo;
    } else {
      updateIntegrante.cargo = "";
    }
    if (this.body.idCargo != undefined && this.body.idCargo != null) {
      updateIntegrante.idCargo = this.body.idCargo;
    } else {
      updateIntegrante.idCargo = "";
    }
    if (
      this.body.capitalSocial != undefined &&
      this.body.capitalSocial != null
    ) {

      // comprueba si es numérico
      if(Number(this.body.capitalSocial)){
          isParticipacionNumerico = true;
         updateIntegrante.capitalSocial = this.body.capitalSocial;
      }
      else{
          isParticipacionNumerico = false;
      }
     
    } else {
      updateIntegrante.capitalSocial = "";
    }
    if (this.body.idPersona != undefined && this.body.idPersona != null) {
      updateIntegrante.idPersona = this.body.idPersona;
    }
    if (this.body.idComponente != undefined && this.body.idComponente != null) {
      updateIntegrante.idComponente = this.body.idComponente;
    }



    if(isParticipacionNumerico){
      this.sigaServices
      .postPaginado("integrantes_update", "?numPagina=1", updateIntegrante)
      .subscribe(
        data => {
          console.log(data);
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.backTo();
        }
      );
    }
    else{
      this.showFail("el campo Participación debe ser numérico");
    }
    
  }
  crearIntegrante() {
    let newIntegrante = new DatosIntegrantesItem();
    if (this.body.completo) {
      if (this.body.nombre != undefined && this.body.nombre != null) {
        newIntegrante.nombre = this.body.nombre;
      } else {
        newIntegrante.nombre = "";
      }
      if (this.body.apellidos1 != undefined && this.body.apellidos1 != null) {
        newIntegrante.apellidos1 = this.body.apellidos1;
      } else {
        newIntegrante.apellidos1 = "";
      }
      if (this.body.apellidos2 != undefined && this.body.apellidos2 != null) {
        newIntegrante.apellidos2 = this.body.apellidos2;
      } else {
        newIntegrante.apellidos2 = "";
      }
      if (this.body.nifCif != undefined && this.body.nifCif != null) {
        newIntegrante.nifCif = this.body.nifCif;
      } else {
        newIntegrante.nifCif = "";
      }
      if (
        this.body.tipoIdentificacion != undefined &&
        this.body.tipoIdentificacion != null
      ) {
        newIntegrante.tipoIdentificacion = this.body.tipoIdentificacion;
      } else {
        newIntegrante.tipoIdentificacion = "";
      }
      if (this.body.fechaCargo != undefined && this.body.fechaCargo != null) {
        newIntegrante.fechaCargo = this.body.fechaCargo;
      } else {
        newIntegrante.fechaCargo = "";
      }
      if (this.body.cargo != undefined && this.body.cargo != null) {
        newIntegrante.cargo = this.body.cargo;
      } else {
        newIntegrante.cargo = "";
      }
      if (this.body.idCargo != undefined && this.body.idCargo != null) {
        newIntegrante.idCargo = this.body.idCargo;
      } else {
        newIntegrante.idCargo = "";
      }
      if (
        this.body.capitalSocial != undefined &&
        this.body.capitalSocial != null
      ) {
        newIntegrante.capitalSocial = this.body.capitalSocial;
      } else {
        newIntegrante.capitalSocial = "";
      }
      if (
        this.body.idComponente != undefined &&
        this.body.idComponente != null
      ) {
        newIntegrante.idComponente = this.body.idComponente;
      } else {
        newIntegrante.idComponente = "";
      }
      if (
        this.body.idPersonaPadre != undefined &&
        this.body.idPersonaPadre != null
      ) {
        newIntegrante.idPersonaPadre = this.body.idPersonaPadre;
      } else {
        newIntegrante.idPersonaPadre = "";
      }
      if (
        this.body.idPersonaIntegrante != undefined &&
        this.body.idPersonaIntegrante != null
      ) {
        newIntegrante.idPersonaIntegrante = this.body.idPersonaIntegrante;
      } else {
        newIntegrante.idPersonaIntegrante = "";
      }
      if (
        this.body.idInstitucionIntegrante != undefined &&
        this.body.idInstitucionIntegrante != null
      ) {
        newIntegrante.idInstitucionIntegrante = this.body.idInstitucionIntegrante;
      } else {
        newIntegrante.idInstitucionIntegrante = "";
      }
      if (
        this.body.idTipoColegio != undefined &&
        this.body.idTipoColegio != null
      ) {
        newIntegrante.idTipoColegio = this.body.idTipoColegio;
      } else {
        newIntegrante.idTipoColegio = "";
      }
      if (this.body.idProvincia != undefined && this.body.idProvincia != null) {
        newIntegrante.idProvincia = this.body.idProvincia;
      } else {
        newIntegrante.idProvincia = "";
      }
      if (
        this.body.numColegiado != undefined &&
        this.body.numColegiado != null
      ) {
        newIntegrante.numColegiado = this.body.numColegiado;
      } else {
        newIntegrante.numColegiado = "";
      }
      if (this.body.tipo != undefined && this.body.tipo != null) {
        newIntegrante.tipo = this.body.tipo;
      } else {
        newIntegrante.tipo = "";
      }

      this.sigaServices
        .postPaginado("integrantes_insert", "?numPagina=1", newIntegrante)
        .subscribe(
          data => {
            console.log(data);
            this.progressSpinner = false;
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          },
          () => {
            this.backTo();
          }
        );
    } else {
      if (this.body.nombre != undefined && this.body.nombre != null) {
        newIntegrante.nombre = this.body.nombre;
      } else {
        newIntegrante.nombre = "";
      }
      if (this.body.apellidos1 != undefined && this.body.apellidos1 != null) {
        newIntegrante.apellidos1 = this.body.apellidos1;
      } else {
        newIntegrante.apellidos1 = "";
      }
      if (this.body.apellidos2 != undefined && this.body.apellidos2 != null) {
        newIntegrante.apellidos2 = this.body.apellidos2;
      } else {
        newIntegrante.apellidos2 = "";
      }
      if (this.body.nifCif != undefined && this.body.nifCif != null) {
        newIntegrante.nifCif = this.body.nifCif;
      } else {
        newIntegrante.nifCif = "";
      }
      if (
        this.body.tipoIdentificacion != undefined &&
        this.body.tipoIdentificacion != null
      ) {
        newIntegrante.tipoIdentificacion = this.body.tipoIdentificacion;
      } else {
        newIntegrante.tipoIdentificacion = "";
      }
      if (this.body.fechaCargo != undefined && this.body.fechaCargo != null) {
        newIntegrante.fechaCargo = this.body.fechaCargo;
      } else {
        newIntegrante.fechaCargo = "";
      }
      if (this.body.cargo != undefined && this.body.cargo != null) {
        newIntegrante.cargo = this.body.cargo;
      } else {
        newIntegrante.cargo = "";
      }
      if (this.body.idCargo != undefined && this.body.idCargo != null) {
        newIntegrante.idCargo = this.body.idCargo;
      } else {
        newIntegrante.idCargo = "";
      }
      if (
        this.body.capitalSocial != undefined &&
        this.body.capitalSocial != null
      ) {
        newIntegrante.capitalSocial = this.body.capitalSocial;
      } else {
        newIntegrante.capitalSocial = "";
      }
      if (
        this.body.idComponente != undefined &&
        this.body.idComponente != null
      ) {
        newIntegrante.idComponente = this.body.idComponente;
      } else {
        newIntegrante.idComponente = "";
      }
      if (
        this.body.idPersonaPadre != undefined &&
        this.body.idPersonaPadre != null
      ) {
        newIntegrante.idPersonaPadre = this.body.idPersonaPadre;
      } else {
        newIntegrante.idPersonaPadre = "";
      }
      if (
        this.body.idPersonaIntegrante != undefined &&
        this.body.idPersonaIntegrante != null
      ) {
        newIntegrante.idPersonaIntegrante = this.body.idPersonaIntegrante;
      } else {
        newIntegrante.idPersonaIntegrante = "";
      }
      if (
        this.body.idInstitucionIntegrante != undefined &&
        this.body.idInstitucionIntegrante != null
      ) {
        newIntegrante.idInstitucionIntegrante = this.body.idInstitucionIntegrante;
      } else {
        newIntegrante.idInstitucionIntegrante = "";
      }
      if (
        this.body.idTipoColegio != undefined &&
        this.body.idTipoColegio != null
      ) {
        newIntegrante.idTipoColegio = this.body.idTipoColegio;
      } else {
        newIntegrante.idTipoColegio = "";
      }
      if (this.body.idProvincia != undefined && this.body.idProvincia != null) {
        newIntegrante.idProvincia = this.body.idProvincia;
      } else {
        newIntegrante.idProvincia = "";
      }
      if (
        this.body.numColegiado != undefined &&
        this.body.numColegiado != null
      ) {
        newIntegrante.numColegiado = this.body.numColegiado;
      } else {
        newIntegrante.numColegiado = "";
      }
      if (this.body.tipo != undefined && this.body.tipo != null) {
        newIntegrante.tipo = this.body.tipo;
      } else {
        newIntegrante.tipo = "";
      }

      this.sigaServices
        .postPaginado("integrantes_insert", "?numPagina=1", newIntegrante)
        .subscribe(
          data => {
            console.log(data);
            this.progressSpinner = false;
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          },
          () => {
            this.backTo();
          }
        );
    }
  }
}
