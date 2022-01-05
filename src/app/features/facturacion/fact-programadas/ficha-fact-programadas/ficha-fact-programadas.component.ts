import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { CuentasBancariasItem } from '../../../../models/CuentasBancariasItem';
import { FacFacturacionprogramadaItem } from '../../../../models/FacFacturacionprogramadaItem';
import { SerieFacturacionItem } from '../../../../models/SerieFacturacionItem';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-ficha-fact-programadas',
  templateUrl: './ficha-fact-programadas.component.html',
  styleUrls: ['./ficha-fact-programadas.component.scss']
})
export class FichaFactProgramadasComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  iconoTarjetaResumen = "clipboard";
  body: FacFacturacionprogramadaItem;
  serie: SerieFacturacionItem = new SerieFacturacionItem();
  datos = [];
  enlacesTarjetaResumen = [];

  modoEdicion: boolean = false;
  controlEmisionFacturasSII: boolean = false;
  visibleInformeFacturacion: boolean = false;

  manuallyOpened: boolean;
  openTarjetaDatosGenerales: boolean = true;
  openTarjetaSerieFactura: boolean = false;
  openTarjetaGenAdeudos: boolean = false;
  openTarjetaInfoFactura: boolean = false;
  openTarjetaGenFactura: boolean = false;
  openTarjetaEnvio: boolean = false;
  openTarjetaTraspaso: boolean = false;

  constructor(
    private translateService: TranslateService,
    private location: Location,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    if (sessionStorage.getItem("facturacionProgramadaItem")) {
      this.body = JSON.parse(sessionStorage.getItem("facturacionProgramadaItem"));
      sessionStorage.removeItem("facturacionProgramadaItem");
      this.comprobarVisibilidadInformeFacturacion();
      this.modoEdicion = true;
    } else if (sessionStorage.getItem("Nuevo")) {
      sessionStorage.removeItem("Nuevo");
      this.body = new FacFacturacionprogramadaItem();
      this.openTarjetaSerieFactura = true;
    } else if (!this.body) {
      this.progressSpinner = false;
      this.backTo();
    }
    
    this.getParametrosCONTROL();
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
        label: this.translateService.instant("facturacion.factProgramadas.serieFactu"),
        value: this.body.nombreAbreviado
      },
      {
        label: this.translateService.instant("enviosMasivos.literal.descripcion"),
        value: this.body.descripcion
      },
      {
        label: this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado"),
        value: this.body.estadoConfirmacion
      },
      {
        label: this.translateService.instant("facturacionSJCS.facturacionesYPagos.importe"),
        value: this.body.importe
      }
    ]
  }

  updateEnlacesTarjetaResumen(): void {
    this.enlacesTarjetaResumen = [];

    this.enlacesTarjetaResumen.push({
      label: "facturacion.factProgramadas.serieFactu",
      value: document.getElementById("serieFactura"),
      nombre: "serieFactura",
    });

    this.enlacesTarjetaResumen.push({
      label: "general.message.datos.generales",
      value: document.getElementById("datosGenerales"),
      nombre: "datosGenerales",
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacion.factProgramadas.genAdeudos",
      value: document.getElementById("genAdeudos"),
      nombre: "genAdeudos",
    });

    if (this.visibleInformeFacturacion) {
      this.enlacesTarjetaResumen.push({
        label: "facturacion.factProgramadas.infoFactura",
        value: document.getElementById("infoFactura"),
        nombre: "infoFactura",
      });
    }

    this.enlacesTarjetaResumen.push({
      label: "facturacion.seriesFactura.generarPDF.literal",
      value: document.getElementById("genFactura"),
      nombre: "genFactura",
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacion.seriesFactura.envioFact.literal",
      value: document.getElementById("envio"),
      nombre: "envio",
    });

    if (this.controlEmisionFacturasSII) {
      this.enlacesTarjetaResumen.push({
        label: "facturacion.seriesFactura.traspaso.literal",
        value: document.getElementById("traspaso"),
        nombre: "traspaso",
      });
    }

  }

  // Obtener parametros de CONTROL
  getParametrosCONTROL(): void {
    this.sigaServices.get("facturacionPyS_parametrosCONTROL").subscribe(
      n => {
        let items: ComboItem[] = n.combooItems;
        
        let controlEmisionItem: ComboItem = items.find(item => item.label == "CONTROL_EMISION_FACTURAS_SII");

        if (controlEmisionItem) {
          this.controlEmisionFacturasSII = controlEmisionItem.value == "1";
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  serieFacturacionChanged(serie: SerieFacturacionItem) {
    this.serie = serie;

    if (!this.modoEdicion) {
      this.body = new FacFacturacionprogramadaItem();
      this.body.idSerieFacturacion = serie.idSerieFacturacion;
      this.body.descripcion = serie.abreviatura;

      let minutesToAdd = 5;
      let currentDate = new Date();
      this.body.fechaPrevistaGeneracion = new Date(currentDate.getTime() + minutesToAdd*60000);
    }
  }

  // Abrir tarjetas desde enlaces
  isOpenReceive(event) {
    if (event != undefined) {
      switch (event) {
        case "serieFactura":
          this.openTarjetaSerieFactura = true;
          break;
        case "datosGenerales":
          this.openTarjetaDatosGenerales = true;
          break;
        case "genAdeudos":
          this.openTarjetaGenAdeudos = true;
          break;
        case "infoFactura":
          this.openTarjetaInfoFactura = true;
          break;
        case "genFactura":
          this.openTarjetaGenFactura = true;
          break;
        case "envio":
          this.openTarjetaEnvio = true;
          break;
        case "traspaso":
          this.openTarjetaTraspaso = true;
          break;
      }
    }
  }

  // Abrir y cerrar manualmente las tarjetas
  isCloseReceive(event) {
    if (event != undefined) {
      switch (event) {
        case "serieFactura":
          this.openTarjetaSerieFactura = this.manuallyOpened;
          break;
        case "datosGenerales":
          this.openTarjetaDatosGenerales = this.manuallyOpened;
          break;
        case "genAdeudos":
          this.openTarjetaGenAdeudos = this.manuallyOpened;
          break;
        case "infoFactura":
          this.openTarjetaInfoFactura = this.manuallyOpened;
          break;
        case "genFactura":
          this.openTarjetaGenFactura = this.manuallyOpened;
          break;
        case "envio":
          this.openTarjetaEnvio = this.manuallyOpened;
          break;
        case "traspaso":
          this.openTarjetaTraspaso = this.manuallyOpened;
          break;
      }
    }
  }

  // Función para guardar o actualizar

  guardadoSend(event: FacFacturacionprogramadaItem) {
    this.progressSpinner = true;

    this.guardarFacturacionProgramada(!this.modoEdicion, event)
    .then(() => { return this.recuperarFacturacionProgramada().then(() => {
      this.modoEdicion = true;

      // Actualizar tarjetas
      this.comprobarVisibilidadInformeFacturacion();
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

  // Recargar datos

  refreshData() {
    this.recuperarFacturacionProgramada().then(() => {
      this.modoEdicion = true;

      // Actualizar tarjetas
      this.comprobarVisibilidadInformeFacturacion();
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
    }).then(() => this.progressSpinner = false);
  }

  guardarFacturacionProgramada(nuevo: boolean, factPragramada: FacFacturacionprogramadaItem): Promise<any> {
    let endpoint = nuevo ? "facturacionPyS_insertarProgramacionFactura" : "facturacionPyS_actualizarProgramacionFactura";
    return this.sigaServices.post(endpoint, factPragramada)
      .toPromise()
      .then(
        n => {
          let idProgramacion = JSON.parse(n.body).id;
          this.body.idProgramacion = idProgramacion;
        },
        err => {
          // let error = JSON.parse(err.error).error;
          
          return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );      
  }

  recuperarFacturacionProgramada() {
    let filtros = {
      idSerieFacturacion: this.body.idSerieFacturacion,
      idProgramacion: this.body.idProgramacion
    };

    return this.sigaServices.post("facturacionPyS_getFacturacionesProgramadas", filtros).toPromise().then(
      n => {
        let results: FacFacturacionprogramadaItem[] = JSON.parse(n.body).facturacionprogramadaItems;

        if (results.length != 0) {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          this.body = results.find(d => d.idProgramacion == this.body.idProgramacion);
        } else {
          return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
        }
      },
      err => {
        return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
      });
  }

  comprobarVisibilidadInformeFacturacion(): void {
    this.visibleInformeFacturacion = ["2", "1", "17", "21", "3", "4"].includes(this.body.idEstadoConfirmacion);
  }

  // Transformar fecha
  transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);
    else
      fecha = null;
    // fecha = this.datepipe.transform(fecha, 'dd/MM/yyyy');
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
