import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { isProtractorLocator } from 'protractor/built/locators';
import { getParentRenderElement } from '@angular/core/src/view/util';
import { TranslateService } from '../translate/translation.service';

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
  @Input() enlaces;
  @Input() manuallyOpened;
  @Output() isOpen = new EventEmitter<any>();

  iconClass;
  checkTitulo;
  enlaceAnterior:any[];
  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this.iconClass = `fas fa-${this.icono} icon-ficha`;
    this.enlaceAnterior = [];
    this.checkTitulo = this.titulo;
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
    if(enlace != null){
      //enlace.scrollIntoView({ block: "center", behavior: 'smooth',inline: "start" });
      enlace.scrollIntoView();
    }else{
      // Si no tenemos el elemneto lo buscamos por su nombre
      let element = document.getElementById(nombre);
      if (element != null){
        element.scrollIntoView();
      }
    }
    this.isOpen.emit(nombre);
    this.enlaceAnterior = [];
    this.enlaceAnterior.push(enlace.id);
  }
}
