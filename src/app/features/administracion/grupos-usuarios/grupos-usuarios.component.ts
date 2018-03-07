import { Component, OnInit } from '@angular/core';
import { SigaServices } from '../../../_services/siga.service'

@Component({
  selector: 'app-grupos-usuarios',
  templateUrl: './grupos-usuarios.component.html',
  styleUrls: ['./grupos-usuarios.component.scss']
})
export class GruposUsuarios implements OnInit {

  constructor(private service: SigaServices) { }

  ngOnInit() {
  }

  callService() {
    this.service.get("db").subscribe();
  }

}
