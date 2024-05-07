import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/primeng";
import { AuthenticationService } from "../../../../../_services/authentication.service";
import { CommonsService } from "../../../../../_services/commons.service";
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
  @Input() origen: string;
  @Input() justiciable: any;
  @Output() bodyChange = new EventEmitter<JusticiableItem>();
  @Output() notificacion = new EventEmitter<any>();

  progressSpinner: boolean = false;
  permisoSave: boolean = false;
  showDialog: boolean = false;

  edadAdulta: number = 18;
  bodyInicial: JusticiableItem;
  dialogOpcion: String = "";

  comboTipoPersona;
  comboTipoIdentificacion;
  comboNacionalidad;
  comboIdiomas;
  comboSexo;
  comboEstadoCivil;
  comboRegimenConyugal;
  comboProfesion;
  comboMinusvalia;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService, private router: Router, private confirmationService: ConfirmationService, private commonsService: CommonsService, private authenticationService: AuthenticationService, private persistenceService: PersistenceService) {}

  ngOnInit() {
    this.getCombos();
    if (this.body != null && this.body.idpersona != null) {
      this.modoEdicion = true;
      this.disabledSave();
    } else {
      this.body = new JusticiableItem();
      this.body.idpaisdir1 = "191";
      this.body.sexo = "N";
      this.body.tipopersonajg = "F";
      this.body.fechaalta = new Date();
    }
    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
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
    if (event != null && event != undefined) {
      this.body.fechanacimiento = event;
      this.calculateAge();
    } else {
      this.body.edad = undefined;
    }
  }

  rest() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
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
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else if (!this.permisoSave) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), "No puede realizar esa acción");
    } else {
      this.progressSpinner = true;
      let menorEdadSinRepresentante = true;
      if ((this.body.edad != undefined && JSON.parse(this.body.edad) < this.edadAdulta && this.body.idrepresentantejg != undefined) || this.body.edad == undefined || (this.body.edad != undefined && JSON.parse(this.body.edad) >= this.edadAdulta)) {
        menorEdadSinRepresentante = false;
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.justiciables.message.asociarRepresentante.menorJusticiable"));
        //Si es menor no se guarda la fecha nacimiento hasta que no se le asocie un representante
        this.body.fechanacimiento = undefined;
        this.body.edad = undefined;
      }

      if (!this.modoEdicion) {
        this.callSaveService("gestionJusticiables_createJusticiable", false);
      } else {
        if (!menorEdadSinRepresentante) {
          //Comprueba que si autorizaavisotelematico el correo no se pueda borrar
          if (this.body.autorizaavisotelematico == "1") {
            if (!(this.body.correoelectronico != undefined && this.body.correoelectronico != "")) {
              this.progressSpinner = false;
              this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.justiciables.message.necesarioCorreoElectronico.recibirNotificaciones"));
            } else {
              if (this.body.numeroAsuntos != undefined && parseInt(this.body.numeroAsuntos) > 1) {
                this.progressSpinner = false;
                //&& !this.vieneDeJusticiable && this.body.nif != null
                this.callConfirmationUpdate();
              } else {
                this.callSaveService("gestionJusticiables_updateJusticiable", true);
              }
            }
          } else {
            //Si tiene mas de un asunto preguntamos el dialog de guardar en todos o como nuevo
            if (this.body.numeroAsuntos != undefined && parseInt(this.body.numeroAsuntos) > 1) {
              this.progressSpinner = false;
              //&& !this.vieneDeJusticiable && this.body.nif != null
              this.callConfirmationUpdate();
            } else {
              //Si no tiene mas asuntos directamente guardamos sin preguntar
              this.callSaveService("gestionJusticiables_updateJusticiable", true);
            }
          }
        } else {
          this.progressSpinner = false;
        }
      }
    }
  }

  private callSaveService(url, validate) {
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
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          if (!this.modoEdicion) {
            this.modoEdicion = true;
            let idJusticiable = JSON.parse(data.body).id;
            this.body.idpersona = idJusticiable;
            this.body.idinstitucion = this.authenticationService.getInstitucionSession();
            this.asociarJusticiable();
          } else {
            this.progressSpinner = false;
          }
          this.bodyChange.emit(this.body);
        } else {
          this.progressSpinner = false;
          this.callConfirmationSave(JSON.parse(data.body).id);
        }
      },
      (err) => {
        this.progressSpinner = false;
        if (err.error != undefined && JSON.parse(err.error).error.description != "") {
          if (JSON.parse(err.error).error.code == "600") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          }
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
    );
  }

  guardarDialog() {
    this.progressSpinner = true;
    if (this.dialogOpcion == "s") {
      this.callSaveService("gestionJusticiables_updateJusticiable", true);
    } else if (this.dialogOpcion == "n") {
      //Ya esta validada la repeticion y puede crear al justiciable
      this.body.validacionRepeticion = true;
      this.body.asociarRepresentante = true;

      //Indicamos que venimos como nuevo Justiciable editando
      //this.creaNuevoJusticiable = true;
      //this.callSaveService("gestionJusticiables_createJusticiable", false);
    }
    this.showDialog = false;
  }

  cerrarDialog() {
    this.showDialog = false;
    this.dialogOpcion = "";
  }

  compruebaDNI() {
    if (this.body.nif != undefined && this.body.nif.trim() != "" && this.body.nif != null) {
      if (this.commonsService.isValidDNI(this.body.nif)) {
        this.body.idtipoidentificacion = "10";
      } else if (this.commonsService.isValidPassport(this.body.nif)) {
        this.body.idtipoidentificacion = "30";
      } else if (this.commonsService.isValidNIE(this.body.nif)) {
        this.body.idtipoidentificacion = "40";
      } else if (this.commonsService.isValidCIF(this.body.nif)) {
        this.body.idtipoidentificacion = "20";
      } else {
        this.body.idtipoidentificacion = "30";
      }
    } else {
      this.body.idtipoidentificacion = undefined;
    }
  }

  private callConfirmationSave(id) {
    this.progressSpinner = false;
    this.confirmationService.confirm({
      key: "cdGeneralesSave",
      message: this.translateService.instant("gratuita.personaJG.mensaje.existeJusticiable.pregunta.crearNuevo"),
      icon: "fa fa-search ",
      accept: () => {
        this.progressSpinner = true;
        this.callSaveService("gestionJusticiables_createJusticiable", true);
      },
      reject: () => {},
    });
  }

  private asociarJusticiable() {
    if (this.origen == "UnidadFamiliar") {
      // Asociar Nueva Unidad Familiar
      this.insertUniFamiliar();
    } else if (this.origen == "newInteresado") {
      // Asociar Nuevo Interesados.
      this.insertInteresado();
    } else if (this.origen == "newAsistido") {
      // Asociar Nuevo Asistido
      this.insertAsistido();
    } else if (this.origen == "newContrarioEJG") {
      // Asociar Nuevo Contrario EJG
      this.insertContrarioEJG();
    } else if (this.origen == "newContrario") {
      // Asociar Nuevo Contrario
      this.insertContrario();
    } else if (this.origen == "newContrarioAsistencia") {
      // Asociar Nuevo Contrario Asistencia
      this.insertContrarioAsistencia();
    } else if (this.origen == "newSoj") {
      // Asociar Nuevo SOJ
      this.insertSOJ();
    } else if (this.origen == "newRepresentante") {
      // Asociar Nuevo Representante
      this.persistenceService.clearBody();
      this.persistenceService.setBody(this.body);
      this.persistenceService.setDatos(this.justiciable);
      this.router.navigate(["/gestionJusticiables"]);
    } else {
      this.progressSpinner = false;
    }
  }

  private insertUniFamiliar() {
    let ejg: EJGItem = this.persistenceService.getDatosEJG();
    let request = [ejg.idInstitucion, this.body.idpersona, ejg.annio, ejg.tipoEJG, ejg.numero, false, ""];
    this.sigaServices.post("gestionejg_insertFamiliarEJG", request).subscribe(
      (data) => {
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        //Para que se abra la tarjeta de unidad familiar y se haga scroll a ella
        sessionStorage.setItem("tarjeta", "unidadFamiliar");
        this.router.navigate(["/gestionEjg"]);
      },
      (err) => {
        this.progressSpinner = false;
        if (err != undefined && JSON.parse(err.error).error != null) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
    );
  }

  private insertInteresado() {
    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
    let request = [designa.idInstitucion, this.body.idpersona, designa.ano, designa.idTurno, designa.numero, false, ""];
    this.sigaServices.post("designaciones_insertInteresado", request).subscribe(
      (data) => {
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        sessionStorage.removeItem("origin");
        sessionStorage.setItem("tarjeta", "sjcsDesigInt");
        sessionStorage.setItem("creaInsertaJusticiableDesigna", "true");
        this.router.navigate(["/fichaDesignaciones"]);
      },
      (err) => {
        this.progressSpinner = false;
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
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
            this.showMessage("error", this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          } else {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            this.router.navigate(["/fichaAsistencia"]);
          }
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
            this.showMessage("error", this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          } else {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            this.router.navigate(["/detalle-soj"]);
          }
        },
        (err) => {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          this.progressSpinner = false;
        },
      );
    }
  }

  private insertContrarioEJG() {
    let ejg: EJGItem = this.persistenceService.getDatosEJG();
    let request = [this.body.idpersona, ejg.annio, ejg.tipoEJG, ejg.numero, false, ""];
    this.sigaServices.post("gestionejg_insertContrarioEJG", request).subscribe(
      (data) => {
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        sessionStorage.removeItem("origin");
        sessionStorage.setItem("tarjeta", "contrariosPreDesigna");
        this.router.navigate(["/gestionEjg"]);
      },
      (err) => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
    );
  }

  private insertContrario() {
    let designa: any = JSON.parse(sessionStorage.getItem("designaItemLink"));
    //let datosInteresado = JSON.parse(sessionStorage.getItem("fichaJusticiable"));
    let request = [designa.idInstitucion, this.body.idpersona, designa.ano, designa.idTurno, designa.numero, false, ""];
    this.sigaServices.post("designaciones_insertContrario", request).subscribe(
      (data) => {
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        sessionStorage.removeItem("origin");
        sessionStorage.setItem("tarjeta", "sjcsDesigContra");
        this.router.navigate(["/fichaDesignaciones"]);
      },
      (err) => {
        this.progressSpinner = false;
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
    );
  }

  private insertContrarioAsistencia() {
    let idAsistencia = sessionStorage.getItem("idAsistencia");
    if (idAsistencia) {
      //Si estamos editando un justiciable como nuevo
      /*
      if (this.creaNuevoJusticiable) {
        let contrarios: ContrarioItem[] = [];
        let contrarioI: ContrarioItem;

        //Recupero el justiciable antiguo editado
        let fichaJusticiable = JSON.parse(sessionStorage.getItem("fichaJusticiable"));

        let request = [idAsistencia, justiciable.idpersona, fichaJusticiable.idpersona];

        contrarios.push(contrarioI);

        this.sigaServices.post("busquedaGuardias_actualizarContrario", request).subscribe(
          (data) => {
            this.progressSpinner = false;
            let result = JSON.parse(data["body"]);
            if (result.error) {
              this.showMessage("error", this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
            } else {
              this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              sessionStorage.setItem("tarjeta", "idAsistenciaContrarios");
              this.router.navigate(["/fichaAsistencia"]);
            }
          },
          (err) => {
            this.progressSpinner = false;
          },
        );
      } else {
      */
      //Creamos un justiciable desde cero
      let justiciables: JusticiableItem[] = [];
      justiciables.push(this.body);
      this.sigaServices.postPaginado("busquedaGuardias_asociarContrario", "?anioNumero=" + idAsistencia, justiciables).subscribe(
        (data) => {
          this.progressSpinner = false;
          let result = JSON.parse(data["body"]);
          if (result.error) {
            this.showMessage("error", this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          } else {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            sessionStorage.setItem("tarjeta", "idAsistenciaContrarios");
            this.router.navigate(["/fichaAsistencia"]);
          }
        },
        (err) => {
          this.progressSpinner = false;
        },
      );
      //}
    }
  }

  private callConfirmationUpdate() {
    this.showDialog = true;
  }

  private comprobarCampos() {
    if (this.body.nombre != null && this.body.nombre != undefined) {
      this.body.nombre = this.body.nombre.trim();
    }
    if (this.body.apellido1 != null && this.body.apellido1 != undefined) {
      this.body.apellido1 = this.body.apellido1.trim();
    }
    if (this.body.apellido2 != null && this.body.apellido2 != undefined) {
      this.body.apellido2 = this.body.apellido2.trim();
    }
    if (this.body.nif != null && this.body.nif != undefined) {
      this.body.nif = this.body.nif.trim();
    }
  }

  private disabledSave() {
    this.permisoSave = false;
    if (this.body.nombre != undefined && this.body.nombre.trim() != "" && this.body.apellido1 != undefined && this.body.apellido1.trim() != "" && this.body.tipopersonajg != undefined && this.body.tipopersonajg != "" && this.body.sexo != undefined && this.body.sexo != "") {
      this.permisoSave = true;
    }
  }

  private showMessage(severity, summary, msg) {
    this.notificacion.emit({
      severity: severity,
      summary: summary,
      detail: msg,
    });
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
