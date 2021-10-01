import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../commons/translate';
import { FiltrosCompraProductosItem } from '../../../models/FiltrosCompraProductosItem';
import { ListaCompraProductosItem } from '../../../models/ListaCompraProductosItem';
import { CommonsService } from '../../../_services/commons.service';
import { SigaServices } from '../../../_services/siga.service';

@Component({
  selector: 'app-compra-productos',
  templateUrl: './compra-productos.component.html',
  styleUrls: ['./compra-productos.component.scss']
})
export class CompraProductosComponent implements OnInit {
  msgs : Message[] = [];
  
  progressSpinner: boolean = false;

  listaCompraProductos: ListaCompraProductosItem[];

  muestraTablaCompraProductos: boolean = false;

  
  //Suscripciones
  subscriptionProductosBusqueda: Subscription;

  constructor(private commonsService:CommonsService, private sigaServices: SigaServices,
    private translateService: TranslateService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscriptionProductosBusqueda)
      this.subscriptionProductosBusqueda.unsubscribe();
  }

  busquedaCompraProductos(event) {
    this.progressSpinner = true;
    let filtrosProductos: FiltrosCompraProductosItem = JSON.parse(sessionStorage.getItem("filtrosCompraProductos"));

    this.subscriptionProductosBusqueda = this.sigaServices.post("PyS_getListaCompraProductos", filtrosProductos).subscribe(
      listaCompraProductosDTO => {

        this.listaCompraProductos = JSON.parse(listaCompraProductosDTO.body).listaCompraProductosItems;

        if (JSON.parse(listaCompraProductosDTO.body).error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.muestraTablaCompraProductos= true;
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
}
