import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
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
  iconClass;
  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this.iconClass = `fas fa-${this.icono} icon-ficha`;
  }
  goTop(){
    document.children[document.children.length -1]
     let top = document.getElementById("top");
     if (top) {
         top.scrollIntoView();
         top = null;
     }

  }
  goDown(){
    let down= document.getElementById("down");
        if (down) {
      down.scrollIntoView();
      down= null;
        }
  }
  goToCard(enlace){
     if (enlace) {
      //let pos = enlace.pageYOffset;
     // enlace.scrollTo(0, pos - 100); 
    // let pos = enlace.scrollTop;
   enlace.scrollIntoView({block: "start", behavior: 'smooth'});
   // window.parent.scrollBy(0, enlace.offsetTop+300);
  //  parent.window.scrollBy(0, enlace.offsetTop+300);
   // enlace.scrollBy(0, 200);
   // this.windowPatern.scrollTo(0, enlace.offsetTop+300);
    enlace= null;
    }
  }

}
