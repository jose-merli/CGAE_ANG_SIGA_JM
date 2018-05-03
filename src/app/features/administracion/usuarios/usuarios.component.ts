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
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { UsuarioRequestDto } from "./../../../../app/models/UsuarioRequestDto";
import { UsuarioResponseDto } from "./../../../../app/models/UsuarioResponseDto";
import { UsuarioDeleteRequestDto } from "./../../../../app/models/UsuarioDeleteRequestDto";
import { UsuarioItem } from "./../../../../app/models/UsuarioItem";
import { ComboItem } from "./../../../../app/models/ComboItem";
import { MultiSelectModule } from "primeng/multiSelect";
import { ControlAccesoDto } from "./../../../../app/models/ControlAccesoDto";

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styleUrls: ["./usuarios.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class Usuarios extends SigaWrapper implements OnInit {
  usuarios_rol: any[];
  usuarios_perfil: any[];
  cols: any = [];
  datos: any[];
  select: any[];
  msgs: Message[] = [];
  searchUser: UsuarioResponseDto = new UsuarioResponseDto();
  rowsPerPage: any = [];
  body: UsuarioRequestDto = new UsuarioRequestDto();
  usuariosDelete: UsuarioDeleteRequestDto = new UsuarioDeleteRequestDto();
  showDatosGenerales: boolean = true;
  pButton;
  editar: boolean = false;
  buscar: boolean = false;
  disabledRadio: boolean = false;
  disabled: boolean = false;
  selectMultiple: boolean = false;
  blockCrear: boolean = true;
  selectedItem: number = 10;
  activo: boolean = false;
  dniCorrecto: boolean;
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  permisosTree: any;
  permisosArray: any[];
  derechoAcceso: any;
  activacionEditar: boolean;

  private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

  constructor(
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService
  ) {
    super(USER_VALIDATIONS);
  }
  @ViewChild("table") table;
  ngOnInit() {
    this.activo = true;
    this.checkAcceso();
    this.sigaServices.get("usuarios_rol").subscribe(
      n => {
        this.usuarios_rol = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
    this.sigaServices.get("usuarios_perfil").subscribe(
      n => {
        this.usuarios_perfil = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    this.cols = [
      { field: "nombreApellidos", header: "Nombre y Apellidos" },
      { field: "nif", header: "NIF" },
      { field: "fechaAlta", header: "Fecha de Alta" },
      { field: "activo", header: "Activo" },
      { field: "roles", header: "Roles" }
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
    if (sessionStorage.getItem("searchUser") != null) {
      this.body = JSON.parse(sessionStorage.getItem("searchUser"));
      this.isBuscar();
      sessionStorage.removeItem("searchUser");
      sessionStorage.removeItem("usuarioBody");
    } else {
      this.body = new UsuarioRequestDto();
      this.body.activo = "S";
    }
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

  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = 83;
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

  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }

  onChangeForm() {
    if (
      this.body.nombreApellidos != "" &&
      this.body.nombreApellidos != undefined &&
      (this.body.nif != "" && this.body.nif != undefined) &&
      (this.body.rol != "" && this.body.rol != undefined) &&
      (this.body.grupo != "" && this.body.grupo != undefined)
    ) {
      this.blockCrear = false;
    } else {
      this.blockCrear = true;
    }
    if (this.body.nif == "") {
      this.dniCorrecto = null;
    } else {
      this.dniCorrecto = this.isValidDNI(this.body.nif);
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
  }
  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  sendEdit() {
    console.log(this.body);
    if (this.body.codigoExterno == undefined) {
      this.body.codigoExterno = "";
    }
    if (this.body.grupo == undefined) {
      this.body.grupo = "";
    }
    this.sigaServices.post("usuarios_update", this.body).subscribe(
      data => {
        this.showSuccess();
        console.log(data);
      },
      err => {
        this.showFail();
        console.log(err);
      },
      () => {
        this.cancelar();
        this.isBuscar();
        this.table.reset();
      }
    );
  }

  isBuscar() {
    if (this.isValidDNI(this.body.nif)) {
      this.dniCorrecto = true;
    } else {
      this.dniCorrecto = false;
    }

    this.Search();
  }

  Search() {
    if (this.body.nif == "" || this.body.nif == null) {
      this.dniCorrecto = null;
    }
    this.buscar = true;
    if (this.body.nombreApellidos == undefined) {
      this.body.nombreApellidos = "";
    }
    if (UsuarioRequestDto == undefined) {
      this.body.activo = "S";
      this.activo = true;
    }
    if (this.body.grupo == undefined) {
      this.body.grupo = "";
    }
    if (this.body.nif == undefined) {
      this.body.nif = "";
    }
    if (this.body.rol == undefined) {
      this.body.rol = "";
    }
    this.body.idInstitucion = "2000";
    this.sigaServices
      .postPaginado("usuarios_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          console.log(data);

          this.searchUser = JSON.parse(data["body"]);
          this.datos = this.searchUser.usuarioItem;
        },
        err => {
          console.log(err);
        }
      );
  }

  editarUsuario(selectedItem) {
    // if (!this.selectMultiple) {
    if (selectedItem.length == 1) {
      this.body = new UsuarioRequestDto();
      this.body = selectedItem[0];
      this.usuarios_rol.forEach((value: ComboItem, key: number) => {
        if (value.label == selectedItem[0].roles) {
          this.body.rol = value.value;
        }
      });
      this.editar = true;
      this.disabledRadio = false;
    } else {
      this.editar = false;
      this.dniCorrecto = null;
      this.body = new UsuarioRequestDto();
      this.body.activo = selectedItem[0].activo;
    }
    if (this.body.activo == "N") {
      this.activo = true;
    } else {
      this.activo = false;
    }
  }

  cancelar() {
    this.editar = false;
    this.dniCorrecto = null;
    this.body = new UsuarioRequestDto();
    this.body.activo = "S";
    this.disabledRadio = false;
  }

  borrar(selectedItem) {
    this.usuariosDelete = new UsuarioDeleteRequestDto();
    selectedItem.forEach((value: UsuarioItem, key: number) => {
      console.log(value);
      this.usuariosDelete.idUsuario.push(value.idUsuario);
      this.usuariosDelete.activo = value.activo;
      this.usuariosDelete.idInstitucion = "2000";
    });
    this.sigaServices.post("usuarios_delete", this.usuariosDelete).subscribe(
      data => {
        this.showSuccessDelete(selectedItem.length);
      },
      err => {
        this.showFail();
        console.log(err);
      },
      () => {
        this.editar = false;
        this.dniCorrecto = null;
        this.body = new UsuarioRequestDto();
        this.body.activo = selectedItem[0].activo;
        this.disabledRadio = false;
        this.isBuscar();
        this.table.reset();
      }
    );
  }

  crear() {
    this.sigaServices.post("usuarios_insert", this.body).subscribe(
      data => {
        this.showSuccess();
      },
      err => {
        console.log(err);
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
    if (this.activo) {
      if (number >= 2) {
        msg =
          number +
          this.translateService.instant("messages.deleted.selected.success");
      } else {
        msg = this.translateService.instant("messages.deleted.success");
      }
    } else {
      if (number >= 2) {
        msg =
          this.translateService.instant(
            "general.message.registro.restaurados"
          ) +
          number +
          this.translateService.instant(
            "cargaMasivaDatosCurriculares.numRegistros.literal"
          );
      } else {
        msg = this.translateService.instant(
          "general.message.registro.restaurado"
        );
      }
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
  confirmarBorrar(selectedItem) {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    let icon = "fa fa-trash-alt";

    if (selectedItem.length > 1) {
      mess =
        this.translateService.instant("messages.deleteConfirmation.much") +
        selectedItem.length +
        this.translateService.instant("messages.deleteConfirmation.register") +
        "?";
    }
    if (this.activo == true) {
      icon = "fa fa-check";
      if (selectedItem.length > 1) {
        (mess = this.translateService.instant(
          "general.message.confirmar.rehabilitaciones"
        )),
          +selectedItem.length +
            this.translateService.instant(
              "cargaMasivaDatosCurriculares.numRegistros.literal"
            );
      } else {
        mess = this.translateService.instant(
          "general.message.confirmar.rehabilitacion"
        );
      }
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
  confirmarBuscar() {
    if (
      (this.body.nombreApellidos == "" ||
        this.body.nombreApellidos == undefined) &&
      (this.body.nif == "" || this.body.nif == undefined) &&
      (this.body.rol == "" || this.body.rol == undefined) &&
      (this.body.grupo == "" || this.body.grupo == undefined)
    ) {
      this.confirmationService.confirm({
        message: this.translateService.instant(
          "administracion.grupos.asignarUsuariosGrupo.literal.busquedaCostosa"
        ),
        icon: "fa fa-search ",
        accept: () => {
          this.isBuscar();
        },
        reject: () => {
          this.msgs = [
            {
              severity: "info",
              summary: "Info",
              detail: this.translateService.instant(
                "general.message.accion.cancelada"
              )
            }
          ];
        }
      });
    } else {
      this.isBuscar();
    }
  }

  irEditarUsuario(id) {
    if (!this.selectMultiple) {
      var ir = null;
      if (id && id.length > 0) {
        ir = id[0];
      }
      sessionStorage.removeItem("usuarioBody");
      sessionStorage.removeItem("privilegios");
      sessionStorage.setItem("usuarioBody", JSON.stringify(id));
      sessionStorage.setItem(
        "privilegios",
        JSON.stringify(this.activacionEditar)
      );
      sessionStorage.setItem("searchUser", JSON.stringify(this.body));
      this.router.navigate(["/editarUsuario", ir]);
    } else {
      this.editar = false;
      this.dniCorrecto = null;
      this.body = new UsuarioRequestDto();
      this.body.activo = id[0].activo;
    }

    if (this.body.activo == "N") {
      this.activo = true;
    } else {
      this.activo = false;
    }
  }
}
