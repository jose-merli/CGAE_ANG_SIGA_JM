import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-tarjeta-relaciones-asistencia',
  templateUrl: './tarjeta-relaciones.component.html',
  styleUrls: ['./tarjeta-relaciones.component.scss']
})
export class TarjetaRelacionesAsistenciaComponent implements OnInit {
  allSelected = false;
  isDisabled = true;
  msgs: Message[] = [];

  cabeceras = [
    {
      id: "id",
      name: "Identificador"
    },
    {
      id: "fecha",
      name: "Fecha"
    },
    {
      id: "turnoGuardia",
      name: "Turno / Guardia"
    },
    {
      id: "letrado",
      name: "Letrado"
    },
    {
      id: "interesados",
      name: "Interesados"
    },
    {
      id: "datosInteres",
      name: "Datos Interés"
    }
  ];
  elementos = [
    ['78906743E', "10/08/2018", "XXXXXX", "DSGFDSG SDGSDG, ANA", "DSGSDGDS SDGSGSD, JESÚS", "YYYYY"],
    ['42906743E', "11/08/2018", "XXXXXX", "DSGFDSG SDGSDG, ROCÍO", "DSGSDGDS SDGSGSD, SUSANA", "YYYYY"]
  ];
  elementosAux = [
    ['78906743E', "10/08/2018", "XXXXXX", "DSGFDSG SDGSDG, ANA", "DSGSDGDS SDGSGSD, JESÚS", "YYYYY"],
    ['42906743E', "11/08/2018", "XXXXXX", "DSGFDSG SDGSDG, ROCÍO", "DSGSDGDS SDGSGSD, SUSANA", "YYYYY"]
  ];

  constructor() { }

  ngOnInit() {
  }
  selectedAll(event){
    this.allSelected = event;
    this.isDisabled = !event;
  }
  notifyAnySelected(event){
    if (this.allSelected || event){
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
