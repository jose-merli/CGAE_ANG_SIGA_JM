import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { USER_VALIDATIONS } from '../../../../../properties/val-properties';
import { SigaWrapper } from '../../../../../wrapper/wrapper.class';
import { Location } from "@angular/common";

import { CompensacionFacturaComponent } from './compensacion-factura/compensacion-factura.component';
import { ConfiguracionFicherosComponent } from './configuracion-ficheros/configuracion-ficheros.component';
import { DatosPagosComponent } from './datos-pagos/datos-pagos.component';
import { CartasPagoComponent } from './cartas-pago/cartas-pago.component'
import { PagosjgItem } from '../../../../../models/sjcs/PagosjgItem';
import { ConceptosPagosComponent } from './conceptos-pagos/conceptos-pagos.component';
import { procesos_facturacionSJCS } from '../../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { ActivatedRoute, Router } from '@angular/router';
import { CompensacionFacItem } from '../../../../../models/sjcs/CompensacionFacItem';
import { ParametroItem } from '../../../../../models/ParametroItem';
import { ParametroDto } from '../../../../../models/ParametroDto';
import { ParametroRequestDto } from '../../../../../models/ParametroRequestDto';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { PagosjgDTO } from '../../../../../models/sjcs/PagosjgDTO';
import { PersistenceService } from '../../../../../_services/persistence.service';

export interface Enlace {
  id: string;
  ref: any;
}

@Component({
  selector: 'app-gestion-pagos',
  templateUrl: './gestion-pagos.component.html',
  styleUrls: ['./gestion-pagos.component.scss']
})
export class GestionPagosComponent extends SigaWrapper implements OnInit, AfterViewChecked {

  pago: PagosjgItem;
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

  tarjetaFija = {
    nombre: 'facturacionSJCS.facturacionesYPagos.inforesumen',
    icono: 'fas fa-clipboard',
    imagen: '',
    detalle: false,
    fixed: true,
    campos: [
      {
        "key": this.translateService.instant('facturacionSJCS.facturacionesYPagos.fichaPago.nombreFac'),
        "value": ""
      },
      {
        "key": this.translateService.instant('facturacionSJCS.facturacionesYPagos.fichaPago.nombrePag'),
        "value": ""
      },
      {
        "key": this.translateService.instant('facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado'),
        "value": ""
      },
    ],
    enlaces: [
      { id: 'facSJCSFichaPagosDatosGen', nombre: this.translateService.instant('general.message.datos.generales'), ref: null },
      { id: 'facSJCSFichaPagosConcep', nombre: this.translateService.instant('facturacionSJCS.facturacionesYPagos.criteriosPagos'), ref: null },
      { id: 'facSJCSFichaPagosConfigFich', nombre: this.translateService.instant('facturacionSJCS.facturacionesYPagos.configuracionFicheros'), ref: null },
      { id: 'facSJCSFichaPagosDetaPago', nombre: this.translateService.instant('facturacionSJCS.facturacionesYPagos.detallePago'), ref: null },
      { id: 'facSJCSFichaPagosCompFac', nombre: this.translateService.instant('facturacionSJCS.facturacionesYPagos.compensacionFactura'), ref: null }
    ]
  };
  idFacturacionDesdeFichaFac: string;

  @ViewChild(CompensacionFacturaComponent) compensacion: CompensacionFacturaComponent;
  @ViewChild(ConfiguracionFicherosComponent) configuracionFic: ConfiguracionFicherosComponent;
  @ViewChild(DatosPagosComponent) datosPagos: DatosPagosComponent;
  @ViewChild(ConceptosPagosComponent) conceptos: ConceptosPagosComponent;
  @ViewChild(CartasPagoComponent) detallePagos: CartasPagoComponent;

  constructor(private location: Location,
    private commonsService: CommonsService,
    private router: Router,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaStorageService: SigaStorageService,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private activatedRoute: ActivatedRoute) {
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

      this.getParamDeducirCobroAutom();

      this.activatedRoute.queryParamMap.subscribe(
        (params) => {
          this.idFacturacionDesdeFichaFac = params.get('idFacturacion');

          if(this.idFacturacionDesdeFichaFac != null) {
            this.persistenceService.clearDatos();
          }

          if (null != this.persistenceService.getDatos()) {
        this.datos = this.persistenceService.getDatos();
        this.idPago = this.datos.idPagosjg;
        this.idEstadoPago = this.datos.idEstado;
        this.idFacturacion = this.datos.idFacturacion;
        this.getPago();
      }

      if (undefined == this.datos || null == this.datos || undefined == this.datos.idPagosjg) {
        this.modoEdicion = false;
      } else {
        this.modoEdicion = true;
      }

      this.numCriterios = 0;
      this.showCards = true;
        });

    });
  }

  volver() {
    if(this.idFacturacionDesdeFichaFac != null) {
      const datos = {
        idFacturacion: this.idFacturacionDesdeFichaFac,
        idEstado: '30'
      }
      this.persistenceService.setDatos(datos);
    }
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

  addEnlace(enlace: Enlace) {
    this.tarjetaFija.enlaces.find(el => el.id == enlace.id).ref = enlace.ref;
  }

  isOpenReceive(event) {

    if (this.modoEdicion) {

      switch (event) {
        case 'facSJCSFichaPagosDatosGen':
          this.datosPagos.showFicha = true;
          break;
        case 'facSJCSFichaPagosConcep':
          this.conceptos.showFichaCriterios = true;;
          break;
        case 'facSJCSFichaPagosConfigFich':
          this.configuracionFic.showFicha = true;
          break;
        case 'facSJCSFichaPagosCompFac':
          this.compensacion.showFicha = true;
      }

    }

  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  establecerDatosTarjetaResumen() {
    this.tarjetaFija.campos[0].value = this.pago.nombreFac.toString();
    this.tarjetaFija.campos[1].value = this.pago.nombre.toString();
    this.tarjetaFija.campos[2].value = this.pago.desEstado.toString();
  }

  getPago() {

    this.sigaServices.getParam("pagosjcs_getPago", "?idPago=" + this.idPago).subscribe(
      (data: PagosjgDTO) => {

        const resp = data.pagosjgItem[0];
        const error = data.error;

        if (error && null != error && null != error.description) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description.toString()));
        } else {
          this.pago = resp;
        }

        this.establecerDatosTarjetaResumen();
      },
      err => {
        if (null != err.error) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant('general.mensaje.error.bbdd'));
        }
      }
    );

  }

}
