import { DatePipe, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { BusquedaRetencionesRequestDTO } from '../../../../../models/sjcs/BusquedaRetencionesRequestDTO';
import { CertificacionesItem } from '../../../../../models/sjcs/CertificacionesItem';
import { EstadoCertificacionDTO } from '../../../../../models/sjcs/EstadoCertificacionDTO';
import { EstadoCertificacionItem } from '../../../../../models/sjcs/EstadoCertificacionItem';
import { procesos_facturacionSJCS } from '../../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { TarjetaDatosGeneralesCertificacionComponent } from './tarjeta-datos-generales/tarjeta-datos-generales-certificacion.component';
import { TarjetaFacturacionComponent } from './tarjeta-facturacion/tarjeta-facturacion.component';
import { TarjetaMovimientosVariosAplicadosComponent } from './tarjeta-movimientos-varios-aplicados/tarjeta-movimientos-varios-aplicados.component';
import { TarjetaMovimientosVariosAsociadosComponent } from './tarjeta-movimientos-varios-asociados/tarjeta-movimientos-varios-asociados.component';

@Component({
  selector: 'app-ficha-certificacion-fac',
  templateUrl: './ficha-certificacion-fac.component.html',
  styleUrls: ['./ficha-certificacion-fac.component.scss']
})
export class FichaCertificacionFacComponent implements OnInit, AfterViewChecked {

  msgs: any[];
  modoEdicion: boolean = false;
  permisoEscritura: any;
  progressSpinner: boolean = false;
  certificacion: CertificacionesItem = undefined;
  estadosCertificacion: EstadoCertificacionItem[] = [];
  listaTarjetas = [
    { id: 'fichaCertDatosGenerales', nombre: this.translateService.instant('general.message.datos.generales') },
    { id: 'fichaCertFacturacion', nombre: this.translateService.instant('facturacionSJCS.facturacionesYPagos.buscarFacturacion.facturacion') },
    { id: 'fichaCertMovApli', nombre: this.translateService.instant('facturacionSJCS.fichaCertificacion.movVariosApli') },
    { id: 'fichaCertMovAso', nombre: this.translateService.instant('facturacionSJCS.fichaCertificacion.movVariosAso') },
  ];
  showCards: boolean = false;
  filtrosDeBusqueda: BusquedaRetencionesRequestDTO = undefined;

  @ViewChild(TarjetaDatosGeneralesCertificacionComponent) tarjetaDatosGenerales: TarjetaDatosGeneralesCertificacionComponent;
  @ViewChild(TarjetaFacturacionComponent) tarjetaFact;
  @ViewChild(TarjetaMovimientosVariosAplicadosComponent) tarjetaMovApli;
  @ViewChild(TarjetaMovimientosVariosAsociadosComponent) tarjetaMovAso;

  constructor(
    private location: Location,
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    private datePipe: DatePipe,
    private sigaService: SigaServices
  ) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaCertificacion).then(respuesta => {

      this.permisoEscritura = respuesta;

      if (this.permisoEscritura == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }


      if (sessionStorage.getItem("filtrosBusquedaCerti")) {
        this.filtrosDeBusqueda = JSON.parse(sessionStorage.getItem("filtrosBusquedaCerti"));
        sessionStorage.removeItem("filtrosBusquedaCerti");
      }

      if (sessionStorage.getItem("edicionDesdeTablaCerti")) {
        this.certificacion = JSON.parse(sessionStorage.getItem("edicionDesdeTablaCerti"));
        sessionStorage.removeItem("edicionDesdeTablaCerti");

        if (this.certificacion.fechaDesde && this.certificacion.fechaDesde != null) {
          this.certificacion.fechaDesde = new Date(this.certificacion.fechaDesde);
        }

        if (this.certificacion.fechaHasta && this.certificacion.fechaHasta != null) {
          this.certificacion.fechaHasta = new Date(this.certificacion.fechaHasta);
        }

        this.showCards = true;
        this.modoEdicion = true;
      }

    }).catch(error => console.error(error));

  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  changeModoEdicion(event) {
    this.modoEdicion = event;
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

  volver() {

    if (this.filtrosDeBusqueda) {
      sessionStorage.setItem("filtrosBusquedaCerti", JSON.stringify(this.filtrosDeBusqueda));
    }

    this.location.back();
  }

  guardarEvent(event: boolean) {

    if (event) {

    }
  }

  getListaEstadosEvent(idCertificacion: string) {

    this.progressSpinner = true;

    this.sigaService.getParam("certificaciones_getEstadosCertificacion", `?idCertificacion=${idCertificacion}`).subscribe(
      (data: EstadoCertificacionDTO) => {

        this.progressSpinner = false;

        if (data.error && data.error != null && data.error.description != null && data.error.description.toString().trim().length > 0) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(data.error.description.toString()));
        } else {
          this.estadosCertificacion = data.estadoCertificacionItemList;
        }

      },
      err => {
        this.progressSpinner = false;
      }
    );

  }

}
