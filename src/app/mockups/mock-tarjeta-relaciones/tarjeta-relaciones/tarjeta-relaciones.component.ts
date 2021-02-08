import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarjeta-relaciones',
  templateUrl: './tarjeta-relaciones.component.html',
  styleUrls: ['./tarjeta-relaciones.component.scss']
})
export class TarjetaRelacionesComponent implements OnInit {
  listaTarjetas = [
    {
      opened: false,
      nombre: "Relaciones",
      imagen: "",
      icono: 'fas fa-link',
      tipo: "detalle",
      fixed: false,
      detalle: true,
      campos: [
        {
          "key": "Número total de Relaciones",
          "value": "5"
        }
      ]
    }
  ];

  cabeceras = [
    {
      id: "nif",
      name: "NIF"
    },
    {
      id: "nombre",
      name: "Nombre"
    },
    {
      id: "apellidos",
      name: "Apellidos"
    },
    {
      id: "fechaAlta",
      name: "Fecha Alta"
    },
    {
      id: "cargos",
      name: "Cargos"
    },
    {
      id: "estado",
      name: "Estado"
    },
    {
      id: "participación",
      name: "Participación"
    }
  ];
  elementos = [
    ['78900234T', "VICTOR JAVIER", "SFSFSAF DSGSDGSG", "06/02/2019", "Administrador", "Ejerciente", ""],
    ['23768954R', "MARIA TERESA", "ASWDFASG RETGAEWRT", "08/02/2019", "Administrador", "Ejerciente", ""]
  ];
  elementosAux = [
    ['78900234T', "VICTOR JAVIER", "SFSFSAF DSGSDGSG", "06/02/2019", "Administrador", "Ejerciente", ""],
    ['23768954R', "MARIA TERESA", "ASWDFASG RETGAEWRT", "08/02/2019", "Administrador", "Ejerciente", ""]
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
