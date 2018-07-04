import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  Input
} from "@angular/core";
import { SigaServices } from "./../../../_services/siga.service";
import { SigaWrapper } from "../../../wrapper/wrapper.class";
import { SelectItem } from "primeng/api";
import { DropdownModule } from "primeng/dropdown";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
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
import { MultiSelectModule } from "primeng/multiSelect";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { PerfilItem } from "./../../../../app/models/PerfilItem";
import { PerfilesResponseDto } from "./../../../../app/models/PerfilesResponseDto";
import { PerfilesRequestDto } from "./../../../../app/models/PerfilesRequestDto";
import { ControlAccesoDto } from "./../../../../app/models/ControlAccesoDto";
import { ComboItem } from "./../../../../app/models/ComboItem";
import { DataTable } from "primeng/datatable";
import { Location } from "@angular/common";
import { Observable } from "rxjs/Rx";

@Component({
  selector: "app-perfiles",
  templateUrl: "./perfiles.component.html",
  styleUrls: ["./perfiles.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PerfilesComponent extends SigaWrapper implements OnInit {
  perfiles_data: any[];
  cols: any = [];
  datos: any[];
  msgs: Message[] = [];
  searchPerfiles: PerfilesResponseDto = new PerfilesResponseDto();
  requestPerfiles: PerfilesRequestDto = new PerfilesRequestDto();
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  rowsPerPage: any = [];
  showDatosGenerales: boolean = true;
  pButton;
  editar: boolean = false;
  buscar: boolean = true;
  historicoActive: boolean = false;
  disabled: boolean = false;
  selectMultiple: boolean = false;
  blockCrear: boolean = true;
  permisosTree: any;
  permisosArray: any[];
  derechoAcceso: any;
  activacionEditar: boolean;
  selectedItem: number = 10;
  selectAll: boolean = false;
  numSelected: number = 0;

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
    let tablaAnterior = JSON.parse(sessionStorage.getItem("searchOrHistory"));
    sessionStorage.removeItem("searchOrHistory");
    if (tablaAnterior == "history") {
      this.historico();
    } else {
      this.isBuscar();
    }
    this.checkAcceso();
    this.cols = [
      {
        field: "idGrupo",
        header: "administracion.grupos.literal.id"
      },
      {
        field: "descripcionGrupo",
        header: "general.description"
      },
      {
        field: "descripcionRol",
        header: "administracion.usuarios.literal.roles"
      },
      {
        field: "asignarRolDefecto",
        header: "menu.administracion.perfilrol"
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
    var registroActualizado = JSON.parse(
      sessionStorage.getItem("registroActualizado")
    );
    if (sessionStorage.getItem("editedUser") != null) {
      this.selectedDatos = JSON.parse(sessionStorage.getItem("editedUser"));
    }
    sessionStorage.removeItem("editedUser");
    if (registroActualizado) {
      this.showSuccess();
      sessionStorage.setItem("registroActualizado", JSON.stringify(false));
    }
  }

  isBuscar() {
    sessionStorage.setItem("searchOrHistory", JSON.stringify("search"));
    this.historicoActive = false;
    this.sigaServices
      .postPaginado("perfiles_search", "?numPagina=1", null)
      .subscribe(
        data => {
          console.log(data);
          this.searchPerfiles = JSON.parse(data["body"]);
          this.datos = this.searchPerfiles.usuarioGrupoItems;
          this.buscar = true;
          this.table.paginator = true;
          this.sigaServices.get("usuarios_rol").subscribe(
            n => { },
            err => {
              console.log(err);
            }
          );
        },
        err => {
          console.log(err);
        },
        () => {
          if (sessionStorage.getItem("first") != null) {
            let first = JSON.parse(sessionStorage.getItem("first")) as number;
            this.table.first = first;
            sessionStorage.removeItem("first");
          }
        }
      );
  }

  paginate(event) {
    console.log(event);
  }

  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "82";
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

  onChangeDrop(event, dato) {
    console.log(event);
    console.log(dato);
  }
  rolDefecto(event, dato) {
    let item = new PerfilItem();
    item.idGrupo = dato.idGrupo;
    dato.asignarRolDefecto.forEach((value: ComboItem, key: number) => {
      if (event.value == value.value) {
        item.asignarRolDefecto = [];
        item.asignarRolDefecto.push(value);
      }
    });
    this.sigaServices.post("perfiles_default", item).subscribe(
      data => {
        this.showSuccess();
        this.isBuscar();
      },
      err => {
        console.log(err);
      }
    );
  }
  confirmarRolDefecto(event, dato) {
    let mess = "¿Desea asignar este rol?";
    let icon = "fa fa-plus";

    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.rolDefecto(event, dato);
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
        this.isBuscar();
      }
    });
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
      this.numSelected = 0;
      this.selectedDatos = [];
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  editarUsuario(selectedItem) {
    // if (!this.selectMultiple) {
    if (selectedItem.length == 1) {
    } else {
      this.editar = false;
    }
  }

  cancelar() {
    this.editar = false;
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
      summary: "Error",
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }
  crear() {
    sessionStorage.setItem(
      "privilegios",
      JSON.stringify(this.activacionEditar)
    );
    sessionStorage.setItem("crear", JSON.stringify(true));
    this.router.navigate(["/EditarPerfiles"]);
  }
  irEditarUsuario(id) {
    if (!this.selectMultiple) {
      var ir = null;
      if (id && id.length > 0) {
        ir = id[0];
      }
      sessionStorage.setItem("crear", JSON.stringify(false));
      sessionStorage.removeItem("perfil");
      sessionStorage.removeItem("privilegios");
      sessionStorage.removeItem("first");
      sessionStorage.setItem("perfil", JSON.stringify(id));
      sessionStorage.setItem("editedUser", JSON.stringify(this.selectedDatos));
      sessionStorage.setItem("first", JSON.stringify(this.table.first));
      if (id[0].fechaBaja != null) {
        sessionStorage.setItem("privilegios", JSON.stringify(false));
      } else {
        sessionStorage.setItem(
          "privilegios",
          JSON.stringify(this.activacionEditar)
        );
      }
      this.router.navigate(["/EditarPerfiles"]);
    } else {
      this.editar = false;
      this.numSelected = this.selectedDatos.length
    }
  }
  isEliminar(selectedDatos) {
    console.log(selectedDatos);
    this.sigaServices.post("perfiles_delete", selectedDatos).subscribe(
      data => {
        if (selectedDatos == 1) {
          this.msgs = [];
          this.msgs.push({
            severity: "success",
            summary: "Correcto",
            detail: this.translateService.instant("messages.deleted.success")
          });
        } else {
          this.msgs = [];
          this.msgs.push({
            severity: "success",
            summary: "Correcto",
            detail:
              selectedDatos.length +
              " " +
              this.translateService.instant("messages.deleted.selected.success")
          });
        }
      },
      err => {
        console.log(err);
      },
      () => {
        this.isBuscar();
        this.editar = false;
      }
    );
  }
  historico() {
    sessionStorage.setItem("searchOrHistory", JSON.stringify("history"));
    this.historicoActive = true;
    this.selectMultiple = false;
    this.sigaServices
      .postPaginado("perfiles_historico", "?numPagina=1", null)
      .subscribe(
        data => {
          console.log(data);
          this.searchPerfiles = JSON.parse(data["body"]);
          this.datos = this.searchPerfiles.usuarioGrupoItems;
          this.buscar = false;
        },
        err => {
          console.log(err);
        },
        () => {
          this.table.reset();
        }
      );
  }
  confirmarBorrar(selectedDatos) {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    let icon = "fa fa-trash-alt";

    if (selectedDatos.length > 1) {
      mess =
        this.translateService.instant("messages.deleteConfirmation.much") +
        selectedDatos.length +
        " " +
        this.translateService.instant("messages.deleteConfirmation.register") +
        "?";
    }
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.isEliminar(selectedDatos);
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
  setItalic(dato) {
    if (dato.fechaBaja == null) return false;
    else return true;
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.numSelected = this.datos.length;
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }


  clear() {
    this.msgs = [];
  }
}
