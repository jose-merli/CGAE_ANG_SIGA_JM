import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PagosjgItem } from '../../../../../../models/sjcs/PagosjgItem';
import { ComboItem } from '../../../../../administracion/parametros/parametros-generales/parametros-generales.component';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../_services/commons.service';

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

  constructor(private translateService: TranslateService, private sigaService: SigaServices, 
    private commonsService: CommonsService) { }

  ngOnInit() {    
    this.comboFacturacion();

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

  comboFacturacion(){
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
      }
    );
  }

  cargaDatos(){
      if(undefined!=this.idPago){
      this.progressSpinnerDatosPagos = true;

      //datos de la facturación
      this.sigaService.getParam("facturacionsjcs_datosGeneralesPago", "?idPago=" + this.idPago).subscribe(
        data => {
          this.body = new PagosjgItem();

          if (undefined != data) {
            this.body = JSON.parse(JSON.stringify(data));

            this.bodyAux = new PagosjgItem();
            this.bodyAux = JSON.parse(JSON.stringify(data));
          }

          this.progressSpinnerDatosPagos = false;
        },
        err => {
          if (null != err.error) {
            console.log(err.error);
          }
          this.progressSpinnerDatosPagos = false;
        }
      );

      //this.historicoEstados();
    }
  }

  historicoEstados() {
    let idPago;

    if (this.modoEdicion) {
      idPago = this.idPago;
    } else if (!this.modoEdicion && undefined != this.body.idPagosjg) {
      idPago = this.body.idFacturacion;
    }

    if (undefined != idPago) {
      this.progressSpinnerDatosPagos = true;

      this.sigaService.getParam("facturacionsjcs_historicoPago", "?idPago=" + idPago).subscribe(
        data => {
          this.histEstados = data.facturacionItem;
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
      if ((JSON.stringify(this.body) != JSON.stringify(this.bodyAux)) && (undefined != this.body.nombre && this.body.nombre.trim() != "") && (undefined != this.body.codBanco && this.body.codBanco.trim() != "") && (undefined != this.body.idFacturacion) && (this.idEstadoPago == "10")){
        return false;
      } else {
        return true;
      }
    } else {
      if ((undefined != this.body.nombre && this.body.nombre.trim() != "") && (undefined != this.body.idFacturacion) && (undefined != this.body.codBanco && this.body.codBanco.trim() != "")) {
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
      if ((undefined != this.body.nombre && this.body.nombre.trim() != "") || (undefined != this.body.idFacturacion) || (undefined != this.body.codBanco && this.body.codBanco.trim() != "")) {
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
