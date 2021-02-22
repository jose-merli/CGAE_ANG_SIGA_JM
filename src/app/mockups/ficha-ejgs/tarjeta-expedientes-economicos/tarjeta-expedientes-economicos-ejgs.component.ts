import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarjeta-expedientes-economicos-ejgs',
  templateUrl: './tarjeta-expedientes-economicos-ejgs.component.html',
  styleUrls: ['./tarjeta-expedientes-economicos-ejgs.component.scss']
})
export class TarjetaExpedientesEconomicosEjgsComponent implements OnInit {

  cabeceras2 = [
    {
      id: "justiciable",
      name: "Justiciable"
    },
    {
      id: "solicitado",
      name: "Solicitado por"
    },
    {
      id: "fechaSolicitud",
      name: "Fecha Solicitud"
    },
    {
      id: "fechaRecepcion",
      name: "Fecha Recepción"
    },
    {
      id: "estado",
      name: "Estado"
    }
  ];

  elementos2 = [
    ["JAIME PASCUAL ANTONIA", "JAIME PASCUAL ANTONIA", "07/04/2017 13:37:40", "09/04/2017 15:37:40", "Pendiente Información"],
    ["JAIME PASCUAL ANTONIA", "JAIME PASCUAL ANTONIA", "07/04/2017 13:37:40", "09/04/2017 15:37:40", "Pendiente Información"],
    ["JAIME PASCUAL ANTONIA", "JAIME PASCUAL ANTONIA", "07/04/2017 13:37:40", "09/04/2017 15:37:40", "Pendiente Información"],
    ["JAIME PASCUAL ANTONIA", "JAIME PASCUAL ANTONIA", "07/04/2017 13:37:40", "09/04/2017 15:37:40", "Pendiente Información"]
  ];

  constructor() { }

  ngOnInit() {
  }

}
