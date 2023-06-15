import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'
import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-soj',
  templateUrl: './soj.component.html',
  styleUrls: ['./soj.component.scss'],

})
export class SOJComponent implements OnInit {

  url;
  progressSpinner: boolean = false;

  constructor(public oldSigaServices: OldSigaServices, private location: Location, private router: Router) {
      this.url = this.oldSigaServices.getOldSigaUrl('soj');
  }

  ngOnInit() {
    
  }

  backTo() {
    this.location.back();
  }

}
