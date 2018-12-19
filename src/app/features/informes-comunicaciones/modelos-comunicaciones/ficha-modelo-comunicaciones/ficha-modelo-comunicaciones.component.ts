import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: 'app-ficha-modelo-comunicaciones',
  templateUrl: './ficha-modelo-comunicaciones.component.html',
  styleUrls: ['./ficha-modelo-comunicaciones.component.scss']
})
export class FichaModeloComunicacionesComponent implements OnInit {

  idModelo: string;
  fichasPosibles: any[];

  constructor(private activatedRoute: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    this.idModelo = this.activatedRoute.snapshot.params["id"];

    this.fichasPosibles = [
      {
        key: "generales",
        activa: false
      },
      {
        key: "perfiles",
        activa: false
      },
      {
        key: "informes",
        activa: false
      },
      {
        key: "comunicacion",
        activa: false
      },

    ];
  }

  backTo() {
    this.location.back();
  }


}
