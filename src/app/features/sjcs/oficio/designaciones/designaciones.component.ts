import { DatePipe, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../commons/translate';
import { ActuacionDesignaItem } from '../../../../models/sjcs/ActuacionDesignaItem';
import { ActuacionDesignaObject } from '../../../../models/sjcs/ActuacionDesignaObject';
import { DesignaItem } from '../../../../models/sjcs/DesignaItem';
import { JustificacionExpressItem } from '../../../../models/sjcs/JustificacionExpressItem';
import { SigaStorageService } from '../../../../siga-storage.service';
import { CommonsService } from '../../../../_services/commons.service';
import { OldSigaServices } from '../../../../_services/oldSiga.service';
import { SigaServices } from '../../../../_services/siga.service';
import { FiltroDesignacionesComponent } from './filtro-designaciones/filtro-designaciones.component';
import { element } from 'protractor';
import { ColegiadoItem } from '../../../../models/ColegiadoItem';
import { PersistenceService } from '../../../../_services/persistence.service';

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
  colegiadoJE: boolean;
  colegiadoDesig: boolean;
  isLetrado: boolean = false;
  idPersonaLogado;
  queryImprimir: String;
  numColegiadoLogado;
  usuarioBusquedaExpressFromFicha = {numColegiado: '',
                            nombreAp: ''};
  @ViewChild(FiltroDesignacionesComponent) filtros;
  
  datosJustificacion: JustificacionExpressItem = new JustificacionExpressItem();
  
  msgs: Message[] = [];
  actuacionesDesignaItems: ActuacionDesignaItem[] = [];
  permisosFichaAct = false; 

  totalRegistrosBusquedaDesignaciones: any;

  constructor(public sigaServices: OldSigaServices, public sigaServicesNew: SigaServices, private location: Location,  private commonsService: CommonsService, 
    private datePipe: DatePipe, private translateService: TranslateService, private localStorageService: SigaStorageService,
    private persistenceService: PersistenceService,) {


    this.url = sigaServices.getOldSigaUrl("designaciones");
  }

  ngOnInit() {
    if(sessionStorage.getItem("deJusticiableANuevaDesigna")){
      if(sessionStorage.getItem("justiciable")){
        sessionStorage.removeItem("justiciable");
      }
      sessionStorage.removeItem("deJusticiableANuevaDesigna");
    }
    
    if(sessionStorage.getItem("filtroAsistenciaExpresBusqueda") != null){
      sessionStorage.removeItem("filtroAsistenciaExpresBusqueda");
    }

    if (sessionStorage.getItem("colegiadoRelleno") == "true" 
        && sessionStorage.getItem("datosColegiado") != null && sessionStorage.getItem("datosColegiado") != undefined){
      const { numColegiado, nombre } = JSON.parse(sessionStorage.getItem("datosColegiado"));
        this.usuarioBusquedaExpressFromFicha.numColegiado = numColegiado; //pasar al filtro
        this.usuarioBusquedaExpressFromFicha.nombreAp = nombre.replace(/,/g,""); //pasar al filtro
    }else{
      sessionStorage.setItem("colegiadoRelleno","false");
    }

    sessionStorage.setItem("rowIdsToUpdate", JSON.stringify([]));
    this.isLetrado = this.localStorageService.isLetrado;
    this.idPersonaLogado = this.localStorageService.idPersona;
    this.numColegiadoLogado = this.localStorageService.numColegiado;
    if(this.isLetrado==undefined){
      this.commonsService.getLetrado()
      .then(respuesta => {
        this.isLetrado = respuesta;
        if(this.isLetrado){
          this.getDataLoggedUser();
        }
      });
    }

    this.persistenceService.clearDesignacion();
    this.persistenceService.clearAsistencia();
    this.persistenceService.clearDatosEJG();
  }

  getDataLoggedUser() {
    this.progressSpinner = true;
  
    this.sigaServicesNew.get("usuario_logeado").subscribe(n => {
  
      const usuario = n.usuarioLogeadoItem;
      const colegiadoItem = new ColegiadoItem();
      colegiadoItem.nif = usuario[0].dni;
  
      this.sigaServicesNew.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(
        usr => {
          let usuarioLogado = JSON.parse(usr.body).colegiadoItem[0];
					if(usuarioLogado) {
						this.idPersonaLogado = usuarioLogado.idPersona;
						this.numColegiadoLogado = usuarioLogado.numColegiado;
					}

          this.progressSpinner = false;
  
         }, err =>{
          this.progressSpinner = false;
        },
        ()=>{
          this.progressSpinner = false;
        });
      });
  }

  showTablaJustificacionExpres(event){
    this.muestraTablaJustificacion=event;
  }

  
  getImprimirQuery(){
    this.sigaServicesNew.post("designacion_queryImprimirJustificacionExpres", this.filtros.filtroJustificacion).subscribe(
      data => {
        this.queryImprimir = JSON.parse(data.body).valor;
      },
      err => {
        this.progressSpinner = false;

        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      });

  }

  busquedaJustificacionExpres(){
    this.progressSpinner=true;
    this.datosJustificacion = new JustificacionExpressItem();
    
    if(sessionStorage.getItem("buscadorColegiados")){​​
      this.progressSpinner=true;
      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));

      this.filtros.filtroJustificacion.nColegiado = busquedaColegiado.nColegiado;

    }​

    let error = null;
    this.getImprimirQuery();
    this.progressSpinner=true;
    this.sigaServicesNew.post("justificacionExpres_busqueda", this.filtros.filtroJustificacion).subscribe(
      data => {
        

        if(data!=undefined && data!=null){
          this.datosJustificacion = JSON.parse(data.body);
        }
        if(this.datosJustificacion[0] != null && this.datosJustificacion[0] != undefined){
          if(this.datosJustificacion[0].error != null){
            error = this.datosJustificacion[0].error;
          }
        }
        this.muestraTablaJustificacion=true;
        this.progressSpinner=false;

        if (error != null && error.description != null) {
          this.msgs = [];
          this.msgs.push({
            severity:"info", 
            summary:this.translateService.instant("general.message.informacion"), 
            detail: error.description});
        }
      },
      err => {
        this.progressSpinner = false;

        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
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

    this.sigaServicesNew.post("justificacionExpres_actualizacion", { listaItem: event, filtro:  this.filtros.filtroJustificacion }).subscribe(
      data => {
        // Obtenemos los contadores de los registros actualizados mediante tokens
        let contadores = JSON.parse(data.body).error.message.split(';');
        // Generamos el mensaje de de confirmación
        let mensaje = this.generaMensajeConfirmacion(contadores);

        //refrescamos tabla
        this.busquedaJustificacionExpres();
        this.progressSpinner = false;

        // Si todos los cambios han sido realizados correctamente, se mostrará el mensaje de éxito, de lo contrario se mostrará un aviso
        if (mensaje.indexOf('.') == mensaje.lastIndexOf('.')) {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        } else {
          this.showMessage("warn", this.translateService.instant("general.message.warn"), mensaje);
        }
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      },);
  }

  generaMensajeConfirmacion(contadores: any) {
    let mensaje = contadores[0] + " " + this.translateService.instant("justiciaGratuita.oficio.justificacionExpres.guardadosCorrectamente");
    
    if (contadores[1] > 0) {
      mensaje += "\n\r" + contadores[1] + " " + this.translateService.instant("justiciaGratuita.oficio.justificacionExpres.noGuardadosSinEjg");
    }

    if (contadores[2] > 0) {
      mensaje += "\n\r" + contadores[2] + " " + this.translateService.instant("justiciaGratuita.oficio.justificacionExpres.noGuardadosEjgSinResolucion");
    }

    if (contadores[3] > 0) {
      mensaje += "\n\r" + contadores[3] + " " + this.translateService.instant("justiciaGratuita.oficio.justificacionExpres.noGuardadosEjgNoFavorable");
    }

    if (contadores[4] > 0) {
      mensaje += "\n\r" + contadores[4] + " " + this.translateService.instant("justiciaGratuita.oficio.justificacionExpres.noGuardadosEjgResolucionPteCajg");
    }

    return mensaje;
  }

  eliminacionJustificacionExpres(event){
    this.muestraTablaJustificacion=false;
    this.progressSpinner=true;
    this.sigaServicesNew.post("justificacionExpres_eliminacion", event).subscribe(
      data => {
           //refrescamos tabla
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.busquedaJustificacionExpres();
        //this.progressSpinner=false;
        
      },
      err => {
        this.muestraTablaJustificacion=true;
        this.progressSpinner=false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      },);
  }

  insercionJustificacionExpres(event){
    this.muestraTablaJustificacion=false;
    this.progressSpinner = true;
    return this.sigaServicesNew.post("justificacionExpres_insercion", event).toPromise().then(
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
      },);
  }

  async insercionJustificacionExpresVarios(event: any[]){
    for (const just of event) {
      await this.insercionJustificacionExpres(just);
    };
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
        let error = null;
        this.datos = JSON.parse(n.body);
        
        if(this.datos[0] != null && this.datos[0] != undefined){
          if(this.datos[0].error != null){
            error = this.datos[0].error;
          }
        }

        this.datos.forEach(element => {
         element.factConvenio = element.ano;
         element.anio = element.ano;
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
         element.nombreColegiado = this.nombreType(element);

         //if(element.nombreInteresado != null){
        //  element.nombreInteresado = this.interesadoType(element);
         //}
         if(element.art27 == "1"){
          element.art27 = "Si";
         }else{
          element.art27 = "No";
         }
         //this.getDatosAdicionales(element);
         const params = {
          anio: element.factConvenio,
          idTurno: element.idTurno,
          numero: element.numero,
          historico: false
        };
        
        this.progressSpinner = false;
          },
          err => {
            this.progressSpinner = false;
          }
        );
        this.progressSpinner=false;
        if(sessionStorage.getItem("vieneDeJE") !== "true") {
          this.showTablaDesigna(true);
        } else{
          sessionStorage.removeItem("vieneDeJE");
        }
        this.commonsService.scrollTablaFoco("tablaFoco");
        if (error != null && error.description != null) {
          this.msgs = [];
          this.msgs.push({
            severity:"info", 
            summary:this.translateService.instant("general.message.informacion"), 
            detail: error.description});
        }
      },
      err => {
        this.progressSpinner = false;
        this.commonsService.scrollTablaFoco("tablaFoco");
      },() => {
        this.progressSpinner = false;
        setTimeout(() => {
          this.commonsService.scrollTablaFoco('tablaFoco');
        }, 5);
      });

      this.busquedaTotalRegistrosDesignaciones();
     
  }

  busquedaTotalRegistrosDesignaciones() {
    let data = sessionStorage.getItem("designaItem");
    let designaItem = JSON.parse(data);
    if(designaItem.numColegiado == ""){
      designaItem.numColegiado = null;
    }
    this.sigaServicesNew.post("designaciones_busquedaTotalRegistros", designaItem).subscribe(
      n => {
        this.totalRegistrosBusquedaDesignaciones = JSON.parse(n.body).valor;
      },
      err => {
        this.commonsService.scrollTablaFoco("tablaFoco");
      },() => {
        setTimeout(() => {
          this.commonsService.scrollTablaFoco('tablaFoco');
        }, 5);
      });;
     
  }

  nombreType(element){
    var textReturn = ""
    if(element.apellido1Colegiado != null) textReturn += element.apellido1Colegiado + " "

    if(element.apellido2colegiado != null) textReturn += element.apellido2Colegiado 

    if(element.nombreColegiado != null && (element.apellido2colegiado != null || element.apellido1Colegiado != null ) ) textReturn += ", " + element.nombreColegiado

    if(element.nombreColegiado != null && (element.apellido2colegiado == null && element.apellido1Colegiado == null ) ) textReturn +=  element.nombreColegiado

    return textReturn;

  }
  interesadoType(element){
    var textReturn = ""
    if(element.apellido1Interesado != null) textReturn += element.apellido1Interesado + " "

    if(element.apellido2Interesado != null) textReturn += element.apellido2Interesado 

    if(element.nombreInteresado != null && (element.apellido2Interesado != null || element.apellido1Interesado != null ) ) textReturn += ", " + element.nombreInteresado

    if(element.nombreInteresado != null && (element.apellido2Interesado == null && element.apellido1Interesado == null ) ) textReturn +=  element.nombreInteresado

    return textReturn;

  }

  getDatosAdicionales(element) {
    this.progressSpinner = true;
    let desginaAdicionales = new DesignaItem();
    let anio = element.ano.split("/");
    desginaAdicionales.ano = Number(anio[0].substring(1, 5));
    desginaAdicionales.numero = element.numero;
    desginaAdicionales.idTurno = element.idTurno;
    this.sigaServicesNew.post("designaciones_getDatosAdicionales", desginaAdicionales).subscribe(
      n => {
       
        let datosAdicionales = JSON.parse(n.body);
        if (datosAdicionales[0] != null && datosAdicionales[0] != undefined) {
          element.delitos = datosAdicionales[0].delitos;
          element.fechaOficioJuzgado =datosAdicionales[0].fechaOficioJuzgado;
          element.observaciones = datosAdicionales[0].observaciones;
          element.fechaRecepcionColegio = datosAdicionales[0].fechaRecepcionColegio;
          element.defensaJuridica = datosAdicionales[0].defensaJuridica;
          element.fechaJuicio = datosAdicionales[0].fechaJuicio;
        }
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
      }
    );
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

  esColegiadoJE(event){
    this.colegiadoJE = event;
  }

  esColegiadoDesig(event){
    this.colegiadoDesig = event;
  }

  actuacionesToDleteArr(event){
    this.progressSpinner=true;
    this.eliminacionJustificacionExpres(event);
    this.progressSpinner=false;
  }
  newActuacionItem(event){
    // Se recorre la lista de nuevas actuaciones de forma secuencial
    this.insercionJustificacionExpresVarios(event);
  }
  dataToUpdateArr(event){
    this.actualizacionJustificacionExpres(event);
  }

  getpermisosFichaAct(event){
    this.permisosFichaAct = event;
  }
  checkRestriccionesasLetrado(event){
    
    //this.muestraTablaJustificacion = false;
    this.isLetrado = event;
    //console.log('checkRestriccionesasLetrado: ', this.isLetrado)
    //this.muestraTablaJustificacion = true;
  }
}
