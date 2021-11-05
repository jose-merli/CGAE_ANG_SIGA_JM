import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../commons/translate';
import { CuentasBancariasItem } from '../../../../models/CuentasBancariasItem';
import { PersistenceService } from '../../../../_services/persistence.service';

@Component({
  selector: 'app-ficha-cuenta-bancaria',
  templateUrl: './ficha-cuenta-bancaria.component.html',
  styleUrls: ['./ficha-cuenta-bancaria.component.scss']
})
export class FichaCuentaBancariaComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  iconoTarjetaResumen = "clipboard";
  body: CuentasBancariasItem = new CuentasBancariasItem();
  datos = [];
  enlacesTarjetaResumen;

  manuallyOpened: boolean;
  openTarjetaDatosGenerales: boolean = true;
  openTarjetaComision: boolean = false;
  openTarjetaConfiguracion: boolean = false;
  openTarjetaUsoFicheros: boolean = false;
  openTarjetaUsosSufijos: boolean = false;

  constructor(
    private location: Location,
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    if (sessionStorage.getItem("cuentaBancariaItem")) {
      this.body = JSON.parse(sessionStorage.getItem("cuentaBancariaItem"));
      sessionStorage.removeItem("cuentaBancariaItem");
      this.persistenceService.setDatos(this.body);
    } else {
      this.body = this.persistenceService.getDatos();
    }

    this.updateTarjetaResumen();
    this.updateEnlacesTarjetaResumen();

    this.progressSpinner = false;
    this.goTop();
  }

  // Tarjeta resumen

  updateTarjetaResumen(): void {
    this.datos = [
      {
        label: this.translateService.instant("administracion.parametrosGenerales.literal.nombre"),
        value: this.body.nombre
      },
      {
        label: this.translateService.instant("enviosMasivos.literal.descripcion"),
        value: this.body.descripcion
      },
      {
        label: this.translateService.instant("facturacionSJCS.facturacionesYPagos.iban"),
        value: this.body.IBAN
      },
      {
        label: this.translateService.instant("menu.justiciaGratuita"),
        value: this.body.sjcs
      }
    ]
  }

  updateEnlacesTarjetaResumen(): void {
    this.enlacesTarjetaResumen = [];

    // Por terminar
    this.enlacesTarjetaResumen.push({
      label: "general.message.datos.generales",
      value: document.getElementById("datosGenerales"),
      nombre: "datosGenerales",
    });

  }

  guardadoSend(): void {
    this.router.navigate(["/datosSeriesFactura"]);
  }

  // Abrir tarjetas desde enlaces
  isOpenReceive(event) {
    if (event != undefined) {
      switch (event) {
        case "datosGenerales":
          this.openTarjetaDatosGenerales = true;
          break;
        case "comision":
          this.openTarjetaComision = true;
          break;
        case "configuracion":
          this.openTarjetaConfiguracion = true;
          break;
        case "usoFicheros":
          this.openTarjetaUsoFicheros = true;
          break;
        case "usosSufijos":
          this.openTarjetaUsosSufijos = true;
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
        case "comision":
          this.openTarjetaComision = this.manuallyOpened;
          break;
        case "configuracion":
          this.openTarjetaConfiguracion = this.manuallyOpened;
          break;
        case "usoFicheros":
          this.openTarjetaUsoFicheros = this.manuallyOpened;
          break;
        case "usosSufijos":
          this.openTarjetaUsosSufijos = this.manuallyOpened;
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

  goTop() {
    document.children[document.children.length - 1]
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }

  backTo() {
    this.location.back();
  }
}
