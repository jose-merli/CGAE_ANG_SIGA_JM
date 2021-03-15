import { Component, OnInit } from '@angular/core';
import { Message } from "primeng/components/common/api";
import { TranslateService } from '../../../../../commons/translate';
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

  expanded: boolean = true;
  
  progressSpinner: boolean = false;
  showDesignas: boolean = false;
  showJustificacionExpress: boolean = false;
  checkMostrarPendientes: boolean = true;
  checkRestricciones: boolean = true;

  radioTarjeta: string = 'designas';

  //Variables busqueda designas
  msgs: Message[] = [];
  body: DesignaItem = new DesignaItem();
  fechaAperturaHastaSelect: Date;
  fechaAperturaDesdeSelect: Date;

  comboEstados: any[];
  comboActuacionesValidadas: any [];
  comboSinEJG: any [];
  comboResoluciones: any [];
  comboEJGSinResolucion: any [];
  comboEJGnoFavorable: any [];

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

    //combo comun
    this.getComboEstados();
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
      {label:'activo', value:'Activo'},
      {label:'finalizada', value:'Finalizada'},
      {label:'anulada', value:'Anulada'}
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

  onChangeChecRestricciones(event) {
    this.checkRestricciones = event;
  }
}
