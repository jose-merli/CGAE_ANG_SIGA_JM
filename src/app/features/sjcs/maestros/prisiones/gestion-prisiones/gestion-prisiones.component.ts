import { Component, OnInit } from '@angular/core';
import { PrisionItem } from '../../../../../models/sjcs/PrisionItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-gestion-prisiones',
  templateUrl: './gestion-prisiones.component.html',
  styleUrls: ['./gestion-prisiones.component.scss']
})
export class GestionPrisionesComponent implements OnInit {

  fichasPosibles;
  datos: PrisionItem = new PrisionItem();
  modoEdicion: boolean = true;

  constructor(private persistenceService: PersistenceService, private location: Location) { }

  ngOnInit() {


    if (this.persistenceService.getDatos() != undefined) {
      this.datos = this.persistenceService.getDatos();
      this.modoEdicion = true;
    } else {
      this.datos = new PrisionItem();
      this.modoEdicion = false;
    }

  }


  backTo() {
    this.location.back();
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.datos.idPrision = event.idPrision;
  }


}
