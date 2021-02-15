import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-tarjeta-historico-ficha-actuacion',
  templateUrl: './detalle-tarjeta-historico-ficha-actuacion.component.html',
  styleUrls: ['./detalle-tarjeta-historico-ficha-actuacion.component.scss']
})
export class DetalleTarjetaHistoricoFichaActuacionComponent implements OnInit {

  cabeceras = [
    {
      id: "fechajustificacion",
      name: "Fecha Justificación"
    },
    {
      id: "accion",
      name: "Acción"
    },
    {
      id: "usuario",
      name: "Usuario"
    },
    {
      id: "observaciones",
      name: "Observaciones"
    },
  ];

  elementos = [
    ['28/10/2009', "Validar", "IFJSFHJ FDSFSDJ, ANTONIO", ""],
    ['28/10/2009', "Justificar", "IRGREERGSD BFRGER, MARIA ROSA", ""],
    ['28/10/2009', "Crear", "FGFTFY GHGHG, DAVID", ""],
  ];

  elementosAux = [
    ['28/10/2009', "Validar", "IFJSFHJ FDSFSDJ, ANTONIO", ""],
    ['28/10/2009', "Justificar", "IRGREERGSD BFRGER, MARIA ROSA", ""],
    ['28/10/2009', "Crear", "FGFTFY GHGHG, DAVID", ""],
  ];

  constructor() { }

  ngOnInit() {
  }

}
