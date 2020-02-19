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


  constructor(private sigaServices: SigaServices,
    private authenticationService: AuthenticationService,
    private translateService: TranslateService,
    private router: Router) { }

  ngOnInit() {


    this.generalBody = new FichaColegialGeneralesItem();
    this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
    this.checkGeneralBody = new FichaColegialGeneralesItem();
    this.checkGeneralBody = JSON.parse(sessionStorage.getItem("personaBody"));
    this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
    if (this.colegialesBody.situacionResidente == "0") this.colegialesBody.situacionResidente = "No";
    if (this.colegialesBody.situacionResidente == "1") this.colegialesBody.situacionResidente = "Si";

    this.idPersona = this.generalBody.idPersona;


    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.emptyLoadFichaColegial = false;
      this.desactivarVolver = false;
      this.activacionTarjeta = false;
      sessionStorage.removeItem("esNuevoNoColegiado");
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

 
}
