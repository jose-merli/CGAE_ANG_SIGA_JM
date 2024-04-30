import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../../../../_services/authentication.service";
import { CommonsService } from "../../../../../_services/commons.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { DatosColegiadosObject } from "../../../../../models/DatosColegiadosObject";
import { FichaColegialCertificadosObject } from "../../../../../models/FichaColegialCertificadosObject";
import { FichaColegialColegialesItem } from "../../../../../models/FichaColegialColegialesItem";
import { FichaColegialGeneralesItem } from "../../../../../models/FichaColegialGeneralesItem";
import { procesos_facturacionSJCS } from "../../../../../permisos/procesos_facturacion";
import { procesos_guardia } from "../../../../../permisos/procesos_guarida";
import { procesos_oficio } from "../../../../../permisos/procesos_oficio";

@Component({
  selector: "app-servicios-interes-ficha-colegial",
  templateUrl: "./servicios-interes-ficha-colegial.component.html",
  styleUrls: ["./servicios-interes-ficha-colegial.component.scss"],
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
  tarjetaInteresNum: string;
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
  isLetrado: boolean = false;
  tarjetaCertificadosNum: string;
  tarjetaCertificados: string;
  mostrarDatosCertificados: boolean = false;
  DescripcionCertificado;
  idPersona: any;
  selectedItemCertificados: number = 10;
  permisosGuardia: any = {};
  permisosOficio: any = {};
  permisosFacturacion: any = {};

  @Input() tarjetaInteres: string;
  @Input() datosColegiado = new FichaColegialGeneralesItem();
  @Input() esColegiado: boolean = null;

  constructor(private sigaServices: SigaServices, private authenticationService: AuthenticationService, private translateService: TranslateService, private router: Router, private commonsService: CommonsService) {
    this.permisosGuardia = procesos_guardia;
    this.permisosOficio = procesos_oficio;
    this.permisosFacturacion = procesos_facturacionSJCS;
  }

  ngOnInit() {
    if (sessionStorage.getItem("isLetrado") != null && sessionStorage.getItem("isLetrado") != undefined) {
      this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    }

    if (sessionStorage.getItem("personaBody") != null && sessionStorage.getItem("personaBody") != undefined && JSON.parse(sessionStorage.getItem("esNuevoNoColegiado")) != true) {
      this.generalBody = new FichaColegialGeneralesItem();
      this.checkGeneralBody = new FichaColegialGeneralesItem();
      if (sessionStorage.getItem("personaBody") != null && sessionStorage.getItem("personaBody") != "undefined") {
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
    } else {
      this.activacionEditar = true;
      this.esNewColegiado = false;
      this.activacionTarjeta = true;
    }
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
    let us = undefined;
    if (sessionStorage.getItem("filtrosBusquedaNoColegiados")) {
      sessionStorage.setItem("tipollamada", "busquedaNoColegiado");
      us = this.sigaServices.getOldSigaUrl() + "CEN_BusquedaClientes.do?modo=Editar&seleccionarTodos=&colegiado=1&avanzada=&actionModal=&verFichaLetrado=&tablaDatosDinamicosD=" + this.generalBody.idPersona + "%2C" + idInstitucion + "%2CNINGUNO%2C1&filaSelD=1";
    } else if (sessionStorage.getItem("fichaColegialByMenu")) {
      sessionStorage.setItem("tipollamada", "fichaColegial");
      us = this.sigaServices.getOldSigaUrl() + "CEN_FichaColegial.do";
    } else {
      sessionStorage.setItem("tipollamada", "busquedaColegiados");
      us = this.sigaServices.getOldSigaUrl() + "CEN_BusquedaClientes.do?modo=Editar&seleccionarTodos=&colegiado=1&avanzada=&actionModal=&verFichaLetrado=&tablaDatosDinamicosD=" + this.generalBody.idPersona + "%2C" + idInstitucion + "%2CNINGUNO%2C1&filaSelD=1";
    }

    sessionStorage.setItem("url", JSON.stringify(us));
    sessionStorage.removeItem("reload");
    sessionStorage.setItem("reload", "si");
    sessionStorage.setItem("personaBody", JSON.stringify(this.generalBody));
    sessionStorage.setItem("idInstitucionFichaColegial", idInstitucion.toString());
    this.router.navigate(["/turnoOficioCenso"]);
  }

  turnoInscrito() {
    if (!this.isLetrado) {
      sessionStorage.setItem("colegiadoRelleno", "true");
      sessionStorage.setItem("datosColegiado", JSON.stringify(this.generalBody));
    }
    this.router.navigate(["/inscripciones"]);
  }

  designas() {
    if (!this.isLetrado) {
      sessionStorage.setItem("colegiadoRelleno", "true");
      sessionStorage.setItem("datosColegiado", JSON.stringify(this.generalBody));
    }
    this.router.navigate(["/designaciones"]);
  }

  bajasTemporales() {
    if (!this.isLetrado) {
      sessionStorage.setItem("colegiadoRelleno", "true");
      sessionStorage.setItem("datosColegiado", JSON.stringify(this.generalBody));
    }
    this.router.navigate(["/bajasTemporales"]);
  }

  comprasProductos() {
    if (!this.isLetrado) {
      sessionStorage.setItem("abogado", JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("fromFichaCen", "true");
    this.router.navigate(["/compraProductos"]);
  }

  cuotasSuscripciones() {
    if (!this.isLetrado) {
      sessionStorage.setItem("abogado", JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("fromFichaCen", "true");
    this.router.navigate(["/cuotasSuscripciones"]);
  }

  monederos() {
    if (!this.isLetrado) {
      sessionStorage.setItem("abogado", JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("fromFichaCen", "true");
    this.router.navigate(["/busquedaMonedero"]);
  }

  inscripcionesGuardia() {
    if (!this.isLetrado) {
      sessionStorage.setItem("colegiadoRelleno", "true");
      sessionStorage.setItem("datosColegiado", JSON.stringify(this.generalBody));
    }
    this.router.navigate(["/inscripcionesGuardia"]);
  }

  guardiasColegiado() {
    if (!this.isLetrado) {
      sessionStorage.setItem("colegiadoRelleno", "true");
      sessionStorage.setItem("datosColegiado", JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("origin", "fichaColegial");
    this.router.navigate(["/guardiasColegiado"]);
  }

  asistencias() {
    if (!this.isLetrado) {
      sessionStorage.setItem("colegiadoRelleno", "true");
      sessionStorage.setItem("datosColegiado", JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("origin", "fichaColegial");
    this.router.navigate(["/guardiasAsistencias"]); //, { queryParams: { searchMode: 'a' } }
  }

  preAsistencia() {
    if (!this.isLetrado) {
      sessionStorage.setItem("colegiadoRelleno", "true");
      sessionStorage.setItem("datosColegiado", JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("origin", "fichaColegial");
    this.router.navigate(["/guardiasSolicitudesCentralita"]);
  }

  facturas() {
    if (!this.isLetrado) {
      sessionStorage.setItem("colegiadoRelleno", "true");
      sessionStorage.setItem("datosColegiado", JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("origin", "fichaColegial");
    this.router.navigate(["/facturas"]);
  }

  abonosSJCS() {
    if (!this.isLetrado) {
      sessionStorage.setItem("colegiadoRelleno", "true");
      sessionStorage.setItem("datosColegiado", JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("origin", "fichaColegial");
    this.router.navigate(["/abonosSJCS"]);
  }

  cartasFacturacion() {
    if (!this.isLetrado) {
      sessionStorage.setItem("colegiadoRelleno", "true");
      sessionStorage.setItem("datosColegiado", JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("origin", "fichaColegial");
    sessionStorage.removeItem("apartadoFacturacion");
    sessionStorage.removeItem("apartadoPagos");
    sessionStorage.setItem("apartadoFacturacion", "true");
    this.router.navigate(["/cartaFacturacionPago"]);
  }

  cartasPago() {
    if (!this.isLetrado) {
      sessionStorage.setItem("colegiadoRelleno", "true");
      sessionStorage.setItem("datosColegiado", JSON.stringify(this.generalBody));
    }
    sessionStorage.setItem("origin", "fichaColegial");
    sessionStorage.removeItem("apartadoFacturacion");
    sessionStorage.removeItem("apartadoPagos");
    sessionStorage.setItem("apartadoPagos", "true");
    this.router.navigate(["/cartaFacturacionPago"]);
  }
}
