import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { Message } from 'primeng/api';
import { ExpedienteItem } from '../../../../models/ExpedienteItem';
import { ParametroItem } from '../../../../models/ParametroItem';
import { ParametroRequestDto } from '../../../../models/ParametroRequestDto';
import { SigaStorageService } from '../../../../siga-storage.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-ficha-exp-exea-datos-generales',
  templateUrl: './ficha-exp-exea-datos-generales.component.html',
  styleUrls: ['./ficha-exp-exea-datos-generales.component.scss']
})
export class FichaExpExeaDatosGeneralesComponent implements OnInit, OnChanges {

  msgs : Message [] = [];
  progressSpinner : boolean = false;
  isLetrado = false;

  fechaInicio : Date;
  fechaRegistro : Date;

  @Input() expediente : ExpedienteItem;
  constructor(private sigaStorageService : SigaStorageService,
    private sigaServices : SigaServices) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.expediente.currentValue){
      if(this.sigaStorageService.isLetrado){
        this.fechaInicio = new Date(this.expediente.fechaApertura);
      }else{
        this.fechaInicio = moment(this.expediente.fechaApertura, 'dd/MM/yyyy hh:mm').toDate();
      }
      if(this.expediente.fechaRegistro){
        this.fechaRegistro = new Date(this.expediente.fechaRegistro);
      }
    }
  }

  ngOnInit() {
    this.isLetrado = this.sigaStorageService.isLetrado && this.sigaStorageService.idPersona;
  }

  tramitar(){
    let parametro = new ParametroRequestDto();
    parametro.idInstitucion = this.sigaStorageService.institucionActual;
    parametro.modulo = "EXEA";
    parametro.parametrosGenerales = "URL_EXEA";

    this.sigaServices.postPaginado("parametros_search", "?numPagina=1", parametro).subscribe(
      data => {
        let resp: ParametroItem[] = JSON.parse(data.body).parametrosItems;
        let url = resp.find(element => element.parametro == "URL_EXEA" && element.idInstitucion == element.idinstitucionActual);
        
        if(!url){
          url = resp.find(element => element.parametro == "URL_EXEA" && element.idInstitucion == '0');
        }

        if(url){
          window.open(url.valor + "selectAnActivity.do?numexp="+this.expediente.numExpediente, '_blank');
        }
      },
      err => {
        console.log(err);
      },
      () => {}
    );
  }


  showMessage(severityParam : string, summaryParam : string, detailParam : string) {
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
