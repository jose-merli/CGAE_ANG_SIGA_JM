import { Component, OnInit, ChangeDetectorRef, Input, ViewChild, OnChanges } from '@angular/core';
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
  styleUrls: ['./certificados-ficha-colegial.component.scss']
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
  datosCertificados: any[] = [];
  certificadosBody: FichaColegialCertificadosObject = new FichaColegialCertificadosObject();
  selectedDatosCertificados;

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
  tarjetaCertificados: string;
  mostrarDatosCertificados: boolean = false;
  DescripcionCertificado;
  idPersona: any;
  selectedItemCertificados: number = 10;

  constructor(private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private cardService: cardService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    // private sanitizer: DomSanitizer,
    private router: Router,
    private datepipe: DatePipe,
    private location: Location, ) { }

  ngOnInit() {
    this.checkAcceso();
    this.getCols();

    this.generalBody = new FichaColegialGeneralesItem();
    this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
    this.checkGeneralBody = new FichaColegialGeneralesItem();
    this.checkGeneralBody = JSON.parse(sessionStorage.getItem("personaBody"));
    this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
    if (this.colegialesBody.situacionResidente == "0") this.colegialesBody.situacionResidente = "No";
    if (this.colegialesBody.situacionResidente == "1") this.colegialesBody.situacionResidente = "Si";
    this.idPersona = this.generalBody.idPersona;

    this.searchCertificados();
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.emptyLoadFichaColegial = false;
      this.desactivarVolver = false;
      this.activacionTarjeta = false;

      sessionStorage.removeItem("esNuevoNoColegiado");
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
  }

  activarPaginacionCertificados() {
    if (!this.datosCertificados || this.datosCertificados.length == 0)
      return false;
    else return true;
  }

  searchCertificados() {
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
        }, () => {
          if (this.datosCertificados.length > 0) {
            this.mostrarDatosCertificados = true;
            for (let i = 0; i <= this.datosCertificados.length - 1; i++) {
              this.DescripcionCertificado = this.datosCertificados[i];
            }
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
    if (this.activacionTarjeta) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
  }
  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }

  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "290";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjetaCertificadosNum = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        this.tarjetaCertificados = this.tarjetaCertificadosNum;
      }
    );
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
