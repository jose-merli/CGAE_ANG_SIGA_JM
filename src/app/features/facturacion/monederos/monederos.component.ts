// import { Component, OnInit, ViewChild, Input,Output, EventEmitter} from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service';
import { Message } from 'primeng/components/common/api';
import { TarjetaFiltroMonederosComponent } from './tarjeta-filtro-monederos/tarjeta-filtro-monederos.component';
import { TarjetaListaMonederosComponent } from './tarjeta-lista-monederos/tarjeta-lista-monederos.component';
import { ListaMonederosItem } from '../../../models/ListaMonederosItem';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../commons/translate';
import { FiltrosCompraProductosItem } from '../../../models/FiltrosCompraProductosItem';
import { CommonsService } from '../../../_services/commons.service';
import { SigaServices } from '../../../_services/siga.service';


@Component({
  selector: 'app-previsiones-factura',
  templateUrl: './previsiones-factura.component.html',
  styleUrls: ['./previsiones-factura.component.scss'],

})
export class MonederoComponent implements OnInit {

  msgs : Message[] = [];
  
  progressSpinner: boolean = false;

  listaMonederos: ListaMonederosItem[];

  muestraTablaCompraProductos: boolean = false;

  @ViewChild(TarjetaFiltroMonederosComponent) filtrosBusqueda;
  @ViewChild(TarjetaListaMonederosComponent) listaBusqueda;
  

  constructor(private commonsService:CommonsService, private sigaServices: SigaServices,
    private translateService: TranslateService) { }

  ngOnInit() {
  }


  busquedaMonederos(event) {
    this.progressSpinner = true;
    let filtrosProductos: FiltrosCompraProductosItem = this.filtrosBusqueda.filtrosCompraProductos;

    this.sigaServices.post("PyS_getListaCompraProductos", filtrosProductos).subscribe(
      listaCompraProductosDTO => {


        if (JSON.parse(listaCompraProductosDTO.body).error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          this.listaMonederos = JSON.parse(listaCompraProductosDTO.body).listaCompraProductosItems;

          this.muestraTablaCompraProductos= true;
          this.listaBusqueda.productsTable.reset();
        }

        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
      });;
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
