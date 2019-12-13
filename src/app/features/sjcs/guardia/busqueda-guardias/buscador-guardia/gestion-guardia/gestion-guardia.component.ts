import { Component, OnInit, EventEmitter, Input, ViewChild } from '@angular/core';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { Location } from '@angular/common';
import { SigaServices } from '../../../../../../_services/siga.service';
import { DatosIncompatibilidadesComponent } from './datos-incompatibilidades/datos-incompatibilidades.component';


@Component({
  selector: 'app-gestion-guardia',
  templateUrl: './gestion-guardia.component.html',
  styleUrls: ['./gestion-guardia.component.scss']
})
export class GestionGuardiaComponent implements OnInit {



  @Input() datos;
  modoEdicion: boolean;
  permisoEscritura: boolean = false;
  historico: boolean = false;
  progressSpinner: boolean = false;
  datosRedy = new EventEmitter<any>();
  titulo = "justiciaGratuita.oficio.turnos.inforesumen";
  infoResumen = [];


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
    this.datos = JSON.parse(JSON.stringify(this.persistenceService.getDatos()));
    this.sigaServices.post("busquedaGuardias_getGuardia", this.datos).subscribe(
      n => {
        this.datos = JSON.parse(n.body);
        this.sigaServices.notifysendDatosRedy(n);
        this.getDatosResumen();

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

  getDatosResumen() {
    this.sigaServices.post("busquedaGuardias_resumenGuardia", this.datos).subscribe(
      r => {
        this.infoResumen = [
          {
            label: "Turno",
            value: JSON.parse(r.body).turno
          },
          {
            label: "Guardia",
            value: JSON.parse(r.body).nombre
          },
          {
            label: "Tipo de guardia",
            value: JSON.parse(r.body).idTipoGuardia
          },
          {
            label: "Número de inscritos",
            value: JSON.parse(r.body).letradosGuardia
          }
        ]
      });

  }


}
