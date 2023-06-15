import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { FundamentoResolucionItem } from '../../../../../../models/sjcs/FundamentoResolucionItem';

@Component({
  selector: 'app-gestion-fundamentosresolucion',
  templateUrl: './gestion-fundamentosresolucion.component.html',
  styleUrls: ['./gestion-fundamentosresolucion.component.scss']
})
export class GestionFundamentosresolucionComponent implements OnInit {

  fichasPosibles;
  datos;
  modoEdicion: boolean = true;

  constructor(private location: Location, private presistencia: PersistenceService) { }

  ngOnInit() {
    if (this.presistencia.getDatos() != null) {
      this.modoEdicion = true;
      this.datos = this.presistencia.getDatos();
    } else {
      this.modoEdicion = false;
      this.datos = new FundamentoResolucionItem();
    }
  }


  backTo() {
    this.location.back();
  }

}
