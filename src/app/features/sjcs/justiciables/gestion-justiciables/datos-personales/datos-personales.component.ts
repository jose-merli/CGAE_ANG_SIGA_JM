import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonsService } from "../../../../../_services/commons.service";
import { NotificationService } from "../../../../../_services/notification.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate";
import { JusticiableItem } from "../../../../../models/sjcs/JusticiableItem";
import { JusticiableTelefonoItem } from "../../../../../models/sjcs/JusticiableTelefonoItem";

@Component({
  selector: "app-datos-personales",
  templateUrl: "./datos-personales.component.html",
  styleUrls: ["./datos-personales.component.scss"],
})
export class DatosPersonalesComponent implements OnInit {
  @Input() modoEdicion;
  @Input() showTarjeta: boolean = false;
  @Input() permisoEscritura: boolean = true;
  @Input() origen: string = "";
  @Input() body: JusticiableItem;
  @Input() bodyInicial: JusticiableItem;
  @Output() bodyChange = new EventEmitter<JusticiableItem>();
  @Output() showDialog = new EventEmitter<string>();

  bodyInicialTelefonos: string = "";
  direccionPostal: string = "";
  resultadosPoblaciones: string = "";

  progressSpinner: boolean = true;
  isDisabledPoblacion: boolean = true;
  isDisabledProvincia: boolean = true;
  hasChange: boolean = false;
  telefonoValido: boolean = true;
  isExtranjero: boolean;

  comboTipoVia;
  comboPais;
  comboProvincia;
  comboPoblacion;

  constructor(private sigaServices: SigaServices, private commonsService: CommonsService, private translateService: TranslateService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.progressSpinner = true;
    if (this.body.idpaisdir1 != "191") {
      this.isExtranjero = true;
    } else {
      this.isExtranjero = false;
    }
    this.bodyInicialTelefonos = JSON.stringify(this.body.telefonos);
    this.getCombos();
  }

  onChangeCodigoPostal() {
    if (!this.isExtranjero) {
      if (this.commonsService.validateCodigoPostal(this.body.codigopostal) && this.body.codigopostal.length == 5) {
        let value = this.body.codigopostal.substring(0, 2);
        this.isDisabledPoblacion = false;
        if (value != this.body.idprovincia) {
          this.body.idprovincia = value;
          this.body.idpoblacion = "";
          this.comboPoblacion = [];
          this.getComboPoblacion("-1");
        }
      } else {
        this.isDisabledPoblacion = true;
        this.body.idpoblacion = undefined;
        this.body.idprovincia = undefined;
      }
    }
    this.changes();
  }

  onChangeInput(event) {
    this.changes();
  }

  /**
   * Permite numeros, +, espacio, borrar, suprimir, flecha izda/drcha,
   * tabulacion, inicio/fin y parentesis en inputs
   */
  numberOnly(event) {
    const key = event.key;
    if (key == "Dead") return false;
    return (key >= "0" && key <= "9") || key === "+" || key === " " || key === "Backspace" || key === "Delete" || key === "ArrowLeft" || key === "ArrowRight" || key === "Tab" || key === "Home" || key === "End" || key === "(" || key === ")";
  }

  /**
   * Aplica los metodos numberOnly y onChangeInput ya que (keydown) no ejecuta ambos
   */
  onChangeInputAndNumberOnly(event) {
    this.onChangeInput(event);
    //Sin return no se aplica evento de teclado, permitiendo caracteres alfabeticos
    return this.numberOnly(event);
  }

  onChangeSms(telefono: JusticiableTelefonoItem, event) {
    if (event) {
      for (let i = 0; i < this.body.telefonos.length; i++) {
        if (this.body.telefonos[i] == telefono) {
          this.body.telefonos[i].preferenteSmsCheck = true;
        } else {
          this.body.telefonos[i].preferenteSmsCheck = false;
        }
      }
    }
    this.changes();
  }

  validateNumero(event) {
    let campoRequerido = "camposObligatorios";
    if (event == undefined || this.commonsService.validateTelefono(event)) {
      campoRequerido = "";
    }
    return campoRequerido;
  }

