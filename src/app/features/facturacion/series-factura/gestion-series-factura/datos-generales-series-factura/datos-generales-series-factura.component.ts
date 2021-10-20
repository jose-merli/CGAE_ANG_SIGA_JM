import { Component, Input, OnInit } from '@angular/core';
import { SerieFacturacionItem } from '../../../../../models/SeriesFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';

@Component({
  selector: 'app-datos-generales-series-factura',
  templateUrl: './datos-generales-series-factura.component.html',
  styleUrls: ['./datos-generales-series-factura.component.scss']
})
export class DatosGeneralesSeriesFacturaComponent implements OnInit {

  @Input() datos: SerieFacturacionItem;
  @Input() tarjetaDatosGenerales: string;
  @Input() openTarjetaDatosGenerales;

  body: SerieFacturacionItem = new SerieFacturacionItem();

  comboFacturaciones = [];
  comboCuentasBancarias = [];
  comboTiposProductos = [];
  comboTiposServicios = [];
  comboSufijos = [];

  resaltadoDatosGenerales: boolean = false;
  resaltadoDatos: boolean = false;

  constructor(
    private commonsService: CommonsService
  ) { }

  ngOnInit() {

  }

  getCombos() {
    
  }

  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

}
