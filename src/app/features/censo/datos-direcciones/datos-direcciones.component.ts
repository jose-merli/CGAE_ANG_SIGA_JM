import { Router } from "@angular/router";
import { DataTable } from "primeng/datatable";
import { ConfirmationService, Message } from "primeng/components/common/api";
import { TranslateService } from "../../../commons/translate/translation.service";
import { SigaServices } from "./../../../_services/siga.service";
import { DatosDireccionesItem } from "./../../../../app/models/DatosDireccionesItem";
import { DatosDireccionesObject } from "./../../../../app/models/DatosDireccionesObject";
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
import { DropdownModule } from "primeng/dropdown";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { ButtonModule } from "primeng/button";
import { ActivatedRoute } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { MessageService } from "primeng/components/common/messageservice";
import { GrowlModule } from "primeng/growl";
import { ComboItem } from "./../../../../app/models/ComboItem";
import { MultiSelectModule } from "primeng/multiselect";
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

@Component({
  selector: "app-datos-direcciones",
  templateUrl: "./datos-direcciones.component.html",
  styleUrls: ["./datos-direcciones.component.scss"]
})
export class DatosDireccionesComponent implements OnInit {
  // openFicha: boolean = false;
  // selectAll: boolean = false;
  // selectMultiple: boolean = false;
  // progressSpinner: boolean = false;
  // historico: boolean = false;
  // usuarioBody: any[];
  // idPersona: String;
  // cols: any = [];
  // datos: any[];
  // only: boolean = true;
  // rowsPerPage: any = [];
  // buscar: boolean = true;
  // numSelected: number = 0;
  // selectedItem: number = 10;
  // searchDirecciones = new DatosDireccionesObject();
  // usuarios_rol: any[];
  // usuarios_perfil: any[];
  // usuarios_activo: any[];
  // datosActivos: any[];
  // select: any[];
  // showDatosGenerales: boolean = true;
  // pButton;
  // editar: boolean = false;
  // disabledRadio: boolean = false;
  // disabled: boolean = false;
  // blockCrear: boolean = true;
  // first: number = 0;
  // activo: boolean = false;
  // dniCorrecto: boolean;
  // permisosTree: any;
  // permisosArray: any[];
  // derechoAcceso: any;
  // activacionEditar: boolean;

  // columnasTabla: any = [];

  // // Obj extras
  // body: DatosDireccionesItem = new DatosDireccionesItem();
  // bodySearch: DatosDireccionesObject = new DatosDireccionesObject();

  // @ViewChild("table") table;
  // selectedDatos;

  // constructor(
  //   private router: Router,
  //   private changeDetectorRef: ChangeDetectorRef,
  //   private confirmationService: ConfirmationService,
  //   private translateService: TranslateService,
  //   private sigaServices: SigaServices,
  //   private fichasPosibles: DatosPersonaJuridicaComponent
  // ) {}

  // ngOnInit() {
  //   this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
  //   if (this.usuarioBody[0] != undefined) {
  //     this.idPersona = this.usuarioBody[0].idPersona;
  //   }
  //   this.cols = [
  //     {
  //       field: "tipoDireccion",
  //       header: "Tipo Dirección"
  //     },
  //     {
  //       field: "domicilioLista",
  //       header: "Dirección"
  //     },
  //     {
  //       field: "codigoPostal",
  //       header: "Código Postal"
  //     },
  //     {
  //       field: "nombrePoblacion",
  //       header: "Población"
  //     },
  //     {
  //       field: "nombreProvincia",
  //       header: "Provincia"
  //     },
  //     {
  //       field: "telefono",
  //       header: "Teléfono"
  //     },
  //     {
  //       field: "fax",
  //       header: "Fax"
  //     },
  //     {
  //       field: "movil",
  //       header: "Móvil"
  //     },
  //     {
  //       field: "correoElectronico",
  //       header: "Correo electrónico"
  //     }
  //   ];

  //   this.rowsPerPage = [
  //     {
  //       label: 10,
  //       value: 10
  //     },
  //     {
  //       label: 20,
  //       value: 20
  //     },
  //     {
  //       label: 30,
  //       value: 30
  //     },
  //     {
  //       label: 40,
  //       value: 40
  //     }
  //   ];
  //   this.search();
  //   // Datos para probar
  //   // this.datosPrueba();
  // }

  // datosPrueba() {
  //   this.body.codigoPostal = "35200";
  //   this.body.fax = "0998 455879";
  //   this.body.idDireccion = "1";
  //   this.body.movil = "654545323";
  //   this.body.telefono = "928456785";
  //   this.body.tipoDireccion = "despacho";

