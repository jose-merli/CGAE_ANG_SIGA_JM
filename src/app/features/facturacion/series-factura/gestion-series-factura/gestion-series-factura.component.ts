import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../models/SeriesFacturacionItem';
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
  
  openTarjetaDatosGenerales: boolean = true

  datos;
  enlacesTarjetaResumen;

  constructor(
    private translateService: TranslateService,
    private persistenceService: PersistenceService
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    if (sessionStorage.getItem("serieFacturacionItem")) {
      this.body = JSON.parse(sessionStorage.getItem("serieFacturacionItem"));
      sessionStorage.removeItem("serieFacturacionItem");
      
      this.updateTarjetaResumen();
      this.updateEnlacesTarjetaResumen();
    }

    this.progressSpinner = false;
  }

  // Tarjeta resumen

  updateTarjetaResumen(): void {

    this.datos = [
      {
        label: "Abreviatura",
        value: this.body.abreviatura
      },
      {
        label: "Descripción",
        value: this.body.descripcion
      },
      {
        label: "Cuenta Entidad",
        value: "(..." + this.body.cuentaBancaria.slice(-4) + ")"
      },
      {
        label: "Sufijos",
        value: this.body.sufijo
      },
      {
        label: "Activo",
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
      label: "Observaciones", // Internacionalizar
      value: document.getElementById("observaciones"),
      nombre: "observaciones",
    });

    this.enlacesTarjetaResumen.push({
      label: "Destinatarios por etiquetas", // Internacionalizar
      value: document.getElementById("destinatariosEtiquetas"),
      nombre: "destinatariosEtiquetas",
    });

    this.enlacesTarjetaResumen.push({
      label: "Destinatarios individuales", // Internacionalizar
      value: document.getElementById("destinatariosIndividuales"),
      nombre: "destinatariosIndividuales",
    });

    this.enlacesTarjetaResumen.push({
      label: "Lista de destinatarios", // Internacionalizar
      value: document.getElementById("destinatarios"),
      nombre: "destinatarios",
    });

    this.enlacesTarjetaResumen.push({
      label: "Pago automático", // Internacionalizar
      value: document.getElementById("pagoAutomatico"),
      nombre: "pagoAutomatico",
    });

    this.enlacesTarjetaResumen.push({
      label: "Contador de facturas", // Internacionalizar
      value: document.getElementById("contadorFacturas"),
      nombre: "contadorFacturas",
    });

    this.enlacesTarjetaResumen.push({
      label: "Contador de facturas rectificativas", // Internacionalizar
      value: document.getElementById("contadorFacturasRectificativas"),
      nombre: "contadorFacturasRectificativas",
    });

    this.enlacesTarjetaResumen.push({
      label: "Generación de ficheros de factura", // Internacionalizar
      value: document.getElementById("generacionFicherosFactura"),
      nombre: "generacionFicherosFactura",
    });

    this.enlacesTarjetaResumen.push({
      label: "Envío de facturas automático", // Internacionalizar
      value: document.getElementById("envioFacturaAutomatico"),
      nombre: "envioFacturaAutomatico",
    });

    this.enlacesTarjetaResumen.push({
      label: "Traspaso de facturas automático a servicio externo", // Internacionalizar
      value: document.getElementById("traspasoFacturaAutomatico"),
      nombre: "traspasoFacturaAutomatico",
    });

    this.enlacesTarjetaResumen.push({
      label: "Exportación Contabilidad", // Internacionalizar
      value: document.getElementById("exportacionContabilidad"),
      nombre: "exportacionContabilidad",
    });

  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
}
