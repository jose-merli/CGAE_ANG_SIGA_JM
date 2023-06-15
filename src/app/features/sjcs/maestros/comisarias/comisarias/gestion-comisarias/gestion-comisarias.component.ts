import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ComisariaItem } from '../../../../../../models/sjcs/ComisariaItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';

@Component({
  selector: 'app-gestion-comisarias',
  templateUrl: './gestion-comisarias.component.html',
  styleUrls: ['./gestion-comisarias.component.scss']
})
export class GestionComisariasComponent implements OnInit {

  fichasPosibles;
  datos: ComisariaItem = new ComisariaItem();
  modoEdicion: boolean = true;
  institucionActual: any;

  constructor(private persistenceService: PersistenceService, private location: Location) { }

  ngOnInit() {


    if (this.persistenceService.getDatos() != undefined) {
      this.datos = this.persistenceService.getDatos();

      this.modoEdicion = true;
    } else {
      this.datos = new ComisariaItem();
      this.modoEdicion = false;
    }

  }


  backTo() {
    this.location.back();
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.datos.idComisaria = event.idComisaria;
  }
}
