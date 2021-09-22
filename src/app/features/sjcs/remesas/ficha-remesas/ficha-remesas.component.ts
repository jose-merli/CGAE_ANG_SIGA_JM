import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { RemesasItem } from '../../../../models/sjcs/RemesasItem';
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
  remesa;
  msgs;
  item;
  remesaTabla;
  remesaItem: RemesasItem = new RemesasItem();

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsServices: CommonsService,
    private translateService: TranslateService) { }

  ngOnInit() {
    if(localStorage.getItem('ficha') == "registro"){
      this.item = localStorage.getItem('remesaItem');
      console.log("Item -> ", this.item);
      localStorage.removeItem('remesaItem');
      this.remesaTabla = JSON.parse(this.item);
      console.log("Item en JSON -> ", this.remesaTabla);
    }else if(localStorage.getItem('ficha') == "nuevo"){
      this.remesaItem.descripcion = "";
    }
    localStorage.removeItem('ficha');
  }

  save() {
    if (this.tarjetaDatosGenerales.remesaTabla != null) {
      this.remesa = {
        'idRemesa': this.tarjetaDatosGenerales.remesaTabla[0].idRemesa,
        'descripcion': this.tarjetaDatosGenerales.remesaTabla[0].descripcion
      };
    } else if (this.tarjetaDatosGenerales.remesaItem != null) {
      this.remesa = {
        'idRemesa': 0,
        'descripcion': this.tarjetaDatosGenerales.remesaItem.descripcion,
        'numero': this.tarjetaDatosGenerales.remesaItem.numero
      };
    }

    this.progressSpinner = true;

    this.sigaServices.post("ficharemesas_guardarRemesa", this.remesa).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), JSON.parse(data.body).error.description);
        this.remesa.idRemesa = JSON.parse(data.body).id;
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
      () => {
        this.tarjetaDatosGenerales.listadoEstadosRemesa(this.remesa);
        this.progressSpinner = false;
      }
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
