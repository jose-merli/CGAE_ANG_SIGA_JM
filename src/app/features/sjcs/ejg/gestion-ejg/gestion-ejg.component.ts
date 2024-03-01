import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { SigaServices } from '../../../../_services/siga.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { CommonsService } from '../../../../_services/commons.service';
import { TranslateService } from '../../../../commons/translate/translation.service';
import { Router } from '@angular/router';
import { EJGItem } from '../../../../models/sjcs/EJGItem';
import { Message } from 'primeng/primeng';
import { procesos_ejg } from '../../../../permisos/procesos_ejg';
import { ResolucionEJGItem } from '../../../../models/sjcs/ResolucionEJGItem';
import { RelacionesComponent } from './relaciones/relaciones.component';
import { ListaIntercambiosAltaEjgComponent } from './lista-intercambios-alta-ejg/lista-intercambios-alta-ejg.component';
import { ListaIntercambiosDocumentacionEjgComponent } from './lista-intercambios-documentacion-ejg/lista-intercambios-documentacion-ejg.component';

@Component({
  selector: 'app-gestion-ejg',
  templateUrl: './gestion-ejg.component.html',
  styleUrls: ['./gestion-ejg.component.scss']
})
export class GestionEjgComponent implements OnInit {

  msgs: Message[];
  body: EJGItem = new EJGItem();
  tipoRelacion: string = "";
  tipoObject: any = {};

  modoEdicion: boolean = true;
  nuevo: boolean = false;
  haveDesignacion: boolean = false;
  progressSpinner = false;

  tarjetas = new Map();

  permisos: any = {};
  datosResumen = [];
  enlacesResumen = [];

