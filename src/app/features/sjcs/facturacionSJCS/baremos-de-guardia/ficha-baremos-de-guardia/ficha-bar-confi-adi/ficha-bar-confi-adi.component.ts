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

  precio;
  filtrosAdi: BaremosGuardiaItem = new BaremosGuardiaItem();
  contAsi;
  contAsAc;
  facActuaciones: boolean = false;
  facAsuntosAntiguos: boolean = false;
  procesoFac2014: boolean = false;
  descontar: boolean = true;

  disableConfAdi: boolean = false;
  importeSOJ;
  importeEJG;

  @Output() addEnlace = new EventEmitter<Enlace>();
  @Input() datos
  showModal: boolean = false;
  origenBaremos = true;
  modalTipos = false;
  disPrecio: boolean = false;
  disableImput: boolean = false;

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

  changeContAsAc() {
    if (this.disableConfAdi) {
      this.contAsAc
      this.disPrecio = true;
    }

  }

  changePrecio() {
    if (this.disableConfAdi) {
      this.precio
      this.disableImput = true
      if (this.precio == 'porTipos') {
        this.modalTipos = true;
      } else {
        this.modalTipos = false;
      }
    }

  }
  onChangeFacActuaciones(event) {
    this.facActuaciones = event
    this.disableConfAdi = event
  }

  onChangeFacAsuntosAntiguos(event) {
    this.facAsuntosAntiguos = event
  }

  onChangeProcesoFac2014(event) {
    this.procesoFac2014 = event
  }

  onChangeDescontar(event) {
    this.descontar = event
  }

  irAtipos() {
    this.showModal = true;
  }
  cerrarDialog(){
    this.showModal = false;
  }

}
