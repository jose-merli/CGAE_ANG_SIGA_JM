import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-gestion-facturacion',
  templateUrl: './gestion-facturacion.component.html',
  styleUrls: ['./gestion-facturacion.component.scss']
})
export class GestionFacturacionComponent extends SigaWrapper implements OnInit, AfterViewChecked {
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

  @ViewChild(PagosComponent) pagos;
  @ViewChild(BaremosComponent) baremos;
  @ViewChild(CartasFacturacionComponent) cartas;
  @ViewChild(ConceptosFacturacionComponent) conceptos;
  @ViewChild(DatosFacturacionComponent) datosFac;

  constructor(private location: Location, private persistenceService: PersistenceService, private changeDetectorRef: ChangeDetectorRef) {
    super(USER_VALIDATIONS);
  }

  ngOnInit() {
    if (undefined != this.persistenceService.getPermisos()) {
      this.permisos = this.persistenceService.getPermisos();
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

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

}
