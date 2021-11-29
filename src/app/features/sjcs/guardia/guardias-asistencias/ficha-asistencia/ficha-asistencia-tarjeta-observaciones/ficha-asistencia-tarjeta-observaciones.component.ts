import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../../../commons/translate';
import { TarjetaObservacionesItem } from '../../../../../../models/guardia/TarjetaObservacionesItem';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-ficha-asistencia-tarjeta-observaciones',
  templateUrl: './ficha-asistencia-tarjeta-observaciones.component.html',
  styleUrls: ['./ficha-asistencia-tarjeta-observaciones.component.scss']
})
export class FichaAsistenciaTarjetaObservacionesComponent implements OnInit {

  msgs : Message [] = [];
  @Input() idAsistencia : string;
  @Input() editable : boolean;
  tarjetaObservacionesItem : TarjetaObservacionesItem = new TarjetaObservacionesItem();
  tarjetaObservacionesItemAux : TarjetaObservacionesItem = new TarjetaObservacionesItem();
  progressSpinner : boolean = false;

  constructor(private sigaServices : SigaServices,
    private translateService : TranslateService) { }

  ngOnInit() {
    if(this.idAsistencia){
      this.getTarjetaObservaciones();
    }
  }

  getTarjetaObservaciones(){

    this.progressSpinner = true;
      this.sigaServices.getParam("busquedaGuardias_searchTarjetaObservaciones","?anioNumero="+this.idAsistencia).subscribe(
        n => {
          this.tarjetaObservacionesItem = n.tarjetaObservacionesItems[0];
          this.tarjetaObservacionesItemAux = Object.assign({},this.tarjetaObservacionesItem);
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }, () => {
          this.progressSpinner = false;
        }
      );

  }

  saveTarjetaObservaciones(){

    if(this.idAsistencia){
      this.progressSpinner = true;
      this.sigaServices.postPaginado("busquedaGuardias_guardarTarjetaObservaciones","?anioNumero="+this.idAsistencia, this.tarjetaObservacionesItem).subscribe(
        n => {

          let id = JSON.parse(n.body).id;
          let error = JSON.parse(n.body).error;
          this.progressSpinner = false;

          if (error != null && error.description != null) {
            this.showMsg("info", this.translateService.instant("general.message.informacion"), error.description);
          } else {
            this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
            this.tarjetaObservacionesItemAux = Object.assign({},this.tarjetaObservacionesItem);
          }
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }, () => {
          this.progressSpinner = false;
        }
      );
    }

  }

  restablecer(){

    if(!this.idAsistencia){
      this.tarjetaObservacionesItem = new TarjetaObservacionesItem();
      this.tarjetaObservacionesItemAux = new TarjetaObservacionesItem();
    }else{
      this.tarjetaObservacionesItem = Object.assign({},this.tarjetaObservacionesItemAux);
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

}
