import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../commons/translate';
import { ActuacionDesignaItem } from '../../../../models/sjcs/ActuacionDesignaItem';
import { ActuacionDesignaObject } from '../../../../models/sjcs/ActuacionDesignaObject';
import { DesignaItem } from '../../../../models/sjcs/DesignaItem';
import { JustificacionExpressItem } from '../../../../models/sjcs/JustificacionExpressItem';
import { CommonsService } from '../../../../_services/commons.service';
import { OldSigaServices } from '../../../../_services/oldSiga.service';
import { SigaServices } from '../../../../_services/siga.service';
import { FiltroDesignacionesComponent } from './filtro-designaciones/filtro-designaciones.component';

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
  colegiado: boolean;
  @ViewChild(FiltroDesignacionesComponent) filtros;
  
  datosJustificacion: JustificacionExpressItem = new JustificacionExpressItem();
  
  msgs: Message[] = [];
  actuacionesDesignaItems: ActuacionDesignaItem[] = [];
  
  constructor(public sigaServices: OldSigaServices, public sigaServicesNew: SigaServices, private location: Location,  private commonsService: CommonsService, 
    private datePipe: DatePipe, private translateService: TranslateService) {

    this.url = sigaServices.getOldSigaUrl("designaciones");
  }

  ngOnInit() {
  }

  showTablaJustificacionExpres(event){
    this.muestraTablaJustificacion=event;
  }

  busquedaJustificacionExpres(){
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

  actualizacionJustificacionExpres(event){
    this.muestraTablaJustificacion=false;
    this.progressSpinner = true;

    this.sigaServicesNew.post("justificacionExpres_actualizacion", event).subscribe(
      data => {
        //refrescamos tabla
        this.busquedaJustificacionExpres();
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        console.log(err);
      },);
  }

  eliminacionJustificacionExpres(event){
    this.muestraTablaJustificacion=false;
    this.progressSpinner=true;
    this.sigaServicesNew.post("justificacionExpres_eliminacion", event).subscribe(
      data => {
           //refrescamos tabla
        this.busquedaJustificacionExpres();
        this.progressSpinner=false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
      },
      err => {
        this.muestraTablaJustificacion=true;
        this.progressSpinner=false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        console.log(err);
      },);
  }

  insercionJustificacionExpres(event){
    this.muestraTablaJustificacion=false;
    this.progressSpinner = true;
    this.sigaServicesNew.post("justificacionExpres_insercion", event).subscribe(
      data => {
        //refrescamos tabla
        this.busquedaJustificacionExpres();
        this.progressSpinner = false;
       this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
      },
      err => {
        this.muestraTablaJustificacion=true;
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        console.log(err);
      },);
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
    if(designaItem.numColegiado == ""){
      designaItem.numColegiado = null;
    }
    this.sigaServicesNew.post("designaciones_busqueda", designaItem).subscribe(
      n => {
        this.datos = JSON.parse(n.body);
        this.datos.forEach(element => {
         element.factConvenio = element.ano;
         element.ano = 'D' +  element.ano + '/' + element.codigo;
        //  element.fechaEstado = new Date(element.fechaEstado);
        element.fechaEstado = this.formatDate(element.fechaEstado);
        element.fechaFin = this.formatDate(element.fechaFin);
        element.fechaAlta = this.formatDate(element.fechaAlta);
        element.fechaEntradaInicio = this.formatDate(element.fechaEntradaInicio);
         if(element.estado == 'V'){
           element.sufijo = element.estado;
          element.estado = 'Activo';
         }else if(element.estado == 'F'){
          element.sufijo = element.estado;
          element.estado = 'Finalizado';
         }else if(element.estado == 'A'){
          element.sufijo = element.estado;
          element.estado = 'Anulada';
         }
         element.nombreColegiado = element.apellido1Colegiado +" "+ element.apellido2Colegiado+", "+element.nombreColegiado;
         if(element.nombreInteresado != null){
          element.nombreInteresado = element.apellido1Interesado +" "+ element.apellido2Interesado+", "+element.nombreInteresado;
         }
         if(element.art27 == "1"){
          element.art27 = "Si";
         }else{
          element.art27 = "No";
         }
         const params = {
          anio: element.factConvenio,
          idTurno: element.idTurno,
          numero: element.numero,
          historico: false
        };
        this.progressSpinner = false;
        this.sigaServicesNew.post("actuaciones_designacion", params).subscribe(
          data => {
            let object: ActuacionDesignaObject = JSON.parse(data.body);
            let resp = object.actuacionesDesignaItems;
              let validadas = 0;
              let total = 0;
    
              resp.forEach(el => {

                if (el.validada) {
                  validadas += 1;
                }
              });
              this.actuacionesDesignaItems = resp;
              total = this.actuacionesDesignaItems.length;
              if(total == validadas && total > 0){
                element.validada = "Si";
              }else{
                element.validada = "No";
              }
            });
            this.progressSpinner = false;
          },
          err => {
            this.progressSpinner = false;
            console.log(err);
          }
        );
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
        this.progressSpinner = false;
        setTimeout(() => {
          this.commonsService.scrollTablaFoco('tablaFoco');
        }, 5);
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

  esColegiado(event){
    this.colegiado = event;
  }

  actuacionesToDleteArr(event){
    this.eliminacionJustificacionExpres(event);
  }
  newActuacionItem(event){
    this.insercionJustificacionExpres(event);
  }
  dataToUpdateArr(event){
    this.actualizacionJustificacionExpres(event);
  }


}
