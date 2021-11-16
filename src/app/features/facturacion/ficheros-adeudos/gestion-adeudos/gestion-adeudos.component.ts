import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../commons/translate';
import { FicherosAdeudosItem } from '../../../../models/sjcs/FicherosAdeudosItem';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';

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

  permisos;
  nuevo;
  msgs;
  permisoEscrituraResumen;

  enlacesTarjetaResumen = [];
  datosResumen = [];
  
  datos: FicherosAdeudosItem;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private location: Location,
    private persistenceService: PersistenceService,
    private router: Router,
    private commonsService: CommonsService) { }

  async ngOnInit() {
    this.progressSpinner = true;

    if (sessionStorage.getItem("FicherosAdeudosItem")) {
      this.datos = JSON.parse(sessionStorage.getItem("FicherosAdeudosItem")); 
      sessionStorage.removeItem("FicherosAdeudosItem");

      this.modoEdicion=true;
    }else{
      this.modoEdicion=false;
    }

    this.goTop();
    this.updateTarjResumen(this.datos);
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

  enviarEnlacesTarjeta() {
    this.enlacesTarjetaResumen = []

    let tarjeta;

    setTimeout(() => {

      tarjeta = {
          label: "facturacionPyS.ficherosAdeudos.datosGeneracion",
          value: document.getElementById("datosGeneracion"),
          nombre: "datosGeneracion",
        };

        this.enlacesTarjetaResumen.push(tarjeta);
    }, 5)
    this.progressSpinner = false;
  }

  isCloseReceive(event) {
    if (event != undefined) {
      switch (event) {
        case "datosGeneracion":
          this.openTarjetaDatosGeneracion = this.manuallyOpened;
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
      }
    }
  }

  updateTarjResumen(event) {
    this.datosResumen = [
      {
        label: this.translateService.instant("administracion.grupos.literal.id"),
        value: (event.idDisqueteCargos!=undefined ? event.idDisqueteCargos : undefined)
      },
      {
        label: this.translateService.instant("informesycomunicaciones.comunicaciones.busqueda.fechaCreacion"),
        value: (event.fechaCreacion!=undefined ? event.fechaCreacion : undefined)
      },
      {
        label: this.translateService.instant("facturacionPyS.ficherosAdeudos.serie"),
        value: (event.nombreabreviado!=undefined ? event.nombreabreviado : undefined)
      },
      {
        label: this.translateService.instant("menu.facturacion"),
        value: (event.facturacion!=undefined ? event.facturacion : undefined)
      },
      {
        label: this.translateService.instant("facturacion.seriesFactura.cuentaBancaria"),
        value: (event.cuentaEntidad!=undefined ? event.cuentaEntidad : undefined)
      },
      {
        label: this.translateService.instant("administracion.parametrosGenerales.literal.sufijo"),
        value: (event.sufijo!=undefined ? event.sufijo : undefined)
      },
    ];
  }
}
