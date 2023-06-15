import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { FundamentoResolucionItem } from '../../../../../../../models/sjcs/FundamentoResolucionItem';
import { TranslateService } from '../../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../../../_services/commons.service';

@Component({
  selector: 'app-datos-generales-fundamentos',
  templateUrl: './datos-generales-fundamentos.component.html',
  styleUrls: ['./datos-generales-fundamentos.component.scss']
})
export class DatosGeneralesFundamentosComponent implements OnInit {

  openFicha: boolean = true
  historico: boolean = false;
  permisoEscritura: boolean = true;
  resoluciones;
  bodyInicial;
  progressSpinner: boolean = false;
  showTarjeta: boolean = true;

  idFundamento;
  msgs;

  @Input() body;
  @Input() modoEdicion;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService,
    private persistenceService: PersistenceService, private commonsService: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    this.getComboResoluciones();
  }

  ngOnChanges(changes: SimpleChanges) {

    this.validateHistorical();

    if (this.body != undefined) {
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }
  }


  getComboResoluciones() {
    this.progressSpinner = true;
    this.sigaServices.get("gestionFundamentosResolucion_getResoluciones").subscribe(
      n => {
        this.resoluciones = n.combooItems;
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    );
  }

  checkPermisosSave() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.historico);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if(this.disabledSave()){
        this.msgs = this.commonsService.checkPermisoAccion();
      }else{
        this.save();
      }
    }
  }

  save() {
    this.progressSpinner = true;
    let url = "";

    if (!this.modoEdicion) {
      url = "gestionFundamentosResolucion_createFundamentoResolucion";
      this.callSaveService(url);

    } else {
      url = "gestionFundamentosResolucion_updateFundamentoResolucion";
      this.callSaveService(url);
    }

  }

  callSaveService(url) {
    if (this.body.codigoExt != undefined) this.body.codigoExt = this.body.codigoExt.trim();
    if (this.body.descripcionFundamento != undefined) this.body.descripcionFundamento = this.body.descripcionFundamento.trim();
    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (!this.modoEdicion) {
          this.modoEdicion = true;
          this.idFundamento = JSON.parse(data.body).id;
          this.body.idFundamento = this.idFundamento;
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

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
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
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));

  }

  abreCierraFicha() {
    this.openFicha = !this.openFicha;

  }

  disabledSave() {

    if (!this.historico && (this.body.descripcionFundamento && this.body.idTipoResolucion) && (JSON.stringify(this.body) != JSON.stringify(this.bodyInicial))) {
      if (this.body.descripcionFundamento.trim() != "") {
        return false;
      } else { return true; }
    } else {
      return true;
    }
  }

  validateHistorical() {
    if (this.body != undefined) {

      if (this.body.fechaBaja != null) {
        this.historico = true;
      } else {
        this.historico = false;
      }

    }
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

}
