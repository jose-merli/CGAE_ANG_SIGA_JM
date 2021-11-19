import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../commons/translate';
import { CuentasBancariasItem } from '../../../../models/CuentasBancariasItem';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';

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
  enlacesTarjetaResumen = [];

  manuallyOpened: boolean;
  openTarjetaDatosGenerales: boolean = true;
  openTarjetaComision: boolean = false;
  openTarjetaConfiguracion: boolean = false;
  openTarjetaUsoFicheros: boolean = false;
  openTarjetaUsosSufijos: boolean = false;

  modoEdicion: boolean = true;

  constructor(
    private location: Location,
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private router: Router,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    if (sessionStorage.getItem("cuentaBancariaItem")) {
      this.body = JSON.parse(sessionStorage.getItem("cuentaBancariaItem"));
      sessionStorage.removeItem("cuentaBancariaItem");
      
      this.modoEdicion=true;
      
      this.calcDescripcion();

    } else if(sessionStorage.getItem("Nuevo")) {
      sessionStorage.removeItem("Nuevo");
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
        value: this.body.iban
      },
      {
        label: this.translateService.instant("menu.justiciaGratuita"),
        value: (this.body.sjcs ? "Sí" : "No")
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

    this.enlacesTarjetaResumen.push({
      label: "facturacion.cuentaBancaria.comision",
      value: document.getElementById("comision"),
      nombre: "comision"
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacion.cuentaBancaria.configuracion",
      value: document.getElementById("configuracion"),
      nombre: "configuracion"
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacion.cuentaBancaria.usoFicheros",
      value: document.getElementById("usoFicheros"),
      nombre: "usoFicheros"
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacion.cuentaBancaria.usosSufijos",
      value: document.getElementById("usosSufijos"),
      nombre: "usosSufijos"
    });

  }

  guardadoSend(event: CuentasBancariasItem): void {
    this.progressSpinner = true;
    console.log(event);

    if (this.modoEdicion) {
      this.sigaServices.post("facturacionPyS_actualizaCuentaBancaria", event).subscribe(
        n => {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.body = JSON.parse(JSON.stringify(event));
          
          this.ngOnInit();
          this.progressSpinner = false;
        },
        err => {
          let error = JSON.parse(err.error).error;
          if (error != undefined && error.message != undefined) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.message));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          }
  
          this.progressSpinner = false;
        }
      );
    } else {
      this.sigaServices.post("facturacionPyS_insertaCuentaBancaria", event).subscribe(
        n => {
          let bancosCodigo = JSON.parse(n.body).id;
          this.body.bancosCodigo = bancosCodigo;
          this.recuperarCuentaBancaria();
        },
        err => {
          let error = JSON.parse(err.error).error;
          if (error != undefined && error.message != undefined) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.message));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          }

          this.progressSpinner = false;
        }
      );
    }
  }

  recuperarCuentaBancaria(): void {
    this.sigaServices.getParam("facturacionPyS_getCuentasBancarias", "?idCuenta=" + this.body.bancosCodigo).subscribe(
      n => {
        let datos: CuentasBancariasItem[] = JSON.parse(n.body).cuentasBancariasITem;

        if (datos.length != 0) {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          this.body = datos.find(d => d.bancosCodigo == this.body.bancosCodigo);
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
        
        this.modoEdicion = true;
        this.ngOnInit();
        this.progressSpinner = false;
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
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

  // Obtener descripción

  calcDescripcion(): void {
    let abrBanco: string = "";

    if (this.body.nombre.indexOf("~") > 1) {
      abrBanco = this.body.nombre.substring(0, this.body.nombre.indexOf("~")).trim();
    } else if (this.body.nombre.indexOf("(") > 0) {
      abrBanco = this.body.nombre.substring(0, this.body.nombre.indexOf("(")).trim();
    } else {
      abrBanco = this.body.nombre;
    }

    let ibanEnd: string = this.body.iban.slice(-4);
    this.body.descripcion = `${abrBanco} (...${ibanEnd})`;
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
    this.location.back();
  }
}
