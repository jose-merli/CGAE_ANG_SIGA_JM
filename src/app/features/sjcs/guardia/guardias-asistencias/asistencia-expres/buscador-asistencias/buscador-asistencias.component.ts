import { DatePipe } from '@angular/common';
import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AfterViewInit, Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { Message } from 'primeng/api';
import { BusquedaColegiadoExpressComponent } from '../../../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.component';
import { TranslateService } from '../../../../../../commons/translate';
import { FiltroAsistenciaItem } from '../../../../../../models/guardia/FiltroAsistenciaItem';
import { SigaStorageService } from '../../../../../../siga-storage.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-buscador-asistencias',
  templateUrl: './buscador-asistencias.component.html',
  styleUrls: ['./buscador-asistencias.component.scss']
})
export class BuscadorAsistenciasComponent implements OnInit, AfterViewInit, OnChanges {

  msgs : Message[] = [];
  filtro : FiltroAsistenciaItem = new FiltroAsistenciaItem();
  filtroAux : FiltroAsistenciaItem = new FiltroAsistenciaItem();
  comboTurnos = [];
  comboGuardias = [];
  comboTiposAsistencia = [];
  comboOrigenAsistencia = [
    {label:"I.C.A SIGA",value:"10"},
    {label:"Colegiado Volante Exprés Móvil",value:"30"},
    {label:"Colegiado SIGA",value:"20"},
    {label:"Centralita Guardias",value:"40"},
  ];
  comboEstado = [];
  comboActuacionesV = [
    {label:"NO",value:"N"},
    {label:"SÍ",value:"S"},
    {label:"SIN ACT.",value:"SA"}
  ];
  comboEstadoAsistido = [];
  comboJuzgados = [];
  comboComisarias = [];
  comboTipoActuacion = [];
  comboProcedimientos = [];
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  textSelected: String = '{0} opciones seleccionadas';
  openDatosGenerales : boolean = true;
  openColegiado : boolean = false;
  openDatosAsistido : boolean = false;
  openDatosActuaciones : boolean = false;
  isLetrado : boolean = false;
  disabledBusqColegiado : boolean = false;
  @Output() searchAgain = new EventEmitter<boolean>();
  @Input() modoBusqueda : string;
  @ViewChild(BusquedaColegiadoExpressComponent) buscador : BusquedaColegiadoExpressComponent;
  constructor(private router : Router,
    private sigaServices : SigaServices,
    private commonsService : CommonsService,
    private datePipe : DatePipe,
    private sigaStorageService : SigaStorageService,
    private translateService: TranslateService) { }
    textFilter: string = "Seleccionar";
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.modoBusqueda.currentValue == 'a' && this.filtro.numColegiado){
      this.usuarioBusquedaExpress.numColegiado = this.filtro.numColegiado;
      setTimeout(()=>{
        if(this.buscador){
          this.buscador.isBuscar(this.usuarioBusquedaExpress);
        }
      },500)
    }
  }
  ngAfterViewInit(): void {

    if(sessionStorage.getItem("filtroAsistencia") && sessionStorage.getItem("volver") && sessionStorage.getItem("modoBusqueda") == "a"){
      this.modoBusqueda = 'a';
      let oldFiltro : FiltroAsistenciaItem = JSON.parse(sessionStorage.getItem("filtroAsistencia"));
      this.filtro = oldFiltro;
      if(oldFiltro.idTurno){
        this.onChangeTurno();
      }
      if(oldFiltro.idGuardia){
        this.onChangeGuardia();
      }
      if(oldFiltro.idTipoAsistenciaColegiado){
        this.onChangeTipoAsistencia();
      }
      if(oldFiltro.numColegiado){
        this.openColegiado = true;
        this.usuarioBusquedaExpress.numColegiado = oldFiltro.numColegiado;

        setTimeout(()=>{
          if(this.buscador){
            this.buscador.isBuscar(this.usuarioBusquedaExpress);
          }
        },500) 
      }
      if(oldFiltro.nif || oldFiltro.nombre || oldFiltro.apellidos || oldFiltro.idEstadoAsistido){
        this.openDatosAsistido = true;
      }
      if(oldFiltro.numDiligencia || oldFiltro.idComisaria || oldFiltro.numProcedimiento 
        || oldFiltro.idJuzgado || oldFiltro.idTipoActuacion || oldFiltro.idProcedimiento || oldFiltro.nig){
          this.openDatosActuaciones = true;
      }

      this.searchAgain.emit(true);
    }

    if(sessionStorage.getItem("origin") == "fichaColegial"){
      this.filtro.anio = '';
      this.openColegiado = true;
      this.usuarioBusquedaExpress.numColegiado = this.filtro.numColegiado;
      setTimeout(()=>{
        if(this.buscador){
          this.buscador.isBuscar(this.usuarioBusquedaExpress);
        }
      },500)
      sessionStorage.removeItem("origin");
      this.searchAgain.emit(true);
    }
  }

  ngOnInit() {
    this.checkLastRoute();
    if (sessionStorage.getItem('esBuscadorColegiados') == "true" && sessionStorage.getItem('buscadorColegiados')) {
      const { nombre, apellidos, nColegiado } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));

      this.usuarioBusquedaExpress.nombreAp = `${apellidos}, ${nombre}`;
      this.usuarioBusquedaExpress.numColegiado = nColegiado;
      this.filtro.numColegiado = nColegiado;
    }

    if(this.sigaStorageService.idPersona
      && this.sigaStorageService.isLetrado){

      this.openColegiado = true;
      this.isLetrado = true;
      this.filtro.numColegiado = this.sigaStorageService.numColegiado;
      this.disabledBusqColegiado = true;
      this.usuarioBusquedaExpress.numColegiado = this.filtro.numColegiado;
    }

    this.filtro.anio = new Date().getFullYear().toString();
    this.getComboTurnos();
    this.getComboJuzgados();
    this.getComboComisarias();
    this.getComboEstadosAsistencia();
    this.getComboProcedimientos();
    this.getComboEstadoAsistido();
  }

  getComboEstadosAsistencia(){
    this.sigaServices.get("combo_estadosAsistencia").subscribe(
      n => {
        this.comboEstado = n.combooItems;
      },
      err => {
        console.log(err);

      }, () => {
        this.commonsService.arregloTildesCombo(this.comboEstado);
      }
    );
  }

  onChangeTipoAsistencia(){
    this.comboTipoActuacion = [];
    if(this.filtro.idTipoAsistenciaColegiado){
      this.sigaServices.getParam("combo_comboTipoActuacion","?idTipoAsistencia="+this.filtro.idTipoAsistenciaColegiado).subscribe(
        n => {
          this.comboTipoActuacion = n.combooItems;
        },
        err => {
          console.log(err);
        }, () => {
          this.commonsService.arregloTildesCombo(this.comboTipoActuacion);
        }
      );
    }
  }

  getComboProcedimientos(){

    this.sigaServices.get("combo_comboProcedimientosDesignaciones").subscribe(
      n => {
        this.comboProcedimientos = n.combooItems;
      },
      err => {
        console.log(err);

      }, () => {
        this.commonsService.arregloTildesCombo(this.comboProcedimientos);
      }
    );

  }

  getComboTurnos(){
    this.sigaServices.get("combo_turnos").subscribe(
      n => {
        this.comboTurnos = n.combooItems;
      },
      err => {
        console.log(err);
      }, () => {
        this.commonsService.arregloTildesCombo(this.comboTurnos);
      }
    );
  }

  getComboGuardias(){

    this.sigaServices.getParam("combo_guardiaPorTurno","?idTurno="+this.filtro.idTurno).subscribe(
        n => {
          this.comboGuardias = n.combooItems;
        },
        err => {
          console.log(err);

        }, () => {
          this.commonsService.arregloTildesCombo(this.comboGuardias);
        }
    );

  }

  getComboTipoAsistenciaColegio(){

    this.sigaServices.getParam(
      "busquedaGuardias_getTiposAsistencia", "?idTurno=" + this.filtro.idTurno + "&idGuardia=" + this.filtro.idGuardia).subscribe(
        data => {
          
          this.comboTiposAsistencia = data.combooItems;
          this.commonsService.arregloTildesCombo(this.comboTiposAsistencia);
          this.getDefaultValueTipoAsistencia();

        },
        err => {
          console.log(err);
        }
      );

  }

  onChangeTurno(){

    this.comboGuardias = [];
    this.comboTiposAsistencia = [];
    if(this.filtro.idTurno){
      this.getComboGuardias();
    }

  }
  onChangeGuardia(){

    if(this.filtro.idTurno && this.filtro.idGuardia){
      this.comboTiposAsistencia = [];
      this.getComboTipoAsistenciaColegio();
    }

  }

  getDefaultValueTipoAsistencia(){
    this.sigaServices.get("busquedaGuardias_getDefaultTipoAsistenciaColegio").subscribe(
      n => {
        if(n && n.valor && this.comboTiposAsistencia.find(comboItem => comboItem.value == n.valor)){
          this.filtro.idTipoAsistenciaColegiado = n.valor;
        }
      },
      err => {
        console.log(err);

      }, () => {
        this.commonsService.arregloTildesCombo(this.comboTurnos);
      }
    );
  }

  getComboComisarias(){
    this.sigaServices.get("combo_comboComisaria").subscribe(
      n => {
        this.comboComisarias = n.combooItems;
      },
      err => {
        console.log(err);
      }, () => {
        this.commonsService.arregloTildesCombo(this.comboComisarias);
      }
    );
  }
  getComboJuzgados(){

    this.sigaServices.get("combo_comboJuzgado").subscribe(
      n => {
        this.comboJuzgados = n.combooItems;
      },
      err => {
        console.log(err);

      }, () => {
        this.commonsService.arregloTildesCombo(this.comboJuzgados);
      }
    );

  }

  getComboEstadoAsistido() {
    this.sigaServices.get("busquedaJusticiables_comboRoles").subscribe(
      n => {
        this.comboEstadoAsistido = n.combooItems;
        //Quitamos el elemento unidad familiar, que sólo está relacionado con EJG
        let indexUF = this.comboEstadoAsistido.findIndex(item => item.value == "4");
        this.comboEstadoAsistido.splice(indexUF);
      },
      err => {
        console.log(err);
      },
      ()=>{
        this.commonsService.arregloTildesCombo(this.comboEstadoAsistido);
      }
    );
  }

  changeColegiado(event) {
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
    this.filtro.numColegiado = event.nColegiado;
  }

  fillFechaAsistenciaHasta(event){
    if(event){
      this.filtro.fechaAsistenciaHasta = this.datePipe.transform(new Date(event),'dd/MM/yyyy');
    }else{
      this.filtro.fechaAsistenciaHasta = '';
    }
  }
  fillFechaAsistenciaDesde(event){
    if(event){
      this.filtro.fechaAsistenciaDesde = this.datePipe.transform(new Date(event),'dd/MM/yyyy');
    }else{
      this.filtro.fechaAsistenciaDesde = '';
    }
  }
  onChangeJuzgado(){
    if(this.filtro.idJuzgado){
      this.filtro.idComisaria = '';
    }
  }
  onChangeComisaria(){
    if(this.filtro.idComisaria){
      this.filtro.idJuzgado = '';
    }
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
}
