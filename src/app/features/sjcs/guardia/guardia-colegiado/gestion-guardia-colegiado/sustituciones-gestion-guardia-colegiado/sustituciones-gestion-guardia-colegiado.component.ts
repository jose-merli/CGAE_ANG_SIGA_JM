import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { isRegExp } from 'util';
import { TranslateService } from '../../../../../../commons/translate';
import { GuardiaItem } from '../../../../../../models/sjcs/GuardiaItem';
import { SigaStorageService } from '../../../../../../siga-storage.service';
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
  esLetrado: boolean=true;
  esColegiado: boolean=true;
  constructor(private datepipe:DatePipe,private persistenceService: PersistenceService,
    private translateService: TranslateService,private sigaServices: SigaServices, private sigaStorageService: SigaStorageService, 
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.esLetrado = JSON.parse(sessionStorage.getItem('isLetrado'));
    //this.esColegiado = JSON.parse(sessionStorage.getItem('esColegiado'));
    sessionStorage.removeItem("volver");
    sessionStorage.removeItem("modoBusqueda");
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

  confirmSustituir(mover: boolean): Promise<void> {
    let icon = "fa fa-edit";
    //let mess = this.translateService.instant("messages.deleteConfirmation");
    let mess = mover ? this.translateService.instant("justiciaGratuita.guardiasColegiado.sustitucion.mensajeConfirmacionMover")
      : this.translateService.instant("justiciaGratuita.guardiasColegiado.sustitucion.mensajeConfirmacion");

    return new Promise((resolve1, reject1) => {
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: resolve1,
        reject: () => {
          this.showMessage("info", "Info", this.translateService.instant("general.message.accion.cancelada"));
          reject1();
        }
      });
    });
  }
  
  
  async sustituir() {
    if((this.newLetrado != undefined || this.newLetrado != null) && (this.fechaSustitucion != undefined || this.fechaSustitucion != null)) {
      if (this.salto && this.compensacion) {
        this.saltoOcompensacion = "S/C";
      } else if (this.salto && !this.compensacion) {
        this.saltoOcompensacion = "S";
      } else if (!this.salto&& this.compensacion) {
        this.saltoOcompensacion = "C";
      } else {
        this.saltoOcompensacion = "N";
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
        this.body.idCalendarioGuardias,
        this.body.fechahasta,
        !this.sigaStorageService.isLetrado
      ];

      try {
        this.progressSpinner = true;
        let [facturaciones, asistencias] = await Promise.all([
          this.existeFacturacionGuardiaColegiado(letradoSus),
          this.existeAsistenciasGuardiaColegiado(letradoSus)
        ]);
        this.progressSpinner = false;

        if (facturaciones) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.guardiasColegiado.sustitucion.errorEstaFacturada"));
          return;
        }

        if (asistencias && this.sigaStorageService.isLetrado) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.guardiasColegiado.sustitucion.errorTieneAsistencias"));
          return;
        } else {
          await this.confirmSustituir(asistencias);
        }
        
        await this.peticionSustituir(letradoSus);
      } catch (error) {
        this.progressSpinner = false;
        console.log("Sustitución de letrado interrumpida...");
      }
    }
  }

  existeFacturacionGuardiaColegiado(letradoSus) {
    return this.sigaServices.post("guardiasColegiado_existeFacturacionGuardiaColegiado", letradoSus).toPromise().then(
      n => {
        let error  = JSON.parse(n.body).error;
        let existeAsistencias = false;

        if (error.code == 200) {
          existeAsistencias = parseInt(JSON.parse(n.body).data) > 0;
          return Promise.resolve(existeAsistencias);
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description));
          return Promise.reject();
        }
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        return Promise.reject();
      }
    );
  }

  existeAsistenciasGuardiaColegiado(letradoSus) {
    return this.sigaServices.post("guardiasColegiado_existeAsistenciasGuardiaColegiado", letradoSus).toPromise().then(
      n => {
        let error  = JSON.parse(n.body).error;
        let existeAsistencias = false;

        if (error.code == 200) {
          existeAsistencias = parseInt(JSON.parse(n.body).data) > 0;
          return Promise.resolve(existeAsistencias);
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description));
          return Promise.reject();
        }
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        return Promise.reject();
      }
    );
  }

  peticionSustituir(letradoSus) {
    this.progressSpinner = true;
    return this.sigaServices.post("guardiasColegiado_sustituirGuardiaColeg", letradoSus).toPromise().then(
      n => {
        this.progressSpinner = false;
        let error  = JSON.parse(n.body).error;

        if (error.code == 200) {
          this.showMessage("success", this.translateService.instant("general.message.correct"), "Sustitucion del letrado realizada");
          this.modoLectura = true;
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description));
        }
        
        this.comensustitucion;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.modoLectura = false;
      }
    );
  }

    /*
    
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

      if (true) {

      }
        
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
            //console.log(err);
            this.progressSpinner = false;
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
            this.modoLectura = false;
          }
        );
        
    }else{
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
      
    }

    */
    

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
