import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ZonasItem } from '../../../../../../models/sjcs/ZonasItem';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';

@Component({
  selector: 'app-grupo-zona',
  templateUrl: './grupo-zona.component.html',
  styleUrls: ['./grupo-zona.component.scss']
})
export class GrupoZonaComponent implements OnInit {

  body: ZonasItem = new ZonasItem();
  bodyInicial;
  progressSpinner: boolean = false;
  modoEdicion: boolean = false;
  msgs;

  historico: boolean = false;

  @Output() modoEdicionSend = new EventEmitter<any>();

  //Resultados de la busqueda
  @Input() idZona;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService) { }

  ngOnInit() {


    if (this.idZona != undefined) {
      this.getGrupoZona();
      this.modoEdicion = true;
    } else {
      this.modoEdicion = false;
    }

  }

  getGrupoZona() {
    this.progressSpinner = true;

    this.sigaServices
      .getParam("fichaZonas_searchGroupZone", "?idZona=" + this.idZona)
      .subscribe(
        n => {
          this.body = n;
          this.validateHistorical();

          this.bodyInicial = JSON.parse(JSON.stringify(this.body));
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
        }
      );
  }

  rest() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }

  validateHistorical() {
    if (this.body != undefined) {

      if (this.body.fechabaja != null) {
        this.historico = true;
      } else {
        this.historico = false;
      }

    }
  }

  save() {
    this.progressSpinner = true;
    let url = "";

    if (!this.modoEdicion) {
      url = "fichaZonas_createGroupZone";
      this.callSaveService(url);

    } else {
      url = "fichaZonas_updateGroupZone";
      this.callSaveService(url);
    }

  }

  callSaveService(url) {

    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (!this.modoEdicion) {
          this.modoEdicion = true;
          this.idZona = JSON.parse(data.body).id;
          let send = {
            modoEdicion: this.modoEdicion,
            idZona: this.idZona
          }
          this.modoEdicionSend.emit(send);
        }

        this.bodyInicial = JSON.parse(JSON.stringify(this.body));

        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {

        if (err.error != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );

  }

  clear() {
    this.msgs = [];
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  disabledSave() {
    if (!this.historico && (this.body.descripcionzona != "" && this.body.descripcionzona != undefined && this.body.descripcionzona != null)) {
      return false;
    } else {
      return true;
    }
  }
}
