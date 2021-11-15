import { Component, EventEmitter, OnInit, Output, AfterViewInit } from '@angular/core';
import { Enlace } from '../ficha-baremos-de-guardia.component';

@Component({
  selector: 'app-ficha-bar-confi-adi',
  templateUrl: './ficha-bar-confi-adi.component.html',
  styleUrls: ['./ficha-bar-confi-adi.component.scss']
})
export class FichaBarConfiAdiComponent implements OnInit, AfterViewInit {

  showTarjeta: boolean = false;

  @Output() addEnlace = new EventEmitter<Enlace>();

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    const enlace: Enlace = {
      id: 'facSJCSFichaBarConfiAdi',
      ref: document.getElementById('facSJCSFichaBarConfiAdi')
    };

    this.addEnlace.emit(enlace);
  }

  onHideTarjeta() {
    // if (this.retencionesService.modoEdicion) {
    this.showTarjeta = !this.showTarjeta;
    // } else {
    //   this.showTarjeta = true;
    // }
  }

}
