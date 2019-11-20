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

  modoEdicion: boolean;
  permisoEscritura: boolean = false;
  historico: boolean = false;

  titulo = "justiciaGratuita.oficio.turnos.inforesumen";
  infoResumen = [
    {
      label: "Tarjeta",
      value: "Resumen"
    },
    {
      label: "Estado",
      value: "Fijada"
    },
    {
      label: "Día de la semana",
      value: "Jueves"
    },
    {
      label: "Pantalla",
      value: "Gestión de Búsqueda guardias"
    }
  ]
  constructor(private persistenceService: PersistenceService,
    private location: Location) { }

  ngOnInit() {

    if (this.persistenceService.getDatos() != undefined) {
      this.datos = this.persistenceService.getDatos();
      if (this.datos.fechabaja != null) {
        this.historico = true;
        this.persistenceService.setHistorico(true);
      } else this.persistenceService.setHistorico(false);

      this.modoEdicion = true;
    } else {
      this.datos = new GuardiaItem();
      this.modoEdicion = false;
    }
    if (this.persistenceService.getPermisos())
      this.permisoEscritura = true;

  }


  backTo() {
    this.location.back();
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.datos.idGuardia = event.idGuardia;
  }

}
