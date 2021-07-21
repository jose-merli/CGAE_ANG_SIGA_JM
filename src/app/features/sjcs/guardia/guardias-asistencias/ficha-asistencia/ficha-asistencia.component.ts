import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate';
import { DatePipe, Location } from '@angular/common';
import { PreAsistenciaItem } from '../../../../../models/guardia/PreAsistenciaItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { TarjetaAsistenciaItem } from '../../../../../models/guardia/TarjetaAsistenciaItem';

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
    private translateService : TranslateService,
    private sigaServices : SigaServices) { }

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

  refreshDatosGenerales(event){

    this.progressSpinner = true;
    this.sigaServices.getParam("busquedaGuardias_buscarTarjetaAsistencia", "?anioNumero="+event).subscribe(
      n => {
        this.clear();
        if(n.error !== null
          && n.error.code === 500){
          this.showMsg("error", "Error", n.error.description.toString());
        }else{
          let newAsistenciaData : TarjetaAsistenciaItem = n.tarjetaAsistenciaItems[0];

          this.tarjetaFija.campos[0]["value"] = newAsistenciaData.anioNumero;
          this.tarjetaFija.campos[1]["value"] = newAsistenciaData.fechaAsistencia.substr(0,11);
          this.tarjetaFija.campos[2]["value"] = newAsistenciaData.numeroColegiado + " - " + newAsistenciaData.nombreColegiado;
          this.tarjetaFija.campos[3]["value"] = newAsistenciaData.asistido;
          this.tarjetaFija.campos[4]["value"] = newAsistenciaData.descripcionEstado.toUpperCase();
          this.tarjetaFija.campos[5]["value"] = newAsistenciaData.numeroActuaciones;
          this.tarjetaFija.campos[6]["value"] = newAsistenciaData.validada;

          this.listaTarjetas[0].campos[0]["value"] = newAsistenciaData.descripcionTurno;
          this.listaTarjetas[0].campos[1]["value"] = newAsistenciaData.descripcionGuardia;
          this.listaTarjetas[0].campos[2]["value"] = newAsistenciaData.descripcionTipoAsistenciaColegio;
          this.listaTarjetas[0].campos[3]["value"] = newAsistenciaData.fechaAsistencia;


        }
      },
      err => {
        console.log(err);
      },
      () =>{
        this.progressSpinner = false;
      }
    );

  }

  backTo(){
    this.location.back();
  }
}
