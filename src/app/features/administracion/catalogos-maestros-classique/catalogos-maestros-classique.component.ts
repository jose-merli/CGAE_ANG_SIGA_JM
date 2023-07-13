import { Component } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service';

@Component({
  selector: 'app-catalogos-maestros-classique',
  templateUrl: './catalogos-maestros-classique.component.html',
  styleUrls: ['./catalogos-maestros-classique.component.scss']
})
export class CatalogosMaestrosComponent {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("catalogosMaestros");
  }

  ngOnInit() {
  }

}
