import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TurnosItem } from '../../../../../models/sjcs/TurnosItem';
import { GuardiaItem } from '../../../../../models/guardia/GuardiaItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Router } from '@angular/router';
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
    private persistenceService: PersistenceService,
    private router: Router) { }

  ngOnInit() {

    if(sessionStorage.getItem("infoGuardiaColeg") != null || sessionStorage.getItem("infoGuardiaColeg") != undefined || sessionStorage.getItem("infoGuardiaColeg") != "false"){
      if(sessionStorage.getItem("infoGuardiaColeg") != null || sessionStorage.getItem("infoGuardiaColeg") != undefined){
        this.guardia = JSON.parse(sessionStorage.getItem("infoGuardiaColeg"));
        this.persistenceService.setDatos(this.guardia);
        
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

 /*  navigateToFichaGuardia(){
    let calendarioItemSend = 
      { 'idTurno': this.guardia.idTurno,
        'idConjuntoGuardia': this.guardia.idConjuntoGuardia,
       'idGuardia': this.guardia.idGuardia,
        'fechaCalendarioDesde': this.guardia.fechadesde,
        'fechaCalendarioHasta': this.guardia.fechahasta,
      };
    sessionStorage.setItem("datosCalendarioGuardiaColeg",JSON.stringify(calendarioItemSend));
    sessionStorage.setItem("originGuarCole","true");
    this.router.navigate(['/fichaProgramacion']);
  } */

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    sessionStorage.removeItem("infoGuardiaColeg");
  }
}
