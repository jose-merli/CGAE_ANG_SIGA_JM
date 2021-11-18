import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FichaCompraSuscripcionItem } from '../../../models/FichaCompraSuscripcionItem';
import { SigaServices } from '../../../_services/siga.service';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../commons/translate';
import { ListaProductosCompraItem } from '../../../models/ListaProductosCompraItem';
import { CommonsService } from '../../../_services/commons.service';
import { SigaStorageService } from '../../../siga-storage.service';

@Component({
  selector: 'app-ficha-compra-suscripcion',
  templateUrl: './ficha-compra-suscripcion.component.html',
  styleUrls: ['./ficha-compra-suscripcion.component.scss']
})
export class FichaCompraSuscripcionComponent implements OnInit {

  msgs : Message[];
  
  progressSpinner: boolean = false;

  ficha: FichaCompraSuscripcionItem = new FichaCompraSuscripcionItem;
  resaltadoDatos: boolean = false;

  comboComun: any[] = [];
  desFormaPagoSelecc: string;


  @ViewChild("cliente") tarjCliente;
  @ViewChild("productos") tarjProductos;
  @ViewChild("servicios") tarjServicios;
  esColegiado: boolean; // Con esta variable se determina si el usuario conectado es un colegiado o no.


  constructor(private location: Location, 
    private sigaServices: SigaServices, private translateService: TranslateService,
    private commonsService : CommonsService,
    private localStorageService: SigaStorageService,) { }

  ngOnInit() {
    if(this.localStorageService.isLetrado){
      this.esColegiado = true;
    }
    else{
      this.esColegiado = false;
    }

    sessionStorage.removeItem("origin");

    if(sessionStorage.getItem("FichaCompraSuscripcion")){
      this.ficha = JSON.parse(sessionStorage.getItem("FichaCompraSuscripcion"));
      sessionStorage.removeItem("FichaCompraSuscripcion");
      this.getComboFormaPago();
    }
  }

  //Metodo para obtener los valores del desplegable "Forma de pago" de la tarjeta Forma de pago
  getComboFormaPago() {
    this.progressSpinner = true;

    this.sigaServices.get("productosBusqueda_comboFormaPago").subscribe(
      PayMethodSelectValues => {
        this.progressSpinner = false;

        let comboPagos = PayMethodSelectValues.combooItems;
        //Revisamos el combo para escoger unicamente el combo con los valores en comun de los productos.
        //Posible optimizacion con la implementacion de un servicio especifico para esta pantalla.
        let comunes = [];
        if(this.ficha.idFormasPagoComunes != null)comunes = this.ficha.idFormasPagoComunes.split(",");
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

  actualizarFicha(){
    this.progressSpinner = true;

    this.sigaServices.post('PyS_getFichaCompraSuscripcion', this.ficha).subscribe(
      (n) => {

        if( n.status != 200) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.ficha = JSON.parse(n.body);

          if(this.ficha.servicios != null){
            this.tarjServicios.getServiciosSuscripcion();
          }
        }

        this.progressSpinner = false;
          
      },
      (err) => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    );
  }

  scrollToOblig(element : string){
    this.resaltadoDatos = true;
    this.commonsService.scrollTablaFoco(element);
    if(element == "cliente"){
      this.tarjCliente.showTarjeta = true;
    }
    if(element == "productos"){
      this.tarjProductos.showTarjeta = true;
    }
    if(element == "servicios"){
      this.tarjServicios.showTarjeta = true;
    }
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
