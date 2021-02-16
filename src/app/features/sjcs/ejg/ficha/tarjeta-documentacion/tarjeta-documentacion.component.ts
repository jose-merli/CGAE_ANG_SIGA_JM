import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'primeng/components/common/api';


@Component({
  selector: 'app-tarjeta-documentacion',
  templateUrl: './tarjeta-documentacion.component.html',
  styleUrls: ['./tarjeta-documentacion.component.scss']
})
export class TarjetaDocumentacionComponent implements OnInit {
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
    ['06/02/2019', "VICTOR JAVIER GÓMEZ ADASDF", "SFSFSAF", "3242dfg", "89gfhgf", "09/02/2019", "ÁLVARO DFGDFH DFHFDH"],
    ['08/02/2019', "MARIA TERESA DÍAZ SDFSDGF", "ASWDFASG", "6742dhui", "23dfgdfg", "05/02/2019", "SUSANA SDFSDF GDSDGGS"]
  ];
  elementosAux = [
    ['06/02/2019', "VICTOR JAVIER GÓMEZ ADASDF", "SFSFSAF", "3242dfg", "89gfhgf", "09/02/2019", "ÁLVARO DFGDFH DFHFDH"],
    ['08/02/2019', "MARIA TERESA DÍAZ SDFSDGF", "ASWDFASG", "6742dhui", "23dfgdfg", "05/02/2019", "SUSANA SDFSDF GDSDGGS"]
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
