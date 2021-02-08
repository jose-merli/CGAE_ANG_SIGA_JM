import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ficha-certificacion',
  templateUrl: './ficha-certificacion.component.html',
  styleUrls: ['./ficha-certificacion.component.scss']
})
export class FichaCertificacionComponent implements OnInit {
  panelDatGenOpenState: boolean = false;
  panelFacOpenState: boolean = false;
  campos = [
    {
      nombre: "Periodo", 
      valor: "01/01/2019 - 31/03/2019"
    },
    {
      nombre: "Partida presupuestaria", 
      valor: "Generalitat 2019"
    }];
    inputs = [
      {
        nombre: "Nombre(*)", 
        valor: "Certificación primer trimestre de 2019"
      }];
  cabeceras = [
    {
      id: "fechaDesde", 
      name: "Fecha desde"
    },
    {
      id: "fechaHasta", 
      name: "Fecha hasta"
    },
    {
      id: "nombre", 
      name: "Nombre"
    },
    {
      id: "turno", 
      name: "Turno"
    },
    {
      id: "guardia", 
      name: "Guardia"
    },
    {
      id: "total", 
      name: "Total"
    },
    {
      id: "pendiente", 
      name: "Pendiente"
    },
    {
      id: "pagado", 
      name: "Pagado"
    },
    {
      id: "regul", 
      name: "Regul."
    }
];
elementos = [
    ['01/01/2019', "03/01/2019", "Facturación primer trimestre", "", "", "6.308.23", "1.105.20", "", "Si"],
    ['02/02/2019', "06/02/2019", "Facturación primer trimestre", "", "", "6.308.23", "1.105.20", "", "Si"]
  ];
  elementosAux = [
    ['01/01/2019', "03/01/2019", "Facturación primer trimestre", "", "", "6.308.23", "1.105.20", "", "Si"],
    ['02/02/2019', "06/02/2019", "Facturación primer trimestre", "", "", "6.308.23", "1.105.20", "", "Si"]
  ];

  cabeceras2 = [
    {
      id: "fechaEstado", 
      name: "Fecha de Estado"
    },
    {
      id: "proceso", 
      name: "Proceso"
    },
    {
      id: "estado", 
      name: "Estado"
    }
];

elementos2 = [
  ["01/01/2019 06:55", "Certificación","Enviado"],
  ["03/01/2019 06:55", "Certificación","Abierta"],
  ["04/01/2019 06:55", "Certificación","Validada"],
  ["05/01/2019 06:55", "Certificación","Validando"]
];
  constructor() { }

  ngOnInit(): void {
  }

}
