import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { isProtractorLocator } from 'protractor/built/locators';
import { getParentRenderElement } from '@angular/core/src/view/util';

@Component({
  selector: 'app-tarjeta-resumen-fija',
  templateUrl: './tarjeta-resumen-fija.component.html',
  styleUrls: ['./tarjeta-resumen-fija.component.scss']
})
export class TarjetaResumenFijaComponent implements OnInit {

  @Input() chincheta = false;
  @Input() icono = "cog";
  @Input() titulo;
  @Input() datos;
  iconClass;
  constructor() { }

  ngOnInit() {
    this.iconClass = `fas fa-${this.icono} icon-ficha`;
  }
  goTop(){
    document.children[document.children.length -1]
     let top = document.getElementById("top");
     if (top !== null) {
         top.scrollIntoView();
         top = null;
     }

  }
  goDown(){
    let down= document.getElementById("down");
        if (down!== null) {
      down.scrollIntoView();
      down= null;
        }
  }

}
