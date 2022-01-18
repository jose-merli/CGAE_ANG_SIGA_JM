import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { BusquedaRetencionesRequestDTO } from '../../../../../models/sjcs/BusquedaRetencionesRequestDTO';
import { CertificacionesItem } from '../../../../../models/sjcs/CertificacionesItem';
import { CertificacionesObject } from '../../../../../models/sjcs/CertificacionesObject';
import { DescargaCertificacionesXuntaItem } from '../../../../../models/sjcs/DescargaCertificacionesXuntaItem';
import { EstadoCertificacionDTO } from '../../../../../models/sjcs/EstadoCertificacionDTO';
import { EstadoCertificacionItem } from '../../../../../models/sjcs/EstadoCertificacionItem';
import { MovimientosVariosApliCerDTO } from '../../../../../models/sjcs/MovimientosVariosApliCerDTO';
import { MovimientosVariosApliCerItem } from '../../../../../models/sjcs/MovimientosVariosApliCerItem';
import { MovimientosVariosApliCerRequestDTO } from '../../../../../models/sjcs/MovimientosVariosApliCerRequestDTO';
import { MovimientosVariosAsoCerDTO } from '../../../../../models/sjcs/MovimientosVariosAsoCerDTO';
import { MovimientosVariosAsoCerItem } from '../../../../../models/sjcs/MovimientosVariosAsoCerItem';
import { TramitarCerttificacionRequestDTO } from '../../../../../models/sjcs/TramitarCerttificacionRequestDTO';
import { procesos_facturacionSJCS } from '../../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { ESTADO_CERTIFICACION } from '../certificacion-fac.component';
import { TarjetaDatosGeneralesCertificacionComponent } from './tarjeta-datos-generales/tarjeta-datos-generales-certificacion.component';
import { TarjetaFacturacionComponent } from './tarjeta-facturacion/tarjeta-facturacion.component';
import { TarjetaMovimientosVariosAplicadosComponent } from './tarjeta-movimientos-varios-aplicados/tarjeta-movimientos-varios-aplicados.component';
import { TarjetaMovimientosVariosAsociadosComponent } from './tarjeta-movimientos-varios-asociados/tarjeta-movimientos-varios-asociados.component';
import { saveAs } from "file-saver/FileSaver";
import { SigaStorageService } from '../../../../../siga-storage.service';
import { EnvioXuntaItem } from '../../../../../models/sjcs/EnvioXuntaItem';
import { DescargaInfomreCAMItem } from '../../../../../models/sjcs/DescargaInfomreCAMItem';
import { DescargaReintegrosXuntaDTO } from '../../../../../models/sjcs/DescargaReintegrosXuntaDTO';

export interface Enlace {
  id: string;
  ref: any;
}

