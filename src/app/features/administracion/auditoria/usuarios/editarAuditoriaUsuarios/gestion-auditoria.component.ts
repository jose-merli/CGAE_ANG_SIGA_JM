import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  Input
} from "@angular/core";
import { SigaServices } from "./../../../../../_services/siga.service";
import { SigaWrapper } from "./../../../../../wrapper/wrapper.class";
import { SelectItem } from "primeng/api";
import { DropdownModule } from "primeng/dropdown";
import { esCalendar } from "./../../../../../utils/calendar";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { TranslateService } from "./../../../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "./../../../../../properties/val-properties";
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
import { HistoricoUsuarioItem } from "./../../../../../../app/models/HistoricoUsuarioItem";
import { HistoricoUsuarioUpdateDto } from "./../../../../../../app/models/HistoricoUsuarioUpdateDto";
import { HistoricoUsuarioRequestDto } from "./../../../../../../app/models/HistoricoUsuarioRequestDto";
import { ComboItem } from "./../../../../../../app/models/ComboItem";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-gestion-auditoria",
  templateUrl: "./gestion-auditoria.component.html",
  styleUrls: ["./gestion-auditoria.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class GestionAuditoriaComponent extends SigaWrapper implements OnInit {
  auditoriaUsuarios_update: any[];
  msgs: Message[] = [];
  body: HistoricoUsuarioRequestDto = new HistoricoUsuarioRequestDto();
  update: HistoricoUsuarioUpdateDto = new HistoricoUsuarioUpdateDto();
  itemBody: HistoricoUsuarioItem = new HistoricoUsuarioItem();
  pButton;
  textSelected: String = "{0} grupos seleccionados";
  textFilter: String;
  fechaEntrada: Date;
  fechaEfectiva: Date;
  disabled: boolean;
  showDatosGenerales: boolean = true;
  showReconfiguracion: boolean = true;
  es: any = esCalendar;
  jsonDate: string;
  rawDate: string;
  splitDate: any[];
  arrayDate: string;
  addedDay: number;
  correcto: boolean;
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
    this.itemBody = new HistoricoUsuarioItem();
    this.itemBody = JSON.parse(sessionStorage.getItem("auditoriaBody"));
    console.log(sessionStorage);

    this.sigaServices.get("auditoriaUsuarios_update").subscribe(
      n => {
        this.auditoriaUsuarios_update = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    // this.bodyToForm();
    this.checkMode();
  }
  checkMode() {
    if (JSON.parse(sessionStorage.getItem("modo")) != null) {
      if (JSON.parse(sessionStorage.getItem("modo")) == "editar") {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    } else {
      this.disabled = false;
    }
  }
  isRestablecer() {
    this.body = JSON.parse(sessionStorage.getItem("auditoriaBody"));
    // this.bodyToForm();
  }

  // bodyToForm() {
  //   this.fechaEntrada = this.body.fechaEntrada;
  //   this.fechaEfectiva = this.body.fechaEfectiva;
  // }

  pInputText;
  isEditar() {
    this.sigaServices.post("contadores_update", this.update).subscribe(
      data => {
        this.showSuccess();
        console.log(data);
        this.correcto = true;
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
    this.router.navigate([JSON.parse(sessionStorage.getItem("url"))]);
  }
}
