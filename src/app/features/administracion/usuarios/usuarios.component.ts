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
import { Router } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { GrowlModule } from "primeng/growl";
import { ConfirmationService } from "primeng/api";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
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
  selectedItem: number = 4;
  activo: boolean = false;
  dniCorrecto: boolean;

  private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

  constructor(
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {
    super(USER_VALIDATIONS);
  }
  @ViewChild("table") table;
  ngOnInit() {
    this.activo = true;
    this.body = new UsuarioRequestDto();
    this.body.activo = "S";
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
        label: 4,
        value: 4
      },
      {
        label: 6,
        value: 6
      },
      {
        label: 8,
        value: 8
      },
      {
        label: 10,
        value: 10
      }
    ];
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
  prueba(event) {
    console.log("");
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

    if (this.isValidDNI(this.body.nif)) {
      this.dniCorrecto = true;
    } else {
      this.dniCorrecto = false;
    }
    if (this.body.nif == "") {
      this.dniCorrecto = null;
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
        this.showSuccess();
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
      summary: "Correcto",
      detail: "Accion realizada correctamente"
    });
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: "Error, fallo al realizar la accion"
    });
  }
  confirmarBorrar(selectedItem) {
    let mess = "¿Está seguro que desea eliminar el registro?";
    let icon = "fa fa-trash-alt";

    if (selectedItem.length > 1) {
      mess =
        "¿Está seguro que desea eliminar " +
        selectedItem.length +
        " registros?";
    }
    if (this.activo == true) {
      icon = "fa fa-check";
      if (selectedItem.length > 1) {
        mess =
          "¿Está seguro que desea rehabilitar " +
          selectedItem.length +
          " registros?";
      } else {
        mess = "¿Está seguro que desea rehabilitar el registro?";
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
            detail: "Acción cancelada por el usuario"
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
              summary: "Rejected",
              detail: "You have rejected"
            }
          ];
        }
      });
    } else {
      this.isBuscar();
    }
  }
}

export class UsuarioItem {
  nombreApellidos: String;
  nif: String;
  fechaAlta: Date;
  codigoExterno: String;
  roles: String;
  activo: String;
  idGrupo: String;
  grupo: String;
  idUsuario: String;
  idInstitucion: String;
  constructor() {}
}
export class UsuarioResponseDto {
  error: String;
  usuarioItem: UsuarioItem[] = [];
  constructor() {}
}
export class ComboItem {
  label: String;
  value: String;
  constructor() {}
}

export class UsuarioRequestDto {
  nombreApellidos: String;
  nif: String;
  fechaAlta: Date;
  rol: String;
  activo: String;
  grupo: String;
  idInstitucion: "2000";
  codigoExterno: String;
  constructor() {}
}
export class UsuarioDeleteRequestDto {
  error: String;
  idUsuario: String[] = [];
  activo: String;
  idInstitucion: String;
  constructor() {}
}
