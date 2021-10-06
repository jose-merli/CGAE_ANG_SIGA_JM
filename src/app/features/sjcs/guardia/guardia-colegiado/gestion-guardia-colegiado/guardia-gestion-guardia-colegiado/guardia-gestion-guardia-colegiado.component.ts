import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../../../../../commons/translate';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-guardia-gestion-guardia-colegiado',
  templateUrl: './guardia-gestion-guardia-colegiado.component.html',
  styleUrls: ['./guardia-gestion-guardia-colegiado.component.scss']
})
export class GuardiaGestionGuardiaColegiadoComponent implements OnInit {

  msgs;
  progressSpinner;
  guardiaItem;
  bodyGuardia:GuardiaItem;
  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,private translateService: TranslateService) { }

  ngOnInit() {
    this.progressSpinner = true;
    if(this.persistenceService.getDatos()){
      this.guardiaItem = this.persistenceService.getDatos();
     this.getGuardiaInfo();
    }
    this.progressSpinner = false

  }

  getGuardiaInfo(){
    let guardia = new GuardiaItem;
    guardia.idTurno = this.guardiaItem.idTurno;
    guardia.idGuardia = this.guardiaItem.idGuardia;
    this.sigaServices.post("guardiasColegiado_getGuardiaCole", guardia).subscribe(
      n => {
        this.bodyGuardia = JSON.parse(n.body).guardiaItems[0];
      },
      err => {
        console.log(err);
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }, () => {
        
      }
    );
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
