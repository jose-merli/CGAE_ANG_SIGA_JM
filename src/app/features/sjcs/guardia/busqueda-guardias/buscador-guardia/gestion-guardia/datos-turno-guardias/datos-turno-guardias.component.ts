import { Component, OnInit, Input } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { TurnosItems } from '../../../../../../../models/sjcs/TurnosItems';
import { TranslateService } from '../../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datos-turno-guardias',
  templateUrl: './datos-turno-guardias.component.html',
  styleUrls: ['./datos-turno-guardias.component.scss']
})
export class DatosTurnoGuardiasComponent implements OnInit {

  body: TurnosItems = new TurnosItems();
  progressSpinner: boolean = false;
  datos: any;

  @Input() modoEdicion: boolean = false;
  @Input() tarjetaTurno: string;

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private router : Router) { }

  ngOnInit() {
    this.sigaServices.datosRedy$.subscribe(
      data => {
        this.modoEdicion = true;
        this.getResumen();

      });
  }
  goToFichaTurnos(){
    sessionStorage.setItem("idGuardiaFromFichaGuardia",this.datos.idGuardia);
    this.router.navigate(["/gestionTurnos"], { queryParams: { idturno: this.datos.idTurno } });
  }

  getResumen() {
    //this.progressSpinner = true;
    try{
      this.datos = JSON.parse(this.persistenceService.getDatos());
    }catch(Ex){
      this.datos = this.persistenceService.getDatos();
    }
    
    this.sigaServices.post("gestionGuardias_resumenTurno", this.datos.idTurno).subscribe(
      data => {
        this.body = JSON.parse(data.body).turnosItem[0];
        this.progressSpinner = false;
      },

      () => {
        this.progressSpinner = false;
      }
    );
  }
}


