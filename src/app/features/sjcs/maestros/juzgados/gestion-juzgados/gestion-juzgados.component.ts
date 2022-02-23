import { Component, OnInit } from '@angular/core';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Location } from '@angular/common';
import { JuzgadoItem } from '../../../../../models/sjcs/JuzgadoItem';

@Component({
  selector: 'app-gestion-juzgados',
  templateUrl: './gestion-juzgados.component.html',
  styleUrls: ['./gestion-juzgados.component.scss']
})
export class GestionJuzgadosComponent implements OnInit {

  fichasPosibles;
  datos: JuzgadoItem = new JuzgadoItem();
  modoEdicion: boolean = true;

  constructor(private persistenceService: PersistenceService, private location: Location) { }

  ngOnInit() {

    this.getFichasPosibles();

    if (this.persistenceService.getDatos() != undefined) {
      this.datos = this.persistenceService.getDatos();
      if (this.datos.fechaCodigoEjis != undefined && this.datos.fechaCodigoEjis != null) {
        this.datos.fechaCodigoEjis = new Date(this.datos.fechaCodigoEjis);
      }
      this.modoEdicion = true;
    } else {
      this.datos = new JuzgadoItem();
      this.modoEdicion = false;
    }

  }

  getFichasPosibles() {

    this.fichasPosibles = [
      {
        key: "generales",
        activa: true
      },
      {
        key: "direccion",
        activa: true
      },
      {
        key: "procedimientos",
        activa: false
      }

    ];
  }

  backTo() {
    this.location.back();
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.datos.idJuzgado = event.idJuzgado;
  }

}
