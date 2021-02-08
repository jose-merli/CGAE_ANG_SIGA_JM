import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarjeta-unidad-familiar',
  templateUrl: './tarjeta-unidad-familiar.component.html',
  styleUrls: ['./tarjeta-unidad-familiar.component.scss']
})
export class TarjetaUnidadFamiliarComponent implements OnInit {

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

  ngOnInit() {
  }

}
