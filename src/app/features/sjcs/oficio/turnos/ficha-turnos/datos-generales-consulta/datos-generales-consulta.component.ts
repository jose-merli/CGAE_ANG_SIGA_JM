import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output, Input } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { Location } from "@angular/common";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { Subject } from "rxjs/Subject";
import { DatosGeneralesConsultaItem } from '../../../../../../models/DatosGeneralesConsultaItem';
import { DestinatariosItem } from '../../../../../../models/DestinatariosItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PrisionItem } from '../../../../../../models/sjcs/PrisionItem';
@Component({
  selector: "app-datos-generales-consulta",
  templateUrl: "./datos-generales-consulta.component.html",
  styleUrls: ["./datos-generales-consulta.component.scss"]
})
export class DatosGeneralesTurnosComponent implements OnInit {

  //Resultados de la busqueda
  @Input() datos: PrisionItem;
  @Input() modoEdicion;
  @Output() modoEdicionSend = new EventEmitter<any>();

  openFicha: boolean = true;
  msgs = [];
  historico: boolean = false;

  provinciaSelecionada: string;


  body: PrisionItem;
  bodyInicial: PrisionItem;
  idPrision;
  isDisabledProvincia: boolean = true;

  comboProvincias;
  comboPoblacion;
  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones;
  codigoPostalValido: boolean = true;

  permisoEscritura: boolean = true;
  movilCheck: boolean = false

  visibleMovilValue: boolean = false;
  esDecanoValue: boolean = false;
  isCodigoEjisValue: boolean = false;

  progressSpinner: boolean = false;
  avisoMail: boolean = false

  emailValido: boolean = false;
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
      if (this.datos.visibleMovil == "1")
        this.movilCheck = true
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

      if (this.persistenceService.getDatos().fechaBaja != null) {
        this.historico = true;
      } else {
        this.historico = false;
      }
    }
  }

  cambiaMovil() {
    if (this.movilCheck)
      this.body.visibleMovil = 1
    else
      this.body.visibleMovil = 0
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
          this.commonsServices.arregloTildesCombo(this.comboPoblacion);

        },
        error => {
          this.progressSpinner = false;
        },
        () => { }
      );
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
        this.isDisabledProvincia = true;
      }
      this.codigoPostalValido = true;
    } else {
      this.codigoPostalValido = false;
      this.body.idProvincia = "";

    }
  }


  isValidCodigoPostal(): boolean {
    return (
      this.body.codigoPostal &&
      typeof this.body.codigoPostal === "string" &&
      /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(this.body.codigoPostal)
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
  trimeando() {
    this.body.nombre = this.body.nombre.trim()
    if (this.body.domicilio != null && this.body.domicilio != undefined)
      this.body.domicilio = this.body.domicilio.trim()

    if (this.body.telefono1 != null && this.body.telefono1 != undefined)
      this.body.telefono1 = this.body.telefono1.trim()

    if (this.body.telefono2 != null && this.body.telefono2 != undefined)
      this.body.telefono2 = this.body.telefono2.trim()

    if (this.body.fax != null && this.body.fax != undefined)
      this.body.fax = this.body.fax.trim()

    if (this.body.email != null && this.body.email != undefined)
      this.body.email = this.body.email.trim()

    if (this.body.codigoExt != null && this.body.codigoExt != undefined)
      this.body.codigoExt = this.body.codigoExt.trim()

  }

  callSaveService(url) {
    if (this.body.visibleMovil == null) {
      this.body.visibleMovil = 0
    }
    this.trimeando()
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
    this.emailValido = false
    this.edicionEmail = true
    this.tlf1Valido = true
    this.tlf2Valido = true
    this.faxValido = true

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

  changeEmail() {
    if (this.commonsServices.validateEmail(this.body.email) && this.body.email != null && this.body.email != "") {
      this.emailValido = true
      this.avisoMail = false
    }
    else {
      this.emailValido = false
      this.avisoMail = false

      if (this.body.email != null && this.body.email != "")
        this.avisoMail = true
    }
  }

  disabledSave() {
    if (!this.historico && (this.body.nombre != undefined && this.body.nombre != null && this.body.nombre.trim() != "" &&
      this.body.idProvincia != undefined && this.body.idProvincia != "" && this.body.idPoblacion != undefined && this.body.idPoblacion != null && this.body.idPoblacion != ""
      && this.body.codigoPostal != null && this.body.codigoPostal.trim() != "" && this.body.codigoPostal.trim().length == 5 && !this.avisoMail && this.tlf1Valido
      && this.tlf2Valido && this.faxValido && this.mvlValido) && this.permisoEscritura && (JSON.stringify(this.body) != JSON.stringify(this.bodyInicial))) {
      return false;
    } else {
      return true;
    }
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
