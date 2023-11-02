import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { GuardiaItem } from '../../../../../../models/sjcs/GuardiaItem';
import { TurnosItem } from '../../../../../../models/sjcs/TurnosItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-turno-gestion-guardia-colegiado',
  templateUrl: './turno-gestion-guardia-colegiado.component.html',
  styleUrls: ['./turno-gestion-guardia-colegiado.component.scss']
})
export class TurnoGestionGuardiaColegiadoComponent implements OnInit {
  msgs;
  progressSpinner;
  turnosItem = new TurnosItem();
  guardia = new GuardiaItem();
  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private router:Router,
    private translateService: TranslateService,) { }

  ngOnInit() {
    //this.progressSpinner = true;
    if (this.persistenceService.getDatos() || this.persistenceService.getDatosColeg()) {
      this.guardia = this.persistenceService.getDatosColeg() ? this.persistenceService.getDatosColeg() : this.persistenceService.getDatos();
     this.getTurnoInfo();
    }
    this.progressSpinner = false

  }

  getTurnoInfo(){
    let turno = new TurnosItem();
    turno.idturno = this.guardia.idTurno;
    //this.progressSpinner = true
    this.sigaServices.post("guardiasColegiado_getTurnoGuardiaColeg", turno).subscribe(
      n => {
        this.turnosItem = JSON.parse(n.body).turnosItem[0];
        this.progressSpinner = false
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }, () => {
        this.progressSpinner = false;
      }
    );
  }

  navigateToFichaTurno(){
    sessionStorage.setItem("infoGuardiaColeg", JSON.stringify(this.guardia));
    if (this.persistenceService.getDatosColeg()) {
      this.router.navigate(['/gestionTurnos'], { queryParams: { idturno: this.persistenceService.getDatosColeg().idTurno } });
    } else {
      this.router.navigate(['/gestionTurnos'], { queryParams: { idturno: this.persistenceService.getDatos().idTurno } });
    }
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
