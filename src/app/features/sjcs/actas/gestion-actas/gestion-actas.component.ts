import { Component, OnInit } from '@angular/core';
import { ActasItem } from '../../../../models/sjcs/ActasItem';
import { Location } from '@angular/common';
import { PersistenceService } from '../../../../_services/persistence.service';


@Component({
  selector: 'app-gestion-actas',
  templateUrl: './gestion-actas.component.html',
  styleUrls: ['./gestion-actas.component.scss']
})
export class GestionActasComponent implements OnInit {

  fichasPosibles;
  datos: ActasItem = new ActasItem();
  modoEdicion: boolean = true;
  institucionActual: any;
  actaItem: ActasItem;
  expNum:any;
  constructor(private persistenceService: PersistenceService, private location: Location) { }

  ngOnInit() {
  
      this.datos = new ActasItem();
      this.modoEdicion = false;

   
    if(localStorage.getItem('actasItem')){
      this.datos = JSON.parse(localStorage.getItem('actasItem'));
      console.log(this.actaItem);
      localStorage.removeItem('actasItem');
    }
  }

  expediente(event :string){
    this.expNum = event;
  }
  backTo() {
    this.location.back();
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.datos.idacta = event.idacta;
  }
  
  }