export const OPERACION_REINTEGROS = 28;

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
  certificacion: CertificacionesItem = new CertificacionesItem();
  estadosCertificacion: EstadoCertificacionItem[] = [];
  showCards: boolean = false;
  filtrosDeBusqueda: BusquedaRetencionesRequestDTO = undefined;
  movimientosVariosAsoCerItemList: MovimientosVariosAsoCerItem[] = [];
  movimientosVariosApliCerItemList: MovimientosVariosApliCerItem[] = [];
  tarjetaFija = {
    nombre: 'facturacionSJCS.facturacionesYPagos.inforesumen',
    icono: 'fas fa-clipboard',
    imagen: '',
    detalle: false,
    fixed: true,
    campos: [],
    enlaces: [
      { id: 'fichaCertDatosGenerales', nombre: this.translateService.instant('general.message.datos.generales'), ref: null },
      { id: 'fichaCertFacturacion', nombre: this.translateService.instant('facturacionSJCS.facturacionesYPagos.buscarFacturacion.facturacion'), ref: null },
      { id: 'fichaCertMovAso', nombre: this.translateService.instant('facturacionSJCS.fichaCertificacion.movVariosAso'), ref: null },
      { id: 'fichaCertMovApli', nombre: this.translateService.instant('facturacionSJCS.fichaCertificacion.movVariosApli'), ref: null }
    ]
  };
  fechasMaxMin: MovimientosVariosApliCerRequestDTO = new MovimientosVariosApliCerRequestDTO();
  esCAM: boolean = false;
  esXunta: boolean = false;


  @ViewChild(TarjetaDatosGeneralesCertificacionComponent) tarjetaDatosGenerales: TarjetaDatosGeneralesCertificacionComponent;
  @ViewChild(TarjetaFacturacionComponent) tarjetaFact: TarjetaFacturacionComponent;
  @ViewChild(TarjetaMovimientosVariosAplicadosComponent) tarjetaMovApli: TarjetaMovimientosVariosAplicadosComponent;
  @ViewChild(TarjetaMovimientosVariosAsociadosComponent) tarjetaMovAso: TarjetaMovimientosVariosAsociadosComponent;

  constructor(
    private location: Location,
    private changeDetectorRef: ChangeDetectorRef,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    private sigaService: SigaServices,
    private sigaStorageService: SigaStorageService
  ) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaCertificacion).then(respuesta => {

      this.permisoEscritura = respuesta;

      if (this.permisoEscritura == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      this.comprobacionesIniciales();

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

        this.modoEdicion = true;
        this.showCards = true;
      }

      if (sessionStorage.getItem("nuevoDesdeTablaCerti")) {
        sessionStorage.removeItem("nuevoDesdeTablaCerti");
        this.modoEdicion = false;
        this.showCards = true;
      }

    }).catch(error => console.error(error));

  }

  async comprobacionesIniciales() {

    this.progressSpinner = true;

    await this.esInsticucionCAMoXunta().then((data: { valor: string }) => {
      this.progressSpinner = false;

      if (data.valor == 'CAM') {
        this.esCAM = true;
      }

      if (data.valor == 'XUNTA') {
        this.esXunta = true;
      }

    }).catch(err => {
      this.progressSpinner = false;
      if (err) this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant('general.mensaje.error.bbdd'));
    });
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
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

  compruebaDatosGeneralesObligatorios(): boolean {

    let res = false;

    if (this.tarjetaDatosGenerales && this.tarjetaDatosGenerales.certificacion && this.tarjetaDatosGenerales.certificacion != null
      && this.tarjetaDatosGenerales.certificacion.nombre && this.tarjetaDatosGenerales.certificacion.nombre != null &&
      this.tarjetaDatosGenerales.certificacion.nombre.trim().length > 0) {
      return true;
    }

    this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));

    return res;
  }

  guardarEvent(event: boolean) {

    if (event && this.compruebaDatosGeneralesObligatorios()) {
      this.progressSpinner = true;

      const payload = new CertificacionesItem();
      payload.nombre = this.tarjetaDatosGenerales.certificacion.nombre;

      if (this.certificacion && this.certificacion.idCertificacion && this.certificacion.idCertificacion != null && this.certificacion.idCertificacion.length > 0) {
        payload.idCertificacion = this.certificacion.idCertificacion;
      }

      this.sigaService.post("certificaciones_createOrUpdateCertificacion", payload).subscribe(
        data => {
          this.progressSpinner = false;
          const res = JSON.parse(data.body);
          if (res.error && res.error != null && res.error.description != null && res.error.description.toString().trim().length > 0 && res.status == 'KO' && (res.error.code == '500' || res.error.code == '400')) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(res.error.description.toString()));
          } else {
            this.getCertificacion(res.id);
            this.getListaEstadosEvent(res.id);
            this.modoEdicion = true;
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          }
        },
        err => {
          this.progressSpinner = false;
        }
      );
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

  reabrirEvent(event: boolean) {

    if (event && this.certificacion.idEstadoCertificacion == ESTADO_CERTIFICACION.ESTADO_CERTIFICACION_CERRADA) {
      this.progressSpinner = true;

      const payload = new CertificacionesItem();
      payload.idCertificacion = this.certificacion.idCertificacion;

      this.sigaService.post("certificaciones_reabrirCertificacion", payload).subscribe(
        data => {
          this.progressSpinner = false;
          const res = JSON.parse(data.body);
          if (res.error && res.error != null && res.error.description != null && res.error.description.toString().trim().length > 0 && res.status == 'KO' && (res.error.code == '500' || res.error.code == '400')) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(res.error.description.toString()));
          } else {
            this.getCertificacion(res.id);
            this.getListaEstadosEvent(res.id);
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          }
        },
        err => {
          this.progressSpinner = false;
        }
      );
    }

  }

  getCertificacion(idCertificacion: string) {

    this.progressSpinner = true;

    const payload = new BusquedaRetencionesRequestDTO();
    payload.idCertificacion = idCertificacion;

    this.sigaService.post("certificaciones_buscarCertificaciones", payload).subscribe(
      data => {
        const resp: CertificacionesObject = JSON.parse(data.body);
        this.progressSpinner = false;

        if (resp && resp.error && resp.error != null && resp.error.description != null && resp.error.code != null && resp.error.code.toString() == "500") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(resp.error.description.toString()));
        } else {
          this.certificacion = resp.certificacionesItemList[0];
          this.tarjetaFact.idCertificacion = this.certificacion.idCertificacion;
        }

      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  addEnlace(enlace: Enlace) {
    this.tarjetaFija.enlaces.find(el => el.id == enlace.id).ref = enlace.ref;
  }

  isOpenReceive(event) {

    if (this.modoEdicion) {

      switch (event) {
        case 'fichaCertDatosGenerales':
          this.tarjetaDatosGenerales.showDatosGenerales = true;
          break;
        case 'fichaCertFacturacion':
          // this.tarjetaFact.showTarjeta = true;
          break;
        case 'fichaCertMovAso':
          this.tarjetaMovAso.showTarjeta = true;
          break;
        case 'fichaCertMovApli':
          this.tarjetaMovApli.showTarjeta = true;
          break;
      }

    }

  }

  getMvariosAsociadosCertificacion(idCertificacion: string) {

    if (idCertificacion && idCertificacion != null && idCertificacion.trim().length > 0) {

      this.progressSpinner = true;

      this.sigaService.getParam("certificaciones_getMvariosAsociadosCertificacion", `?idCertificacion=${idCertificacion}`).subscribe(
        (resp: MovimientosVariosAsoCerDTO) => {
          this.progressSpinner = false;

          if (resp && resp.error && resp.error != null && resp.error.description != null && resp.error.code != null && (resp.error.code.toString() == "500" || resp.error.code.toString() == "400")) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(resp.error.description.toString()));
          } else {
            this.movimientosVariosAsoCerItemList = resp.movimientosVariosAsoCerItemList;
          }
        },
        err => {
          this.progressSpinner = false;
        }
      );
    }
  }

  getMvariosAplicadosEnPagosEjecutadosPorPeriodo(payload: MovimientosVariosApliCerRequestDTO) {

    if (payload.fechaDesde && payload.fechaDesde != null && payload.fechaHasta && payload.fechaHasta != null) {

      this.progressSpinner = true;

      this.sigaService.post("certificaciones_getMvariosAplicadosEnPagosEjecutadosPorPeriodo", payload).subscribe(
        data => {
          this.progressSpinner = false;
          const resp: MovimientosVariosApliCerDTO = JSON.parse(data.body);

          if (resp && resp.error && resp.error != null && resp.error.description != null && resp.error.code != null && (resp.error.code.toString() == "500" || resp.error.code.toString() == "400")) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(resp.error.description.toString()));
          } else {
            this.movimientosVariosApliCerItemList = resp.movimientosVariosApliCerItemList;
          }
        },
        err => {
          this.progressSpinner = false;
        }
      );
    }
  }

  cerrarYenviar(event) {

    if (event && this.tarjetaFact && this.tarjetaFact != null && this.tarjetaFact.datos && this.tarjetaFact.datos != null && this.tarjetaFact.datos.length > 0) {

      this.progressSpinner = true;

      const payload = new TramitarCerttificacionRequestDTO();
      payload.idCertificacion = this.certificacion.idCertificacion;
      payload.facturacionItemList = JSON.parse(JSON.stringify(this.tarjetaFact.datos));

      this.sigaService.post("certificaciones_tramitarCertificacion", payload).subscribe(
        data => {
          this.progressSpinner = false;

          const res = JSON.parse(data.body);

          if (res.error && res.error != null && res.error.description != null && res.error.description.toString().trim().length > 0 && res.status == 'KO' && (res.error.code == '500' || res.error.code == '400')) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(res.error.description.toString()));
          } else {
            this.getCertificacion(res.id);
            this.getListaEstadosEvent(res.id);
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          }
        },
        err => {
          this.progressSpinner = false;
        }
      );

    }
  }

  saveFactCert(event) {
    let factCert: CertificacionesItem = new CertificacionesItem();
    factCert.idCertificacion = this.certificacion.idCertificacion;
    factCert.idFacturacion = event;

    this.sigaService.post("certificaciones_saveFactCertificacion", factCert).subscribe(
      data => {
        let error = JSON.parse(data.body).error;
        if (error != undefined && error != null && error.description != null) {
          if (error.code == '200') {
            this.showMessage("success", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));

            this.getCertificacion(this.certificacion.idCertificacion)
            this.getMvariosAsociadosCertificacion(this.certificacion.idCertificacion)
            this.fechasMaxMin.fechaDesde = this.certificacion.fechaDesde;
            this.fechasMaxMin.fechaHasta = this.certificacion.fechaHasta;
            this.getMvariosAplicadosEnPagosEjecutadosPorPeriodo(this.fechasMaxMin);
            this.tarjetaFact.restablecer()
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        }
        this.progressSpinner = false;
      },
      err => {

        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      }
    )
  }

  descargar(event: boolean) {

    let url = "certificaciones_descargarCertificacionesXunta";

    if (this.esCAM) {
      url = "certificaciones_descargaInformeCAM";
    }


    if (event && this.tarjetaFact && this.tarjetaFact != null && this.tarjetaFact.datos && this.tarjetaFact.datos != null && this.tarjetaFact.datos.length > 0) {

      this.progressSpinner = true;

      let listaIds: string[] = this.tarjetaFact.datos.map(el => el.idFacturacion.toString());
      let listaIdsSinRepetidos = Array.from(new Set(listaIds));

      const payload = this.esCAM ? new DescargaInfomreCAMItem() : new DescargaCertificacionesXuntaItem();
      payload.idEstadoCertificacion = this.certificacion.idEstadoCertificacion;
      payload.idInstitucion = Number(this.sigaStorageService.institucionActual);
      payload.listaIdFacturaciones = listaIdsSinRepetidos.length > 0 ? listaIdsSinRepetidos : [];

      this.sigaService.postDownloadFilesWithFileName2(url, payload).subscribe(
        (data: { file: Blob, filename: string, status: number }) => {
          this.progressSpinner = false;

          let filename = data.filename.split(';')[1].split('filename')[1].split('=')[1].trim();
          saveAs(data.file, filename);
        },
        err => {
          this.progressSpinner = false;

          if (null != err.error && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.informacion"), this.translateService.instant("messages.general.error.ficheroNoExiste"));
          }
        }
      );

    }
  }

  descargarLogReintegrosXunta(event) {

    if (event && this.tarjetaFact && this.tarjetaFact != null && this.tarjetaFact.datos && this.tarjetaFact.datos != null && this.tarjetaFact.datos.length > 0) {

      this.progressSpinner = true;

      let listaIds: string[] = this.tarjetaFact.datos.map(el => el.idFacturacion.toString());
      let listaIdsSinRepetidos = Array.from(new Set(listaIds));

      const payload = new DescargaReintegrosXuntaDTO();
      payload.idFactsList = listaIdsSinRepetidos;

      this.sigaService.postDownloadFilesWithFileName2("certificaciones_descargarLogReintegrosXunta", payload).subscribe(
        data => {

          let filename = data.filename.split(';')[1].split('filename')[1].split('=')[1].trim();
          saveAs(data.file, filename);

          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
          if (err) this.showMessage("error", this.translateService.instant("general.message.informacion"), this.translateService.instant("messages.general.error.ficheroNoExiste"));
        },
        () => {
          this.progressSpinner = false;
        }
      );
    }
  }

  descargarInformeIncidenciasXunta(event) {

    if (event && this.tarjetaFact && this.tarjetaFact != null && this.tarjetaFact.datos && this.tarjetaFact.datos != null && this.tarjetaFact.datos.length > 0) {

      this.progressSpinner = true;

      let listaIds: string[] = this.tarjetaFact.datos.map(el => el.idFacturacion.toString());
      let listaIdsSinRepetidos = Array.from(new Set(listaIds));

      const payload = new DescargaReintegrosXuntaDTO();
      payload.idFactsList = listaIdsSinRepetidos;

      this.sigaService.postDownloadFilesWithFileName2("certificaciones_descargarInformeIncidencias", payload).subscribe(
        (data: { file: Blob, filename: string, status: number }) => {

          let filename = data.filename.split(';')[1].split('filename')[1].split('=')[1].trim();
          saveAs(data.file, filename);

          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
          if (err) this.showMessage("error", this.translateService.instant("general.message.informacion"), this.translateService.instant("messages.general.error.ficheroNoExiste"));
        },
        () => {
          this.progressSpinner = false;
        }
      );
    }
  }

  enviarReintegros(event: boolean) {

    if (event && this.tarjetaFact && this.tarjetaFact != null && this.tarjetaFact.datos && this.tarjetaFact.datos != null && this.tarjetaFact.datos.length > 0) {

      this.progressSpinner = true;

      let listaIds: string[] = this.tarjetaFact.datos.map(el => el.idFacturacion.toString());
      let listaIdsSinRepetidos = Array.from(new Set(listaIds));

      const payload = new EnvioXuntaItem();
      payload.idInstitucion = Number(this.sigaStorageService.institucionActual);
      payload.listaIdFacturaciones = listaIdsSinRepetidos.length > 0 ? listaIdsSinRepetidos : [];
      payload.codigoOperacion = OPERACION_REINTEGROS;

      this.sigaService.post("certificaciones_accionXuntaEnvios", payload).subscribe(
        data => {
          this.progressSpinner = false;

          const res = JSON.parse(data.body);

          if (res.error && res.error != null && res.error.description != null && res.error.description.toString().trim().length > 0 && res.status == 'KO' && (res.error.code == '500' || res.error.code == '400')) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(res.error.description.toString()));
          } else {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          }
        },
        err => {
          this.progressSpinner = false;
        }
      );

    }

  }

  subirFicheroCAM(event: File) {

    if (event && this.tarjetaFact && this.tarjetaFact != null && this.tarjetaFact.datos && this.tarjetaFact.datos != null && this.tarjetaFact.datos.length > 0) {

      this.progressSpinner = true;

      let listaIds: string[] = this.tarjetaFact.datos.map(el => el.idFacturacion.toString());
      let listaIdsSinRepetidos = Array.from(new Set(listaIds));

      this.sigaService.postSendFileAndParameters2("certificaciones_subirFicheroCAM", event, {
        listaIdFacturaciones: listaIdsSinRepetidos.length > 0 ? listaIdsSinRepetidos : []
      }).subscribe(
        data => {

          this.progressSpinner = false;

          const res = data;

          if (res.error && res.error != null && res.error.description != null && res.error.description.toString().trim().length > 0 && res.status == 'KO' && (res.error.code == '500' || res.error.code == '400')) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(res.error.description.toString()));
          } else {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          }

        },
        err => {
          this.progressSpinner = false;
        }
      );

    }

  }

  esInsticucionCAMoXunta() {
    return this.sigaService.get("certificaciones_perteneceInstitucionCAMoXunta").toPromise();
  }

}

