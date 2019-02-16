import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-detalle-plantilla-envio",
  templateUrl: "./detalle-plantilla-envio.component.html",
  styleUrls: ["./detalle-plantilla-envio.component.scss"]
})
export class DetallePlantillaEnvioComponent implements OnInit {
  idPlantilla: string;
  fichasPosibles: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.idPlantilla = this.activatedRoute.snapshot.params["id"];
    //llamar con id al servicio para traer el detalle de la plantilla

    this.fichasPosibles = [
      {
        key: "generales",
        activa: true
      },
      {
        key: "consultas",
        activa: false
      },
      {
        key: "remitente",
        activa: false
      }
    ];
  }

  backTo() {
    this.location.back();
  }
}
