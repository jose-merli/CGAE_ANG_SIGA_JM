import { Location } from '@angular/common';
import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { Subject } from 'rxjs';
import { TranslateService } from '../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';

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
  enlacesTarjetaResumen = [];
  modoEdicion: boolean = true;

  // Evento para resaltar abreviatura o descripción
  campoResaltado: Subject<string> = new Subject<string>();

  constructor(
    private translateService: TranslateService,
    private location: Location,
    private sigaServices: SigaServices,
    private commonsService: CommonsService
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    if (sessionStorage.getItem("serieFacturacionItem")) {
      this.body = JSON.parse(sessionStorage.getItem("serieFacturacionItem"));
      sessionStorage.removeItem("serieFacturacionItem");
    } else if(sessionStorage.getItem("Nuevo")) {
      sessionStorage.removeItem("Nuevo");
      this.body = new SerieFacturacionItem();
      this.modoEdicion = false;
    } else if (this.modoEdicion && this.body.idSerieFacturacion == undefined) {
      this.location.back();
    }

    if (this.modoEdicion) {
      this.updateTarjetaResumen();
    }

    setTimeout(() => {
      this.updateEnlacesTarjetaResumen();
    }, 5);

    this.progressSpinner = false;
    this.goTop();

    // Scroll a destinatarios individuales
    if (sessionStorage.getItem("destinatarioIndv")) {
      this.openTarjetaDestinatariosIndividuales = true;
      setTimeout(() => {
        document.getElementById("destinatariosIndividuales").scrollIntoView({ block: "center", behavior: 'smooth',inline: "start" });
      }, 5);
    }
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
        value: this.body.cuentaBancaria
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

  guardadoSend(event: SerieFacturacionItem): void {
    this.progressSpinner = true;

    this.guardarSerieFacturacion(event)
    .then(() => { return this.recuperarDatosSerieFacuturacion().then(() => {
      this.modoEdicion = true;
      this.updateTarjetaResumen();
      setTimeout(() => {
        this.updateEnlacesTarjetaResumen();
      }, 5);
    })}).catch(error => {
      if (error != undefined) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), error);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    }).then(() => this.progressSpinner = false);
    
  }

  refreshData(): void {
    this.progressSpinner = true;

    this.recuperarDatosSerieFacuturacion().then(() => {

      if (this.body.idSerieFacturacion == undefined) {
        this.modoEdicion = false;
      } else {
        this.modoEdicion = true;
      }

      this.updateTarjetaResumen();
      setTimeout(() => {
        this.updateEnlacesTarjetaResumen();
      }, 5);
    }).catch(error => {
      if (error != undefined) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), error);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    }).then(() => {
      this.progressSpinner = false;
      if (this.body == undefined) {
        this.location.back();
      }
    });
    
  }

  guardarSerieFacturacion(serie: SerieFacturacionItem): Promise<any> {
    return this.sigaServices.post("facturacionPyS_guardarSerieFacturacion", serie).toPromise().then(
      n => {
        let idSerieFacturacion = JSON.parse(n.body).id;
        this.body.idSerieFacturacion = idSerieFacturacion;

        this.campoResaltado.next("");
      },
      err => {
        let error = JSON.parse(err.error).error;

        if (error.message == "facturacion.seriesFactura.abreviatura.unica") {
          this.campoResaltado.next("abreviatura");
        } else if (error.message == "facturacion.seriesFactura.descripcion.unica") {
          this.campoResaltado.next("descripcion");
        } else {
          this.campoResaltado.next("");
        }

        if (error != undefined && error.message != undefined) {
          let translatedError = this.translateService.instant(error.message);
          if (translatedError && translatedError.trim().length != 0) {
            return Promise.reject(translatedError);
          }
        }

        return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  recuperarDatosSerieFacuturacion(): Promise<any> {
    let filtros = new SerieFacturacionItem();
    filtros.idSerieFacturacion = this.body.idSerieFacturacion;
    
    return this.sigaServices.post("facturacionPyS_getSeriesFacturacion", filtros).toPromise().then(
      n => {
        let datos: SerieFacturacionItem[] = JSON.parse(n.body).serieFacturacionItems;

        if (datos.length != 0) {
          this.body = datos.find(d => d.idSerieFacturacion == this.body.idSerieFacturacion);
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        } else {
          this.modoEdicion = false;
          this.body = undefined;
          return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
        }
      },
      err => {
        return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
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

  clear() {
    this.msgs = [];
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
    sessionStorage.setItem("volver", "true");
    this.location.back();
  }
}
