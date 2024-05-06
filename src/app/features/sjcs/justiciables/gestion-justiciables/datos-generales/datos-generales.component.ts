import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AuthenticationService } from "../../../../../_services/authentication.service";
import { CommonsService } from "../../../../../_services/commons.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate";
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

  constructor(private sigaServices: SigaServices, private translateService: TranslateService, private commonsService: CommonsService, private authenticationService: AuthenticationService) {}

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
      }

      if (!this.modoEdicion) {
        //Si es menor no se guarda la fecha nacimiento hasta que no se le asocie un representante
        if (menorEdadSinRepresentante) {
          this.body.fechanacimiento = undefined;
          this.body.edad = undefined;
        }

        this.callSaveService("gestionJusticiables_createJusticiable");
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
                this.callSaveService("gestionJusticiables_updateJusticiable");
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
              this.callSaveService("gestionJusticiables_updateJusticiable");
            }
          }
        } else {
          this.progressSpinner = false;
        }
      }
    }
  }

  private callSaveService(url) {
    this.comprobarCampos();

    if (!(this.body.fechanacimiento instanceof Date)) {
      this.body.fechanacimiento = null;
    }

    this.body.tipojusticiable = SigaConstants.SCS_JUSTICIABLE;
    this.body.validacionRepeticion = true;
    this.sigaServices.post(url, this.body).subscribe(
      (data) => {
        this.progressSpinner = false;

        //Si se manda un mensaje igual a C significa que el nif del justiciable introducido esta repetido
        if (JSON.parse(data.body).error.message != "C") {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          if (!this.modoEdicion) {
            this.modoEdicion = true;
            let idJusticiable = JSON.parse(data.body).id;
            this.body.idpersona = idJusticiable;
            this.body.idinstitucion = this.authenticationService.getInstitucionSession();
          } else {
            /*
            if (this.modoRepresentante) {
              if (this.persistenceService.getBody() != undefined) {
                let representante = this.persistenceService.getBody();
                representante.nif = this.body.nif;
                this.persistenceService.setBody(representante);
              }
            }
            */
          }
          this.asociarJusticiable();
          this.bodyChange.emit(this.body);

          /*
          if (this.modoRepresentante && !this.checkedViewRepresentante) {
            this.persistenceService.setBody(this.body);
            this.sigaServices.notifyGuardarDatosGeneralesRepresentante(this.body);
          } else if (this.modoRepresentante && this.checkedViewRepresentante) {
            this.sigaServices.notifyGuardarDatosGeneralesRepresentante(this.body);
          } else {
            this.bodyInicial = JSON.parse(JSON.stringify(this.body));
            this.sigaServices.notifyGuardarDatosGeneralesJusticiable(this.body);
          }
          */

          //if (!this.menorEdadJusticiable) {
          //
          //}
          //this.preAsociarJusticiable();
        } else {
          this.callConfirmationSave(JSON.parse(data.body).id);
        }
        //;
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
      () => {
        //Actualizamos la Tarjeta Asuntos
        //this.persistenceService.setDatos(this.body);
        //this.actualizaAsunto.emit(this.body);
        //sessionStorage.removeItem("nuevoJusticiable");
        //if (this.vieneDeJusticiable && this.nuevoJusticiable) {
        //  sessionStorage.setItem("origin", "Nuevo");
        //  this.router.navigate(["/gestionJusticiables"]);
        // ARR: , { queryParams: { rp: "2" } }
        //}
        //ARR: Revisar
      },
    );
  }

  guardarDialog() {
    this.progressSpinner = true;
    if (this.dialogOpcion == "s") {
      this.callSaveService("gestionJusticiables_updateJusticiable");
    } else if (this.dialogOpcion == "n") {
      //Ya esta validada la repeticion y puede crear al justiciable
      this.body.validacionRepeticion = true;
      this.body.asociarRepresentante = true;

      //Indicamos que venimos como nuevo Justiciable editando
      //this.creaNuevoJusticiable = true;
      //this.callSaveService("gestionJusticiables_createJusticiable");
    }
    this.showDialog = false;
  }

  cerrarDialog() {
    this.showDialog = false;
    this.dialogOpcion = "";
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
