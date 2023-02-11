import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-zonas-subzonas-classique',
  templateUrl: './zonas-subzonas.component.html',
  styleUrls: ['./zonas-subzonas.component.scss'],

})
export class ZonasYSubzonasClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("zonasYsubzonas");
  }

  ngOnInit() {
  }




}
