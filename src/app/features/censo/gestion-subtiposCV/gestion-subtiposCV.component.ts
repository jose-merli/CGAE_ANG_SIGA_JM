import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'

@Component({
  selector: 'app-gestion-subtiposCV',
  templateUrl: './gestion-subtiposCV.component.html',
  styleUrls: ['./gestion-subtiposCV.component.scss']
})
export class GestionSubtiposCVComponent {

  url;

  constructor(private sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("gestionSubtiposCV");
  }

  ngOnInit() {
  }

}
