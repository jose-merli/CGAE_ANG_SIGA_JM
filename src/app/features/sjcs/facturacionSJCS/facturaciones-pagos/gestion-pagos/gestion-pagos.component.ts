import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { USER_VALIDATIONS } from '../../../../../properties/val-properties';
import { SigaWrapper } from '../../../../../wrapper/wrapper.class';
import { Location } from "@angular/common";

import { CompensacionFacturaComponent } from './compensacion-factura/compensacion-factura.component';
import { ConfiguracionFicherosComponent } from './configuracion-ficheros/configuracion-ficheros.component';
import { DatosPagosComponent } from './datos-pagos/datos-pagos.component';
import { DetallePagoComponent } from './detalle-pago/detalle-pago.component';
import { PagosjgItem } from '../../../../../models/sjcs/PagosjgItem';
import { ConceptosPagosComponent } from './conceptos-pagos/conceptos-pagos.component';
import { procesos_facturacionSJCS } from '../../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '@angular/router';
import { CompensacionFacItem } from '../../../../../models/sjcs/CompensacionFacItem';

@Component({
  selector: 'app-gestion-pagos',
  templateUrl: './gestion-pagos.component.html',
  styleUrls: ['./gestion-pagos.component.scss']
})
export class GestionPagosComponent extends SigaWrapper implements OnInit, AfterViewChecked {

  msgs;
  permisos;
  datos: PagosjgItem = new PagosjgItem();
  modoEdicion;
  numCriterios;
  idPago;
  idEstadoPago;
  idFacturacion;
  showCards: boolean = false;
  editingConceptos: boolean = false;
  facturasMarcadas: CompensacionFacItem[] = [];

  @ViewChild(CompensacionFacturaComponent) compensacion;
  @ViewChild(ConfiguracionFicherosComponent) configuracionFic;
  @ViewChild(DatosPagosComponent) datosPagos;
  @ViewChild(ConceptosPagosComponent) conceptos;
  @ViewChild(DetallePagoComponent) detallePagos;

  constructor(private location: Location,
    private commonsService: CommonsService,
    private router: Router,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef) {
    super(USER_VALIDATIONS);
  }

  ngOnInit() {


    this.commonsService.checkAcceso(procesos_facturacionSJCS.busquedaPag).then(respuesta => {

      this.permisos = respuesta;

      if (this.permisos == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      const paramsPago = JSON.parse(sessionStorage.getItem("paramsPago"));

      if (paramsPago && null != paramsPago) {
        this.idPago = paramsPago.idPago;
        this.idEstadoPago = paramsPago.idEstadoPago;
        this.idFacturacion = paramsPago.idFacturacion;
        sessionStorage.removeItem("paramsPago");
      }

      if (paramsPago == undefined || paramsPago == null || undefined == paramsPago.idPago) {
        this.modoEdicion = false;
      } else {
        this.modoEdicion = true;
      }

      this.numCriterios = 0;
      this.showCards = true;
    });
  }

  volver() {
    this.location.back();
  }

  clear() {
    this.msgs = [];
  }

  changeEditingConceptos(event) {
    this.editingConceptos = event;
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

}
