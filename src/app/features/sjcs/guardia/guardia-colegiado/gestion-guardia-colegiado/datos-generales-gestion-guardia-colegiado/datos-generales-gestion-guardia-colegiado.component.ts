import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '../../../../../../commons/translate';
import { GuardiaColegiadoItem } from '../../../../../../models/guardia/GuardiaColegiadoItem';
import { GuardiaItem } from '../../../../../../models/sjcs/GuardiaItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-datos-generales-gestion-guardia-colegiado',
  templateUrl: './datos-generales-gestion-guardia-colegiado.component.html',
  styleUrls: ['./datos-generales-gestion-guardia-colegiado.component.scss']
})
export class DatosGeneralesGestionGuardiaColegiadoComponent implements OnInit {
  progressSpinner;
  msgs
  body:GuardiaItem;
  campoFechaIni: Date;
  campoFechaFin: Date;
  fechasDisponibles = [];
  fechas: String[] = [];
  @Input() modificar:boolean = false;
  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService,
    private datepipe: DatePipe,
    private translateService: TranslateService,) { }

  ngOnInit() {
   // this.body.observacionesAnulacion = "";
    //this.progressSpinner = true;
  
    if (this.persistenceService.getDatos() || this.persistenceService.getDatosColeg()) {
      this.body = this.persistenceService.getDatosColeg() ? this.persistenceService.getDatosColeg() : this.persistenceService.getDatos();

        this.body.fechadesde = this.body.fechadesde.toString().length > 10 ? new Date(this.body.fechadesde) : this.body.fechadesde;
        this.body.fechahasta = this.body.fechahasta.toString().length > 10 ? new Date(this.body.fechahasta) : this.body.fechahasta;
        this.campoFechaIni = this.body.fechadesde;
        this.campoFechaFin = this.body.fechahasta;
      }
    
    if(!this.modificar){
      this.getFechas()
    }else{
      this.getDias();
    }
    
    this.progressSpinner = false
  }

  getDias(){
    this.fechasDisponibles = [];
    //this.progressSpinner = true;
    this.sigaServices.getParam("guardiasColegiado_fechasDiasGuardias", this.fillParams2()).subscribe(
      n => {
        this.clear();
        this.progressSpinner = false;

        if(n.error !== null
          && n.error.code === 500){
          this.showMsg("error", "Error", n.error.description.toString());
        }else{

          this.fechas = n.combooItems;
          console.log(this.fechas);
          //this.commonServices.arregloTildesCombo(this.fechasDisponibles);
        }
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    );
  }

  showMsg(severityParam: string, summaryParam: string, detailParam: string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }
  
  fillParams() {
    let parametros = '?fechaIni=' + this.body.fechadesde + "&fechaFin=" + this.body.fechahasta + "&idTurno=" + this.body.idTurno + "&idGuardia=" + this.body.idGuardia;
    return parametros;
  }

  fillParams2() {
    console.log("FECHA DESDE: " + this.body.fechadesde);
    console.log("FECHA HASTA: " + this.body.fechahasta);
    let parametros = '?fechaIni=' + this.formatDate2(this.body.fechadesde) + "&fechaFin=" + this.formatDate2(this.body.fechahasta) + "&idTurno=" + this.body.idTurno + "&idGuardia=" + this.body.idGuardia;
    return parametros;
  }

  getFechas(){

    this.fechasDisponibles = [];
    //this.progressSpinner = true;
    this.sigaServices.getParam("guardiasColegiado_fechasDisponibles", this.fillParams()).subscribe(
      n => {
        this.clear();
        this.progressSpinner = false;

        if(n.error !== null
          && n.error.code === 500){
          this.showMsg("error", "Error", n.error.description.toString());
        }else{

          this.fechasDisponibles = n.combooItems;
          this.commonServices.arregloTildesCombo(this.fechasDisponibles);
        }
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    );
  }

  save(){
    if(!this.modificar){
      this.nuevaGuardia();
    }else{
      this.editaGuardia();
    }
  }
  editaGuardia() {
    this.progressSpinner = true
    if(this.body.observacionesAnulacion != undefined || this.body.observacionesAnulacion != ''){
      this.sigaServices.post("guardiasColegiado_updateGuardiaColeg", this.body).subscribe(
        n => {
          //console.log(n);
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );
    }else{
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), "Debe rellenar el campo de Motivo de Anulacion.");
    }
   
  }

  formatDate2(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);
  }
  
  nuevaGuardia() {

    let itemNuevo:GuardiaItem = this.body
    itemNuevo.fechadesde = new Date(itemNuevo.fechadesde)
    itemNuevo.fechahasta = new Date(itemNuevo.fechahasta)
    this.sigaServices.post("guardiasColegiado_insertGuardiaColeg",itemNuevo).subscribe(
      n => {
        //console.log(n);
        let des:string = JSON.parse(n.body).error.description;
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.body.observacionesAnulacion = "";
        this.campoFechaFin =  new Date(parseFloat(des.split("/")[1]))
        this.campoFechaIni =  new Date(parseFloat(des.split("/")[0]))
        this.modificar = true;
        this.getDias();
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  fillFechaGuardiaIni(event){
    this.campoFechaIni = event
  }

  fillFechaGuardiaFin(event){
    this.campoFechaFin = event
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear(){
    this.msgs = "";
  }

  refrescarFchPermuta(){
    //Refrescar la fecha de la permuta
    let fechaInic : number = parseInt(sessionStorage.getItem("fechainicioConfirmador"));
    let fechaFinC : number = parseInt(sessionStorage.getItem("fechafinConfirmador"));
    sessionStorage.removeItem("fechainicioConfirmador");
    sessionStorage.removeItem("fechafinConfirmador");
    this.campoFechaIni = new Date(fechaInic);
    this.campoFechaFin = new Date(fechaFinC);
  }

}
