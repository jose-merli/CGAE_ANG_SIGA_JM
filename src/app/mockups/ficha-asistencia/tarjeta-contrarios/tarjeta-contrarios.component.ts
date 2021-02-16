import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-tarjeta-contrarios',
  templateUrl: './tarjeta-contrarios.component.html',
  styleUrls: ['./tarjeta-contrarios.component.scss']
})
export class TarjetaContrariosComponent implements OnInit {
  allSelected = false;
  isDisabled = true;
  msgs: Message[] = [];

  cabeceras = [
    {
      id: "id",
      name: "NIF"
    },
    {
      id: "apNom",
      name: "Apellidos, Nombre"
    },
    {
      id: "abogado",
      name: "Abogado"
    },
    {
      id: "procurador",
      name: "Procurador"
    }
  ];
  elementos = [
    ['78906743E', "DSGFDSG SDGSDG, ANA", "DSGSDGDS SDGSGSD, JESÚS", "DSGSDGDS SDGSGSD, JESÚS"],
    ['42906743E', "DSGFDSG SDGSDG, ROCÍO", "DSGSDGDS SDGSGSD, SUSANA", "DSGSDGDS SDGSGSD, SUSANA"]
  ];
  elementosAux = [
    ['78906743E', "DSGFDSG SDGSDG, ANA", "DSGSDGDS SDGSGSD, JESÚS", "DSGSDGDS SDGSGSD, JESÚS"],
    ['42906743E', "DSGFDSG SDGSDG, ROCÍO", "DSGSDGDS SDGSGSD, SUSANA", "DSGSDGDS SDGSGSD, SUSANA"]
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
