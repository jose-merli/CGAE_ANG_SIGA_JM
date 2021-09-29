import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'


@Component({
  selector: 'app-programacionCalendarios',
  templateUrl: './programacionCalendarios.component.html',
  styleUrls: ['./programacionCalendarios.component.scss'],

})
export class ProgramacionCalendariosComponent implements OnInit {

  url;

  constructor(public sigaServices: OldSigaServices) {
    this.url = sigaServices.getOldSigaUrl("programacionCalendarios");
  }

  ngOnInit() {
  }




}
