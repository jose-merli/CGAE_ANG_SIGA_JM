import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { Input } from '@angular/core';
// import '../../../../SIGA.js'

declare var ajusteAlto: any;

@Component({
  selector: 'app-my-iframe',
  templateUrl: './my-iframe.component.html',
  styleUrls: ['./my-iframe.component.css']
})
export class MyIframeComponent implements OnInit {
  @Input() url;
  constructor(
    private domSanitizer: DomSanitizer) {

  }
  ngOnInit() {
    this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(this.url);
    ajusteAlto('mainWorkArea');

  }


}
