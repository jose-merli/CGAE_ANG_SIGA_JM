import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'

@Component({
  selector: 'app-censo-documentacion',
  templateUrl: './censo-documentacion.component.html',
  styleUrls: ['./censo-documentacion.component.scss']
})
export class CensoDocumentacionComponent {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("censoDocumentacion");
  }

  ngOnInit() {
  }

}
