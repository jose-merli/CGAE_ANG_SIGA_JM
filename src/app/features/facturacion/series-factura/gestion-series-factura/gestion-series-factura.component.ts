import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../models/SerieFacturacionItem';
import { PersistenceService } from '../../../../_services/persistence.service';

@Component({
  selector: 'app-gestion-series-factura',
  templateUrl: './gestion-series-factura.component.html',
  styleUrls: ['./gestion-series-factura.component.scss']
})
export class GestionSeriesFacturaComponent implements OnInit {

  msgs: Message[];
  progressSpinner: boolean = false;
  
  iconoTarjetaResumen = "clipboard";
  body: SerieFacturacionItem = new SerieFacturacionItem();

  manuallyOpened: boolean;

  tarjetaDatosGenerales: string;
  
  openTarjetaDatosGenerales: boolean = true;
  openTarjetaObservaciones: boolean = false;
  openTarjetaDestinatariosEtiquetas: boolean = false;
  openTarjetaDestinatariosIndividuales: boolean = false;
  openTarjetaListaDestinatarios: boolean = false;
  openTarjetaPagoAutomatico: boolean = false;
  openTarjetaContadorFacturas: boolean = false;
  openTarjetaContadorFacturasRectificativas: boolean = false;
  openTarjetaGeneracion: boolean = false;
  openTarjetaEnvioFacturas: boolean = false;
  openTarjetaTraspasoFacturas: boolean = false;
  openTarjetaExportacionContabilidad: boolean = false;


  datos = [];
  enlacesTarjetaResumen;
  modoEdicion: boolean = true;

  constructor(
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    if (sessionStorage.getItem("serieFacturacionItem")) {
      this.body = JSON.parse(sessionStorage.getItem("serieFacturacionItem"));
      sessionStorage.removeItem("serieFacturacionItem");
      this.persistenceService.setDatos(this.body);
    } else if(this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();
    } else if(sessionStorage.getItem("Nuevo")) {
      sessionStorage.removeItem("Nuevo");
      this.body = new SerieFacturacionItem();
      this.modoEdicion = false;
    }

    if (this.modoEdicion) {
      this.updateTarjetaResumen();
    }
    
    this.updateEnlacesTarjetaResumen();

    this.progressSpinner = false;
    this.goTop();
  }

  // Tarjeta resumen

  updateTarjetaResumen(): void {

    this.datos = [
      {
        label: this.translateService.instant("gratuita.definirTurnosIndex.literal.abreviatura"),
        value: this.body.abreviatura
      },
      {
        label: this.translateService.instant("general.description"),
        value: this.body.descripcion
      },
      {
        label: this.translateService.instant("facturacion.seriesFactura.cuentaBancaria"),
        value: "(..." + this.body.cuentaBancaria.slice(-4) + ")"
      },
      {
        label: this.translateService.instant("facturacionSJCS.facturacionesYPagos.sufijo"),
        value: this.body.sufijo
      },
      {
        label: this.translateService.instant("administracion.usuarios.literal.activo"),
        value: this.body.fechaBaja == null ? "Sí" : "No"
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

    this.enlacesTarjetaResumen.push({
      label: "justiciaGratuita.remesasResultados.tabla.observaciones",
      value: document.getElementById("observaciones"),
      nombre: "observaciones",
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacion.seriesFactura.destEtiquetas",
      value: document.getElementById("destinatariosEtiquetas"),
      nombre: "destinatariosEtiquetas",
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacion.seriesFactura.destIndividuales",
      value: document.getElementById("destinatariosIndividuales"),
      nombre: "destinatariosIndividuales",
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacion.seriesFactura.destLista",
      value: document.getElementById("destinatariosLista"),
      nombre: "destinatariosLista",
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacion.seriesFactura.pagos.literal",
      value: document.getElementById("pagoAutomatico"),
      nombre: "pagoAutomatico",
    });
    
    this.enlacesTarjetaResumen.push({
      label: "facturacion.seriesFactura.contFact.literal",
      value: document.getElementById("contadorFacturas"),
      nombre: "contadorFacturas",
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacion.seriesFactura.contFactRect.literal",
      value: document.getElementById("contadorFacturasRectificativas"),
      nombre: "contadorFacturasRectificativas",
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacion.seriesFactura.generarPDF.literal",
      value: document.getElementById("generacion"),
      nombre: "generacion",
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacion.seriesFactura.envioFact.literal",
      value: document.getElementById("envioFacturas"),
      nombre: "envioFacturas",
    });
  
    this.enlacesTarjetaResumen.push({
      label: "facturacion.seriesFactura.traspaso.literal",
      value: document.getElementById("traspasoFacturas"),
      nombre: "traspasoFacturas",
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacion.seriesFactura.export.literal",
      value: document.getElementById("exportacionContabilidad"),
      nombre: "exportacionContabilidad",
    });

  }

  guardadoSend(): void {
    this.modoEdicion = true;
    this.ngOnInit();
    //this.router.navigate(["/datosSeriesFactura"]);
  }

  // Abrir tarjetas desde enlaces
  isOpenReceive(event) {

    if (event != undefined) {
      switch (event) {
        case "datosGenerales":
          this.openTarjetaDatosGenerales = true;
          break;
        case "observaciones":
          this.openTarjetaObservaciones = true;
          break;
        case "destinatariosEtiquetas":
          this.openTarjetaDestinatariosEtiquetas = true;
          break;
        case "destinatariosIndividuales":
          this.openTarjetaDestinatariosIndividuales = true;
          break;
        case "destinatariosLista":
          this.openTarjetaListaDestinatarios = true;
          break;
        case "pagoAutomatico":
          this.openTarjetaPagoAutomatico = true;
          break;
        case "contadorFacturas":
          this.openTarjetaContadorFacturas = true;
          break;
        case "contadorFacturasRectificativas":
          this.openTarjetaContadorFacturasRectificativas = true;
          break;
        case "generacion":
          this.openTarjetaGeneracion = true;
          break;
        case "envioFacturas":
          this.openTarjetaEnvioFacturas = true;
          break;
        case "traspasoFacturas":
          this.openTarjetaTraspasoFacturas = true;
          break;
        case "exportacionContabilidad":
          this.openTarjetaExportacionContabilidad = true;
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
        case "observaciones":
          this.openTarjetaObservaciones = this.manuallyOpened;
          break;
        case "destinatariosEtiquetas":
          this.openTarjetaDestinatariosEtiquetas = this.manuallyOpened;
          break;
        case "destinatariosIndividuales":
          this.openTarjetaDestinatariosIndividuales = this.manuallyOpened;
          break;
        case "destinatariosLista":
          this.openTarjetaListaDestinatarios = this.manuallyOpened;
          break;
        case "pagoAutomatico":
          this.openTarjetaPagoAutomatico = this.manuallyOpened;
          break;
        case "contadorFacturas":
          this.openTarjetaContadorFacturas = this.manuallyOpened;
          break;
        case "contadorFacturasRectificativas":
          this.openTarjetaContadorFacturasRectificativas = this.manuallyOpened;
          break;
        case "generacion":
          this.openTarjetaGeneracion = this.manuallyOpened;
          break;
        case "envioFacturas":
          this.openTarjetaEnvioFacturas = this.manuallyOpened;
          break;
        case "traspasoFacturas":
          this.openTarjetaTraspasoFacturas = this.manuallyOpened;
          break;
        case "exportacionContabilidad":
          this.openTarjetaExportacionContabilidad = this.manuallyOpened;
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
