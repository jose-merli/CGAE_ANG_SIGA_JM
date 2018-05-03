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
import { esCalendar } from "./../../../../utils/calendar";
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
import { ControlAccesoDto } from "../../../../../app/models/ControlAccesoDto";

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
  bodyPermanente: ContadorItem = new ContadorItem();
  pButton;
  textSelected: String = "{0} grupos seleccionados";
  textFilter: String;
  editar: boolean = false;
  disabled: boolean = false;
  activo: boolean = false;
  correcto: boolean = false;
  dniCorrecto: boolean;
  checkmodificable: boolean = false;
  fechareconfiguracion: Date;
  showDatosGenerales: boolean = true;
  showReconfiguracion: boolean = true;
  es: any = esCalendar;
  jsonDate: string;
  rawDate: string;
  splitDate: any[];
  arrayDate: string;
  addedDay: number;

  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  permisos: any;
  permisosArray: any[];
  derechoAcceso: any;
  comparacion: boolean;

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
    this.checkAcceso();
    this.sigaServices.get("contadores_modo").subscribe(
      n => {
        this.contadores_modo = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    this.body = new ContadorItem();
    this.bodyPermanente = new ContadorItem();
    this.body = JSON.parse(sessionStorage.getItem("contadorBody"));
    this.bodyPermanente = JSON.parse(sessionStorage.getItem("contadorBody"));
    this.bodyToModificable();
  }
  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = 84;
    this.sigaServices.post("acces_control", this.controlAcceso).subscribe(
      data => {
        this.permisos = JSON.parse(data.body);
        this.permisosArray = this.permisos.permisoItems;
        this.derechoAcceso = this.permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        if (this.derechoAcceso == 3) {
          this.editar = false;
        } else {
          this.editar = false;
        }
      }
    );
  }

  checkEditar() {
    this.comparacion =
      JSON.stringify(this.bodyPermanente) == JSON.stringify(this.body);
    if (this.editar == true && !this.comparacion) {
      return false;
    } else {
      return true;
    }
  }

  isRestablecer() {
    this.body = JSON.parse(sessionStorage.getItem("contadorBody"));
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

  modificableToBody() {
    this.arreglarDate();
    if (this.checkmodificable == true) {
      this.body.modificablecontador = "1";
    } else {
      this.body.modificablecontador = "0";
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
