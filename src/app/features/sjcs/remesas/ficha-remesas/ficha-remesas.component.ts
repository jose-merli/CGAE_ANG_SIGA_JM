import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { TarjetaDatosGeneralesComponent } from './tarjeta-datos-generales/tarjeta-datos-generales.component';

@Component({
  selector: 'app-ficha-remesas',
  templateUrl: './ficha-remesas.component.html',
  styleUrls: ['./ficha-remesas.component.scss']
})
export class FichaRemesasComponent implements OnInit {

  @ViewChild(TarjetaDatosGeneralesComponent) tarjetaDatosGenerales: TarjetaDatosGeneralesComponent;
  progressSpinner: boolean = false;
  remesaItem;
  msgs;

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService, 
    private commonsServices: CommonsService,
    private translateService: TranslateService) { }

  ngOnInit() {
  }

  save() {
    if (this.tarjetaDatosGenerales.remesaTabla != null) {
      this.remesaItem = {
        'idRemesa': this.tarjetaDatosGenerales.remesaTabla[0].idRemesa,
        'descripcion': this.tarjetaDatosGenerales.remesaTabla[0].descripcion
      };
    } else if (this.tarjetaDatosGenerales.remesaItem != null) {
      this.remesaItem = {
        'descripcion': this.tarjetaDatosGenerales.remesaItem.descripcion,
        'numero': this.tarjetaDatosGenerales.remesaItem.numero
      };
    }

    this.progressSpinner = true;
   
       this.sigaServices.post("ficharemesas_guardarRemesa", this.remesaItem).subscribe(
        data => {
          this.showMessage("success", this.translateService.instant("general.message.correct"), JSON.parse(data.body).error.description);
          this.progressSpinner = false;
        },
        err => {
          if (err != undefined && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
          this.progressSpinner = false;
        },
       );
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

}
