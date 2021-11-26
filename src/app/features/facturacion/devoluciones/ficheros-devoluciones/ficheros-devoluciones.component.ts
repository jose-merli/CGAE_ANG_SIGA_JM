import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/message';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-ficheros-devoluciones',
  templateUrl: './ficheros-devoluciones.component.html',
  styleUrls: ['./ficheros-devoluciones.component.scss'],

})
export class FicherosDevolucionesComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  constructor() {  }

  ngOnInit() {
  }

}
