import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ficha-compra-suscripcion',
  templateUrl: './ficha-compra-suscripcion.component.html',
  styleUrls: ['./ficha-compra-suscripcion.component.scss']
})
export class FichaCompraSuscripcionComponent implements OnInit {

  progressSpinner: boolean = false;

  ficha;



  constructor(private location: Location) { }

  ngOnInit() {
    
  }

  backTo(){
    this.location.back();
  }
}
