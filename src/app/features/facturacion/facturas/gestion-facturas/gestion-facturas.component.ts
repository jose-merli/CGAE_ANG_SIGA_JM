import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
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
  body: FacturasItem;
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
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    if (sessionStorage.getItem("facturasItem")) {
      this.body = JSON.parse(sessionStorage.getItem("facturasItem"));
      sessionStorage.removeItem("facturasItem");
    } else if (sessionStorage.getItem("Nuevo")) {
      sessionStorage.removeItem("Nuevo");
      this.body = new FacturasItem();
    } else if (this.body == undefined || this.body.idFactura == undefined || this.body.tipo == undefined) {
      this.progressSpinner = false;
      this.location.back();
    }
    
    if (this.body != undefined) {
      this.getDatosFactura(this.body.idFactura, this.body.tipo).catch(error => {
        if (error != undefined) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), error);
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      }).then(() => {
        this.updateTarjetaResumen();
        setTimeout(() => {
          this.updateEnlacesTarjetaResumen();
        }, 5);
  
        this.goTop();
        this.progressSpinner = false;
      });
    }
  }

  getDatosFactura(idFactura: string, tipo: string): Promise<any> {
    return this.sigaServices.getParam("facturacionPyS_getFactura", `?idFactura=${idFactura}&tipo=${tipo}`).toPromise().then(
      n => {
        let datos: FacturasItem[] = n.facturasItems;

        if (datos == undefined || datos.length == 0) {
          return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
        }

        this.body = datos[0];
      }, err => { 
        return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
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
        value: this.transformDate(this.body.fechaEmision)
      },
      {
        label: "Cliente",
        value: `${this.body.nombre} ${this.body.apellidos}`
      },
      {
        label: "Importe Total",
        value: `${this.body.importefacturado} €`
      }
    ]
  }

  updateEnlacesTarjetaResumen(): void {
    this.enlacesTarjetaResumen = [];

    this.enlacesTarjetaResumen.push({
      label: "facturacion.productos.Cliente",
      value: document.getElementById("cliente"),
      nombre: "cliente",
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacionSJCS.tarjGenFac.facturacion",
      value: document.getElementById("facturacion"),
      nombre: "facturacion",
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacion.facturas.deudor.literal",
      value: document.getElementById("deudor"),
      nombre: "deudor",
    });

    this.enlacesTarjetaResumen.push({
      label: "general.message.datos.generales",
      value: document.getElementById("datosGenerales"),
      nombre: "datosGenerales",
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacion.facturas.estadosPagos.literal",
      value: document.getElementById("estadosPagos"),
      nombre: "estadosPagos",
    });

    if (this.body.tipo == "FACTURA") {
      this.enlacesTarjetaResumen.push({
        label: "facturacion.facturas.observaciones.literal",
        value: document.getElementById("observaciones"),
        nombre: "observaciones",
      });
    } else {
      this.enlacesTarjetaResumen.push({
        label: "facturacion.facturas.observacionesRect.literal",
        value: document.getElementById("observacionesRectificativa"),
        nombre: "observacionesRectificativa",
      });
    }

    this.enlacesTarjetaResumen.push({
      label: this.body.tipo == "FACTURA" ? "facturacion.facturas.lineas.literal" : "facturacion.facturas.lineasRect.literal",
      value: document.getElementById("lineas"),
      nombre: "lineas",
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacion.facturas.comunicacionesCobrosRecobros",
      value: document.getElementById("comunicaciones"),
      nombre: "comunicaciones",
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
    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_guardaDatosFactura", event).toPromise().then(
      n => { }, err => { 
        return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
      }
    ).then(() => { 
      return this.getDatosFactura(this.body.idFactura, this.body.tipo); 
    }).then(() => {
      this.updateTarjetaResumen();
      setTimeout(() => {
        this.updateEnlacesTarjetaResumen();
      }, 5);
      
      this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
    }).catch(error => {
      if (error != undefined) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), error);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    }).then(() => this.progressSpinner = false);
  }

  refreshData(event: FacturasItem): void {
    this.progressSpinner = true;

    this.getDatosFactura(event.idFactura, event.tipo).catch(error => {
      if (error != undefined) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), error);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    }).then(() => {
      this.updateTarjetaResumen();
      setTimeout(() => {
        this.updateEnlacesTarjetaResumen();
      }, 5);
      
      this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
      this.progressSpinner = false;
      
    });
  }

  // Transformar fecha
  transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);
    else
      fecha = null;
    fecha = this.datepipe.transform(fecha, 'dd/MM/yyyy');
    return fecha;
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
