import { Component, OnInit } from '@angular/core';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-gestion-guardia',
  templateUrl: './gestion-guardia.component.html',
  styleUrls: ['./gestion-guardia.component.scss']
})
export class GestionGuardiaComponent implements OnInit {



  datos: GuardiaItem = new GuardiaItem();
  modoEdicion: boolean = true;

  constructor(private persistenceService: PersistenceService,
    private location: Location) { }

  ngOnInit() {

    if (this.persistenceService.getDatos() != undefined) {
      this.datos = this.persistenceService.getDatos();
      this.modoEdicion = true;
    } else {
      this.datos = new GuardiaItem();
      this.modoEdicion = false;
    }

  }


  backTo() {
    this.location.back();
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.datos.idGuardia = event.idGuardia;
  }

}
