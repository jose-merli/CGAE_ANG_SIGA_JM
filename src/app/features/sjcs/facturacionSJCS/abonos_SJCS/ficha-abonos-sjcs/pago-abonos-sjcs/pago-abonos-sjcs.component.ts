import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { CommonsService } from '../../../../../../_services/commons.service';
import { DatePipe } from '@angular/common';
import {ConfirmationService} from 'primeng/api';
import { FacAbonoItem } from '../../../../../../models/sjcs/FacAbonoItem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago-abonos-sjcs',
  templateUrl: './pago-abonos-sjcs.component.html',
  styleUrls: ['./pago-abonos-sjcs.component.scss'],
  providers: [ConfirmationService]
})
export class PagoAbonosSJCSComponent implements OnInit {

  openFicha: boolean = true;
  msgs = [];
  @Input() datos: FacAbonoItem;

  abonoItem: FacAbonoItem;  
  restablecerDatosFiltro: FacAbonoItem = new FacAbonoItem();  

  progressSpinner:boolean = false;
  comp:number=0;
  irpf:number=0;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices, private confirmationService: ConfirmationService,
    private translateService: TranslateService, private commonsService: CommonsService, private router: Router) {
     }

  ngOnInit() {
    console.log("si va bn")
    
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

  toPagoSJCS() {
		this.persistenceService.clearDatos();
		this.persistenceService.setDatos(this.datos);
    sessionStorage.setItem("abonosSJCSItem", JSON.stringify(this.datos));
    this.router.navigate(['/fichaPagos']);
  }

  
 /* getLineasAbono() {
    this.progressSpinner = true;
    this.sigaServices.getParam("facturacionPyS_getLineasAbono", "?idAbono=" + this.datos.idFactura).subscribe(
      n => {
        console.log(n)
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }*/

 }
