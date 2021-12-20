import { DatePipe, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { CertificacionesItem } from '../../../../../models/sjcs/CertificacionesItem';
// import { CertificacionFacItem } from '../../../../../models/sjcs/CertificacionesItem';
import { procesos_facturacionSJCS } from '../../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { TarjetaDatosGeneralesComponent } from './tarjeta-datos-generales/tarjeta-datos-generales.component';
import { TarjetaFacturacionComponent } from './tarjeta-facturacion/tarjeta-facturacion.component';
import { TarjetaMovimientosVariosAplicadosComponent } from './tarjeta-movimientos-varios-aplicados/tarjeta-movimientos-varios-aplicados.component';
import { TarjetaMovimientosVariosAsociadosComponent } from './tarjeta-movimientos-varios-asociados/tarjeta-movimientos-varios-asociados.component';

@Component({
  selector: 'app-ficha-certificacion-fac',
  templateUrl: './ficha-certificacion-fac.component.html',
  styleUrls: ['./ficha-certificacion-fac.component.scss']
})
export class FichaCertificacionFacComponent implements OnInit {

  msgs: any[];
  modoEdicion: boolean = false;
  permisoEscritura: any;
  progressSpinner: boolean = false;
  certificacion: CertificacionesItem = undefined;
  listaTarjetas = [
    { id: 'fichaCertDatosGenerales', nombre: this.translateService.instant('general.message.datos.generales') },
    { id: 'fichaCertFacturacion', nombre: this.translateService.instant('facturacionSJCS.facturacionesYPagos.buscarFacturacion.facturacion') },
    { id: 'fichaCertMovApli', nombre: this.translateService.instant('facturacionSJCS.fichaCertificacion.movVariosApli') },
    { id: 'fichaCertMovAso', nombre: this.translateService.instant('facturacionSJCS.fichaCertificacion.movVariosAso') },
  ];

  @ViewChild(TarjetaDatosGeneralesComponent) tarjetaDatosGenerales: TarjetaDatosGeneralesComponent;
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
    }).catch(error => console.error(error));

    if (sessionStorage.getItem("edicionDesdeTablaCerti")) {
      this.certificacion = JSON.parse(sessionStorage.getItem("edicionDesdeTablaCerti"));
      sessionStorage.removeItem("edicionDesdeTablaCerti");

      if (this.certificacion.fechaDesde && this.certificacion.fechaDesde != null) {
        this.certificacion.fechaDesde = new Date(this.certificacion.fechaDesde);
      }

      if (this.certificacion.fechaHasta && this.certificacion.fechaHasta != null) {
        this.certificacion.fechaHasta = new Date(this.certificacion.fechaHasta);
      }

      console.log(this.certificacion);

      this.modoEdicion = true;
    }

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
    this.location.back();
  }

  guardarEvent(event: boolean) {

    if(event) {
      
    }
  }

}
