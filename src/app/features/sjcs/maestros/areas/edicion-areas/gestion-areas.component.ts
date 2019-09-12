import { Location } from "@angular/common";
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { EdicionAreasComponent } from './gestion-areas/edicion-areas.component';
import { TablaMateriasComponent } from "./gestion-materias/tabla-materias.component";
import { TranslateService } from './../../../../../commons/translate';

@Component({
  selector: 'app-gestion-areas',
  templateUrl: './gestion-areas.component.html',
  styleUrls: ['./gestion-areas.component.scss']
})
export class GestionAreasComponent implements OnInit {

  fichasPosibles;
  idArea;
  modoEdicion: boolean;


  constructor(private location: Location,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService) { }

  ngOnInit() {

    this.getFichasPosibles();

    this.route.queryParams
      .subscribe(params => {
        this.idArea = params.idArea
        console.log(params);
      });

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
