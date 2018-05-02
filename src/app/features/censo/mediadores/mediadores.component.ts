import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'

@Component({
  selector: 'app-mediadores',
  templateUrl: './mediadores.component.html',
  styleUrls: ['./mediadores.component.scss']
})
export class MediadoresComponent {

  url;

  constructor(private sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("mediadores");
  }

  ngOnInit() {
  }

}
