import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateService } from '../../../../commons/translate';
import { FicherosAdeudosItem } from '../../../../models/sjcs/FicherosAdeudosItem';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { procesos_facturacionPyS } from '../../../../permisos/procesos_facturacionPyS';
import { CommonsService } from '../../../../_services/commons.service';

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
  muestraFacturacion: boolean = false;

  openTarjetaDatosGeneracion: boolean = true;
  openTarjetaFacturas: boolean = false;

  permisoEscrituraDatosGeneracion:boolean = false;
  permisoEscrituraFacturas: boolean = false; 

  permisos;
  nuevo;
  msgs;

  enlacesTarjetaResumen = [];
  datosResumen = [];
  
  body: FicherosAdeudosItem;

  constructor(private translateService: TranslateService,
    private location: Location,
    private persistenceService: PersistenceService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService) { }

  async ngOnInit() {
    this.progressSpinner = true;
    this.permisosFicheroAdeudos()
    if (sessionStorage.getItem("Nuevo")) {
      sessionStorage.removeItem("Nuevo");
      if (sessionStorage.getItem("FicherosAdeudosItem")) {
        this.body = JSON.parse(sessionStorage.getItem("FicherosAdeudosItem")); 
        sessionStorage.removeItem("FicherosAdeudosItem");

        //console.log(`Facturas para generación: ${this.body.facturasGeneracion}`);
      } else {
        this.body = new FicherosAdeudosItem();
      }
      
      this.modoEdicion = false;
    } else if (sessionStorage.getItem("FicherosAdeudosItem")) {
      this.body = JSON.parse(sessionStorage.getItem("FicherosAdeudosItem")); 
      sessionStorage.removeItem("FicherosAdeudosItem");

      this.persistenceService.setDatos(this.body);
      this.modoEdicion=true;

    } else if(this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();
      this.modoEdicion=true;

    }

    if (this.modoEdicion) {
      this.updateTarjetaResumen();

      if(this.body.idprogramacion!=null){
        this.muestraFacturacion=true;
      }
    }
    
    setTimeout(() => {
      this.updateEnlacesTarjetaResumen();
    }, 5);

    this.progressSpinner = false;
    this.goTop();
  }

  permisosFicheroAdeudos(){
    this.commonsService
    .checkAcceso(procesos_facturacionPyS.ficheroAdeudos)
    .then((respuesta) => {
      this.permisoEscrituraDatosGeneracion = respuesta;
      this.permisoEscrituraFacturas = respuesta;
    })
    .catch((error) => console.error(error));
  }

  // Función para guardar o actualizar

  guardadoSend(event: FicherosAdeudosItem) {
    this.progressSpinner = true;

    this.guardarFicheroAdeudos(!this.modoEdicion, event)
    .then(() => { 
      if (!this.modoEdicion) {
        sessionStorage.setItem("mensaje", JSON.stringify({
          severity: "success", summary: this.translateService.instant("general.message.correct"), detail: this.translateService.instant("facturacionPyS.facturas.fichAdeudos.generando")
        }));
        sessionStorage.setItem("volver", "true");
        this.backTo();
      } else {
        return this.recuperarFicheroAdeudos().then(() => {
          this.modoEdicion = this.body.idDisqueteCargos != undefined;
    
          // Actualizar tarjetas
          if (this.modoEdicion)
            this.updateTarjetaResumen();
          setTimeout(() => {
            this.updateEnlacesTarjetaResumen();
          }, 5); 
        });
      }
    }).catch(error => {
      if (error != undefined && error.descripcion != undefined) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), error.descripcion);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    }).then(() => this.progressSpinner = false);
    
  }

  // Recargar datos

  refreshData() {
    this.recuperarFicheroAdeudos().then(() => {
      this.modoEdicion = this.body.idDisqueteCargos != undefined;

      // Actualizar tarjetas
      if (this.modoEdicion)
        this.updateTarjetaResumen();
      setTimeout(() => {
        this.updateEnlacesTarjetaResumen();
      }, 5);
    }).catch(error => {
      if (error != undefined && error.descripcion != undefined) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), error.descripcion);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    }).then(() => {
      this.progressSpinner = false;
      if (this.modoEdicion) {
        this.backTo();
      }
    });
  }

  guardarFicheroAdeudos(nuevo: boolean, ficheroAdeudos: FicherosAdeudosItem): Promise<any> {
    let endpoint = nuevo ? "facturacionPyS_nuevoFicheroAdeudos" : "facturacionPyS_actualizarFicheroAdeudos";
    return this.sigaServices.post(endpoint, ficheroAdeudos)
      .toPromise()
      .then(
        n => { },
        err => {
          let error = JSON.parse(err.error);
          if (error && error.error && error.error.message) {
            let message = this.translateService.instant(error.error.message);

            if (message && message.trim().length != 0) {
              return Promise.reject({ descripcion: message });
            } else {
              return Promise.reject({ descripcion: error.error.message });
            }
          }
          return Promise.reject({ descripcion: this.translateService.instant("general.mensaje.error.bbdd") });
        }
      );      
  }

  recuperarFicheroAdeudos() {
    if (this.body.idDisqueteCargos) {
      let filtros = { idDisqueteCargos: this.body.idDisqueteCargos };

      return this.sigaServices.post("facturacionPyS_getFicherosAdeudos", filtros).toPromise().then(
        n => {
          let results: FicherosAdeudosItem[] = JSON.parse(n.body).ficherosAdeudosItems;

          if (results.length != 0) {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

            this.body = results.find(d => d.idDisqueteCargos == this.body.idDisqueteCargos);
          } else {
            return Promise.reject({ descripcion: this.translateService.instant("general.mensaje.error.bbdd") });
          }
        },
        err => {
          let error = JSON.parse(err.error);
          if (error && error.error && error.error.message) {
            let message = this.translateService.instant(error.error.message);
            //console.log(message);
            if (message && message.trim().length != 0) {
              Promise.reject({ descripcion: message });
            }
          }

          return Promise.reject({ descripcion: this.translateService.instant("general.mensaje.error.bbdd") });
        });
    } else {
      return Promise.resolve();
    }
    
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
    sessionStorage.setItem("volver", "true")
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
        label: this.translateService.instant("menu.facturacion.asignacionDeConceptosFacturables"),
        value: this.body.nombreabreviado
      },
      {
        label: this.translateService.instant("menu.facturacion"),
        value: this.body.descripcion
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

    if(this.body.idprogramacion!=null){
      this.enlacesTarjetaResumen.push({
        label: "menu.facturacion",
        value: document.getElementById("facturacion"),
        nombre: "facturacion",
      });
    }

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