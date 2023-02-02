import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-gestion-cuentas-bancarias',
  templateUrl: './gestion-cuentas-bancarias.component.html',
  styleUrls: ['./gestion-cuentas-bancarias.component.scss'],

})
export class GestionCuentasBancariasComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("gestionCuentasBancarias");
  }

  ngOnInit() {
  }




}
