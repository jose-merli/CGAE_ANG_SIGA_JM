import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { JuzgadoItem } from '../../../../../../models/sjcs/JuzgadoItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { PermisosAplicacionesDto } from '../../../../../../models/PermisosAplicacionesDto';

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
  codigoPostalValido: boolean = false;
  provinciaSelecionada: string;


  body: JuzgadoItem;
  bodyInicial: JuzgadoItem;
  idJuzgado;

  comboProvincias;
  comboPoblacion;
  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones;

  permisoEscritura: boolean = true;

  visibleMovilValue: boolean = false;
  esDecanoValue: boolean = false;
  isCodigoEjisValue: boolean = false;

  progressSpinner: boolean = false;

  edicionEmail: boolean = false;
  emailValido: boolean = true;
  tlf1Valido: boolean = true;
  tlf2Valido: boolean = true;
  faxValido: boolean = true;
  mvlValido: boolean = true;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private translateService: TranslateService, private commonsService: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos()

    }

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

  cambiaMovil() {
    if (this.visibleMovilValue)
      this.body.visibleMovil = "1"
    else
      this.body.visibleMovil = "0"
  }

  cambiaDecano() {
    if (this.esDecanoValue)
      this.body.esDecano = "1"
    else
      this.body.esDecano = "0"
  }

  cambiaCodigoEjis() {
    if (this.isCodigoEjisValue)
      this.body.isCodigoEjis = "1"
    else
      this.body.isCodigoEjis = "0"
  }

  validateHistorical() {
    if (this.persistenceService.getDatos() != undefined) {

      if (this.persistenceService.getDatos().fechabaja != null || this.persistenceService.getDatos().institucionVal != undefined) {
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

  setInfo() {
    if (this.body != undefined && this.body.visibleMovil != undefined) {
      this.visibleMovilValue == true ? this.body.visibleMovil = "1" : this.body.visibleMovil = "0";
    }
    if (this.body != undefined && this.body.esDecano != undefined) {
      this.esDecanoValue == true ? this.body.esDecano = "1" : this.body.esDecano = "0";
    }
    if (this.body != undefined && this.body.isCodigoEjis != undefined) {
      this.isCodigoEjisValue == true ? this.body.isCodigoEjis = "1" : this.body.isCodigoEjis = "0";
    }
  }

  getComboProvincias() {
    this.sigaServices.get("busquedaJuzgados_provinces").subscribe(
      n => {
        this.comboProvincias = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboProvincias);
      },
      err => {
        //console.log(err);
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
    this.disabledSave();
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
    this.disabledSave();
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
          this.commonsService.arregloTildesCombo(this.comboPoblacion);

          this.progressSpinner = false;

        },
        error => {
          this.progressSpinner = false;
        },
        () => { }
      );
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
      url = "gestionJuzgados_createCourt";
      this.callSaveService(url);

    } else {
      url = "gestionJuzgados_updateCourt";
      this.getInfo();
      this.callSaveService(url);
    }

  }

  callSaveService(url) {
    if (this.body.nombre != undefined && this.body.nombre != "") {
      this.body.nombre = this.body.nombre.trim();
    }
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
    this.emailValido = true;
    this.tlf1Valido = true;
    this.tlf2Valido = true;
    this.faxValido = true;
    this.mvlValido = true;
    this.visibleMovilValue = false;
    this.esDecanoValue = false;
    this.isCodigoEjisValue = false;
    if (this.modoEdicion) {
      this.getInfo();
    }
  }

  editEmail() {
    if (this.edicionEmail)
      this.edicionEmail = false;
    else this.edicionEmail = true;
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
    if (!this.historico && ((this.body.nombre != null && this.body.nombre != undefined && this.body.nombre.trim() != "") &&
      (this.body.idProvincia != undefined && this.body.idProvincia != "") &&
      (this.body.idPoblacion != null && this.body.idPoblacion != "") && this.emailValido && this.tlf1Valido && !this.isDisabledPoblacion
      && this.tlf2Valido && this.faxValido && this.mvlValido) && this.permisoEscritura && (JSON.stringify(this.body) != JSON.stringify(this.bodyInicial))) {
      return false;
    } else {
      return true;
    }
  }

  onChangeCodigoPostal() {
    if (
      this.isValidCodigoPostal() &&
      this.body.codigoPostal.length == 5
    ) {
      let value = this.body.codigoPostal.substring(0, 2);
      this.provinciaSelecionada = value;
      this.isDisabledPoblacion = false;
      if (value != this.body.idProvincia) {
        this.body.idProvincia = this.provinciaSelecionada;
        this.body.idPoblacion = "";
        this.body.nombrePoblacion = "";
        this.comboPoblacion = [];
        if (this.historico == true) {
          this.isDisabledPoblacion = true;
        } else {
          this.isDisabledPoblacion = false;
        }
      }
      this.codigoPostalValido = true;
    } else {
      this.body.idProvincia = undefined;
      this.codigoPostalValido = false;
      this.isDisabledPoblacion = true;
      this.provinciaSelecionada = "";

    }
    this.disabledSave();
  }

  isValidCodigoPostal(): boolean {
    return (
      this.body.codigoPostal &&
      typeof this.body.codigoPostal === "string" &&
      /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(this.body.codigoPostal)
    );
  }


  deshabilitarDireccion(): boolean {
    if (!this.codigoPostalValido) {
      return true;
    } else {
      return false;
    }
  }

  changeNombre(dato) {
    this.body.nombre = dato.nombre.trim();
  }

  changeEmail() {
    this.body.email = this.body.email.trim();
    this.emailValido = this.commonsService.validateEmail(this.body.email);
  }

  changeTelefono1() {
    // if (this.body.telefono1.length > 8) {
    this.tlf1Valido = this.commonsService.validateTelefono(this.body.telefono1);
    // }
  }

  changeTelefono2() {
    // if (this.body.telefono2.length > 8) {
    this.tlf2Valido = this.commonsService.validateTelefono(this.body.telefono2);
    // }
  }
  changeFax() {
    // if (this.body.fax.length > 8) {
    this.faxValido = this.commonsService.validateFax(this.body.fax);
    // }
  }

  changeMovil() {
    // if (this.body.movil.length > 8) {
    this.mvlValido = this.commonsService.validateMovil(this.body.movil);
    // }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    // this.datosInicial.find(item => item.idAcreditacion === dato.idAcreditacion);

    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    else {
      return false;
    }
  }

  clear() {
    this.msgs = [];
  }

}
