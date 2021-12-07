import { Component, EventEmitter, OnInit, Output, AfterViewInit, Input } from '@angular/core';
import { BaremosGuardiaItem } from '../../../../../../models/sjcs/BaremosGuardiaItem';
import { Enlace } from '../ficha-baremos-de-guardia.component';

@Component({
  selector: 'app-ficha-bar-confi-adi',
  templateUrl: './ficha-bar-confi-adi.component.html',
  styleUrls: ['./ficha-bar-confi-adi.component.scss']
})
export class FichaBarConfiAdiComponent implements OnInit, AfterViewInit {

  showTarjeta: boolean = true;

  precioUnico:boolean = false;
  precioTipos: boolean = false;
  filtrosAdi:BaremosGuardiaItem = new BaremosGuardiaItem();
  contAsi : boolean = false;
  contAc : boolean = false;

  @Output() addEnlace = new EventEmitter<Enlace>();
  @Input() datos

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
