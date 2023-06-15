import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-devolucion-manual-classique',
  templateUrl: './devolucion-manual.component.html',
  styleUrls: ['./devolucion-manual.component.scss'],

})
export class DevolucionManualClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("devolucionManual");
  }

  ngOnInit() {
  }




}
