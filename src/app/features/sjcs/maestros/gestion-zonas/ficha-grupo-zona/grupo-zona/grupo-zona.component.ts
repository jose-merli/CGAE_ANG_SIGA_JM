import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ZonasItem } from '../../../../../../models/sjcs/ZonasItem';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../../_services/commons.service';

@Component({
  selector: 'app-grupo-zona',
  templateUrl: './grupo-zona.component.html',
  styleUrls: ['./grupo-zona.component.scss']
})
export class GrupoZonaComponent implements OnInit {

  body: ZonasItem = new ZonasItem();
  bodyInicial;
  nuevo;
  progressSpinner: boolean = false;
  modoEdicion: boolean = false;
  msgs;

  historico: boolean = false;
  permisoEscritura: boolean = true;

  @Output() modoEdicionSend = new EventEmitter<any>();

  //Resultados de la busqueda
  @Input() idZona;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService,
    private persistenceService: PersistenceService, private commonsService: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos()
    }

    if (this.idZona != undefined) {
      this.getGrupoZona();
      this.nuevo = false;
      this.modoEdicion = true;
    } else {
      this.nuevo = true;
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

          this.sigaServices.notifysendFechaBaja(this.body.fechabaja);
          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
        }
      );
  }

  checkPermisosRest() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.historico);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.rest();
    }
  }

  rest() {
    if (this.bodyInicial != undefined)
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

  checkPermisosSave() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.historico);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.disabledSave()) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.save();
      }
    }
  }

  save() {
    this.progressSpinner = true;
    let url = "";

    if (!this.modoEdicion) {
      url = "fichaZonas_createGroupZone";
      this.body.descripcionzona = this.body.descripcionzona.trim();
      this.callSaveService(url);

    } else {
      url = "fichaZonas_updateGroupZone";
      this.body.descripcionzona = this.body.descripcionzona.trim();
      this.body.idzona = this.idZona;
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

    if (this.nuevo) {
      if ((this.body.descripcionzona != undefined && this.body.descripcionzona.trim() != "") && (JSON.stringify(this.bodyInicial) != JSON.stringify(this.body))) {
        return false;
      } else {
        return true;
      }
    } else {

      if (!this.historico && (this.body.descripcionzona != undefined && this.body.descripcionzona.trim() != ""))
        if ((JSON.stringify(this.body.descripcionzona.trim()) != JSON.stringify(this.bodyInicial.descripcionzona.trim()))) {
          return false;
        } else {
          return true;
        }
      return true;
    }
  }
}
