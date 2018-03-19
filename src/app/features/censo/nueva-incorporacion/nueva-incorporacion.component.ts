import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service';



@Component({
  selector: 'app-nueva-incorporacion',
  templateUrl: './nueva-incorporacion.component.html',
  styleUrls: ['./nueva-incorporacion.component.scss']
})
export class NuevaIncorporacionComponent {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("nuevaIncorporacion");
  }

  ngOnInit() {
  }

}
