import { Location } from "@angular/common";
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { EdicionAreasComponent } from './gestion-areas/edicion-areas.component';
import { TablaMateriasComponent } from "./gestion-materias/tabla-materias.component";
import { TranslateService } from './../../../../../commons/translate';
import { SigaServices } from './../../../../../_services/siga.service';
import { AreasItem } from "../../../../../models/sjcs/AreasItem";
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-gestion-areas',
  templateUrl: './gestion-areas.component.html',
  styleUrls: ['./gestion-areas.component.scss']
})
export class GestionAreasComponent implements OnInit {

  fichasPosibles;
  idArea;
  modoEdicion: boolean;

  buscar: boolean = false;
  messageShow: string;

  areasItem;
  constructor(private location: Location,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService) { }

  ngOnInit() {
    this.getFichasPosibles();
    this.route.queryParams
      .subscribe(params => {
        this.idArea = params.idArea
        //console.log(params);
      });
    if (this.idArea != undefined) {
      this.searchAreas();
    } else {
      this.areasItem = new AreasItem();
      this.buscar = false;
    }
  }

  searchAreas() {
    // this.filtros.filtros.historico = event;
    // this.progressSpinner = true;
    let filtros: AreasItem = new AreasItem;
    filtros.idArea = this.idArea;
    filtros.historico = this.persistenceService.getHistorico();
    if (this.persistenceService.getHistorico() != undefined) {
      filtros.historico = this.persistenceService.getHistorico();
    }
    this.sigaServices.post("fichaAreas_searchAreas", filtros).subscribe(
      n => {
        this.areasItem = JSON.parse(n.body).areasItems[0];
        if (this.areasItem.fechabaja != undefined || this.persistenceService.getPermisos() != true) {
          this.areasItem.historico = true;
        }
        this.buscar = true;
      },
      err => {
        //console.log(err);
      }
    );
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.idArea = event.idArea
  }

  getFichasPosibles() {

    this.fichasPosibles = [
      {
        key: "edicionAreas",
        activa: true
      },
      {
        key: "tablaMaterias",
        activa: true
      }

    ];
  }

  backTo() {
    this.location.back();
  }
}
