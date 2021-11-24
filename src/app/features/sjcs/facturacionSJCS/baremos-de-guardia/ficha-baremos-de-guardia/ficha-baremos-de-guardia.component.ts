import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { Location } from '@angular/common';

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
    campos: [
      // {
      //   "key": this.translateService.instant('facturacionSJCS.retenciones.nColegiado'),
      //   "value": ""
      // }
    ],
    enlaces: [
      { id: 'facSJCSFichaBarDatosGen', nombre: this.translateService.instant('facturacionSJCS.baremosDeGuardia.datosGenerales'), ref: null },
      { id: 'facSJCSFichaBarConfiFac', nombre: this.translateService.instant('facturacionSJCS.baremosDeGuardia.confiFac'), ref: null },
      { id: 'facSJCSFichaBarConfiAdi', nombre: this.translateService.instant('facturacionSJCS.baremosDeGuardia.confiAdi'), ref: null }
    ]
  };

  constructor(private translateService: TranslateService,
    private location: Location) { }

  ngOnInit() {
  }

  isOpenReceive(event) {

    // if (this.retencionesService.modoEdicion) {

    //   switch (event) {
    //     case 'facSJCSFichaRetCol':
    //       this.tarjetaColegiado.showTarjeta = true;
    //       break;
    //     case 'facSJCSFichaRetDatRetJud':
    //       this.tarjetaDatosRetJud.showTarjeta = true;
    //       break;
    //     case 'facSJCSFichaRetAplEnPag':
    //       this.tarjetaAplEnPag.showTarjeta = true;
    //       break;
    //   }

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

}
