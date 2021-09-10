import { DatePipe } from '@angular/common/';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
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

  comboTurnos = [];
  comboGuardias = [];
  comboTiposAsistencia = [];
  comboLetradosGuardia = [];
  resaltadoDatos: boolean = false;
  opcionSeleccionado: string = '0';
  verSeleccion: string = '';

  @ViewChild(BusquedaColegiadoExpressComponent) busquedaColegiado: BusquedaColegiadoExpressComponent;

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private commonServices: CommonsService,
    private sigaStorageService: SigaStorageService,
    private datepipe: DatePipe,
    private translateService: TranslateService) {}

  ngOnInit(): void {
    this.checkLastRoute();
    if(this.sigaStorageService.idPersona
      && this.sigaStorageService.isLetrado){

      this.filtro.idPersona = this.sigaStorageService.idPersona;

    }
    if (sessionStorage.getItem('esBuscadorColegiados') == "true" && sessionStorage.getItem('buscadorColegiados')) {
      const { nombre, apellidos, nColegiado } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));

      this.usuarioBusquedaExpress.nombreAp = `${apellidos}, ${nombre}`;
      this.usuarioBusquedaExpress.numColegiado = nColegiado;
    }
    this.titulo = 'Datos Comunes';
    this.resaltadoDatos = true;
    //this.getComboTurno();
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
      this.getTurnosByColegiadoFecha();
    }else{
      this.filtro.diaGuardia = '';
    }
    
  }

  getTurnosByColegiadoFecha(){

    this.comboTurnos = [];
    this.filtro.idTurno = "";
    this.sigaServices.getParam("busquedaGuardias_getTurnosByColegiadoFecha", this.fillParams()).subscribe(
      n => {
        this.clear();
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
        console.log(err);
      }
    );

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
    this.sigaServices.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + this.filtro.idTurno).subscribe(
        data => {
          this.comboGuardias = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboGuardias);
        },
        err => {
          console.log(err);
        }
      );
  }

  //Crear servicio para traer tipos asistencia segun idtipoguardia e institución
  onChangeGuardia(){

    this.filtro.idTipoAsistenciaColegiado = '';
    this.filtro.idLetradoGuardia = '';
    this.usuarioBusquedaExpress.nombreAp = '';
    this.usuarioBusquedaExpress.numColegiado = '';
    this.comboTiposAsistencia = [];
    this.comboLetradosGuardia = [];
    this.sigaServices.getParam(
      "busquedaGuardias_getTiposAsistencia", "?idTurno=" + this.filtro.idTurno + "&idGuardia=" + this.filtro.idGuardia).subscribe(
        data => {
          
          this.comboTiposAsistencia = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboTiposAsistencia);
          //this.setDefaultValueOnComboTiposAsistencia();
          this.getDefaultTipoAsistenciaColegio();

        },
        err => {
          console.log(err);
        }
      );

      this.sigaServices.getParam(
        "busquedaGuardias_getLetradosGuardiaDia", "?idTurno=" + this.filtro.idTurno + "&idGuardia=" + this.filtro.idGuardia + "&guardiaDia="+this.filtro.diaGuardia).subscribe(
          data => {
            
            this.comboLetradosGuardia = data.combooItems;
            this.commonServices.arregloTildesCombo(this.comboLetradosGuardia);

            if(this.comboLetradosGuardia !== null
              && this.comboLetradosGuardia.length > 0){
                this.filtro.idLetradoGuardia = this.comboLetradosGuardia[0].value;
                this.onChangeLetradoGuardia();
              }
  
          },
          err => {
            console.log(err);
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
        console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboTurnos);
      }
    );
  }

  changeColegiado(event) {
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
  }

  onChangeLetradoGuardia(){

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
          console.log(err);
        }
      );

    }
  }

  onChangeSustitutoCheck() {
    this.filtro.isSustituto = !this.filtro.isSustituto;
  }

  styleObligatorio(evento){
    if(this.resaltadoDatos && (evento==undefined || evento==null || evento=="")){
      return this.commonServices.styleObligatorio(evento);
    }
  }
}
