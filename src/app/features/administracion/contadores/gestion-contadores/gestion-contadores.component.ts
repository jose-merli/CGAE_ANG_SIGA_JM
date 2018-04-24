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
import { ContadorItem } from "../../../../../app/models/ContadorItem";
import { UsuarioUpdate } from "../../../../../app/models/UsuarioUpdate";
import { ComboItem } from "../../../../../app/models/ComboItem";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-gestion-contadores",
  templateUrl: "./gestion-contadores.component.html",
  styleUrls: ["./gestion-contadores.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class GestionContadoresComponent extends SigaWrapper implements OnInit {
  contadores_modo: any[];
  msgs: Message[] = [];
  body: ContadorItem = new ContadorItem();
  restablecer: ContadorItem = new ContadorItem();
  pButton;
  textSelected: String = "{0} grupos seleccionados";
  textFilter: String;
  editar: boolean = true;
  disabled: boolean = false;
  activo: boolean = false;
  correcto: boolean = false;
  dniCorrecto: boolean;
  showDatosGenerales: boolean = true;
  showReconfiguracion: boolean = true;

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

    this.body = new ContadorItem();
    this.body = JSON.parse(sessionStorage.getItem("contadorBody"))[0];
    this.restablecer = this.body;
    this.sigaServices.get("contadores_modo").subscribe(
      n => {
        this.contadores_modo = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  isRestablecer() {
    this.body = this.restablecer;
  }

  pInputText;
  isEditar() {
    //     this.updateContador.contador = this.body.contador;
    //     this.updateContador.descripcion = this.body.descripcion;
    //     this.updateContador.fechacreacion = this.body.fechacreacion;
    //     this.updateContador.fechamodificacion = this.body.fechamodificacion;
    //     this.updateContador.fechareconfiguracion = this.body.fechareconfiguracion;
    // this.updateContador.idcampocontador=this.body.idcampocontador;
    // this.updateContador.idcampoprefijo

    this.sigaServices.post("contador_update", this.body).subscribe(
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
  onHideReconfiguracion() {
    this.showReconfiguracion = !this.showReconfiguracion;
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
    this.router.navigate(["/contadores"]);
  }
}
