import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FichaCompraSuscripcionItem } from '../../../models/FichaCompraSuscripcionItem';
import { SigaServices } from '../../../_services/siga.service';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../commons/translate';

@Component({
  selector: 'app-ficha-compra-suscripcion',
  templateUrl: './ficha-compra-suscripcion.component.html',
  styleUrls: ['./ficha-compra-suscripcion.component.scss']
})
export class FichaCompraSuscripcionComponent implements OnInit {

  msgs : Message[];
  
  progressSpinner: boolean = false;

  ficha: FichaCompraSuscripcionItem = new FichaCompraSuscripcionItem;

  comboComun: any[] = [];
  desFormaPagoSelecc: string;


  @ViewChild("cliente") tarjCliente;


  constructor(private location: Location, 
    private sigaServices: SigaServices, private translateService: TranslateService,) { }

  ngOnInit() {

    
    if(sessionStorage.getItem("FichaCompraSuscripcion")){
      this.ficha = JSON.parse(sessionStorage.getItem("FichaCompraSuscripcion"));
      sessionStorage.removeItem("FichaCompraSuscripcion");
      this.getComboFormaPago();
    }
    //Si vuelve de otra pantalla
    else this.getDatosFicha();

    
    
  }

  getDatosFicha() {
    this.ficha = JSON.parse(sessionStorage.getItem("cargarFichaCompraSuscripcion"));
    this.progressSpinner = true; 
    let peticion = this.ficha;
    let servicio;
    if(sessionStorage.getItem("esColegiado") == "true") servicio = 'PyS_getFichaCompraSuscripcionColegiado';
    else servicio = 'PyS_getFichaCompraSuscripcionNoColegiado';
		this.sigaServices.post(servicio, peticion).subscribe(
			(n) => {
				this.ficha = JSON.parse(n.body);
				this.progressSpinner = false;
        this.getComboFormaPago();
			},
			(err) => {
				this.progressSpinner = false;
			}
		);
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
        let comunes = this.ficha.idFormasPagoComunes.split(",");
            comboPagos.forEach(pago => {
              for(let comun of comunes){
                if(pago.value==comun || pago.value==this.ficha.idFormaPagoSeleccionada.toString) this.comboComun.push(pago);
              }
              //Se asigna el valor que se mostrará en la cabecera de la tarjeta.
              if(pago.value==this.ficha.idFormaPagoSeleccionada) this.desFormaPagoSelecc = pago.label;
            });
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  backTo(){
    this.location.back();
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
