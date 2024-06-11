import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/primeng";
import { AuthenticationService } from "../../../../../_services/authentication.service";
import { CommonsService } from "../../../../../_services/commons.service";
import { NotificationService } from "../../../../../_services/notification.service";
import { PersistenceService } from "../../../../../_services/persistence.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate";
import { EJGItem } from "../../../../../models/sjcs/EJGItem";
import { FichaSojItem } from "../../../../../models/sjcs/FichaSojItem";
import { JusticiableItem } from "../../../../../models/sjcs/JusticiableItem";
import { SigaConstants } from "../../../../../utils/SigaConstants";

@Component({
  selector: "app-datos-generales",
  templateUrl: "./datos-generales.component.html",
  styleUrls: ["./datos-generales.component.scss"],
})
export class DatosGeneralesComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura: boolean = true;
  @Input() showTarjeta: boolean = false;
  @Input() body: JusticiableItem;
  @Input() bodyInicial: JusticiableItem;
  @Input() origen: string = "";
  @Input() justiciable: any;
  @Output() bodyChange = new EventEmitter<JusticiableItem>();
  @Output() asuntosChange = new EventEmitter<JusticiableItem>();
  @Output() showDialog = new EventEmitter<string>();

  progressSpinner: boolean = false;
  permisoSave: boolean = false;
  canSave: boolean = true;

  comboTipoPersona;
  comboTipoIdentificacion;
  comboNacionalidad;
  comboIdiomas;
  comboSexo;
  comboEstadoCivil;
  comboRegimenConyugal;
  comboProfesion;
  comboMinusvalia;

  constructor(private sigaServices: SigaServices, private notificationService: NotificationService, private translateService: TranslateService, private router: Router, private confirmationService: ConfirmationService, private commonsService: CommonsService, private authenticationService: AuthenticationService, private persistenceService: PersistenceService) {}

  ngOnInit() {
    this.progressSpinner = true;
    if (this.body.idpersona == null) {
      this.body.idpaisdir1 = "191";
      this.body.sexo = "N";
      this.body.tipopersonajg = "F";
      this.body.fechaalta = new Date();
    }
    this.getCombos();
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  styleObligatorio(evento) {
    this.disabledSave();
    if (evento == undefined || evento == null || evento == "") {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  fillFechaNacimiento(event) {
    let fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    if (event != null && event != undefined) {
      let fechaNacimiento = new Date(event);
      if (fechaNacimiento > fechaActual) {
        this.notificationService.showError(this.translateService.instant("general.message.incorrect"), "La fecha de nacimiento no puede ser una fecha futura.");
        this.canSave = false;
      } else {
        this.body.fechanacimiento = fechaNacimiento;
        this.calculateAge();
        this.canSave = true;
      }
    } else {
      this.body.edad = undefined;
      this.canSave = true;
    }
  }

  rest() {
    if (!this.permisoEscritura) {
      this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      this.body = JSON.parse(JSON.stringify(this.bodyInicial));
      if (this.body.fechanacimiento != undefined && this.body.fechanacimiento != null) {
        this.body.fechanacimiento = new Date(this.body.fechanacimiento);
      }
      if (this.body.fechaalta != undefined && this.body.fechaalta != null) {
        this.body.fechaalta = new Date(this.body.fechaalta);
      }
    }
  }

  save() {
    if (!this.permisoEscritura) {
      this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else if (!this.permisoSave) {
      this.notificationService.showError(this.translateService.instant("general.message.incorrect"), "No puede realizar esa acción");
    } else if (!this.validateIdentification()) {
      if (!this.body.idtipoidentificacion) {
        this.notificationService.showError(this.translateService.instant("general.message.incorrect"), "El campo tipo de identificación es requerido");
      } else {
        this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.identificacionInvalida"));
      }
    } else if (!this.comprobarCampos()) {
      this.progressSpinner = false;
    } else {
      this.progressSpinner = true;
      let menorEdadSinRepresentante = true;
      if (this.body.edad != undefined && JSON.parse(this.body.edad) < SigaConstants.EDAD_ADULTA && this.body.idrepresentantejg == undefined) {
        this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.justiciables.message.asociarRepresentante.menorJusticiable"));
        this.body.fechanacimiento = undefined;
        this.body.edad = undefined;
      } else {
        menorEdadSinRepresentante = false;
      }

      if (!this.modoEdicion) {
        this.callSaveService("gestionJusticiables_createJusticiable", false, false);
      } else {
        if (!menorEdadSinRepresentante) {
          if (this.body.autorizaavisotelematico == "1") {
            if (!(this.body.correoelectronico != undefined && this.body.correoelectronico != "")) {
              this.progressSpinner = false;
              this.notificationService.showInfo(this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.justiciables.message.necesarioCorreoElectronico.recibirNotificaciones"));
            } else {
              if (this.body.numeroAsuntos != undefined && parseInt(this.body.numeroAsuntos) > 1 && this.origen != "") {
                this.progressSpinner = false;
                this.showDialog.emit("tarjetaGenerales");
              } else {
                this.callSaveService("gestionJusticiables_updateJusticiable", true, false);
              }
            }
          } else {
            if (this.body.numeroAsuntos != undefined && parseInt(this.body.numeroAsuntos) > 1 && this.origen != "") {
              this.progressSpinner = false;
              this.showDialog.emit("tarjetaGenerales");
            } else {
              this.callSaveService("gestionJusticiables_updateJusticiable", true, false);
            }
          }
        } else {
          this.progressSpinner = false;
        }
      }
    }
  }

  private callSaveService(url: string, validate: boolean, clonar: boolean) {
    this.comprobarCampos();

    if (!(this.body.fechanacimiento instanceof Date)) {
      this.body.fechanacimiento = null;
    }

    this.body.tipojusticiable = SigaConstants.SCS_JUSTICIABLE;
    this.body.validacionRepeticion = validate;
    this.sigaServices.post(url, this.body).subscribe(
      (data) => {
        //Si se manda un mensaje igual a C significa que el nif del justiciable introducido esta repetido
        if (JSON.parse(data.body).error.message != "C") {
          this.notificationService.showSuccess(this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          if (!this.modoEdicion) {
            let idJusticiable = clonar ? this.body.idpersona : "";
            this.body.idpersona = JSON.parse(data.body).id;
            this.body.idinstitucion = this.authenticationService.getInstitucionSession();
            this.asociarJusticiable(clonar, idJusticiable);
          } else {
            this.progressSpinner = false;
          }
          if (!clonar) {
            this.bodyChange.emit(this.body);
          }
        } else {
          this.progressSpinner = false;
          this.callConfirmationSave();
        }
      },
      (err) => {
        this.progressSpinner = false;
        if (clonar) {
          this.modoEdicion = true;
        }
        if (err.error != undefined && JSON.parse(err.error).error.description != "") {
          if (JSON.parse(err.error).error.code == "600") {
            this.notificationService.showError(this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
          } else {
            this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          }
        } else {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
    );
  }

  guardarDialog(clonar: boolean) {
    this.progressSpinner = true;
    if (clonar) {
      this.crearJusticiable();
    } else {
      this.callSaveService("gestionJusticiables_updateJusticiable", true, false);
    }
  }

  private validateIdentification(): boolean {
    let valid = false;
    if (this.body.nif == undefined || this.body.nif.trim() == "") {
      valid = true;
    } else {
      //let leng = this.body.nif.length;
      if (this.body.idtipoidentificacion == "10") {
        valid = this.commonsService.isValidDNI(this.body.nif);
      } else if (this.body.idtipoidentificacion == "20") {
        valid = this.commonsService.isValidCIF(this.body.nif);
      } else if (this.body.idtipoidentificacion == "30") {
        valid = this.commonsService.isValidPassport(this.body.nif);
      } else if (this.body.idtipoidentificacion == "40") {
        valid = this.commonsService.isValidNIE(this.body.nif);
      } else if (this.body.idtipoidentificacion == "50") {
        valid = this.commonsService.isValidOtro(this.body.nif);
      }
    }
    return valid;
  }

  private crearJusticiable() {
    this.modoEdicion = false;
    this.body.asociarRepresentante = true;
    this.callSaveService("gestionJusticiables_createJusticiable", true, true);
  }

  private callConfirmationSave() {
    this.progressSpinner = false;
    this.confirmationService.confirm({
      key: "cdGeneralesSave",
      message: this.translateService.instant("gratuita.personaJG.mensaje.existeJusticiable.pregunta.crearNuevo"),
      icon: "fa fa-search ",
      accept: () => {
        this.progressSpinner = true;
        this.callSaveService("gestionJusticiables_createJusticiable", true, false);
      },
      reject: () => {},
    });
  }

  private asociarJusticiable(clonar: boolean, idJusticiable: string) {
    if (this.origen == "newUnidadFamiliar" || this.origen == "UnidadFamiliar") {
      // Asociar Nueva Unidad Familiar
      this.insertUniFamiliar(clonar, idJusticiable);
    } else if (this.origen == "newInteresado" || this.origen == "Interesado") {
      // Asociar Nuevo Interesados.
      this.insertInteresado(clonar, idJusticiable);
    } else if (this.origen == "newAsistido" || this.origen == "Asistido") {
      // Asociar Nuevo Asistido
      this.insertAsistido();
    } else if (this.origen == "newContrarioEJG" || this.origen == "ContrarioEJG") {
      // Asociar Nuevo Contrario EJG
      this.insertContrarioEJG(clonar, idJusticiable);
    } else if (this.origen == "newContrario" || this.origen == "Contrario") {
      // Asociar Nuevo Contrario
      this.insertContrario(clonar, idJusticiable);
    } else if (this.origen == "newContrarioAsistencia" || this.origen == "ContrarioAsistencia") {
      // Asociar Nuevo Contrario Asistencia
      this.insertContrarioAsistencia(clonar, idJusticiable);
    } else if (this.origen == "newSoj" || this.origen == "Soj") {
      // Asociar Nuevo SOJ
      this.insertSOJ();
    } else if (this.origen == "newRepresentante" || this.origen == "Representante") {
      // Asociar Nuevo Representante
      this.persistenceService.clearBody();
      this.persistenceService.setBody(this.body);
      this.persistenceService.setDatos(this.justiciable);
      this.router.navigate(["/gestionJusticiables"]);
    } else {
      this.progressSpinner = false;
    }
  }

  private insertUniFamiliar(clonar: boolean, idJusticiable: string) {
    let ejg: EJGItem = this.persistenceService.getDatosEJG();
    let request = [ejg.idInstitucion, this.body.idpersona, ejg.annio, ejg.tipoEJG, ejg.numero, clonar, idJusticiable];
    this.sigaServices.post("gestionejg_insertFamiliarEJG", request).subscribe(
      (data) => {
        this.progressSpinner = false;
        this.notificationService.showSuccess(this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.asuntosChange.emit(this.body);
      },
      (err) => {
        this.progressSpinner = false;
        if (err != undefined && JSON.parse(err.error).error != null) {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
    );
  }

  private insertInteresado(clonar: boolean, idJusticiable: string) {
    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
    let request = [designa.idInstitucion, this.body.idpersona, designa.ano, designa.idTurno, designa.numero, clonar, idJusticiable];
    this.sigaServices.post("designaciones_insertInteresado", request).subscribe(
      (data) => {
        this.progressSpinner = false;
        this.notificationService.showSuccess(this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.asuntosChange.emit(this.body);
      },
      (err) => {
        this.progressSpinner = false;
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
    );
  }

  private insertAsistido() {
    let idAsistencia = sessionStorage.getItem("asistenciaAsistido");
    if (idAsistencia) {
      this.sigaServices.postPaginado("busquedaGuardias_asociarAsistido", "?anioNumero=" + idAsistencia + "&actualizaDatos='S'", this.body).subscribe(
        (data) => {
          this.progressSpinner = false;
          let result = JSON.parse(data["body"]);
          if (result.error) {
            this.notificationService.showError(this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          } else {
            this.notificationService.showSuccess(this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          }
          this.asuntosChange.emit(this.body);
        },
        (err) => {
          this.progressSpinner = false;
        },
      );
    }
  }

  private insertSOJ() {
    let itemSojJusticiable = new FichaSojItem();
    if (sessionStorage.getItem("sojAsistido")) {
      let itemSoj = JSON.parse(sessionStorage.getItem("sojAsistido"));
      itemSojJusticiable.anio = itemSoj.anio;
      itemSojJusticiable.idTipoSoj = itemSoj.idTipoSoj;
      itemSojJusticiable.numero = itemSoj.numero;
      itemSojJusticiable.actualizaDatos = "S";
      itemSojJusticiable.justiciable = this.body;
    }
    if (itemSojJusticiable.numero != undefined || itemSojJusticiable.numero != null) {
      this.sigaServices.post("gestionSoj_asociarSOJ", itemSojJusticiable).subscribe(
        (data) => {
          this.progressSpinner = false;
          let result = JSON.parse(data["body"]);
          if (result.error) {
            this.notificationService.showError(this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          } else {
            this.notificationService.showSuccess(this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          }
          this.asuntosChange.emit(this.body);
        },
        (err) => {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          this.progressSpinner = false;
        },
      );
    }
  }

  private insertContrarioEJG(clonar: boolean, idJusticiable: string) {
    let ejg: EJGItem = this.persistenceService.getDatosEJG();
    let request = [this.body.idpersona, ejg.annio, ejg.tipoEJG, ejg.numero, clonar, idJusticiable];
    this.sigaServices.post("gestionejg_insertContrarioEJG", request).subscribe(
      (data) => {
        this.progressSpinner = false;
        this.notificationService.showSuccess(this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.asuntosChange.emit(this.body);
      },
      (err) => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
    );
  }

  private insertContrario(clonar: boolean, idJusticiable: string) {
    let designa: any = JSON.parse(sessionStorage.getItem("designaItemLink"));
    let request = [designa.idInstitucion, this.body.idpersona, designa.ano, designa.idTurno, designa.numero, clonar, idJusticiable];
    this.sigaServices.post("designaciones_insertContrario", request).subscribe(
      (data) => {
        this.progressSpinner = false;
        this.notificationService.showSuccess(this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.asuntosChange.emit(this.body);
      },
      (err) => {
        this.progressSpinner = false;
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
    );
  }

  private insertContrarioAsistencia(clonar: boolean, idJusticiable: string) {
    let idAsistencia = sessionStorage.getItem("idAsistencia");
    if (idAsistencia) {
      if (clonar) {
        //Si estamos editando un justiciable como nuevo
        let request = [idAsistencia, this.body.idpersona, idJusticiable];
        this.sigaServices.post("busquedaGuardias_actualizarContrario", request).subscribe(
          (data) => {
            this.progressSpinner = false;
            let result = JSON.parse(data["body"]);
            if (result.error) {
              this.notificationService.showError(this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
            } else {
              this.notificationService.showSuccess(this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              sessionStorage.setItem("tarjeta", "idAsistenciaContrarios");
              this.router.navigate(["/fichaAsistencia"]);
            }
            this.asuntosChange.emit(this.body);
          },
          (err) => {
            this.progressSpinner = false;
          },
        );
      } else {
        //Creamos un justiciable desde cero
        let justiciables: JusticiableItem[] = [];
        justiciables.push(this.body);
        this.sigaServices.postPaginado("busquedaGuardias_asociarContrario", "?anioNumero=" + idAsistencia, justiciables).subscribe(
          (data) => {
            this.progressSpinner = false;
            let result = JSON.parse(data["body"]);
            if (result.error) {
              this.notificationService.showError(this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
            } else {
              this.notificationService.showSuccess(this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            }
            this.asuntosChange.emit(this.body);
          },
          (err) => {
            this.progressSpinner = false;
          },
        );
      }
    }
  }

  private comprobarCampos(): boolean {
    let isValid = true;
    let fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

    if (this.body.nombre != null && this.body.nombre.trim() !== "") {
      if (!regex.test(this.body.nombre)) {
        this.notificationService.showError(this.translateService.instant("general.message.incorrect"), "El nombre sólo puede contener letras y espacios.");
        isValid = false;
      }
    }

    if (this.body.apellido1 != null && this.body.apellido1.trim() !== "") {
      if (!regex.test(this.body.apellido1)) {
        this.notificationService.showError(this.translateService.instant("general.message.incorrect"), "El apellido sólo puede contener letras y espacios.");
        isValid = false;
      }
    }

    if (this.body.apellido2 != null && this.body.apellido2.trim() !== "") {
      if (!regex.test(this.body.apellido2)) {
        this.notificationService.showError(this.translateService.instant("general.message.incorrect"), "El apellido sólo puede contener letras y espacios.");
        isValid = false;
      }
    }

    if (this.body.fechanacimiento != null && new Date(this.body.fechanacimiento) > fechaActual) {
      this.notificationService.showError(this.translateService.instant("general.message.incorrect"), "La fecha de nacimiento no puede ser una fecha futura.");
      isValid = false;
    }

    if (this.body.nif != null && this.body.nif != undefined) {
      this.body.nif = this.body.nif.trim();
    }

    if (this.body.edad != null && this.body.edad != undefined) {
      if (!/^\d+$/.test(this.body.edad)) {
        this.notificationService.showError(this.translateService.instant("general.message.incorrect"), "La edad debe contener solo números.");
        isValid = false;
      } else {
        if (this.body.edad.length > 1 && this.body.edad.substring(0, 1) == "0") {
          this.body.edad = this.body.edad.substring(2, this.body.edad.length - 1);
        }
        let edad = parseInt(this.body.edad);
        if (isNaN(edad) || edad < 0) {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), "Edad inválida. Debe ser un número entero no negativo.");
          isValid = false;
        } else if (this.body.edad == "") {
        }
      }
    }
    this.canSave = isValid;
    return isValid;
  }

  updateFormState() {
    this.comprobarCampos();
    this.disabledSave();
  }

  private disabledSave() {
    this.permisoSave = false;
    if (this.body.nombre != undefined && this.body.nombre.trim() != "" && this.body.apellido1 != undefined && this.body.apellido1.trim() != "" && this.body.tipopersonajg != undefined && this.body.tipopersonajg != "" && this.body.sexo != undefined && this.body.sexo != "") {
      this.permisoSave = true;
    }
  }

  private calculateAge() {
    let hoy = new Date();
    let cumpleanos = new Date(this.body.fechanacimiento);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }

    if (edad < 0) {
      this.body.edad = "0";
    } else {
      this.body.edad = JSON.stringify(edad);
    }
  }

  private getCombos() {
    this.getComboSexo();
    this.getComboEstadoCivil();
    this.getComboTipoPersona();
    this.getComboIdiomas();
    this.getComboTiposIdentificacion();
    this.getComboProfesion();
    this.getComboRegimenConyugal();
    this.getComboMinusvalia();
    this.getComboNacionalidad();
  }
  getComboNacionalidad() {
    this.sigaServices.get("solicitudIncorporacion_pais").subscribe((result) => {
      this.comboNacionalidad = result.combooItems;
    });
  }

  private getComboSexo() {
    this.comboSexo = [
      { label: "Hombre", value: "H" },
      { label: "Mujer", value: "M" },
      { label: "No Consta", value: "N" },
    ];
  }

  private getComboTiposIdentificacion() {
    this.sigaServices.get("fichaPersona_tipoIdentificacionCombo").subscribe((n) => {
      this.comboTipoIdentificacion = n.combooItems;
      this.commonsService.arregloTildesCombo(this.comboTipoIdentificacion);
    });
  }

  private getComboEstadoCivil() {
    this.sigaServices.get("fichaColegialGenerales_estadoCivil").subscribe((n) => {
      this.comboEstadoCivil = n.combooItems;
      this.commonsService.arregloTildesCombo(this.comboEstadoCivil);
    });
  }

  private getComboIdiomas() {
    this.sigaServices.get("etiquetas_lenguaje").subscribe((n) => {
      this.comboIdiomas = n.combooItems;
      this.commonsService.arregloTildesCombo(this.comboIdiomas);
    });
  }

  private getComboMinusvalia() {
    this.sigaServices.get("gestionJusticiables_comboMinusvalias").subscribe((n) => {
      this.comboMinusvalia = n.combooItems;
      this.commonsService.arregloTildesCombo(this.comboMinusvalia);
      this.progressSpinner = false;
    });
  }

  private getComboProfesion() {
    this.sigaServices.get("gestionJusticiables_comboProfesiones").subscribe((n) => {
      this.comboProfesion = n.combooItems;
      this.commonsService.arregloTildesCombo(this.comboProfesion);
    });
  }

  private getComboRegimenConyugal() {
    this.comboRegimenConyugal = [
      { label: "Indeterminado", value: "I" },
      { label: "Gananciales", value: "G" },
      { label: "Separación de bienes", value: "S" },
    ];
    this.commonsService.arregloTildesCombo(this.comboRegimenConyugal);
  }

  private getComboTipoPersona() {
    this.comboTipoPersona = [
      { label: "Física", value: "F" },
      { label: "Jurídica", value: "J" },
    ];
    this.commonsService.arregloTildesCombo(this.comboTipoPersona);
  }
}
