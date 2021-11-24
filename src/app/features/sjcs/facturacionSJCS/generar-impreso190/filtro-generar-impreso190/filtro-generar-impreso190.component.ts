import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { KEY_CODE } from '../../../../../commons/login-develop/login-develop.component';

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
  @Input() permisoEscritura;
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

  //búsqueda con enter
	@HostListener("document:keypress", ["$event"])
	onKeyPress(event: KeyboardEvent) {
		if (event.keyCode === KEY_CODE.ENTER) {
			this.buscarImpresos();
		}
	}
}