  editarCompleto(event, dato) {
    let NUMBER_REGEX = /^\d{1,5}$/;
    if (NUMBER_REGEX.test(dato)) {
      if (dato != null && dato != undefined && (dato < 0 || dato > 99999)) {
        this.body.codigopostal = event.currentTarget.value.slice(0, 5);
      }
    } else {
      if (dato != null && dato != undefined && (dato < 0 || dato > 99999)) {
        this.body.codigopostal = event.currentTarget.value.slice(0, 5);
      } else {
        this.body.codigopostal = "";
        event.currentTarget.value = "";
      }
    }
  }

  reset() {
    if (this.modoEdicion) {
      if (this.bodyInicial != undefined) {
        this.body = { ...this.bodyInicial };
        this.body.telefonos = [];
        this.body.telefonos = JSON.parse(this.bodyInicialTelefonos);
      }
    } else {
      this.body = new JusticiableItem();
      this.body.telefonos = [];
      this.body.telefonos[0] = new JusticiableTelefonoItem();
      this.body.idpaisdir1 = "191";
    }
    this.hasChange = false;
  }

  save() {
    this.deleteSpacing();
    if (!this.validate()) {
      this.notificationService.showError(this.translateService.instant("general.message.incorrect"), "Campos obligatorios no se han rellando");
    } else {
      if (!this.validateEmail()) {
        this.notificationService.showError(this.translateService.instant("general.message.incorrect"), "El correo electrónico no tiene un formato válido");
      } else if (!this.validateEmailTelematico()) {
        this.notificationService.showError(this.translateService.instant("general.message.incorrect"), "El aviso telemático está autorizado, debe tener un correo electrónico");
      } else if (!this.validateFax()) {
        this.notificationService.showError(this.translateService.instant("general.message.incorrect"), "El fax no tiene un formato válido");
      } else {
        this.progressSpinner = true;
        if (this.body.telefonos != null && this.body.telefonos.length > 0) {
          this.body.telefonos = this.body.telefonos.filter((t) => t.numeroTelefono && t.numeroTelefono.trim() !== "");
        }
        //if (!this.modoEdicion) {
        //this.callSaveService("gestionJusticiables_createJusticiable");
        //} else {
        if (this.body.numeroAsuntos != undefined && parseInt(this.body.numeroAsuntos) > 1 && this.origen != "" && this.origen != "Asistencia" && this.origen != "Soj") {
          this.progressSpinner = false;
          this.showDialog.emit("tarjetaPersonales");
        } else {
          this.callSaveService("gestionJusticiables_updateJusticiableDatosPersonales");
        }
        //}
      }
    }
  }

  deleteSpacing() {
    if (this.body.direccion != null && this.body.direccion != undefined) {
      this.body.direccion = this.body.direccion.trim();
    }
    if (this.body.escaleradir != null && this.body.escaleradir != undefined) {
      this.body.escaleradir = this.body.escaleradir.trim();
    }
    if (this.body.pisodir != null && this.body.pisodir != undefined) {
      this.body.pisodir = this.body.pisodir.trim();
    }
    if (this.body.puertadir != null && this.body.puertadir != undefined) {
      this.body.puertadir = this.body.puertadir.trim();
    }
    if (this.body.correoelectronico != null && this.body.correoelectronico != undefined) {
      this.body.correoelectronico = this.body.correoelectronico.trim();
    }
    if (this.body.fax != null && this.body.fax != undefined) {
      this.body.fax = this.body.fax.trim();
    }
    if (!this.isExtranjero) {
      this.body.direccionExtranjera = "";
    }
    if (this.body.telefonos != null && this.body.telefonos.length > 0) {
      let telefonosFiltrados = this.body.telefonos.filter((t) => t.numeroTelefono && t.numeroTelefono.trim() !== "");
      if (telefonosFiltrados.length === 0) {
        this.body.telefonos = [];
      } else {
        for (let i = 0; i < telefonosFiltrados.length; i++) {
          telefonosFiltrados[i].preferenteSms = "0";
          if (telefonosFiltrados[i].preferenteSmsCheck) {
            telefonosFiltrados[i].preferenteSms = "1";
          }
        }
        this.body.telefonos = telefonosFiltrados;
      }
    }
  }