  //   this.bodySearch.datosDireccionesItem.push(this.body);
  // }

  // abrirFicha() {
  //   this.openFicha = !this.openFicha;
  // }
  // esFichaActiva(key) {
  //   let fichaPosible = this.getFichaPosibleByKey(key);
  //   return fichaPosible.activa;
  // }

  // abreCierraFicha(key) {
  //   let fichaPosible = this.getFichaPosibleByKey(key);
  //   fichaPosible.activa = !fichaPosible.activa;
  // }

  // getFichaPosibleByKey(key): any {
  //   let fichaPosible = this.fichasPosibles.getFichasPosibles().filter(elto => {
  //     return elto.key === key;
  //   });
  //   if (fichaPosible && fichaPosible.length) {
  //     return fichaPosible[0];
  //   }
  //   return {};
  // }

  // // Funcionalidades
  // search() {
  //   this.historico = false;
  //   let searchObject = new DatosDireccionesItem();
  //   searchObject.idPersona = this.idPersona;
  //   searchObject.historico = false;
  //   this.buscar = false;
  //   this.selectMultiple = false;
  //   this.selectedDatos = "";
  //   this.progressSpinner = true;
  //   this.selectAll = false;
  //   this.sigaServices
  //     .postPaginado("direcciones_search", "?numPagina=1", searchObject)
  //     .subscribe(
  //       data => {
  //         console.log(data);
  //         this.progressSpinner = false;
  //         this.searchDirecciones = JSON.parse(data["body"]);
  //         this.datos = this.searchDirecciones.datosDireccionesItem;
  //         if (this.datos.length == 1) {
  //           this.body = this.datos[0];
  //           this.only = true;
  //         } else {
  //           this.only = false;
  //         }
  //       },
  //       err => {
  //         console.log(err);
  //         this.progressSpinner = false;
  //       },
  //       () => {}
  //     );
  // }
  // searchHistorico() {
  //   this.historico = true;
  //   let searchObject = new DatosDireccionesItem();
  //   searchObject.idPersona = this.idPersona;
  //   searchObject.historico = true;
  //   this.buscar = false;
  //   this.selectMultiple = false;
  //   this.selectedDatos = "";
  //   this.progressSpinner = true;
  //   this.selectAll = false;
  //   this.sigaServices
  //     .postPaginado("direcciones_search", "?numPagina=1", searchObject)
  //     .subscribe(
  //       data => {
  //         console.log(data);
  //         this.progressSpinner = false;
  //         this.searchDirecciones = JSON.parse(data["body"]);
  //         this.datos = this.searchDirecciones.datosDireccionesItem;
  //         this.table.paginator = true;
  //       },
  //       err => {
  //         console.log(err);
  //         this.progressSpinner = false;
  //       },
  //       () => {}
  //     );
  // }
  // cargarDatosDirecciones() {
  //   this.historico = false;

  //   if (this.body == undefined) {
  //     this.body = new DatosDireccionesItem();
  //   }

  //   // datos que haya que pasar

  //   // llamar a buscar otra vez

  //   if (!this.historico) {
  //     this.selectMultiple = false;
  //     this.selectAll = false;
  //   }
  // }

  // cargarHistorico() {
  //   this.historico = true;

  //   if (this.body == undefined) {
  //     this.body = new DatosDireccionesItem();
  //   }

  //   // datos que haya que pasar

  //   // llamar a buscar otra vez
  // }

  // editarDireccion(dato) {}

  // confirmarEliminar(dato) {
  //   let mess = this.translateService.instant("messages.deleteConfirmation");
  //   let icon = "fa fa-trash-alt";
  //   console.log("AQUI");
  //   this.confirmationService.confirm({
  //     message: mess,
  //     icon: icon,
  //     accept: () => {
  //       // función eliminar pasándole los datos a eliminar
  //     },
  //     reject: () => {
  //       this.msgs = [
  //         {
  //           severity: "info",
  //           summary: "info",
  //           detail: this.translateService.instant(
  //             "general.message.accion.cancelada"
  //           )
  //         }
  //       ];
  //     }
  //   });
  // }

  // redireccionar(dato) {
  //   if (!this.selectMultiple && !this.historico) {
  //     var enviarDatos = null;
  //     if (dato && dato.length > 0) {
  //       enviarDatos = dato[0];
  //       sessionStorage.setItem("idDireccion", enviarDatos.idDireccion);
  //       sessionStorage.setItem("direccion", JSON.stringify(enviarDatos));
  //       sessionStorage.setItem("editar", "true");
  //     } else {
  //       sessionStorage.setItem("editar", "false");
  //     }

