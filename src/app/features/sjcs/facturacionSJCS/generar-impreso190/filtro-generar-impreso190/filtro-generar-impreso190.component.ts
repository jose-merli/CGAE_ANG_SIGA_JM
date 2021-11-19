import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filtro-generar-impreso190',
  templateUrl: './filtro-generar-impreso190.component.html',
  styleUrls: ['./filtro-generar-impreso190.component.scss']
})
export class FiltroGenerarImpreso190Component implements OnInit {

  showDatosGenerales: boolean = true;
  anio;
  anioPorDefecto = new Date().getFullYear();
  msgs = []
  @Output() getImpresos = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
    this.anio = this.anioPorDefecto;
  }

  restablecer(){
    this.anio = this.anioPorDefecto;
  }

  buscarImpresos(){
   
      this.getImpresos.emit(true);
 
  }

  onHideshowDatosGenerales(){
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  clear() {
		this.msgs = [];
	}
}
