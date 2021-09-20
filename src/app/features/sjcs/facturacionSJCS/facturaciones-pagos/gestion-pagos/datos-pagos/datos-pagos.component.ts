import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { PagosjgItem } from '../../../../../../models/sjcs/PagosjgItem';
import { ComboItem } from '../../../../../administracion/parametros/parametros-generales/parametros-generales.component';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacionSJCS';
import { Router } from '@angular/router';
import { CompensacionFacItem } from '../../../../../../models/sjcs/CompensacionFacItem';
import { CerrarPagoObject } from '../../../../../../models/sjcs/CerrarPagoObject';
import { ParametroItem } from '../../../../../../models/ParametroItem';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-datos-pagos',
  templateUrl: './datos-pagos.component.html',
  styleUrls: ['./datos-pagos.component.scss']
})
export class DatosPagosComponent implements OnInit {
  showFicha: boolean = false;
  progressSpinner: boolean = false;
  cols;
  msgs;

  body: PagosjgItem = new PagosjgItem();
  bodyAux: PagosjgItem = new PagosjgItem();

  histEstados = [];
  selectedItem: number = 10;
  facturaciones: ComboItem[];
  permisos;

  @Input() numCriterios;
  @Input() paramDeducirCobroAutom: ParametroItem;
  @Input() modoEdicion;
  @Output() modoEdicionChange = new EventEmitter<boolean>();
  @Input() idPago;
  @Output() idPagoChange = new EventEmitter<string>();
  @Input() idEstadoPago;
  @Output() idEstadoPagoChange = new EventEmitter<string>();
  @Input() editingConceptos;
  @Input() facturasMarcadas: CompensacionFacItem[];
  @Output() facturacionChange = new EventEmitter<string>();
  @Output() compensacionFactEvent = new EventEmitter<boolean>();

  @ViewChild("tabla") tabla;

  constructor(private translateService: TranslateService, private sigaService: SigaServices,
    private commonsService: CommonsService, private router: Router, private confirmationService: ConfirmationService) { }

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
    this.progressSpinner = true;

