import { Component, Input, OnInit } from '@angular/core';
import { FicherosAdeudosItem } from '../../../../../models/sjcs/FicherosAdeudosItem';

@Component({
  selector: 'app-cuenta-entidad-adeudos',
  templateUrl: './cuenta-entidad-adeudos.component.html',
  styleUrls: ['./cuenta-entidad-adeudos.component.scss']
})
export class CuentaEntidadAdeudosComponent implements OnInit {
  @Input() bodyInicial: FicherosAdeudosItem;

  body: FicherosAdeudosItem;

  constructor() { }

  ngOnInit() {
    if(this.body.idprogramacion!=undefined){
      this.cargaDatos();
    }
  }

  cargaDatos(){
    
  }
}