  @ViewChild(RelacionesComponent) relacionesComponent: RelacionesComponent;
  @ViewChild(ListaIntercambiosAltaEjgComponent) listaIntercambiosAltaEjg: ListaIntercambiosAltaEjgComponent;
  @ViewChild(ListaIntercambiosDocumentacionEjgComponent) listaIntercambiosDocumentacionEjg: ListaIntercambiosDocumentacionEjgComponent;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private router: Router,
    private location: Location,
    private commonsService: CommonsService, private datePipe: DatePipe) { 
      this.permisos = procesos_ejg;
  }

  ngOnInit() {

    this.progressSpinner = true;
    
    this.body = new EJGItem();
    this.getTarjetas();

    if(this.persistenceService.getDatosEJG()){
      this.body = this.persistenceService.getDatosEJG();
      this.persistenceService.clearDatosEJG();
    } else if (sessionStorage.getItem("EJGItem") != null && sessionStorage.getItem("EJGItem") != undefined) {
      this.body = JSON.parse(sessionStorage.getItem("EJGItem"));
      sessionStorage.removeItem("EJGItem");
    } else {
      this.body.fechaApertura = new Date();
      this.body.perceptivo = '1';
      this.body.calidad = '0';
      this.body.creadoDesde = 'M'
      if (sessionStorage.getItem("Designacion")) {
        this.body.creadoDesde = 'O';
        this.tipoRelacion = "designacion";
        this.tipoObject = JSON.parse(sessionStorage.getItem("Designacion"));
        if(sessionStorage.getItem("nombreInteresado")){
          this.body.nombreApeSolicitante = sessionStorage.getItem("nombreInteresado");
        }
        if (this.tipoObject.idTurno){
          // si viene de un Designa asignamos el mismo turno del Designa, si el tipo turno es 1 (Tramitación) o null
          this.sigaServices.getParam("componenteGeneralJG_tipoTurno", "?idTurno=" + this.tipoObject.idTurno).subscribe(
            idTipoTurno => {
              if (idTipoTurno == null || idTipoTurno == 1){
                this.body.idTurno = this.tipoObject.idTurno;
              }
            });
        }
		sessionStorage.removeItem("Designacion");
      } else if (sessionStorage.getItem("asistencia")) {
        this.tipoObject = JSON.parse(sessionStorage.getItem("asistencia"));
        this.body.creadoDesde = 'A'
        this.body.nombreApeSolicitante = this.tipoObject.asistido;
        this.tipoRelacion = "asistencia";
        sessionStorage.removeItem("asistencia");
      } else if(sessionStorage.getItem("justiciable")){
        this.tipoObject = JSON.parse(sessionStorage.getItem("justiciable"));
        this.body.nombreApeSolicitante =  this.tipoObject.apellidos + ", " + this.tipoObject.nombre;
        this.tipoRelacion = "justiciable";
        sessionStorage.removeItem("justiciable");
      } else if(sessionStorage.getItem("SOJ")){
        this.tipoObject = JSON.parse(sessionStorage.getItem("SOJ"));
        this.tipoRelacion = "soj";
        sessionStorage.removeItem("SOJ");
      }
      this.sigaServices.get("institucionActual").subscribe(n => {
        this.body.idInstitucion = n.value;
      });
      let parametro = { valor: "TIPO_EJG_COLEGIO"};
      this.sigaServices.post("busquedaPerJuridica_parametroColegio", parametro).subscribe(
        data => {
          if (data != null && data != undefined) {
            this.body.tipoEJG = JSON.parse(data.body).parametro;
          }
        }
      );
    }

    if(this.body.annio == null || this.body.annio == undefined || this.body.numero == null || this.body.numero == undefined){
      this.nuevo = true;
      this.modoEdicion = false;
    }

  }

  ngAfterViewInit(){
    // Ejecutamos esto depues de iniciar la vista para que obtenga id de los campos del html
    this.updateTarjResumen();
  }

  guardadoSend(event) {
    this.body = {...event};
    this.nuevo = false;
    this.modoEdicion = true;
    this.updateTarjResumen();
  }

  guardadoResolucion(event: ResolucionEJGItem){
    this.body.numCAJG = event.numeroCAJG.toString();
    this.body.annioCAJG = event.anioCAJG.toString();
    this.updateTarjResumen();
  }

  crearDesignacion(){
    if (this.relacionesComponent != undefined) {
      this.relacionesComponent.crearDesignacion();
    }
  }

  actualizarTarjetasIntercambios() {
    if (this.listaIntercambiosAltaEjg != undefined) {
      this.listaIntercambiosAltaEjg.getListaIntercambios();
    }
    if (this.listaIntercambiosDocumentacionEjg != undefined) {
      this.listaIntercambiosDocumentacionEjg.getListaIntercambios();
    }
  }

  isAsociaDES(event) {
    this.haveDesignacion = event;
  }

  backTo() {
    this.persistenceService.clearDatos();
    if (this.tipoRelacion === "designacion") {
      this.router.navigate(["/fichaDesignaciones"]);
    } else if (this.tipoRelacion === "asistencia") {
      this.router.navigate(['/fichaAsistencia']);
    } else if (this.tipoRelacion === "justiciable") {
      this.router.navigate(['/gestionJusticiables']);
    } else if (this.persistenceService.getFiltrosEJG() != undefined && this.persistenceService.getFiltrosEJG() != null){
      this.persistenceService.clearDatosEJG();
      this.persistenceService.setVolverEJG();
      this.router.navigate(["/ejg"]);
    }else{
      this.location.back();
    }
  }

  isOpenTarjeta(idTarjeta: string){
    return this.tarjetas.get(idTarjeta).visibility;
  }

  isPermisoTarjeta(idTarjeta: string){
    return this.tarjetas.get(idTarjeta).permission;
  }

  openTarjeta(event: string){
    let data = this.tarjetas.get(event);
    data.visibility = true;
    this.tarjetas.set(event, data);
  }

  private getPermiso(permiso: string){
    return this.commonsService.checkAcceso(permiso).then(
      respuesta => {
        return respuesta;
      }, err => {
        return false;
      }
    );
  }

  private updateTarjResumen() {

    this.datosResumen = [
      { label: "EJG", value: (this.body.numEjg == undefined ? "" : "E" + this.body.annio + "/" + this.body.numEjg) },
      { label: "F.apertura", value:  this.datePipe.transform(this.body.fechaApertura, "dd/MM/yyyy")},
      { label: "Solicitante", value: this.body.nombreApeSolicitante },
      { label: "Estado EJG", value: this.body.estadoEJG },
      { label: "Designado", value: this.body.apellidosYNombre },
      { label: "Dictamen", value: this.body.dictamenSing },
      { label: "CAJG", value: this.body.numAnnioResolucion },
      { label: "Impugnación", value: this.body.impugnacionDesc }
    ];

    this.enlacesResumen = [];
    if(this.nuevo){
      if(this.getPermiso(procesos_ejg.datosGenerales)){
        this.enlacesResumen.push({label: "general.message.datos.generales", value: document.getElementById("tarjetaDatosGenerales"), nombre: "tarjetaDatosGenerales"});
        this.tarjetas.set("tarjetaDatosGenerales", {visibility: true, permission: true});
      }
    }else{
      if(this.getPermiso(procesos_ejg.datosGenerales)){
        this.enlacesResumen.push({label: "general.message.datos.generales", value: document.getElementById("tarjetaDatosGenerales"), nombre: "tarjetaDatosGenerales"});
        this.tarjetas.set("tarjetaDatosGenerales", {visibility: false, permission: true});
      }
      if(this.getPermiso(procesos_ejg.unidadFamiliar)){
        this.enlacesResumen.push({label: "justiciaGratuita.justiciables.rol.unidadFamiliar", value: document.getElementById("tarjetaUnidadFamiliar"), nombre: "tarjetaUnidadFamiliar"});
        this.tarjetas.set("tarjetaUnidadFamiliar", {visibility: false, permission: true});
      }
      if(this.getPermiso(procesos_ejg.expedientesEconomicos)){
        this.enlacesResumen.push({label: "justiciaGratuita.ejg.datosGenerales.ExpedientesEconomicos", value: document.getElementById("tarjetaExpedientesEconomicos"), nombre: "tarjetaExpedientesEconomicos"});
        this.tarjetas.set("tarjetaExpedientesEconomicos", {visibility: false, permission: true});
      }
      if(this.getPermiso(procesos_ejg.relaciones)){
        this.enlacesResumen.push({label: "justiciaGratuita.ejg.datosGenerales.Relaciones", value: document.getElementById("tarjetaRelaciones"), nombre: "tarjetaRelaciones"});
        this.tarjetas.set("tarjetaRelaciones", {visibility: false, permission: true});
      }
      if(this.getPermiso(procesos_ejg.defensaJuridica)){
        this.enlacesResumen.push({label: "justiciaGratuita.ejg.preDesigna.defensaJuridica", value: document.getElementById("tarjetaDefensaJuridica"), nombre: "tarjetaDefensaJuridica"});
        this.tarjetas.set("tarjetaDefensaJuridica", {visibility: false, permission: true});
      }
      if(this.getPermiso(procesos_ejg.contrarios)){
        this.enlacesResumen.push({label: "justiciaGratuita.ejg.preDesigna.contrarios", value: document.getElementById("tarjetaContrariosPreDesigna"), nombre: "tarjetaContrariosPreDesigna"});
        this.tarjetas.set("tarjetaContrariosPreDesigna", {visibility: false, permission: true});
      }
      if(this.getPermiso(procesos_ejg.procurador)){
        this.enlacesResumen.push({label: "justiciaGratuita.oficio.designas.contrarios.procurador", value: document.getElementById("tarjetaProcuradorPreDesigna"), nombre: "tarjetaProcuradorPreDesigna"});
        this.tarjetas.set("tarjetaProcuradorPreDesigna", {visibility: false, permission: true});
      }
      if(this.getPermiso(procesos_ejg.estados)){
        this.enlacesResumen.push({label: "censo.fichaIntegrantes.literal.estado", value: document.getElementById("tarjetaEstados"), nombre: "tarjetaEstados"});
        this.tarjetas.set("tarjetaEstados", {visibility: false, permission: true});
      }
      if(this.getPermiso(procesos_ejg.documentacion)){
        this.enlacesResumen.push({label: "menu.facturacionSJCS.mantenimientoDocumentacionEJG", value: document.getElementById("tarjetaDocumentacion"), nombre: "tarjetaDocumentacion"});
        this.tarjetas.set("tarjetaDocumentacion", {visibility: false, permission: true});
      }
      if(this.getPermiso(procesos_ejg.informeCalif)){
        this.enlacesResumen.push({label: "justiciaGratuita.ejg.datosGenerales.InformeCalificacion", value: document.getElementById("tarjetaInformeCalificacion"), nombre: "tarjetaInformeCalificacion"});
        this.tarjetas.set("tarjetaInformeCalificacion", {visibility: false, permission: true});
      }
      if(this.getPermiso(procesos_ejg.resolucion)){
        this.enlacesResumen.push({label: "justiciaGratuita.maestros.fundamentosResolucion.resolucion", value: document.getElementById("tarjetaResolucion"), nombre: "tarjetaResolucion"});
        this.tarjetas.set("tarjetaResolucion", {visibility: false, permission: true});
      }
      if(this.getPermiso(procesos_ejg.impugnacion)){
        this.enlacesResumen.push({label: "justiciaGratuita.ejg.datosGenerales.Impugnacion", value: document.getElementById("tarjetaImpugnacion"), nombre: "tarjetaImpugnacion"});
        this.tarjetas.set("tarjetaImpugnacion", {visibility: false, permission: true});
      }
      if(this.getPermiso(procesos_ejg.regtel)){
        this.enlacesResumen.push({label: "censo.regtel.literal.titulo", value: document.getElementById("tarjetaRegtel"), nombre: "tarjetaRegtel"});
        this.tarjetas.set("tarjetaRegtel", {visibility: false, permission: true});
      }
      if(this.getPermiso(procesos_ejg.comunicaciones)){
        this.enlacesResumen.push({label: "menu.enviosAGrupos", value: document.getElementById("tarjetaComunicaciones"), nombre: "tarjetaComunicaciones"});
        this.tarjetas.set("tarjetaComunicaciones", {visibility: false, permission: true});
      }
      if(this.getPermiso(procesos_ejg.facturaciones)){
        this.enlacesResumen.push({label: "facturacionSJCS.tarjGenFac.facturaciones", value: document.getElementById("tarjetaFac"), nombre: "tarjetaFac"});
        this.tarjetas.set("tarjetaFac", {visibility: false, permission: true});
      }
      if(this.getPermiso(procesos_ejg.intercambiosPericles)){
        this.enlacesResumen.push({label: "justiciaGratuita.ejg.listaIntercambios.listaExpedientes", value: document.getElementById("tarjetaListaIntercambiosAltaEjg"), nombre: "tarjetaListaIntercambiosAltaEjg"});
        this.tarjetas.set("tarjetaListaIntercambiosAltaEjg", {visibility: false, permission: true});
        this.enlacesResumen.push({label: "justiciaGratuita.ejg.listaIntercambios.listaDocumentacion", value: document.getElementById("tarjetaListaIntercambiosDocumentacionEjg"), nombre: "tarjetaListaIntercambiosDocumentacionEjg"});
        this.tarjetas.set("tarjetaListaIntercambiosDocumentacionEjg", {visibility: false, permission: true});
      }
    }
  }

  private getTarjetas(){
    this.tarjetas.set('tarjetaDatosGenerales', {visibility: false, permission: false});
    this.tarjetas.set('tarjetaUnidadFamiliar', {visibility: false, permission: false});
    this.tarjetas.set('tarjetaExpedientesEconomicos', {visibility: false, permission: false});
    this.tarjetas.set('tarjetaRelaciones', {visibility: false, permission: false});
    this.tarjetas.set('tarjetaDefensaJuridica', {visibility: false, permission: false});
    this.tarjetas.set('tarjetaContrariosPreDesigna', {visibility: false, permission: false});
    this.tarjetas.set('tarjetaProcuradorPreDesigna', {visibility: false, permission: false});
    this.tarjetas.set('tarjetaEstados', {visibility: false, permission: false});
    this.tarjetas.set('tarjetaDocumentacion', {visibility: false, permission: false});
    this.tarjetas.set('tarjetaInformeCalificacion', {visibility: false, permission: false});
    this.tarjetas.set('tarjetaResolucion', {visibility: false, permission: false});
    this.tarjetas.set('tarjetaImpugnacion', {visibility: false, permission: false});
    this.tarjetas.set('tarjetaRegtel', {visibility: false, permission: false});
    this.tarjetas.set('tarjetaComunicaciones', {visibility: false, permission: false});
    this.tarjetas.set('tarjetaFac', {visibility: false, permission: false});
    this.tarjetas.set('tarjetaListaIntercambiosAltaEjg', {visibility: false, permission: false});
    this.tarjetas.set('tarjetaListaIntercambiosDocumentacionEjg', {visibility: false, permission: false});
  }
}
