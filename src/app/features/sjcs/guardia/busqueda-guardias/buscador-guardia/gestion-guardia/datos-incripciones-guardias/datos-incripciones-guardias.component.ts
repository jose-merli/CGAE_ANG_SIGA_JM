import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PersistenceService } from '../../../../../../../_services/persistence.service';

@Component({
  selector: 'app-datos-incripciones-guardias',
  templateUrl: './datos-incripciones-guardias.component.html',
  styleUrls: ['./datos-incripciones-guardias.component.scss']
})
export class DatosIncripcionesGuardiasComponent implements OnInit {

  @Input() TarjetaInscripciones;
  filtroInscripciones = {
    idGuardia : '',
    idTurno : ''
  }
  @Input() modoVinculado = false;
  constructor(private persistenceService : PersistenceService,
    private router : Router) { }

  ngOnInit() {

  }

  goToInscripciones(){

    if(this.persistenceService.getDatos() && !this.modoVinculado){
      this.filtroInscripciones.idGuardia = this.persistenceService.getDatos().idGuardia;
      this.filtroInscripciones.idTurno = this.persistenceService.getDatos().idTurno;
      sessionStorage.setItem("filtroFromFichaGuardia",JSON.stringify(this.filtroInscripciones));
      this.router.navigate(["/inscripcionesGuardia"]);

    }

  }

}
