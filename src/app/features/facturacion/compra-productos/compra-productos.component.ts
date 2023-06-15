import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../commons/translate';
import { FiltrosCompraProductosItem } from '../../../models/FiltrosCompraProductosItem';
import { ListaComprasProductosItem } from '../../../models/ListaComprasProductosItem';
import { CommonsService } from '../../../_services/commons.service';
import { PersistenceService } from '../../../_services/persistence.service';
import { SigaServices } from '../../../_services/siga.service';
import { TarjetaFiltroCompraProductosComponent } from './tarjeta-filtro-compra-productos/tarjeta-filtro-compra-productos.component';
import { TarjetaListaCompraProductosComponent } from './tarjeta-lista-compra-productos/tarjeta-lista-compra-productos.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-compra-productos',
  templateUrl: './compra-productos.component.html',
  styleUrls: ['./compra-productos.component.scss']
})
export class CompraProductosComponent implements OnInit {
  msgs : Message[] = [];
  
  progressSpinner: boolean = false;

  listaCompraProductos: ListaComprasProductosItem[];

  muestraTablaCompraProductos: boolean = false;
  fromFichaCen: boolean = false;

  @ViewChild(TarjetaFiltroCompraProductosComponent) filtrosBusqueda;
  @ViewChild(TarjetaListaCompraProductosComponent) listaBusqueda;
  
  //Suscripciones
  subscriptionProductosBusqueda: Subscription;

  constructor(private commonsService:CommonsService, private sigaServices: SigaServices,
    private translateService: TranslateService, private persistenceService: PersistenceService,
    private location: Location) { }

  ngOnInit() {
    if(sessionStorage.getItem("fromFichaCen")){
      this.fromFichaCen = true;
      sessionStorage.removeItem("fromFichaCen");
    }
  }

  ngOnDestroy() {
    if (this.subscriptionProductosBusqueda)
      this.subscriptionProductosBusqueda.unsubscribe();
  }

  busquedaCompraProductos(event) {
    this.progressSpinner = true;
    let filtrosProductos: FiltrosCompraProductosItem = this.filtrosBusqueda.filtrosCompraProductos;

    sessionStorage.setItem("filtroBusqCompra",JSON.stringify(this.filtrosBusqueda.filtrosCompraProductos));

    this.subscriptionProductosBusqueda = this.sigaServices.post("PyS_getListaCompraProductos", filtrosProductos).subscribe(
      listaCompraProductosDTO => {

        let error = JSON.parse(listaCompraProductosDTO.body).error;
        if (error.code == 200) {

          this.listaCompraProductos = JSON.parse(listaCompraProductosDTO.body).listaCompraProductosItems;

          if ((!error.message || error.message.trim().length == 0) && event) {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          } else {
            let translatedMessage = this.translateService.instant(error.message);

            // Se sustituye el el número de registros por defecto (200)
            if (translatedMessage && this.listaCompraProductos.length != undefined) {
              translatedMessage = translatedMessage.replace(/\d+/g, this.listaCompraProductos.length.toString());
            }

            if (event)
              this.showMessage("info", this.translateService.instant("general.message.informacion"), translatedMessage);            
          }

          

          this.muestraTablaCompraProductos= true;
          this.listaCompraProductos.forEach(e => {
            e.apellidosNombreAux = this.getLabelbyFilter(e.apellidosNombre).toLocaleUpperCase()
          })
          this.listaBusqueda.productsTable.reset();
          setTimeout(() => {
            this.commonsService.scrollTablaFoco('tablaCompraProductos');
          }, 5);
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }

        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
      });;
  }

  
  //Inicializa las propiedades necesarias para el dialogo de confirmacion
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  getLabelbyFilter(string): string {
    /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
	para poder filtrar el dato con o sin estos caracteres*/
    let labelSinTilde = string;
    let accents =
      'ÀÁÂÃÄÅAàáâãäåÒÓÔÕÕÖOØòóôõöøEÈÉÊËèéêëðCÇçÐDÌÍÎÏIìíîïUÙÚÛÜùúûüÑñSŠšŸYÿýŽžZ';
    let accentsOut =
      'aaaaaaaaaaaaaooooooooooooooeeeeeeeeeecccddiiiiiiiiiuuuuuuuuunnsssyyyyzzz';
    let i;
    let x;
    for (i = 0; i < labelSinTilde.length; i++) {
      if ((x = accents.indexOf(labelSinTilde.charAt(i))) != -1) {
        labelSinTilde = labelSinTilde.replace(
          labelSinTilde.charAt(i),
          accentsOut[x]
        );
      }
    }

    return labelSinTilde;
  }

  //Borra el mensaje de notificacion p-growl mostrado en la esquina superior derecha cuando pasas el puntero del raton sobre el
  clear() {
    this.msgs = [];
  }

  backTo(){
    this.location.back();
  }
}
