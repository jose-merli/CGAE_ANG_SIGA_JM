import { Component, OnInit, ChangeDetectorRef, Input, ViewChild, OnChanges, ViewEncapsulation } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { ConfirmationService, Message } from "primeng/components/common/api";
import { AuthenticationService } from '../../../../../_services/authentication.service';
import { TranslateService } from '../../../../../commons/translate/translation.service';
// import { DomSanitizer } from '@angular/platform-browser/src/platform-browser';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { cardService } from "./../../../../../_services/cardSearch.service";
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
  selector: 'app-certificados-ficha-colegial',
  templateUrl: './certificados-ficha-colegial.component.html',
  styleUrls: ['./certificados-ficha-colegial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CertificadosFichaColegialComponent implements OnInit, OnChanges {
  tarjetaOtrasColegiacionesNum: string;
  activacionTarjeta: boolean = false;
  emptyLoadFichaColegial: boolean = false;
  openFicha: boolean = false;
  esNewColegiado: boolean = false;
  activacionEditar: boolean = true;
  desactivarVolver: boolean = true;
  colsCertificados;
  mostrarNumero: Boolean = false;
  datosCertificados;
  certificadosBody: FichaColegialCertificadosObject = new FichaColegialCertificadosObject();
  selectedDatosCertificados;
  message;
  messageNoContent;
  fichasPosibles = [
    {
      key: "certificados",
      activa: false
    },
  ];
  selectedItemColegiaciones: number = 10;
  tarjetaOtrasColegiaciones: string;
  @Input() esColegiado: boolean = null;
  datosColegiaciones: any[] = [];
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  checkGeneralBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  colegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  progressSpinner: boolean = false;
  otrasColegiacionesBody: DatosColegiadosObject = new DatosColegiadosObject();
  isColegiadoEjerciente: boolean = false;
  rowsPerPage;
  @ViewChild("tableCertificados")
  tableCertificados: DataTable;
  tarjetaCertificadosNum: string;
  @Input() tarjetaCertificados: string;
  mostrarDatosCertificados: boolean = false;
  DescripcionCertificado;
  selectedItemCertificados: number = 10;
  @Input() idPersona;
  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCols();
    if (
      sessionStorage.getItem("personaBody") != null &&
      sessionStorage.getItem("personaBody") != undefined &&
      JSON.parse(sessionStorage.getItem("esNuevoNoColegiado")) != true
    ) {
      this.generalBody = new FichaColegialGeneralesItem();
      this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.checkGeneralBody = new FichaColegialGeneralesItem();
      this.checkGeneralBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
      if (this.colegialesBody.situacionResidente == "0") this.colegialesBody.situacionResidente = "No";
      if (this.colegialesBody.situacionResidente == "1") this.colegialesBody.situacionResidente = "Si";
    }

    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.emptyLoadFichaColegial = false;
      this.desactivarVolver = false;
      this.activacionTarjeta = false;

      // sessionStorage.removeItem("esNuevoNoColegiado");
      // this.onInitGenerales();
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
    if (this.idPersona != undefined) {
      if (this.datosCertificados == undefined) {
        if(this.tarjetaCertificados == "3" || this.tarjetaCertificados == "2"){
          this.searchCertificados();
        }  
      }
    }
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.emptyLoadFichaColegial = false;
      this.desactivarVolver = false;
      this.activacionTarjeta = false;

      // sessionStorage.removeItem("esNuevoNoColegiado");
      // this.onInitGenerales();
    } else {
      this.activacionEditar = true;
      this.esNewColegiado = false;
      this.activacionTarjeta = true;
    }
  }

  activarPaginacionCertificados() {
    if (!this.datosCertificados || this.datosCertificados.length == 0)
      return false;
    else return true;
  }

  searchCertificados() {
    this.mostrarNumero = false;
    this.messageNoContent = this.translateService.instant(
      "aplicacion.cargando"
    );
    this.message = this.messageNoContent;
    this.sigaServices
      .postPaginado(
        "fichaDatosCertificados_datosCertificadosSearch",
        "?numPagina=1",
        this.idPersona
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.certificadosBody = JSON.parse(data["body"]);
          this.datosCertificados = this.certificadosBody.certificadoItem;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
          this.mostrarNumero = true;
        }, () => {
          if (this.datosCertificados.length > 0) {
            this.mostrarDatosCertificados = true;
            for (let i = 0; i <= this.datosCertificados.length - 1; i++) {
              this.DescripcionCertificado = this.datosCertificados[i];
            }
          }
          if (this.datosCertificados.length == 0) {
            this.message = this.datosCertificados.length.toString();
            this.messageNoContent = this.translateService.instant(
              "general.message.no.registros"
            );
            this.mostrarNumero = true;
          } else {
            this.message = this.datosCertificados.length.toString();
            this.mostrarNumero = true;
          }
        }
      );
  }
  onChangeRowsPerPagesCertificados(event) {
    this.selectedItemCertificados = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableCertificados.reset();
  }
  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }
  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);

    if (
      key == "generales" &&
      !this.activacionTarjeta &&
      !this.emptyLoadFichaColegial
    ) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta && this.message == this.datosCertificados.length.toString()) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
  }
  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }


  getCols() {
    this.colsCertificados = [
      {
        field: "descripcion",
        header: "general.description"
      },
      {
        field: "fechaEmision",
        header: "facturacion.busquedaAbonos.literal.fecha2"
      }
    ];
    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
  }
}
