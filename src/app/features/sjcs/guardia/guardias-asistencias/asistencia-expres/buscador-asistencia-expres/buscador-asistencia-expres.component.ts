import { DatePipe } from '@angular/common/';
import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, RoutesRecognized } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { BusquedaColegiadoExpressComponent } from '../../../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.component';
import { TranslateService } from '../../../../../../commons/translate';
import { FiltroAsistenciaItem } from '../../../../../../models/guardia/FiltroAsistenciaItem';
import { SigaStorageService } from '../../../../../../siga-storage.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-buscador-asistencia-expres',
  templateUrl: './buscador-asistencia-expres.component.html',
  styleUrls: ['./buscador-asistencia-expres.component.scss']
})
export class BuscadorAsistenciaExpresComponent implements OnInit {
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  expanded = true;
  datos;
  aeForm = new FormGroup({
    numColegiado: new FormControl(''),
    nombreAp: new FormControl(''),
  });
  filtro : FiltroAsistenciaItem = new FiltroAsistenciaItem();
  filtroAux : FiltroAsistenciaItem = new FiltroAsistenciaItem();
  @Input() modoBusqueda: string;
  modoBusquedaB: boolean = true;
  @Input() titulo: string;
  msgs: Message[] = [];
  rutas: string[] = ['SJCS', 'Guardia', 'Asistencias'];
  salto: boolean = false;
  refuerzoSustitucionNoSeleccionado: boolean = true;
  deshabilitarLetradoGuardia: boolean = false;

  comboTurnos = [];
  comboGuardias = [];
  comboTiposAsistencia = [];
  comboLetradosGuardia = [];
  comboRefuerzoSustitucion = [];
  resaltadoDatos: boolean = false;
  opcionSeleccionado: string = '0';
  verSeleccion: string = '';
  isLetrado : boolean = false;
  @Output() letradoFillAutomatic = new EventEmitter<boolean>();
  @Output() buscarAE = new EventEmitter<boolean>();
  progressSpinner: boolean = false;
  
