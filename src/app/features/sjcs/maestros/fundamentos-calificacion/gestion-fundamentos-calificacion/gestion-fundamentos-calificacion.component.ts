import { Location } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FundamentosCalificacionItem } from '../../../../../models/sjcs/FundamentosCalificacionItem';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-gestion-fundamentos-calificacion',
  templateUrl: './gestion-fundamentos-calificacion.component.html',
  styleUrls: ['./gestion-fundamentos-calificacion.component.scss']
})
export class GestionFundamentosCalificacionComponent implements OnInit {

  fichasPosibles;
  datos: FundamentosCalificacionItem = new FundamentosCalificacionItem();
  modoEdicion: boolean = true;

  permisoEscritura: boolean = false;
  constructor(private persistenceService: PersistenceService, private location: Location) { }

  ngOnInit() {

    this.getFichasPosibles();
    if (this.persistenceService.getPermisos() == true) {
      this.permisoEscritura = this.persistenceService.getPermisos()
    }
    if (this.persistenceService.getDatos() != undefined) {
      this.datos = this.persistenceService.getDatos();
      if (this.datos.fechabaja != undefined && this.datos.fechabaja != null) {
        // this.datos.fechaCodigoEjis = new Date(this.datos.fechaCodigoEjis);
      }
      this.modoEdicion = true;
    } else {
      this.datos = new FundamentosCalificacionItem();
      this.modoEdicion = false;
    }

  }

  getFichasPosibles() {

    this.fichasPosibles = [
      {
        key: "generales",
        activa: true
      }
    ];
  }

  backTo() {
    this.location.back();
  }

  modoEdicionSend(event) {
    this.modoEdicion = true
    this.datos.idFundamento = event.idFundamento;
  }

}
