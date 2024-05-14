import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonsService } from "../../../../../_services/commons.service";
import { NotificationService } from "../../../../../_services/notification.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate";
import { JusticiableItem } from "../../../../../models/sjcs/JusticiableItem";

@Component({
  selector: "app-datos-solicitud",
  templateUrl: "./datos-solicitud.component.html",
  styleUrls: ["./datos-solicitud.component.scss"],
})
export class DatosSolicitudComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura: boolean = true;
  @Input() showTarjeta: boolean = false;
  @Input() body: JusticiableItem;
  @Input() bodyInicial: JusticiableItem;
  @Input() origen: string = "";
  @Output() bodyChange = new EventEmitter<JusticiableItem>();
  @Output() showDialog = new EventEmitter<string>();

  progressSpinner: boolean = false;
  permisoSave: boolean = false;

  selectedAutorizaavisotel: string = "";
  selectedAsistidosolicitajg: string = "";
  selectedAsistidoautorizaeejg: string = "";

  comboAutorizaEjg = [];
  comboAutorizaAvisotel = [];
  comboSolicitajg = [];

  constructor(private sigaServices: SigaServices, private translateService: TranslateService, private commonsService: CommonsService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.getCombos();
    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    this.tratamientoDescripcionesTarjeta();
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  rest() {
    if (!this.permisoEscritura) {
      this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      this.body = JSON.parse(JSON.stringify(this.bodyInicial));
      this.tratamientoDescripcionesTarjeta();
    }
  }

  save() {
    if (!this.permisoEscritura) {
      this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      if (!(this.bodyInicial.correoelectronico != undefined && this.bodyInicial.correoelectronico != "")) {
        if (this.body.autorizaavisotelematico == "1") {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.justiciables.message.necesarioCorreoElectronico.recibirNotificaciones"));
        } else {
          if (this.body.numeroAsuntos != undefined && parseInt(this.body.numeroAsuntos) > 1 && this.origen != "" && this.origen != "Asistencia" && this.origen != "Soj") {
            this.showDialog.emit("tarjetaSolicitud");
          } else {
            this.callServiceSave();
          }
        }
      } else {
        if (this.body.numeroAsuntos != undefined && parseInt(this.body.numeroAsuntos) > 1 && this.origen != "" && this.origen != "Asistencia" && this.origen != "Soj") {
          this.showDialog.emit("tarjetaSolicitud");
        } else {
          this.callServiceSave();
        }
      }
    }
  }

  guardarDialog(nuevo: boolean) {
    if (!nuevo) {
      this.callServiceSave();
    }
  }

  private callServiceSave() {
    this.progressSpinner = true;
    this.sigaServices.post("gestionJusticiables_updateDatosSolicitudJusticiable", this.body).subscribe(
      (data) => {
        this.progressSpinner = false;
        this.notificationService.showSuccess(this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.bodyChange.emit(this.body);
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        this.tratamientoDescripcionesTarjeta();
      },
      (err) => {
        this.progressSpinner = false;
        if (JSON.parse(err.error).error.description != "") {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
    );
  }

  private tratamientoDescripcionesTarjeta() {
    if (this.body.autorizaavisotelematico != undefined && this.body.autorizaavisotelematico != null) {
      this.selectedAutorizaavisotel = this.body.autorizaavisotelematico == "1" ? "SI" : "NO";
    } else {
      this.selectedAutorizaavisotel = undefined;
    }

    if (this.body.asistidosolicitajg != undefined && this.body.asistidosolicitajg != null) {
      this.selectedAsistidosolicitajg = this.body.asistidosolicitajg == "1" ? "SI" : "NO";
    } else {
      this.selectedAsistidosolicitajg = undefined;
    }

    if (this.body.asistidoautorizaeejg != undefined && this.body.asistidoautorizaeejg != null) {
      this.selectedAsistidoautorizaeejg = this.body.asistidoautorizaeejg == "1" ? "SI" : "NO";
    } else {
      this.selectedAsistidoautorizaeejg = undefined;
    }
  }

  private getCombos() {
    this.getComboAutorizaAvisotel();
    this.getComboAutorizaEjg();
    this.getComboSolicitajg();
  }

  private getComboAutorizaAvisotel() {
    this.comboAutorizaAvisotel = [
      { label: "No", value: "0" },
      { label: "Si", value: "1" },
    ];
    this.commonsService.arregloTildesCombo(this.comboAutorizaAvisotel);
  }

  private getComboAutorizaEjg() {
    this.comboAutorizaEjg = [
      { label: "No", value: "0" },
      { label: "Si", value: "1" },
    ];
    this.commonsService.arregloTildesCombo(this.comboAutorizaEjg);
  }

  private getComboSolicitajg() {
    this.comboSolicitajg = [
      { label: "No", value: "0" },
      { label: "Si", value: "1" },
    ];
    this.commonsService.arregloTildesCombo(this.comboSolicitajg);
  }
}
