import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarjeta-documentacion',
  templateUrl: './tarjeta-documentacion.component.html',
  styleUrls: ['./tarjeta-documentacion.component.scss']
})
export class TarjetaDocumentacionComponent implements OnInit {

  constructor() { }
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
    ['78900234T', "VICTOR JAVIER", "SFSFSAF DSGSDGSG", "06/02/2019", "Administrador", "Ejerciente", "0"],
    ['23768954R', "MARIA TERESA", "ASWDFASG RETGAEWRT", "08/02/2019", "Administrador", "Ejerciente", "0"]
  ];
  elementosAux = [
    ['78900234T', "VICTOR JAVIER", "SFSFSAF DSGSDGSG", "06/02/2019", "Administrador", "Ejerciente", "0"],
    ['23768954R', "MARIA TERESA", "ASWDFASG RETGAEWRT", "08/02/2019", "Administrador", "Ejerciente", "0"]
  ];
  ngOnInit(): void {
  }

}
