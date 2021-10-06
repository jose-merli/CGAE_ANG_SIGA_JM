import { Component, OnInit } from '@angular/core';
import { ColegiadoItem } from '../../../../../../models/ColegiadoItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-colegiado-gestion-guardia-colegiado',
  templateUrl: './colegiado-gestion-guardia-colegiado.component.html',
  styleUrls: ['./colegiado-gestion-guardia-colegiado.component.scss']
})
export class ColegiadoGestionGuardiaColegiadoComponent implements OnInit {

  msgs;
  progressSpinner;
  colegiado;
  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService) { }

  ngOnInit() {
    this.progressSpinner = true;
    if(this.persistenceService.getDatos()){
      this.colegiado = this.persistenceService.getDatos();
    }
    this.progressSpinner = false



  }

  clear(){
    this.msgs = "";
  }
}
