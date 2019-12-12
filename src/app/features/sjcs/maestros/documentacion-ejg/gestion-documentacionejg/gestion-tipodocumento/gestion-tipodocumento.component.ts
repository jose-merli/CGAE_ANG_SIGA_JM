import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { DocumentacionEjgItem } from '../../../../../../models/sjcs/DocumentacionEjgItem';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../../_services/commons.service';

@Component({
  selector: 'app-gestion-tipodocumento',
  templateUrl: './gestion-tipodocumento.component.html',
  styleUrls: ['./gestion-tipodocumento.component.scss']
})
export class GestionTipodocumentoComponent implements OnInit {

  openFicha: boolean = true;
  body: DocumentacionEjgItem = new DocumentacionEjgItem();
  bodyInicial;
  progressSpinner: boolean = false;
  modoEdicion: boolean = false;
  historico: boolean = false;
  permisos;
  msgs;
  nuevo;
  showTarjeta: boolean = true;
  @Output() modoEdicionSend = new EventEmitter<any>();

  //Resultados de la busqueda
  @Input() documentacionEjgItem: DocumentacionEjgItem;


  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService) { }

  ngOnChanges(changes: SimpleChanges) {

    this.permisos = this.persistenceService.getPermisos();
    if (this.documentacionEjgItem != undefined) {
      this.body = this.documentacionEjgItem;
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    } else {

      this.nuevo = true;
      this.documentacionEjgItem = new DocumentacionEjgItem();
    }
    // if (!this.permisos) {
    //   this.modoEdicion = false;
    // } else {
    //   this.modoEdicion = true;
    // }

    this.historico = this.persistenceService.getHistorico();

    if (this.persistenceService.getHistorico()) {
      this.modoEdicion = false;
    }

  }

  ngOnInit() {
    // this.permisos = this.persistenceService.clearDatos();
    // if (this.documentacionEjgItem != undefined) {
    //   this.body = this.documentacionEjgItem;
    //  this.bodyInicial = JSON.parse(JSON.stringify(this.documentacionEjgItem));
    // } else {
    //   this.documentacionEjgItem = new DocumentacionEjgItem();
    // }
    // if (!this.permisos) {
    //   this.modoEdicion = false;
    // } else {
    //   this.modoEdicion = true;
    // }
  }

  checkPermisosRest() {
    let msg = this.commonsService.checkPermisos(this.permisos, this.historico);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.rest();
    }
  }

  rest() {
    if (this.bodyInicial != undefined) this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    else {
      this.body = new DocumentacionEjgItem();
    }
  }

  checkPermisosSave() {
    let msg = this.commonsService.checkPermisos(this.permisos, this.historico);

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
    if (this.nuevo) {
      url = "gestionDocumentacionEjg_createTipoDoc";
      this.callSaveService(url);

    } else {

      url = "gestionDocumentacionEjg_updateTipoDoc";
      this.callSaveService(url);
    }

  }

  callSaveService(url) {
    if (this.body.abreviaturaTipoDoc != undefined) this.body.abreviaturaTipoDoc = this.body.abreviaturaTipoDoc.trim();
    if (this.body.descripcionTipoDoc != undefined) this.body.descripcionTipoDoc = this.body.descripcionTipoDoc.trim();
    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (this.nuevo) {
          this.nuevo = false;
          this.modoEdicion = true;
          let tipodocs = JSON.parse(data.body);
          // this.areasItem = JSON.parse(data.body);
          this.body.idTipoDocumento = tipodocs.id;
          let send = {
            modoEdicion: this.modoEdicion,
            idTipoDoc: this.body.idTipoDocumento
          }
          this.modoEdicionSend.emit(send);
        }

        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        this.persistenceService.setDatos(this.body);
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {

        if (JSON.parse(err.error).error.description != "") {
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

    if (this.body.abreviaturaTipoDoc != undefined && this.body.descripcionTipoDoc != undefined && ((JSON.stringify(this.body) != JSON.stringify(this.bodyInicial)))) {
      if (this.body.abreviaturaTipoDoc.trim() != "" && this.body.descripcionTipoDoc.trim() != "") {
        return false;
      } else { return true; }
    } else {
      return true;
    }
  }
  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }
  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

}
