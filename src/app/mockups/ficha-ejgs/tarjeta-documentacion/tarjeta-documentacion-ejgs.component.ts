import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'primeng/components/common/api';


@Component({
  selector: 'app-tarjeta-documentacion-ejgs',
  templateUrl: './tarjeta-documentacion-ejgs.component.html',
  styleUrls: ['./tarjeta-documentacion-ejgs.component.scss']
})
export class TarjetaDocumentacionEjgsComponent implements OnInit {
  msgs: Message[] = [];
  constructor() { }
  allSelected = false;
  isDisabled = true;
  cabeceras = [
    {
      id: "fechPre",
      name: "Fecha lim.Presentación"
    },
    {
      id: "presentador",
      name: "Presentador"
    },
    {
      id: "documento",
      name: "Documento"
    },
    {
      id: "regEntrada",
      name: "Registro entrada"
    },
    {
      id: "regSalida",
      name: "Registro salida"
    },
    {
      id: "fechPresentacion",
      name: "Fecha de presentación"
    },
    {
      id: "propietario",
      name: "Propietario"
    }
  ];
  elementos = [
    ['06/02/2019', "GÓMEZ ADASDF, VICTOR JAVIER (SOLICITANTE)", "SFSFSAF", "3242dfg", "89gfhgf", "09/02/2019", "DFGDFH DFHFDH, ÁLVARO"],
    ['08/02/2019', "DÍAZ SDFSDGF, MARIA TERESA (SOLICITANTE)", "ASWDFASG", "6742dhui", "23dfgdfg", "05/02/2019", "SDFSDF GDSDGGS, SUSANA"]
  ];
  elementosAux = [
    ['06/02/2019', "GÓMEZ ADASDF, VICTOR JAVIER (SOLICITANTE)", "SFSFSAF", "3242dfg", "89gfhgf", "09/02/2019", "DFGDFH DFHFDH, ÁLVARO"],
    ['08/02/2019', "DÍAZ SDFSDGF, MARIA TERESA (SOLICITANTE)", "ASWDFASG", "6742dhui", "23dfgdfg", "05/02/2019", "SDFSDF GDSDGGS, SUSANA"]
  ];
  ngOnInit(): void {
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
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

}
