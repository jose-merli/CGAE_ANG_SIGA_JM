import { Component, OnInit, ChangeDetectorRef, Input, ViewChild, OnChanges } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { ConfirmationService, Message } from "primeng/components/common/api";
import { AuthenticationService } from '../../../../../_services/authentication.service';
import { TranslateService } from '../../../../../commons/translate/translation.service';
// import { DomSanitizer } from '@angular/platform-browser/src/platform-browser';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { cardService } from "../../../../../_services/cardSearch.service";
import { Location } from "@angular/common";
import { ControlAccesoDto } from '../../../../../models/ControlAccesoDto';
import { FichaColegialColegialesItem } from '../../../../../models/FichaColegialColegialesItem';
import { esCalendar, catCalendar, euCalendar, glCalendar } from '../../../../../utils/calendar';
import { AutoComplete, Dialog, Calendar, DataTable } from 'primeng/primeng';
import { SolicitudIncorporacionItem } from '../../../../../models/SolicitudIncorporacionItem';
import { FichaColegialColegialesObject } from '../../../../../models/FichaColegialColegialesObject';
import { FichaColegialGeneralesItem } from '../../../../../models/FichaColegialGeneralesItem';
import { DatosDireccionesItem } from '../../../../../models/DatosDireccionesItem';
import { DatosDireccionesObject } from '../../../../../models/DatosDireccionesObject';
import { ComboEtiquetasItem } from '../../../../../models/ComboEtiquetasItem';
import * as moment from 'moment';
import { DatosColegiadosObject } from '../../../../../models/DatosColegiadosObject';
import { FichaColegialCertificadosObject } from '../../../../../models/FichaColegialCertificadosObject';
import { CommonsService } from '../../../../../_services/commons.service';
import { procesos_facturacionSJCS } from '../../../../../permisos/procesos_facturacionSJCS';
import { procesos_guardia } from '../../../../../permisos/procesos_guarida';
import { procesos_oficio } from '../../../../../permisos/procesos_oficio';
@Component({
  selector: 'app-servicios-interes-ficha-colegial',
  templateUrl: './servicios-interes-ficha-colegial.component.html',
  styleUrls: ['./servicios-interes-ficha-colegial.component.scss']
})
export class ServiciosInteresFichaColegialComponent implements OnInit, OnChanges {
  tarjetaOtrasColegiacionesNum: string;
  activacionTarjeta: boolean = false;
  emptyLoadFichaColegial: boolean = false;
  openFicha: boolean = false;
  esNewColegiado: boolean = false;
  activacionEditar: boolean = true;
  desactivarVolver: boolean = true;
  colsCertificados;
  datosCertificados: any[] = [];
  certificadosBody: FichaColegialCertificadosObject = new FichaColegialCertificadosObject();
  selectedDatosCertificados;
  @Input() tarjetaInteres: string;
  tarjetaInteresNum: string;
  @Input() datosColegiado = new FichaColegialGeneralesItem();
  selectedItemColegiaciones: number = 10;
  tarjetaOtrasColegiaciones: string;
  datosColegiaciones: any[] = [];
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  checkGeneralBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  colegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  progressSpinner: boolean = false;
  otrasColegiacionesBody: DatosColegiadosObject = new DatosColegiadosObject();
  isColegiadoEjerciente: boolean = false;
  rowsPerPage;

  tarjetaCertificadosNum: string;
  tarjetaCertificados: string;
  mostrarDatosCertificados: boolean = false;
  DescripcionCertificado;
  idPersona: any;
  selectedItemCertificados: number = 10;

  @Input() esColegiado: boolean = null;

  isLetrado:boolean = false;
  permisoCartasFacturacion: any;
  permisoCartasPago: any;
  muestraEnlaces: boolean;
  permisoSolicitudesCentralita: any;
  permisoFacturas: boolean;
  permisoMonederos: boolean;
  permisoCuotasSuscripciones: boolean;
  permisoCompraProductos: boolean;
  permisoGuardiasColegiado: any;
  permisoGuardiasAsistencias: true;
  permisoAbonosSJCS: any;
  permisoInscripciones: any;
  permisoInscripcionesGuardias: any;
  permisoDesignas: boolean;
  permisoBajasTemporales: any;


