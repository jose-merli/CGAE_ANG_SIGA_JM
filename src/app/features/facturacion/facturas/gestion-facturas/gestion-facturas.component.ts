import { resolve } from '@angular-devkit/core';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/primeng';
import { FacturasItem } from '../../../../models/FacturasItem';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-gestion-facturas',
  templateUrl: './gestion-facturas.component.html',
  styleUrls: ['./gestion-facturas.component.scss']
})
export class GestionFacturasComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  iconoTarjetaResumen = "clipboard";
  body: FacturasItem = new FacturasItem();
  datos = [];
  enlacesTarjetaResumen = [];

  manuallyOpened: boolean;
  openTarjetaDatosGenerales: boolean = true;
  openTarjetaEstadosPagos: boolean = false;
  openTarjetaObservaciones: boolean = false;
  openTarjetaObservacionesRectificativa: boolean = false;
  openTarjetaLineas: boolean = false;
  openTarjetaComunicaciones: boolean = false;

  constructor(
    private location: Location,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {
    this.getDatosFactura();
  }

  getDatosFactura(): void {
    //this.progressSpinner = true;

    let filtros = {};

    /*this.sigaServices.post("facturacionPyS_getFacturas", filtros).toPromise().then(
      n => {
        let datos: FacturasItem[] = n.facturaItems;
        this.body = datos[0];

        console.log(this.body);
      }, err => { }
    )*/
    this.body = {
      idFactura: "128741",
      numeroFactura: null,
      estado: "En revisión",
      formaCobroFactura: null,
      formaCobroAbono: null,
      numeroAbonoSJCS: null,
      fechaEmision: null,
      fechaEmisionDesde: null,
      fechaEmisionHasta: null,
      importefacturado: "101.58",
      importefacturadoDesde: null,
      importefacturadoHasta: null,
      contabilizado: null,
      serie: null,
      facturacion: "CERTIFICADOS NI JULIO 2016",
      identificadorAdeudos: null,
      identificadorTransferencia: null,
      identificadorDevolucion: null,
      numeroColegiado: null,
      numeroIdentificacion: null,
      apellidos: "XTREFNRAPOPEQMYBF IJISDVL",
      nombre: "JULIAN",
      facturasPendientesDesde: null,
      facturasPendientesHasta: null,
      importeAdeudadoPendiente: "101.58",
      importeAdeudadoHasta: null,
      importeAdeudadoDesde: null,
      comunicacionesFacturas: "0",
      comunicacionesFacturasHasta: null,
      comunicacionesFacturasDesde: null,
      tipo: "FACTURA",
      ultimaComunicacion: null,
      nombreInstitucion: null,
      importePagado: null,
      observacionesFactura: null,
      observacionesFicheroFactura: null,
      observacionesAbono: null,
      motivosAbono: null
    };

    
    
    /*.then(() => {
      this.updateTarjetaResumen();
      setTimeout(() => {
        this.updateEnlacesTarjetaResumen();
      }, 5);

      this.goTop();
      this.progressSpinner = false;
    });*/
  }

  // Tarjeta resumen

  updateTarjetaResumen(): void {
    this.datos = [
      {
        label: "Número Factura",
        value: this.body.numeroFactura
      },
      {
        label: "Fecha Emisión",
        value: this.body.fechaEmision
      },
      {
        label: "Cliente",
        value: ""
      },
      {
        label: "Importe Total",
        value: this.body.importefacturado
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
        case "estadosPagos":
          this.openTarjetaEstadosPagos = true;
          break;
        case "observaciones":
          this.openTarjetaObservaciones = true;
          break;
        case "observacionesRectificativa":
          this.openTarjetaObservacionesRectificativa = true;
          break;
        case "lineas":
          this.openTarjetaLineas = true;
          break;
        case "comunicaciones":
          this.openTarjetaComunicaciones = true;
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
        case "estadosPagos":
          this.openTarjetaEstadosPagos = this.manuallyOpened;
          break;
        case "observaciones":
          this.openTarjetaObservaciones = this.manuallyOpened;
          break;
        case "observacionesRectificativa":
          this.openTarjetaObservacionesRectificativa = this.manuallyOpened;
          break;
        case "lineas":
          this.openTarjetaLineas = this.manuallyOpened;
          break;
        case "comunicaciones":
          this.openTarjetaComunicaciones = this.manuallyOpened;
          break;
      }
    }
  }

  // Función para guardar o actualizar

  guardadoSend(event: FacturasItem): void {

  }

  // Funciones de utilidad

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
