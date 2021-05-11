import { Component, EventEmitter, Input, OnInit, Output, HostListener } from '@angular/core';
import { Message } from "primeng/components/common/api";
import { TranslateService } from '../../../../../commons/translate';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';
import { DesignaItem } from '../../../../../models/sjcs/DesignaItem';
import { JustificacionExpressItem } from '../../../../../models/sjcs/JustificacionExpressItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { Location } from '@angular/common';
import { ActivationEnd, Router } from '@angular/router';
import { procesos_oficio } from '../../../../../permisos/procesos_oficio';
import { ControlAccesoDto } from '../../../../../models/ControlAccesoDto';
import { FileAlreadyExistException } from '@angular-devkit/core';
import { ParametroRequestDto } from '../../../../../models/ParametroRequestDto';
import { ParametroDto } from '../../../../../models/ParametroDto';
import { SigaStorageService } from '../../../../../siga-storage.service';

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: 'app-filtro-designaciones',
  templateUrl: './filtro-designaciones.component.html',
  styleUrls: ['./filtro-designaciones.component.scss']
})
export class FiltroDesignacionesComponent implements OnInit {
  
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  isButtonVisible = true;
  filtroJustificacion: JustificacionExpressItem = new JustificacionExpressItem();
  datos;
  expanded: boolean = false;
  textSelected: String = "{0} etiquetas seleccionadas";
  progressSpinner: boolean = true;
  showDesignas: boolean = false;
  showJustificacionExpress: boolean = false;
  checkMostrarPendientes: boolean = true;
  checkRestricciones: boolean = false;
  
  disabledBusquedaExpress: boolean = false;
  showColegiado: boolean = false;

  esColegiado: boolean = false;
  @Output() isColeg = new EventEmitter<boolean>();
  radioTarjeta: string = 'designas';

  //Variables busqueda designas
  msgs: Message[] = [];
  body: DesignaItem = new DesignaItem();
  fechaAperturaHastaSelect: Date;
  fechaAperturaDesdeSelect: Date;
  fechaJustificacionDesdeSelect: Date;
  fechaJustificacionHastaSelect: Date;
  textFilter: String = "Seleccionar";
  comboEstados: any[];
  comboActuacionesValidadas: any [];
  comboSinEJG: any [];
  comboResoluciones: any [];
  comboEJGSinResolucion: any [];
  comboEJGnoFavorable: any [];
  disabledFechaAHasta:boolean = true;
  disabledfechaJustificacion:boolean = true;
  disableRestricciones: boolean = true;
  comboTipoDesigna: any[];
  comboTurno: any[];
  actuacionesV: any[];
  comboArt: any[];
  actuacionesDocu: any[];
  comboJuzgados: any[];
  comboModulos: any[];
  comboCalidad: any[];
  comboProcedimientos: any[];
  comboOrigenActuaciones: any[];
  comboRoles: any[];
  comboAcreditaciones: any[];

  institucionActual: any;
  @Output() busquedaJustificacionExpres = new EventEmitter<boolean>();
  @Output() showTablaDesigna = new EventEmitter<boolean>();
  @Output() showTablaJustificacionExpres = new EventEmitter<boolean>();
  @Output() busqueda = new EventEmitter<boolean>();
  
  isLetrado:boolean = false;
  sinEjg;
  ejgSinResolucion;
  ejgPtecajg;
  ejgNoFavorable;
  valorParametro: AnalyserNode;
  datosBuscar: any[];
  searchParametros: ParametroDto = new ParametroDto();
  constructor(private translateService: TranslateService, private sigaServices: SigaServices,  private location: Location, private router: Router,
    private localStorageService: SigaStorageService) { }

  ngOnInit(): void {

    // let esColegiado = JSON.parse(sessionStorage.getItem("esColegiado"));
    // if(!esColegiado){   
    this.checkAcceso();
    this.getParamsEJG();
  // }
    if(sessionStorage.getItem("buscadorColegiados")){
      const { nombre, apellidos, nColegiado } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));
      this.usuarioBusquedaExpress.nombreAp = `${apellidos}, ${nombre}`;
      this.usuarioBusquedaExpress.numColegiado = nColegiado;
      this.showColegiado = true;

      this.buscar();

