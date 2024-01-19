import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { procesos_facturacionSJCS } from '../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { TranslateService } from '../../../../commons/translate';
import { Router } from '@angular/router';
import { SigaServices } from '../../../../_services/siga.service';
import { FiltroCartasFacturacionPagoComponent } from './filtro-cartas-facturacion-pago/filtro-cartas-facturacion-pago.component';
import { TablaCartasFacturacionPagoComponent } from './tabla-cartas-facturacion-pago/tabla-cartas-facturacion-pago.component';

@Component({
  selector: 'app-cartas-facturacion-pago',
  templateUrl: './cartas-facturacion-pago.component.html',
  styleUrls: ['./cartas-facturacion-pago.component.scss']
})
export class CartasFacturacionPagoComponent implements OnInit, OnDestroy {

  permisoEscritura: boolean = false;
  datos = [];
  buscar: boolean = false;
  progressSpinner: boolean = false;
  modoBusqueda: string;
  busquedaEnlace: string;
  msgs = [];

  @ViewChild(FiltroCartasFacturacionPagoComponent) filtros: FiltroCartasFacturacionPagoComponent;
  @ViewChild(TablaCartasFacturacionPagoComponent) tabla;
  datosColegiado: any;
  disabledLetradoFicha: boolean;
  apartado: string;

  constructor(private commonsService: CommonsService, private persistenceService: PersistenceService,
    private translateService: TranslateService, private router: Router, private sigaServices: SigaServices) { }

