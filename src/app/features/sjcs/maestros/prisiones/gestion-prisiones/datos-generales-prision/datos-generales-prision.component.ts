import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PrisionItem } from '../../../../../../models/sjcs/PrisionItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { CommonsService } from '../../../../../../_services/commons.service';

@Component({
  selector: 'app-datos-generales-prision',
  templateUrl: './datos-generales-prision.component.html',
  styleUrls: ['./datos-generales-prision.component.scss']
})
export class DatosGeneralesPrisionComponent implements OnInit {

  //Resultados de la busqueda
  @Input() datos: PrisionItem;
  @Input() modoEdicion;
  @Output() modoEdicionSend = new EventEmitter<any>();

  openFicha: boolean = true;
  msgs = [];
  historico: boolean = false;

  body: PrisionItem;
  bodyInicial: PrisionItem;
  idPrision;

  comboProvincias;
  comboPoblacion;
  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones;

  permisoEscritura: boolean = true;

  visibleMovilValue: boolean = false;
  esDecanoValue: boolean = false;
  isCodigoEjisValue: boolean = false;

  progressSpinner: boolean = false;

  emailValido: boolean = true;
  tlf1Valido: boolean = true;
  tlf2Valido: boolean = true;
  faxValido: boolean = true;
  mvlValido: boolean = true;
  edicionEmail: boolean = false;

  @ViewChild("mailto") mailto;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private translateService: TranslateService, private commonsServices: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos()

    }

    this.getComboProvincias();

    this.validateHistorical();

    if (this.modoEdicion) {
      this.body = this.datos;
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));

      if (this.body.email != undefined && this.body.email != "") {
        this.edicionEmail = false;
      } else {
        this.edicionEmail = true;
      }

      if (this.body != undefined && this.datos.nombrePoblacion != null) {
        this.getComboPoblacion(this.body.nombrePoblacion);
      } else {
        this.progressSpinner = false;
      }

    } else {
      this.body = new PrisionItem();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      this.edicionEmail = true;

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

  getComboProvincias() {
    this.progressSpinner = true;

    this.sigaServices.get("busquedaPrisiones_provinces").subscribe(
      n => {
        this.comboProvincias = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboProvincias);
        this.progressSpinner = false;

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

  onChangePoblacion() {
    if (this.body.idPoblacion != undefined && this.body.idPoblacion != null) {
      let poblacionSelected = this.comboPoblacion.filter(pob => pob.value == this.body.idPoblacion);
      this.body.nombrePoblacion = poblacionSelected[0].label;
    }
  }

  buscarPoblacion(e) {
    if (e.target.value && e.target.value !== null && e.target.value !== "") {
      if (e.target.value.length >= 3) {
        this.getComboPoblacion(e.target.value);
        this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
      } else {
        this.comboPoblacion = [];
        this.resultadosPoblaciones = this.translateService.instant("formacion.busquedaCursos.controlFiltros.minimoCaracteres");
      }
    } else {
      this.comboPoblacion = [];
      this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
    }
  }

  getComboPoblacion(dataFilter) {
    this.progressSpinner = true;

    this.sigaServices
      .getParam(
        "busquedaPrisiones_population",
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
      url = "gestionPrisiones_createPrision";
      this.callSaveService(url);

    } else {
      url = "gestionPrisiones_updatePrision";
      this.callSaveService(url);
    }

  }

  callSaveService(url) {

    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (!this.modoEdicion) {
          this.modoEdicion = true;
          this.idPrision = JSON.parse(data.body).id;
          let send = {
            modoEdicion: this.modoEdicion,
            idPrision: this.idPrision
          }
          this.body.idPrision = this.idPrision
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

  editEmail() {
    if (this.edicionEmail)
      this.edicionEmail = false;
    else this.edicionEmail = true;
  }

  openOutlook(dato) {
    let correo = dato.email;
    this.commonsServices.openOutlook(correo);
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
      && this.tlf2Valido && this.faxValido && this.mvlValido) && this.permisoEscritura && (JSON.stringify(this.body) != JSON.stringify(this.bodyInicial))) {
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
