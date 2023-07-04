import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
import { TranslateService } from '../../../commons/translate/translation.service';

// import
@Component({
  selector: "app-datos-persona-juridica",
  templateUrl: "./datosPersonaJuridica.component.html",
  styleUrls: ["./datosPersonaJuridica.component.scss"]
})
export class DatosPersonaJuridicaComponent implements OnInit {
  fichasPosibles: any[] = [];
  generales: boolean = false;
  migaPan: string = "";
  modoEdicion: boolean = false;
  datosTarjetaResumen;
  enlacesTarjetaResumen;
  openTarjeta;
  iconoTarjetaResumen = "clipboard";
  cantidadIntegrantes;

  constructor(
    public sigaServices: OldSigaServices,
    private cardService: cardService,
    private router: Router,
    private location: Location,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.enlacesTarjetaResumen = [];
    this.migaPan = this.translateService.instant("menu.censo.fichaSociedad");
    sessionStorage.setItem("migaPan", this.migaPan);
    this.cantidadIntegrantes = JSON.parse(sessionStorage.getItem("usuarioBody"))[0].numeroIntegrantes;

    this.fichasPosibles = [
      {
        key: "interes",
        activa: false
      },
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
      }
    ];
  }
  backTo() {
    sessionStorage.removeItem("usuarioBody");
    this.cardService.searchNewAnnounce.next(null);

    if (sessionStorage.getItem("filtrosBusquedaColegiados") != undefined) {
      this.router.navigate(["fichaColegial"]);
    } else if (
      sessionStorage.getItem("filtrosBusquedaNoColegiados") != undefined
    ) {
      this.router.navigate(["fichaColegial"]);
    } else if (sessionStorage.getItem("busquedaSociedades")) {
      let body = JSON.parse(sessionStorage.getItem("busqueda"));
      sessionStorage.setItem("filtrosBusquedaSociedadesFichaSociedad", JSON.stringify(body));
      this.router.navigate(["searchNoColegiados"]);
    } else {
      this.router.navigate(["searchNoColegiados"]);
      /*} else {
        this.location.back();*/
    }
    // this.router.navigate(["searchNoColegiados"]);
  }

  getFichasPosibles() {
    return this.fichasPosibles;
  }
  datosTarjeta(event) {
    if (event) {
      this.datosTarjetaResumen = event;
    }
  }
  enlacesTarjeta(event) {
    if (event) {
      this.enlacesTarjetaResumen = event;
    }
  }
  isOpenReceive(event) {
    if (event) {
      this.openTarjeta = event;
    }
  }
  permisosEnlace(event) {
    if (event == "interes") {
      let pruebaTarjeta =
      {
        index: 0,
        label: "facturacion.tarjetas.literal.serviciosInteres",
        value: document.getElementById("sInteres"),
        nombre: "tarjetaInteres",
      };
      let findDato = this.enlacesTarjetaResumen.find(item => item.nombre == pruebaTarjeta.nombre);
      if (findDato == undefined) {
        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }
    }
    if (event == "datosGenerales") {
      let pruebaTarjeta1 =
      {
        index: 1,
        label: "general.message.datos.generales",
        value: document.getElementById("datosGen"),
        nombre: "datosGen",
      };
      let findDato = this.enlacesTarjetaResumen.find(item => item.nombre == pruebaTarjeta1.nombre);
      if (findDato == undefined) {
        this.enlacesTarjetaResumen.push(pruebaTarjeta1);
      }
    }

    if (event == "registrales") {
      let pruebaTarjeta2 =
      {
        index: 2,
        label: "pestana.fichaCliente.datosRegistrales",
        value: document.getElementById("sregistrales"),
        nombre: "registrales",
      };
      let findDato = this.enlacesTarjetaResumen.find(item => item.nombre == pruebaTarjeta2.nombre);
      if (findDato == undefined) {
        this.enlacesTarjetaResumen.push(pruebaTarjeta2);
      }
    }

    if (event == "notario") {
      let pruebaTarjeta3 =
      {
        index: 3,
        label: "censo.datosRegistrales.literal.titulo3",
        value: document.getElementById("snotario"),
        nombre: "notario",
      };
      let findDato = this.enlacesTarjetaResumen.find(item => item.nombre == pruebaTarjeta3.nombre);
      if (findDato == undefined) {
        this.enlacesTarjetaResumen.push(pruebaTarjeta3);
      }
    }

    if (event == "integrantes") {
      let pruebaTarjeta4 =
      {
        index: 4,
        label: "censo.datosRegistrales.literal.integrantes",
        value: document.getElementById("sintegrantes"),
        nombre: "integrantes",
      };
      let findDato = this.enlacesTarjetaResumen.find(item => item.nombre == pruebaTarjeta4.nombre);
      if (findDato == undefined) {
        this.enlacesTarjetaResumen.push(pruebaTarjeta4);
      }
    }

    if (event == "direcciones") {
      let pruebaTarjeta5 =
      {
        index: 5,
        label: "censo.fichaCliente.datosDirecciones.cabecera",
        value: document.getElementById("sdirecciones"),
        nombre: "direcciones",
      };
      let findDato = this.enlacesTarjetaResumen.find(item => item.nombre == pruebaTarjeta5.nombre);
      if (findDato == undefined) {
        this.enlacesTarjetaResumen.push(pruebaTarjeta5);
      }
    }

    if (event == "bancarios") {
      let pruebaTarjeta6 =
      {
        index: 6,
        label: "censo.consultaDatosBancarios.cabecera",
        value: document.getElementById("sdatosBancarios"),
        nombre: "bancarios",
      };
      let findDato = this.enlacesTarjetaResumen.find(item => item.nombre == pruebaTarjeta6.nombre);
      if (findDato == undefined) {
        this.enlacesTarjetaResumen.push(pruebaTarjeta6);
      }
    }
    if (event == "retenciones") {
      let pruebaTarjeta7 =
      {
        index: 7,
        label: "menu.justiciaGratuita.maestros.retenciones",
        value: document.getElementById("sretenciones"),
        nombre: "retenciones",
      };
      let findDato = this.enlacesTarjetaResumen.find(item => item.nombre == pruebaTarjeta7.nombre);
      if (findDato == undefined) {
        this.enlacesTarjetaResumen.push(pruebaTarjeta7);
      }
    }
    this.enlacesTarjetaResumen.sort((a, b) => a.index - b.index);

  }
}
