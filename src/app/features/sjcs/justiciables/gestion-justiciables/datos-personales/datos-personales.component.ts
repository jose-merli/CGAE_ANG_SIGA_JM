import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonsService } from "../../../../../_services/commons.service";
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
  @Input() body: JusticiableItem;
  @Output() bodyChange = new EventEmitter<JusticiableItem>();
  @Output() notificacion = new EventEmitter<any>();

  bodyInicial;
  bodyInicialTelefonos;
  direccionPostal: String = "";
  resultadosPoblaciones: String = "";

  progressSpinner: boolean = true;
  isDisabledPoblacion: boolean = true;
  isDisabledProvincia: boolean = true;
  validateForm: boolean = true;
  hasChange: boolean = false;
  telefonoValido: boolean = true;

  comboTipoVia;
  comboPais;
  comboProvincia;
  comboPoblacion;

  constructor(private sigaServices: SigaServices, private commonsService: CommonsService, private translateService: TranslateService) {}

  ngOnInit() {
    this.progressSpinner = true;
    this.getCombos();
  }

  onChangeCodigoPostal() {
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
    this.hasChange = true;
  }

  onChangeInput(event) {
    this.hasChange = true;
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
    this.hasChange = true;
  }

  validateNumero(event) {
    let NUMBER_REGEX = /^(\(\+[0-9]{2}\)|[0-9]{4})?[ ]?[0-9]{9}$/;
    if (event == undefined || event == "" || NUMBER_REGEX.test(event)) {
      return "";
    } else {
      return "camposObligatorios";
    }
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
        if (typeof this.bodyInicialTelefonos == "string") {
          this.body.telefonos = JSON.parse(this.bodyInicialTelefonos);
        } else {
          this.body.telefonos = JSON.parse(JSON.stringify(this.bodyInicialTelefonos));
        }
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
    if (this.body.telefonos != null && this.body.telefonos.length > 1) {
      let telefonosFiltrados = this.body.telefonos.filter((t) => t.numeroTelefono && t.numeroTelefono.trim() !== "");
      if (telefonosFiltrados.length === 0 && this.body.telefonos.length > 1) {
        this.body.telefonos = [new JusticiableTelefonoItem()];
      } else {
        this.body.telefonos = telefonosFiltrados;
      }
    }

    if (!this.validate()) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), "Campos obligatorios no se han rellando");
    } else {
      if (!this.validateEmail()) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), "El correo electrónico no tiene un formato válido");
      } else if (!this.validateFax()) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), "El fax no tiene un formato válido");
      } else {
        this.progressSpinner = true;
        this.deleteSpacing();
        if (this.body.telefonos != null && this.body.telefonos.length > 0) {
          this.body.telefonos = this.body.telefonos.filter((t) => t.numeroTelefono && t.numeroTelefono.trim() !== "");
        }
        if (!this.modoEdicion) {
          this.callSaveService("gestionJusticiables_createJusticiable");
        } else {
          this.callSaveService("gestionJusticiables_updateJusticiableDatosPersonales");
        }
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
    if (this.body.telefonos != null && this.body.telefonos.length > 0) {
      for (let i = 0; i < this.body.telefonos.length; i++) {
        this.body.telefonos[i].preferenteSms = "0";
        if (this.body.telefonos[i].preferenteSmsCheck) {
          this.body.telefonos[i].preferenteSms = "1";
        }
      }
    }
  }

  callSaveService(url) {
    this.sigaServices.post(url, this.body).subscribe(
      (data) => {
        let dataJusticiable = JSON.parse(data.body);
        if (dataJusticiable.error.message != "C") {
          if (!this.modoEdicion) {
            this.modoEdicion = true;
            this.body.idpersona = dataJusticiable.id;
          }
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }
        this.bodyInicial = { ...this.body };
        this.bodyInicialTelefonos = JSON.stringify(this.body.telefonos);
        this.rellenarDireccionPostal();
        this.hasChange = false;
        this.bodyChange.emit(this.body);
        this.progressSpinner = false;
      },
      (err) => {
        let dataJusticiable = JSON.parse(err.error);
        if (dataJusticiable.error.description != "") {
          if (err.error != undefined && JSON.parse(err.error).error.code == "600") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), dataJusticiable.error.description);
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(dataJusticiable.error.description));
          }
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
    );
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

      if (this.comboPoblacion != undefined) {
        this.comboPoblacion.forEach((element) => {
          if (element.value == this.body.idpoblacion) this.direccionPostal = this.direccionPostal + ", " + element.label;
        });
      }
      this.comboProvincia.forEach((element) => {
        if (element.value == this.body.idprovincia) this.direccionPostal = this.direccionPostal + ", " + element.label;
      });
      this.progressSpinner = false;
    }
  }

  /**
   * Valida el email cuando su campo no está vacío
   */
  validateEmail() {
    let pattern: RegExp = /^[a-zA-Z0-9\+\._-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)?\.[a-zA-Z]+$/;
    //Email vacio no se valida. En caso contrario, si
    return !this.body.correoelectronico || pattern.test(this.body.correoelectronico);
  }

  /**
   * Valida el fax cuando su campo no está vacío
   */
  validateFax() {
    let pattern: RegExp = /^(\(\+[0-9]{2}\)|[0-9]{4})?[ ]?[0-9]{9}$/;
    return !this.body.fax || pattern.test(this.body.fax);
  }

  /**
   * Valida los campos obligatorios
   */
  validateRequiredFields() {
    return this.body.idtipovia && this.body.direccion && this.body.codigopostal && this.body.idprovincia && this.body.idpoblacion;
  }

  validate() {
    this.validateForm = true;
    this.telefonoValido = true;

    if (!this.body.idtipovia || this.body.idtipovia.trim() === "" || !this.body.codigopostal || this.body.codigopostal.trim() === "" || !this.body.idprovincia || this.body.idprovincia.trim() === "" || !this.body.idpoblacion || this.body.idpoblacion.trim() === "") {
      this.validateForm = false;
    }

    if (!this.body.direccionNoInformada) {
      if (!this.body.direccion || this.body.direccion.trim() === "") {
        this.validateForm = false;
      }
    }

    if (this.body.telefonos != null && this.body.telefonos.length > 0) {
      for (let i = 0; i < this.body.telefonos.length; i++) {
        if (this.body.telefonos[i].numeroTelefono === undefined || this.body.telefonos[i].numeroTelefono === "") {
          this.deleteTelefono(i);
        } else {
          let NUMBER_REGEX = /^(\(\+[0-9]{2}\)|[0-9]{4})?[ ]?[0-9]{9}$/;
          if (!NUMBER_REGEX.test(this.body.telefonos[i].numeroTelefono)) {
            this.telefonoValido = false;
            this.validateForm = false;
          }
        }
      }
    }

    return this.validateForm;
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
    if (!this.validateForm) {
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
    this.hasChange = true;
  }

  deleteTelefono(index: number) {
    if (this.body.telefonos.length == 1) {
      this.body.telefonos[0] = new JusticiableTelefonoItem();
    } else {
      this.body.telefonos.splice(index, 1);
    }
    this.hasChange = true;
  }

  private showMessage(severity, summary, msg) {
    this.notificacion.emit({
      severity: severity,
      summary: summary,
      detail: msg,
    });
  }

  private async getCombos() {
    this.getComboPais();
    this.getComboTipoVia();
    this.getComboProvincia();
  }

  private getComboTipoVia() {
    this.sigaServices.getParam("gestionJusticiables_comboTipoVias2", "?idTipoViaJusticiable=" + this.body.idtipovia).subscribe((n) => {
      this.comboTipoVia = n.combooItems;
      this.commonsService.arregloTildesCombo(this.comboTipoVia);
    });
  }

  private getComboPais() {
    this.sigaServices.get("direcciones_comboPais").subscribe((n) => {
      this.comboPais = n.combooItems;
      this.comboPais.push({ label: "DESCONOCIDO", value: "D" });
      this.commonsService.arregloTildesCombo(this.comboPais);
    });
  }

  private getComboProvincia() {
    this.sigaServices.get("integrantes_provincias").subscribe((n) => {
      this.comboProvincia = n.combooItems;
      this.commonsService.arregloTildesCombo(this.comboProvincia);
      if (this.body.idprovincia != undefined && this.body.idprovincia != null && this.body.idprovincia != "") {
        this.getComboPoblacion("-1");
        this.isDisabledPoblacion = false;
      } else {
        this.rellenarDireccionPostal();
        this.progressSpinner = false;
      }
    });
  }

  private getComboPoblacion(filtro: string) {
    this.sigaServices.getParam("direcciones_comboPoblacion", "?idProvincia=" + this.body.idprovincia + "&filtro=" + filtro).subscribe((n) => {
      this.comboPoblacion = n.combooItems;
      this.commonsService.arregloTildesCombo(this.comboPoblacion);
      this.rellenarDireccionPostal();
      this.progressSpinner = false;
    });
  }
}
