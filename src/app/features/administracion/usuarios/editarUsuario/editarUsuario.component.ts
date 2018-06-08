import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  Input
} from "@angular/core";
import { SigaServices } from "./../../../../_services/siga.service";
import { SigaWrapper } from "../../../../wrapper/wrapper.class";
import { SelectItem } from "primeng/api";
import { DropdownModule } from "primeng/dropdown";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../../properties/val-properties";
import { ButtonModule } from "primeng/button";
import { Router } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CheckboxModule } from "primeng/checkbox";
import { MultiSelectModule } from "primeng/multiSelect";
import { RadioButtonModule } from "primeng/radiobutton";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { GrowlModule } from "primeng/growl";
import { ConfirmationService } from "primeng/api";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { UsuarioItem } from "../../../../../app/models/UsuarioItem";
import { UsuarioUpdate } from "../../../../../app/models/UsuarioUpdate";
import { ComboItem } from "../../../../../app/models/ComboItem";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
@Component({
  selector: "app-editarUsuario",
  templateUrl: "./editarUsuario.component.html",
  styleUrls: ["./editarUsuario.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class EditarUsuarioComponent extends SigaWrapper implements OnInit {
  usuarios_rol: any[];
  usuarios_perfil: any[];
  select: any[];
  selectPerfil: any[];
  msgs: Message[] = [];
  body: UsuarioItem = new UsuarioItem();
  updateUser: UsuarioUpdate = new UsuarioUpdate();
  pButton;
  textSelected: String = "{0} perfiles seleccionados";
  textFilter: String;
  editar: boolean = true;
  disabled: boolean = false;
  activo: boolean = false;
  correcto: boolean = false;
  dniCorrecto: boolean;
  showDatosGenerales: boolean = true;
  activacionEditar: boolean = true;
  edicion: boolean = true;
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
  @ViewChild("table") table;
  ngOnInit() {
    console.log(sessionStorage);

    this.textFilter = "Elegir";
    this.correcto = false;

    this.body = new UsuarioItem();
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
      },
      () => {
        this.body = JSON.parse(sessionStorage.getItem("usuarioBody"))[0];
        this.edicion = JSON.parse(sessionStorage.getItem("privilegios"));
        this.activacionEditar = this.edicion;
        sessionStorage.removeItem("usuarioBody");
        sessionStorage.removeItem("privilegios");
        this.selectPerfil = [];
        this.body.perfiles.forEach((valuePerfil: String, key: number) => {
          this.usuarios_perfil.forEach((value: ComboItem, key: number) => {
            if (valuePerfil == value.value) {
              this.selectPerfil.push(value);
            }
          });
        });
      }
    );
  }

  pInputText;
  confirmEdit() {
    let mess = this.translateService.instant(
      "general.message.aceptar.y.volver"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.sendEdit();
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
  sendEdit() {
    console.log(this.body);

    if (this.body.codigoExterno == undefined) {
      this.body.codigoExterno = "";
    }
    if (this.body.grupo == undefined) {
      this.body.grupo == null;
    }
    this.updateUser.activo = this.body.activo;
    this.updateUser.codigoExterno = this.body.codigoExterno;
    this.updateUser.fechaAlta = this.body.fechaAlta;
    this.updateUser.grupo = this.body.grupo;
    this.updateUser.idInstitucion = this.body.idInstitucion;
    this.updateUser.idUsuario = this.body.idUsuario;
    this.updateUser.nif = this.body.nif;
    this.updateUser.nombreApellidos = this.body.nombreApellidos;
    this.updateUser.rol = this.body.roles;
    if (this.selectPerfil.length > 0) {
      this.updateUser.idGrupo = [];
      this.selectPerfil.forEach((value: ComboItem, key: number) => {
        this.updateUser.idGrupo.push(value.value);
      });
    } else {
      this.updateUser.idGrupo = [];
    }
    this.usuarios_rol.forEach((value: ComboItem, key: number) => {
      if (value.label == this.body.roles) {
        this.updateUser.rol = value.value;
      }
    });
    this.sigaServices.post("usuarios_update", this.updateUser).subscribe(
      data => {
        this.showSuccess();
        this.correcto = true;
        console.log(data);
      },
      err => {
        this.showFail();
        this.correcto = false;
        console.log(err);
      },
      () => {
        if (this.correcto) {
          this.volver();
        }
      }
    );
  }
  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  onChangeForm() {
    if (this.body.perfiles.length == 0) {
      this.edicion = false;
    } else if (this.activacionEditar) {
      this.edicion = true;
    }
  }
  cambios(event) {
    console.log(event);
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
      summary: "Incorrecto",
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  volver() {
    this.location.back();
  }
}
