import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TurnosItem } from '../../../../../models/sjcs/TurnosItem';
import { GuardiaItem } from '../../../../../models/sjcs/GuardiaItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { procesos_facturacionSJCS } from '../../../../../permisos/procesos_facturacionSJCS';
@Component({
  selector: 'app-gestion-guardia-colegiado',
  templateUrl: './gestion-guardia-colegiado.component.html',
  styleUrls: ['./gestion-guardia-colegiado.component.scss']
})
export class GestionGuardiaColegiadoComponent implements OnInit {

  turnosItem;
  guardia: GuardiaItem;
  modificar: boolean;
  //SIGARNV-2885 INICIO
  guardiaColegiado: GuardiaItem;
  //SIGARNV-2885 FIN
  permisoEscrituraFacturaciones;

  constructor(private location: Location,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private router: Router,
    private commonsService: CommonsService) { }

  async ngOnInit() {

    if (sessionStorage.getItem("infoGuardiaColeg") != null || sessionStorage.getItem("infoGuardiaColeg") != undefined || sessionStorage.getItem("infoGuardiaColeg") != "false") {
      if (sessionStorage.getItem("infoGuardiaColeg") != null || sessionStorage.getItem("infoGuardiaColeg") != undefined) {
        this.guardia = JSON.parse(sessionStorage.getItem("infoGuardiaColeg"));
        this.persistenceService.setDatos(this.guardia);

        this.modificar = true;
      } else {
        this.modificar = false;
      }
    }
    if(sessionStorage.getItem("crearGuardiaColegiado")){
      sessionStorage.removeItem('crearGuardiaColegiado')
      this.modificar = false;
    }

    //Facturaciones
    await this.commonsService.checkAcceso(procesos_facturacionSJCS.tarjetaFacFenerica)
    .then(respuesta => {
      this.permisoEscrituraFacturaciones = respuesta;
    }
    ).catch(error => console.error(error));

  }

  backTo() {

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

  guardarDatos() {
    sessionStorage.setItem("infoGuardiaColeg", JSON.stringify(this.guardia));
    sessionStorage.setItem("originGuardiaColeg", "true");
  }

  //SIGARNV-2885 INICIO
  getGuardiaColegiado(event){
    this.guardiaColegiado = event;
  }
  //SIGARNV-2885 FIN
}
