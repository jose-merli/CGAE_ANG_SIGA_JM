import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PagosjgItem } from '../../../../../../models/sjcs/PagosjgItem';
import { ComboItem } from '../../../../../administracion/parametros/parametros-generales/parametros-generales.component';
import { TranslateService } from '../../../../../../commons/translate/translation.service';

@Component({
  selector: 'app-datos-pagos',
  templateUrl: './datos-pagos.component.html',
  styleUrls: ['./datos-pagos.component.scss']
})
export class DatosPagosComponent implements OnInit {
  showFicha: boolean = true;
  progressSpinnerDatosPagos: boolean = false;
  cols;
  msgs;

  body: PagosjgItem = new PagosjgItem();
  bodyAux: PagosjgItem = new PagosjgItem();
  
  histEstados = [];
  facturaciones: ComboItem;

  @ViewChild("tabla") tabla;

  @Input() permisos;
  @Input() numCriterios;
  @Input() cerrada;
  @Input() idEstadoPago;
  @Input() idPago;
  @Input() modoEdicion;

  constructor(private translateService: TranslateService) { }

  ngOnInit() {    
    if (undefined == this.idPago) {
      this.body = new PagosjgItem();
      this.bodyAux = new PagosjgItem();
      this.showFicha = true;
    } else {
      this.cargaDatos();
      this.showFicha = false;
    }

    this.getCols();
  }

  cargaDatos(){
    /*this.progressSpinnerDatos = true;

    //datos de la facturación
    this.sigaService.getParam("facturacionsjcs_datosfacturacion", "?idFacturacion=" + this.idFacturacion).subscribe(
      data => {
        this.body = new FacturacionItem();

        if (undefined != data.facturacionItem && data.facturacionItem.length > 0) {
          let datos = data.facturacionItem[0];
          this.body = JSON.parse(JSON.stringify(datos));

          if (undefined != data.facturacionItem[0].fechaDesde) {
            this.body.fechaDesde = new Date(data.facturacionItem[0].fechaDesde);
          }

          if (undefined != data.facturacionItem[0].fechaHasta) {
            this.body.fechaHasta = new Date(data.facturacionItem[0].fechaHasta);
            this.minDate = new Date(data.facturacionItem[0].fechaDesde);
          }

          if (undefined != data.facturacionItem[0].fechaEstado) {
            this.body.fechaEstado = new Date(data.facturacionItem[0].fechaEstado);
          }

          if (undefined != data.facturacionItem[0].regularizacion) {
            if (data.facturacionItem[0].regularizacion == '1') {
              this.checkRegularizar = true;
              this.checkRegularizarInicial = true;
            } else {
              this.checkRegularizar = false;
              this.checkRegularizarInicial = false;
            }
          }

          if (undefined != data.facturacionItem[0].visible) {
            if (data.facturacionItem[0].visible == '1') {
              this.checkVisible = true;
              this.checkVisibleInicial = true;
            } else {
              this.checkVisible = false;
              this.checkVisibleInicial = false;
            }
          }

          this.bodyAux = new FacturacionItem();
          this.bodyAux = JSON.parse(JSON.stringify(datos));

          if (undefined != data.facturacionItem[0].fechaDesde) {
            this.bodyAux.fechaDesde = new Date(data.facturacionItem[0].fechaDesde);
          }

          if (undefined != data.facturacionItem[0].fechaHasta) {
            this.bodyAux.fechaHasta = new Date(data.facturacionItem[0].fechaHasta);
            this.minDate = new Date(data.facturacionItem[0].fechaDesde);
          }

          if (undefined != data.facturacionItem[0].fechaEstado) {
            this.bodyAux.fechaEstado = new Date(data.facturacionItem[0].fechaEstado);
          }
        }
        this.progressSpinnerDatos = false;
      },
      err => {
        if (null != err.error) {
          console.log(err.error);
        }
        this.progressSpinnerDatos = false;
      }
    );

    this.historicoEstados();*/
  }

  historicoEstados() {
    /*let idFac;

    if (this.modoEdicion) {
      idFac = this.idFacturacion;
    } else if (!this.modoEdicion && undefined != this.body.idFacturacion) {
      idFac = this.body.idFacturacion;
    }

    if (undefined != idFac) {
      this.progressSpinnerDatos = true;

      this.sigaService.getParam("facturacionsjcs_historicofacturacion", "?idFacturacion=" + idFac).subscribe(
        data => {
          this.estadosFacturacion = data.facturacionItem;
          this.progressSpinnerDatos = false;
        },
        err => {
          if (null != err.error) {
            console.log(err.error);
          }
          this.progressSpinnerDatos = false;
        }
      );
    }
  }*/
  }
  
  disabledSave() {
    if (this.modoEdicion) {
      if ((JSON.stringify(this.body) != JSON.stringify(this.bodyAux)) && (undefined != this.body.nombre && this.body.nombre.trim() != "") /*&& (undefined != this.body.abono && this.body.abono.trim() != "") */ && (undefined != this.body.idFacturacion) && (this.idEstadoPago == "10")){
        return false;
      } else {
        return true;
      }
    } else {
      if ((undefined != this.body.nombre && this.body.nombre.trim() != "") && (undefined != this.body.idFacturacion) /*&& (undefined != this.body.abono && this.body.abono.trim() != "") */) {
        return false;
      } else {
        return true;
      }
    }
  }

  guardar(){

  }

  disabledRestablecer() {
    if (this.modoEdicion) {
      if(JSON.stringify(this.body) != JSON.stringify(this.bodyAux) && this.idEstadoPago == "10"){
        return false;
      } else {
        return true;
      }
    } else {
      if ((undefined != this.body.nombre && this.body.nombre.trim() != "") || (undefined != this.body.idFacturacion) /*|| (undefined != this.body.abono && this.body.abono.trim() != "") */) {
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

  ejecutar(){

  }

  disabledCerrar(){
    if(this.modoEdicion && this.idEstadoPago == "20" && this.disabledRestablecer()){
      return false;
    } else {
      return true;
    }
  }

  cerrar(){

  }

  disabledReabrir() {
    if ((this.modoEdicion && this.idEstadoPago == "30") && this.disabledRestablecer()) {
      return false;
    } else {
      return true;
    }
  }

  reabrir(){

  }

  getCols() {
    this.cols = [
      { field: "fechaEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado" },
      { field: "desEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado" }
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
}
