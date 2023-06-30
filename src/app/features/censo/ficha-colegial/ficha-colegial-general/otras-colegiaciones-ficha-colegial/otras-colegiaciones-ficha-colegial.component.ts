import { Component, OnInit, ChangeDetectorRef, Input, ViewChild, OnChanges, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
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

@Component({
  selector: 'app-otras-colegiaciones-ficha-colegial',
  templateUrl: './otras-colegiaciones-ficha-colegial.component.html',
  styleUrls: ['./otras-colegiaciones-ficha-colegial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OtrasColegiacionesFichaColegialComponent implements OnInit, OnChanges {
  activacionTarjeta: boolean = false;
  emptyLoadFichaColegial: boolean = false;
  openFicha: boolean = false;
  esNewColegiado: boolean = false;
  activacionEditar: boolean = true;
  desactivarVolver: boolean = true;
  colsColegiaciones;
  mostrarOtrasColegiaciones;
  mostrarNumero: Boolean = false;
  message: String;
  messageNoContent: String = "";
  fichasPosibles = [
    {
      key: "colegiaciones",
      activa: false
    },
  ];
  selectedItemColegiaciones: number = 10;
  @Input() tarjetaOtrasColegiaciones: string;
  datosColegiaciones: any[] = [];
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  checkGeneralBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  colegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  progressSpinner: boolean = false;
  otrasColegiacionesBody: DatosColegiadosObject = new DatosColegiadosObject();
  isColegiadoEjerciente: boolean = false;
  rowsPerPage;
  @ViewChild("tableColegiaciones")
  tableColegiaciones: DataTable;
  DescripcionOtrasColegiaciones;
  @Input() esColegiado: boolean = null;
  @Input() openOtrasCole;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

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

      this.onInitOtrasColegiaciones();
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
    if(this.tarjetaOtrasColegiaciones == "3" || this.tarjetaOtrasColegiaciones == "2"){
      this.onInitOtrasColegiaciones();
    }
    if (this.openOtrasCole == true) {
      if (this.openFicha == false) {
        this.abreCierraFicha('colegiaciones')
      }
    }
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
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
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

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }
  onInitOtrasColegiaciones() {
    this.searchOtherCollegues();
  }

  activarPaginacionOtrasColegiaciones() {
    if (!this.datosColegiaciones || this.datosColegiaciones.length == 0)
      return false;
    else return true;
  }

  searchOtherCollegues() {
    this.mostrarNumero = false;
    this.sigaServices
      .postPaginado(
        "fichaColegialOtrasColegiaciones_searchOtherCollegues",
        "?numPagina=1",
        this.generalBody.nif
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.otrasColegiacionesBody = JSON.parse(data["body"]);
          this.otrasColegiacionesBody.colegiadoItem.forEach((colegiado, index) =>{
            if(colegiado.idInstitucion==this.generalBody.idInstitucion){
              this.otrasColegiacionesBody.colegiadoItem.splice(index);
            }
          });
          this.datosColegiaciones = this.otrasColegiacionesBody.colegiadoItem;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
          this.mostrarNumero = true;
        },()=>{
          if (this.datosColegiaciones.length > 0) {
            this.mostrarOtrasColegiaciones = true;
            this.DescripcionOtrasColegiaciones = this.datosColegiaciones[0];
          }
          if (this.datosColegiaciones.length == 0 || this.datosColegiaciones == undefined) {
            this.message = this.datosColegiaciones.length.toString();
            this.messageNoContent = this.translateService.instant(
              "general.message.no.registros"
            );
            this.mostrarNumero = true;
          } else {
            this.message = this.datosColegiaciones.length.toString();
            this.mostrarNumero = true;
          }
        }
      );
  }

  onChangeRowsPerPagesColegiaciones(event) {
    this.selectedItemColegiaciones = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableColegiaciones.reset();
  }
  getCols() {
    this.colsColegiaciones = [
      {
        field: "institucion",
        header: "censo.busquedaClientesAvanzada.literal.colegio"
      },
      {
        field: "numColegiado",
        header: "censo.busquedaClientesAvanzada.literal.nColegiado"
      },
      {
        field: "estadoColegial",
        header: "censo.fichaIntegrantes.literal.estado"
      },
      {
        field: "fechaEstadoStr",
        header: "censo.nuevaSolicitud.fechaEstado"

      },
      {
        field: "residenteInscrito",
        header: "censo.ws.literal.residente"
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


  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }
  isOpenReceive(event) {
    let fichaPosible = this.esFichaActiva(event);
    if (fichaPosible == false) {
      this.abreCierraFicha(event);
    }
    // window.scrollTo(0,0);
  }
}
