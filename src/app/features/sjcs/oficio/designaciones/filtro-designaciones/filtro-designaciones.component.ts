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
  checkRestricciones: boolean = false;

  disabledBusquedaExpress: boolean = false;
  showColegiado: boolean = false;
  esColegiado: boolean = false;
  radioTarjeta: string = 'designas';

  //Variables busqueda designas
  msgs: Message[] = [];
  body: DesignaItem = new DesignaItem();
  fechaAperturaHastaSelect: Date;
  fechaAperturaDesdeSelect: Date;
  textFilter: String = "Seleccionar";
  comboEstados: any[];
  comboActuacionesValidadas: any [];
  comboSinEJG: any [];
  comboResoluciones: any [];
  comboEJGSinResolucion: any [];
  comboEJGnoFavorable: any [];

  comboTipoDesigna: any[];
  comboTurno: any[];
  actuacionesV: any[];
  comboArt: any[];
  actuacionesDocu: any[];

  constructor(private translateService: TranslateService, private sigaServices: SigaServices) { }

  ngOnInit(): void {
    this.filtroJustificacion = new JustificacionExpressItem();

    this. esColegiado = false;
    this.progressSpinner=true;
    this.showDesignas = true;
    this.checkRestricciones = false;

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
      this.expanded=true;
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
  }

  fillFechaAperturaDesde(event) {
    this.fechaAperturaDesdeSelect = event;
    if((this.fechaAperturaHastaSelect != null && this.fechaAperturaHastaSelect != undefined) && (this.fechaAperturaDesdeSelect > this.fechaAperturaHastaSelect)){
      this.msgs = [{severity: "error", summary: "Error", detail: this.translateService.instant('justiciaGratuita.sjcs.designas.mensaje.Fechas')}];
    }
  }

  fillFechaAperturaHasta(event) {
    this.fechaAperturaHastaSelect = event;
    if(this.fechaAperturaDesdeSelect > this.fechaAperturaHastaSelect ){
      this.msgs = [{severity: "error", summary: "Error", detail: this.translateService.instant('justiciaGratuita.sjcs.designas.mensaje.Fechas')}];
    }
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

    this.sigaServices.get("desginas_tipoDesignas").subscribe(
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

  onChangeCheckRestricciones(event) {
    this.checkRestricciones = event;

    if(!event){
      this.filtroJustificacion.ejgSinResolucion="2"; 
      this.filtroJustificacion.sinEJG="2";
      this.filtroJustificacion.resolucionPTECAJG="2";
      this.filtroJustificacion.conEJGNoFavorables="2";
    }else{
      this.filtroJustificacion.ejgSinResolucion="0"; 
      this.filtroJustificacion.sinEJG="0";
      this.filtroJustificacion.resolucionPTECAJG="0";
      this.filtroJustificacion.conEJGNoFavorables="0";
    }
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

      this.sigaServices.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(usr => {
        const { numColegiado, nombre } = JSON.parse(usr.body).colegiadoItem[0];
        this.usuarioBusquedaExpress.numColegiado = numColegiado;
        this.usuarioBusquedaExpress.nombreAp = nombre;
        this.showColegiado = true;
        this.progressSpinner = false;

        //es colegiado, filtro por defecto para justificacion
        this.filtroJustificacion.ejgSinResolucion="0";
        this.filtroJustificacion.sinEJG="0";
        this.filtroJustificacion.resolucionPTECAJG="0";
        this.filtroJustificacion.conEJGNoFavorables="0";

        this.esColegiado = true;
        this.checkRestricciones = true;
      },
      err =>{
        this.progressSpinner = false;
      });

    },
    error =>{
      console.log("ERROR: cargando datos del usuario logado");
      this.progressSpinner=false;
    });
  }
}
