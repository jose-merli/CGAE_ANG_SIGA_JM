import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-tarjeta-gestion-ficha-actuacion-ofico',
  templateUrl: './detalle-tarjeta-gestion-ficha-actuacion-ofico.component.html',
  styleUrls: ['./detalle-tarjeta-gestion-ficha-actuacion-ofico.component.scss']
})
export class DetalleTarjetaGestionFichaActuacionOficoComponent implements OnInit {

  opcionesDropdown = [
    {
      label: 10,
      value: 10
    },
    {
      label: 20,
      value: 20
    },
    {
      label: 30,
      value: 30
    },
    {
      label: 40,
      value: 40
    }
  ];

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