  rellenarDireccionPostal() {
    if (this.body.direccion != undefined && this.body.direccion != null) {
      this.comboTipoVia.forEach((element) => {
        if (element.value == this.body.idtipovia) this.direccionPostal = element.label;
      });
      this.direccionPostal = this.direccionPostal + " " + this.body.direccion;

      if (this.body.codigopostal) {
        this.direccionPostal += ", " + this.body.codigopostal;
      }

      if (this.isExtranjero) {
        this.direccionPostal = this.direccionPostal + ", " + this.body.direccionExtranjera;
      } else {
        this.comboPoblacion.forEach((element) => {
          if (element.value == this.body.idpoblacion) this.direccionPostal = this.direccionPostal + ", " + element.label;
        });
      }

      if (this.body.idprovincia != undefined && this.body.idprovincia != "") {
        this.comboProvincia.forEach((element) => {
          if (element.value == this.body.idprovincia) this.direccionPostal = this.direccionPostal + ", " + element.label;
        });
      }
      this.comboPais.forEach((element) => {
        if (element.value == this.body.idpaisdir1) this.direccionPostal = this.direccionPostal + ", " + element.label;
      });
      this.progressSpinner = false;
    }
    this.bodyChange.emit(this.body);
  }

  onDireccionNoInformadaChange() {
    if (this.body.direccionNoInformada) {
      this.body.idtipovia = "";
      this.body.direccion = "";
      this.body.numerodir = "";
      this.body.escaleradir = "";
      this.body.pisodir = "";
      this.body.puertadir = "";
      this.body.idpais = "";
      this.body.codigopostal = "";
      this.body.idprovincia = "";
      this.body.idpoblacion = "";
    } else {
      this.body.idtipovia = this.bodyInicial.idtipovia;
      this.body.direccion = this.bodyInicial.direccion;
      this.body.numerodir = this.bodyInicial.numerodir;
      this.body.escaleradir = this.bodyInicial.escaleradir;
      this.body.pisodir = this.bodyInicial.pisodir;
      this.body.puertadir = this.bodyInicial.puertadir;
      this.body.idpais = this.bodyInicial.idpais;
      this.body.codigopostal = this.bodyInicial.codigopostal;
      this.body.idprovincia = this.bodyInicial.idprovincia;
      this.body.idpoblacion = this.bodyInicial.idpoblacion;
      this.getComboProvincia();
    }
    this.changes();
  }

  onChangePais() {
    //Si se selecciona un pais extranjero
    if (this.body.idpaisdir1 != "191") {
      this.body.idprovincia = "";
      this.body.idpoblacion = "";
      this.isDisabledPoblacion = true;
      this.comboPoblacion = [];
      this.isExtranjero = true;
    } else {
      //Si se selecciona españa
      this.isExtranjero = false;
      this.body.direccionExtranjera = "";
      this.onChangeCodigoPostal();
    }
  }

