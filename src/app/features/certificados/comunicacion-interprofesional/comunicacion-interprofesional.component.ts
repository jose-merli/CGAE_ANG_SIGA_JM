import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service';


@Component({
  selector: 'app-comunicacion-interprofesional',
  templateUrl: './comunicacion-interprofesional.component.html',
  styleUrls: ['./comunicacion-interprofesional.component.scss'],

})
export class ComunicacionInterprofesionalComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("comunicacionInterprofesional");
  }

  ngOnInit() {
  }




}
