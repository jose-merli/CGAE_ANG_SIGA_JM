import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-detalle-plantilla-envio',
  templateUrl: './detalle-plantilla-envio.component.html',
  styleUrls: ['./detalle-plantilla-envio.component.scss']
})
export class DetallePlantillaEnvioComponent implements OnInit {

  idPlantilla: string;
  datosGenerales: boolean = false;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.idPlantilla = this.activatedRoute.snapshot.params["id"];
    //llamar con id al servicio para traer el detalle de la plantilla

  }



  abreCierraFichaGeneral() {
    this.datosGenerales = !this.datosGenerales;
  }

}
