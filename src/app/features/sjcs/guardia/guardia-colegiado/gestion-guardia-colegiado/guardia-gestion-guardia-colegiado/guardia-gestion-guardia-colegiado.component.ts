import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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

  //SIGARNV-2885 INICIO
  @Output() guardiaColegiado = new EventEmitter<GuardiaItem>();
  //SIGARNV-2885 FIN

  ngOnInit() {
    //this.progressSpinner = true;
    if (this.persistenceService.getDatos() || this.persistenceService.getDatosColeg()) {
      this.guardiaItem = this.persistenceService.getDatosColeg() ? this.persistenceService.getDatosColeg() : this.persistenceService.getDatos();
      this.guardiaItem.letradosGuardia.replace(",", ", ");
      this.getGuardiaInfo();

      //SIGARNV-2885 INICIO
      this.emitGuardiaColegiado();
      //SIGARNV-2885 FIN
    }
    this.progressSpinner = false
  }

  //SIGARNV-2885 INICIO
  async getGuardiaInfo(){
    let guardia = new GuardiaItem;
    guardia.idTurno = this.guardiaItem.idTurno;
    guardia.idGuardia = this.guardiaItem.idGuardia;
    //this.progressSpinner = true
    await this.sigaServices.post("guardiasColegiado_getGuardiaCole", guardia).subscribe(
      n => {
        this.bodyGuardia = JSON.parse(n.body).guardiaItems[0];
        this.progressSpinner = false
      },
      err => {
        //console.log(err);
        this.progressSpinner = false
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }, () => {
        
      }
    );
    //SIGARNV-2885 FIN
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

  //SIGARNV-2885 INICIO
  emitGuardiaColegiado(){
    this.guardiaColegiado.emit(this.guardiaItem);
  }
  //SIGARNV-2885 FIN
}
