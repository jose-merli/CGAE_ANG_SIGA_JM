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

  constructor(private persistenceService: PersistenceService, private location: Location) { }

  ngOnInit() {
    if (this.persistenceService.getDatos() != undefined) {
      this.datos = this.persistenceService.getDatos();

      this.modoEdicion = true;
    } else {
      this.datos = new ActasItem();
      this.modoEdicion = false;
    }
    this.datos.anio = "1995";
    this.datos.fechaResolucion = new Date();
    this.datos.fechaReunion = new Date();
    this.datos.idActa = "3";
    this.datos.idPresidente = "3";
    this.datos.idSecretario = "3";
    this.datos.nombrePresidente = "Pepe";
    this.datos.nombreSecretario = "Pedro";
    this.datos.numeroActa = "123/1995";

  }


  backTo() {
    this.location.back();
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.datos.idActa = event.idActa;
  }
  
  }


