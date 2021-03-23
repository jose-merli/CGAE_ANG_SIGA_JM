import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-designaciones',
  templateUrl: './designaciones.component.html',
  styleUrls: ['./designaciones.component.scss'],

})
export class DesignacionesComponent implements OnInit {

  url;
  rutas = ['SJCS', 'Designaciones'];
  progressSpinner: boolean = false;
  msgs: Message[] = [];

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("designaciones");
  }

  ngOnInit() {
  }

  clear() {
    this.msgs = [];
  }

}
