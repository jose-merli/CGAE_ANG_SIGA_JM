import { Component, Input, OnInit } from '@angular/core';
import { FacturasItem } from '../../../../../models/FacturasItem';

@Component({
  selector: 'app-facturacion-facturas',
  templateUrl: './facturacion-facturas.component.html',
  styleUrls: ['./facturacion-facturas.component.scss']
})
export class FacturacionFacturasComponent implements OnInit {

  @Input() bodyInicial: FacturasItem;
  
  constructor() { }

  ngOnInit() {
  }

}
