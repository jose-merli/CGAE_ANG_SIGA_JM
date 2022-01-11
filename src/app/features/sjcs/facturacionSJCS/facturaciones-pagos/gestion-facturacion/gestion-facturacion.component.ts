import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DatePipe, Location } from "@angular/common";
import { USER_VALIDATIONS } from '../../../../../properties/val-properties';
import { SigaWrapper } from "../../../../../wrapper/wrapper.class";
import { PersistenceService } from '../../../../../_services/persistence.service';
import { FacturacionItem } from '../../../../../models/sjcs/FacturacionItem';
import { PagosComponent } from './pagos/pagos.component';
import { BaremosComponent } from './baremos/baremos.component';
import { CartasFacturacionComponent } from './cartas-facturacion/cartas-facturacion.component';
import { ConceptosFacturacionComponent } from './conceptos-facturacion/conceptos-facturacion.component';
import { DatosFacturacionComponent } from './datos-facturacion/datos-facturacion.component';
import { CommonsService } from '../../../../../_services/commons.service';
import { procesos_facturacionSJCS } from '../../../../../permisos/procesos_facturacionSJCS';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';

export interface Enlace {
  id: string;
  ref: any;
}

@Component({
  selector: 'app-gestion-facturacion',
  templateUrl: './gestion-facturacion.component.html',
  styleUrls: ['./gestion-facturacion.component.scss']
})
export class GestionFacturacionComponent extends SigaWrapper implements OnInit, AfterViewChecked, AfterViewInit {
  progressSpinner: boolean = false;
  datos: FacturacionItem = new FacturacionItem();

  cerrada;
  idFacturacion;
  idEstadoFacturacion;
  modoEdicion;
  permisos;
  msgs;
  editingConceptos: boolean;
  numCriterios;
  tarjetaFija = {
    nombre: 'facturacionSJCS.facturacionesYPagos.inforesumen',
    icono: 'fas fa-clipboard',
    imagen: '',
    detalle: false,
    fixed: true,
    campos: [
      {
        "key": this.translateService.instant('facturacionSJCS.facturacionesYPagos.buscarFacturacion.nombre'),
        "value": ""
      },
      {
        "key": this.translateService.instant('facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaDesde'),
        "value": ""
      },
      {
        "key": this.translateService.instant('facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaHasta'),
        "value": ""
      },
      {
        "key": this.translateService.instant('facturacionSJCS.facturacionesYPagos.buscarFacturacion.regularizada'),
        "value": ""
      },
      {
        "key": this.translateService.instant('facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado'),
        "value": ""
      },
    ],
    enlaces: [
      { id: 'facSJCSFichaFactDatosFac', nombre: this.translateService.instant('facturacionSJCS.facturacionesYPagos.datosFacturacion'), ref: null },
      { id: 'facSJCSFichaFactConceptosFac', nombre: this.translateService.instant('facturacionSJCS.facturacionesYPagos.fichaConceptosFacturacion'), ref: null },
      { id: 'facSJCSFichaFactBaremosFac', nombre: this.translateService.instant('facturacionSJCS.facturacionesYPagos.baremos'), ref: null },
      { id: 'facSJCSFichaFactPagosFac', nombre: this.translateService.instant('facturacionSJCS.facturacionesYPagos.pagos'), ref: null },
      { id: 'facSJCSFichaFactCartasFac', nombre: this.translateService.instant('facturacionSJCS.facturacionesYPagos.cartasFacturacion'), ref: null }
    ]
  };

  facturacion: FacturacionItem;
  visualizarTarjetas: boolean = false;

  @ViewChild(PagosComponent) pagos;
  @ViewChild(BaremosComponent) baremos;
  @ViewChild(CartasFacturacionComponent) cartas;
  @ViewChild(ConceptosFacturacionComponent) conceptos;
  @ViewChild(DatosFacturacionComponent) datosFac;

