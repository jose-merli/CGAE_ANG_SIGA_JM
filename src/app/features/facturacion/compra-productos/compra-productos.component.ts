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


        if (JSON.parse(listaCompraProductosDTO.body).error.code == 200) {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          this.listaCompraProductos = JSON.parse(listaCompraProductosDTO.body).listaCompraProductosItems;

          this.muestraTablaCompraProductos= true;
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

  //Borra el mensaje de notificacion p-growl mostrado en la esquina superior derecha cuando pasas el puntero del raton sobre el
  clear() {
    this.msgs = [];
  }

  backTo(){
    this.location.back();
  }
}