  ngOnInit() {

    let permiso = procesos_facturacionSJCS.cartasFacturacion;
    if(sessionStorage.getItem("apartadoPagos")){
      permiso = procesos_facturacionSJCS.cartasPago;
    }

    this.commonsService.checkAcceso(permiso)
      .then(respuesta => {

        this.permisoEscritura = respuesta;
        this.persistenceService.setPermisos(this.permisoEscritura);

        if (this.permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
      ).catch(error => console.error(error));

      if(sessionStorage.getItem("apartadoFacturacion")){
        this.apartado = "f" ;
        if (sessionStorage.getItem("datosColegiado") != null || sessionStorage.getItem("datosColegiado") != undefined) {
            this.datosColegiado = JSON.parse(sessionStorage.getItem("datosColegiado"));
            this.filtros.filtros.apellidosNombre = this.datosColegiado.nombre;
            this.filtros.filtros.ncolegiado = this.datosColegiado.numColegiado;
            this.filtros.filtros.idPersona = this.datosColegiado.idPersona;
            this.disabledLetradoFicha = true;
            sessionStorage.removeItem("datosColegiado");
        }
        sessionStorage.removeItem("apartadoFacturacion");
        this.busquedaEnlace = "f";
      }

      if(sessionStorage.getItem("apartadoPagos")){
        this.apartado = "p";
        if (sessionStorage.getItem("datosColegiado") != null || sessionStorage.getItem("datosColegiado") != undefined) {
          this.datosColegiado = JSON.parse(sessionStorage.getItem("datosColegiado"));
          this.filtros.filtros.apellidosNombre = this.datosColegiado.nombre;
          this.filtros.filtros.ncolegiado = this.datosColegiado.numColegiado;
          this.filtros.filtros.idPersona = this.datosColegiado.idPersona;
          this.disabledLetradoFicha = true;
          sessionStorage.removeItem("datosColegiado");
      }
      sessionStorage.removeItem("apartadoPagos");
      this.busquedaEnlace = "p";
      }
  }

  ngAfterViewInit() {
    if (this.busquedaEnlace == 'f') {
      this.searchFacturacionEnlace();
    } else if (this.busquedaEnlace == 'p') {
      this.searchPagoEnlace();
    }
  }

  search(event) {

    this.modoBusqueda = event;

    if (event == "f") {
      this.searchFacturacion();
    } else if (event == "p") {
      this.searchPago();
    }
  }

  changeModoBusqueda(event) {
   
    if (event == "f") {
      this.datos = [];
      this.buscar = false;
      this.filtros.getComboFacturacion()
    } else if (event == "p") {
      this.datos = [];
      this.buscar = false;
      this.filtros.getComboPagos()
    }

    if (this.datosColegiado != null) {
      this.filtros.filtros.apellidosNombre = this.datosColegiado.nombre;
      this.filtros.filtros.ncolegiado = this.datosColegiado.numColegiado;
      this.filtros.filtros.idPersona = this.datosColegiado.idPersona;
      this.disabledLetradoFicha = true;
    } else {
      this.disabledLetradoFicha = false;
    }
  }

  searchFacturacion() {

    this.progressSpinner = true;

    // Hacemos una copia de los filtros para no modificar el original
    let filtersCopy = JSON.parse(JSON.stringify(this.filtros.filtros));

    // Modificaciones para pasar de select a multiselect por usabilidad
    if (undefined != filtersCopy.idFacturacion) {
      if (filtersCopy.idFacturacion.length == 0) {
        filtersCopy.idFacturacion = undefined;
      } else {
        filtersCopy.idFacturacion = filtersCopy.idFacturacion.toString();
      }
    }

    // Modificaciones para pasar de select a multiselect por usabilidad
    if (undefined != filtersCopy.idPago) {
      if (filtersCopy.idPago.length == 0) {
        filtersCopy.idPago = undefined;
      } else {
        filtersCopy.idPago = filtersCopy.idPago.toString();
      }
    }

    if (undefined != filtersCopy.idConcepto) {
      if (filtersCopy.idConcepto.length == 0) {
        filtersCopy.idConcepto = undefined;
      } else {
        filtersCopy.idConcepto = filtersCopy.idConcepto.toString();
      }
    }

    if (undefined != filtersCopy.idTurno) {
      if (filtersCopy.idTurno.length == 0) {
        filtersCopy.idTurno = undefined;
      } else {
        filtersCopy.idTurno = filtersCopy.idTurno.toString();
      }
    }

    if (undefined != filtersCopy.idPartidaPresupuestaria) {
      if (filtersCopy.idPartidaPresupuestaria.length == 0) {
        filtersCopy.idPartidaPresupuestaria = undefined;
      } else {
        filtersCopy.idPartidaPresupuestaria = filtersCopy.idPartidaPresupuestaria.toString();
      }
    }

    this.sigaServices.post("facturacionsjcs_buscarCartasfacturacion", filtersCopy).subscribe(
      data => {

        let datos = JSON.parse(data["body"]);
        let error = JSON.parse(data.body).error;

        this.datos = datos.cartasFacturacionPagosItems;

        if (this.tabla != undefined) {
          this.tabla.tabla.sortOrder = 0;
          this.tabla.tabla.sortField = '';
          this.tabla.tabla.reset();
        }

        this.progressSpinner = false;

        if (error != null && error.description != null) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
        }

        this.buscar = true;

      },
      err => {
        console.log(err);
        this.progressSpinner = false;

      },
      () => {
        this.progressSpinner = false;
        setTimeout(() => {
          this.tabla.tablaFoco.nativeElement.scrollIntoView();
        }, 5);
      }
    );

  }

  searchPago() {

    this.progressSpinner = true;

    // Hacemos una copia de los filtros para no modificar el original
    let filtersCopy = JSON.parse(JSON.stringify(this.filtros.filtros));

    // Modificaciones para pasar de select a multiselect por usabilidad
    if (undefined != filtersCopy.idPago) {
      if (filtersCopy.idPago.length == 0) {
        filtersCopy.idPago = undefined;
      } else {
        filtersCopy.idPago = filtersCopy.idPago.toString();
      }
    }

    if (undefined != filtersCopy.idConcepto) {
      if (filtersCopy.idConcepto.length == 0) {
        filtersCopy.idConcepto = undefined;
      } else {
        filtersCopy.idConcepto = filtersCopy.idConcepto.toString();
      }
    }

    if (undefined != filtersCopy.idTurno) {
      if (filtersCopy.idTurno.length == 0) {
        filtersCopy.idTurno = undefined;
      } else {
        filtersCopy.idTurno = filtersCopy.idTurno.toString();
      }
    }

    if (undefined != filtersCopy.idPartidaPresupuestaria) {
      if (filtersCopy.idPartidaPresupuestaria.length == 0) {
        filtersCopy.idPartidaPresupuestaria = undefined;
      } else {
        filtersCopy.idPartidaPresupuestaria = filtersCopy.idPartidaPresupuestaria.toString();
      }
    }

    if (filtersCopy.idFacturacion) {
      delete filtersCopy.idFacturacion;
    }

    this.sigaServices.post("facturacionsjcs_buscarCartaspago", filtersCopy).subscribe(
      data => {
        let datos = JSON.parse(data["body"]);
        let error = JSON.parse(data.body).error;
        this.datos = datos.cartasFacturacionPagosItems;
        if (this.tabla != undefined) {
          this.tabla.tabla.sortOrder = 0;
          this.tabla.tabla.sortField = '';
          this.tabla.tabla.reset();
        }
        this.progressSpinner = false;

        if (error != null && error.description != null) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
        }

        this.buscar = true;

      },
      err => {
        console.log(err);
        this.progressSpinner = false;

      },
      () => {
        this.progressSpinner = false;
        setTimeout(() => {
          this.tabla.tablaFoco.nativeElement.scrollIntoView();
        }, 5);
      }
    );

  }

