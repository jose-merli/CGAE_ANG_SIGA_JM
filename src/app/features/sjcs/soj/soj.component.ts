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

    this.progressSpinner = true;
    if (sessionStorage.getItem('reload') == 'si') {

      this.url = oldSigaServices.getOldSigaUrl('soj');

      sessionStorage.removeItem('reload');
      sessionStorage.setItem('reload', 'no');
      setTimeout(() => {
        this.url = JSON.parse(sessionStorage.getItem('url'));
        document.getElementById('noViewContent').className = 'mainFrameWrapper2';
        document.getElementById('noViewContent').className = 'mainFrameWrapper2';
        this.router.navigate(['/soj']);
      }, 2000);
    } else {

      this.url = JSON.parse(sessionStorage.getItem('url'));
      sessionStorage.removeItem('url');
      setTimeout(() => {
        this.url = JSON.parse(sessionStorage.getItem('url'));
        document.getElementById('noViewContent').className = 'mainFrameWrapper';
        this.progressSpinner = false;
      }, 2000);
    }

  }

  ngOnInit() {
  }

  backTo() {
    this.location.back();
  }

}
