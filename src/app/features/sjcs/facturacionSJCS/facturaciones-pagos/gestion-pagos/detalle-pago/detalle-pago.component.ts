import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-detalle-pago',
  templateUrl: './detalle-pago.component.html',
  styleUrls: ['./detalle-pago.component.scss']
})
export class DetallePagoComponent implements OnInit {
  numPagos: number = 0;

  @ViewChild("tabla") tabla;
  
  @Input() permisos;
  
  constructor() { }

  ngOnInit() {
  }

}
