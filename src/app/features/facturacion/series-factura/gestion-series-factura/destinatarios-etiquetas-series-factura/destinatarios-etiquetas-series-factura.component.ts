import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-destinatarios-etiquetas-series-factura',
  templateUrl: './destinatarios-etiquetas-series-factura.component.html',
  styleUrls: ['./destinatarios-etiquetas-series-factura.component.scss']
})
export class DestinatariosEtiquetasSeriesFacturaComponent implements OnInit {

  etiquetasSeleccionadas: any[];
  etiquetasNoSeleccionadas: any[];
  
  constructor() { }

  ngOnInit() {
    
  }

  esFichaActiva(): boolean {
    return true;// this.fichaPosible.activa;
  }

}
