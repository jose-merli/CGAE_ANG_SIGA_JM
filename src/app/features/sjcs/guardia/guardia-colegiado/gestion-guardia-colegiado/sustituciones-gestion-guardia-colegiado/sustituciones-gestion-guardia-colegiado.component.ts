import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  newCol = new GuardiaItem();
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: '',
    idPersona:'',
  };
  modoLectura:boolean;
  fechaSustitucion: Date;
  salto;
  compensacion;
  comensustitucion;
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
      this.newCol.idPersona = this.usuarioBusquedaExpress.idPersona;
      this.fechaSustitucion = new Date();
      this.newCol.fechasustitucion = this.fechaSustitucion;
    }
  }

  clear(){
    this.msgs = "";
  }
  sustituir(){
    this.modoLectura = true;
    
    this.newCol.idTurno = this.body.idTurno;
    this.newCol.idGuardia = this.body.idGuardia;
    this.newCol.fechadesde = this.body.fechadesde;
    
    this.newCol.sustituto = "1";
    this.newCol.letradosustituido = this.body.idPersona;
    this.newCol.comensustitucion = this.comensustitucion;

    //this.salto;
    //this.compensacion;
    this.sigaServices.post("guardiasColegiado_sustituirGuardiaColeg", this.newCol).subscribe(
      n => {
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.body.observacionesAnulacion = "";
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  fillFechaSustitucion(event){
    this.fechaSustitucion = event
  }

  changeColegiado(event){
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
    this.usuarioBusquedaExpress.idPersona = event.idPersona;
    this.newCol.numColegiado = this.usuarioBusquedaExpress.idPersona;
    this.fechaSustitucion = new Date()
    this.newCol.fechasustitucion = this.fechaSustitucion;
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
  onChangeCheckSalto(event){}
  onChangeCheckCompensacion(event){}

}
