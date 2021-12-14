import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { Location } from '@angular/common';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { BaremosGuardiaItem } from '../../../../../models/sjcs/BaremosGuardiaItem';
import { FichaBarDatosGeneralesComponent } from './ficha-bar-datos-generales/ficha-bar-datos-generales.component';
import { FichaBarConfiFacComponent } from './ficha-bar-confi-fac/ficha-bar-confi-fac.component';
import { FichaBarConfiAdiComponent } from './ficha-bar-confi-adi/ficha-bar-confi-adi.component';

export interface Enlace {
  id: string;
  ref: any;
}

@Component({
  selector: 'app-ficha-baremos-de-guardia',
  templateUrl: './ficha-baremos-de-guardia.component.html',
  styleUrls: ['./ficha-baremos-de-guardia.component.scss']
})
export class FichaBaremosDeGuardiaComponent implements OnInit, AfterViewInit {

  tarjetaFija = {
    nombre: 'facturacionSJCS.baremosDeGuardia.inforesumen',
    icono: 'fas fa-clipboard',
    imagen: '',
    detalle: false,
    fixed: true,
    campos: [],
    enlaces: [
      { id: 'facSJCSFichaBarDatosGen', nombre: this.translateService.instant('facturacionSJCS.baremosDeGuardia.datosGenerales'), ref: document.getElementById('facSJCSFichaBarDatosGen') },
      { id: 'facSJCSFichaBarConfiFac', nombre: this.translateService.instant('facturacionSJCS.baremosDeGuardia.confiFac'), ref: document.getElementById('facSJCSFichaBarConfiFac') },
      { id: 'facSJCSFichaBarConfiAdi', nombre: this.translateService.instant('facturacionSJCS.baremosDeGuardia.confiAdi'), ref: document.getElementById('facSJCSFichaBarConfiAdi') }
    ]
  };

  modoEdicion: boolean;
  progressSpinner: boolean;
  datosFichDatGenerales;
  datosFichConfiFac;
  datosFichConfiAdi;
  msgs: any[];
  tieneDatos: boolean;
  @ViewChild(FichaBarDatosGeneralesComponent) tarjetaDatosGenerales: FichaBarDatosGeneralesComponent;
  @ViewChild(FichaBarConfiFacComponent) tarjetaConfigFac: FichaBarConfiFacComponent;
  @ViewChild(FichaBarConfiAdiComponent) tarjetaConfigAdi: FichaBarConfiAdiComponent;

  constructor(private translateService: TranslateService,
    private location: Location,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,) { }

  ngOnInit() {

    if (sessionStorage.getItem('modoEdicionBaremo') != undefined) {
      this.modoEdicion = JSON.parse(sessionStorage.getItem('modoEdicionBaremo'));
      sessionStorage.removeItem('modoEdicionBaremo')
    }

    if (this.modoEdicion) {
      if (sessionStorage.getItem('dataBaremoMod')) {
        this.datosFichDatGenerales = JSON.parse(sessionStorage.getItem('dataBaremoMod'));
        this.tieneDatos = true;
        sessionStorage.removeItem('dataBaremoMod')
      }
    } else {
      this.getGuardiasByConf(true);
    }

  }

