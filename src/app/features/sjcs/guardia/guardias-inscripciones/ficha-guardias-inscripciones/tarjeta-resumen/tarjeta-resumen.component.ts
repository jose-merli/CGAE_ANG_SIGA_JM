import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output  } from '@angular/core';
import { isProtractorLocator } from 'protractor/built/locators';
import { getParentRenderElement } from '@angular/core/src/view/util';


@Component({
  selector: 'app-tarjeta-resumen',
  templateUrl: './tarjeta-resumen.component.html',
  styleUrls: ['./tarjeta-resumen.component.scss']
})
export class TarjetaResumenComponent implements OnInit {

  @Input() chincheta = false;
  @Input() icono; // = 'fas fa-clipboard';
  @Input() titulo;
  @Input() datos;
  @Input() enlaces;
  @Input() manuallyOpened;
  @Output() isOpen = new EventEmitter<any>();
  iconClass;
  enlaceAnterior:any[];

  constructor() { }

  ngOnInit() {
    this.iconClass = `fas fa-${this.icono} icon-ficha`;
    this.enlaceAnterior = [];
  }

  goTop() {
    document.children[document.children.length - 1]
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }

  }
  goDown() {
    let down = document.getElementById("down");
    if (down) {
      down.scrollIntoView();
      down = null;
    }
  }
  goToCard(enlace, nombre) {
    let findDato; // Comprobar si estoy pulsando el mismo enlace que pulsé por primera vez

   
    if(this.enlaceAnterior != undefined && this.enlaceAnterior.length > 0){
     this.enlaceAnterior.forEach(element => {
       if(element == enlace.id){
         findDato = element;
       }
     });
    }
    
    //if(findDato == undefined){
      enlace.scrollIntoView({ block: "center", behavior: 'smooth',inline: "start" });
      this.isOpen.emit(nombre);
      this.enlaceAnterior = [];
      this.enlaceAnterior.push(enlace.id);
    //}
    
  }
}

  