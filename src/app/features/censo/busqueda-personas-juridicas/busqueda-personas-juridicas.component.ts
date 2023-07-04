import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  HostListener
} from "@angular/core";
import { SigaServices } from "./../../../_services/siga.service";
import { SigaWrapper } from "../../../wrapper/wrapper.class";
import { esCalendar } from "./../../../utils/calendar";
import { DataTable } from "primeng/datatable";
import { TranslateService } from "../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { Message } from "primeng/components/common/api";
import { PersonaJuridicaObject } from "./../../../../app/models/PersonaJuridicaObject";
import { PersonaJuridicaItem } from "./../../../../app/models/PersonaJuridicaItem";
import { ControlAccesoDto } from "./../../../../app/models/ControlAccesoDto";
import { CommonsService } from '../../../_services/commons.service';

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-busqueda-personas-juridicas",
  templateUrl: "./busqueda-personas-juridicas.component.html",
  styleUrls: ["./busqueda-personas-juridicas.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BusquedaPersonasJuridicas extends SigaWrapper implements OnInit {
  etiquetas: any[];
  cols: any = [];
  datos: any[];
  select: any[];
  msgs: Message[] = [];
  rowsPerPage: any = [];
  body: PersonaJuridicaItem = new PersonaJuridicaItem();
  showDatosGenerales: boolean = true;
  pButton;
  editar: boolean = true;
  buscar: boolean = false;
  disabledRadio: boolean = false;
  disabled: boolean = false;
  selectMultiple: boolean = false;
  selectedItem: number = 10;
  first: number = 0;
  es: any = esCalendar;
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  personaDelete: PersonaJuridicaObject = new PersonaJuridicaObject();
  personaSearch: PersonaJuridicaObject = new PersonaJuridicaObject();
  permisosTree: any;
  permisosArray: any[];
  derechoAcceso: any;
  activacionEditar: boolean;
  selectAll: boolean = false;
  progressSpinner: boolean = false;
  tipos: any[];
  fechaConstitucion: Date;
  textSelected: String = "{0} etiquetas seleccionadas";
  fechaConstitucionArreglada: Date;
  historico: boolean = false;
  numSelected: number = 0;
  textFilter: String = "Elegir";
  sortO: number = 1;
  etiquetasSelected: any[];
  pInputText;
  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) {
    super(USER_VALIDATIONS);
  }

  @ViewChild("table")
  table: DataTable;
  selectedDatos;

  ngOnInit() {
    this.checkAcceso(); //coger tipos
    this.onInitSessionStorage();
    if (sessionStorage.getItem("filtrosBusquedaSociedadesFichaSociedad") != null) {
      this.body = JSON.parse(sessionStorage.getItem("filtrosBusquedaSociedadesFichaSociedad"));
      if(this.body.fechaConstitucion != undefined){
        this.body.fechaConstitucion = new Date(this.body.fechaConstitucion);
        this.fillFechaConstitucion(this.body.fechaConstitucion);
      }
      sessionStorage.removeItem("busqueda");
      sessionStorage.removeItem("filtrosBusquedaSociedadesFichaSociedad")
      this.Search();
    } else {
      // Poner check "Sociedades Profesionales a activo porque "Sociedades Profesionales a activo por defecto"
      this.body.sociedadesProfesionales = true;
    }

    this.sigaServices.get("busquedaPerJuridica_tipo").subscribe(
      n => {
        this.tipos = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );
    this.sigaServices.get("busquedaPerJuridica_etiquetas").subscribe(
      n => {

        this.etiquetas = [];
        let array = n.comboItems;

        array.forEach(element => {
          let e = { label: element.label, value: { label: element.label, value: element.value, idInstitucion: element.idInstitucion } };
          this.etiquetas.push(e);
        });
      }
      ,
      err => {
        //console.log(err);
      }
    );
    this.cols = [
      {
        field: "tipo",
        header: "censo.busquedaClientesAvanzada.literal.tipoCliente"
      },
      { field: "nif", header: "administracion.usuarios.literal.NIF" },
      {
        field: "denominacion",
        header: "censo.consultaDatosGenerales.literal.denominacion"
      },
      {
        field: "fechaConstitucion",
        header: "censo.general.literal.FechaConstitucion"
      },
      {
        field: "abreviatura",
        header: "gratuita.definirTurnosIndex.literal.abreviatura"
      },
      {
        field: "numeroIntegrantes",
        header: "censo.general.literal.numeroIntegrantes"
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
  }

  onInitSessionStorage() {
    sessionStorage.removeItem("notario");
    sessionStorage.removeItem("busquedaSociedades");
    sessionStorage.removeItem("crearnuevo");

    sessionStorage.removeItem("filtrosBusquedaNoColegiados")
    sessionStorage.removeItem("filtrosBusquedaColegiados");
    sessionStorage.removeItem("personaBody");
    sessionStorage.removeItem("datosCuenta");

    sessionStorage.removeItem("nuevoNoColegiado");
    sessionStorage.removeItem("nuevoNoColegiadoGen");
    sessionStorage.removeItem("solicitudIncorporacion");
    if (sessionStorage.getItem("migaPan") != "Buscar Sociedades")
      sessionStorage.removeItem("migaPan");
  }

  onChangeSelectAll() {
    if (!this.historico) {

      if (this.selectAll === true) {
        this.selectMultiple = false;
        this.selectedDatos = this.datos;
        this.numSelected = this.datos.length;
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    } else {
      if (this.selectAll) {
        this.selectMultiple = true;
        this.selectedDatos = this.datos.filter(dato => dato.fechaBaja != undefined && dato.fechaBaja != null)
        this.numSelected = this.selectedDatos.length;
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectMultiple = false;
      }
    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "2";
    this.sigaServices.post("acces_control", this.controlAcceso).subscribe(
      data => {
        this.permisosTree = JSON.parse(data.body);
        this.permisosArray = this.permisosTree.permisoItems;
        this.derechoAcceso = this.permisosArray[0].derechoacceso;
      },
      err => {
        //console.log(err);
      },
      () => {
        if (this.derechoAcceso == 3) {
          this.activacionEditar = true;
        } else if (this.derechoAcceso == 2) {
          this.activacionEditar = false;
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
    );
  }

  clickFila(event) {
    if (event.data && this.historico && !event.data.fechaBaja) {
      this.selectedDatos.pop();
    }
  }
  // arreglarFecha() {
  //   if (this.fechaConstitucion != undefined) {
  //     let fechaString = JSON.stringify(this.fechaConstitucion);
  //     fechaString = fechaString.substring(1, 11);
  //     let arrayDesde: any[] = fechaString.split("-");
  //     arrayDesde[2] = parseInt(arrayDesde[2]) + 1;
  //     let returnDesde =
  //       arrayDesde[0] + "-" + arrayDesde[1] + "-" + arrayDesde[2];
  //     this.fechaConstitucionArreglada = new Date(returnDesde + "T12:00:05Z");
  //   } else {
  //     this.fechaConstitucionArreglada = undefined;
  //   }
  // }

  arreglarFecha() {
    if (this.fechaConstitucion != undefined) {
      let jsonDate = JSON.stringify(this.fechaConstitucion);
      let rawDate = jsonDate.slice(1, -1);
      if (rawDate.length < 14) {
        let splitDate = rawDate.split("-");
        let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
        this.fechaConstitucion = new Date((arrayDate += "T00:00:00.001Z"));
      } else {
        this.fechaConstitucion = new Date(rawDate);
      }
    } else {
      this.fechaConstitucion = undefined;
    }
    this.body.fechaConstitucion = this.fechaConstitucion;
  }

  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }

  geForm() {
    if (
      this.body.tipo != "" &&
      this.body.tipo != undefined &&
      (this.body.nif != "" && this.body.nif != undefined) &&
      (this.body.denominacion != "" && this.body.denominacion != undefined) &&
      (this.body.abreviatura != "" && this.body.abreviatura != undefined) &&
      this.fechaConstitucion != undefined
    ) {
      this.numSelected = this.selectedDatos.length;
    } else {
      if (this.selectedDatos != undefined) {
        this.numSelected = this.selectedDatos.length;
      }
    }
  }

  geRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }



  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
      this.numSelected = 0;
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  isBuscar() {
    if (this.checkFilters()) {
      this.arreglarFecha();
      this.Search();
    }
  }

  toHistorico() {
    this.historico = true;
    this.buscar = false;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    this.selectAll = false;
    // if (this.body.tipo == undefined) {
    //   this.body.tipo = "";
    // }
    if (
      this.body.sociedadesProfesionales == undefined ||
      this.body.sociedadesProfesionales == false
    ) {
      this.body.sociedadesProfesionales = false;
    } else {
      this.body.sociedadesProfesionales = true;
    }
    if (this.body.nif == undefined) {
      this.body.nif = "";
    }
    if (this.body.denominacion == undefined) {
      this.body.denominacion = "";
    }
    if (this.body.abreviatura == undefined) {
      this.body.abreviatura = "";
    }
    if (this.body.grupos == undefined) {
      this.body.grupos = [];
    }
    if (this.body.integrante == undefined) {
      this.body.integrante = "";
    }
    this.sigaServices
      .postPaginado("busquedaPerJuridica_history", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.personaSearch = JSON.parse(data["body"]);
          this.datos = this.personaSearch.busquedaJuridicaItems;
          this.convertirStringADate(this.datos);
          this.table.paginator = true;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => { }
      );
  }

  Search() {
    this.progressSpinner = true;
    this.buscar = true;
    this.historico = false;
    this.selectAll = false;
    this.selectMultiple = false;
    this.selectedDatos = "";
    // this.body.grupos = this.etiquetasSelected;
    // if (this.body.tipo == undefined) {
    //   this.body.tipo = "";
    // }
    if (
      this.body.sociedadesProfesionales == undefined ||
      this.body.sociedadesProfesionales == false
    ) {
      this.body.sociedadesProfesionales = false;
    } else {
      this.body.sociedadesProfesionales = true;
    }
    if (this.body.nif == undefined) {
      this.body.nif = "";
    }
    if (this.body.denominacion == undefined) {
      this.body.denominacion = "";
    }
    if (this.body.abreviatura == undefined) {
      this.body.abreviatura = "";
    }
    if (this.body.grupos == undefined) {
      this.body.grupos = [];
    }
    if (this.body.integrante == undefined) {
      this.body.integrante = "";
    }
    this.sigaServices
      .postPaginado("busquedaPerJuridica_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.personaSearch = JSON.parse(data["body"]);
          this.datos = this.personaSearch.busquedaJuridicaItems;
          this.convertirStringADate(this.datos);
          this.table.paginator = true;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
          setTimeout(() => {
            this.commonsService.scrollTablaFoco('tablaFoco');
          }, 5);
        }
      );
  }

  isValidDate(d) {
    return d instanceof Date && !isNaN(d.getTime());
  }

  convertirStringADate(datos) {
    datos.forEach(element => {
      if (
        element.fechaConstitucion == "" ||
        element.fechaConstitucion == null
      ) {
        element.fechaConstitucion = null;
      } else {
        var posIni = element.fechaConstitucion.indexOf("/");
        var posFin = element.fechaConstitucion.lastIndexOf("/");
        var year = element.fechaConstitucion.substring(
          posFin + 1,
          element.fechaConstitucion.length
        );
        var day = element.fechaConstitucion.substring(0, posIni);
        var month = element.fechaConstitucion.substring(posIni + 1, posFin);
        element.fechaConstitucion = new Date(year, month - 1, day);
      }
    });
  }

  obtenerIntegrantes(dato) {
    return dato.numeroIntegrantes;
  }

  obtenerNombreIntegrantes(dato) {
    return dato.nombresIntegrantes;
  }

  paginate(event) {
    //console.log(event);
  }

  cancelar() {
    this.editar = true;
    this.body = new PersonaJuridicaItem();
    this.disabledRadio = false;
  }
  confirmarBorrar(selectedItem) {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    let icon = "fa fa-trash-alt";

    if (selectedItem.length > 1) {
      mess =
        this.translateService.instant("messages.deleteConfirmation.much") +
        selectedItem.length +
        " " +
        this.translateService.instant("messages.deleteConfirmation.register") +
        "?";
    }
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.borrar(selectedItem);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancel",
            detail: this.translateService.instant(
              "general.message.error.realiza.accion"
            )
          }
        ];
      }
    });
  }

  borrar(selectedItem) {
    //recorrer selected datos y enviar idusuario
    var deletePersonas: String[];
    var personaItem = new PersonaJuridicaItem();
    selectedItem.forEach((value: PersonaJuridicaItem, key: number) => {
      personaItem.idPersonaDelete.push(value.idPersona);
    });
    this.sigaServices.post("busquedaPerJuridica_delete", personaItem).subscribe(
      data => {
        this.showSuccessDelete(selectedItem.length);
      },
      err => {
        this.showFail();
        //console.log(err);
      },
      () => {
        this.editar = true;
        //this.body = new PersonaJuridicaItem();
        this.disabledRadio = false;
        this.Search();
        this.table.reset();
      }
    );
  }

  showduplicateFail(message: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: this.translateService.instant(message)
    });
  }

  crear() {
    let migaPan = this.translateService.instant("censo.busquedaClientes.sociedades.titulo");
    let menuProcede = this.translateService.instant("menu.censo");
    sessionStorage.setItem("migaPan", migaPan);
    sessionStorage.setItem("menuProcede", menuProcede);

    sessionStorage.setItem("crearnuevo", "true");
    sessionStorage.setItem("abrirSociedad", "true");
    //this.body = new PersonaJuridicaItem();
    sessionStorage.setItem("esColegiado", "false");
    //sessionStorage.setItem("usuarioBody", JSON.stringify(this.body));
    this.router.navigate(["/busquedaGeneral"]);
    //this.router.navigate(["fichaPersonaJuridica"]);
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showSuccessDelete(number) {
    let msg = "";
    if (number >= 2) {
      msg =
        number +
        " " +
        this.translateService.instant("messages.deleted.selected.success");
    } else {
      msg = this.translateService.instant("messages.deleted.success");
    }
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: msg
    });
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  irEditarPersona(id) {
    id = [id] //Se hizo en una actualizacion para evitar cambiar mucho codigo
    if (!this.selectMultiple) {
      var ir = null;
      if (id && id.length > 0) {
        ir = id[0];
      }
      sessionStorage.removeItem("historicoSociedad");
      if (id[0].fechaBaja != null || id[0].fechaBaja != undefined) {
        sessionStorage.setItem("historicoSociedad", "true");
      }
      sessionStorage.setItem("busqueda", JSON.stringify(this.body));
      sessionStorage.setItem("busquedaSociedades", "true");
      sessionStorage.setItem("usuarioBody", JSON.stringify(id));
      sessionStorage.setItem(
        "privilegios",
        JSON.stringify(this.activacionEditar)
      );
      sessionStorage.setItem("esColegiado", "false");
      sessionStorage.setItem("first", JSON.stringify(this.table.first));
      this.router.navigate(["fichaPersonaJuridica"]);
    } else {
      this.editar = true;
      // this.body = new PersonaJuridicaItem();
      this.numSelected = this.selectedDatos.length;
    }
  }

  geSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }

  clear() {
    this.msgs = [];
  }

  fillFechaConstitucion(event) {
    this.fechaConstitucion = event;
  }

  checkFilters() {
    if (
      (this.body.tipo == null ||
        this.body.tipo == undefined ||
        this.body.tipo == "") &&
      (this.body.nif == null ||
        this.body.nif == undefined ||
        this.body.nif.trim().length < 3) &&
      (this.body.denominacion == null ||
        this.body.denominacion == undefined ||
        this.body.denominacion.trim().length < 3) &&
      (this.body.abreviatura == null ||
        this.body.abreviatura == undefined ||
        this.body.abreviatura.trim().length < 3) &&
      (this.body.integrante == null ||
        this.body.integrante == undefined ||
        this.body.integrante.trim().length < 3) &&
      (this.fechaConstitucion == null ||
        this.fechaConstitucion == undefined) &&
      (this.body.grupos == null ||
        this.body.grupos == undefined ||
        this.body.grupos.length == 0)
    ) {
      this.showSearchIncorrect();
      this.progressSpinner = false;
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.body.denominacion != undefined) {
        this.body.denominacion = this.body.denominacion.trim();
      }
      if (this.body.abreviatura != undefined) {
        this.body.abreviatura = this.body.abreviatura.trim();
      }
      if (this.body.integrante != undefined) {
        this.body.integrante = this.body.integrante.trim();
      }
      if (this.body.nif != undefined) {
        this.body.nif = this.body.nif.trim();
      }
      return true;
    }
  }

  showSearchIncorrect() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "cen.busqueda.error.busquedageneral"
      )
    });
  }


  isLimpiar() {
    this.body = new PersonaJuridicaItem();
    this.body.sociedadesProfesionales = true;
    this.fechaConstitucion = undefined;
  }
}