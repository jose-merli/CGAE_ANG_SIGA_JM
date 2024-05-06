import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CommonsService } from "../../../../../_services/commons.service";
import { PersistenceService } from "../../../../../_services/persistence.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate";
import { JusticiableItem } from "../../../../../models/sjcs/JusticiableItem";
import { UnidadFamiliarEJGItem } from "../../../../../models/sjcs/UnidadFamiliarEJGItem";

@Component({
  selector: "app-datos-unidad-familiar",
  templateUrl: "./datos-unidad-familiar.component.html",
  styleUrls: ["./datos-unidad-familiar.component.scss"],
})
export class DatosUnidadFamiliarComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura: boolean = true;
  @Input() showTarjeta: boolean = false;
  @Input() body: JusticiableItem;
  @Input() unidadFamiliar: UnidadFamiliarEJGItem;
  @Output() bodyChange = new EventEmitter<JusticiableItem>();
  @Output() notificacion = new EventEmitter<any>();

  progressSpinner: boolean = false;

  impTotal: String = "";
  parentescoCabecera: String = "";
  nombreGrupoLab: String = "";
  initialUnidadFamiliar: UnidadFamiliarEJGItem;

  comboGrupoLaboral: any = [];
  comboParentesco: any = [];
  comboTipoIng: any = [];
  comboRol: any[];

  constructor(private router: Router, private sigaServices: SigaServices, private persistenceService: PersistenceService, private commonsService: CommonsService, private translateService: TranslateService) {}

  ngOnInit() {
    this.progressSpinner = true;
    this.combos();
    this.updateResumen();
  }

  styleObligatorio(evento) {
    if (evento == undefined || evento == null || evento == "") {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  rest() {
    this.unidadFamiliar = JSON.parse(JSON.stringify(this.initialUnidadFamiliar));
  }

  save() {
    if (this.validateCampos()) {
      this.progressSpinner = true;

      this.sigaServices.post("gestionJusticiables_updateUnidadFamiliar", this.unidadFamiliar).subscribe(
        (n) => {
          this.progressSpinner = false;

          if (JSON.parse(n.body).error.code == 200) {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

            //Se realiza la asignacion de esta manera para evitar que la variable cambie los valores igual que la variable generalBody.
            this.initialUnidadFamiliar = JSON.parse(JSON.stringify(this.unidadFamiliar));

            //Si se selecciona el valor "Unidad Familiar" en el desplegable "Rol/Solicitante"
            if (this.unidadFamiliar.uf_enCalidad == "1") {
              this.unidadFamiliar.uf_solicitante = "0";
            }
            //Si se selecciona el valor "Solicitante" o "Solicitante principal" en el desplegable "Rol/Solicitante"
            if (this.unidadFamiliar.uf_enCalidad == "2" || this.unidadFamiliar.uf_enCalidad == "3") {
              this.unidadFamiliar.uf_solicitante = "1";
            }

            this.updateResumen();

            this.bodyChange.emit(this.body);
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        },
        (err) => {
          this.progressSpinner = false;
          if (JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        },
      );
    }
  }

  private validateCampos() {
    let valid = true;
    //En el caso que no se haya rellenado el campo de parentesco
    if (this.unidadFamiliar.idParentesco == null || this.unidadFamiliar.uf_enCalidad == null) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
      valid = false;
    } else if (this.unidadFamiliar.idParentesco == 3) {
      //Parentesco hija
      if (this.body.fechanacimiento == null) {
        //Si no tiene fecha determinada, no se continua con el guardado.
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.justiciables.unidadFamiliar.errorHijo"));
        valid = false;
      }
    }
    return valid;
  }

  private updateResumen() {
    //Se comprueba si se debe cambiar el valor de parentesco de la cabecera
    if (this.unidadFamiliar.idParentesco != null && this.unidadFamiliar.idParentesco != undefined) {
      this.comboParentesco.forEach((element) => {
        if (element.value == this.unidadFamiliar.idParentesco) this.parentescoCabecera = element.label;
      });
    } else {
      this.parentescoCabecera = "";
    }

    //Se comprueba si se debe cambiar el valor de parentesco de la cabecera
    if (this.unidadFamiliar.idTipoGrupoLab != null && this.unidadFamiliar.idTipoGrupoLab != undefined) {
      this.comboGrupoLaboral.forEach((element) => {
        if (element.value == this.unidadFamiliar.idTipoGrupoLab) this.nombreGrupoLab = element.label;
      });
    } else {
      this.nombreGrupoLab = "";
    }

    if (this.unidadFamiliar.impOtrosBienes != null || this.unidadFamiliar.impOtrosBienes != undefined || this.unidadFamiliar.impIngrAnuales != null || this.unidadFamiliar.impOtrosBienes != undefined || this.unidadFamiliar.impBienesMu != null || this.unidadFamiliar.impOtrosBienes != undefined || this.unidadFamiliar.impBienesInmu != null || this.unidadFamiliar.impOtrosBienes != undefined) {
      let importe = this.unidadFamiliar.impOtrosBienes + this.unidadFamiliar.impIngrAnuales + this.unidadFamiliar.impBienesMu + this.unidadFamiliar.impBienesInmu;
      this.impTotal = importe.toString();
    } else {
      this.impTotal = "";
    }

    this.progressSpinner = false;
  }

  private showMessage(severity, summary, msg) {
    this.notificacion.emit({
      severity: severity,
      summary: summary,
      detail: msg,
    });
  }

  private combos() {
    this.getComboRol();
    this.getComboGruposLaborales();
    this.getComboParentesco();
    this.getComboTiposIngresos();
  }

  private getComboRol() {
    this.comboRol = [
      { label: this.translateService.instant("justiciaGratuita.justiciables.rol.unidadFamiliar"), value: "1" },
      { label: this.translateService.instant("justiciaGratuita.justiciables.rol.solicitante"), value: "2" },
      { label: this.translateService.instant("justiciaGratuita.justiciables.unidadFamiliar.solicitantePrincipal"), value: "3" },
    ];
  }

  private getComboGruposLaborales() {
    this.sigaServices.get("gestionJusticiables_comboGruposLaborales").subscribe((n) => {
      this.comboGrupoLaboral = n.combooItems;
      this.commonsService.arregloTildesCombo(this.comboGrupoLaboral);
    });
  }

  private getComboParentesco() {
    this.progressSpinner = true;
    this.sigaServices.get("gestionJusticiables_comboParentesco").subscribe((n) => {
      this.comboParentesco = n.combooItems;
      this.commonsService.arregloTildesCombo(this.comboParentesco);
    });
  }

  private getComboTiposIngresos() {
    this.sigaServices.get("gestionJusticiables_comboTiposIngresos").subscribe(
      (n) => {
        this.comboTipoIng = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTipoIng);
        this.progressSpinner = false;
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }

  /*
  solicitanteCabecera: String = "";
  parentescoCabecera: String = "";
  nombreGrupoLab: String = "";

  //solicitanteBox: boolean = false;
  incapacitadoBox: boolean = false;
  cirExcepBox: boolean = false;
  impTotal: String = "";

  disableSol: boolean = false;



  progressSpinner: boolean = false;
  permisoEscritura: boolean = false;
  msgs: Message[] = [];


  showTarjeta: boolean = false;
  resaltadoDatos: boolean = false;

  @Input() modoEdicion;
  @Input() body: JusticiableItem;
  @Input() checkedViewRepresentante;
  @Input() navigateToJusticiable: boolean = false;
  @Input() fromUniFamiliar: boolean = false;
  @Input() solicitante: JusticiableItem = null;
  @Input() tarjetaDatosUnidadFamiliar;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<String>();
  @Output() bodyChange = new EventEmitter<JusticiableItem>();


  constructor(private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService, private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    this.getComboGruposLaborales();
    this.getComboParentesco();
    this.getComboTiposIngresos();

    if (this.fromUniFamiliar) {
      this.permisoEscritura = true;
    }

    //Familiar que se ha seleccionado en el EJG
    if (sessionStorage.getItem("Familiar")) {
      let data = JSON.parse(sessionStorage.getItem("Familiar"));

      this.generalBody = data;
      //Comprobamos el rol - fmansilla como solucion rapida utilizo lo establecido en la tarjeta pero habria que trasladar el dato del solicitante principal
      if (this.generalBody.labelEnCalidad == "Unidad Familiar") {
        this.generalBody.uf_enCalidad = "1";
      }
      //Si se selecciona el valor "Solicitante" en el desplegable "Rol/Solicitante"
      if (this.generalBody.labelEnCalidad == "Solicitante") {
        this.generalBody.uf_enCalidad = "2";
      }
      //Si se selecciona el valor "Solicitante principal" en el desplegable "Rol/Solicitante"
      if (this.generalBody.labelEnCalidad == "Solicitante principal") {
        this.generalBody.uf_enCalidad = "3";
      }
      //Se realiza la asignacion de esta manera para evitar que la variable cambie los valores
      //igual que la variable generalBody.
      this.initialBody = JSON.parse(JSON.stringify(data));

      //Le asignamos valores a las cajas (checks).
      this.fillBoxes();
    } else {

      let data = new UnidadFamiliarEJGItem();

      this.generalBody = data;
      //Se realiza la asignacion de esta manera para evitar que la variable cambie los valores
      //igual que la variable generalBody.
      this.initialBody = JSON.parse(JSON.stringify(data));

      //Le asignamos valores a las cajas (checks).
      this.fillBoxes();

    }

    // Importe Total de Valores
    this.sumarImpTotal();

    //Asignacion del parentesco de "No informado" por defecto en el caso que no este definido
    if (this.generalBody.idParentesco == null) this.generalBody.idParentesco = -1;

    if (this.solicitante != null && this.solicitante.idpersona != this.generalBody.uf_idPersona) this.disableSol = true;
    this.progressSpinner = false;

  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (this.solicitante != null && this.solicitante.idpersona != this.generalBody.uf_idPersona) this.disableSol = true;
    if (this.tarjetaDatosUnidadFamiliar == true) this.showTarjeta = this.tarjetaDatosUnidadFamiliar;
  }

  checkSave() {
    let pass = true;
    //En el caso que no se haya rellenado el campo de parentesco
    if (this.generalBody.idParentesco == null) {
      this.muestraCamposObligatorios();
      pass = false;
    }
    //Parentesco hija
    else if (this.generalBody.idParentesco == 3) {
      //Si no tiene fecha determinada, no se continua con el guardado.
      if (this.body.fechanacimiento == null) {
        this.showMessage("error", this.translateService.instant('general.message.incorrect'),
          this.translateService.instant('justiciaGratuita.justiciables.unidadFamiliar.errorHijo'));
        pass = false;
      }
    }

    if (this.generalBody.uf_enCalidad == null) {
      this.muestraCamposObligatorios();
      pass = false;
    }
    if (pass) this.save();
  }

  save() {
    this.progressSpinner = true;

    //Introducimos los valores que tienen los checkbox al objeto.
    // if (this.solicitanteBox) this.generalBody.uf_solicitante = "1";
    // else this.generalBody.uf_solicitante = "0";
    //Valor de la casilla "Incapacitado"
    if (this.incapacitadoBox) this.generalBody.incapacitado = 1;
    else this.generalBody.incapacitado = 0;

    //Valor de la casilla "Circunstacias Excepcionales"
    if (this.cirExcepBox) this.generalBody.circunsExcep = 1;
    else this.generalBody.circunsExcep = 0;

    this.sigaServices.post("gestionJusticiables_updateUnidadFamiliar", this.generalBody).subscribe(
      n => {

        this.progressSpinner = false;

        if (JSON.parse(n.body).error.code == 200) {
          this.showMessage("success", this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
          //Se actualiza el familiar guardado en la sessionstorage para que presente los valores correctos si se realiza una busqueda despues de guardar cambios.
          sessionStorage.setItem("Familiar", JSON.stringify(this.generalBody));
          //Se realiza la asignacion de esta manera para evitar que la variable cambie los valores
          //igual que la variable generalBody.
          this.initialBody = JSON.parse(JSON.stringify(this.generalBody));
          //Se comprueba si se debe cambiar el valor de parentesco de la cabecera 
          if (this.generalBody.idParentesco != null && this.generalBody.idParentesco != undefined) {
            this.comboParentesco.forEach(element => {
              if (element.value == this.generalBody.idParentesco) this.parentescoCabecera = element.label;
            });
          } else this.parentescoCabecera = "";
          //Se comprueba si se debe cambiar el valor de solicitante de la cabecera
          this.fillBoxes();


          //Se comprueba si se debe cambiar el valor de parentesco de la cabecera 
          if (this.generalBody.idTipoGrupoLab != null && this.generalBody.idTipoGrupoLab != undefined) {
            this.comboGrupoLaboral.forEach(element => {
              if (element.value == this.generalBody.idTipoGrupoLab) this.nombreGrupoLab = element.label;
            });
          } else {
            this.nombreGrupoLab = "";
          }

          // Importe Total de Valores
          this.sumarImpTotal();

          //Si se selecciona el valor "Unidad Familiar" en el desplegable "Rol/Solicitante"
          if (this.generalBody.uf_enCalidad == "1") {
            this.generalBody.uf_solicitante = "0"
          }
          //Si se selecciona el valor "Solicitante" en el desplegable "Rol/Solicitante"
          if (this.generalBody.uf_enCalidad == "2") {
            this.generalBody.uf_solicitante = "1"
          }
          //Si se selecciona el valor "Solicitante principal" en el desplegable "Rol/Solicitante"
          if (this.generalBody.uf_enCalidad == "3") {
            this.generalBody.uf_solicitante = "1"
          }

          //Si se ha actualizado o añadido un solicitante principal, se actualizan los datos del ejg asociado
          if (this.generalBody.uf_enCalidad == "3") {
            //Si estamos en la creacion de una nueva unidad familiar 
            if (sessionStorage.getItem("EJGItem")) {
              let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));
              ejg.idPersonajg = this.generalBody.uf_idPersona;
              sessionStorage.setItem("EJGItem", JSON.stringify(ejg));
            }
            //Si se esta editando una unidad familiar desde su tarjeta en ejg
            else if (this.persistenceService.getDatos()) {
              let ejg: EJGItem = this.persistenceService.getDatos();
              ejg.idPersonajg = this.generalBody.uf_idPersona;
              this.persistenceService.setDatos(ejg);
            }
          }

          this.bodyChange.emit(this.body);
        } else {
          this.showMessage("error", this.translateService.instant('general.message.incorrect'),
            this.translateService.instant('general.message.error.realiza.accion'));
        }

      },
      err => {
        if (JSON.parse(err.error).error.description != '') {
          this.showMessage(
            'error',
            this.translateService.instant('general.message.incorrect'),
            this.translateService.instant(JSON.parse(err.error).error.description)
          );
        } else {
          this.showMessage(
            'error',
            this.translateService.instant('general.message.incorrect'),
            this.translateService.instant('general.message.error.realiza.accion')
          );
        }
        this.progressSpinner = false;
      }
    )
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode >= 44 && charCode <= 57) {
      return true;
    }
    else {
      return false;
    }

  }


  
  */
}
