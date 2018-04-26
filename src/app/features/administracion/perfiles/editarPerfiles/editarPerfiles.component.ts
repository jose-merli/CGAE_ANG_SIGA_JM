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
import { PerfilItem } from "../../../../../app/models/PerfilItem";
import { UsuarioUpdate } from "../../../../../app/models/UsuarioUpdate";
import { ComboItem } from "../../../../../app/models/ComboItem";
import { ActivatedRoute } from "@angular/router";
import { PickListModule } from "primeng/picklist";
@Component({
  selector: "app-editarPerfiles",
  templateUrl: "./editarPerfiles.component.html",
  styleUrls: ["./editarPerfiles.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class EditarPerfilesComponent extends SigaWrapper implements OnInit {
  select: any[];
  msgs: Message[] = [];
  body: PerfilItem = new PerfilItem();
  rolesAsignados: any[];
  rolesNoAsignados: any[];
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
    this.rolesAsignados = [];
    this.rolesNoAsignados = [];
    this.textFilter = "Elegir";
    this.correcto = false;
    this.body = new PerfilItem();
    if (sessionStorage.getItem("perfil") != null) {
      this.body = JSON.parse(sessionStorage.getItem("perfil"))[0];
      this.fillRol();
    } else {
      this.body = new PerfilItem();
    }
  }

  fillRol() {
    if (this.body.rolesAsignados != null) {
      this.body.rolesAsignados.forEach((value: ComboItem, key: number) => {
        this.rolesAsignados.push(value);
      });
    }
    if (this.body.rolesNoAsignados != null) {
      this.body.rolesNoAsignados.forEach((value: ComboItem, key: number) => {
        this.rolesNoAsignados.push(value);
      });
    }
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
        this.isEditar();
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
  isEditar() {
    this.body.rolesAsignados = this.rolesAsignados;
    this.body.rolesNoAsignados = this.rolesNoAsignados;
    this.sigaServices.post("usuarios_delete", this.body).subscribe(
      data => {},
      err => {
        this.showFail();
        console.log(err);
      },
      () => {
        this.volver();
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
    this.router.navigate(["/perfiles"]);
  }
}
