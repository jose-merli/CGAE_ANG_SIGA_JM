import { Component, Input, OnInit } from '@angular/core';
import { FacturasItem } from '../../../../../models/FacturasItem';

@Component({
  selector: 'app-deudor-facturas',
  templateUrl: './deudor-facturas.component.html',
  styleUrls: ['./deudor-facturas.component.scss']
})
export class DeudorFacturasComponent implements OnInit {

  @Input() bodyInicial: FacturasItem;

  constructor() { }

  ngOnInit() {
  }

}
