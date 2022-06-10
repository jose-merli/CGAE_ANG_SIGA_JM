import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { CommonsService } from '../../../../../../_services/commons.service';
import { DatePipe } from '@angular/common';
import {ConfirmationService} from 'primeng/api';
import { FacAbonoItem } from '../../../../../../models/sjcs/FacAbonoItem';

@Component({
  selector: 'app-datos-generales-abonos-sjcs',
  templateUrl: './datos-generales-abonos-sjcs.component.html',
  styleUrls: ['./datos-generales-abonos-sjcs.component.scss'],
  providers: [ConfirmationService]
})
export class DatosGeneralesAbonosSJCSComponent implements OnInit {

  openFicha: boolean = true;
  msgs = [];
  @Input() datos: FacAbonoItem;

  abonoItem: FacAbonoItem;  
  restablecerDatosFiltro: FacAbonoItem = new FacAbonoItem();  

  progressSpinner:boolean = false;
  comp:number=0;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices, private confirmationService: ConfirmationService,
    private translateService: TranslateService, private commonsService: CommonsService) {
     }

  ngOnInit() {
    //console.log("si va")
    //console.log(this.datos)

    
   }
   abreCierraFicha(){
    this.openFicha = !this.openFicha
  }
  

  transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);
    return fecha;
  }

 
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }


  clear() {
    this.msgs = [];
  }
  comunicar(){}

 }
