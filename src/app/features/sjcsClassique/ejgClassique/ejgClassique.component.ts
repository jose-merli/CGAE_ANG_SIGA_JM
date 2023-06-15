import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'


@Component({
  selector: 'app-ejg-Classique',
  templateUrl: './ejgClassique.component.html',
  styleUrls: ['./ejgClassique.component.scss'],

})
export class EJGClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("ejg");
  }

  ngOnInit() {
  }




}
