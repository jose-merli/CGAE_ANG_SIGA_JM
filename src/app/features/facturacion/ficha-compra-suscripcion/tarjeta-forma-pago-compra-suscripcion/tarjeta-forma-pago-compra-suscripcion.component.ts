import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { SigaServices } from '../../../../_services/siga.service';
import { Message } from 'primeng/components/common/api';

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
  comboComun = [];

  desFormaPagoSelecc;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService) { }

  ngOnInit() {
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
              if(pago.value==comun) this.comboComun.push(pago);
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

  checkSave(){
    this.msgs.push({
      severity: "info",
      summary: "Boton pendiente de implementación",
      detail: "Gracias por su paciencia"
    });
  }

  onHideTarjeta(){
    this.showTarjeta = !this.showTarjeta;
  }
}