  constructor(private location: Location,
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    private datePipe: DatePipe,
    private sigaService: SigaServices) {
    super(USER_VALIDATIONS);
  }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.busquedaFac).then(respuesta => {

      this.permisos = respuesta;

      if (this.permisos == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      if (null != this.persistenceService.getDatos()) {
        this.datos = this.persistenceService.getDatos();
        this.idFacturacion = this.datos.idFacturacion;
        this.idEstadoFacturacion = this.datos.idEstado;
        this.getFacturacion();
      }

      if (undefined == this.idFacturacion) {
        this.modoEdicion = false;
        this.cerrada = false;
      } else {
        if (undefined != this.idEstadoFacturacion) {
          if (this.idEstadoFacturacion == '10') {
            this.cerrada = false;
          } else {
            this.cerrada = true;
          }
        }

        this.modoEdicion = true;
      }
      this.numCriterios = 0;
      this.editingConceptos = false;
      this.visualizarTarjetas = true;

    }).catch(error => console.error(error));

  }

  establecerDatosTarjetaResumen() {
    this.tarjetaFija.campos[0].value = this.facturacion.nombre.toString();
    this.tarjetaFija.campos[1].value = this.datePipe.transform(this.facturacion.fechaDesde, 'dd/MM/yyyy');
    this.tarjetaFija.campos[2].value = this.datePipe.transform(this.facturacion.fechaHasta, 'dd/MM/yyyy');
    this.tarjetaFija.campos[3].value = this.facturacion.regularizacion == "0" ? 'No' : 'Sí';
    this.tarjetaFija.campos[4].value = this.datosFac.getTextEstadoFac(this.idEstadoFacturacion);
  }

  volver() {
    this.sigaService.setRutaMenu("fichaFacturacion");
    this.location.back();
  }

  changeNumCriterios(event) {
    this.numCriterios = event;
  }

  changeEditingConceptos(event) {
    this.editingConceptos = event;
  }

  changeModoEdicion(event) {
    this.modoEdicion = event;
  }

  changeEstadoFacturacion(event) {
    this.idEstadoFacturacion = event;
  }

  changeCerrada(event) {
    this.cerrada = event;
  }

  changeIdFacturacion(event) {
    this.idFacturacion = event;
  }

  spinnerGlobal() {
    if (this.modoEdicion) {
      if ((this.conceptos != undefined && this.conceptos.progressSpinnerConceptos) || (this.baremos != undefined && this.baremos.progressSpinnerBaremos) ||
        (this.pagos != undefined && this.pagos.progressSpinnerPagos) || (this.cartas != undefined && this.cartas.progressSpinnerCartas) ||
        (this.datosFac != undefined && this.datosFac.progressSpinnerDatos)) {
        return true;
      } else {
        return false;
      }
    } else {
      if (this.datosFac != undefined && this.datosFac.progressSpinnerDatos) {
        return true;
      } else {
        return false;
      }
    }
  }

  clear() {
    this.msgs = [];
  }

  isOpenReceive(event) {

    if (this.modoEdicion) {

      switch (event) {
        case 'facSJCSFichaFactDatosFac':
          this.datosFac.showFichaFacturacion = true;
          break;
        case 'facSJCSFichaFactConceptosFac':
          this.conceptos.showFichaConceptos = true;
          break;
        case 'facSJCSFichaFactPagosFac':
          this.pagos.showFichaPagos = true;
          break;
      }

    }

  }

  ngAfterViewInit() {
    this.goTop();
  }

  goTop() {
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  getFacturacion() {

    this.sigaService.getParam("facturacionsjcs_datosfacturacion", "?idFacturacion=" + this.idFacturacion).subscribe(
      data => {
        this.facturacion = data.facturacionItem[0];
      },
      err => { },
      () => {
        this.establecerDatosTarjetaResumen();
      }
    );

  }

  addEnlace(enlace: Enlace) {
    this.tarjetaFija.enlaces.find(el => el.id == enlace.id).ref = enlace.ref;
  }

}
