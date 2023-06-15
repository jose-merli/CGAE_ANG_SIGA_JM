import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-mantenimiento-procuradores-classique',
  templateUrl: './mantenimiento-procuradores.component.html',
  styleUrls: ['./mantenimiento-procuradores.component.scss'],

})
export class MantenimientoProcuradoresClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("mantenimientoprocuradores");
  }

  ngOnInit() {
  }




}
