import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MultiSelect } from 'primeng/multiselect';
import { TranslateService } from '../../../commons/translate';
import { OldSigaServices } from '../../../_services/oldSiga.service'
import { FiltrosSeriesFacturaComponent } from './filtros-series-factura/filtros-series-factura.component';


@Component({
  selector: 'app-series-factura',
  templateUrl: './series-factura.component.html',
  styleUrls: ['./series-factura.component.scss'],

})
export class SeriesFacturaComponent implements OnInit {

  url;
  datos;
  msgs;

  historico: boolean = false;
  progressSpinner: boolean = false;
  buscar: boolean = false; 

  permisoEscritura: any;

  @ViewChild(FiltrosSeriesFacturaComponent) filtros;

  constructor(
    private translateService: TranslateService
    //public sigaServices: OldSigaServices
    ) {
    // this.url = sigaServices.getOldSigaUrl("seriesFactura");
  }

  ngOnInit() {
    this.buscar = true; // cambiar
  }


  searchSeriesFacturas(event): void {

  }

  clear() {
    this.msgs = [];
  }

}
