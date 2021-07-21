import { DatePipe } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { Message } from 'primeng/api';
import { BusquedaColegiadoExpressComponent } from '../../../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.component';
import { TranslateService } from '../../../../../../commons/translate';
import { FiltroAsistenciaItem } from '../../../../../../models/guardia/FiltroAsistenciaItem';
import { PreAsistenciaItem } from '../../../../../../models/guardia/PreAsistenciaItem';
import { TarjetaAsistenciaItem } from '../../../../../../models/guardia/TarjetaAsistenciaItem';
import { SigaStorageService } from '../../../../../../siga-storage.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-ficha-asistencia-tarjeta-datos-generales',
  templateUrl: './ficha-asistencia-tarjeta-datos-generales.component.html',
  styleUrls: ['./ficha-asistencia-tarjeta-datos-generales.component.scss']
})
export class FichaAsistenciaTarjetaDatosGeneralesComponent implements OnInit {

  @Input() datos;
  @Output() refreshDatosGenerales = new EventEmitter<string>();
  msgs: Message[] = [];
  permisoEscritura : boolean;
  progressSpinner : boolean = false;
  asistencia : TarjetaAsistenciaItem = new TarjetaAsistenciaItem();
  isNuevaAsistencia : boolean = false;
  comboTurnos = [];
  comboGuardias = [];
  comboTipoAsistenciaColegio = [];
  comboLetradoGuardia = [];
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  saveDisabled : boolean = true;
  preasistencia : PreAsistenciaItem;
  comboEstadosAsistencia =[];

  @ViewChild(BusquedaColegiadoExpressComponent) busquedaColegiado: BusquedaColegiadoExpressComponent;
  constructor(private datepipe : DatePipe,
    private translateService : TranslateService,
    private sigaServices : SigaServices,
    private commonServices : CommonsService,
    private router : Router,
    private sigaStorageService : SigaStorageService) { }

  ngOnInit() {

    this.checkLastRoute();
    if (sessionStorage.getItem('esBuscadorColegiados') == "true" && sessionStorage.getItem('usuarioBusquedaExpress')) {
      this.usuarioBusquedaExpress = JSON.parse(sessionStorage.getItem('usuarioBusquedaExpress'));
    }

    this.preasistencia = JSON.parse(sessionStorage.getItem("preasistenciaItemLink"));
    if(this.preasistencia){
      this.isNuevaAsistencia = true;
      this.asistencia.fechaAsistencia = this.preasistencia.fechaLlamada;
      this.getTurnosByColegiadoFecha();
      this.asistencia.idTurno = this.preasistencia.idTurno;
      this.onChangeTurno();
      this.asistencia.idGuardia = this.preasistencia.idGuardia;
      this.onChangeGuardia();
      this.asistencia.fechaEstado = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
      this.asistencia.idSolicitudCentralita = this.preasistencia.idSolicitud;
      this.asistencia.filtro = new FiltroAsistenciaItem();
    }

    this.getComboEstadosAsistencia();

  }

  getComboTurnos(){
      this.sigaServices.get("combo_turnos").subscribe(
        n => {
          this.comboTurnos = n.combooItems;
        },
        err => {
          console.log(err);
  
        }, () => {
          this.commonServices.arregloTildesCombo(this.comboTurnos);
        }
      );
  }