  constructor(private sigaServices: SigaServices,
    private authenticationService: AuthenticationService,
    private translateService: TranslateService,
    private router: Router,
    private commonsService: CommonsService) { }

  ngOnInit() {

    if (sessionStorage.getItem("isLetrado") != null && sessionStorage.getItem("isLetrado") != undefined) {
      this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    }

    if (
      sessionStorage.getItem("personaBody") != null &&
      sessionStorage.getItem("personaBody") != undefined &&
      JSON.parse(sessionStorage.getItem("esNuevoNoColegiado")) != true
    ) {

      this.generalBody = new FichaColegialGeneralesItem();
      this.checkGeneralBody = new FichaColegialGeneralesItem();
      if(sessionStorage.getItem("personaBody") != null && sessionStorage.getItem("personaBody") != 'undefined'){
        this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
        this.checkGeneralBody = JSON.parse(sessionStorage.getItem("personaBody"));
        this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
      }
      if (this.colegialesBody.situacionResidente == "0") this.colegialesBody.situacionResidente = "No";
      if (this.colegialesBody.situacionResidente == "1") this.colegialesBody.situacionResidente = "Si";

      this.idPersona = this.generalBody.idPersona;

    }
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.emptyLoadFichaColegial = false;
      this.desactivarVolver = false;
      this.activacionTarjeta = false;
      // sessionStorage.removeItem("esNuevoNoColegiado");
    } else {
      this.activacionEditar = true;
      this.esNewColegiado = false;
      this.activacionTarjeta = true;
    }

