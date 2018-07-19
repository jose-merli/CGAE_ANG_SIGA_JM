import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { SigaServices } from "./../../../../_services/siga.service";
import { SigaWrapper } from "../../../../wrapper/wrapper.class";
import { esCalendar } from "./../../../../utils/calendar";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../../properties/val-properties";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { Message } from "primeng/components/common/api";
import { ContadorItem } from "../../../../../app/models/ContadorItem";
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
  editar: boolean = false;
  disabled: boolean = false;
  correcto: boolean = false;
  checkmodificable: boolean = false;
  fechareconfiguracion: Date;
  showDatosGenerales: boolean = true;
  showReconfiguracion: boolean = true;
  es: any = esCalendar;
  jsonDate: string;
  rawDate: string;
  splitDate: any[];
  arrayDate: string;

  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  permisos: any;
  permisosArray: any[];
  derechoAcceso: any;
  comparacion: boolean;

  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private confirmationService: ConfirmationService,
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
    this.controlAcceso.idProceso = "112";
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
          this.editar = true;
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
    if (this.body.nombre != null) {
      this.body.nombre = this.body.nombre.trim();
    }
    if (this.body.descripcion != null) {
      this.body.descripcion = this.body.descripcion.trim();
    }
    if (this.body.prefijo != null) {
      this.body.prefijo = this.body.prefijo.trim();
    }
    if (this.body.idcontador != null) {
      this.body.idcontador = this.body.idcontador.trim();
    }
    if (this.body.reconfiguracionprefijo != null) {
      this.body.reconfiguracionprefijo = this.body.reconfiguracionprefijo.trim();
    }
    if (this.body.reconfiguracionsufijo != null) {
      this.body.reconfiguracionsufijo = this.body.reconfiguracionsufijo.trim();
    }
    if (this.body.reconfiguracioncontador != null) {
      this.body.reconfiguracioncontador = this.body.reconfiguracioncontador.trim();
    }
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

  clear() {
    this.msgs = [];
  }
}
