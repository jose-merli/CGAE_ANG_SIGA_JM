import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';

@Component({
  selector: 'app-calendario-gestion-guardia-colegiado',
  templateUrl: './calendario-gestion-guardia-colegiado.component.html',
  styleUrls: ['./calendario-gestion-guardia-colegiado.component.scss']
})
export class CalendarioGestionGuardiaColegiadoComponent implements OnInit {

  msgs;
  progressSpinner;
  calendarioItem;
  calendarioItemSend;
  calendarioBody:GuardiaItem;
  idConjuntoGuardia
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private router:Router
  ) { }

  ngOnInit() {
    this.progressSpinner = true;
    if(this.persistenceService.getDatos()){
      this.calendarioBody = this.persistenceService.getDatos();
     this.getCalendarioInfo();
    }
    this.progressSpinner = false
  }

  getCalendarioInfo(){
   

   let datosCalendario =[
    this.calendarioBody.idTurno,
    this.calendarioBody.idGuardia,
    this.calendarioBody.idCalendarioGuardias
    ]
    this.progressSpinner = true
    this.sigaServices.post("guardiasColegiado_getCalendarioColeg", datosCalendario).subscribe(
      n => {
        this.calendarioItem = JSON.parse(n.body)[0];
        this.progressSpinner = false
      },
      err => {
        console.log(err);
        this.progressSpinner = false
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }, () => {
        
      }
    );
  }
 
  

  navigateToFichaGuardia(){
    
    this.router.navigate(['/fichaProgramacion']);
  }

  clear(){
    this.msgs = []
  }
  
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

}