    this.obtenerPermisos();

  }

  async obtenerPermisos() {
    let recibidos = 0; //Determina cuantos servicios de los permisos se han terminado

    this.commonsService.checkAcceso(procesos_facturacionSJCS.cartasFacturacionPago)
      .then(respuesta => {
        this.permisoCartasFacturacion = respuesta;
        recibidos++;
        if (recibidos == 15) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

      this.commonsService.checkAcceso(procesos_facturacionSJCS.cartasFacturacionPago)
      .then(respuesta => {
        this.permisoCartasPago = respuesta;
        recibidos++;
        if (recibidos == 15) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

      this.commonsService.checkAcceso(procesos_guardia.solicitudes_centralita)
      .then(respuesta => {
        this.permisoSolicitudesCentralita = respuesta;
        recibidos++;
        if (recibidos == 15) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

      this.commonsService.checkAcceso(procesos_guardia.solicitudes_centralita)
      .then(respuesta => {
        this.permisoFacturas = true; // Implementar permiso facturas 220
        recibidos++;
        if (recibidos == 15) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

      this.commonsService.checkAcceso(procesos_guardia.solicitudes_centralita)
      .then(respuesta => {
        this.permisoMonederos = true; // Implementar permiso monederos 50
        recibidos++;
        if (recibidos == 15) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

      this.commonsService.checkAcceso(procesos_guardia.solicitudes_centralita)
      .then(respuesta => {
        this.permisoCuotasSuscripciones = true; // Implementar permiso cuotasSuscripciones 45
        recibidos++;
        if (recibidos == 15) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

      this.commonsService.checkAcceso(procesos_guardia.solicitudes_centralita)
      .then(respuesta => {
        this.permisoCompraProductos = true; // Implementar permiso compraProductos 307
        recibidos++;
        if (recibidos == 15) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

      this.commonsService.checkAcceso(procesos_guardia.guardias_colegiado)
      .then(respuesta => {
        this.permisoGuardiasColegiado = respuesta;
        recibidos++;
        if (recibidos == 15) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

      this.commonsService.checkAcceso(procesos_guardia.guardias_colegiado)
      .then(respuesta => {
        this.permisoGuardiasAsistencias = true; // Enlace a classique
        recibidos++;
        if (recibidos == 15) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

      this.commonsService.checkAcceso(procesos_guardia.guardias_colegiado)
      .then(respuesta => {
        this.permisoAbonosSJCS = true; // Implementar permiso abonosSJCS 60A
        recibidos++;
        if (recibidos == 15) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

      this.commonsService.checkAcceso(procesos_oficio.inscripciones)
      .then(respuesta => {
        this.permisoInscripciones = respuesta;
        recibidos++;
        if (recibidos == 15) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

      this.commonsService.checkAcceso(procesos_guardia.inscripciones_guardias)
      .then(respuesta => {
        this.permisoInscripcionesGuardias = respuesta;
        recibidos++;
        if (recibidos == 15) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

      this.commonsService.checkAcceso(procesos_oficio.designa)
      .then(respuesta => {
        this.permisoDesignas = respuesta;
        recibidos++;
        if (recibidos == 15) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

      // Duplicado
      this.commonsService.checkAcceso(procesos_oficio.inscripciones)
      .then(respuesta => {
        this.permisoInscripciones = respuesta;
        recibidos++;
        if (recibidos == 15) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

      this.commonsService.checkAcceso(procesos_oficio.bajastemporales)
      .then(respuesta => {
        this.permisoBajasTemporales = respuesta;
        recibidos++;
        if (recibidos == 15) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));
  }

  enviarEnlacesTarjeta() {
    this.muestraEnlaces = true;
  }

  ngOnChanges() {
    if (this.esColegiado != null) {
      if (this.esColegiado) {
        if (this.colegialesBody.situacion == "20") {
          this.isColegiadoEjerciente = true;
        } else {
          this.isColegiadoEjerciente = false;
        }
      }

      let migaPan = "";

      if (this.esColegiado) {
        migaPan = this.translateService.instant("menu.censo.fichaColegial");
      } else {
        migaPan = this.translateService.instant("menu.censo.fichaNoColegial");
      }

      sessionStorage.setItem("migaPan", migaPan);

      this.generalBody.colegiado = this.esColegiado;
      this.checkGeneralBody.colegiado = this.esColegiado;

    }
  }

  irTurnoOficio() {
    let idInstitucion = this.authenticationService.getInstitucionSession();
    // let  us = this.sigaServices.getOldSigaUrl() +"SIGA/CEN_BusquedaClientes.do?noReset=true";

    // let  us = this.sigaServices.getOldSigaUrl() + "JGR_DefinirTurnosLetrado.do?granotmp="+new Date().getMilliseconds()+"&accion=ver&idInstitucionPestanha="+idInstitucion+"&idPersonaPestanha="+this.generalBody.idPersona+"";
    let us = undefined;
    if (sessionStorage.getItem("filtrosBusquedaNoColegiados")) {
      sessionStorage.setItem("tipollamada", "busquedaNoColegiado");
      us =
        this.sigaServices.getOldSigaUrl() +
        "CEN_BusquedaClientes.do?modo=Editar&seleccionarTodos=&colegiado=1&avanzada=&actionModal=&verFichaLetrado=&tablaDatosDinamicosD=" +
        this.generalBody.idPersona +
        "%2C" +
        idInstitucion +
        "%2CNINGUNO%2C1&filaSelD=1";
    } else if (sessionStorage.getItem("fichaColegialByMenu")) {
      sessionStorage.setItem("tipollamada", "fichaColegial");
      us =
        this.sigaServices.getOldSigaUrl() +
        "CEN_FichaColegial.do";
    } else {
      sessionStorage.setItem("tipollamada", "busquedaColegiados");
      us =
        this.sigaServices.getOldSigaUrl() +
        "CEN_BusquedaClientes.do?modo=Editar&seleccionarTodos=&colegiado=1&avanzada=&actionModal=&verFichaLetrado=&tablaDatosDinamicosD=" +
        this.generalBody.idPersona +
        "%2C" +
        idInstitucion +
        "%2CNINGUNO%2C1&filaSelD=1";
    }

    sessionStorage.setItem("url", JSON.stringify(us));
    sessionStorage.removeItem("reload");
    sessionStorage.setItem("reload", "si");
    sessionStorage.setItem("personaBody", JSON.stringify(this.generalBody));
    sessionStorage.setItem("idInstitucionFichaColegial", idInstitucion.toString());
    this.router.navigate(["/turnoOficioCenso"]);
  }

  turnoInscrito(){
    if(!this.isLetrado){
      sessionStorage.setItem("colegiadoRelleno","true");
      sessionStorage.setItem("datosColegiado",JSON.stringify(this.generalBody));
    }
      this.router.navigate(["/inscripciones"]);
  }
  designas(){
    if(!this.isLetrado){
      sessionStorage.setItem("colegiadoRelleno","true");
      sessionStorage.setItem("datosColegiado",JSON.stringify(this.generalBody));
    }
      this.router.navigate(["/designaciones"]);
  }
  bajasTemporales(){
    if(!this.isLetrado){
      sessionStorage.setItem("colegiadoRelleno","true");
      sessionStorage.setItem("datosColegiado",JSON.stringify(this.generalBody));
    }
      this.router.navigate(["/bajasTemporales"]);
  }

  comprasProductos(){
    if(!this.isLetrado){
      sessionStorage.setItem("abogado",JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("fromFichaCen","true");
    this.router.navigate(["/compraProductos"]);
  }

  cuotasSuscripciones(){
    if(!this.isLetrado){
      sessionStorage.setItem("abogado",JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("fromFichaCen","true");
    this.router.navigate(["/cuotasSuscripciones"]);
  }

  monederos(){
    if(!this.isLetrado){
      sessionStorage.setItem("abogado",JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("fromFichaCen","true");
    this.router.navigate(["/busquedaMonedero"]);
  }

  inscripcionesGuardia(){
    if(!this.isLetrado){
      sessionStorage.setItem("colegiadoRelleno","true");
      sessionStorage.setItem("datosColegiado",JSON.stringify(this.generalBody));
    }
      this.router.navigate(["/inscripcionesGuardia"]);
  }
  guardiasColegiado(){
    if(!this.isLetrado){
      sessionStorage.setItem("colegiadoRelleno","true");
      sessionStorage.setItem("datosColegiado",JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("origin","fichaColegial");
    this.router.navigate(["/guardiasColegiado"]);
  }
  asistencias(){
    if(!this.isLetrado){
      sessionStorage.setItem("colegiadoRelleno","true");
      sessionStorage.setItem("datosColegiado",JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("origin","fichaColegial");
    this.router.navigate(["/guardiasAsistencias"]); //, { queryParams: { searchMode: 'a' } }
  }
  preAsistencia(){
    if(!this.isLetrado){
      sessionStorage.setItem("colegiadoRelleno","true");
      sessionStorage.setItem("datosColegiado",JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("origin","fichaColegial");
    this.router.navigate(["/guardiasSolicitudesCentralita"]);
  }
  facturas(){
    if(!this.isLetrado){
      sessionStorage.setItem("colegiadoRelleno","true");
      sessionStorage.setItem("datosColegiado",JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("origin","fichaColegial");
    this.router.navigate(["/facturas"]);
  }
  abonosSJCS(){
    if(!this.isLetrado){
      sessionStorage.setItem("colegiadoRelleno","true");
      sessionStorage.setItem("datosColegiado",JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("origin","fichaColegial");
    this.router.navigate(["/abonosSJCS"]);
  }

  cartasFacturacion(){
    if(!this.isLetrado){
      sessionStorage.setItem("colegiadoRelleno","true");
      sessionStorage.setItem("datosColegiado",JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("origin","fichaColegial");
    sessionStorage.removeItem("apartadoFacturacion");
    sessionStorage.removeItem("apartadoPagos");
    sessionStorage.setItem("apartadoFacturacion", "true");
    this.router.navigate(["/cartaFacturacionPago"]);
  }

  cartasPago(){
    if(!this.isLetrado){
      sessionStorage.setItem("colegiadoRelleno","true");
      sessionStorage.setItem("datosColegiado",JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("origin","fichaColegial");
    sessionStorage.removeItem("apartadoFacturacion");
    sessionStorage.removeItem("apartadoPagos");
    sessionStorage.setItem("apartadoPagos", "true");
    this.router.navigate(["/cartaFacturacionPago"]);
  }

}