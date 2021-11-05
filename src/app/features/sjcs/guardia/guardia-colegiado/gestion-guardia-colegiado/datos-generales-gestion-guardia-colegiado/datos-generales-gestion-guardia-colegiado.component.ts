import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '../../../../../../commons/translate';
import { GuardiaColegiadoItem } from '../../../../../../models/guardia/GuardiaColegiadoItem';
import { GuardiaItem } from '../../../../../../models/sjcs/GuardiaItem';
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
  campoFecha: Date;
  @Input()modificar
  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private translateService: TranslateService,) { }

  ngOnInit() {
    this.progressSpinner = true;
    if(this.modificar){
      if(this.persistenceService.getDatos()){
        this.body = this.persistenceService.getDatos();
        this.body.fechadesde = new Date(this.body.fechadesde);
        this.campoFecha = this.body.fechadesde;
      }
    }
    
    
    this.progressSpinner = false
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
          console.log(n);
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
    }else{
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), "Debe rellenar el campo de Motivo de Anulacion.");
    }
   
  }
  
  nuevaGuardia() {
    
    this.sigaServices.post("guardiasColegiado_insertGuardiaColeg", this.body).subscribe(
      n => {
        console.log(n);
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

  fillFechaGuardia(event){
    this.campoFecha = event
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

}
