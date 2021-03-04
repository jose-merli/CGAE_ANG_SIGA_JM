import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';


@Component({
  selector: 'app-ficha-certificacion',
  templateUrl: './ficha-certificacion.component.html',
  styleUrls: ['./ficha-certificacion.component.scss']
})
export class FichaCertificacionComponent implements OnInit {

  panelDatGenOpenState: boolean = true;
  isDisabled = true;
  panelFacOpenState: boolean = true;
  msgs: Message[] = [];
  tarjetaFija = null;
  rutas = null;
  listaTarjetas = [
    {
      id: 'pantFichaCertiDatGen',
      nombre: "Datos Generales",
      imagen: "",
      icono: 'far fa-address-book',
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    },
    {
      id: 'pantFichaCertiFactura',
      nombre: "Facturaciones",
      imagen: "",
      icono: 'far fa-address-book',
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    }
  ];

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
    ["01/01/2019 06:55", "Certificación", "Enviado"],
    ["03/01/2019 06:55", "Certificación", "Abierta"],
    ["04/01/2019 06:55", "Certificación", "Validada"],
    ["05/01/2019 06:55", "Certificación", "Validando"]
  ];
  constructor() { }

  ngOnInit(): void {
  }

  notifyAnySelected(event){
    if (event){
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }


  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

}