      sessionStorage.removeItem("buscadorColegiados");
    }
  }

  getParamsEJG(){  
    let parametro = new ParametroRequestDto();
    let institucionActual;
    this.sigaServices.get("institucionActual").subscribe(n => {
      institucionActual = n.value;
      parametro.idInstitucion = institucionActual;
      parametro.modulo = "SCS";
      //PARAMETRO JUSTIFICACION_INCLUIR_SIN_EJG
      parametro.parametrosGenerales = "JUSTIFICACION_INCLUIR_SIN_EJG";
      this.sigaServices
        .postPaginado("parametros_search", "?numPagina=1", parametro)
        .subscribe(
          data => {
            this.searchParametros = JSON.parse(data["body"]);
            this.datosBuscar = this.searchParametros.parametrosItems;
            this.datosBuscar.forEach(element => {
              if (element.parametro == parametro.parametrosGenerales && (element.idInstitucion == 0 || element.idInstitucion == element.idinstitucionActual)) {
                this.valorParametro = element.valor;
                this.sinEjg = this.valorParametro;
              }
          });
      });
      //PARAMETRO JUSTIFICACION_INCLUIR_EJG_SIN_RESOLUCION
      parametro.parametrosGenerales = "JUSTIFICACION_INCLUIR_EJG_SIN_RESOLUCION";
      this.sigaServices
        .postPaginado("parametros_search", "?numPagina=1", parametro)
        .subscribe(
          data => {
            this.searchParametros = JSON.parse(data["body"]);
            this.datosBuscar = this.searchParametros.parametrosItems;
            this.datosBuscar.forEach(element => {
              if (element.parametro == parametro.parametrosGenerales && (element.idInstitucion == 0 || element.idInstitucion == element.idinstitucionActual)) {
                this.valorParametro = element.valor;
                this.ejgSinResolucion = this.valorParametro;
              }
          });
      });
      //PARAMETRO JUSTIFICACION_INCLUIR_EJG_PTECAJG
      parametro.parametrosGenerales = "JUSTIFICACION_INCLUIR_EJG_PTECAJG";
      this.sigaServices
        .postPaginado("parametros_search", "?numPagina=1", parametro)
        .subscribe(
          data => {
            this.searchParametros = JSON.parse(data["body"]);
            this.datosBuscar = this.searchParametros.parametrosItems;
            this.datosBuscar.forEach(element => {
              if (element.parametro == parametro.parametrosGenerales && (element.idInstitucion == 0 || element.idInstitucion == element.idinstitucionActual)) {
                this.valorParametro = element.valor;
                this.ejgPtecajg = this.valorParametro;
              }
          });
      });
      //PARAMETRO JUSTIFICACION_INCLUIR_EJG_NOFAVORABLE
      parametro.parametrosGenerales = "JUSTIFICACION_INCLUIR_EJG_NOFAVORABLE";
      this.sigaServices
        .postPaginado("parametros_search", "?numPagina=1", parametro)
        .subscribe(
          data => {
            this.searchParametros = JSON.parse(data["body"]);
            this.datosBuscar = this.searchParametros.parametrosItems;
            this.datosBuscar.forEach(element => {
              if (element.parametro == parametro.parametrosGenerales && (element.idInstitucion == 0 || element.idInstitucion == element.idinstitucionActual)) {
                this.valorParametro = element.valor;
                this.ejgNoFavorable = this.valorParametro;
              }
          });
      });
  });


    /*escolegio sin check 2 y editabe¡le. es colegiado o colegio y actuvo el check disable y sin valores. Tiene que coger valores del paramero 
    check solo visible para colegiados y activado
    colegio desactivado*/

}
  cargaInicial(){
    this.isLetrado = this.localStorageService.isLetrado;

    if(!this.esColegiado){
      this.isButtonVisible = true;
    }else{
      this.isButtonVisible = true;// DEBE SER FALSE
    }
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;});
      if(this.institucionActual == "2003"){
        this.isButtonVisible = false;
      }
    
    this.filtroJustificacion = new JustificacionExpressItem();

    this.showDesignas=true;
    this.showJustificacionExpress=false;
    this. esColegiado = false;
    this.progressSpinner=true;
    this.showDesignas = true;
    this.checkRestricciones = false;


    // this.checkLastRoute();

    //justificacion expres
    this.cargaCombosJustificacion();

    //Inicializamos buscador designas
    this.getBuscadorDesignas();

    if(this.isLetrado){
      this.getDataLoggedUser();
    }

    if (this.esColegiado) {
      this.disabledBusquedaExpress = true;
      this.getDataLoggedUser();
      this.disableRestricciones=true;
    }else{
      this.disableRestricciones=false;
      this.disabledBusquedaExpress = false;
      this.filtroJustificacion.ejgSinResolucion="2"; 
      this.filtroJustificacion.sinEJG="2";
      this.filtroJustificacion.resolucionPTECAJG="2";
      this.filtroJustificacion.conEJGNoFavorables="2";
    }

    //viene de buscador express
    if (sessionStorage.getItem('buscadorColegiados')) {
      const { nombre, apellidos, nColegiado } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));

      sessionStorage.removeItem("buscadorColegiados");

      this.usuarioBusquedaExpress.nombreAp = `${apellidos}, ${nombre}`;
      this.usuarioBusquedaExpress.numColegiado = nColegiado;
      this.showColegiado = true;
    }

    //combo comun
    this.getComboEstados();
  }

  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = procesos_oficio.designa;

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        const permisos = JSON.parse(data.body);
        const permisosArray = permisos.permisoItems;
        const derechoAcceso = permisosArray[0].derechoacceso;

        this.esColegiado=true;
        if (derechoAcceso == 3) { //es colegio
          this.esColegiado = false;
          //this.isColeg.emit(false);
        } else if (derechoAcceso == 2) {//es colegiado
          this.esColegiado = true;
          //this.isColeg.emit(true);
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
        this.cargaInicial();
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }
    );
  }

  changeFilters(event) {
    if(event=='designas'){
      this.showDesignas=true;
      this.showJustificacionExpress=false;
      this.showTablaJustificacionExpres.emit(false);
    }

    if(event=='justificacion'){
      this.showDesignas=false;
      this.showJustificacionExpress=true;
      this.expanded=true;
      this.showTablaDesigna.emit(false);
    }
  }

  fillFechasJustificacion(event, campo) {
    if(campo=='justificacionDesde'){
      this.filtroJustificacion.justificacionDesde=event;
    }

    if(campo=='justificacionHasta'){
      this.filtroJustificacion.justificacionHasta=event;
    }

    if(campo=='designacionHasta'){
      this.filtroJustificacion.designacionHasta=event;
    }

    if(campo=='designacionDesde'){
      this.filtroJustificacion.designacionDesde=event;
    }
  }

  getBuscadorDesignas(){
    var today = new Date();
    var year = today.getFullYear().valueOf();
    this.body.ano = year;
    this.getComboEstados();
    this.getComboTipoDesignas();
    this.getComboTurno();
    this.getActuacionesV();
    this.getDocuActuaciones();
    this.getComboArticulo();
    this.getComboJuzgados();
    this.getComboModulos();
    this.getComboCalidad();
    this.getComboProcedimientos();
    this.getOrigenActuaciones();
    this.getComboRoles();
    this.getComboAcreditaciones();
  }

  fillFechaAperturaDesde(event) {
    // this.fechaAperturaDesdeSelect = event;
    // if((this.fechaAperturaHastaSelect != null && this.fechaAperturaHastaSelect != undefined) && (this.fechaAperturaDesdeSelect > this.fechaAperturaHastaSelect)){
    //   this.msgs = [{severity: "error", summary: "Error", detail: this.translateService.instant('justiciaGratuita.sjcs.designas.mensaje.Fechas')}];
    // }
  }

  fillFechaAperturaHasta(event) {
    // this.fechaAperturaHastaSelect = event;
    // if(this.fechaAperturaDesdeSelect > this.fechaAperturaHastaSelect ){
    //   this.msgs = [{severity: "error", summary: "Error", detail: this.translateService.instant('justiciaGratuita.sjcs.designas.mensaje.Fechas')}];
    // }
  }

  fillFechaADesdeCalendar(event) {
    if(event != null){
      this.fechaAperturaDesdeSelect = this.transformaFecha(event);
      this.disabledFechaAHasta = false;
    }else{
      this.fechaAperturaDesdeSelect = undefined;
      this.disabledFechaAHasta = true;
    }
  
  }

  fillFechaAHastaCalendar(event) {
    if(event != null){
      this.fechaAperturaHastaSelect = this.transformaFecha(event);
    }else{
      this.fechaAperturaHastaSelect = undefined;
    }
  
  }

  fillFechaJustificacionDesdeCalendar(event) {
    if(event != null){
      this.fechaJustificacionDesdeSelect = this.transformaFecha(event);
      this.disabledfechaJustificacion = false;
    }else{
      this.fechaJustificacionDesdeSelect = undefined;
      this.disabledfechaJustificacion = true;
    }
  
  }

  fillFechaJustificacionHastaCalendar(event) {
    if(event != null){
      this.fechaJustificacionHastaSelect = this.transformaFecha(event);
    }else{
      this.fechaJustificacionHastaSelect = undefined;
    }
  
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

  getComboEstados() {
    this.comboEstados = [
      {label:'Activo', value:'V'},
      {label:'Finalizada', value:'F'},
      {label:'Anulada', value:'A'}
    ]
  }

  getComboTurno() {
    this.progressSpinner=true;

    this.sigaServices.get("combo_turnos").subscribe(
      n => {
        this.comboTurno = n.combooItems;
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;

      }, () => {
        this.arregloTildesCombo(this.comboTurno);
      }
    );
  }

  getComboTipoDesignas() {
    this.progressSpinner=true;

    this.sigaServices.get("designas_tipoDesignas").subscribe(
      n => {
        this.comboTipoDesigna = n.combooItems;
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }, () => {
        this.arregloTildesCombo(this.comboTipoDesigna);
      }
    );
  }

  getActuacionesV() {
    this.actuacionesV = [
      {label:'No', value:'NO'},
      {label:'Si', value:'SI'},
      {label:'Sin Actuaciones', value:'SINACTUACIONES'}
    ]
  }

  getDocuActuaciones() {
    this.actuacionesDocu = [
      {label:'Todas', value:'TODAS'},
      {label:'Algunas', value:'ALGUNAS'},
      {label:'Ninguna', value:'NINGUNA'}
    ]
  }

getComboCalidad() {
    this.comboCalidad = [
      {label:'Demandante', value:'1'},
      {label:'Demandado', value:'0'}
    ]
  }

  getOrigenActuaciones() {
    this.comboOrigenActuaciones = [
      {label:'Colegio', value:'COLEGIO'},
      {label:'Colegiado', value:'COLEGIADO'}
    ]
  }

  getComboJuzgados() {
    this.progressSpinner=true;

    this.sigaServices.get("combo_comboJuzgadoDesignaciones").subscribe(
      n => {
        this.comboJuzgados = n.combooItems;
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }, () => {
        this.arregloTildesCombo(this.comboTurno);
      }
    );
  }

  getComboModulos() {
    this.progressSpinner=true;

    this.sigaServices.get("combo_comboModulosDesignaciones").subscribe(
      n => {
        this.comboModulos = n.combooItems;
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }, () => {
        this.arregloTildesCombo(this.comboTurno);
      }
    );
  }

  getComboProcedimientos() {
    this.progressSpinner=true;

    this.sigaServices.get("combo_comboProcedimientosDesignaciones").subscribe(
      n => {
        this.comboProcedimientos = n.combooItems;
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }, () => {
        this.arregloTildesCombo(this.comboProcedimientos);
      }
    );
  }

  getComboRoles() {
    this.progressSpinner=true;

    this.comboRoles = [
      {label:'Solicitante', value:'SOLICITANTE'},
      {label:'Contrario', value:'CONTRARIO'},
      {label:'Representante del solicitante', value:'REPRESENTANTE'},
      {label:'Unidad familiar', value:'UNIDAD'}
    ]
  }

  getComboAcreditaciones(){
    this.progressSpinner=true;

    this.sigaServices.get("modulosybasesdecompensacion_comboAcreditaciones").subscribe(
      n => {
        this.comboAcreditaciones = n.combooItems;
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }, () => {
        this.arregloTildesCombo(this.comboAcreditaciones);
      }
    );
  }

  cargaCombosJustificacion(){
    this.cargaComboActuacionesValidadas();
    this.cargaComboSinEJG();
    this.cargaComboEJGnoFavorable();
    this.cargaComboEJGSinResolucion();
    this.cargaComboResoluciones();
  }

  cargaComboSinEJG(){
    this.comboSinEJG = [
      {label:'EJG con resolución', value:'0'},
      {label:'EJG sin resolución (modo lectura)', value:'1'},
      {label: 'EJG sin resolución (se puede justificar)', value:'2'}
    ];
  }

  cargaComboEJGnoFavorable(){
    this.comboEJGnoFavorable = [
      {label:'No se incluyen', value:'0'},
      {label:'Se incluyen (modo lectura)', value:'1'},
      {label: 'Se incluye (se puede justificar)', value:'2'}
    ];
  }

  cargaComboEJGSinResolucion(){
    this.comboEJGSinResolucion = [
      {label:'Con EJG Relacionado', value:'0'},
      {label:'Sin EJG Relacionado (modo lectura)', value:'1'},
      {label: 'Sin EJG Relacionado (se puede justificar)', value:'2'}
    ];
  }

  cargaComboResoluciones(){
    this.comboResoluciones = [
      {label:'No se incluyen', value:'0'},
      {label:'Se incluyen (modo lectura)', value:'1'},
      {label: 'Se incluye (se puede justificar)', value:'2'}
    ];
  }

  cargaComboActuacionesValidadas(){
    this.comboActuacionesValidadas = [
      {label:'Sí', value:'SI'},
      {label:'No', value:'NO'},
      {label: 'Sin actuaciones', value:'SINACTUACIONES'}
    ];
  }

  buscar(){
    //es la busqueda de justificacion
    if(this.showJustificacionExpress){
      if(this.usuarioBusquedaExpress.numColegiado!=undefined && this.usuarioBusquedaExpress.numColegiado!=null
        && this.usuarioBusquedaExpress.numColegiado.trim().length!=0){
        this.filtroJustificacion.nColegiado=this.usuarioBusquedaExpress.numColegiado;
      }

      this.filtroJustificacion.muestraPendiente = this.checkMostrarPendientes;
      this.filtroJustificacion.restriccionesVisualizacion = this.checkRestricciones;

      if(this.compruebaFiltroJustificacion()){
        this.showTablaJustificacionExpres.emit(false);
        this.busquedaJustificacionExpres.emit(true);
      }
    }else{
      if(this.usuarioBusquedaExpress.numColegiado!=undefined && this.usuarioBusquedaExpress.numColegiado!=null){
        this.filtroJustificacion.nColegiado=this.usuarioBusquedaExpress.numColegiado;
      }

        this.progressSpinner=true;
        let designa = new DesignaItem();
        designa.ano = this.body.ano;
        designa.codigo = this.body.codigo;
        designa.fechaEntradaInicio = this.fechaAperturaDesdeSelect;
        designa.fechaEntradaFin = this.fechaAperturaHastaSelect;
        designa.estados = this.body.estados;
        designa.idTipoDesignaColegios = (this.body.idTipoDesignaColegios); 
        designa.idTurnos = this.body.idTurnos; 
        if(designa.idTurno != null){
          designa.nombreTurno = this.comboTurno.find(
            item => item.value == designa.idTurno
          ).label;
        }
        designa.documentacionActuacion = this.body.documentacionActuacion;
        designa.idActuacionesV = this.body.idActuacionesV;
        designa.idArt27 = this.body.idArt27; 
        designa.numColegiado = this.usuarioBusquedaExpress.numColegiado;

        designa.idJuzgados = this.body.idJuzgados;
        designa.idModulos = this.body.idModulos;
        designa.idCalidad = this.body.idCalidad;
        if(this.body.anoProcedimiento != null && this.body.anoProcedimiento != undefined){
          designa.numProcedimiento = this.body.anoProcedimiento.toString();
        }
        designa.idProcedimientos = this.body.idProcedimientos;
        designa.nig = this.body.nig;
        designa.asunto = this.body.asunto;

        designa.idJuzgadoActu = this.body.idJuzgadoActu;
        if(designa.idJuzgadoActu != null){
        designa.nombreJuzgadoActu = this.comboJuzgados.find(
          item => item.value == designa.idJuzgadoActu
        ).label; 
       }
       if(this.body.idAcreditacion != undefined){
        designa.idAcreditacion = this.body.idAcreditacion;
       }
        designa.idOrigen = this.body.idOrigen;
        designa.fechaJustificacionDesde = this.fechaJustificacionDesdeSelect;
        designa.fechaJustificacionHasta = this.fechaJustificacionHastaSelect;
        designa.idModuloActuaciones = this.body.idModuloActuaciones;
        designa.idProcedimientoActuaciones = this.body.idProcedimientoActuaciones;
        designa.nif = this.body.nif;
        designa.apellidosInteresado = this.body.apellidosInteresado;
        designa.nombreInteresado = this.body.nombreInteresado;
        designa.rol = this.body.rol;
        
        sessionStorage.setItem("designaItem", JSON.stringify(designa));
        
        this.progressSpinner = false;
        this.busqueda.emit(false);
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

  compruebaFiltroJustificacion(){
    if(this.filtroJustificacion.nColegiado!=undefined && this.filtroJustificacion.nColegiado!=null
      && this.usuarioBusquedaExpress.numColegiado.trim().length!=0){
      return true;
    }else{
      this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.oficio.justificacionExpres.message.ncolegiadoObligatorio"));
      return false;
    }
  }

  limpiar(){
    this.filtroJustificacion = new JustificacionExpressItem();
    
    if(!this.esColegiado){
      this.usuarioBusquedaExpress = {
        numColegiado: '',
        nombreAp: ''
      };
    }
    this.body = new DesignaItem();
    this.getBuscadorDesignas();
  }

  onChangeCheckMostrarPendientes(event) {
    this.checkMostrarPendientes = event;

    if(event){
      this.filtroJustificacion.justificacionDesde=undefined;
      this.filtroJustificacion.justificacionHasta=undefined;
      this.filtroJustificacion.estado=undefined;
      this.filtroJustificacion.actuacionesValidadas=undefined;
    }  
  }

  onChangeCheckRestricciones(event) {
    this.checkRestricciones = event;
    
    if(!event){
      this.disableRestricciones=false;
      this.filtroJustificacion.ejgSinResolucion="2"; 
      this.filtroJustificacion.sinEJG="2";
      this.filtroJustificacion.resolucionPTECAJG="2";
      this.filtroJustificacion.conEJGNoFavorables="2";
    }else{
      this.disableRestricciones=true;
      this.filtroJustificacion.ejgSinResolucion="0"; 
      this.filtroJustificacion.sinEJG="0";
      this.filtroJustificacion.resolucionPTECAJG="0";
      this.filtroJustificacion.conEJGNoFavorables="0";
    }
  }

  getComboArticulo() {
    this.comboArt = [
      {label:'Si', value:'S'},
      {label:'No', value:'N'}
    ]
  }

  arregloTildesCombo(combo) {
    if (combo != undefined)
      combo.map(e => {
        let accents =
          "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
        let accentsOut =
          "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
        let i;
        let x;
        for (i = 0; i < e.label.length; i++) {
          if ((x = accents.indexOf(e.label[i])) != -1) {
            e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
            return e.labelSinTilde;
          }
        }
      });
  }

  getDataLoggedUser() {
   
    this.progressSpinner = true;
    this.esColegiado = false;
    //si es colegio, valor por defecto para justificacion
    this.filtroJustificacion.ejgSinResolucion="2"; 
    this.filtroJustificacion.sinEJG="2";
    this.filtroJustificacion.resolucionPTECAJG="2";
    this.filtroJustificacion.conEJGNoFavorables="2";
    this.sigaServices.get("usuario_logeado").subscribe(n => {

      const usuario = n.usuarioLogeadoItem;
      const colegiadoItem = new ColegiadoItem();
      colegiadoItem.nif = usuario[0].dni;

      //cambiar, nullpointer si no es colegiado
      this.sigaServices.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(usr => {
        const { numColegiado, nombre } = JSON.parse(usr.body).colegiadoItem[0];
        this.usuarioBusquedaExpress.numColegiado = numColegiado;
        this.usuarioBusquedaExpress.nombreAp = nombre.replace(/,/g,"");
        this.showColegiado = true;

        //es colegiado, filtro por defecto para justificacion
        this.filtroJustificacion.ejgSinResolucion = this.ejgSinResolucion;
        this.filtroJustificacion.sinEJG= this.sinEjg;
        this.filtroJustificacion.resolucionPTECAJG= this.ejgPtecajg;
        this.filtroJustificacion.conEJGNoFavorables= this.ejgNoFavorable;

        this.esColegiado = true;
        this.checkRestricciones = true;
      },
      err =>{
        this.progressSpinner = false;
      },
      ()=>{
        this.progressSpinner = false;
        this.buscar();
      });

    },
    error =>{
      console.log("ERROR: cargando datos del usuario logado");
      this.progressSpinner=false;
    });
  }

  clear() {
    this.msgs = [];
  }

  nuevo(){
      this.progressSpinner=true
      sessionStorage.setItem("nuevaDesigna",  "true");
      this.router.navigate(["/fichaDesignaciones"]);
      this.progressSpinner=false;
  }

  changeColegiado(event) {
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
  }

    //búsqueda con enter
    @HostListener("document:keypress", ["$event"])
    onKeyPress(event: KeyboardEvent) {
      if (event.keyCode === KEY_CODE.ENTER) {
        this.buscar();
      }
    }

}