import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-programacionCalendarios-classique',
  templateUrl: './programacionCalendarios.component.html',
  styleUrls: ['./programacionCalendarios.component.scss'],

})
export class ProgramacionCalendariosClassiqueComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("programacionCalendarios");
  }

  ngOnInit() {
  }




}
