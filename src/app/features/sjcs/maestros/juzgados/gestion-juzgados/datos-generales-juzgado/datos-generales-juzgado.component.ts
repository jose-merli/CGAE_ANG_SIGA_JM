import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { JuzgadoItem } from '../../../../../../models/sjcs/JuzgadoItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { TranslateService } from '../../../../../../commons/translate/translation.service';

@Component({
  selector: 'app-datos-generales-juzgado',
  templateUrl: './datos-generales-juzgado.component.html',
  styleUrls: ['./datos-generales-juzgado.component.scss']
})
export class DatosGeneralesJuzgadoComponent implements OnInit {

  //Resultados de la busqueda
  @Input() datos: JuzgadoItem;
  @Input() modoEdicion;
  @Output() modoEdicionSend = new EventEmitter<any>();

  openFicha: boolean = true;
  msgs = [];
  historico: boolean = false;

  body: JuzgadoItem;
  bodyInicial: JuzgadoItem;
  idJuzgado;

  comboProvincias;
  comboPoblacion;
  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones;

  visibleMovilValue: boolean = false;
  esDecanoValue: boolean = false;
  isCodigoEjisValue: boolean = false;

  progressSpinner: boolean = false;

  emailValido: boolean = true;
  tlf1Valido: boolean = true;
  tlf2Valido: boolean = true;
  faxValido: boolean = true;
  mvlValido: boolean = true;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private translateService: TranslateService, private commonsServices: CommonsService) { }

  ngOnInit() {
    this.getComboProvincias();

    this.validateHistorical();

    if (this.modoEdicion) {
      this.body = this.datos;
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));

      if (this.body != undefined && this.datos.nombrePoblacion != null) {
        this.getComboPoblacion(this.body.nombrePoblacion);
      } else {
        this.progressSpinner = false;
      }

      this.getInfo();
    } else {
      this.body = new JuzgadoItem();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));

    }
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

  getInfo() {

    if (this.body != undefined && this.body.fechaCodigoEjis != undefined) {
      this.body.fechaCodigoEjis = new Date(this.body.fechaCodigoEjis);
    }

    if (this.body != undefined && this.body.visibleMovil != undefined) {
      this.body.visibleMovil == "1" ? this.visibleMovilValue = true : this.visibleMovilValue = false;
    }

    if (this.body != undefined && this.body.esDecano != undefined) {
      this.body.esDecano == "1" ? this.esDecanoValue = true : this.esDecanoValue = false;
    }

    if (this.body != undefined && this.body.isCodigoEjis != undefined) {
      this.body.isCodigoEjis == "1" ? this.isCodigoEjisValue = true : this.isCodigoEjisValue = false;
    }

  }

  getComboProvincias() {
    this.sigaServices.get("busquedaJuzgados_provinces").subscribe(
      n => {
        this.comboProvincias = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboProvincias);
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
      }
    );
  }

  onChangeProvincia() {

    this.body.idPoblacion = "";
    this.comboPoblacion = [];

    if (this.body.idProvincia != undefined && this.body.idProvincia != "") {
      this.isDisabledPoblacion = false;
    } else {
      this.isDisabledPoblacion = true;
    }

  }

  buscarPoblacion(e) {
    if (e.target.value && e.target.value !== null && e.target.value !== "") {
      if (e.target.value.length >= 3) {
        this.getComboPoblacion(e.target.value);
        this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
      } else {
        this.comboPoblacion = [];
        this.resultadosPoblaciones = "Debe introducir al menos 3 caracteres";
      }
    } else {
      this.comboPoblacion = [];
      this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
    }
  }

  getComboPoblacion(dataFilter) {
    this.sigaServices
      .getParam(
        "busquedaJuzgados_population",
        "?idProvincia=" + this.body.idProvincia + "&dataFilter=" + dataFilter
      )
      .subscribe(
        n => {
          this.isDisabledPoblacion = false;
          this.comboPoblacion = n.combooItems;
          this.progressSpinner = false;

        },
        error => {
          this.progressSpinner = false;
        },
        () => { }
      );
  }

  save() {
    this.progressSpinner = true;
    let url = "";

    if (!this.modoEdicion) {
      url = "gestionJuzgados_createJudged";
      this.callSaveService(url);

    } else {
      url = "gestionJuzgados_updateJudged";
      this.getInfo();
      this.callSaveService(url);
    }

  }

  callSaveService(url) {

    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (!this.modoEdicion) {
          this.modoEdicion = true;
          this.idJuzgado = JSON.parse(data.body).id;
          let send = {
            modoEdicion: this.modoEdicion,
            idJuzgado: this.idJuzgado
          }
          this.body.idJuzgado = this.idJuzgado
          this.persistenceService.setDatos(this.body);
          this.modoEdicionSend.emit(send);
        }

        this.bodyInicial = JSON.parse(JSON.stringify(this.body));

        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {

        if (err.error != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
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

    if (this.modoEdicion) {
      this.getInfo();
    }
  }


  fillFechaCodigoEjis(event) {
    this.body.fechaCodigoEjis = event;
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
    if (!this.historico && (this.body.nombre != "" && this.body.nombre != undefined && this.body.idProvincia != undefined &&
      this.body.idProvincia != "" && this.body.idPoblacion != null && this.body.idPoblacion != "" && this.emailValido && this.tlf1Valido
      && this.tlf2Valido && this.faxValido && this.mvlValido)) {
      return false;
    } else {
      return true;
    }
  }

  changeEmail() {
    this.emailValido = this.commonsServices.validateEmail(this.body.email);
  }

  changeTelefono1() {
    this.tlf1Valido = this.commonsServices.validateTelefono(this.body.telefono1);
  }

  changeTelefono2() {
    this.tlf2Valido = this.commonsServices.validateTelefono(this.body.telefono2);
  }
  changeFax() {
    this.faxValido = this.commonsServices.validateFax(this.body.fax);
  }

  changeMovil() {
    this.mvlValido = this.commonsServices.validateMovil(this.body.movil);
  }
  
  clear() {
    this.msgs = [];
  }

}
