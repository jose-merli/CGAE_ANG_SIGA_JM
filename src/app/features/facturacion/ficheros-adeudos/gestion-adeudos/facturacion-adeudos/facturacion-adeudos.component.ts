import { Component, Input, OnInit } from '@angular/core';
import { FicherosAdeudosItem } from '../../../../../models/sjcs/FicherosAdeudosItem';

@Component({
  selector: 'app-facturacion-adeudos',
  templateUrl: './facturacion-adeudos.component.html',
  styleUrls: ['./facturacion-adeudos.component.scss']
})

export class FacturacionAdeudosComponent implements OnInit {

  @Input() bodyInicial: FicherosAdeudosItem;

  body: FicherosAdeudosItem;
  
  constructor() { }

  ngOnInit() {
    this.body =  JSON.parse(JSON.stringify(this.bodyInicial));

    if(this.body.idprogramacion!=undefined){
      this.cargaDatos();
    }
  }

  cargaDatos(){

  }//hacer cuando este listo la pantalla de facturaciones
}
