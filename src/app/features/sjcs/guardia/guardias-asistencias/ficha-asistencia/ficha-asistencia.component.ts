import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate';
import { DatePipe, Location } from '@angular/common';
import { PreAsistenciaItem } from '../../../../../models/guardia/PreAsistenciaItem';

@Component({
  selector: 'app-ficha-asistencia',
  templateUrl: './ficha-asistencia.component.html',
  styleUrls: ['./ficha-asistencia.component.scss']
})
export class FichaAsistenciaComponent implements OnInit {

  msgs: Message[] = [];
  rutas: string[] = [];
  progressSpinner : boolean = false;
  preasistencia : PreAsistenciaItem;
  listaTarjetas = [];
  tarjetaFija = {
    nombre: 'Resumen Asistencia',
    icono: 'fas fa-clipboard',
    detalle: false,
    fixed: true,
    campos: [],
    enlaces: []
  };
  constructor(private location : Location,
    private translateService : TranslateService,) { }

  ngOnInit() {

    this.preasistencia = JSON.parse(sessionStorage.getItem("preasistenciaItemLink"));
    this.rutas = ['SJCS', this.translateService.instant("menu.justiciaGratuita.GuardiaMenu"), this.translateService.instant("menu.justiciaGratuita.asistencia")];

    if(this.preasistencia){
      
      //TARJETA FIJA RESUMEN
      let camposResumen = [
          {
            "key": this.translateService.instant("justiciaGratuita.ejg.datosGenerales.annioNum"),
            "value": ''
          },
          {
            "key": this.translateService.instant("censo.resultadosSolicitudesModificacion.literal.fecha"),
            "value": ''
          },
          {
            "key": this.translateService.instant("dato.jgr.guardia.inscripciones.letrado"),
            "value": ''
          },
          {
            "key": this.translateService.instant("justiciaGratuita.guardia.solicitudescentralita.asistido"),
            "value": ''
          },
          {
            "key": this.translateService.instant("censo.fichaIntegrantes.literal.estado"),
            "value": ''
          },
          {
            "key": 'Número de Actuaciones',
            "value": ''
          },
          {
            "key": this.translateService.instant("justiciaGratuita.oficio.designas.actuaciones.validada"),
            "value": ''
          }
      ]

      this.tarjetaFija.campos = camposResumen;

      //TARJETA DATOS GENERALES
      let tarjetaDatosGenerales = {
        nombre: 'Datos Generales',
        icono: 'fa fa-user',
        detalle: true,
        fixed: false,
        opened: false,
        campos: [],
        enlaces: []
      };

      let camposDatosGenerales = [
        {
          "key": this.translateService.instant("dato.jgr.guardia.guardias.turno"),
          "value": ''
        },
        {
          "key": this.translateService.instant("menu.justiciaGratuita.GuardiaMenu"),
          "value": ''
        },
        {
          "key": this.translateService.instant("sjcs.guardia.asistencia.tipoasistenciacolegio"),
          "value": ''
        },
        {
          "key": this.translateService.instant("censo.resultadosSolicitudesModificacion.literal.fecha") + ' ' + this.translateService.instant("agenda.fichaEventos.datosAsistencia.asistencia"),
          "value": ''
        }
      ]
      tarjetaDatosGenerales.campos = camposDatosGenerales;
      this.listaTarjetas.push (tarjetaDatosGenerales);
    }
  }

  clear() {
    this.msgs = [];
  }

  showMsg(severityParam : string, summaryParam : string, detailParam : string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }

  backTo(){
    this.location.back();
  }
}
