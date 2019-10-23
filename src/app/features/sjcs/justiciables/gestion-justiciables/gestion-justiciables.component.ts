import { Location } from "@angular/common";
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { DatosGeneralesComponent } from './datos-generales/datos-generales.component';
// import { TablaMateriasComponent } from "./gestion-materias/tabla-materias.component";
import { TranslateService } from './../../../../commons/translate';
import { SigaServices } from './../../../../_services/siga.service';
import { ModulosItem } from "../../../../models/sjcs/ModulosItem";
import { PersistenceService } from '../../../../_services/persistence.service';

@Component({
  selector: 'app-gestion-justiciables',
  templateUrl: './gestion-justiciables.component.html',
  styleUrls: ['./gestion-justiciables.component.scss']
})
export class GestionJusticiablesComponent implements OnInit {

  fichasPosibles;
  modoEdicion: boolean;
  idProcedimiento;
  messageShow: string;
  acreditacionesItem;
  modulosItem;
  constructor(private location: Location,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService) { }

  ngOnInit() {
    // this.getFichasPosibles();
    this.route.queryParams
      .subscribe(params => {
        this.idProcedimiento = params.idProcedimiento
        console.log(params);
      });
    if (this.idProcedimiento != undefined) {
      this.searchModulos();
    }


  }

  searchModulos() {
    // this.filtros.filtros.historico = event;
    // this.progressSpinner = true;
    let filtros: ModulosItem = new ModulosItem;
    filtros.idProcedimiento = this.idProcedimiento;
    filtros.historico = false;
    if (this.persistenceService.getHistorico() != undefined) {
      filtros.historico = this.persistenceService.getHistorico();
    }
    this.sigaServices.post("modulosYBasesDeCompensacion_searchModulos", filtros).subscribe(
      n => {
        this.modulosItem = JSON.parse(n.body).modulosItem[0];
        if (this.modulosItem.fechabaja != undefined || this.persistenceService.getPermisos() != true) {
          this.modulosItem.historico = true;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.idProcedimiento = event.idProcedimiento
  }

  // getFichasPosibles() {

  //   this.fichasPosibles = [
  //     {
  //       key: "edicionAreas",
  //       activa: true
  //     },
  //     {
  //       key: "tablaMaterias",
  //       activa: true
  //     }

  //   ];
  // }

  backTo() {
    this.location.back();
  }
}
