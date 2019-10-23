import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { SigaServices } from "./../../../../../_services/siga.service";
import { SigaWrapper } from "./../../../../../wrapper/wrapper.class";
import { esCalendar } from "./../../../../../utils/calendar";
import { TranslateService } from "./../../../../../commons/translate/translation.service";
import { Router } from "@angular/router";
import { USER_VALIDATIONS } from "./../../../../../properties/val-properties";
import { ConfirmationService } from "primeng/api";
import { Message } from "primeng/components/common/api";
import { HistoricoUsuarioItem } from "./../../../../../../app/models/HistoricoUsuarioItem";
import { HistoricoUsuarioUpdateDto } from "./../../../../../../app/models/HistoricoUsuarioUpdateDto";
import { HistoricoUsuarioRequestDto } from "./../../../../../../app/models/HistoricoUsuarioRequestDto";
import { ControlAccesoDto } from "./../../../../../../app/models/ControlAccesoDto";
import { Location } from "@angular/common";
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
  disabled: boolean;
  showDatosGenerales: boolean = true;
  showReconfiguracion: boolean = true;
  es: any = esCalendar;
  correcto: boolean;
  habilitarBotonGuardarCerrar: boolean = true;
  motivoSinModificar: String;
  pButton;
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  permisos: any;
  permisosArray: any[];
  derechoAcceso: any;
  activacionEditar: boolean;

  constructor(
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private router: Router,
    private location: Location
  ) {
    super(USER_VALIDATIONS);
  }
  @ViewChild("table") table;
  ngOnInit() {
    this.checkAcceso();
    this.itemBody = new HistoricoUsuarioItem();
    this.itemBody = JSON.parse(sessionStorage.getItem("auditoriaUsuarioBody"));
    this.arreglarFechas();

    this.motivoSinModificar = this.itemBody.motivo;

    this.checkMode();
  }

  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "110";
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
          this.activacionEditar = true;
        } else if (this.derechoAcceso == 2) {
          this.activacionEditar = false;
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
    );
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

  pInputText;
  isEditar() {
    this.update.idHistorico = this.itemBody.idHistorico;
    this.update.idPersona = this.itemBody.idPersona;
    this.update.motivo = this.itemBody.motivo;
    var registroActualizado = false;
    this.sigaServices.post("auditoriaUsuarios_update", this.update).subscribe(
      data => {
        this.showSuccess();
        console.log(data);
        this.correcto = true;
        registroActualizado = true;
        sessionStorage.setItem(
          "registroAuditoriaUsuariosActualizado",
          JSON.stringify(registroActualizado)
        );
        this.volver();
      },
      err => {
        this.showFail();
        this.correcto = false;
        console.log(err);
        registroActualizado = false;
        sessionStorage.setItem(
          "registroAuditoriaUsuariosActualizado",
          JSON.stringify(registroActualizado)
        );
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
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  volver() {
    this.location.back();
  }

  isHabilitadoGuardarCerrar() {
    return this.habilitarBotonGuardarCerrar;
  }

  actualizarBotonGuardarCerrar() {
    if (this.motivoSinModificar != this.itemBody.motivo)
      this.habilitarBotonGuardarCerrar = false;
    else this.habilitarBotonGuardarCerrar = true;
  }

  clear() {
    this.msgs = [];
  }

  fillFechaEntrada(event) {
    this.itemBody.fechaEntrada = event;
  }

  fillFechaEfectiva(event) {
    this.itemBody.fechaEfectiva = event;
  }

  arreglarFechas() {
    let returnEntrada = JSON.stringify(this.itemBody.fechaEntrada);
    let returnEfectiva = JSON.stringify(this.itemBody.fechaEfectiva);
    returnEntrada = returnEntrada.substring(1, 11);
    returnEfectiva = returnEfectiva.substring(1, 11);
    let arrayEntrada = returnEntrada.split("-");
    let arrayEfectiva = returnEfectiva.split("-");

    this.itemBody.fechaEntrada = new Date();
    this.itemBody.fechaEntrada.setFullYear(parseInt(arrayEntrada[2]), parseInt(arrayEntrada[1]), parseInt(arrayEntrada[0]));

    this.itemBody.fechaEfectiva = new Date(returnEfectiva);
    this.itemBody.fechaEfectiva.setFullYear(parseInt(arrayEfectiva[2]), parseInt(arrayEfectiva[1]), parseInt(arrayEfectiva[0]));


    this
  }
}