  @ViewChild(BusquedaColegiadoExpressComponent) busquedaColegiado: BusquedaColegiadoExpressComponent;

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private commonServices: CommonsService,
    private sigaStorageService: SigaStorageService,
    private datepipe: DatePipe,
    private translateService: TranslateService) {}

  ngOnInit(): void {

    if (sessionStorage.getItem("filtroAsistenciaExpresBusqueda") && sessionStorage.getItem("vieneDeAsistenciaExpres")){
      let oldFiltro : FiltroAsistenciaItem = JSON.parse(sessionStorage.getItem("filtroAsistenciaExpresBusqueda"));

      this.filtro.diaGuardia = oldFiltro.diaGuardia;
      this.getTurnosByColegiadoFecha();
      this.filtro.idTurno = oldFiltro.idTurno;
      this.onChangeTurno();
      this.filtro.idGuardia = oldFiltro.idGuardia;
      this.onChangeGuardia();
      this.filtro.idLetradoGuardia = oldFiltro.idLetradoGuardia;
      this.filtro.idPersona = oldFiltro.idPersona;
      this.filtro.idTipoAsistenciaColegiado = oldFiltro.idTipoAsistenciaColegiado;
      this.filtro.isSustituto = oldFiltro.isSustituto;

      sessionStorage.removeItem("filtroAsistenciaExpresBusqueda");
      sessionStorage.removeItem("vieneDeAsistenciaExpres");

      this.buscarAE.emit();
    }

    this.checkLastRoute();
    if(this.sigaStorageService.idPersona
      && this.sigaStorageService.isLetrado){

      this.filtro.idPersona = this.sigaStorageService.idPersona;
      this.isLetrado = true;

    }
    if (sessionStorage.getItem('esBuscadorColegiados') == "true" && sessionStorage.getItem('buscadorColegiados')) {
      const { nombre, apellidos, nColegiado } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));

      this.usuarioBusquedaExpress.nombreAp = `${apellidos}, ${nombre}`;
      this.usuarioBusquedaExpress.numColegiado = nColegiado;
    }
    this.titulo = 'Datos Comunes';
    this.resaltadoDatos = true;

    this.getComboRefuerzoSustitucion();
    //this.getComboTurno();

    sessionStorage.setItem("deshabilitarBuscadorColegiadoExpres", "true");
  }

  getComboRefuerzoSustitucion() {
    this.comboRefuerzoSustitucion = [
      { label: this.translateService.instant('justiciaGratuita.guardia.asistenciasexpress.refuerzo'), value: "N" },
      { label: this.translateService.instant('justiciaGratuita.guardia.asistenciasexpress.sustitucion'), value: "S" }
    ];
  }

  capturar() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this.verSeleccion = this.opcionSeleccionado;

  }

  showMsg(severityParam : string, summaryParam : string, detailParam : string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }

  clear() {
    this.msgs = [];
  }

  checkLastRoute() {

    this.router.events
      .filter(e => e instanceof RoutesRecognized)
      .pairwise()
      .subscribe((event: any[]) => {
        if (event[0].urlAfterRedirects == "/buscadorColegiados") {
          sessionStorage.setItem("esBuscadorColegiados", "true");
        } else {
          sessionStorage.setItem("esBuscadorColegiados", "false");
        }
      });
  }

  fillFechaFiltro(event) {

    if(event){
      this.filtro.diaGuardia = this.datepipe.transform(new Date(event), 'dd/MM/yyyy');
      sessionStorage.setItem("diaGuardiaFiltro", this.filtro.diaGuardia + " 00:00");
      this.getTurnosByColegiadoFecha();
    }else{
      this.filtro.diaGuardia = '';
      this.comboTurnos = [];
    }
    
  }

  getCombos() {
    this.sigaServices.get("combo_turnos").subscribe(
      n => {
        this.comboTurnos = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.comboTurnos.map(e => {
          let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
          let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });

      },
      err => {
        //console.log(err);
      }
    );
  }
  getTurnosByColegiadoFecha(){

    this.comboTurnos = [];
    this.filtro.idTurno = "";
    this.progressSpinner = true;
    this.sigaServices.getParam("busquedaGuardias_getTurnosByColegiadoFecha", this.fillParams()).subscribe(
      n => {
        this.clear();
        this.progressSpinner = false;

        if(n.error !== null
          && n.error.code === 500){
          this.showMsg("error", "Error", n.error.description.toString());
        }else if(n.error !== null
          && n.error.code === 200){
          this.showMsg("error", "No hay guardias", this.translateService.instant(n.error.description.toString()));
        }else{

          this.comboTurnos = n.combooItems;
          this.commonServices.arregloTildesCombo(this.comboTurnos);
        }
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    );
  }

  disabledIfEmptyArgs(...args: any[]): boolean {
    let res = false;
    for (const arg of args) {
      if (arg == undefined || arg.toString().trim().length == 0) {
        res = true;
        break;
      }
    }
    return res;
  }

  fillParams(){
    let parametros = '?guardiaDia=' + this.filtro.diaGuardia;
      
    if(this.filtro.idPersona !== null
        && this.filtro.idPersona !== undefined
        && this.sigaStorageService.isLetrado){
        
        parametros += "&idPersona="+this.filtro.idPersona;

    }

    return parametros;
  }

  onChangeTurno() {
    this.filtro.idGuardia = '';
    this.comboGuardias = [];
    this.filtro.idTipoAsistenciaColegiado = '';
    this.filtro.idLetradoGuardia = '';
    this.usuarioBusquedaExpress.nombreAp = '';
    this.usuarioBusquedaExpress.numColegiado = '';
    this.comboTiposAsistencia = [];
    this.comboLetradosGuardia = [];

    if (this.filtro.idTurno) {
      this.getComboGuardia();
    }
  }

  getComboGuardia() {
    let params : string = '';
    if(this.filtro.idPersona){
      params = "?idTurno=" + this.filtro.idTurno + "&guardiaDia=" + this.filtro.diaGuardia + '&idPersona=' + this.filtro.idPersona;
    }else{
      params = "?idTurno=" + this.filtro.idTurno + "&guardiaDia=" + this.filtro.diaGuardia;
    }

    this.progressSpinner = true;
    this.sigaServices.getParam(
      "busquedaGuardias_getGuardiasByTurnoColegiadoFecha", params).subscribe(
        data => {
          this.progressSpinner = false;

          this.comboGuardias = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboGuardias);
        },
        err => {
          this.progressSpinner = false;
          //console.log(err);
        }
      );
  }

  //Crear servicio para traer tipos asistencia segun idtipoguardia e institución
  onChangeGuardia(){

    this.deshabilitarLetradoGuardia = false;
    this.filtro.idTipoAsistenciaColegiado = '';
    this.filtro.idLetradoGuardia = '';
    this.usuarioBusquedaExpress.nombreAp = '';
    this.usuarioBusquedaExpress.numColegiado = '';
    this.comboTiposAsistencia = [];
    this.comboLetradosGuardia = [];
    let idTurno = "x";
    let idGuardia = "x";
    if(this.filtro.idTurno!=undefined && this.filtro.idTurno != null){
      idTurno = this.filtro.idTurno;
    }
    if(this.filtro.idGuardia!=undefined && this.filtro.idGuardia != null){
      idGuardia = this.filtro.idGuardia;
    }
    this.sigaServices.getParam(
      "busquedaGuardias_getTiposAsistencia", "?idTurno=" + idTurno + "&idGuardia=" + idGuardia).subscribe(
        data => {
          
          this.comboTiposAsistencia = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboTiposAsistencia);
          //this.setDefaultValueOnComboTiposAsistencia();
          this.getDefaultTipoAsistenciaColegio();

        },
        err => {
          //console.log(err);
        }
      );

      this.sigaServices.getParam(
        "busquedaGuardias_getLetradosGuardiaDia", "?idTurno=" + this.filtro.idTurno + "&idGuardia=" + this.filtro.idGuardia + "&guardiaDia="+this.filtro.diaGuardia).subscribe(
          data => {
            
            this.comboLetradosGuardia = data.combooItems;
            this.commonServices.arregloTildesCombo(this.comboLetradosGuardia);

            if(this.comboLetradosGuardia !== null
              && this.comboLetradosGuardia.length > 0){

                if (this.filtro.idLetradoGuardia == null || this.filtro.idLetradoGuardia == '') {
                  this.filtro.idLetradoGuardia = this.comboLetradosGuardia[0].value;
                }

                if (this.filtro.idLetradoGuardia != undefined && this.filtro.idLetradoGuardia != null){
                  this.letradoFillAutomatic.emit(true);

                  this.filtro.isSustituto = null;
                  this.refuerzoSustitucionNoSeleccionado = true;
                }else{
                  this.letradoFillAutomatic.emit(false);
                }
               // this.onChangeLetradoGuardia();
              } else {
                this.deshabilitarLetradoGuardia = true;
                this.filtro.isSustituto = 'N';
                this.refuerzoSustitucionNoSeleccionado = false;
              }
  
          },
          err => {
            //console.log(err);
          }
        );
    
    

  }

  getDefaultTipoAsistenciaColegio(){
    this.sigaServices.get("busquedaGuardias_getDefaultTipoAsistenciaColegio").subscribe(
      n => {
        if(n && n.valor && this.comboTiposAsistencia.find(comboItem => comboItem.value == n.valor)){
          this.filtro.idTipoAsistenciaColegiado = n.valor;
        }
      },
      err => {
        //console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboTurnos);
      }
    );
  }

  changeColegiado(event) {
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
    this.buscarAE.emit();
  }
  
  getIdPersonaLetradoManual(event){
    if (event == "") {
      this.filtro.idLetradoManual = undefined;
    } else {
      this.filtro.idLetradoManual = event;
    }
    
  }

