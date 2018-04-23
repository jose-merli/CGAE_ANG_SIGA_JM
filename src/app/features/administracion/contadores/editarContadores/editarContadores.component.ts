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
@Component({
  selector: "app-editarContadores",
  templateUrl: "./editarContadores.component.html",
  styleUrls: ["./editarContadores.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class EditarContadoresComponent extends SigaWrapper implements OnInit {
  usuarios_rol: any[];
  usuarios_perfil: any[];
  select: any[];
  msgs: Message[] = [];
  body: UsuarioItem = new UsuarioItem();
  updateUser: UsuarioUpdate = new UsuarioUpdate();
  pButton;
  textSelected: String = "{0} grupos seleccionados";
  textFilter: String;
  editar: boolean = true;
  disabled: boolean = false;
  activo: boolean = false;
  correcto: boolean = false;
  dniCorrecto: boolean;
  showDatosGenerales: boolean = true;

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
    console.log(sessionStorage);

    this.textFilter = "Elegir";
    this.correcto = false;

    this.body = new UsuarioItem();
    this.body = JSON.parse(sessionStorage.getItem("usuarioBody"))[0];

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
        this.showSuccess();
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
      this.body.perfiles == null;
    }
    this.updateUser.activo = this.body.activo;
    this.updateUser.codigoExterno = this.body.codigoExterno;
    this.updateUser.fechaAlta = this.body.fechaAlta;
    this.updateUser.grupo = this.body.grupo;
    this.updateUser.idGrupo = this.body.perfiles;
    this.updateUser.idInstitucion = this.body.idInstitucion;
    this.updateUser.idUsuario = this.body.idUsuario;
    this.updateUser.nif = this.body.nif;
    this.updateUser.nombreApellidos = this.body.nombreApellidos;
    this.updateUser.rol = this.body.roles;
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
    this.router.navigate(["/usuarios"]);
  }
}
