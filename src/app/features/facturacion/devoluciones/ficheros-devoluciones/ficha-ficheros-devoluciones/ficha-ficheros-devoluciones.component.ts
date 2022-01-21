import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { FicherosDevolucionesItem } from '../../../../../models/FicherosDevolucionesItem';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-ficha-ficheros-devoluciones',
  templateUrl: './ficha-ficheros-devoluciones.component.html',
  styleUrls: ['./ficha-ficheros-devoluciones.component.scss']
})
export class FichaFicherosDevolucionesComponent implements OnInit {

  openFicha: boolean = true;
  showTarjeta: boolean = true;
  progressSpinner: boolean = false;
  manuallyOpened: boolean;
  modoEdicion: boolean;
  muestraFacturacion: boolean = false;

  openTarjetaDatosCarga: boolean = true;
  openTarjetaFacturas: boolean = false;

  permisoEscrituraDatosGeneracion:boolean = true; //cambiar con los permisos
  permisoEscrituraFacturas: boolean = true; //cambiar con los permisos

  permisos;
  nuevo;

  enlacesTarjetaResumen = [];
  datosResumen = [];
  
  msgs: Message[] = [];

  body: FicherosDevolucionesItem = new FicherosDevolucionesItem();

  constructor(private translateService: TranslateService,
    private location: Location,
    private persistenceService: PersistenceService
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    if (sessionStorage.getItem("FicherosDevolucionesItem")) {
      this.body = JSON.parse(sessionStorage.getItem("FicherosDevolucionesItem")); 
      sessionStorage.removeItem("FicherosDevolucionesItem");

      this.persistenceService.setDatos(this.body);
      this.modoEdicion=true;

    } else if(this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();
      this.modoEdicion=true;

    } else if(sessionStorage.getItem("Nuevo")) {
      sessionStorage.removeItem("Nuevo");
      this.body = new FicherosDevolucionesItem();

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

  isCloseReceive(event) {
    if (event != undefined) {
      switch (event) {
        case "datosGeneracion":
          this.openTarjetaDatosCarga = this.manuallyOpened;
          break;
        case "facturas":
          this.openTarjetaFacturas = this.manuallyOpened;
          break;
      }
    }
  }

  isOpenReceive(event) {
    if (event != undefined) {
      switch (event) {
        case "datosGeneracion":
          this.openTarjetaDatosCarga = true;
          break;
        case "facturas":
          this.openTarjetaFacturas = true;
          break;
      }
    }
  }

  updateTarjetaResumen() {
    this.datosResumen = [
      {
        label: this.translateService.instant("administracion.grupos.literal.id"),
        value: this.body.idDisqueteDevoluciones
      },
      {
        label: this.translateService.instant("facturacion.seriesFactura.cuentaBancaria"),
        value: this.body.cuentaEntidad
      },
      {
        label: this.translateService.instant("informesycomunicaciones.comunicaciones.busqueda.fechaCreacion"),
        value: this.body.fechaCreacion
      },
    ];
  }

  updateEnlacesTarjetaResumen(){
    this.enlacesTarjetaResumen = [];

    this.enlacesTarjetaResumen.push({
      label: 'facturacionPyS.ficherosTransferencias.datosCarga',
      value: document.getElementById("datosCarga"),
      nombre: "descargarLog",
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacion.seriesFactura.bancoEntidad",
      value: document.getElementById("cuentaEntidad"),
      nombre: "cuentaEntidad",
    });

    this.enlacesTarjetaResumen.push({
      label: "menu.facturacion.facturas",
      value: document.getElementById("facturas"),
      nombre: "facturas",
    });
  }
}
