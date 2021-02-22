import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-tarjeta-unidad-familiar-ejgs',
  templateUrl: './tarjeta-unidad-familiar-ejgs.component.html',
  styleUrls: ['./tarjeta-unidad-familiar-ejgs.component.scss']
})
export class TarjetaUnidadFamiliarEjgsComponent implements OnInit {
  allSelected = false;
  isDisabled = true;
  msgs: Message[] = [];

  cabeceras = [
    {
      id: "identificador",
      name: "Identificador"
    },
    {
      id: "apellidosnombre",
      name: "Apellidos, Nombre"
    },
    {
      id: "direccion",
      name: "Dirección"
    },
    {
      id: "rol",
      name: "Rol"
    },
    {
      id: "relacionadocon",
      name: "Relacionado con"
    },
    {
      id: "parentesco",
      name: "Parentesco"
    },
    {
      id: "expedienteeconomico",
      name: "Expediente económico"
    }
  ];
  elementos = [
    ['78900234T', "SFSFSAF DSGSDGSG, VICTOR JAVIER", "C/ LA SERNA Nº 10", "SOLICITANTE", "BJXNVBWLZ RJJFJKM, PEDRO MARIA", "", 'No solicitado'],
    ['78900234T', "ASWDFASG RETGAEWRT, MARIA TERESA", "C/ LA SERNA Nº 10", "SOLICITANTE", "BJXNVBWLZ RJJFJKM, PEDRO MARIA", "", 'No solicitado'],
  ];
  elementosAux = [
    ['78900234T', "SFSFSAF DSGSDGSG, VICTOR JAVIER", "C/ LA SERNA Nº 10", "SOLICITANTE", "BJXNVBWLZ RJJFJKM, PEDRO MARIA", "", 'No solicitado'],
    ['78900234T', "ASWDFASG RETGAEWRT, MARIA TERESA", "C/ LA SERNA Nº 10", "SOLICITANTE", "BJXNVBWLZ RJJFJKM, PEDRO MARIA", "", 'No solicitado'],
  ];

  constructor() { }

  ngOnInit() {
  }
  selectedAll(event) {
    this.allSelected = event;
    this.isDisabled = !event;
  }
  notifyAnySelected(event) {
    if (this.allSelected || event) {
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
      detail,
    });
  }

  clear() {
    this.msgs = [];
  }

}
