import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private router:Router) { }

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
    this.progressSpinner = true
    this.sigaServices.post("guardiasColegiado_getGuardiaCole", guardia).subscribe(
      n => {
        this.bodyGuardia = JSON.parse(n.body).guardiaItems[0];
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
    sessionStorage.setItem("datosGuardiaGuardiaColeg",JSON.stringify(this.bodyGuardia));
    sessionStorage.setItem("originGuarCole","true");
    this.router.navigate(['/gestionGuardias']);
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
