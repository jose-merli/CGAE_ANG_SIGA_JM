import { Location } from "@angular/common";
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { GrupoZonaComponent } from './grupo-zona/grupo-zona.component';
import { ZonaComponent } from "./zona/zona.component";

@Component({
  selector: 'app-ficha-grupo-zona',
  templateUrl: './ficha-grupo-zona.component.html',
  styleUrls: ['./ficha-grupo-zona.component.scss']
})
export class FichaGrupoZonaComponent implements OnInit {

  fichasPosibles;
  idZona;
  modoEdicion: boolean;


  constructor(private location: Location,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {

    this.getFichasPosibles();

    this.route.queryParams
      .subscribe(params => {
        this.idZona = params.idZona
        //console.log(params);
      });

  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.idZona = event.idZona
  }

  getFichasPosibles() {

    this.fichasPosibles = [
      {
        key: "grupoZona",
        activa: true
      },
      {
        key: "zona",
        activa: true
      }

    ];
  }

  backTo() {
    this.location.back();
  }
}
