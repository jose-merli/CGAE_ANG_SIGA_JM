import { Component, OnInit, ViewChild } from '@angular/core';
import { USER_VALIDATIONS } from '../../../../../properties/val-properties';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaWrapper } from '../../../../../wrapper/wrapper.class';
import { Location } from "@angular/common";

import { CompensacionFacturaComponent } from './compensacion-factura/compensacion-factura.component';
import { ConfiguracionFicherosComponent } from './configuracion-ficheros/configuracion-ficheros.component';
import { DatosPagosComponent } from './datos-pagos/datos-pagos.component';
import { DetallePagoComponent } from './detalle-pago/detalle-pago.component';
import { PagosjgItem } from '../../../../../models/sjcs/PagosjgItem';
import { ConceptosPagosComponent } from './conceptos-pagos/conceptos-pagos.component';
import { procesos_facturacionSJCS } from '../../../../../permisos/procesos_facturacion';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-pagos',
  templateUrl: './gestion-pagos.component.html',
  styleUrls: ['./gestion-pagos.component.scss']
})
export class GestionPagosComponent extends SigaWrapper implements OnInit {

  msgs;
  permisos;
  progressSpinner: boolean = false;
  datos: PagosjgItem = new PagosjgItem();
  cerrada;
  idPago;
  idEstadoPago;
  modoEdicion;
  numCriterios;

  @ViewChild(CompensacionFacturaComponent) compensacion;
  @ViewChild(ConfiguracionFicherosComponent) configuracionFic;
  @ViewChild(DatosPagosComponent) datosPagos;
  @ViewChild(ConceptosPagosComponent) conceptos;
  @ViewChild(DetallePagoComponent) detallePagos;

  constructor(private location: Location,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private router: Router,
    private translateService: TranslateService) {
    super(USER_VALIDATIONS);
  }

  ngOnInit() {


    this.commonsService.checkAcceso(procesos_facturacionSJCS.facturacionYpagos).then(respuesta => {

      this.permisos = respuesta;

      if (this.permisos == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      if (null != this.persistenceService.getDatos()) {
        this.datos = this.persistenceService.getDatos();
        this.idPago = this.datos.idPagosjg;
        this.idEstadoPago = this.datos.idEstado;
      }

      if (undefined == this.idPago) {
        this.modoEdicion = false;
        this.cerrada = false;
      } else {
        if (undefined != this.idEstadoPago) {
          if (this.idEstadoPago == '30') {
            this.cerrada = true;
          } else {
            this.cerrada = false;
          }
        }

        this.modoEdicion = true;
      }
      this.numCriterios = 0;

    });
  }

  volver() {
    this.location.back();
  }

  spinnerGlobal() {
    if (this.modoEdicion) {
      if (this.conceptos != undefined || this.compensacion != undefined || this.configuracionFic != undefined || this.datosPagos != undefined || this.detallePagos != undefined) {
        if (this.conceptos.progressSpinnerCriterios || this.compensacion.progressSpinnerCompensacion || this.configuracionFic.progressSpinnerConfiguracionFic || this.datosPagos.progressSpinnerDatosPagos || this.detallePagos.progressSpinnerDetallePagos) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      if (this.datosPagos.progressSpinnerDatosPagos) {
        return true;
      } else {
        return false;
      }
    }
  }

  clear() {
    this.msgs = [];
  }
}
