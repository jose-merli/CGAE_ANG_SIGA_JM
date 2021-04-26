import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { SigaServices } from '../../../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-letrado-entrante',
  templateUrl: './letrado-entrante.component.html',
  styleUrls: ['./letrado-entrante.component.scss']
})
export class LetradoEntranteComponent implements OnInit {

  msgs: Message[] = [];
  body;
  datos;
  showTarjeta=true;
  progressSpiner = false;

  @Input() saliente;

  @Output() fillEntrante = new EventEmitter<boolean>();

  motivosRenuncia = [
    {
      label: 'V',
      value: 'V'
    },
    {
      label: 'B',
      value: 'B'
    },
  ];

  constructor() { }

  ngOnInit() {

    /* this.body=this.saliente;
    this.body.fechaDesignacion;
    this.body.fechaEfecRenuncia=new Date();
    this.body.fechaSolRenuncia=new Date();
    this.body.numColegiado;
    this.body.apellido1Colegiado;
    this.body.apellido2Colegiado;
    this.body.nombreColegiado;
    this.body.compensacion = false;
    this.body.motivoRenuncia = false;
    this.body.observaciones=""; */

  }

  incluirSalto(){
    this.body.salto=!this.body.salto;
  }

  incluirArt(){
    this.body.art27=!this.body.art27;
  }

  changeMotivo(event){
    this.body.motivoRenuncia = event;
  }

  onHideTarjeta(){
    this.showTarjeta=!this.showTarjeta;
  }

  clear() {
    this.msgs=[];
  }

}
