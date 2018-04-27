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
import { ContadorItem } from "./../../../../../../app/models/ContadorItem";
import { UsuarioUpdate } from "./../../../../../../app/models/UsuarioUpdate";
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
  body: ContadorItem = new ContadorItem();
  pButton;
  textSelected: String = "{0} grupos seleccionados";
  textFilter: String;
  fechaentrada: Date;
  fechaefectiva: Date;
  disabled: boolean;
  showDatosGenerales: boolean = true;
  showReconfiguracion: boolean = true;
  es: any = esCalendar;
  jsonDate: string;
  rawDate: string;
  splitDate: any[];
  arrayDate: string;
  addedDay: number;
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

    this.sigaServices.get("auditoriaUsuarios_update").subscribe(
      n => {
        this.auditoriaUsuarios_update = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    this.body = new ContadorItem();
    this.body = JSON.parse(sessionStorage.getItem("AuditoriaBody"));
    this.bodyToModificable();
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
    this.bodyToModificable();
  }

  bodyToModificable() {
    this.fechareconfiguracion = this.body.fechareconfiguracion;
    if (this.body.modificablecontador == "1") {
      this.checkmodificable = true;
    } else {
      this.checkmodificable = false;
    }
  }

  modificableToBody() {
    this.arreglarDate();
    if (this.checkmodificable == true) {
      this.body.modificablecontador = "1";
    } else {
      this.body.modificablecontador = "0";
    }
  }

  //Arreglo el fomato de la fecha añadiendole horas, minutos y segundos para que se guarde en el back correctamente, además lo separo para reordenar dia mes y año según debe estar escrito en el update.
  arreglarDate() {
    this.jsonDate = JSON.stringify(this.fechareconfiguracion);
    this.rawDate = this.jsonDate.slice(1, -1);
    if (this.rawDate.length < 14) {
      this.splitDate = this.rawDate.split("-");
      this.arrayDate =
        this.splitDate[2] + "-" + this.splitDate[1] + "-" + this.splitDate[0];
      this.body.fechareconfiguracion = new Date(
        (this.arrayDate += "T00:00:00.001Z")
      );
      this.body.fechareconfiguracion = new Date(this.arrayDate);
    } else {
      this.body.fechareconfiguracion = new Date(this.rawDate);
    }
  }

  pInputText;
  isEditar() {
    this.modificableToBody();
    this.sigaServices.post("contadores_update", this.body).subscribe(
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
