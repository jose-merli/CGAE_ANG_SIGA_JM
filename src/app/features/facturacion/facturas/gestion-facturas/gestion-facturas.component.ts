import { resolve } from '@angular-devkit/core';
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
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    this.body.idFactura = "128741";
    this.body.tipo = "FACTURA";

    //this.body.idFactura = "45020";
    //this.body.tipo = "ABONO";

    this.getDatosFactura(this.body.idFactura, this.body.tipo).then(() => {
      this.updateTarjetaResumen();
      setTimeout(() => {
        this.updateEnlacesTarjetaResumen();
      }, 5);

      this.goTop();
      this.progressSpinner = false;
    });
  }

  getDatosFactura(idFactura: string, tipo: string): Promise<any> {
    return this.sigaServices.getParam("facturacionPyS_getFactura", `?idFactura=${idFactura}&tipo=${tipo}`).toPromise().then(
      n => {
        let datos: FacturasItem[] = n.facturasItems;
        this.body = datos[0];

        console.log(this.body);
      }, err => { 
        return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
      }
    ).catch(error => {
      if (error != undefined) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), error);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    });
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
    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_guardaDatosFactura", event).toPromise().then(
      n => { }, err => { 
        return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
      }
    ).catch(error => {
      if (error != undefined) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), error);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    }).then(() => { 
      return this.getDatosFactura(this.body.idFactura, this.body.tipo); 
    }).then(() => this.progressSpinner = false);
  }

  refreshData(event: FacturasItem): void {
    this.progressSpinner = true;

    this.getDatosFactura(event.idFactura, event.tipo).then(() => this.progressSpinner = false);
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
