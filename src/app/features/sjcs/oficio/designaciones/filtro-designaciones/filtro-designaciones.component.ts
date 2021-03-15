import { Component, Input, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
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

  expanded: boolean = true;

  @Input() modoBusqueda;

  progressSpinner: boolean = false;
  showDesignas: boolean = false;
  showJustificacionExpress: boolean = false;
  disabledBusquedaExpress: boolean = false;
  showColegiado: any;
  radioTarjeta: string = 'designas';
  //Variables busqueda designas
  msgs: Message[] = [];
  body: DesignaItem = new DesignaItem();
  fechaAperturaHastaSelect: Date;
  fechaAperturaDesdeSelect: Date;
  comboEstados: any[];
  comboTipoDesigna: any[];
  comboTurno: any[];
  actuacionesV: any[];
  comboArt: any[];
  actuacionesDocu: any[];

  constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices) { }

  ngOnInit(): void {
    this.filtroJustificacion = new JustificacionExpressItem();

    this.progressSpinner=true;
    this.showDesignas = true;

    this.checkLastRoute();

    if (sessionStorage.getItem('esBuscadorColegiados') == "true" && sessionStorage.getItem('usuarioBusquedaExpress')) {
      this.usuarioBusquedaExpress = JSON.parse(sessionStorage.getItem('usuarioBusquedaExpress'));
    }

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
      this.showColegiado = "expanded";
    }else{
      this.showColegiado = "collapsed";
    }
  }

  changeFilters() {
    this.showDesignas=!this.showDesignas;
    this.showJustificacionExpress=!this.showJustificacionExpress;
  }

  checkLastRoute() {
    this.progressSpinner=false;
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
    this.sigaServices.get("combo_turnos").subscribe(
      n => {
        this.comboTurno = n.combooItems;
      },
      err => {
        console.log(err);

      }, () => {
        this.arregloTildesCombo(this.comboTurno);
      }
    );
  }

  getComboTipoDesignas() {
    this.sigaServices.get("desginas_tipoDesignas").subscribe(
      n => {
        this.comboTipoDesigna = n.combooItems;
      },
      err => {
        console.log(err);

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

    this.sigaServices.get("usuario_logeado").subscribe(n => {

      const usuario = n.usuarioLogeadoItem;
      const colegiadoItem = new ColegiadoItem();
      colegiadoItem.nif = usuario[0].dni;

      this.sigaServices.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(usr => {
        const { numColegiado, nombre } = JSON.parse(usr.body).colegiadoItem[0];
        this.usuarioBusquedaExpress.numColegiado = numColegiado;
        this.usuarioBusquedaExpress.nombreAp = nombre;
      });

    });

  }

}
