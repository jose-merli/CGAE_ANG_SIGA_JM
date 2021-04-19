import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../commons/translate';
import { JustificacionExpressItem } from '../../../../models/sjcs/JustificacionExpressItem';
import { CommonsService } from '../../../../_services/commons.service';
import { OldSigaServices } from '../../../../_services/oldSiga.service';
import { SigaServices } from '../../../../_services/siga.service';
import { FiltroDesignacionesComponent } from './filtro-designaciones/filtro-designaciones.component';
import moment = require('moment');

@Component({
  selector: 'app-designaciones',
  templateUrl: './designaciones.component.html',
  styleUrls: ['./designaciones.component.scss'],

})
export class DesignacionesComponent implements OnInit {

  datos;
  url;
  rutas = ['SJCS', 'Designaciones'];
  progressSpinner: boolean = false;
  muestraTablaJustificacion: boolean = false;
  muestraTablaDesignas: boolean = false;
  comboTipoDesigna: any[];

  @ViewChild(FiltroDesignacionesComponent) filtros;
  
  datosJustificacion: JustificacionExpressItem = new JustificacionExpressItem();
  
  msgs: Message[] = [];

  constructor(public sigaServices: OldSigaServices, public sigaServicesNew: SigaServices, private location: Location,  private commonsService: CommonsService, 
    private datePipe: DatePipe, private translateService: TranslateService) {

    this.url = sigaServices.getOldSigaUrl("designaciones");
  }

  ngOnInit() {
  }

  showTablaJustificacionExpres(event){
    this.muestraTablaJustificacion=event;
  }

  busquedaJustificacionExpres(event){
    this.progressSpinner=true;

    this.sigaServicesNew.post("justificacionExpres_busqueda", this.filtros.filtroJustificacion).subscribe(
      data => {
        this.progressSpinner=false;

        if(data!=undefined && data!=null){
          this.datosJustificacion = JSON.parse(data.body);
        }

        this.muestraTablaJustificacion=true;
      },
      err => {
        this.progressSpinner = false;

        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        console.log(err);
      },
      ()=>{
        setTimeout(()=>{
          this.commonsService.scrollTablaFoco('tablaFoco');
        }, 5);
      });
  }
  
  clear() {
    this.msgs = [];
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  showTablaDesigna(event){
    this.muestraTablaDesignas=event;

  }

  busquedaDesignaciones(event) {
    this.progressSpinner = true;
    let data = sessionStorage.getItem("designaItem");
    let designaItem = JSON.parse(data);
    this.sigaServicesNew.post("designaciones_busqueda", designaItem).subscribe(
      n => {
        this.datos = JSON.parse(n.body);
        this.datos.forEach(element => {
         element.ano = 'D' +  element.ano + '/' + element.numero;
        //  element.fechaEstado = new Date(element.fechaEstado);
        element.fechaEstado = this.formatDate(element.fechaEstado);
        element.fechaAlta = this.formatDate(element.fechaAlta);
         if(element.art27 == 'V'){
           element.sufijo = element.art27;
          element.art27 = 'Activo';
         }else if(element.art27 == 'F'){
          element.sufijo = element.art27;
          element.art27 = 'Finalizado';
         }else if(element.art27 == 'A'){
          element.sufijo = element.art27;
          element.art27 = 'Anulada';
         }
         element.idTipoDesignaColegio = element.observaciones;
         element.nombreColegiado = element.apellido1Colegiado +" "+ element.apellido2Colegiado+", "+element.nombreColegiado;
         element.nombreInteresado = element.apellido1Interesado +" "+ element.apellido2Interesado+", "+element.nombreInteresado;
        });
        this.progressSpinner=false;
        this.showTablaDesigna(true);
        this.commonsService.scrollTablaFoco("tablaFoco");
      },
      err => {
        this.progressSpinner = false;
        this.commonsService.scrollTablaFoco("tablaFoco");
        // this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

        console.log(err);
      },() => {
        this.progressSpinner = false;
        this.commonsService.scrollTablaFoco("tablaFoco");
      });;
  }

  backTo() {
    this.location.back();
  }

  transformaFecha(fecha) {
    if (fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
      if (rawDate.length < 14) {
        let splitDate = rawDate.split("/");
        let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
        fecha = new Date((arrayDate += "T00:00:00.001Z"));
      } else {
        fecha = new Date(fecha);
      }
    } else {
      fecha = undefined;
    }

    return fecha;
  }
  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datePipe.transform(date, pattern);
  }
 
}
