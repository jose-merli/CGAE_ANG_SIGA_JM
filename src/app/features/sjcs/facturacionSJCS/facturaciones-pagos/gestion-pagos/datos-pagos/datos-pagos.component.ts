import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PagosjgItem } from '../../../../../../models/sjcs/PagosjgItem';
import { ComboItem } from '../../../../../administracion/parametros/parametros-generales/parametros-generales.component';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datos-pagos',
  templateUrl: './datos-pagos.component.html',
  styleUrls: ['./datos-pagos.component.scss']
})
export class DatosPagosComponent implements OnInit {
  showFicha: boolean = false;
  progressSpinnerDatosPagos: boolean = false;
  cols;
  msgs;

  body: PagosjgItem = new PagosjgItem();
  bodyAux: PagosjgItem = new PagosjgItem();

  histEstados = [];
  selectedItem: number = 10;
  facturaciones: ComboItem[];
  permisos;
  idEstadoPago;
  idPago;
  numCriterios;
  cerrada;
  modoEdicion;

  @ViewChild("tabla") tabla;

  constructor(private translateService: TranslateService, private sigaService: SigaServices,
    private commonsService: CommonsService, private router: Router) { }

  ngOnInit() {

    this.getCols();

    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaPagosTarjetaDatosGen).then(respuesta => {

      this.permisos = respuesta;

      if (this.permisos == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      this.comboFacturacion();

    }).catch(error => console.error(error));

  }

  comboFacturacion() {
    this.progressSpinnerDatosPagos = true;

    this.sigaService.get("combo_comboFacturaciones").subscribe(
      data => {
        this.facturaciones = data.combooItems;
        this.commonsService.arregloTildesCombo(this.facturaciones);
        this.progressSpinnerDatosPagos = false;
      },
      err => {
        if (null != err.error) {
          console.log(err.error);
        }
        this.progressSpinnerDatosPagos = false;
      },
      () => {
        this.progressSpinnerDatosPagos = false;
        if (undefined == this.idPago) {
          this.body = new PagosjgItem();
          this.bodyAux = new PagosjgItem();
          this.showFicha = true;
        } else {
          this.cargaDatos();
          this.showFicha = false;
        }
      }
    );
  }

