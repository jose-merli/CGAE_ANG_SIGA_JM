import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { TranslateService } from '../../../../../commons/translate';
import { Message } from 'primeng/api';
import { PreAsistenciaItem } from '../../../../../models/guardia/PreAsistenciaItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { procesos_guardia } from '../../../../../permisos/procesos_guarida';
import { CommonsService } from '../../../../../_services/commons.service';
import { Router } from '@angular/router';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { AsistenciasFichaPreasistenciasComponent } from './asistencias-ficha-preasistencias/asistencias-ficha-preasistencias.component';
@Component({
  selector: 'app-ficha-preasistencias',
  templateUrl: './ficha-preasistencias.component.html',
  styleUrls: ['./ficha-preasistencias.component.scss']
})
export class FichaPreasistenciasComponent implements OnInit {

  tarjetaFija = {
    nombre: this.translateService.instant("justiciaGratuita.guardia.solicitudescentralita.datossolicitud"),
    icono: 'fas fa-clipboard',
    detalle: false,
    fixed: true,
    campos: [],
    enlaces: []
  };
  msgs: Message[] = [];
  rutas: string[] = [];
  progressSpinner : boolean = false;
  listaTarjetas = [];
  permisoEscritura : boolean = false;
  @ViewChild(AsistenciasFichaPreasistenciasComponent) asistencias;
  constructor(private location : Location,
    private translateService : TranslateService,
    private sigaServices : SigaServices,
    private router : Router,
    private commonServices : CommonsService,
    private persistenceService : PersistenceService) { }

  ngOnInit() {
    this.rutas = ['SJCS', this.translateService.instant("menu.justiciaGratuita.GuardiaMenu"), this.translateService.instant("justiciaGratuita.guardia.solicitudescentralita.menuitem")];

    this.commonServices.checkAcceso(procesos_guardia.solicitudes_centralita)
    .then(respuesta => {

      this.permisoEscritura = respuesta;

      this.persistenceService.setPermisos(this.permisoEscritura);

       if (this.permisoEscritura == undefined) {
         sessionStorage.setItem("codError", "403");
         sessionStorage.setItem(
           "descError",
           this.translateService.instant("generico.error.permiso.denegado")
         );
         this.router.navigate(["/errorAcceso"]);
       }

    }).catch(error => console.error(error));

    let preasistenciaItem  : PreAsistenciaItem = JSON.parse(sessionStorage.getItem("preasistenciaItemLink"));

    if(preasistenciaItem){
      let camposSolicitud = [
        {
          "key": this.translateService.instant("justiciaGratuita.guardia.solicitudescentralita.navisocentralita"),
          "value": preasistenciaItem.nAvisoCentralita
        },
        {
          "key": this.translateService.instant("censo.fichaIntegrantes.literal.estado"),
          "value": preasistenciaItem.descripcionEstado
        },
        {
          "key": this.translateService.instant("justiciaGratuita.guardia.solicitudescentralita.fechahorallamada"),
          "value": preasistenciaItem.fechaLlamada
        },
        {
          "key": this.translateService.instant("justiciaGratuita.guardia.solicitudescentralita.fechahorarecepcion"),
          "value": preasistenciaItem.fechaRecepcion
        },
        {
          "key": this.translateService.instant("justiciaGratuita.justiciables.literal.colegiado"),
          "value": preasistenciaItem.numeroColegiado + " - " + preasistenciaItem.nombreColegiado
        },
        {
          "key": this.translateService.instant("menu.justiciaGratuita.GuardiaMenu"),
          "value": preasistenciaItem.descripcionGuardia
        },
        {
          "key": this.translateService.instant("gratuita.volantesExpres.literal.centroDetencion"),
          "value": preasistenciaItem.centroDetencion
        }
      ];
      this.tarjetaFija.campos = camposSolicitud;

      //Si hemos pulsado volver después de crear la asistencia desde una preasistencia, ponemos la preasistencia como 
      if(sessionStorage.getItem("creadaFromPreasistencia") == "true"){
        this.tarjetaFija.campos[1]["value"] = "CONFIRMADA";
      }
    }

    let tarjetaAsistencias ={
      id: 'preasistenciasAsistencias',
      nombre: 'Asistencias',
      imagen: 'fa fa-users',
      icono: 'fa fa-users',
      fixed: true,
      detalle: false,
      opened: true,
      campos: []
    }
    this.listaTarjetas.push(tarjetaAsistencias);
    this.getAsistenciasAsociadas();

  }

  backTo() {
    sessionStorage.setItem("volver", "true");
    sessionStorage.removeItem("preasistenciaItemLink");
    this.router.navigate(['/guardiasSolicitudesCentralita']);
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

  getAsistenciasAsociadas(){
    
    let preasistenciaItem  : PreAsistenciaItem = JSON.parse(sessionStorage.getItem("preasistenciaItemLink"));

    this.sigaServices
      .getParam("busquedaGuardias_buscarAsistenciasAsociadas", "?idSolicitud=" + preasistenciaItem.idSolicitud)
      .subscribe(
        n => {
          let asistenciasDTO = n;
          if(asistenciasDTO.error){
            this.showMsg('error', this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.errorResultados"), asistenciasDTO.error.description);
          }else if(asistenciasDTO.tarjetaAsistenciaItems.length === 0){
            this.showMsg('info','Info',this.translateService.instant("informesYcomunicaciones.consultas.mensaje.sinResultados"));
          }else{
            this.listaTarjetas[0].campos = asistenciasDTO.tarjetaAsistenciaItems;
          }    
          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
        },
        () =>{
          this.progressSpinner = false;
        }
      );
  }

  updateEstado(event){
    this.tarjetaFija.campos[1]["value"] = event;
  }
}
