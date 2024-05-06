import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { CommonsService } from "../../../../../_services/commons.service";
import { PersistenceService } from "../../../../../_services/persistence.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate";
import { EJGItem } from "../../../../../models/sjcs/EJGItem";
import { JusticiableBusquedaItem } from "../../../../../models/sjcs/JusticiableBusquedaItem";
import { JusticiableItem } from "../../../../../models/sjcs/JusticiableItem";
import { SigaConstants } from "../../../../../utils/SigaConstants";

@Component({
  selector: "app-datos-representante",
  templateUrl: "./datos-representante.component.html",
  styleUrls: ["./datos-representante.component.scss"],
})
export class DatosRepresentanteComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura: boolean = true;
  @Input() showTarjeta: boolean = false;
  @Input() body: JusticiableItem;
  @Input() origen: string = "";
  @Output() bodyChange = new EventEmitter<JusticiableItem>();
  @Output() notificacion = new EventEmitter<any>();

  progressSpinner: boolean = false;
  associate: boolean = true;
  disassociate: boolean = true;
  showDialogRepre: boolean = false;
  dialogAssociate: boolean = true;
  navigateToJusticiable: boolean = true;

  tipoIdentificacion = [];
  dialogRepreOpcion: String = "";
  representante: JusticiableItem = new JusticiableItem();

  constructor(private router: Router, private sigaServices: SigaServices, private persistenceService: PersistenceService, private confirmationService: ConfirmationService, private translateService: TranslateService, private commonsService: CommonsService) {}

  ngOnInit() {
    this.progressSpinner = false;
    this.representante = new JusticiableItem();
    this.getTiposIdentificacion();
    if (this.origen == "representante") {
      this.navigateToJusticiable = false;
    }
    if (this.body != undefined) {
      if (this.persistenceService.getBody()) {
        let bodyRepresentante = this.persistenceService.getBody();
        this.persistenceService.clearBody();
        this.searchRepresentanteById(bodyRepresentante.idpersona, bodyRepresentante.idinstitucion);
      } else if (this.body.idrepresentantejg != undefined) {
        this.searchRepresentanteById(this.body.idrepresentantejg.toString(), this.body.idinstitucion);
      }
    }
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  compruebaDNIInput() {
    if (this.representante.nif != undefined && this.representante.nif.trim() != "" && this.representante.nif != null) {
      let idTipoIdentificacion = this.commonsService.compruebaDNI(this.representante.idtipoidentificacion, this.representante.nif);
      this.representante.idtipoidentificacion = idTipoIdentificacion;
    } else {
      this.representante.idtipoidentificacion = undefined;
    }
    this.representante.nombre = undefined;
    this.representante.apellidos = undefined;
    this.disabledDisassociate();
    this.disabledAssociate();
  }

  searchRepresentanteByNif() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      if (this.representante.nif.trim() != undefined && this.representante.nif.trim() != "") {
        this.progressSpinner = true;
        let bodyBusqueda = new JusticiableBusquedaItem();
        bodyBusqueda.nif = this.representante.nif;

        this.sigaServices.post("gestionJusticiables_getJusticiableByNif", bodyBusqueda).subscribe(
          (n) => {
            this.representante = JSON.parse(n.body).justiciable;
            if (this.representante.idpersona == null || this.representante.idpersona == undefined) {
              this.createRepresentante();
            } else if (this.representante.nif == this.body.nif) {
              this.representante.idpersona = null;
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.justiciables.message.representanteNoPuedeSerPropioJusticiable"));
            }
            this.disabledDisassociate();
            this.disabledAssociate();
            this.progressSpinner = false;
          },
          (err) => {
            this.progressSpinner = false;
          },
        );
      }
    }
  }

  restRepresentante() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      if (this.body.idrepresentantejg != undefined) {
        this.searchRepresentanteById(this.body.idrepresentantejg.toString(), this.body.idinstitucion);
      } else {
        this.representante = new JusticiableItem();
      }
      this.disabledDisassociate();
      this.disabledAssociate();
    }
  }

  disassociateRepresentante() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      if (this.disassociate) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), "No puede realizar esa acción");
      } else {
        if (this.body.numeroAsuntos != undefined && parseInt(this.body.numeroAsuntos) > 1) {
          this.dialogAssociate = false;
          this.showDialogRepre = true;
        } else {
          if (this.body.edad == undefined || (this.body.edad != undefined && JSON.parse(this.body.edad) > SigaConstants.EDAD_ADULTA)) {
            this.callServiceDisassociate();
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.justiciables.message.asociarRepresentante.menorJusticiable"));
          }
        }
      }
    }
  }

  searchRepresentante() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      sessionStorage.setItem("origin", "newRepresentante");
      this.persistenceService.setDatos(this.body);
      this.router.navigate(["/justiciables"]);
    }
  }

  associateRepresentante() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      if (this.associate) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), "No puede realizar esa acción");
      } else {
        if (this.body.numeroAsuntos != undefined && parseInt(this.body.numeroAsuntos) > 1) {
          this.dialogAssociate = true;
          this.showDialogRepre = true;
        } else {
          if (this.representante.idpersona != undefined && this.representante.idpersona != null && this.representante.idpersona.trim() != "") {
            if (this.representante.nif != undefined && this.representante.nif != "" && this.representante.nif != null && this.body != undefined && this.representante.nif == this.body.nif) {
              this.representante.idpersona = null;
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.justiciables.message.representanteNoPuedeSerPropioJusticiable"));
              this.disabledDisassociate();
              this.disabledAssociate();
            } else {
              this.callServiceAssociate();
            }
          }
        }
      }
    }
  }

  guardarDialog() {
    if (this.dialogRepreOpcion == undefined || this.dialogRepreOpcion == "") {
      this.showMessage("info", "info", "Debes seleccionar una opción");
    } else {
      if (this.dialogRepreOpcion == "s") {
        if (this.dialogAssociate) {
          if (this.representante.idpersona != undefined && this.representante.idpersona != null && this.representante.idpersona.trim() != "") {
            if (this.representante.nif != undefined && this.representante.nif != "" && this.representante.nif != null && this.body != undefined && this.representante.nif == this.body.nif) {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.justiciables.message.representanteNoPuedeSerPropioJusticiable"));
            } else {
              this.callServiceAssociate();
            }
          }
        } else {
          if (this.body.edad == undefined || (this.body.edad != undefined && JSON.parse(this.body.edad) > SigaConstants.EDAD_ADULTA)) {
            this.callServiceDisassociate();
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.justiciables.message.asociarRepresentante.menorJusticiable"));
          }
        }
      } else if (this.dialogRepreOpcion == "n") {
        this.progressSpinner = true;
        this.body.idrepresentantejg = this.dialogAssociate ? Number(this.representante.idpersona) : undefined;
        this.body.validacionRepeticion = true;
        this.body.asociarRepresentante = true;
        this.sigaServices.post("gestionJusticiables_createJusticiable", this.body).subscribe(
          (data) => {
            this.progressSpinner = false;
            this.body.idpersona = JSON.parse(data.body).id;
            this.bodyChange.emit(this.body);
          },
          (err) => {
            if (JSON.parse(err.error).error.description != "") {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
            } else {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
            }
            this.progressSpinner = false;
          },
        );
      }
      this.showDialogRepre = false;
      this.dialogRepreOpcion = "";
    }
  }

  cerrarDialog() {
    this.showDialogRepre = false;
    this.dialogRepreOpcion = "";
  }

  navigateToRepresentante() {
    if (this.body.idrepresentantejg != undefined) {
      sessionStorage.setItem("origin", "representante");
      sessionStorage.setItem("justiciable", JSON.stringify(this.body));
      this.persistenceService.setDatos(this.representante);
      this.router.navigate(["/gestionJusticiables"]);
    }
  }

  private callServiceAssociate() {
    this.progressSpinner = true;
    this.body.idrepresentantejg = Number(this.representante.idpersona);

    if (this.origen == "Interesado") {
      let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
      let request = [designa.idInstitucion, sessionStorage.getItem("personaDesigna"), designa.ano, designa.idTurno, designa.numero, this.representante.apellidos.concat(",", this.representante.nombre)];
      this.sigaServices.post("designaciones_updateRepresentanteInteresado", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.bodyChange.emit(this.body);
        },
        (err) => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        },
      );
    } else if (this.origen == "Contrario") {
      let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
      let request = [designa.idInstitucion, sessionStorage.getItem("personaDesigna"), designa.ano, designa.idTurno, designa.numero, this.representante.apellidos.concat(",", this.representante.nombre)];
      this.sigaServices.post("designaciones_updateRepresentanteContrario", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.bodyChange.emit(this.body);
        },
        (err) => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        },
      );
    } else if (this.origen == "ContrarioEJG") {
      let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));
      let request = [sessionStorage.getItem("personaDesigna"), ejg.annio, ejg.numero, ejg.tipoEJG, this.representante.apellidos.concat(",", this.representante.nombre), this.representante.idpersona];
      this.sigaServices.post("gestionejg_updateRepresentanteContrarioEJG", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.bodyChange.emit(this.body);
        },
        (err) => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        },
      );
    } else {
      this.sigaServices.post("gestionJusticiables_associateRepresentante", this.body).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.bodyChange.emit(this.body);
        },
        (err) => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        },
      );
    }
  }

  private callServiceDisassociate() {
    this.progressSpinner = true;

    if (this.origen == "Interesado") {
      let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
      let request = [designa.idInstitucion, sessionStorage.getItem("personaDesigna"), designa.ano, designa.idTurno, designa.numero, ""];
      this.sigaServices.post("designaciones_updateRepresentanteInteresado", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.body.idrepresentantejg = undefined;
          this.representante = new JusticiableItem();
          this.bodyChange.emit(this.body);
        },
        (err) => {
          this.progressSpinner = false;
          this.translateService.instant("general.message.error.realiza.accion");
        },
      );
    } else if (this.origen == "Contrario") {
      let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
      let request = [designa.idInstitucion, sessionStorage.getItem("personaDesigna"), designa.ano, designa.idTurno, designa.numero, ""];
      this.sigaServices.post("designaciones_updateRepresentanteContrario", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.representante = new JusticiableItem();
          this.body.idrepresentantejg = undefined;
          this.bodyChange.emit(this.body);
        },
        (err) => {
          this.progressSpinner = false;
          this.translateService.instant("general.message.error.realiza.accion");
        },
      );
    } else if (this.origen == "ContrarioEJG") {
      let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));
      let request = [sessionStorage.getItem("personaDesigna"), ejg.annio, ejg.numero, ejg.tipoEJG, "", null];
      this.sigaServices.post("gestionejg_updateRepresentanteContrarioEJG", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.representante = new JusticiableItem();
          this.body.idrepresentantejg = undefined;
          this.bodyChange.emit(this.body);
        },
        (err) => {
          this.progressSpinner = false;
          this.translateService.instant("general.message.error.realiza.accion");
        },
      );
    } else {
      this.sigaServices.post("gestionJusticiables_disassociateRepresentante", this.body).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.representante = new JusticiableItem();
          this.body.idrepresentantejg = undefined;
          this.bodyChange.emit(this.body);
        },
        (err) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.error.realiza.accion"));
        },
      );
    }
  }

  private createRepresentante() {
    this.confirmationService.confirm({
      key: "cdCreateRepresentante",
      message: this.translateService.instant("justiciaGratuita.justiciables.message.crearNuevoRepresentante"),
      icon: "fa fa-search ",
      accept: () => {
        //this.newRepresentante.emit(JSON.parse(JSON.stringify(this.representante)));
      },
      reject: () => {
        this.showMessage("info", "info", this.translateService.instant("general.message.accion.cancelada"));
      },
    });
  }

  private disabledAssociate() {
    this.associate = true;
    if (this.representante.idpersona != undefined && this.representante.idpersona != "") {
      if (this.body.idrepresentantejg == undefined || this.body.idrepresentantejg == null) {
        this.associate = false;
      } else if (this.body.idrepresentantejg.toString() != this.representante.idpersona) {
        this.associate = false;
      }
    }
  }

  private disabledDisassociate() {
    if (this.body.idrepresentantejg != undefined && this.body.idrepresentantejg != null) {
      this.disassociate = false;
    } else {
      this.disassociate = true;
    }
  }

  private searchRepresentanteById(idrepresentante: string, idinstitucion: string) {
    this.progressSpinner = true;

    let bodyBusqueda = new JusticiableBusquedaItem();
    bodyBusqueda.idpersona = idrepresentante;
    bodyBusqueda.idinstitucion = idinstitucion;

    this.sigaServices.post("gestionJusticiables_searchJusticiable", bodyBusqueda).subscribe(
      (n) => {
        this.representante = JSON.parse(n.body).justiciable;
        this.progressSpinner = false;
        if (this.body.idrepresentantejg != Number(this.representante.idpersona)) {
          this.showTarjeta = true;
        }
        this.disabledDisassociate();
        this.disabledAssociate();
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }

  private getTiposIdentificacion() {
    this.sigaServices.get("fichaPersona_tipoIdentificacionCombo").subscribe((n) => {
      this.tipoIdentificacion = n.combooItems;
    });
  }

  private showMessage(severity, summary, msg) {
    this.notificacion.emit({
      severity: severity,
      summary: summary,
      detail: msg,
    });
  }
}