  cargaDatos() {
    if (undefined != this.idPago) {
      this.progressSpinnerDatosPagos = true;

      //datos del pago
      this.sigaService.getParam("facturacionsjcs_datosGeneralesPago", "?idPago=" + this.idPago).subscribe(
        data => {

          this.progressSpinnerDatosPagos = false;

          const resp = data.pagosjgItem[0];
          const error = data.error;

          if (error && null != error && null != error.description) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description));
          } else {
            this.body = new PagosjgItem();

            if (undefined != resp) {

              if (undefined != this.idPago && this.facturaciones.find(el => el.value == resp.idFacturacion) == undefined) {
                this.facturaciones.unshift({
                  label: resp.nombreFac,
                  value: resp.idFacturacion
                });
              }

              this.body = JSON.parse(JSON.stringify(resp));

              this.bodyAux = new PagosjgItem();
              this.bodyAux = JSON.parse(JSON.stringify(resp));
            }
          }
        },
        err => {
          if (null != err.error) {
            console.log(err.error);
          }
          this.progressSpinnerDatosPagos = false;
        }
      );

      this.historicoEstados();
    }
  }

  historicoEstados() {

    if (undefined != this.idPago) {
      this.progressSpinnerDatosPagos = true;

      this.sigaService.getParam("facturacionsjcs_historicoPago", `?idPago=${this.idPago}`).subscribe(
        data => {
          this.histEstados = data.pagosjgItem;
          this.progressSpinnerDatosPagos = false;
        },
        err => {
          if (null != err.error) {
            console.log(err.error);
          }
          this.progressSpinnerDatosPagos = false;
        }
      );
    }
  }

  disabledSave() {
    if (this.modoEdicion) {
      if ((JSON.stringify(this.body) != JSON.stringify(this.bodyAux)) && (undefined != this.body.nombre && this.body.nombre.trim() != "") && (undefined != this.body.abreviatura && this.body.abreviatura.trim() != "") && (undefined != this.body.idFacturacion) && (this.idEstadoPago == "10")) {
        return false;
      } else {
        return true;
      }
    } else {
      if ((undefined != this.body.nombre && this.body.nombre.trim() != "") && (undefined != this.body.idFacturacion) && (undefined != this.body.abreviatura && this.body.abreviatura.trim() != "")) {
        return false;
      } else {
        return true;
      }
    }
  }

  guardar() {

    this.progressSpinnerDatosPagos = true;

    if (!this.modoEdicion) {

      const labelFac = this.facturaciones.find(el => el.value == this.body.idFacturacion).label;
      const fechaDesde = labelFac.split("-")[0].trim().split("/").reverse().join("-");
      const fechaHasta = labelFac.split("-")[1].trim().split("/").reverse().join("-");

      const copyBody: PagosjgItem = JSON.parse(JSON.stringify(this.body));
      copyBody.fechaDesde = new Date(fechaDesde);
      copyBody.fechaHasta = new Date(fechaHasta);

      this.sigaService.post("facturacionsjcs_savePago", copyBody).subscribe(
        data => {

          this.progressSpinnerDatosPagos = false;

          const resp = JSON.parse(data.body);
          const error = resp.error;

          if (error && null != error && null != error.description) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description));
          } else if (resp.status == 'OK') {
            this.idPago = resp.id;
            this.idEstadoPago = '10';
            this.modoEdicion = true;
            this.bodyAux = new PagosjgItem();
            this.bodyAux = JSON.parse(JSON.stringify(this.body));
          }

        },
        err => {
          this.progressSpinnerDatosPagos = false;
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        },
        () => {
          this.progressSpinnerDatosPagos = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.historicoEstados();
        }
      );

    } else {

      this.sigaService.post("facturacionsjcs_updatePago", this.body).subscribe(
        data => {

          this.progressSpinnerDatosPagos = false;

          const resp = JSON.parse(data.body);
          const error = resp.error;

          if (error && null != error && null != error.description) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description));
          } else if (resp.status == 'OK') {
            this.bodyAux = new PagosjgItem();
            this.bodyAux = JSON.parse(JSON.stringify(this.body));
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          }
        },
        err => {
          this.progressSpinnerDatosPagos = false;
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      );

    }

  }

  disabledRestablecer() {
    if (this.modoEdicion) {
      if (JSON.stringify(this.body) != JSON.stringify(this.bodyAux) && (this.idEstadoPago == "10" || this.idEstadoPago == "20")) {
        return false;
      } else {
        return true;
      }
    } else {
      if ((undefined != this.body.nombre && this.body.nombre.trim() != "") || (undefined != this.body.idFacturacion) || (undefined != this.body.abreviatura && this.body.abreviatura.trim() != "")) {
        return false;
      } else {
        return true;
      }
    }
  }

  restablecer() {
    if ((JSON.stringify(this.body) != JSON.stringify(this.bodyAux))) {
      if (!this.modoEdicion) {
        this.body = new PagosjgItem();
        this.histEstados = [];
        //this.changeCerrada.emit(false);
      } else {
        if (this.idEstadoPago == "10") {
          this.body = JSON.parse(JSON.stringify(this.bodyAux));

          if (undefined == this.body) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
          }
        }
      }
    }
  }

  disabledEjecutar() {
    if ((this.modoEdicion && this.idEstadoPago != "30") && this.disabledRestablecer()) {
      return false;
    } else {
      return true;
    }
  }

  ejecutar() {

  }

  disabledCerrar() {
    if (this.modoEdicion && this.idEstadoPago == "20" && this.disabledRestablecer()) {
      return false;
    } else {
      return true;
    }
  }

  cerrar() {

  }

  disabledReabrir() {
    if ((this.modoEdicion && this.idEstadoPago == "30") && this.disabledRestablecer()) {
      return false;
    } else {
      return true;
    }
  }

  reabrir() {

  }

  getCols() {
    this.cols = [
      { field: "fechaEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado" },
      { field: "desEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado" },
      { field: "nombreUsuModificacion", header: "facturacionSJCS.facturacionesYPagos.usuario" }
    ];
  }

  onHideDatosGenerales() {
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


  marcarObligatorio(tipoCampo: string, valor) {
    let resp = false;

    if (tipoCampo == 'input' && (valor == undefined || valor == null || valor.trim().length == 0)) {
      resp = true;
    }

    if (tipoCampo == 'select' && (valor == undefined || valor == null)) {
      resp = true;
    }

    if (tipoCampo == 'datePicker' && (valor == undefined || valor == null || valor == '')) {
      resp = true;
    }

    return resp;
  }

}