/*  onChangeLetradoGuardia(){

    if(this.filtro.idLetradoGuardia){

      this.sigaServices
      .post("busquedaPer", this.filtro.idLetradoGuardia)
      .subscribe(
        n => {
          let persona = JSON.parse(n["body"]);
          if (persona && persona.colegiadoItem) {
            
            this.usuarioBusquedaExpress.numColegiado = persona.colegiadoItem[0].numColegiado;
            this.busquedaColegiado.isBuscar(this.usuarioBusquedaExpress);

          } 
        },
        err => {
          //console.log(err);
        }
      );

    }
  }*/

  onChangeSustitutoCheck(event) {
    if(event){
      this.filtro.isSustituto = 'S';
    }else{
      this.filtro.isSustituto = 'N'
    }
  }

  styleObligatorio(evento){
    if(this.resaltadoDatos && (evento==undefined || evento==null || evento=="")){
      return this.commonServices.styleObligatorio(evento);
    }
  }

  onChangeCheckSalto(event){
    this.salto = event;

    if (this.salto == true) {
      this.filtro.salto = "S";
    } else {
      this.filtro.salto = "N";
    }
  }

  onChangeRefuerzoSustitucion(event){
    if (this.filtro.isSustituto != null) {
      this.refuerzoSustitucionNoSeleccionado = false;
    } else {
      this.refuerzoSustitucionNoSeleccionado = true;
      this.usuarioBusquedaExpress.nombreAp = undefined;
      this.usuarioBusquedaExpress.numColegiado = undefined;
      this.filtro.idLetradoManual = undefined;
    }
    this.buscarAE.emit();
  }

  onChangeLetradoGuardia(event) {
    this.buscarAE.emit();
  }
}