  changes() {
    this.bodyInicial.telefonos == undefined ? (this.bodyInicial.telefonos = []) : null;
    this.bodyInicial.direccionNoInformada == undefined ? (this.bodyInicial["direccionNoInformada"] = !this.body.direccionNoInformada) : null;
    this.body.telefonos == undefined ? (this.body.telefonos = []) : null;
    this.hasChange = JSON.stringify(this.bodyInicial) !== JSON.stringify(this.body);
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

  styleObligatorio(evento) {
    if (!this.body.direccionNoInformada) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  /***** TARJETA *******/
  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta; // Funcionalidad para mostrar contenido de la Tarjeta pulsando a la misma.
  }

  /**** TELEFONO ****/
  addTelefono() {
    if (this.body.telefonos == null) {
      this.body.telefonos = [];
    }
    this.body.telefonos.push(new JusticiableTelefonoItem());
    this.changes();
  }

  deleteTelefono(index: number) {
    if (this.body.telefonos.length == 1) {
      this.body.telefonos[0] = new JusticiableTelefonoItem();
    } else {
      this.body.telefonos.splice(index, 1);
    }
    this.changes();
  }

  validateEmail() {
    return this.body.correoelectronico == null || this.commonsService.validateEmail(this.body.correoelectronico);
  }

  validateFax() {
    return this.body.fax == null || this.commonsService.validateFax(this.body.fax);
  }

  guardarDialog(clonar: boolean) {
    this.progressSpinner = true;
    if (!clonar) {
      this.callSaveService("gestionJusticiables_updateJusticiableDatosPersonales");
    }
  }

  private validate() {
    let validateForm = true;
    this.telefonoValido = true;

    if (!this.body.direccionNoInformada) {
      if (!this.body.idtipovia || this.body.idtipovia.trim() === "" || !this.body.codigopostal || this.body.codigopostal.trim() === "") {
        validateForm = false;
      }
      if (this.isExtranjero && (this.body.direccionExtranjera == null || this.body.direccionExtranjera.trim() == "")) {
        validateForm = false;
      }
      if (this.body.idpaisdir1 == null || this.body.idpaisdir1.trim() == "") {
        validateForm = false;
      }
      if (!this.isExtranjero && (this.body.idprovincia == null || this.body.idprovincia.trim() == "")) {
        validateForm = false;
      }
      if (!this.isExtranjero && (this.body.idpoblacion == null || this.body.idpoblacion.trim() == "")) {
        validateForm = false;
      }
    }

    if (this.body.telefonos != null && this.body.telefonos.length > 0) {
      for (let i = 0; i < this.body.telefonos.length; i++) {
        if (!this.commonsService.validateTelefono(this.body.telefonos[i].numeroTelefono)) {
          this.telefonoValido = false;
          validateForm = false;
        }
      }
    }
    return validateForm;
  }

  /**
   * Valida el email cuando esta activo el aviso telematico
   */
  private validateEmailTelematico() {
    return !((this.body.correoelectronico == undefined || this.body.correoelectronico == "") && this.bodyInicial.autorizaavisotelematico == "1");
  }

  private callSaveService(url) {
    this.sigaServices.post(url, this.body).subscribe(
      (data) => {
        let dataJusticiable = JSON.parse(data.body);
        if (dataJusticiable.error.message != "C") {
          if (!this.modoEdicion) {
            this.modoEdicion = true;
            this.body.idpersona = dataJusticiable.id;
          }
          this.notificationService.showSuccess(this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }
        this.bodyInicial = { ...this.body };
        this.bodyInicialTelefonos = JSON.stringify(this.body.telefonos);
        this.rellenarDireccionPostal();
        this.hasChange = false;
        this.progressSpinner = false;
      },
      (err) => {
        let dataJusticiable = JSON.parse(err.error);
        if (dataJusticiable.error.description != "") {
          if (err.error != undefined && JSON.parse(err.error).error.code == "600") {
            this.notificationService.showError(this.translateService.instant("general.message.incorrect"), dataJusticiable.error.description);
          } else {
            this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant(dataJusticiable.error.description));
          }
        } else {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
    );
  }

  private async getCombos() {
    await this.getComboPais();
    await this.getComboTipoVia();
    await this.getComboProvincia();
    this.rellenarDireccionPostal();
  }

  private getComboTipoVia() {
    return this.sigaServices
      .getParam("gestionJusticiables_comboTipoVias2", "?idTipoViaJusticiable=" + this.body.idtipovia)
      .toPromise()
      .then((n) => {
        this.comboTipoVia = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTipoVia);
      });
  }

  private getComboPais() {
    return this.sigaServices
      .get("direcciones_comboPais")
      .toPromise()
      .then((n) => {
        this.comboPais = n.combooItems;
      });
  }

  private getComboProvincia() {
    return this.sigaServices
      .get("integrantes_provincias")
      .toPromise()
      .then(async (n) => {
        this.comboProvincia = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboProvincia);
        if (this.body.idprovincia != undefined && this.body.idprovincia != null && this.body.idprovincia != "") {
          await this.getComboPoblacion("-1");
          this.isDisabledPoblacion = false;
        }
        this.progressSpinner = false;
      });
  }

  private getComboPoblacion(filtro: string) {
    return this.sigaServices
      .getParam("direcciones_comboPoblacion", "?idProvincia=" + this.body.idprovincia + "&filtro=" + filtro)
      .toPromise()
      .then((n) => {
        this.comboPoblacion = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboPoblacion);
        this.progressSpinner = false;
      });
  }
}
