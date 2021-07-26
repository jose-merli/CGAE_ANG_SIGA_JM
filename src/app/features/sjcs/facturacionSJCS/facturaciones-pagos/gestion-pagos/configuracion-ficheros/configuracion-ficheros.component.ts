import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '../../../../../../commons/translate';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../../../_services/commons.service';
import { Router } from '@angular/router';
import { SigaServices } from '../../../../../../_services/siga.service';
import { Error } from '../../../../../../models/Error'; import { PagosjgItem } from '../../../../../../models/sjcs/PagosjgItem';
@Component({
  selector: 'app-configuracion-ficheros',
  templateUrl: './configuracion-ficheros.component.html',
  styleUrls: ['./configuracion-ficheros.component.scss']
})
export class ConfiguracionFicherosComponent implements OnInit {

  showFicha: boolean = false;
  progressSpinner: boolean = false;
  msgs;
  permisos;
  comboPropTransSepa;
  comboPropOtrTrans;
  comboSufijos;
  comboCuentasBanc;
  configuracionFicheros: PagosjgItem = new PagosjgItem();
  configuracionFicherosAux: PagosjgItem = new PagosjgItem();

  @Input() idPago;


  constructor(private commonsService: CommonsService,
    private translateService: TranslateService,
    private sigaService: SigaServices,
    private router: Router) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaPagosTarjetaConfigFichAbonos).then(respuesta => {

      this.permisos = respuesta;

      if (this.permisos == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      this.progressSpinner = false;

      this.getcomboCuentasBanc();
      this.getComboSufijos();
      this.getComboPropTransSepa();
      this.getComboPropOtrTrans();

    }).catch(error => console.error(error));

  }

  onHideFicha() {
    this.showFicha = !this.showFicha;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }


  getComboPropTransSepa() {

    this.progressSpinner = true;

    this.sigaService.get("pagosjcs_comboPropTranferenciaSepa").subscribe(
      data => {

        this.progressSpinner = false;

        const resp = data.combooItems;
        const error: Error = data.error;

        if (error && null != error && null != error.description) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description.toString()));
        } else {
          this.comboPropTransSepa = resp;
          this.commonsService.arregloTildesCombo(this.comboPropTransSepa);
        }

      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );

  }

  getComboPropOtrTrans() {

    this.progressSpinner = true;

    this.sigaService.get("pagosjcs_comboPropOtrasTranferencias").subscribe(
      data => {

        this.progressSpinner = false;

        const resp = data.combooItems;
        const error: Error = data.error;

        if (error && null != error && null != error.description) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description.toString()));
        } else {
          this.comboPropOtrTrans = resp;
          this.commonsService.arregloTildesCombo(this.comboPropOtrTrans);
        }

      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );

  }

  getComboSufijos() {

    this.progressSpinner = true;

    this.sigaService.get("pagosjcs_comboSufijos").subscribe(
      data => {

        this.progressSpinner = false;

        const resp = data.combooItems;
        const error: Error = data.error;

        if (error && null != error && null != error.description) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description.toString()));
        } else {
          this.comboSufijos = resp;
          this.commonsService.arregloTildesCombo(this.comboSufijos);
        }

      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );

  }

  getcomboCuentasBanc() {

    this.progressSpinner = true;

    this.sigaService.get("pagosjcs_comboCuentasBanc").subscribe(
      data => {

        this.progressSpinner = false;

        const resp = data.combooItems;
        const error: Error = data.error;

        if (error && null != error && null != error.description) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description.toString()));
        } else {
          this.comboCuentasBanc = resp;
          this.commonsService.arregloTildesCombo(this.comboCuentasBanc);
        }

      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );

  }


}
