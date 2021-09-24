import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { SigaServices } from '../../../../_services/siga.service';
import { Message } from 'primeng/components/common/api';
import { DatosBancariosItem } from '../../../../models/DatosBancariosItem';
import { CommonsService } from '../../../../_services/commons.service';
import { procesos_PyS } from '../../../../permisos/procesos_PyS';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarjeta-forma-pago-compra-suscripcion',
  templateUrl: './tarjeta-forma-pago-compra-suscripcion.component.html',
  styleUrls: ['./tarjeta-forma-pago-compra-suscripcion.component.scss']
})
export class TarjetaFormaPagoCompraSuscripcionComponent implements OnInit {


  msgs : Message[];
  progressSpinner: boolean = false;

  @Input("ficha") ficha: FichaCompraSuscripcionItem;

  showTarjeta: boolean = false;
  disableNoFacturableBox: boolean = false;
  noFact: boolean = true;
  permisoGuardar;
  selectedPago;
  @Input("comboComun") comboComun: any[];

  desFormaPagoSelecc: string;
  cuentasBanc;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService, 
    private commonsService: CommonsService, private router: Router) { }

  ngOnInit() {
    this.checkNoFacturable();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.selectedPago = this.ficha.idFormaPagoSeleccionada +"";
    this.desFormaPagoSelecc = this.comboComun.find(
      el => 
        el.value == this.selectedPago
    ).label
  }

  checkNoFacturable(){
    let i=0;
    //Se comprueba si todos los productos seleccionados son no facturables
    while(i<this.ficha.productos.length && this.ficha.productos[i].noFacturable=="1"){
      this.ficha.productos[i] 
      i++;
    }
    //Si son todos no facturables
    if(i==this.ficha.productos.length){
      this.disableNoFacturableBox = true;
      this.noFact = true;
    }
  }


  onHideTarjeta(){
    this.showTarjeta = !this.showTarjeta;
  }

  getPermisoBuscar(){
    this.commonsService
			.checkAcceso(procesos_PyS.fichaCompraSuscripcion)
			.then((respuesta) => {
				this.permisoGuardar = respuesta;
			})
			.catch((error) => console.error(error));
  }

  disableSave(){
    let checkBox;
    if(this.noFact)checkBox = "1";
    else checkBox = "0";
    return this.ficha.idFormaPagoSeleccionada == this.selectedPago && this.ficha.cuentaBancSelecc == this.cuentasBanc && this.noFact == checkBox;
  }

  checkSave(){
    let msg = this.commonsService.checkPermisos(this.permisoGuardar, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    }  else {
      this.save();
		}
  }

  save(){
    //En el caso que se este modificando una ficha ya creada
    if(this.ficha.idEstadoPeticion != null && this.ficha.idEstadoPeticion != undefined){
      let peticion = this.ficha;
      peticion.idFormaPagoSeleccionada = this.selectedPago;
      //SI la forma de pago seleccionada es "Domicializacion bancaria"
      if(this.selectedPago == "20") peticion.cuentaBancSelecc = this.cuentasBanc;
      else {
        peticion.cuentaBancSelecc = null;
        this.cuentasBanc = null;
      }
      if(this.noFact) peticion.noFact = "1";
      else peticion.noFact = "0";
      this.sigaServices.post('PyS_savePagoCompraSuscripcion', this.ficha).subscribe(
        (n) => {
          if( n.status != 'OK') {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          } else {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            this.ficha.idFormaPagoSeleccionada = this.selectedPago;
            //SI la forma de pago seleccionada es "Domicializacion bancaria"
            if(this.selectedPago == "20") this.ficha.cuentaBancSelecc = this.cuentasBanc;
            else {
              this.ficha.cuentaBancSelecc = null;
              this.cuentasBanc = null;
            }
            if(this.noFact) this.ficha.noFact = "1";
            else this.ficha.noFact = "0";
          }
          this.progressSpinner = false;
        },
        (err) => {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          this.progressSpinner = false;
        }
      );
    }
    //Una ficha nueva
    else{
      this.ficha.idFormaPagoSeleccionada = this.selectedPago;
      //SI la forma de pago seleccionada es "Domicializacion bancaria"
      if(this.selectedPago == "20") this.ficha.cuentaBancSelecc = this.cuentasBanc;
      else {
        this.ficha.cuentaBancSelecc = null;
        this.cuentasBanc = null;
      }
      if(this.noFact) this.ficha.noFact = "1";
      else this.ficha.noFact = "0";
      
      this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
    }
  }

  cargarDatosBancarios() {
      
    let peticionBanc = new DatosBancariosItem();

    peticionBanc.historico = false;
    peticionBanc.idPersona = this.ficha.idPersona;
    peticionBanc.nifTitular = this.ficha.nif;
      this.sigaServices
        .postPaginado("datosBancarios_search", "?numPagina=1", peticionBanc)
        .subscribe(
          data => {
            this.progressSpinner = false;
            //Revisar para obtener pares "label"/"value"
            this.cuentasBanc = JSON.parse(data["body"]).datosBancariosItem[0];
          },
          error => {
            this.msgs.push({ severity: "error", summary: "", detail: JSON.stringify(JSON.parse(error["error"]).error.description) });
            this.progressSpinner = false;
          }
        );
  }

  showMessage(severity, summary, msg) {
      this.msgs = [];
      this.msgs.push({
        severity: severity,
        summary: summary,
        detail: msg
      });
  }
}
