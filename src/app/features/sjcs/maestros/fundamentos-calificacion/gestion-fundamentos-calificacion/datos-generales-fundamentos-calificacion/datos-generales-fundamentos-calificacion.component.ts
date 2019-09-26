import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FundamentosCalificacionItem } from '../../../../../../models/sjcs/FundamentosCalificacionItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';

@Component({
  selector: 'app-datos-generales-fundamentos-calificacion',
  templateUrl: './datos-generales-fundamentos-calificacion.component.html',
  styleUrls: ['./datos-generales-fundamentos-calificacion.component.scss']
})
export class DatosGeneralesFundamentosCalificacionComponent implements OnInit {


  //Resultados de la busqueda
  @Input() datos: FundamentosCalificacionItem;
  @Input() modoEdicion;
  @Output() modoEdicionSend = new EventEmitter<any>();


  permisoEscritura: boolean = false;

  openFicha: boolean = true;
  msgs = [];
  historico: boolean = false;

  body: FundamentosCalificacionItem;
  bodyInicial: FundamentosCalificacionItem;

  progressSpinner: boolean = false;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private translateService: TranslateService) { }
  comboDictamen = [];
  idFundamento;

  ngOnInit() {

    this.validateHistorical();
    if (this.persistenceService.getPermisos() == true) {
      this.permisoEscritura = this.persistenceService.getPermisos()
    }
    if (this.modoEdicion) {
      this.body = this.datos;
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));

    } else {
      this.body = new FundamentosCalificacionItem();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));

    }
    this.progressSpinner = true
    this.cargaCombo()

  }

  cargaCombo() {
    this.sigaServices.get("busquedaFundamentosCalificacion_comboDictamen").subscribe(
      n => {

        this.comboDictamen = n.combooItems;
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false
      }
    );
  }

  validateHistorical() {
    if (this.persistenceService.getDatos() != undefined) {

      if (this.persistenceService.getDatos().fechabaja != null) {
        this.historico = true;
      } else {
        this.historico = false;
      }
    }
  }

  save() {
    this.progressSpinner = true;
    let url = "";
    this.progressSpinner = true
    if (!this.modoEdicion) {
      url = "busquedaFundamentosCalificacion_createFundamentos";
      this.callSaveService(url);

    } else {
      url = "busquedaFundamentosCalificacion_updateFundamento";
      this.callSaveService(url);
    }

  }

  callSaveService(url) {

    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (!this.modoEdicion) {
          this.modoEdicion = true;
          this.idFundamento = JSON.parse(data.body).id;
          let send = {
            modoEdicion: this.modoEdicion,
            idFundamental: this.idFundamento
          }
          this.body.idFundamento = this.idFundamento
          this.persistenceService.setDatos(this.body);
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

  rest() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));

  }

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
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
    if (!this.historico && (this.body.idTipoDictamenEjg != undefined &&
      this.body.idTipoDictamenEjg != "" && this.body.descripcionFundamento != null && this.body.descripcionFundamento != ""
    )) {
      return false;
    } else {
      return true;
    }
  }

  clear() {
    this.msgs = [];
  }

}