  searchFacturacionEnlace() {

    this.progressSpinner = true;

    let filtersCopy = JSON.parse(JSON.stringify(this.filtros.filtros));
      
    filtersCopy.idFacturacion = null;
    filtersCopy.idConcepto = null;
    filtersCopy.idTurno = null;    
    filtersCopy.idPartidaPresupuestaria = null;

    this.sigaServices.post("facturacionsjcs_buscarCartasfacturacion", filtersCopy).subscribe(
      data => {

        let datos = JSON.parse(data["body"]);
        let error = JSON.parse(data.body).error;

        this.datos = datos.cartasFacturacionPagosItems;

        if (this.tabla != undefined) {
          this.tabla.tabla.sortOrder = 0;
          this.tabla.tabla.sortField = '';
          this.tabla.tabla.reset();
        }

        this.progressSpinner = false;

        if (error != null && error.description != null) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
        }

        this.buscar = true;

      },
      err => {
        console.log(err);
        this.progressSpinner = false;

      },
      () => {
        this.progressSpinner = false;
        setTimeout(() => {
          this.tabla.tablaFoco.nativeElement.scrollIntoView();
        }, 5);
      }
    );

  }

  searchPagoEnlace() {

    this.progressSpinner = true;

    // Hacemos una copia de los filtros para no modificar el original
    let filtersCopy = JSON.parse(JSON.stringify(this.filtros.filtros));

          
    filtersCopy.idPago = null;
    filtersCopy.idConcepto = null;
    filtersCopy.idTurno = null;    
    filtersCopy.idPartidaPresupuestaria = null;
   

    this.sigaServices.post("facturacionsjcs_buscarCartaspago", filtersCopy).subscribe(
      data => {
        let datos = JSON.parse(data["body"]);
        let error = JSON.parse(data.body).error;
        this.datos = datos.cartasFacturacionPagosItems;
        if (this.tabla != undefined) {
          this.tabla.tabla.sortOrder = 0;
          this.tabla.tabla.sortField = '';
          this.tabla.tabla.reset();
        }
        this.progressSpinner = false;

        if (error != null && error.description != null) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
        }

        this.buscar = true;

      },
      err => {
        console.log(err);
        this.progressSpinner = false;

      },
      () => {
        this.progressSpinner = false;
        setTimeout(() => {
          this.tabla.tablaFoco.nativeElement.scrollIntoView();
        }, 5);
      }
    );

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

  ngOnDestroy(): void {
    this.persistenceService.clearDatosBusquedaGeneralSJCS();
  }
}
