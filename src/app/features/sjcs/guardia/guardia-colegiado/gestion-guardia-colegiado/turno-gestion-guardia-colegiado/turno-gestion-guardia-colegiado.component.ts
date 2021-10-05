import { Component, OnInit } from '@angular/core';
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
    private persistenceService: PersistenceService) { }

  ngOnInit() {
    this.progressSpinner = true;
    if(this.persistenceService.getDatos()){
      this.guardia = this.persistenceService.getDatos();
     this.getTurnoInfo();
    }
    this.progressSpinner = false

  }

  getTurnoInfo(){
    let turno = new TurnosItem();
    turno.idturno = this.guardia.idTurno.toString();
    this.sigaServices.post("guardiasColegiado_getTurnoGuardiaColeg", turno).subscribe(
      n => {
        this.turnosItem = JSON.parse(n.body).turnosItem[0];
      },
      err => {
        console.log(err);
      }, () => {
        
      }
    );
  }

  clear(){}
}
