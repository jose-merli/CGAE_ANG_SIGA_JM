// import { Component, OnInit, ViewChild, Input,Output, EventEmitter} from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service';
import { Message } from 'primeng/components/common/api';
import { TarjetaFiltroMonederosComponent } from './tarjeta-filtro-monederos/tarjeta-filtro-monederos.component';
import { TarjetaListaMonederosComponent } from './tarjeta-lista-monederos/tarjeta-lista-monederos.component';
import { ListaMonederosItem } from '../../../models/ListaMonederosItem';
import { TranslateService } from '../../../commons/translate';
import { CommonsService } from '../../../_services/commons.service';
import { SigaServices } from '../../../_services/siga.service';
import { FiltrosMonederoItem } from '../../../models/FiltrosMonederoItem';
import { ListaMonederosDTO } from '../../../models/ListaMonederosDTO';


@Component({
  selector: 'app-monederos',
  templateUrl: './monederos.component.html',
  styleUrls: ['./monederos.component.scss'],

})
export class MonederoComponent implements OnInit {

  msgs : Message[] = [];
  
  progressSpinner: boolean = false;

  listaMonederos: ListaMonederosItem[] = [];

  muestraTablaMonederos: boolean = false;

  @ViewChild(TarjetaFiltroMonederosComponent) filtrosBusqueda : TarjetaFiltroMonederosComponent ;
  @ViewChild(TarjetaListaMonederosComponent) listaBusqueda : TarjetaListaMonederosComponent;
  listaMonederosActivos: ListaMonederosItem[] = [];
  

  constructor(private commonsService:CommonsService, private sigaServices: SigaServices,
    private translateService: TranslateService) { }

  ngOnInit() {
  }


  busquedaMonederos() {
    this.progressSpinner = true;
    let filtrosMonedero: FiltrosMonederoItem = this.filtrosBusqueda.filtrosMonederoItem;

    this.sigaServices.post("monederosBusqueda_searchListadoMonederos", filtrosMonedero).subscribe(
      listaMonederosDTO => {

        if (JSON.parse(listaMonederosDTO.body).error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.listaMonederos = JSON.parse(listaMonederosDTO.body).monederoItems
          this.muestraTablaMonederos = true;

          if (this.listaMonederos != undefined) {
            //Se buscan los monederos activos
            this.listaMonederosActivos = this.listaMonederos.filter(
              (dato) =>  dato.importeRestante != 0);
          }
        }
      });
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