  isOpenReceive(event) {


    switch (event) {
      case 'facSJCSFichaBarDatosGen':
        this.tarjetaDatosGenerales.showTarjeta = true;
        break;
      case 'facSJCSFichaBarConfiFac':
        this.tarjetaConfigFac.showTarjeta = true;
        break;
      case 'facSJCSFichaBarConfiAdi':
        this.tarjetaConfigAdi.showTarjeta = true;
        break;

    }

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

  volver() {
    this.location.back();
  }

  addEnlace(enlace: Enlace) {
    this.tarjetaFija.enlaces.find(el => el.id == enlace.id).ref = enlace.ref;
  }

  getGuardiasByConf(event) {
    if (event == true) {

      this.progressSpinner = true;
      this.sigaServices.get("baremosGuardia_getGuardiasByConf").subscribe(
        data => {
          this.datosFichDatGenerales = data.baremosGuardiaItems;
          this.tieneDatos = true;
          let error = JSON.parse(JSON.stringify(data)).error;
          this.progressSpinner = false;

          if (error != undefined && error != null && error.description != null) {
            if (error.code == '200') {
              this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
            } else {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
            }
          }
        },
        err => {
          this.progressSpinner = false;
          if (err != undefined && JSON.parse(JSON.stringify(err)).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
          this.tieneDatos = true;
        }
      )
    }
  }

  guardarCerrar() {
    this.progressSpinner = true
    let confBaremo: BaremosGuardiaItem[] = [];

    let turno, guardia;
    //obtenenos el turno y la guardia (tarjeta datos generales).
    if ((this.tarjetaDatosGenerales.filtros.idTurno != null || this.tarjetaDatosGenerales.filtros.idTurno != undefined)
      && (this.tarjetaDatosGenerales.filtros.idGuardia != null || this.tarjetaDatosGenerales.filtros.idGuardia != undefined)) {
      turno = this.tarjetaDatosGenerales.filtros.idTurno;
      guardia = this.tarjetaDatosGenerales.filtros.idGuardia;

      //tarjeta configuracion de facturacion.
      //por disponibilidad.
      if (this.tarjetaConfigFac.disponibilidad == true) {
        if (this.tarjetaConfigFac.contDis == 'asi') {
          //hito 1
          this.hito(confBaremo, '1', turno, guardia, this.tarjetaConfigFac.filtrosDis.importeDis)

          if ((this.tarjetaConfigFac.filtrosDis.dispAsuntosDis != undefined || this.tarjetaConfigFac.filtrosDis.dispAsuntosDis != null)
            && (this.tarjetaConfigFac.filtrosDis.aPartirDis != undefined || this.tarjetaConfigFac.filtrosDis.aPartirDis != null)) {
            //hito 53
            this.hito(confBaremo, '53', turno, guardia, this.tarjetaConfigFac.filtrosDis.dispAsuntosDis)

            //hito 45
            this.hito(confBaremo, '45', turno, guardia, this.tarjetaConfigFac.filtrosDis.aPartirDis)

          }

          if ((this.tarjetaConfigFac.filtrosDis.importeMaxDis != undefined || this.tarjetaConfigFac.filtrosDis.importeMaxDis != null)
            && (this.tarjetaConfigFac.filtrosDis.aPartirMax != undefined || this.tarjetaConfigFac.filtrosDis.aPartirMax != null)) {

            //hito 2
            this.hito(confBaremo, '2', turno, guardia, this.tarjetaConfigFac.filtrosDis.importeMaxDis)

            //hito 45
            this.hito(confBaremo, '45', turno, guardia, this.tarjetaConfigFac.filtrosDis.aPartirMax)

          }

          if (this.tarjetaConfigFac.filtrosDis.importeMinDis != undefined || this.tarjetaConfigFac.filtrosDis.importeMinDis != null) {

            //hito 55
            this.hito(confBaremo, '55', turno, guardia, this.tarjetaConfigFac.filtrosDis.importeMinDis)
          }

        } else if (this.tarjetaConfigFac.contDis == 'act') {
          //hito 44
          this.hito(confBaremo, '44', turno, guardia, this.tarjetaConfigFac.filtrosDis.importeDis)
          if ((this.tarjetaConfigFac.filtrosDis.dispAsuntosDis != undefined || this.tarjetaConfigFac.filtrosDis.dispAsuntosDis != null)
            && (this.tarjetaConfigFac.filtrosDis.aPartirDis != undefined || this.tarjetaConfigFac.filtrosDis.aPartirDis != null)) {
            //hito 54
            this.hito(confBaremo, '54', turno, guardia, this.tarjetaConfigFac.filtrosDis.dispAsuntosDis)

            //hito 46
            this.hito(confBaremo, '46', turno, guardia, this.tarjetaConfigFac.filtrosDis.aPartirDis)

          }

          if ((this.tarjetaConfigFac.filtrosDis.importeMaxDis != undefined || this.tarjetaConfigFac.filtrosDis.importeMaxDis != null)
            && (this.tarjetaConfigFac.filtrosDis.aPartirMax != undefined || this.tarjetaConfigFac.filtrosDis.aPartirMax != null)) {

            //hito 2
            this.hito(confBaremo, '4', turno, guardia, this.tarjetaConfigFac.filtrosDis.importeMaxDis)

            //hito 46
            this.hito(confBaremo, '46', turno, guardia, this.tarjetaConfigFac.filtrosDis.aPartirMax)

          }

          if (this.tarjetaConfigFac.filtrosDis.importeMinDis != undefined || this.tarjetaConfigFac.filtrosDis.importeMinDis != null) {

            //hito 56
            this.hito(confBaremo, '56', turno, guardia, this.tarjetaConfigFac.filtrosDis.importeMinDis)
          }

        }

      }

      if (this.tarjetaConfigFac.asiac == true) {

        if (this.tarjetaConfigFac.contAsAc == 'asi') {

          //5,20
          if (this.tarjetaConfigFac.precio == 'unico') {
            //hito 5
            this.hito(confBaremo, '5', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.importeAsAc)
            if (this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc != null || this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc != undefined) {
              //hito 3
              this.hito(confBaremo, '3', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc)
            }
            if (this.tarjetaConfigFac.filtrosAsAc.dispAsuntosAsAc != null || this.tarjetaConfigFac.filtrosAsAc.dispAsuntosAsAc != undefined) {
              //hito 10
              this.hito(confBaremo, '10', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.dispAsuntosAsAc)
            }
          } else if (this.tarjetaConfigFac.precio == 'porTipos') {
            //hito 20
            this.hito(confBaremo, '20', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.importeAsAc)
            if (this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc != null || this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc != undefined) {
              //hito 3
              this.hito(confBaremo, '3', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc)
            }
            if (this.tarjetaConfigFac.filtrosAsAc.dispAsuntosAsAc != null || this.tarjetaConfigFac.filtrosAsAc.dispAsuntosAsAc != undefined) {
              //hito 10
              this.hito(confBaremo, '10', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.dispAsuntosAsAc)
            }
          }


        } else if (this.tarjetaConfigFac.contAsAc == 'act') {

          if (this.tarjetaConfigFac.precio == 'unico') {
            //hito 7
            this.hito(confBaremo, '7', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.importeAsAc)
            if (this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc != null || this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc != undefined) {
              //hito 8
              this.hito(confBaremo, '8', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc)
            }
            if (this.tarjetaConfigFac.filtrosAsAc.dispAsuntosAsAc != null || this.tarjetaConfigFac.filtrosAsAc.dispAsuntosAsAc != undefined) {
              //hito 19
              this.hito(confBaremo, '19', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.dispAsuntosAsAc)
            }
          } else if (this.tarjetaConfigFac.precio == 'porTipos') {
            //hito 22
            this.hito(confBaremo, '22', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.importeAsAc)
            if (this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc != null || this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc != undefined) {
              //hito 8
              this.hito(confBaremo, '8', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc)
            }
            if (this.tarjetaConfigFac.filtrosAsAc.dispAsuntosAsAc != null || this.tarjetaConfigFac.filtrosAsAc.dispAsuntosAsAc != undefined) {
              //hito 19
              this.hito(confBaremo, '19', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.dispAsuntosAsAc)
            }
          }

        }

      }

      if (this.tarjetaConfigAdi.facActuaciones == true) {
        //hitos de la tarjeta de configuracion adicional
        if (this.tarjetaConfigAdi.precio == 'unico') {
          if (this.tarjetaConfigAdi.filtrosAdi.importe != null || this.tarjetaConfigAdi.filtrosAdi.importe != undefined) {
            //hito 9
            this.hito(confBaremo, '9', turno, guardia, this.tarjetaConfigAdi.filtrosAdi.importe)
          }
          if (this.tarjetaConfigAdi.filtrosAdi.importeMax != null || this.tarjetaConfigAdi.filtrosAdi.importeMax != undefined) {
            //hito 6
            this.hito(confBaremo, '6', turno, guardia, this.tarjetaConfigAdi.filtrosAdi.importeMax)
          }
        }

        if (this.tarjetaConfigAdi.precio == 'porTipos') {
          if (this.tarjetaConfigAdi.filtrosAdi.importe != null || this.tarjetaConfigAdi.filtrosAdi.importe != undefined) {
            //hito 25
            this.hito(confBaremo, '25', turno, guardia, this.tarjetaConfigAdi.filtrosAdi.importe)
          }
          if (this.tarjetaConfigAdi.filtrosAdi.importeMax != null || this.tarjetaConfigAdi.filtrosAdi.importeMax != undefined) {
            //hito 24
            this.hito(confBaremo, '24', turno, guardia, this.tarjetaConfigAdi.filtrosAdi.importeMax)
          }
        }

      }

      //hitos de configuracion SOJ y EJG
      if (this.tarjetaConfigAdi.importeSOJ != null || this.tarjetaConfigAdi.importeSOJ != undefined) {
        //hito 12
        let hito: BaremosGuardiaItem = new BaremosGuardiaItem()
        hito.idHito = '12'
        hito.idTurno = turno;
        hito.idGuardia = guardia;
        hito.precioHito = this.tarjetaConfigAdi.importeSOJ
        confBaremo.push(hito);
      }

      if (this.tarjetaConfigAdi.importeEJG != null || this.tarjetaConfigAdi.importeEJG != undefined) {
        //hito 13
        let hito: BaremosGuardiaItem = new BaremosGuardiaItem()
        hito.idHito = '13'
        hito.idTurno = turno;
        hito.idGuardia = guardia;
        hito.precioHito = this.tarjetaConfigAdi.importeEJG
        confBaremo.push(hito);
      }

      this.sigaServices.post("baremosGuardia_saveBaremo", confBaremo).subscribe(
        data => {
          let error = JSON.parse(data.body).error;
          this.progressSpinner = false;

          if (error != undefined && error != null && error.description != null) {
            if (error.code == '200') {
              this.showMessage("success", this.translateService.instant("general.message.success"), this.translateService.instant(error.description));
            } else {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
            }
          }
        },
        err => {
          this.progressSpinner = false;
          if (err != undefined && JSON.parse(JSON.stringify(err)).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        }
      )
    } else {
      this.progressSpinner = false;
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));

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

  getDiasYAgrupar(obj: BaremosGuardiaItem) {
    let ficha = this.tarjetaConfigFac
    let diasDis = "";
    let diasAsAc = "";

    if (ficha.disponibilidad) {
      if(ficha.agruparDis == 0){
        obj.agrupar = 0
      }else if(ficha.agruparDis == 1 || ficha.agruparDis == undefined){
        obj.agrupar = 1
      }
      if (ficha.checkDisL == true) {
        diasDis += 'L'
      }
      if (ficha.checkDisM == true) {
        diasDis += 'M'
      }
      if (ficha.checkDisX == true) {
        diasDis += 'X'
      }
      if (ficha.checkDisJ == true) {
        diasDis += 'J'
      }
      if (ficha.checkDisV == true) {
        diasDis += 'V'
      }
      if (ficha.checkDisS == true) {
        diasDis += 'S'
      }
      if (ficha.checkDisD == true) {
        diasDis += 'D'
      }

      obj.dias = diasDis.toString().trim();

    }
    if (ficha.asiac) {
      if(ficha.agruparAsAc == 0){
        obj.agrupar = 0
      }else if(ficha.agruparAsAc == 1 || ficha.agruparAsAc == undefined){
        obj.agrupar = 1
      }
      if (ficha.checkAsAcL == true) {
        diasAsAc += 'L'
      }
      if (ficha.checkAsAcM == true) {
        diasAsAc += 'M'
      }
      if (ficha.checkAsAcX == true) {
        diasAsAc += 'X'
      }
      if (ficha.checkAsAcJ == true) {
        diasAsAc += 'J'
      }
      if (ficha.checkAsAcV == true) {
        diasAsAc += 'V'
      }
      if (ficha.checkAsAcS == true) {
        diasAsAc += 'S'
      }
      if (ficha.checkAsAcD == true) {
        diasAsAc += 'D'
      }

      obj.dias = diasAsAc.toString().trim();
    }
  }

  hito(obj, idHito, turno, guardia, precio) {
    let hito: BaremosGuardiaItem = new BaremosGuardiaItem()
    hito.idHito = idHito
    this.getDiasYAgrupar(hito)
    hito.idTurno = turno;
    hito.idGuardia = guardia;
    hito.precioHito = precio
    obj.push(hito);
  }

}
