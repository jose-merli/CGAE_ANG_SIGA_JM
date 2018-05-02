import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'

@Component({
  selector: 'app-configurar-perfil',
  templateUrl: './configurar-perfil.component.html',
  styleUrls: ['./configurar-perfil.component.scss']
})
export class ConfigurarPerfilComponent {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("configurarPerfil");
  }

  ngOnInit() {
  }

}
