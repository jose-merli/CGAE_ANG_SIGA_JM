import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sustituciones-gestion-guardia-colegiado',
  templateUrl: './sustituciones-gestion-guardia-colegiado.component.html',
  styleUrls: ['./sustituciones-gestion-guardia-colegiado.component.scss']
})
export class SustitucionesGestionGuardiaColegiadoComponent implements OnInit {

  progressSpinner;
  msgs
  body;
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  constructor() { }

  ngOnInit() {
  }

  clear(){

  }
  sustituir(){

  }

  fillFechaApertura(event){
    
  }

  changeColegiado(event){}
  onChangeCheckSalto(event){}
  onChangeCheckCompensacion(event){}

}
