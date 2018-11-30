import { Component, OnInit } from "@angular/core";
import { SigaServices } from "../../../_services/siga.service";
import { NotificacionEventoItem } from "../../../models/NotificacionEventoItem";
import { Location } from "@angular/common";
import { EventoItem } from "../../../models/EventoItem";

@Component({
  selector: "app-datos-notificaciones",
  templateUrl: "./datos-notificaciones.component.html",
  styleUrls: ["./datos-notificaciones.component.scss"]
})
export class DatosNotificacionesComponent implements OnInit {
  fichasPosibles = [
    {
      key: "notify",
      activa: true
    }
  ];

  comboNotifyType;
  comboAfterBefore;
  comboMeasureUnit;
  comboTemplates;
  selectedTemplate: NotificacionEventoItem;
  notification: NotificacionEventoItem;

  modoEdicion: boolean;
  progressSpinner: boolean = false;
  disabledTypeSend: boolean = false;
  disabledSave: boolean = true;

  constructor(private sigaServices: SigaServices, private location: Location) {}

  ngOnInit() {
    this.progressSpinner = true;
    this.getCombos();

    let evento: EventoItem = JSON.parse(sessionStorage.getItem("evento"));

    //Comprobamos si estamos en modoEdición o en modo Nuevo
    if (sessionStorage.getItem("modoEdicionNotify") == "true") {
      this.modoEdicion = true;
      this.notification = JSON.parse(
        sessionStorage.getItem("notifySelected")
      )[0];

      if (this.notification.idPlantilla != null) {
        this.getTypeSend(
          this.notification.idPlantilla,
          this.notification.idTipoEnvio
        );
      }

      this.notification.idEvento = evento.idEvento;
      this.notification.idCalendario = evento.idCalendario;
    } else {
      this.modoEdicion = false;
      this.notification = new NotificacionEventoItem();
      this.notification.idTipoCuando = "1";
      this.notification.idCalendario = sessionStorage.getItem("idCalendario");
      this.notification.idEvento = evento.idEvento;
      this.notification.idCalendario = evento.idCalendario;
    }
  }

  getCombos() {
    this.getComboNotifyType();
    this.getComboMeasureUnit();
    this.getComboAfterBefore();
    this.getComboTemplate();
  }

  getComboNotifyType() {
    this.sigaServices.get("datosNotificaciones_getTypeNotifications").subscribe(
      n => {
        this.comboNotifyType = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboMeasureUnit() {
    this.sigaServices.get("datosNotificaciones_getMeasuredUnit").subscribe(
      n => {
        this.comboMeasureUnit = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboAfterBefore() {
    this.sigaServices.get("datosNotificaciones_getTypeWhere").subscribe(
      n => {
        this.comboAfterBefore = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTemplate() {
    this.progressSpinner = true;
    this.sigaServices.get("datosNotificaciones_getTemplates").subscribe(
      n => {
        this.comboTemplates = n.comboItems;
        if (sessionStorage.getItem("modoEdicionNotify") == "true") {
          this.comboTemplates.forEach(e => {
            if (
              e.value.idPlantilla === this.notification.idPlantilla &&
              e.value.idTipoEnvio === this.notification.idTipoEnvio
            ) {
              this.selectedTemplate = e.value;
            }
          });
        }
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  saveNotification() {
    this.progressSpinner = true;
    let url = "";

    if (!this.modoEdicion) {
      url = "datosNotificaciones_saveNotification";
    } else {
      url = "datosNotificaciones_updateNotification";
    }

    this.sigaServices.post(url, this.notification).subscribe(
      data => {
        this.progressSpinner = false;
        this.backTo();
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  backTo() {
    this.location.back();
    sessionStorage.setItem("isNotificaciones", "true");
    sessionStorage.setItem("modoEdicion", "true");
  }

  onChangeTemplates(event) {
    let idPlantillaEnvio = event.value.idPlantilla;
    let idTipoEnvio = event.value.idTipoEnvio;
    this.getTypeSend(idPlantillaEnvio, idTipoEnvio);
    this.notification.idPlantilla = idPlantillaEnvio;
    this.notification.idTipoEnvio = idTipoEnvio;
  }

  getTypeSend(idPlantillaEnvio, idTipoEnvio) {
    let typeSend = [];
    this.disabledTypeSend = true;
    this.sigaServices
      .getParam(
        "datosNotificaciones_getTypeSend",
        "?idPlantillaEnvio=" + idPlantillaEnvio + "&idTipoEnvio=" + idTipoEnvio
      )
      .subscribe(
        n => {
          typeSend = n.combooItems;
          this.notification.tipoEnvio = typeSend[0].label;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  restNotification() {
    if (sessionStorage.getItem("modoEdicionNotify") == "true") {
      this.notification = JSON.parse(
        sessionStorage.getItem("notifySelected")
      )[0];

      if (this.notification.idPlantilla != null) {
        this.getTypeSend(
          this.notification.idPlantilla,
          this.notification.idTipoEnvio
        );
      }

      this.comboTemplates.forEach(e => {
        if (
          e.value.idPlantilla === this.notification.idPlantilla &&
          e.value.idTipoEnvio === this.notification.idTipoEnvio
        ) {
          this.selectedTemplate = e.value;
        }
      });
    } else {
      this.modoEdicion = false;
      this.notification = new NotificacionEventoItem();
      this.notification.idCalendario = sessionStorage.getItem("idCalendario");
      this.selectedTemplate = undefined;
    }
  }

  validateForm() {
    if (
      this.notification.idTipoNotificacion == null ||
      this.notification.idTipoNotificacion == undefined ||
      this.notification.idPlantilla == null ||
      this.notification.idPlantilla == undefined ||
      this.notification.idUnidadMedida == null ||
      this.notification.idUnidadMedida == undefined ||
      this.notification.cuando == undefined ||
      this.notification.cuando == null
    ) {
      return true;
    } else {
      return false;
    }
  }
}
