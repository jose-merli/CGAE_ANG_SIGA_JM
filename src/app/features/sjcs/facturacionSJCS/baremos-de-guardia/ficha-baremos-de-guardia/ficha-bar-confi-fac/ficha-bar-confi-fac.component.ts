import { Component, EventEmitter, OnInit, Output, AfterViewInit, Input } from '@angular/core';
import { Checkbox } from 'primeng/primeng';
import { Enlace } from '../ficha-baremos-de-guardia.component';

@Component({
  selector: 'app-ficha-bar-confi-fac',
  templateUrl: './ficha-bar-confi-fac.component.html',
  styleUrls: ['./ficha-bar-confi-fac.component.scss']
})
export class FichaBarConfiFacComponent implements OnInit, AfterViewInit {

  showTarjeta: boolean = true;
  diasDis:String[]=[];
  diasAsiAct:String[]=[];

  @Output() addEnlace = new EventEmitter<Enlace>();
  @Input() datos;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    const enlace: Enlace = {
      id: 'facSJCSFichaBarConfiFac',
      ref: document.getElementById('facSJCSFichaBarConfiFac')
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
  onChangeDias(event,id){
    let check = document.getElementsByName(id);

    let checkDis = check[1];
    let checkAsAc =check[3];
    
    
      if(checkDis.getAttribute('checked') == 'true'){
        checkDis.setAttribute('checked','false');
        checkAsAc.setAttribute('checked','true');
      }else if(checkAsAc.getAttribute('checked') == 'true'){
        checkDis.setAttribute('checked','true');
        checkAsAc.setAttribute('checked','false');
      }else if(checkDis.getAttribute('checked') == 'false'){
        checkDis.setAttribute('checked','true');
        checkAsAc.setAttribute('checked','false');
      }else if(checkAsAc.getAttribute('checked') == 'false'){
        checkDis.setAttribute('checked','false');
        checkAsAc.setAttribute('checked','true');
      }
    }
    
  

}
