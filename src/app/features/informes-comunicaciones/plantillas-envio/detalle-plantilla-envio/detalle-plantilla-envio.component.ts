import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { SigaServices } from "../../../../_services/siga.service";

@Component({
  selector: "app-detalle-plantilla-envio",
  templateUrl: "./detalle-plantilla-envio.component.html",
  styleUrls: ["./detalle-plantilla-envio.component.scss"]
})
export class DetallePlantillaEnvioComponent implements OnInit {
  idPlantilla: string;
  fichasPosibles: any[];
  filtrosPlantillas;
  claseComunicacion;
  idPlantillaEnvio: any;
  cuerpoPlantillas: any;

  constructor(
    private sigaServices: SigaServices,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.idPlantilla = this.activatedRoute.snapshot.params["id"];
    //llamar con id al servicio para traer el detalle de la plantilla
    if (sessionStorage.getItem("filtrosPlantillas")) {
      this.filtrosPlantillas = JSON.parse(
        sessionStorage.getItem("filtrosPlantillas")
      );
      sessionStorage.setItem(
        "filtrosPlantillasPlantillas",
        JSON.stringify(this.filtrosPlantillas)
      );
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


  emitClaseComunicacion(event) {
    if (event != undefined) {
      this.claseComunicacion = event;
    } else {
      this.claseComunicacion = "";
    }
  }

  backTo() {
    let filtros = JSON.parse(
      sessionStorage.getItem("filtrosPlantillasPlantillas")
    );
    sessionStorage.setItem("filtrosPlantillas", JSON.stringify(filtros));
    sessionStorage.removeItem("filtrosPlantillasPlantillas");
    this.location.back();
  }
  emitOpenDescripcion(event) {
    if (event != undefined) {
      this.idPlantillaEnvio = event;
    }
  }
  cuerpoPlantilla(event) {
    if (event != undefined) {
      this.cuerpoPlantillas = event;
    }
  }
}
