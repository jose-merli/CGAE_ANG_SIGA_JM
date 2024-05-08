import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CommonsService } from "../../../../../_services/commons.service";
import { PersistenceService } from "../../../../../_services/persistence.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate";
import { JusticiableItem } from "../../../../../models/sjcs/JusticiableItem";
import { UnidadFamiliarEJGItem } from "../../../../../models/sjcs/UnidadFamiliarEJGItem";

@Component({
  selector: "app-datos-unidad-familiar",
  templateUrl: "./datos-unidad-familiar.component.html",
  styleUrls: ["./datos-unidad-familiar.component.scss"],
})
export class DatosUnidadFamiliarComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura: boolean = true;
  @Input() showTarjeta: boolean = false;
  @Input() body: JusticiableItem;
  @Input() unidadFamiliar: UnidadFamiliarEJGItem;
  @Output() bodyChange = new EventEmitter<JusticiableItem>();
  @Output() notificacion = new EventEmitter<any>();

  progressSpinner: boolean = false;

  impTotal: String = "";
  parentescoCabecera: String = "";
  nombreGrupoLab: String = "";
  initialUnidadFamiliar: UnidadFamiliarEJGItem;

  comboGrupoLaboral: any = [];
  comboParentesco: any = [];
  comboTipoIng: any = [];
  comboRol: any[];

  constructor(private router: Router, private sigaServices: SigaServices, private persistenceService: PersistenceService, private commonsService: CommonsService, private translateService: TranslateService) {}

  ngOnInit() {
    this.progressSpinner = true;
    this.combos();
    this.updateResumen();
  }

  styleObligatorio(evento) {
    if (evento == undefined || evento == null || evento == "") {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  rest() {
    this.unidadFamiliar = JSON.parse(JSON.stringify(this.initialUnidadFamiliar));
  }

  save() {
    if (this.validateCampos()) {
      this.progressSpinner = true;

      this.sigaServices.post("gestionJusticiables_updateUnidadFamiliar", this.unidadFamiliar).subscribe(
        (n) => {
          this.progressSpinner = false;

          if (JSON.parse(n.body).error.code == 200) {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

            //Se realiza la asignacion de esta manera para evitar que la variable cambie los valores igual que la variable generalBody.
            this.initialUnidadFamiliar = JSON.parse(JSON.stringify(this.unidadFamiliar));

            //Si se selecciona el valor "Unidad Familiar" en el desplegable "Rol/Solicitante"
            if (this.unidadFamiliar.uf_enCalidad == "1") {
              this.unidadFamiliar.uf_solicitante = "0";
            }
            //Si se selecciona el valor "Solicitante" o "Solicitante principal" en el desplegable "Rol/Solicitante"
            if (this.unidadFamiliar.uf_enCalidad == "2" || this.unidadFamiliar.uf_enCalidad == "3") {
              this.unidadFamiliar.uf_solicitante = "1";
            }

            this.updateResumen();

            this.bodyChange.emit(this.body);
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
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

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    } else {
      return false;
    }
  }

  private validateCampos() {
    let valid = true;
    //En el caso que no se haya rellenado el campo de parentesco
    if (this.unidadFamiliar.idParentesco == null || this.unidadFamiliar.uf_enCalidad == null) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
      valid = false;
    } else if (this.unidadFamiliar.idParentesco == 3) {
      //Parentesco hija
      if (this.body.fechanacimiento == null) {
        //Si no tiene fecha determinada, no se continua con el guardado.
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.justiciables.unidadFamiliar.errorHijo"));
        valid = false;
      }
    }
    return valid;
  }

  private updateResumen() {
    //Se comprueba si se debe cambiar el valor de parentesco de la cabecera
    if (this.unidadFamiliar.idParentesco != null && this.unidadFamiliar.idParentesco != undefined) {
      this.comboParentesco.forEach((element) => {
        if (element.value == this.unidadFamiliar.idParentesco) this.parentescoCabecera = element.label;
      });
    } else {
      this.parentescoCabecera = "";
    }

    //Se comprueba si se debe cambiar el valor de parentesco de la cabecera
    if (this.unidadFamiliar.idTipoGrupoLab != null && this.unidadFamiliar.idTipoGrupoLab != undefined) {
      this.comboGrupoLaboral.forEach((element) => {
        if (element.value == this.unidadFamiliar.idTipoGrupoLab) this.nombreGrupoLab = element.label;
      });
    } else {
      this.nombreGrupoLab = "";
    }

    if (this.unidadFamiliar.impOtrosBienes != null || this.unidadFamiliar.impOtrosBienes != undefined || this.unidadFamiliar.impIngrAnuales != null || this.unidadFamiliar.impOtrosBienes != undefined || this.unidadFamiliar.impBienesMu != null || this.unidadFamiliar.impOtrosBienes != undefined || this.unidadFamiliar.impBienesInmu != null || this.unidadFamiliar.impOtrosBienes != undefined) {
      let importe = this.unidadFamiliar.impOtrosBienes + this.unidadFamiliar.impIngrAnuales + this.unidadFamiliar.impBienesMu + this.unidadFamiliar.impBienesInmu;
      this.impTotal = importe.toString();
    } else {
      this.impTotal = "";
    }

    this.progressSpinner = false;
  }

  private showMessage(severity, summary, msg) {
    this.notificacion.emit({
      severity: severity,
      summary: summary,
      detail: msg,
    });
  }

  private combos() {
    this.getComboRol();
    this.getComboGruposLaborales();
    this.getComboParentesco();
    this.getComboTiposIngresos();
  }

  private getComboRol() {
    this.comboRol = [
      { label: this.translateService.instant("justiciaGratuita.justiciables.rol.unidadFamiliar"), value: "1" },
      { label: this.translateService.instant("justiciaGratuita.justiciables.rol.solicitante"), value: "2" },
      { label: this.translateService.instant("justiciaGratuita.justiciables.unidadFamiliar.solicitantePrincipal"), value: "3" },
    ];
  }

  private getComboGruposLaborales() {
    this.sigaServices.get("gestionJusticiables_comboGruposLaborales").subscribe((n) => {
      this.comboGrupoLaboral = n.combooItems;
      this.commonsService.arregloTildesCombo(this.comboGrupoLaboral);
    });
  }

  private getComboParentesco() {
    this.progressSpinner = true;
    this.sigaServices.get("gestionJusticiables_comboParentesco").subscribe((n) => {
      this.comboParentesco = n.combooItems;
      this.commonsService.arregloTildesCombo(this.comboParentesco);
    });
  }

  private getComboTiposIngresos() {
    this.sigaServices.get("gestionJusticiables_comboTiposIngresos").subscribe(
      (n) => {
        this.comboTipoIng = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTipoIng);
        this.progressSpinner = false;
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }
}
