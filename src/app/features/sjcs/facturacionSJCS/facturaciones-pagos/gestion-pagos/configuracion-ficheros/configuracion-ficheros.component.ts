import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { TranslateService } from '../../../../../../commons/translate';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../../../_services/commons.service';
import { Router } from '@angular/router';
import { SigaServices } from '../../../../../../_services/siga.service';
import { Error } from '../../../../../../models/Error';
import { PagosjgItem } from '../../../../../../models/sjcs/PagosjgItem';
import { PagosjgDTO } from '../../../../../../models/sjcs/PagosjgDTO';
@Component({
  selector: 'app-configuracion-ficheros',
  templateUrl: './configuracion-ficheros.component.html',
  styleUrls: ['./configuracion-ficheros.component.scss']
})
export class ConfiguracionFicherosComponent implements OnInit, OnChanges {

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
  @Input() idEstadoPago;
  @Input() modoEdicion;

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

      if (this.modoEdicion) {
        this.cargarDatosIniciales();
      }

    }).catch(error => console.error(error));

  }

  cargarDatosIniciales() {

    this.getcomboCuentasBanc();
    this.getComboSufijos();
    this.getComboPropTransSepa();
    this.getComboPropOtrTrans();

    this.getConfigFichAbonos();
  }

  onHideFicha() {

    if (!this.modoEdicion) {
      this.showFicha = false;
    } else {
      this.showFicha = !this.showFicha;
    }
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

  getConfigFichAbonos() {

    this.sigaService.getParam("pagosjcs_getConfigFichAbonos", `?idPago=${this.idPago}`).subscribe(
      (data: PagosjgDTO) => {
        this.progressSpinner = false;

        const resp = data.pagosjgItem[0];
        const error = data.error;

        if (error && null != error && null != error.description) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description.toString()));
        } else {
          this.configuracionFicheros = JSON.parse(JSON.stringify(resp));
          this.configuracionFicherosAux = JSON.parse(JSON.stringify(resp));
        }

      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );

  }

  comprobaciones() {

    let valido = true;

    if (this.configuracionFicheros.codBanco == undefined || this.configuracionFicheros.codBanco == null || this.configuracionFicheros.codBanco.trim().length == 0
      || this.configuracionFicheros.idSufijo == undefined || this.configuracionFicheros.idSufijo == null || this.configuracionFicheros.idSufijo.trim().length == 0
      || this.configuracionFicheros.idPropSepa == undefined || this.configuracionFicheros.idPropSepa == null || this.configuracionFicheros.idPropSepa.trim().length == 0
      || this.configuracionFicheros.idPropOtros == undefined || this.configuracionFicheros.idPropOtros == null || this.configuracionFicheros.idPropOtros.trim().length == 0) {
      valido = false;
    }

    if (!valido) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
    }

    return valido;

  }

  guardar() {

    if (this.comprobaciones() && !this.isPagoCerrado()) {

      this.progressSpinner = true;

      this.sigaService.post("pagosjcs_saveConfigFichAbonos", this.configuracionFicheros).subscribe(
        data => {
          this.progressSpinner = false;

          const resp = JSON.parse(data.body);
          const error = resp.error;

          if (error && null != error && null != error.description) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description.toString()));
          } else if (resp.status == 'OK') {
            this.getConfigFichAbonos();
          }

        },
        err => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      );

    }

  }

  disableRestablecer() {
    return (JSON.stringify(this.configuracionFicheros) == JSON.stringify(this.configuracionFicherosAux)) || this.isPagoCerrado();
  }

  disableGuardar() {
    return (JSON.stringify(this.configuracionFicheros) == JSON.stringify(this.configuracionFicherosAux)) || this.isPagoCerrado();
  }

  restablecer() {
    if (!this.isPagoCerrado()) {
      this.configuracionFicheros = JSON.parse(JSON.stringify(this.configuracionFicherosAux));
    }
  }

  marcarObligatorio(valor: string): boolean {

    let resp = false;

    if (valor == undefined || valor == null || valor.trim().length == 0) {
      resp = true;
    }
    return resp;
  }

  getIban() {
    return this.comboCuentasBanc.find(el => el.value == this.configuracionFicheros.codBanco).label;
  }

  isPagoCerrado() {
    return (this.idEstadoPago == '30');
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.modoEdicion && changes.modoEdicion.currentValue && changes.modoEdicion.currentValue == true) {
      this.cargarDatosIniciales();
    }
  }

}
