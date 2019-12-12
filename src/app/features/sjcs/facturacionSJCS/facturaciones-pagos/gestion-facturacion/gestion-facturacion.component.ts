import { Component, OnInit } from '@angular/core';
import { USER_VALIDATIONS } from '../../../../../properties/val-properties';
import { SigaWrapper } from "../../../../../wrapper/wrapper.class";

@Component({
  selector: 'app-gestion-facturacion',
  templateUrl: './gestion-facturacion.component.html',
  styleUrls: ['./gestion-facturacion.component.scss']
})
export class GestionFacturacionComponent extends SigaWrapper implements OnInit {

  constructor() { 
    super(USER_VALIDATIONS);
  }

  ngOnInit() {
    
  }

}
