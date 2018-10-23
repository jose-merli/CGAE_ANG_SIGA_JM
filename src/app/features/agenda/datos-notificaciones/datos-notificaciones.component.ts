import { Component, OnInit } from "@angular/core";
import { SigaServices } from "../../../_services/siga.service";
import { NotificacionEventoItem } from "../../../models/NotificacionEventoItem";
import { Location } from "@angular/common";

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
  notification: NotificacionEventoItem;

  modoEdicion: boolean;
  progressSpinner: boolean = false;
  disabledTypeSend: boolean = false;

  constructor(private sigaServices: SigaServices, private location: Location) {}

  ngOnInit() {
    this.getCombos();

    //Comprobamos si estamos en modoEdición o en modo Nuevo
    if (sessionStorage.getItem("modoEdicionNotify") == "true") {
      this.modoEdicion = true;
      this.notification = JSON.parse(
        sessionStorage.getItem("notifySelected")
      )[0];

      if (this.notification.idPlantilla != null) {
        this.getTypeSend(this.notification.idPlantilla);
      }
    } else {
      this.modoEdicion = false;
      this.notification = new NotificacionEventoItem();
      this.notification.idTipoCuando = "1";
      this.notification.idCalendario = sessionStorage.getItem("idCalendario");
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
    this.sigaServices.get("datosNotificaciones_getTemplates").subscribe(
      n => {
        this.comboTemplates = n.combooItems;
      },
      err => {
        console.log(err);
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
  }

  onChangeTemplates(event) {
    let idPlantillaEnvio = event.value;
    this.getTypeSend(idPlantillaEnvio);
  }

  getTypeSend(idPlantillaEnvio) {
    let typeSend = [];
    this.disabledTypeSend = true;
    this.sigaServices
      .getParam(
        "datosNotificaciones_getTypeSend",
        "?idPlantillaEnvio=" + idPlantillaEnvio
      )
      .subscribe(
        n => {
          typeSend = n.combooItems;
          this.notification.tipoEnvio = typeSend[0].label;
        },
        err => {
          console.log(err);
        }
      );
  }
}