    this.sigaService.get("combo_comboFacturaciones").subscribe(
      data => {
        this.facturaciones = data.combooItems;
        this.commonsService.arregloTildesCombo(this.facturaciones);
        this.progressSpinner = false;
      },
      err => {
        if (null != err.error) {
          console.log(err.error);
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
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
      this.progressSpinner = true;

      //datos del pago
      this.sigaService.getParam("pagosjcs_datosGeneralesPago", "?idPago=" + this.idPago).subscribe(
        data => {

          this.progressSpinner = false;

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
          this.progressSpinner = false;
        }
      );

      this.historicoEstados();
    }
  }

  historicoEstados() {

    if (undefined != this.idPago) {
      this.progressSpinner = true;

      this.sigaService.getParam("pagosjcs_historicoPago", `?idPago=${this.idPago}`).subscribe(
        data => {
          this.histEstados = data.pagosjgItem;
          this.progressSpinner = false;
        },
        err => {
          if (null != err.error) {
            console.log(err.error);
          }
          this.progressSpinner = false;
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

    this.progressSpinner = true;

    if (!this.modoEdicion) {

      const labelFac = this.facturaciones.find(el => el.value == this.body.idFacturacion).label;
      const fechaDesde = labelFac.split("-")[0].trim().split("/").reverse().join("-");
      const fechaHasta = labelFac.split("-")[1].trim().split("/").reverse().join("-");

      const copyBody: PagosjgItem = JSON.parse(JSON.stringify(this.body));
      copyBody.fechaDesde = new Date(fechaDesde);
      copyBody.fechaHasta = new Date(fechaHasta);

      this.sigaService.post("pagosjcs_savePago", copyBody).subscribe(
        data => {

          this.progressSpinner = false;

          const resp = JSON.parse(data.body);
          const error = resp.error;

          if (error && null != error && null != error.description) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description));
          } else if (resp.status == 'OK') {
            this.idPago = resp.id;
            this.idPagoChange.emit(this.idPago);
            this.facturacionChange.emit(this.body.idFacturacion.toString());
            this.idEstadoPago = '10';
            this.idEstadoPagoChange.emit(this.idEstadoPago);
            this.modoEdicion = true;
            this.modoEdicionChange.emit(true);
            this.bodyAux = new PagosjgItem();
            this.bodyAux = JSON.parse(JSON.stringify(this.body));
          }

        },
        err => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        },
        () => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.historicoEstados();
        }
      );

    } else {

      this.sigaService.post("pagosjcs_updatePago", this.body).subscribe(
        data => {

          this.progressSpinner = false;

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
          this.progressSpinner = false;
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
      } else {
        if (this.idEstadoPago == "10" || this.idEstadoPago == "20") {
          this.body = JSON.parse(JSON.stringify(this.bodyAux));

          if (undefined == this.body) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
          }
        }
      }
    }
  }

  disabledEjecutar() {
    if ((this.modoEdicion && this.idEstadoPago != "30" && this.idEstadoPago != "20") && this.disabledRestablecer()) {
      return false;
    } else {
      return true;
    }
  }

  ejecutar() {

    if (this.modoEdicion && !this.disabledEjecutar()) {

      this.progressSpinner = true;

      const pago = new PagosjgItem();
      pago.idPagosjg = this.idPago;

      this.sigaService.post("pagosjcs_ejecutarPago", pago).subscribe(
        data => {
          this.progressSpinner = false;

          const resp = JSON.parse(data.body);
          const error = resp.error;

          if (resp.status == 'KO' && error && null != error && null != error.description) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), error.description);
          } else if (resp.status == 'OK') {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            this.historicoEstados();
            this.idEstadoPago = "20";
            this.compensacionFactEvent.emit(true);
          }

        },
        err => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      );

    }

  }

  disabledCerrar() {
    if (this.modoEdicion && this.idEstadoPago == "20" && this.disabledRestablecer()) {
      return false;
    } else {
      return true;
    }
  }

  cerrar() {

    if (this.facturasMarcadas.length == 0) {

      this.confirmationService.confirm({
        key: "cdCompensacionFac",
        message: this.translateService.instant("messages.factSJCS.compensarConfirmation"),
        icon: "fa fa-search",
        accept: () => {
          this.paramDeducirCobroAutom.valor == '0' ? this.cerrarPagoManual() : this.cerrarPago();
        },
        reject: () => {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant('general.message.accion.cancelada'));
        }
      });
    } else {
      this.paramDeducirCobroAutom.valor == '0' ? this.cerrarPagoManual() : this.cerrarPago();
    }

  }

  cerrarPago() {

    if (this.modoEdicion && !this.disabledCerrar()) {

      this.progressSpinner = true;

      const payload: CerrarPagoObject = new CerrarPagoObject();
      payload.idPago = this.idPago;
      payload.idsParaEnviar = null;

      this.sigaService.post("pagosjcs_cerrarPago", payload).subscribe(
        data => {

          const resp = JSON.parse(data.body);

          if (resp.status == 'KO' && resp.error != null && resp.error.description != null) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(resp.error.description));
          } else {
            this.idEstadoPago = '30';
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          }

          this.progressSpinner = false;

        },
        err => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        },
        () => {
          this.progressSpinner = false;
          this.historicoEstados();
        }
      );

    }

  }

  cerrarPagoManual() {

    if (this.modoEdicion && !this.disabledCerrar()) {

      this.progressSpinner = true;

      const payload: CerrarPagoObject = new CerrarPagoObject();
      payload.idPago = this.idPago;
      payload.idsParaEnviar = this.facturasMarcadas.map(el => el.idPersona);

      this.sigaService.post("pagosjcs_cerrarPagoManual", payload).subscribe(
        data => {

          const resp = JSON.parse(data.body);

          if (resp.status == 'KO' && resp.error != null && resp.error.description != null) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(resp.error.description));
          } else {
            this.idEstadoPago = '30';
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          }

          this.progressSpinner = false;

        },
        err => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        },
        () => {
          this.progressSpinner = false;
          this.historicoEstados();
        }
      );

    }

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

  isPagoCerrado() {
    return (this.idEstadoPago == '30');
  }

  isPagoEjecutado() {
    return this.idEstadoPago == '20';
  }

}
