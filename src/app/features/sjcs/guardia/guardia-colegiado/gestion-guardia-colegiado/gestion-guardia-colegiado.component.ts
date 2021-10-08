import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TurnosItem } from '../../../../../models/sjcs/TurnosItem';
import { GuardiaItem } from '../../../../../models/guardia/GuardiaItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
@Component({
  selector: 'app-gestion-guardia-colegiado',
  templateUrl: './gestion-guardia-colegiado.component.html',
  styleUrls: ['./gestion-guardia-colegiado.component.scss']
})
export class GestionGuardiaColegiadoComponent implements OnInit {
 
  turnosItem;
  guardia: GuardiaItem;
  activa:boolean = false;
  modificar: boolean;
  constructor(private location: Location,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService) { }

  ngOnInit() {

    if(sessionStorage.getItem("infoGuardiaColeg") != null || sessionStorage.getItem("infoGuardiaColeg") != undefined || sessionStorage.getItem("infoGuardiaColeg") != "false"){
      if(sessionStorage.getItem("infoGuardiaColeg") != null || sessionStorage.getItem("infoGuardiaColeg") != undefined){
        this.guardia = JSON.parse(sessionStorage.getItem("infoGuardiaColeg"));
        this.persistenceService.setDatos(this.guardia);
        sessionStorage.removeItem("infoGuardiaColeg");
        this.modificar = true;
        this.activa = true
      }else{
        this.modificar = true;
      }
    }
   
  }

  backTo(){
    this.location.back();
  }
}
