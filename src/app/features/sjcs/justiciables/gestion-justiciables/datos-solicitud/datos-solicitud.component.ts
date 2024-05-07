import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonsService } from "../../../../../_services/commons.service";
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
  @Output() bodyChange = new EventEmitter<JusticiableItem>();
  @Output() notificacion = new EventEmitter<any>();

  progressSpinner: boolean = false;
  permisoSave: boolean = false;
  showDialogSolicitud: boolean = false;

  bodyInicial: JusticiableItem;
  selectedAutorizaavisotel: string = "";
  selectedAsistidosolicitajg: string = "";
  selectedAsistidoautorizaeejg: string = "";
  dialogSolicitudOpcion: String = "";

  comboAutorizaEjg = [];
  comboAutorizaAvisotel = [];
  comboSolicitajg = [];

  constructor(private sigaServices: SigaServices, private translateService: TranslateService, private commonsService: CommonsService) {}

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
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      this.body = JSON.parse(JSON.stringify(this.bodyInicial));
      this.tratamientoDescripcionesTarjeta();
    }
  }

  save() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      if (!(this.body.correoelectronico != undefined && this.body.correoelectronico != "")) {
        if (this.body.autorizaavisotelematico == "1") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.justiciables.message.necesarioCorreoElectronico.recibirNotificaciones"));
        } else {
          if (this.body.numeroAsuntos != undefined && parseInt(this.body.numeroAsuntos) > 1) {
            this.showDialog();
          } else {
            this.callServiceSave();
          }
        }
      } else {
        if (this.body.numeroAsuntos != undefined && parseInt(this.body.numeroAsuntos) > 1) {
          this.showDialog();
        } else {
          this.callServiceSave();
        }
      }
    }
  }

  cerrarDialog() {
    this.showDialogSolicitud = false;
    this.dialogSolicitudOpcion = "";
  }

  guardar() {
    if (this.dialogSolicitudOpcion == "s") {
      this.callServiceSave();
    } else if (this.dialogSolicitudOpcion == "n") {
      this.progressSpinner = false;
      //Ya estavalidada la repeticion y puede crear al justiciable
      this.body.validacionRepeticion = true;
      this.body.asociarRepresentante = true;
      this.sigaServices.post("gestionJusticiables_createJusticiable", this.body).subscribe(
        (data) => {
          this.progressSpinner = false;
          let idJusticiable = JSON.parse(data.body).id;
          this.body.idpersona = idJusticiable;
          this.bodyChange.emit(this.body);
          this.bodyInicial = JSON.parse(JSON.stringify(this.body));
          this.cerrarDialog();
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          //this.createJusticiableByUpdateSolicitud.emit(this.body);
        },
        (err) => {
          this.progressSpinner = false;
          if (JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        },
      );
    }
  }

  private showDialog() {
    this.showDialogSolicitud = false;
    this.dialogSolicitudOpcion = "";
  }

  private callServiceSave() {
    this.progressSpinner = true;
    this.sigaServices.post("gestionJusticiables_updateDatosSolicitudJusticiable", this.body).subscribe(
      (data) => {
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.bodyChange.emit(this.body);
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      },
      (err) => {
        this.progressSpinner = false;
        if (JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
    );
  }

  private showMessage(severity, summary, msg) {
    this.notificacion.emit({
      severity: severity,
      summary: summary,
      detail: msg,
    });
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
