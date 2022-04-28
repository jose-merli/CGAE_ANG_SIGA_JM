import { Component, EventEmitter, OnInit, Output, AfterViewInit, Input, ChangeDetectorRef,ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/primeng';
import { BaremosGuardiaItem } from '../../../../../../models/sjcs/BaremosGuardiaItem';
import { Enlace } from '../ficha-baremos-de-guardia.component';

@Component({
  selector: 'app-ficha-bar-confi-fac',
  templateUrl: './ficha-bar-confi-fac.component.html',
  styleUrls: ['./ficha-bar-confi-fac.component.scss']
})
export class FichaBarConfiFacComponent implements OnInit, AfterViewInit {

  showTarjeta: boolean = true;
  filtrosDis: BaremosGuardiaItem = new BaremosGuardiaItem();
  filtrosAsAc: BaremosGuardiaItem = new BaremosGuardiaItem();
  disponibilidad: boolean = false;
  agruparDis: boolean = false;
  contDis;
  asiac: boolean = false;
  agruparAsAc:boolean = false;
  contAsAc;
  precio

  diasDis: String[] = [];
  //diasAsiAct:String[]=[];
  checkAsAcL: boolean = false;
  checkDisL: boolean = true;

  checkAsAcM: boolean = false;
  checkDisM: boolean = true;

  checkAsAcX: boolean = false;
  checkDisX: boolean = true;

  checkAsAcJ: boolean = false;
  checkDisJ: boolean = true;

  checkAsAcV: boolean = false;
  checkDisV: boolean = true;

  checkAsAcS: boolean = false;
  checkDisS: boolean = true;

  checkAsAcD: boolean = false;
  checkDisD: boolean = true;

  disableDis: boolean = false;
  disableAsAc: boolean = false;
  disableImputDis: boolean = false;
  disableImputAct: boolean = false;
  displayBoolean: boolean = false;
  url;
  origenBaremos = true;
  modalTipos = false;
  disPrecio = false;


  @Output() addEnlace = new EventEmitter<Enlace>();
  @Input() datos;
  @Output() disProc2014 = new EventEmitter<boolean>();
  @Input() permisoEscritura: boolean = false;
  showModal: boolean = false;

  @ViewChild("op")
  op: OverlayPanel;

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
    //this.showTarjeta = !this.showTarjeta;
    // } else {
    //   this.showTarjeta = true;
    // }

    this.showTarjeta ? this.showTarjeta = false : this.showTarjeta = true;
  }
  
  onChangeDiasDis(event, dia) {
    switch (dia) {
      case 'L':
        this.checkDisL = event;
        this.checkAsAcL = !event
        break;
      case 'M':
        this.checkDisM = event;
        this.checkAsAcM = !event
        break;
      case 'X':
        this.checkDisX = event;
        this.checkAsAcX = !event
        break;
      case 'J':
        this.checkDisJ = event;
        this.checkAsAcJ = !event
        break;
      case 'V':
        this.checkDisV = event;
        this.checkAsAcV = !event
        break;
      case 'S':
        this.checkDisS = event;
        this.checkAsAcS = !event
        break;
      case 'D':
        this.checkDisD = event;
        this.checkAsAcD = !event
        break;

    }

  }

  onChangeDiasAsAc(event, dia) {
    switch (dia) {
      case 'L':
        this.checkDisL = !event;
        this.checkAsAcL = event
        break;
      case 'M':
        this.checkDisM = !event;
        this.checkAsAcM = event
        break;
      case 'X':
        this.checkDisX = !event;
        this.checkAsAcX = event
        break;
      case 'J':
        this.checkDisJ = !event;
        this.checkAsAcJ = event
        break;
      case 'V':
        this.checkDisV = !event;
        this.checkAsAcV = event
        break;
      case 'S':
        this.checkDisS = !event;
        this.checkAsAcS = event
        break;
      case 'D':
        this.checkDisD = !event;
        this.checkAsAcD = event
        break;
    }
  }

  changePrecio() {
    if (this.disableAsAc) {
      this.precio
      this.disableImputAct = true
      if (this.precio == 'porTipos') {
        this.modalTipos = true;
      } else {
        this.modalTipos = false;
      }
    }

  }

  changeContAsAc() {
    if (this.disableAsAc) {
      this.contAsAc
      this.disPrecio = true;
    }

  }

  changeContDis() {
    if (this.disableDis) {
      this.contDis
      this.disableImputDis = true;

    }

  }

  onChangeDisponibilidad(event) {
    this.disableDis = event
    this.disponibilidad = event
    if (!this.disableDis) {
      this.disableImputDis = false;
    }
  }

  onChangeAsAc(event) {
    this.disableAsAc = event;
    this.asiac = event
    if (!this.disableAsAc) {
      this.disableImputAct = false;
    }
  }

  onChangeAgruparDis(event) {
    if (event) {
      this.agruparDis = true
    } else {
      this.agruparDis = false
    }
  }
  onChangeAgruparAsAc(event) {
    if (event) {
      this.agruparAsAc = false
    } else {
      this.agruparAsAc = true
    }

  }

  irAtipos(event) {
    if(this.contAsAc== 'asi' || this.contAsAc== 'act'){
      this.showModal = true;
      this.op.toggle(event);
    }
  }

  cerrarDialog() {
    this.showModal = false;
  }

  onChangeMinimo(value){
    if((value != null || value != undefined) && this.contDis == 'asi' && this.disponibilidad == true){
     this.disProc2014.emit(true)
    }
  }

  hideOverlay(event) {
    this.displayBoolean = false;
  }
  



}
