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
    campos:[],
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
  @ViewChild(FichaBarDatosGeneralesComponent) tarjetaDatosGenerales:FichaBarDatosGeneralesComponent;
  @ViewChild(FichaBarConfiFacComponent) tarjetaConfigFac:FichaBarConfiFacComponent;
  @ViewChild(FichaBarConfiAdiComponent) tarjetaConfigAdi:FichaBarConfiAdiComponent;

  constructor(private translateService: TranslateService,
    private location: Location,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,) { }

  ngOnInit() {
    
    if(sessionStorage.getItem('modoEdicionBaremo') != undefined){
      this.modoEdicion = JSON.parse(sessionStorage.getItem('modoEdicionBaremo'));
      sessionStorage.removeItem('modoEdicionBaremo')
    }

    if(this.modoEdicion){
      if(sessionStorage.getItem('dataBaremoMod')){
        this.datosFichDatGenerales = JSON.parse(sessionStorage.getItem('dataBaremoMod'));
        this.tieneDatos = true;
        sessionStorage.removeItem('dataBaremoMod')
      }
    }else{
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

  getGuardiasByConf(event){
    if(event == true){
      
      this.progressSpinner = true;
      this.sigaServices.get("baremosGuardia_getGuardiasByConf").subscribe(
        data =>{
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
        err =>{
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

  guardarCerrar(){
    console.log(`Dias disponibles: ${this.tarjetaConfigFac.diasDis}\r\n Dias actuacion/asistencia: ${this.tarjetaConfigFac.diasAsiAct}`)
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

}
