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
import { CatalogoRequestDto } from "../../../../../app/models/CatalogoRequestDto";
import { CatalogoUpdateRequestDto } from "../../../../../app/models/CatalogoUpdateRequestDto";
import { ComboItem } from "../../../../../app/models/ComboItem";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-editarCatalogosMaestros",
  templateUrl: "./editarCatalogosMaestros.component.html",
  styleUrls: ["./editarCatalogosMaestros.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class EditarCatalogosMaestrosComponent extends SigaWrapper
  implements OnInit {
  usuarios_rol: any[];
  usuarios_perfil: any[];
  select: any[];
  msgs: Message[] = [];
  body: CatalogoRequestDto = new CatalogoRequestDto();
  upd: CatalogoUpdateRequestDto = new CatalogoUpdateRequestDto();
  pButton;
  textSelected: String = "{0} grupos seleccionados";
  textFilter: String;
  editar: boolean = true;
  disabled: boolean = false;
  activo: boolean = false;
  correcto: boolean = false;
  dniCorrecto: boolean;
  blockSeleccionar: boolean = false;
  showDatosGenerales: boolean = true;
  //elementos del form
  formDescripcion: String;
  formCodigo: String;
  //Array de opciones del dropdown
  catalogoArray: any[];

  activacionEditar: boolean;
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
    this.sigaServices.get("maestros_rol").subscribe(
      n => {
        this.catalogoArray = n.comboCatalogoItems;
      },
      err => {
        console.log(err);
      }
    );
    console.log(sessionStorage);

    this.textFilter = "Elegir";
    this.correcto = false;

    this.body = new CatalogoRequestDto();
    this.body = JSON.parse(sessionStorage.getItem("catalogoBody"))[0];
    this.activacionEditar = JSON.parse(sessionStorage.getItem("privilegios"));
    sessionStorage.removeItem("catalogoBody");
    sessionStorage.removeItem("privilegios");
  }

  pInputText;

  isEditar() {
    this.upd = new CatalogoUpdateRequestDto();
    this.upd.tabla = this.body.catalogo;
    this.upd.descripcion = this.body.descripcion;
    this.upd.codigoExt = this.body.codigoExt;
    this.upd.idRegistro = this.body.idRegistro;
    this.blockSeleccionar = true;
    this.sigaServices.post("maestros_update", this.upd).subscribe(
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
    this.router.navigate(["/catalogosMaestros"]);
  }
}
