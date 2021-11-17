import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateService } from '../../../../commons/translate';
import { FicherosAdeudosItem } from '../../../../models/sjcs/FicherosAdeudosItem';
import { PersistenceService } from '../../../../_services/persistence.service';

@Component({
  selector: 'app-gestion-adeudos',
  templateUrl: './gestion-adeudos.component.html',
  styleUrls: ['./gestion-adeudos.component.scss']
})
export class GestionAdeudosComponent implements OnInit {

  openFicha: boolean = true;
  showTarjeta: boolean = true;
  progressSpinner: boolean = false;
  manuallyOpened: boolean;
  modoEdicion: boolean;

  openTarjetaDatosGeneracion: boolean = true;
  openTarjetaFacturas: boolean = false;

  permisoEscrituraDatosGeneracion:boolean = true; //cambiar con los permisos
  permisoEscrituraFacturas: boolean = true; //cambiar con los permisos

  permisos;
  nuevo;
  msgs;

  enlacesTarjetaResumen = [];
  datosResumen = [];
  
  body: FicherosAdeudosItem;

  constructor(private translateService: TranslateService,
    private location: Location,
    private persistenceService: PersistenceService) { }

  async ngOnInit() {
    this.progressSpinner = true;

    if (sessionStorage.getItem("FicherosAdeudosItem")) {
      this.body = JSON.parse(sessionStorage.getItem("FicherosAdeudosItem")); 
      sessionStorage.removeItem("FicherosAdeudosItem");

      this.persistenceService.setDatos(this.body);
      this.modoEdicion=true;

    } else if(this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();
      this.modoEdicion=true;

    } else if(sessionStorage.getItem("Nuevo")) {
      sessionStorage.removeItem("Nuevo");
      this.body = new FicherosAdeudosItem();

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

  goTop() {
    document.children[document.children.length - 1]
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
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

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  backTo() {
    this.location.back();
  }


  isCloseReceive(event) {
    if (event != undefined) {
      switch (event) {
        case "datosGeneracion":
          this.openTarjetaDatosGeneracion = this.manuallyOpened;
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
          this.openTarjetaDatosGeneracion = true;
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
        value: this.body.idDisqueteCargos
      },
      {
        label: this.translateService.instant("informesycomunicaciones.comunicaciones.busqueda.fechaCreacion"),
        value: this.body.fechaCreacion
      },
      {
        label: this.translateService.instant("facturacionPyS.ficherosAdeudos.serie"),
        value: this.body.nombreabreviado
      },
      {
        label: this.translateService.instant("menu.facturacion"),
        value: this.body.facturacion
      },
      {
        label: this.translateService.instant("facturacion.seriesFactura.cuentaBancaria"),
        value: this.body.cuentaEntidad
      },
      {
        label: this.translateService.instant("administracion.parametrosGenerales.literal.sufijo"),
        value: this.body.sufijo
      },
    ];
  }

  updateEnlacesTarjetaResumen(){
    this.enlacesTarjetaResumen = [];

    this.enlacesTarjetaResumen.push({
      label: 'facturacionPyS.ficherosAdeudos.datosGeneracion',
      value: document.getElementById("datosGeneracion"),
      nombre: "datosGeneracion",
    });

    this.enlacesTarjetaResumen.push({
      label: "menu.facturacion",
      value: document.getElementById("facturacion"),
      nombre: "facturacion",
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
