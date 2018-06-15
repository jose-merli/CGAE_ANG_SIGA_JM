import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  Input,
  HostListener
} from "@angular/core";
import { SigaServices } from "./../../../_services/siga.service";
import { SigaWrapper } from "../../../wrapper/wrapper.class";
import { SelectItem } from "primeng/api";
import { DropdownModule } from "primeng/dropdown";
import { esCalendar } from "./../../../utils/calendar";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
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
import { PersonaJuridicaObject } from "./../../../../app/models/PersonaJuridicaObject";
import { PersonaJuridicaItem } from "./../../../../app/models/PersonaJuridicaItem";
import { ComboItem } from "./../../../../app/models/ComboItem";
import { MultiSelectModule } from "primeng/multiSelect";
import { ControlAccesoDto } from "./../../../../app/models/ControlAccesoDto";
import { Location } from "@angular/common";
import { Observable } from "rxjs/Rx";

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
  blockCrear: boolean = true;
  selectedItem: number = 10;
  first: number = 0;
  dniCorrecto: boolean;
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
  textSelected: String = "{0} grupos seleccionados";
  textFilter = "Elegir";
  fechaConstitucionArreglada: Date;
  historico: boolean = false;

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
  ) {
    super(USER_VALIDATIONS);
  }
  @ViewChild("table") table: DataTable;
  selectedDatos;

  ngOnInit() {
    this.checkAcceso(); //coger tipos
    this.sigaServices.get("busquedaPerJuridica_tipo").subscribe(
      n => {
        this.tipos = n.combooItems;
        let first = { label: "", value: "" };
        this.tipos.unshift(first);
      },
      err => {
        console.log(err);
      }
    );
    this.sigaServices.get("busquedaPerJuridica_etiquetas").subscribe(
      n => {
        this.etiquetas = n.combooItems;
        // let first = { label: "", value: "" };
        // this.etiquetas.unshift(first);
      },
      err => {
        console.log(err);
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

    // Poner check "Sociedades Profesionales a activo por defecto"
    this.body.sociedadesProfesionales = true;

    // if (sessionStorage.getItem("editedUser") != null) {
    //   this.selectedDatos = JSON.parse(sessionStorage.getItem("editedUser"));
    // }
    // sessionStorage.removeItem("editedUser");
    // if (sessionStorage.getItem("searchUser") != null) {
    //   this.body = JSON.parse(sessionStorage.getItem("searchUser"));
    //   this.isBuscar();
    //   sessionStorage.removeItem("searchUser");
    //   sessionStorage.removeItem("usuarioBody");
    // } else {
    //   this.body = new PersonaJuridicaRequestDto();
    // }
  }

  toHistorico() {
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
          this.personaSearch = JSON.parse(data["body"]);
          this.datos = this.personaSearch.busquedaJuridicaItems;
          this.table.paginator = true;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {}
      );
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
        console.log(err);
      },
      () => {
        if (this.derechoAcceso == 3) {
          this.activacionEditar = true;
        } else {
          this.activacionEditar = false;
        }
      }
    );
  }

  arreglarFecha() {
    if (this.fechaConstitucion != undefined) {
      let fechaString = JSON.stringify(this.fechaConstitucion);
      fechaString = fechaString.substring(1, 11);
      let arrayDesde: any[] = fechaString.split("-");
      arrayDesde[2] = parseInt(arrayDesde[2]) + 1;
      let returnDesde =
        arrayDesde[1] + "/" + arrayDesde[2] + "/" + arrayDesde[0];
      this.fechaConstitucionArreglada = new Date(returnDesde);
    }
  }

  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }

  onChangeForm() {
    if (
      this.body.tipo != "" &&
      this.body.tipo != undefined &&
      (this.body.nif != "" && this.body.nif != undefined) &&
      (this.body.denominacion != "" && this.body.denominacion != undefined) &&
      (this.body.abreviatura != "" && this.body.abreviatura != undefined) &&
      this.body.fechaConstitucion != undefined &&
      this.dniCorrecto
    ) {
      this.blockCrear = false;
    } else {
      this.blockCrear = true;
    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
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

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  // sendEdit() {
  //   console.log(this.body);
  //   if (this.body.codigoExterno == undefined) {
  //     this.body.codigoExterno = "";
  //   }
  //   if (this.body.grupo == undefined) {
  //     this.body.grupo = "";
  //   }
  //   this.sigaServices.post("usuarios_update", this.body).subscribe(
  //     data => {
  //       this.showSuccess();
  //       console.log(data);
  //     },
  //     err => {
  //       this.showFail();
  //       console.log(err);
  //     },
  //     () => {
  //       this.cancelar();
  //       this.isBuscar();
  //       this.table.reset();
  //     }
  //   );
  // }

  isBuscar() {
    this.arreglarFecha();
    this.Search();
  }

  Search() {
    //this.arreglarFecha(); sobra porque se entra siempre en this.isBuscar();

    this.progressSpinner = true;
    this.buscar = true;
    this.historico = false;
    this.selectAll = false;
    this.selectMultiple = false;
    this.selectedDatos = "";
    // comprobaciones para body de search
    this.body.fechaConstitucion = this.fechaConstitucionArreglada;
    if (this.body.tipo == undefined) {
      this.body.tipo = "";
    }
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
    // this.body.idInstitucion = "2000";
    this.sigaServices
      .postPaginado("busquedaPerJuridica_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          console.log(data);
          this.progressSpinner = false;
          this.personaSearch = JSON.parse(data["body"]);
          this.datos = this.personaSearch.busquedaJuridicaItems;
          this.table.paginator = true;
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

  obtenerIntegrantes(dato) {
    return dato.numeroIntegrantes;
  }

  obtenerNombreIntegrantes(dato) {
    return dato.nombresIntegrantes;
  }

  paginate(event) {
    console.log(event);
  }
  // editarUsuario(selectedItem) {
  //   // if (!this.selectMultiple) {
  //   if (selectedItem.length == 1) {
  //     this.body = new UsuarioRequestDto();
  //     this.body = selectedItem[0];
  //     this.editar = false;
  //     this.disabledRadio = false;
  //   } else {
  //     this.editar = false;
  //     this.dniCorrecto = null;
  //     this.body = new UsuarioRequestDto();
  //     this.body.activo = selectedItem[0].activo;
  //   }
  //   if (this.body.activo == "N") {
  //     this.activo = true;
  //   } else {
  //     this.activo = false;
  //   }
  // }

  cancelar() {
    this.editar = true;
    this.dniCorrecto = null;
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
      // this.personaDelete.busquedaJuridicaItems.push(personaItem);
      console.log(value);
      // deletePersonas.push(value.idPersona);
    });
    this.sigaServices.post("busquedaPerJuridica_delete", personaItem).subscribe(
      data => {
        this.showSuccessDelete(selectedItem.length);
      },
      err => {
        this.showFail();
        console.log(err);
      },
      () => {
        this.editar = true;
        this.dniCorrecto = null;
        this.body = new PersonaJuridicaItem();
        this.disabledRadio = false;
        this.isBuscar();
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
    let a = this.body;
    this.sigaServices.post("busquedaPerJuridica_create", this.body).subscribe(
      data => {
        this.personaSearch = JSON.parse(data["body"]);
        this.showSuccess();
      },
      error => {
        this.personaSearch = JSON.parse(error["error"]);
        this.showduplicateFail(this.personaSearch.error.message.toString());
        console.log(error);
        this.showFail();
      },
      () => {
        this.cancelar();
        this.isBuscar();
        this.table.reset();
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

  irEditarPersona(id) {
    if (!this.selectMultiple) {
      var ir = null;
      if (id && id.length > 0) {
        ir = id[0];
      }
      sessionStorage.setItem("usuarioBody", JSON.stringify(id));
      sessionStorage.setItem(
        "privilegios",
        JSON.stringify(this.activacionEditar)
      );
      sessionStorage.setItem("editedUser", JSON.stringify(this.selectedDatos));
      sessionStorage.setItem("first", JSON.stringify(this.table.first));
      this.router.navigate(["fichaPersonaJuridica"]);
    } else {
      this.editar = true;
      this.dniCorrecto = null;
      this.body = new PersonaJuridicaItem();
    }
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
    } else {
      this.selectedDatos = [];
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
}
