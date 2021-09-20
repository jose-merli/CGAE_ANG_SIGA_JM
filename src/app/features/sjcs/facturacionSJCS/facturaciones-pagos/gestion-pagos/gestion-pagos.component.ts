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
import { ParametroItem } from '../../../../../models/ParametroItem';
import { ParametroDto } from '../../../../../models/ParametroDto';
import { ParametroRequestDto } from '../../../../../models/ParametroRequestDto';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { SigaServices } from '../../../../../_services/siga.service';

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
  paramDeducirCobroAutom: ParametroItem;

  @ViewChild(CompensacionFacturaComponent) compensacion: CompensacionFacturaComponent;
  @ViewChild(ConfiguracionFicherosComponent) configuracionFic: ConfiguracionFicherosComponent;
  @ViewChild(DatosPagosComponent) datosPagos: DatosPagosComponent;
  @ViewChild(ConceptosPagosComponent) conceptos: ConceptosPagosComponent;
  @ViewChild(DetallePagoComponent) detallePagos: DetallePagoComponent;

  constructor(private location: Location,
    private commonsService: CommonsService,
    private router: Router,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaStorageService: SigaStorageService,
    private sigaServices: SigaServices) {
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

      this.getParamDeducirCobroAutom();

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

  compensacionFact() {
    this.compensacion.getCompensacionFacturas(this.paramDeducirCobroAutom.valor.toString());
  }

  getParamDeducirCobroAutom() {

    let parametro = new ParametroRequestDto();
    parametro.idInstitucion = this.sigaStorageService.institucionActual;
    parametro.modulo = 'FCS';
    parametro.parametrosGenerales = 'DEDUCIR_COBROS_AUTOMATICO';

    this.sigaServices.postPaginado("parametros_search", "?numPagina=1", parametro).subscribe(
      data => {
        const resp: ParametroDto = JSON.parse(data['body']);
        const parametros = resp.parametrosItems;
        parametros.forEach(el => {
          if (el.parametro == 'DEDUCIR_COBROS_AUTOMATICO' && (el.idInstitucion == el.idinstitucionActual || el.idInstitucion == '0')) {
            this.paramDeducirCobroAutom = el;
          }
        });
      }
    );

  }

}
