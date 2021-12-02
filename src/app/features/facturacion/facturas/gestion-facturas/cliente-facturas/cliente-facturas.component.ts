import { Component, Input, OnInit } from '@angular/core';
import { FacturasItem } from '../../../../../models/FacturasItem';

@Component({
  selector: 'app-cliente-facturas',
  templateUrl: './cliente-facturas.component.html',
  styleUrls: ['./cliente-facturas.component.scss']
})
export class ClienteFacturasComponent implements OnInit {

  @Input() bodyInicial: FacturasItem;
  
  constructor() { }

  ngOnInit() {
  }

}
