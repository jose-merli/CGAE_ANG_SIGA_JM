import { Component, OnInit } from "@angular/core";
import { OldSigaServices } from "../../../_services/oldSiga.service";
import {
  /*** MODULOS ***/
  NgModule
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { Router } from "@angular/router";
import { cardService } from "./../../../_services/cardSearch.service";
import { Location } from "@angular/common";

// import
@Component({
  selector: "app-datos-persona-juridica",
  templateUrl: "./datosPersonaJuridica.component.html",
  styleUrls: ["./datosPersonaJuridica.component.scss"]
})
export class DatosPersonaJuridicaComponent implements OnInit {
  fichasPosibles: any[] = [];
  generales: boolean = false;
  constructor(
    public sigaServices: OldSigaServices,
    private cardService: cardService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.fichasPosibles = [
      {
        key: "generales",
        activa: false
      },
      {
        key: "registrales",
        activa: false
      },
      {
        key: "notario",
        activa: false
      },
      {
        key: "integrantes",
        activa: false
      },
      {
        key: "direcciones",
        activa: false
      },
      {
        key: "bancarios",
        activa: false
      },
      {
        key: "retenciones",
        activa: false
      },
      {
        key: "interes",
        activa: false
      }
    ];
  }
  backTo() {
    sessionStorage.removeItem("usuarioBody");
    this.cardService.searchNewAnnounce.next(null);

    if (sessionStorage.getItem("filtrosBusquedaColegiados") != undefined) {
      this.router.navigate(["busquedaColegiados"]);
    } else {
      this.location.back();
    }
    // this.router.navigate(["searchNoColegiados"]);
  }

  getFichasPosibles() {
    return this.fichasPosibles;
  }
}
