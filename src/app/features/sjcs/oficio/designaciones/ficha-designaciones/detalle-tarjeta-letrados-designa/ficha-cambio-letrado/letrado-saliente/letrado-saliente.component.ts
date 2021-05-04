import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { SigaServices } from '../../../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { CommonsService } from '../../../../../../../../_services/commons.service';
import {CamposCambioLetradoItem } from '../../../../../../../../models/sjcs/CamposCambioLetradoItem';

@Component({
  selector: 'app-letrado-saliente',
  templateUrl: './letrado-saliente.component.html',
  styleUrls: ['./letrado-saliente.component.scss']
})
export class LetradoSalienteComponent implements OnInit {

  msgs: Message[] = [];
  body = new CamposCambioLetradoItem();
  datos;
  showTarjeta=true;
  progressSpinner = false;
  disableCheck=false;

  @Input() saliente;

  comboRenuncia;

  constructor(private sigaServices: SigaServices,
    private commonsService: CommonsService) { }

  ngOnInit() {

    this.body=this.saliente;
    /* this.body.fechaDesignacion;
    this.body.fechaEfecRenuncia=new Date();
    this.body.fechaSolRenuncia=new Date();
    this.body.numColegiado;
    this.body.apellido1Colegiado;
    this.body.apellido2Colegiado;
    this.body.nombreColegiado;
    this.body.compensacion = false;
    this.body.motivoRenuncia = false;
    this.body.observaciones=""; */

    this.body.fechaSolRenuncia = new Date();
    
    this.motivosRenuncia();

    if(sessionStorage.getItem("isLetrado")=="true") this.disableCheck=true;
  }

  motivosRenuncia() {
    this.progressSpinner = true;

    this.sigaServices.get("designaciones_motivosRenuncia").subscribe(
      n => {
        this.comboRenuncia = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboRenuncia);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  incluirCompensacion(){
  }

  changeMotivo(event){
  }

  onHideTarjeta(){
    this.showTarjeta=!this.showTarjeta;
  }

  clear() {
    this.msgs=[];
  }

  fillFechaDesignacion(event){}

  fillFechaSolRenuncia(event){}
}
