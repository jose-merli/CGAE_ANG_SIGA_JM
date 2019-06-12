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
  filtrosPlantillas;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.idPlantilla = this.activatedRoute.snapshot.params["id"];
    //llamar con id al servicio para traer el detalle de la plantilla
    if (sessionStorage.getItem("filtrosPlantillas")) {
      this.filtrosPlantillas = JSON.parse(sessionStorage.getItem("filtrosPlantillas"));
      sessionStorage.setItem("filtrosPlantillasPlantillas", JSON.stringify(this.filtrosPlantillas));
      sessionStorage.removeItem("filtrosPlantillas");
    }

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
    let filtros = JSON.parse(sessionStorage.getItem("filtrosPlantillasPlantillas"));
    sessionStorage.setItem("filtrosPlantillas", JSON.stringify(filtros));
    sessionStorage.removeItem("filtrosPlantillasPlantillas");
    this.location.back();
  }
}