  //     this.router.navigate(["/consultarDatosDirecciones"]);
  //   } else {
  //     this.numSelected = this.selectedDatos.length;
  //   }
  // }

  // // Operaciones de la tabla
  // activarPaginacion() {
  //   if (
  //     !this.bodySearch.datosDireccionesItem ||
  //     this.bodySearch.datosDireccionesItem.length == 0
  //   )
  //     return false;
  //   else return true;
  // }

  // onChangeRowsPerPages(event) {
  //   this.selectedItem = event.value;
  //   this.changeDetectorRef.detectChanges();
  //   this.table.reset();
  // }

  // onChangeSelectAll() {
  //   if (this.selectAll === true) {
  //     this.numSelected = this.bodySearch.datosDireccionesItem.length;
  //     this.selectMultiple = false;
  //     this.selectedDatos = this.bodySearch.datosDireccionesItem;
  //   } else {
  //     this.selectedDatos = [];
  //     this.numSelected = 0;
  //   }
  // }

  // isSelectMultiple() {
  //   this.selectMultiple = !this.selectMultiple;
  //   if (!this.selectMultiple) {
  //     this.numSelected = 0;
  //     this.selectedDatos = [];
  //   } else {
  //     this.selectAll = false;
  //     this.selectedDatos = [];
  //     this.numSelected = 0;
  //   }
  // }

  // setItalic(datoH) {
  //   if (datoH.fechaBaja == null) return false;
  //   else return true;
  // }

  // // Mensajes
  // showFail(mensaje: string) {
  //   this.msgs = [];
  //   this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  // }

  // showSuccess(mensaje: string) {
  //   this.msgs = [];
  //   this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  // }
  usuarios_rol: any[];
  usuarios_perfil: any[];
  usuarios_activo: any[];
  cols: any = [];
  datos: any[];
  searchDirecciones = new DatosDireccionesObject();
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
    if (this.usuarioBody[0] != undefined) {
      this.idPersona = this.usuarioBody[0].idPersona;
    }
    this.cols = [
      {
        field: "tipoDireccion",
        header: "Tipo Dirección"
      },
      {
        field: "domicilioLista",
        header: "Dirección"
      },
      {
        field: "codigoPostal",
        header: "Código Postal"
      },
      {
        field: "nombrePoblacion",
        header: "Población"
      },
      {
        field: "nombreProvincia",
        header: "Provincia"
      },
      {
        field: "telefono",
        header: "Teléfono"
      },
      {
        field: "fax",
        header: "Fax"
      },
      {
        field: "movil",
        header: "Móvil"
      },
      {
        field: "correoElectronico",
        header: "Correo electrónico"
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
    let searchObject = new DatosDireccionesItem();
    searchObject.idPersona = this.idPersona;
    searchObject.historico = false;
    this.buscar = false;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    this.selectAll = false;
    this.sigaServices
      .postPaginado("direcciones_search", "?numPagina=1", searchObject)
      .subscribe(
        data => {
          console.log(data);
          this.progressSpinner = false;
          this.searchDirecciones = JSON.parse(data["body"]);
          this.datos = this.searchDirecciones.datosDireccionesItem;
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
    if (datoH.fechaBaja == null) return false;
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
  redireccionar(dato) {
    if (!this.selectMultiple && !this.historico) {
      var enviarDatos = null;
      if (dato && dato.length > 0) {
        enviarDatos = dato[0];
        sessionStorage.setItem("idDireccion", enviarDatos.idDireccion);
        sessionStorage.setItem("direccion", JSON.stringify(enviarDatos));
        sessionStorage.setItem("editar", "true");
      } else {
        sessionStorage.setItem("editar", "false");
      }

      this.router.navigate(["/consultarDatosDirecciones"]);
    } else {
      this.numSelected = this.selectedDatos.length;
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
    let searchObject = new DatosDireccionesItem();
    searchObject.idPersona = this.idPersona;
    searchObject.historico = true;
    this.buscar = false;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    this.selectAll = false;
    this.sigaServices
      .postPaginado("direcciones_search", "?numPagina=1", searchObject)
      .subscribe(
        data => {
          console.log(data);
          this.progressSpinner = false;
          this.searchDirecciones = JSON.parse(data["body"]);
          this.datos = this.searchDirecciones.datosDireccionesItem;
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
    let deleteDirecciones = new DatosDireccionesObject();
    deleteDirecciones.datosDireccionesItem = selectedItem;
    let datosDelete = [];
    selectedItem;
    selectedItem.forEach((value: DatosDireccionesItem, key: number) => {
      value.idPersona = this.idPersona;
      datosDelete.push(value);
    });

    this.sigaServices.post("direcciones_remove", datosDelete).subscribe(
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
