import { Component, OnInit } from '@angular/core';
import { Message } from "primeng/components/common/api";
import { TranslateService } from '../../../../../commons/translate';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';
import { DesignaItem } from '../../../../../models/sjcs/DesignaItem';
import { JustificacionExpressItem } from '../../../../../models/sjcs/JustificacionExpressItem';
import { SigaServices } from '../../../../../_services/siga.service';

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
  
  filtroJustificacion: JustificacionExpressItem = new JustificacionExpressItem();

  expanded: boolean = false;
  textSelected: String = "{0} etiquetas seleccionadas";
  progressSpinner: boolean = false;
  showDesignas: boolean = false;
  showJustificacionExpress: boolean = false;
  checkMostrarPendientes: boolean = true;
  checkRestricciones: boolean = true;

  disabledBusquedaExpress: boolean = false;
  showColegiado: boolean = false;
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

  constructor(private translateService: TranslateService, private sigaServices: SigaServices) { }

  ngOnInit(): void {
    this.filtroJustificacion = new JustificacionExpressItem();

    this.progressSpinner=true;
    this.showDesignas = true;

    // this.checkLastRoute();

    if (sessionStorage.getItem('esBuscadorColegiados') == "true" && sessionStorage.getItem('usuarioBusquedaExpress')) {
      this.usuarioBusquedaExpress = JSON.parse(sessionStorage.getItem('usuarioBusquedaExpress'));
    }

    //justificacion expres
    this.cargaCombosJustificacion();

    //Inicializamos buscador designas
    this.getBuscadorDesignas();

    if (sessionStorage.getItem("esColegiado") && sessionStorage.getItem("esColegiado") == 'true') {
      this.disabledBusquedaExpress = true;
      this.getDataLoggedUser();
    }

    if (sessionStorage.getItem('buscadorColegiados')) {

      const { nombre, apellidos, nColegiado } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));

      this.usuarioBusquedaExpress.nombreAp = `${apellidos}, ${nombre}`;
      this.usuarioBusquedaExpress.numColegiado = nColegiado;
      this.showColegiado = true;

    }

    //combo comun
    this.getComboEstados();

    this.progressSpinner=false;
  }

  changeFilters(event) {
    if(event=='designas'){
      this.showDesignas=true;
      this.showJustificacionExpress=false;
    }

    if(event=='justificacion'){
      this.showDesignas=false;
      this.showJustificacionExpress=true;
    }
  }

  // checkLastRoute() {
  //   this.progressSpinner=false;
  // }

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

  fillFechaJustificacionDesdeCalendar(event) {
    if(event != null){
      this.fechaJustificacionDesdeSelect = this.transformaFecha(event);
      this.disabledfechaJustificacion = false;
    }else{
      this.fechaJustificacionDesdeSelect = undefined;
      this.disabledfechaJustificacion = true;
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
      {label:'Activo', value:'ACTIVO'},
      {label:'Finalizada', value:'FINALIZADA'},
      {label:'Anulada', value:'ANULADA'}
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
        this.arregloTildesCombo(this.comboTurno);
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
      {label:'Demandante', value:'DEMANDANTE'},
      {label:'Demandado', value:'DEMANDADO'}
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
        this.arregloTildesCombo(this.comboTurno);
      }
    );
  }

  cargaCombosJustificacion(){
    this.progressSpinner=false;
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
      {label:'Sí', value:'si'},
      {label:'No', value:'no'},
      {label: 'Sin actuaciones', value:'sinActuaciones'}
    ];
  }

  buscar(){
    //es la busqueda de justificacion
    if(this.showJustificacionExpress){
      if(this.usuarioBusquedaExpress.numColegiado!=undefined && this.usuarioBusquedaExpress.numColegiado!=null){
        this.filtroJustificacion.nColegiado=this.usuarioBusquedaExpress.numColegiado;
      }

      if(this.compruebaFiltroJustificacion()){
        this.progressSpinner=true;

        // this.filtroJustificacion.muestraPendiente=this.checkMostrarPendientes;

        this.sigaServices.post("justificacionExpres_busqueda", this.filtroJustificacion).subscribe(
          n => {
            this.progressSpinner=false;
          },
          err => {
            this.progressSpinner = false;

            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

            console.log(err);
          });
      }
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
    if(this.filtroJustificacion.nColegiado!=undefined && this.filtroJustificacion.nColegiado!=null){
      return true;
    }else{
      this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.oficio.justificacionExpres.message.ncolegiadoObligatorio"));
      return false;
    }
  }

  limpiar(){
    this.filtroJustificacion = new JustificacionExpressItem();
    
    this.usuarioBusquedaExpress = {
      numColegiado: '',
      nombreAp: ''
    };
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

  onChangeChecRestricciones(event) {
    this.checkRestricciones = event;
  }

  getComboArticulo() {
    this.comboArt = [
      {label:'Si', value:'SI'},
      {label:'No', value:'NO'}
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

    this.sigaServices.get("usuario_logeado").subscribe(n => {

      const usuario = n.usuarioLogeadoItem;
      const colegiadoItem = new ColegiadoItem();
      colegiadoItem.nif = usuario[0].dni;

      this.sigaServices.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(usr => {
        const { numColegiado, nombre } = JSON.parse(usr.body).colegiadoItem[0];
        this.usuarioBusquedaExpress.numColegiado = numColegiado;
        this.usuarioBusquedaExpress.nombreAp = nombre;
        this.showColegiado = true;
        this.progressSpinner = false;
      });

    },
    error =>{
      console.log("ERROR: cargando datos del usuario logado");
      this.progressSpinner=false;
    });
  }
}