  getComboEstadosAsistencia(){
    this.sigaServices.get("combo_estadosAsistencia").subscribe(
      n => {
        this.comboEstadosAsistencia = n.combooItems;
        this.asistencia.estado = this.comboEstadosAsistencia[0].value;
      },
      err => {
        console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboEstadosAsistencia);
      }
    );
}

  getDefaultTipoAsistenciaColegio(){
    this.sigaServices.get("busquedaGuardias_getDefaultTipoAsistenciaColegio").subscribe(
      n => {
        if(n && n.valor){
          this.asistencia.idTipoAsistenciaColegio = n.valor;
        }
      },
      err => {
        console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboTurnos);
      }
    );
  }

  onChangeTurno(){

    this.asistencia.idGuardia = '';

    //Si tenemos seleccionado un turno, cargamos las guardias correspondientes
    if(this.asistencia.idTurno){

        this.sigaServices.getParam("combo_guardiaPorTurno","?idTurno="+this.asistencia.idTurno).subscribe(
          n => {
            this.comboGuardias = n.combooItems;
          },
          err => {
            console.log(err);
    
          }, () => {
            this.commonServices.arregloTildesCombo(this.comboGuardias);
          }
      );

    }
  }

  onChangeGuardia(){

    if(this.asistencia.idTurno && this.asistencia.idGuardia){
      this.sigaServices.getParam(
        "busquedaGuardias_getTiposAsistencia", "?idTurno=" + this.asistencia.idTurno + "&idGuardia=" + this.asistencia.idGuardia).subscribe(
          data => {
            
            this.comboTipoAsistenciaColegio = data.combooItems;
            
            this.setDefaultValueOnComboTiposAsistencia();

            this.getDefaultTipoAsistenciaColegio();

          },
          err => {
            console.log(err);
          },
          () => {
            this.commonServices.arregloTildesCombo(this.comboTipoAsistenciaColegio);
          }
        );

        this.sigaServices.getParam(
          "busquedaGuardias_getLetradosGuardiaDia", "?idTurno=" + this.asistencia.idTurno + "&idGuardia=" + this.asistencia.idGuardia + "&guardiaDia="+this.asistencia.fechaAsistencia).subscribe(
            data => {
              
              this.comboLetradoGuardia = data.combooItems;
              this.commonServices.arregloTildesCombo(this.comboLetradoGuardia);
  
              if(this.comboLetradoGuardia !== null
                && this.comboLetradoGuardia.length > 0){
                  this.asistencia.idLetradoGuardia = this.comboLetradoGuardia[0].value;
                  this.onChangeLetradoGuardia();
                }
    
            },
            err => {
              console.log(err);
            }
          );
    }
  }

  onChangeLetradoGuardia(){

    if(this.asistencia.idLetradoGuardia){

      this.sigaServices
      .post("busquedaPer", this.asistencia.idLetradoGuardia)
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


   //Setea el valor por defecto del combo
   setDefaultValueOnComboTiposAsistencia(){

    this.comboTipoAsistenciaColegio.forEach(comboItem => {
      
      
      if(comboItem.value.charAt(comboItem.value.length - 1) === '1'){
        comboItem.value = comboItem.value.slice(0,comboItem.value.length - 1);
        this.asistencia.idTipoAsistenciaColegio = comboItem.value;
      }else{
        comboItem.value = comboItem.value.slice(0,comboItem.value.length - 1);
      }

    });

  }

  getTurnosByColegiadoFecha(){

    this.comboTurnos = [];
    this.asistencia.idTurno = "";
    this.sigaServices.getParam("busquedaGuardias_getTurnosByColegiadoFecha", this.fillParams()).subscribe(
      n => {
        this.clear();
        if(n.error !== null
          && n.error.code === 500){
          this.showMsg("error", "Error", n.error.description.toString());
          this.saveDisabled = true;
        }else if(n.error !== null
          && n.error.code === 200){
          this.showMsg("error", "No hay guardias", this.translateService.instant(n.error.description.toString()));
          this.saveDisabled = true;
        }else{
          this.saveDisabled = false;
          this.comboTurnos = n.combooItems;
          this.commonServices.arregloTildesCombo(this.comboTurnos);
        }
      },
      err => {
        console.log(err);
      }
    );

  }

  fillFechaAsistencia(event){
    this.asistencia.fechaAsistencia = this.datepipe.transform(new Date(event), 'dd/MM/yyyy HH:mm');
    this.getTurnosByColegiadoFecha();
  }

  fillFechaSolicitud(event){
    this.asistencia.fechaSolicitud = this.datepipe.transform(new Date(event), 'dd/MM/yyyy HH:mm');
  }

  fillFechaEstado(event){
    this.asistencia.fechaEstado = this.datepipe.transform(new Date(event), 'dd/MM/yyyy');
  }

  fillFechaCierre(event){
    this.asistencia.fechaCierre = this.datepipe.transform(new Date(event), 'dd/MM/yyyy');
  }

  styleObligatorio(evento){
    if((evento==undefined || evento==null || evento=="")){
      return this.commonServices.styleObligatorio(evento);
    }
  }

  clear() {
    this.msgs = [];
  }

  showMsg(severityParam : string, summaryParam : string, detailParam : string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }

  changeColegiado(event) {
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
    this.asistencia.numeroColegiado = this.usuarioBusquedaExpress.numColegiado;
    this.asistencia.nombreColegiado = this.usuarioBusquedaExpress.nombreAp;
  }

  checkLastRoute() {

    this.router.events
      .filter(e => e instanceof RoutesRecognized)
      .pairwise()
      .subscribe((event: any[]) => {
        if (event[0].urlAfterRedirects == "/pantallaBuscadorColegiados") {
          sessionStorage.setItem("esBuscadorColegiados", "true");
        } else {
          sessionStorage.setItem("esBuscadorColegiados", "false");
        }
      });
  }

  fillParams(){
    let parametros = '?guardiaDia=' + this.asistencia.fechaAsistencia;
      
    if(this.asistencia.idLetradoGuardia !== null
        && this.asistencia.idLetradoGuardia !== undefined
        && this.sigaStorageService.isLetrado){
        
        parametros += "&idPersona="+this.asistencia.idLetradoGuardia;

    }

    return parametros;
  }
  
  resetDatosGenerales(){
    this.asistencia.fechaAsistencia = '';
    this.asistencia.fechaCierre = '';
    this.asistencia.fechaEstado = '';
    this.asistencia.fechaSolicitud = '';
    this.asistencia.idLetradoGuardia = '';
    this.asistencia.idTipoAsistenciaColegio = '';
    this.comboGuardias = [];
    this.comboTurnos = [];
    this.comboLetradoGuardia = [];
    this.comboTipoAsistenciaColegio = [];
    this.asistencia.idTurno = '';
    this.asistencia.idGuardia = '';
    this.asistencia.nombreColegiado = '';
    this.asistencia.numeroColegiado = '';
    this.asistencia.estado = '';
    this.usuarioBusquedaExpress.nombreAp = '';
    this.usuarioBusquedaExpress.numColegiado = '';
  }

  saveAsistencia(){

    if(this.checkDatosObligatorios()){
      this.progressSpinner = true
      let asistencias : TarjetaAsistenciaItem[] = [this.asistencia];
      this.sigaServices
      .post("busquedaGuardias_guardarAsistenciasDatosGenerales", asistencias)
      .subscribe(
        n => {
          let result = JSON.parse(n["body"]);
          if(result.error){
            this.showMsg('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          }else{
            this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
            if(this.preasistencia){
              sessionStorage.setItem("creadaFromPreasistencia", "true");
            }
            this.refreshDatosGenerales.emit(result.id);
          }
          
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
      
    }else{
      this.showMsg('error',this.translateService.instant('general.message.camposObligatorios'),'');
    }

  }

  checkDatosObligatorios(){

    let ok : boolean = true;

    if(!this.asistencia.idGuardia
      || !this.asistencia.idTurno
      || !this.asistencia.fechaAsistencia
      || !this.asistencia.idTipoAsistenciaColegio
      || !this.asistencia.idLetradoGuardia){

        ok = false;

      }

    return ok;
  }

}
