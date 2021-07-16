import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location } from "@angular/common";
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
      // {
      //   "key": "",
      //   "value": ""
      // },
    ],
    enlaces: []
  };

  listaTarjetas = [
    { id: 'facSJCSFichaFactDatosFac', nombre: this.translateService.instant('facturacionSJCS.facturacionesYPagos.datosFacturacion') },
    { id: 'facSJCSFichaFactConceptosFac', nombre: this.translateService.instant('facturacionSJCS.facturacionesYPagos.fichaConceptosFacturacion') },
    { id: 'facSJCSFichaFactBaremosFac', nombre: this.translateService.instant('facturacionSJCS.facturacionesYPagos.baremos') },
    { id: 'facSJCSFichaFactPagosFac', nombre: this.translateService.instant('facturacionSJCS.facturacionesYPagos.pagos') },
    { id: 'facSJCSFichaFactCartasFac', nombre: this.translateService.instant('facturacionSJCS.facturacionesYPagos.cartasFacturacion') }
  ];

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
    private router: Router) {
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

    }).catch(error => console.error(error));

  }

  volver() {
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
      if (this.conceptos != undefined || this.baremos != undefined || this.pagos != undefined || this.cartas != undefined) {
        if (this.datosFac.progressSpinnerDatos || this.conceptos.progressSpinnerConceptos || this.baremos.progressSpinnerBaremos || this.pagos.progressSpinnerPagos || this.cartas.progressSpinnerCartas) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }

    } else {
      if (this.datosFac.progressSpinnerDatos) {
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

  ngAfterViewInit() {

    this.goTop();

    this.listaTarjetas.forEach(tarj => {
      let tarjTmp = {
        id: tarj.id,
        ref: document.getElementById(tarj.id),
        nombre: tarj.nombre
      };

      this.tarjetaFija.enlaces.push(tarjTmp);
    });

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

}
