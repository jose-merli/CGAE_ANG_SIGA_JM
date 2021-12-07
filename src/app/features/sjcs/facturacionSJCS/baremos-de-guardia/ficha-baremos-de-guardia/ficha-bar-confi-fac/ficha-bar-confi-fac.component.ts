import { Component, EventEmitter, OnInit, Output, AfterViewInit, Input, ChangeDetectorRef } from '@angular/core';
import { Checkbox } from 'primeng/primeng';
import { BaremosGuardiaItem } from '../../../../../../models/sjcs/BaremosGuardiaItem';
import { Enlace } from '../ficha-baremos-de-guardia.component';

@Component({
  selector: 'app-ficha-bar-confi-fac',
  templateUrl: './ficha-bar-confi-fac.component.html',
  styleUrls: ['./ficha-bar-confi-fac.component.scss']
})
export class FichaBarConfiFacComponent implements OnInit, AfterViewInit {

  showTarjeta: boolean = true;
  filtrosDis:BaremosGuardiaItem = new BaremosGuardiaItem();
  filtrosAsAc:BaremosGuardiaItem = new BaremosGuardiaItem();
  disponibilidad:boolean = false;
  agruparDis:boolean = false;
  contAsiDis: boolean = false;
  contAcDis: boolean = false;
  asiac:boolean = false;
  agruparAsAc = false;
  contAsiAsAc: boolean = false;
  contAcAsAc: boolean = false;
  precioUnico:boolean = false;
  precioTipos: boolean = false;

  diasDis:String[]=[];
  diasAsiAct:String[]=[];

  checkAsAcL:boolean = false;
  checkDisL:boolean = false;

  checkAsAcM:boolean = false;
  checkDisM:boolean = false;

  checkAsAcX:boolean = false;
  checkDisX:boolean = false;

  checkAsAcJ:boolean = false;
  checkDisJ:boolean = false;

  checkAsAcV:boolean = false;
  checkDisV:boolean = false;

  checkAsAcS:boolean = false;
  checkDisS:boolean = false;

  checkAsAcD:boolean = false;
  checkDisD:boolean = false;

  @Output() addEnlace = new EventEmitter<Enlace>();
  @Input() datos;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

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
  onChangeDias(event,dia){
   switch (dia) {
     case 'L':
       if(this.checkDisL){
         this.checkDisL = false;
         this.checkAsAcL = true
       }else{
        this.checkDisL = true;
        this.checkAsAcL = false;
       }
       break;
       case 'M':
       this.checkAsAcM != this.checkDisM
       break;
       case 'X':
       this.checkAsAcX != this.checkDisX
       break;
       case 'J':
       this.checkAsAcJ != this.checkDisJ
       break;
       case 'V':
       this.checkAsAcV != this.checkDisV
       break;
       case 'S':
       this.checkAsAcS != this.checkDisS
       break;
       case 'D':
       this.checkAsAcD != this.checkDisD
       break;
       
   }
   this.changeDetectorRef.detectChanges();

    }
    
  

}
