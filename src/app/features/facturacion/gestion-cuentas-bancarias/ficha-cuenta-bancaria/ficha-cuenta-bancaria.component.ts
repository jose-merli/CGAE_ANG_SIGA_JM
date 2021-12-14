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
      this.calcDescripcion(); // Calcular propiedad derivada
    } else if(sessionStorage.getItem("Nuevo")) {
      sessionStorage.removeItem("Nuevo");
      this.modoEdicion = false;
    }else if (this.modoEdicion && this.body.bancosCodigo == undefined) {
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

    let guardado: Promise<any>;

    if (this.modoEdicion) {
      guardado = this.actualizarCuentaBancaria(event);
    } else {
      guardado = this.insertarCuentaBancaria(event);
    }

    guardado.then(() => {
      return this.recuperarCuentaBancaria().then(() => {
          this.modoEdicion = true;
          this.calcDescripcion(); // Propiedad derivada

          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        })}).catch(error => {
      if (error != undefined) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), error);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    }).then(() => {
      this.progressSpinner = false;
    });
    
  }

  refreshData(): void {
    this.progressSpinner = true;

    this.recuperarCuentaBancaria().then(() => {
      this.modoEdicion = true;
      this.calcDescripcion(); // Propiedad derivada

      this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
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

  insertarCuentaBancaria(bodyToInsert: CuentasBancariasItem): Promise<any> {
    return this.sigaServices.post("facturacionPyS_insertaCuentaBancaria", bodyToInsert).toPromise().then(
      n => {
        console.log("Nuevo id:", n);
        let bancosCodigo = JSON.parse(n.body).id;
        this.body.bancosCodigo = bancosCodigo;
      },
      err => {
        let error = JSON.parse(err.error).error;
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

  actualizarCuentaBancaria(bodyToUpdate: CuentasBancariasItem): Promise<any> {
    return this.sigaServices.post("facturacionPyS_actualizaCuentaBancaria", bodyToUpdate).toPromise().then(
      n => { },
      err => {
        let error = JSON.parse(err.error).error;
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

  recuperarCuentaBancaria(): Promise<any> {
    return this.sigaServices.getParam("facturacionPyS_getCuentasBancarias", "?idCuenta=" + this.body.bancosCodigo).toPromise().then(
      n => {
        let datos: CuentasBancariasItem[] = n.cuentasBancariasITem;

        if (datos.length != 0) {
          this.body = datos.find(d => d.bancosCodigo == this.body.bancosCodigo);
        } else {
          this.router.navigate(["gestionCuentasBancarias"]);
          return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
        }
      },
      err => {
        let error = JSON.parse(err.error).error;
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
