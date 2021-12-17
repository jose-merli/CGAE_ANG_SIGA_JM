import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Enlace } from '../gestion-facturacion.component'

@Component({
  selector: 'app-baremos',
  templateUrl: './baremos.component.html',
  styleUrls: ['./baremos.component.scss']
})
export class BaremosComponent implements OnInit, AfterViewInit {
  progressSpinnerBaremos: boolean = false;

  @Input() idFacturacion;
  @Input() idEstadoFacturacion;
  @Output() addEnlace = new EventEmitter<Enlace>();
  
  constructor() { }

  ngOnInit() { 
    this.progressSpinnerBaremos=false;
  }

  disableEnlaceBaremos(){
    if(this.idEstadoFacturacion=='30' || this.idEstadoFacturacion=='20'){
      return false;
    }else{
      return true;
    }
  }

  ngAfterViewInit() {

    const enlace: Enlace = {
      id: 'facSJCSFichaFactBaremosFac',
      ref: document.getElementById('facSJCSFichaFactBaremosFac')
    };

    this.addEnlace.emit(enlace);
  }
}
