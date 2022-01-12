import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BaremosGuardiaItem } from '../../../../../../models/sjcs/BaremosGuardiaItem';
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
  
  constructor(private router: Router) { }

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

  goToFichaBaremos(){
 
    sessionStorage.setItem("tarjetaBaremosFacturacion",this.idFacturacion);
 
    this.router.navigate(["/baremosDeGuardia"]);
 
 
   }
}
