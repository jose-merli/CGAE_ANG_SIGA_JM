import { Component, Input, OnInit } from '@angular/core';
import { FicherosAdeudosItem } from '../../../../../models/sjcs/FicherosAdeudosItem';

@Component({
  selector: 'app-facturacion-adeudos',
  templateUrl: './facturacion-adeudos.component.html',
  styleUrls: ['./facturacion-adeudos.component.scss']
})

export class FacturacionAdeudosComponent implements OnInit {

  @Input() bodyInicial: FicherosAdeudosItem;

  body: FicherosAdeudosItem;
  
  constructor() { }

  ngOnInit() {
    this.body =  JSON.parse(JSON.stringify(this.bodyInicial));
  }

  ir(){
  //   sessionStorage.setItem("idInstitucionFichaColegial", idInstitucion.toString());
  //   this.router.navigate(["/turnoOficioCenso"]);
  }
}
