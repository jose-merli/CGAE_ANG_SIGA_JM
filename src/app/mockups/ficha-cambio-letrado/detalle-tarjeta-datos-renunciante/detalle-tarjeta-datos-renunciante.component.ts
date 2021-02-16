import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-tarjeta-datos-renunciante',
  templateUrl: './detalle-tarjeta-datos-renunciante.component.html',
  styleUrls: ['./detalle-tarjeta-datos-renunciante.component.scss']
})
export class DetalleTarjetaDatosRenuncianteComponent implements OnInit {

  inputs = ['Número de colegiado', 'Apellidos', 'Nombre'];

  datePickers = ['Fecha Designación Colegial', 'Fecha Solicitud Renuncia', 'Fecha Efectiva Renuncia'];

  selector = {
    nombre: "Motivo renuncia",
    opciones: [
      { label: 'XXXXXXXXXXX', value: 1 },
      { label: 'XXXXXXXXXXX', value: 2 },
      { label: 'XXXXXXXXXXX', value: 3 },
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
