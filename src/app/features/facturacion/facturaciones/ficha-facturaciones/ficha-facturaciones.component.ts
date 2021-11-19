import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { CuentasBancariasItem } from '../../../../models/CuentasBancariasItem';
import { FacFacturacionprogramadaItem } from '../../../../models/FacFacturacionprogramadaItem';

@Component({
  selector: 'app-ficha-facturaciones',
  templateUrl: './ficha-facturaciones.component.html',
  styleUrls: ['./ficha-facturaciones.component.scss']
})
export class FichaFacturacionesComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  iconoTarjetaResumen = "clipboard";
  body: FacFacturacionprogramadaItem = new FacFacturacionprogramadaItem();
  datos = [];
  enlacesTarjetaResumen = [];

  modoEdicion: boolean = true;

  manuallyOpened: boolean;
  openTarjetaDatosGenerales: boolean = true;
  openTarjetaSerieFacturacion: boolean = false;
  openTarjetaGenFicheroAdeudos: boolean = false;
  openTarjetaInfoFacturacion: boolean = false;
  openTarjetaGenFicheroFacturas: boolean = false;
  openTarjetaEnvio: boolean = false;
  openTarjetaTraspaso: boolean = false;

  constructor(
    private translateService: TranslateService,
    private location: Location
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    if (sessionStorage.getItem("facturacionProgramadaItem")) {
      this.body = JSON.parse(sessionStorage.getItem("facturacionProgramadaItem"));
      sessionStorage.removeItem("facturacionProgramadaItem");
    } else if(sessionStorage.getItem("Nuevo")) {
      sessionStorage.removeItem("Nuevo");
      this.modoEdicion = false;
    }

    if (this.modoEdicion) {
      this.updateTarjetaResumen();
    }

    setTimeout(() => {
      this.updateEnlacesTarjetaResumen();
    }, 5);

    this.progressSpinner = false;
    this.goTop();
  }

  // Tarjeta resumen

  updateTarjetaResumen(): void {
    this.datos = [
      {
        label: "Serie Facturación",
        value: this.body.nombreAbreviado
      },
      {
        label: this.translateService.instant("enviosMasivos.literal.descripcion"),
        value: this.body.descripcion
      },
      {
        label: "Estado",
        value: this.body.estadoConfirmacion
      },
      {
        label: "Importe",
        value: this.body.importe
      }
    ]
  }

  updateEnlacesTarjetaResumen(): void {
    this.enlacesTarjetaResumen = [];

    this.enlacesTarjetaResumen.push({
      label: "general.message.datos.generales",
      value: document.getElementById("datosGenerales"),
      nombre: "datosGenerales",
    });

  }

  // Abrir tarjetas desde enlaces
  isOpenReceive(event) {
    if (event != undefined) {
      switch (event) {
        case "datosGenerales":
          this.openTarjetaDatosGenerales = true;
          break;
        case "serieFacturacion":
          this.openTarjetaSerieFacturacion = true;
          break;
        case "genFicheroAdeudos":
          this.openTarjetaGenFicheroAdeudos = true;
          break;
        case "infoFacturacion":
          this.openTarjetaInfoFacturacion = true;
          break;
        case "genFicheroFacturas":
          this.openTarjetaGenFicheroFacturas = true;
          break;
        case "envio":
          this.openTarjetaEnvio = true;
          break;
        case "traspaso":
          this.openTarjetaTraspaso = true;
          break;
      }
    }
  }

  // Abrir y cerrar manualmente las tarjetas
  isCloseReceive(event) {
    if (event != undefined) {
      switch (event) {
        case "datosGenerales":
          this.openTarjetaDatosGenerales = this.manuallyOpened;
          break;
        case "serieFacturacion":
          this.openTarjetaSerieFacturacion = this.manuallyOpened;
          break;
        case "genFicheroAdeudos":
          this.openTarjetaGenFicheroAdeudos = this.manuallyOpened;
          break;
        case "infoFacturacion":
          this.openTarjetaInfoFacturacion = this.manuallyOpened;
          break;
        case "genFicheroFacturas":
          this.openTarjetaGenFicheroFacturas = this.manuallyOpened;
          break;
        case "envio":
          this.openTarjetaEnvio = this.manuallyOpened;
          break;
        case "traspaso":
          this.openTarjetaTraspaso = this.manuallyOpened;
          break;
      }
    }
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

  goTop() {
    document.children[document.children.length - 1]
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }

  backTo() {
    sessionStorage.setItem("volver", "true");
    this.location.back();
  }

}
