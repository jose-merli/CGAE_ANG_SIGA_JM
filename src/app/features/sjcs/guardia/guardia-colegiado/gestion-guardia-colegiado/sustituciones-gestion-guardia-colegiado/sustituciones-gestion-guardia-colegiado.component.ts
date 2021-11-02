import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { isRegExp } from 'util';
import { TranslateService } from '../../../../../../commons/translate';
import { GuardiaItem } from '../../../../../../models/sjcs/GuardiaItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-sustituciones-gestion-guardia-colegiado',
  templateUrl: './sustituciones-gestion-guardia-colegiado.component.html',
  styleUrls: ['./sustituciones-gestion-guardia-colegiado.component.scss']
})
export class SustitucionesGestionGuardiaColegiadoComponent implements OnInit {

  progressSpinner;
  msgs
  body = new GuardiaItem();
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: '',
    idPersona:'',
  };
  modoLectura:boolean;
  fechaSustitucion: Date;
  salto:boolean = false;
  compensacion:boolean = false;
  comensustitucion = "";
  newLetrado;
  saltoOcompensacion;
  constructor(private datepipe:DatePipe,private persistenceService: PersistenceService,
    private translateService: TranslateService,private sigaServices: SigaServices) { }

  ngOnInit() {
    if(this.persistenceService.getDatos()){
      this.body = this.persistenceService.getDatos();
    }
    if (sessionStorage.getItem("buscadorColegiados")) {
      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));
      sessionStorage.removeItem("buscadorColegiados");

      this.usuarioBusquedaExpress.nombreAp = busquedaColegiado.nombre + " " + busquedaColegiado.apellidos;
      this.usuarioBusquedaExpress.numColegiado = busquedaColegiado.nColegiado;
      this.usuarioBusquedaExpress.idPersona = busquedaColegiado.idPersona;
      this.newLetrado = this.usuarioBusquedaExpress.idPersona;
      this.fechaSustitucion = new Date();
    }
  }

  
  sustituir(){
    
    if((this.newLetrado != undefined || this.newLetrado != null) && (this.fechaSustitucion != undefined || this.fechaSustitucion != null) ){
      if(this.salto == true && this.compensacion == true){
        this.saltoOcompensacion = "S/C";
      }else if(this.salto == true && this.compensacion == false){
        this.saltoOcompensacion = "S"
      }else if(this.salto == false && this.compensacion == true){
        this.saltoOcompensacion = "C"
      }else{
        this.saltoOcompensacion = "N"
      }
      let letradoSus = [
        this.body.idTurno,
        this.body.idGuardia,
        this.body.fechadesde,
        this.body.idPersona,
        //datos para el sustituto
        this.newLetrado,
        this.fechaSustitucion.getTime(),
        this.comensustitucion,
        this.saltoOcompensacion,
        this.body.idCalendarioGuardias
        ]

        console.log(letradoSus)
    this.progressSpinner = true;
         this.sigaServices.post("guardiasColegiado_sustituirGuardiaColeg", letradoSus).subscribe(
          n => {
            this.progressSpinner = false;
            let error  = JSON.parse(n.body).error

            if(error.code == 200){
              this.showMessage("success", this.translateService.instant("general.message.correct"), "Sustitucion del letrado realizada");
              this.modoLectura = true;
            }else{
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description));
              
            }
            
            this.comensustitucion;
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
            this.modoLectura = false;
          }
        );
        
    }else{
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
      
    }

    
  }

  fillFechaSustitucion(event){
    this.fechaSustitucion = event
  }

  changeColegiado(event){
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
    //busqueda del colegiado
    this.progressSpinner = true
    this.sigaServices.getParam("componenteGeneralJG_busquedaColegiado", "?colegiadoJGItem=" + event.nColegiado).subscribe(
      data => {
        

        if (data.colegiadoJGItem.length == 1) {
          
          this.usuarioBusquedaExpress.idPersona = data.colegiadoJGItem[0].idPersona;
          this.newLetrado = this.usuarioBusquedaExpress.idPersona;
        } else {
          
          this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("general.message.colegiadoNoEncontrado"));
        }
        this.progressSpinner = false;
      },
      error => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
    
    this.fechaSustitucion = new Date()
  }
  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);
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
    this.msgs = [];
  }
  onChangeCheckSalto(event){
    this.salto = event
  }
  onChangeCheckCompensacion(event){
    this.compensacion = event
  }

}
