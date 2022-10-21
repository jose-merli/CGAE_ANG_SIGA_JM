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

  usuario: any[] = [];
  permisoAbogado:boolean = false;


  @ViewChild("cliente") tarjCliente;
  @ViewChild("productos") tarjProductos;
  @ViewChild("servicios") tarjServicios;
  @ViewChild("facturas") tarjFacturas;
  @ViewChild("descuentos") tarjDescuentos;
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
    this.compruebaAbogado();    if (sessionStorage.getItem("mensaje")) {
      let message: Message = JSON.parse(sessionStorage.getItem("mensaje"));
      if (message)
        this.showMessage(message.severity, message.summary, message.detail);
      sessionStorage.removeItem("mensaje");
      sessionStorage.removeItem("volver");
    }

    sessionStorage.removeItem("origin");

    if(sessionStorage.getItem("FichaCompraSuscripcion")){
      this.ficha = JSON.parse(sessionStorage.getItem("FichaCompraSuscripcion"));
      sessionStorage.removeItem("FichaCompraSuscripcion");
      // this.getComboFormaPago();
    }
  }

  compruebaAbogado(){  this.sigaServices.get("usuario_logeado").subscribe(n => {
    this.usuario = n.usuarioLogeadoItem;
    if (this.usuario[0].idPerfiles.indexOf("ABG") > -1 ) {
      this.permisoAbogado = true;
    }

  });}

  actualizarFicha(event: boolean = true){
    this.progressSpinner = true;

    this.sigaServices.post('PyS_getFichaCompraSuscripcion', this.ficha).subscribe(
      (n) => {

        if( n.status != 200) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          if (event) {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          }

          let newF:FichaCompraSuscripcionItem = JSON.parse(n.body);
          //newF.facturas= this.ficha.facturas;
          //Se comprueban las facturas asociadas nuevamente unicamente en caso de que se trate una compra
          //ya que unicamente podrian cambiar al pulsarse el botón facturar que actualmente solo esta disponible para las compras
          if(this.ficha.productos != null){
            this.tarjFacturas.getFacturasPeticion();
          }

          this.ficha = newF;

          if(this.ficha.servicios != null){
            this.tarjServicios.getServiciosSuscripcion();
          }

          if(this.ficha.impTotal != null){
            this.tarjDescuentos.actualizaImporte();
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

  clear() {
    this.msgs = [];
  }
}
