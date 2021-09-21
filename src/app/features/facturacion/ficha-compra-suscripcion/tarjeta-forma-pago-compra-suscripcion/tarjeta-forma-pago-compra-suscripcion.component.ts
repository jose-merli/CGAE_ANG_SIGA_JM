import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { SigaServices } from '../../../../_services/siga.service';
import { Message } from 'primeng/components/common/api';
import { DatosBancariosItem } from '../../../../models/DatosBancariosItem';
import { CommonsService } from '../../../../_services/commons.service';
import { procesos_facturacion } from '../../../../permisos/procesos_facturacion';
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
  disableNoFact: boolean;
  permisoGuardar;
  selectedPago;
  comboComun = [];

  desFormaPagoSelecc;
  cuentasBanc;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService, 
    private commonsService: CommonsService, private router: Router) { }

  ngOnInit() {
    this.disableNoFact = true;
    //Aparece seleccionado por defecto al crear una ficha nueva
    if(this.ficha.noFact == null)this.ficha.noFact = true;

    this.getComboFormaPago();
    this.selectedPago = this.ficha.idFormaPagoSeleccionada;
  }

  //Metodo para obtener los valores del combo Forma de pago
  getComboFormaPago() {
    this.progressSpinner = true;

    this.sigaServices.get("productosBusqueda_comboFormaPago").subscribe(
      PayMethodSelectValues => {
        this.progressSpinner = false;

        let comboPagos = PayMethodSelectValues.combooItems;
        //Revisamos el combo para escoger unicamente el combo con los valores en comun de los productos.
        //Posible optimizacion con la implementacion de un servicio especifico para esta pantalla.
        this.ficha.idFormasPagoComunes.split(",").forEach(
          comun => {
            comboPagos.forEach(pago => {
              if(pago.value==comun || pago.value==this.ficha.idFormaPagoSeleccionada) this.comboComun.push(pago);
              //Se asigna el valor que se mostrará en la cabecera de la tarjeta.
              if(pago.value==this.ficha.idFormaPagoSeleccionada) this.desFormaPagoSelecc = pago.label;
            });
          }
        );
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }


  onHideTarjeta(){
    this.showTarjeta = !this.showTarjeta;
  }

  getPermisoBuscar(){
    this.commonsService
			.checkAcceso(procesos_facturacion.fichaCompraSuscripcion)
			.then((respuesta) => {
				this.permisoGuardar = respuesta;
			})
			.catch((error) => console.error(error));
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
    this.msgs.push({
      severity: "info",
      summary: "Boton pendiente de implementación",
      detail: "Gracias por su paciencia"
    });
    this.sigaServices.post('facturacion_solicitarCompra', this.ficha).subscribe(
			(n) => {
				if( n.status != 'OK') {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }
				this.progressSpinner = false;
			},
			(err) => {
				console.log(err);
				this.progressSpinner = false;
			}
		);
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
