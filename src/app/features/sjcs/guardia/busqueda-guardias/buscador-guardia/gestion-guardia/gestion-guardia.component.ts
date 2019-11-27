import { Component, OnInit, EventEmitter } from '@angular/core';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { Location } from '@angular/common';
import { SigaServices } from '../../../../../../_services/siga.service';


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
  progressSpinner: boolean = false;
  datosRedy = new EventEmitter<any>();
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
    private location: Location, private sigaServices: SigaServices) { }

  ngOnInit() {

    if (this.persistenceService.getDatos() != undefined) {
      this.search();
      this.modoEdicion = true;
    } else {
      this.modoEdicion = false;
    }
    if (this.persistenceService.getPermisos())
      this.permisoEscritura = this.persistenceService.getPermisos();

  }

  search() {
    this.sigaServices.getParam("busquedaGuardias_getGuardia", "?idGuardia=" + this.persistenceService.getDatos()).subscribe(
      n => {

        this.sigaServices.notifysendDatosRedy(n);
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      })
  }



  backTo() {
    this.location.back();
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.datos.idGuardia = event.idGuardia;
  }

}
