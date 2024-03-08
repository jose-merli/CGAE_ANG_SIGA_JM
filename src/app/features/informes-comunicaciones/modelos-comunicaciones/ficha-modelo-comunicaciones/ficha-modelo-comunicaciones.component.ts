import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { CommonsService } from "../../../../_services/commons.service";
import { DatosGeneralesFicha } from "../../../../models/DatosGeneralesFichaItem";

@Component({
  selector: "app-ficha-modelo-comunicaciones",
  templateUrl: "./ficha-modelo-comunicaciones.component.html",
  styleUrls: ["./ficha-modelo-comunicaciones.component.scss"]
})
export class FichaModeloComunicacionesComponent implements OnInit {
  idModelo: string;
  fichasPosibles: any[];
  filtrosModelos;
  botonActivo = false;
  getInforme = false;
  datoGeneral: DatosGeneralesFicha;
  esNuevoRegistro : boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private commonsService: CommonsService
  ) { }

  

  ngOnInit() {
    this.idModelo = this.activatedRoute.snapshot.params["id"];

    if (sessionStorage.getItem("filtrosModelos")) {
      this.filtrosModelos = JSON.parse(sessionStorage.getItem("filtrosModelos"));
      sessionStorage.setItem("filtrosModelosModelos", JSON.stringify(this.filtrosModelos));
      sessionStorage.removeItem("filtrosModelos");
    }

    if(sessionStorage.getItem("crearNuevoModelo")){
      this.esNuevoRegistro = true;
      sessionStorage.removeItem("crearNuevoModelo");
    }

    this.fichasPosibles = [
      {
        key: "generales",
        activa: true
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
        key: "plantillaDocumentos",
        active: false
      },
      {
        key: "consultas",
        activa: true
      }
    ];
  }

  controlCambioDG(event:DatosGeneralesFicha){
    this.datoGeneral = event;
  }

  backTo() {
    let filtros = JSON.parse(sessionStorage.getItem("filtrosModelosModelos"));
    sessionStorage.setItem("filtrosModelos", JSON.stringify(filtros));
    sessionStorage.removeItem("filtrosModelosModelos");
    this.location.back();
  }

  activarBoton() {
    this.botonActivo = true;
  }

  getInformesInfo(){
    this.getInforme=  !this.getInforme;
  }

}
