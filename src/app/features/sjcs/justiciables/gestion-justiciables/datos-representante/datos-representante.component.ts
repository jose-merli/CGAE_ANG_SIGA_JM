import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { CommonsService } from "../../../../../_services/commons.service";
import { PersistenceService } from "../../../../../_services/persistence.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate";
import { EJGItem } from "../../../../../models/sjcs/EJGItem";
import { JusticiableBusquedaItem } from "../../../../../models/sjcs/JusticiableBusquedaItem";
import { JusticiableItem } from "../../../../../models/sjcs/JusticiableItem";
import { SigaConstants } from "../../../../../utils/SigaConstants";

@Component({
  selector: "app-datos-representante",
  templateUrl: "./datos-representante.component.html",
  styleUrls: ["./datos-representante.component.scss"],
})
export class DatosRepresentanteComponent implements OnInit, OnChanges, OnDestroy {
  //generalBody: JusticiableItem = new JusticiableItem();

  tipoIdentificacion;
  progressSpinner: boolean = false;
  msgs = [];
  nifRepresentante;

  @Input() modoEdicion;
  @Input() showTarjeta;
  @Input() body: JusticiableItem;
  @Input() generalBody: JusticiableItem;
  @Input() checkedViewRepresentante;
  @Input() navigateToJusticiable: boolean = false;
  @Input() fromInteresado;
  @Input() fromContrario;
  @Input() fromContrarioEJG;
  @Input() fromUniFamiliar;
  @Input() tarjetaDatosRepresentante;

  searchRepresentanteGeneral: boolean = false;
  showEnlaceRepresentante: boolean = false;
  esMenorEdad: boolean = false;
  idPersona;
  permisoEscritura: boolean = true;
  representanteValido: boolean = false;
  confirmationAssociate: boolean = false;
  confirmationDisassociate: boolean = false;
  confirmationCreateRepresentante: boolean = false;
  cargaInicial: boolean = false;
  vieneDeJusticiable: boolean = false;
  showDialogRepre: boolean = false;
  dialogAssociate: boolean = true;
  dialogRepreOpcion: String = "";

  @Output() newRepresentante = new EventEmitter<JusticiableItem>();
  @Output() viewRepresentante = new EventEmitter<JusticiableItem>();
  @Output() createJusticiableByUpdateRepresentante = new EventEmitter<JusticiableItem>();
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<String>();
  @Output() bodyChange = new EventEmitter<JusticiableItem>();

  constructor(private router: Router, private sigaServices: SigaServices, private persistenceService: PersistenceService, private confirmationService: ConfirmationService, private translateService: TranslateService, private commonsService: CommonsService) {}

  ngOnInit() {
    this.progressSpinner = true;
    if (this.body != undefined && this.body.idrepresentantejg != undefined) {
      this.generalBody.nif = this.body.idrepresentantejg.toString();
      this.searchRepresentanteByIdPersona();
      this.nifRepresentante = this.generalBody.nif;
      this.cargaInicial = true;
    } else {
      if (this.generalBody != undefined && this.generalBody.nif != undefined) {
        //this.generalBody = this.persistenceService.getBody();
        this.searchRepresentanteByIdPersona();
        this.nifRepresentante = this.generalBody.nif;
        this.cargaInicial = true;
      } else if (sessionStorage.getItem("bodyRepresentante")) {
        this.generalBody = JSON.parse(sessionStorage.getItem("bodyRepresentante"));
        this.nifRepresentante = this.generalBody.nif;
        this.searchRepresentanteByIdPersona();
        this.cargaInicial = true;
        sessionStorage.removeItem("bodyRepresentante");
      } else {
        this.generalBody = new JusticiableItem();
      }
    }

    this.getTiposIdentificacion();
    this.persistenceService.clearFiltrosAux();

    this.validateShowEnlaceepresentante();

    this.progressSpinner = false;

    if (sessionStorage.getItem("origin") != "newRepresentante" && sessionStorage.getItem("origin") != "newInteresado" && sessionStorage.getItem("origin") != "newContrario" && sessionStorage.getItem("origin") != "newAsistido" && sessionStorage.getItem("origin") != "newContrarioAsistencia" && sessionStorage.getItem("origin") != "UnidadFamiliar" && sessionStorage.getItem("origin") != "newContrarioEJG" && sessionStorage.getItem("origin") != "newSoj") {
      this.vieneDeJusticiable = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Comprobar Si tiene representante el Justiciable Seleccionado.
    /*if (
			!this.navigateToJusticiable &&
			this.persistenceService.getBody() != undefined &&
			this.body != undefined &&
			this.body.idpersona != undefined
		) */
    if (this.body != undefined && this.body != null && this.body.idrepresentantejg != null && this.body.idrepresentantejg != undefined && this.cargaInicial) {
      if (this.persistenceService.getBody() != null) {
        this.generalBody = this.persistenceService.getBody();

        //Si tiene nif lo volvemos a buscar
        if (this.generalBody.nif != undefined && this.generalBody.nif != "") {
          this.searchRepresentanteByIdPersona();
          this.nifRepresentante = this.generalBody.nif;
          //Si no tiene se mantiene el que guardamos
        } else {
          if (this.persistenceService.getBody().nombreSolo != undefined && this.persistenceService.getBody().nombreSolo != null) {
            this.generalBody.nombre = this.persistenceService.getBody().nombreSolo;
          }

          if (this.persistenceService.getBody().apellido1 != undefined && this.persistenceService.getBody().apellido1 != null) {
            this.generalBody.apellidos = this.persistenceService.getBody().apellido1;
          }

          if (this.persistenceService.getBody().apellido2 != undefined && this.persistenceService.getBody().apellido2 != null) {
            this.generalBody.apellidos += " " + this.persistenceService.getBody().apellido2;
          }
        }
      }
      this.compruebaDNI();
      this.showTarjeta = true;
      this.searchRepresentanteGeneral = true;
    } else if (this.nifRepresentante != undefined) {
      this.generalBody.nif = this.nifRepresentante;
      this.searchRepresentanteByNif();
    } else {
      this.generalBody = new JusticiableItem();
    }

    //Se comprueba si proviene del enlace de navegacion del representante, si es ese caso
    if (this.navigateToJusticiable) {
      //Se comprueba si ese representante tiene representante asignado, comprobamos que que el cambio de informacion se haya realizado para ver la ficha del representante
      /*if (
				this.body != undefined &&
				this.body.idrepresentantejg != undefined &&
				(this.generalBody.idpersona == undefined || this.generalBody.idpersona == null) &&
				this.idPersona != undefined &&
				this.idPersona != null &&
				this.idPersona == this.body.idpersona
			) */
      if (this.body.idrepresentantejg != null) {
        this.showTarjeta = true;
        //this.searchJusticiableNew();
      } else if (this.idPersona != undefined && this.idPersona != null && this.idPersona == this.body.idpersona) {
        this.showTarjeta = false;
        this.generalBody = new JusticiableItem();
      }
    } else {
      //En caso de venir de un punto de la app, comprobamos que el justiciable tenga representante
      if (this.body != undefined && this.body.idrepresentantejg != undefined && (this.generalBody.idpersona == undefined || this.generalBody.idpersona == null)) {
        this.searchJusticiable();
      } else {
        if (this.generalBody != undefined && this.generalBody.idpersona != undefined && this.generalBody.idpersona != null) {
          this.showTarjeta = true;
        } else {
          this.showTarjeta = false;
        }
      }
    }

    this.validateShowEnlaceepresentante();

    this.sigaServices.guardarDatosGeneralesJusticiable$.subscribe((data) => {
      this.body = data;
      this.modoEdicion = true;
      this.validateShowEnlaceepresentante();
    });

    this.sigaServices.guardarDatosGeneralesRepresentante$.subscribe((data) => {
      this.body = data;
      this.modoEdicion = true;
      this.validateShowEnlaceepresentante();
    });

    if (this.tarjetaDatosRepresentante == true) this.showTarjeta = this.tarjetaDatosRepresentante;
  }

  validateShowEnlaceepresentante() {
    if (this.body != undefined && this.body.idrepresentantejg != undefined && this.body.idrepresentantejg != null) {
      this.showEnlaceRepresentante = true;
    } else {
      this.showEnlaceRepresentante = false;
    }
  }

  onHideTarjeta() {
    if (this.modoEdicion && !this.checkedViewRepresentante) {
      this.showTarjeta = !this.showTarjeta;
    }
    this.opened.emit(this.showTarjeta); // Emit donde pasamos el valor de la Tarjeta Representantes.
    this.idOpened.emit("Representantes"); // Constante para abrir la Tarjeta de Representantes.
  }

  searchJusticiable() {
    this.progressSpinner = true;
    let bodyBusqueda = new JusticiableBusquedaItem();
    bodyBusqueda.idpersona = this.body.idrepresentantejg.toString();
    bodyBusqueda.idinstitucion = this.body.idinstitucion;

    this.sigaServices.post("gestionJusticiables_searchJusticiable", bodyBusqueda).subscribe(
      (n) => {
        this.generalBody = JSON.parse(n.body).justiciable;
        this.nifRepresentante = this.generalBody.nif;
        this.persistenceService.clearBody();
        this.progressSpinner = false;
        // this.navigateToJusticiable = false;
        this.compruebaDNI();
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }

  searchJusticiableNew() {
    this.progressSpinner = true;
    let bodyBusqueda = new JusticiableBusquedaItem();
    bodyBusqueda.idpersona = this.body.idrepresentantejg.toString();
    bodyBusqueda.idinstitucion = this.body.idinstitucion;

    this.sigaServices.post("gestionJusticiables_searchJusticiable", bodyBusqueda).subscribe(
      (n) => {
        this.generalBody = JSON.parse(n.body).justiciable;
        //this.nifRepresentante = this.generalBody.nif;
        this.persistenceService.clearBody();
        this.progressSpinner = false;
        // this.navigateToJusticiable = false;
        this.compruebaDNI();
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }

  getTiposIdentificacion() {
    this.sigaServices.get("fichaPersona_tipoIdentificacionCombo").subscribe(
      (n) => {
        this.tipoIdentificacion = n.combooItems;
        this.progressSpinner = false;
      },
      (err) => {
        //console.log(err);
        this.progressSpinner = false;
      },
    );
  }

  checkPermisoEscritura() {}

  search() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      this.persistenceService.clearBody();
      sessionStorage.setItem("origin", "newRepresentante");
      if (this.fromUniFamiliar) sessionStorage.setItem("fichaJust", "UnidadFamiliar");
      // if(this.fromInteresado)sessionStorage.setItem("fichaJust", "Interesado");
      // if(this.fromContrario)sessionStorage.setItem("fichaJust", "Contrario");
      // if(this.fromContrarioEJG)sessionStorage.setItem("fichaJust", "ContrarioEJG");
      this.router.navigate(["/justiciables"], { queryParams: { rp: "1" } });
    }
  }

  checkPermisosSearchRepresentanteByNif() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.searchRepresentanteByNif();
    }
  }

  searchRepresentanteByNif() {
    if (this.generalBody.nif.trim() != undefined && this.generalBody.nif.trim() != "") {
      this.progressSpinner = true;
      let bodyBusqueda = new JusticiableBusquedaItem();
      bodyBusqueda.nif = this.generalBody.nif;

      this.sigaServices.post("gestionJusticiables_getJusticiableByNif", bodyBusqueda).subscribe(
        (n) => {
          this.generalBody = JSON.parse(n.body).justiciable;
          this.nifRepresentante = this.generalBody.nif;
          this.progressSpinner = false;
          this.compruebaDNI();

          if (this.generalBody.idpersona == null || this.generalBody.idpersona == undefined) {
            this.callServiceConfirmationCreateRepresentante();
          }
        },
        (err) => {
          this.progressSpinner = false;
        },
      );
    }
  }

  searchRepresentanteByIdPersona() {
    if (this.generalBody.idpersona != undefined) {
      if (this.generalBody.idpersona.trim() != undefined && this.generalBody.idpersona.trim() != "") {
        this.progressSpinner = true;
        let bodyBusqueda = new JusticiableBusquedaItem();
        bodyBusqueda.idpersona = this.generalBody.idpersona;

        this.sigaServices.post("gestionJusticiables_getJusticiableByIdPersona", bodyBusqueda).subscribe(
          (n) => {
            this.generalBody = JSON.parse(n.body).justiciable;
            this.nifRepresentante = this.generalBody.nif;
            //this.body.idrepresentantejg = Number(this.generalBody.idpersona);
            this.progressSpinner = false;
            this.compruebaDNI();
          },
          (err) => {
            this.progressSpinner = false;
          },
        );
      }
    }
  }

  disabledSave() {
    if (this.generalBody.idpersona != undefined && this.generalBody.idpersona != "" && this.representanteValido) {
      return false;
    } else {
      return true;
    }
  }

  disabledDisassociate() {
    if (this.generalBody.idpersona != undefined && this.generalBody.idpersona != "") {
      return false;
    } else {
      return true;
    }
  }

  callServiceConfirmationCreateRepresentante() {
    let message = this.translateService.instant("justiciaGratuita.justiciables.message.crearNuevoRepresentante");
    this.confirmationCreateRepresentante = true;
    this.confirmationService.confirm({
      key: "cdCreateRepresentante",
      message: message,
      icon: "fa fa-search ",
      accept: () => {
        this.showTarjeta = false;
        let generalBodySend = JSON.parse(JSON.stringify(this.generalBody));
        this.generalBody = new JusticiableItem();
        this.newRepresentante.emit(generalBodySend);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Info",
            detail: this.translateService.instant("general.message.accion.cancelada"),
          },
        ];
      },
    });
  }

  compruebaDNI() {
    if (this.generalBody.nif != undefined && this.generalBody.nif != "" && this.generalBody.nif != null) {
      let idTipoIdentificacion = this.commonsService.compruebaDNI(this.generalBody.idtipoidentificacion, this.generalBody.nif);
      this.generalBody.idtipoidentificacion = idTipoIdentificacion;
      this.representanteValido = true;

      if (this.nifRepresentante != undefined) {
        if (this.generalBody.nif != this.nifRepresentante) {
          this.representanteValido = false;
        } else {
          this.representanteValido = true;
        }
      }
    } else {
      this.representanteValido = true;
    }
  }

  compruebaDNIInput() {
    if (this.generalBody.nif != undefined && this.generalBody.nif.trim() != "" && this.generalBody.nif != null) {
      let idTipoIdentificacion = this.commonsService.compruebaDNI(this.generalBody.idtipoidentificacion, this.generalBody.nif);
      this.generalBody.idtipoidentificacion = idTipoIdentificacion;

      if (this.generalBody.nif != this.nifRepresentante) {
        this.representanteValido = false;
        this.generalBody.nombre = undefined;
        this.generalBody.apellidos = undefined;
      } else {
        this.representanteValido = true;
      }
    } else {
      this.generalBody.idtipoidentificacion = undefined;
      this.representanteValido = false;
      this.generalBody.nombre = undefined;
      this.generalBody.apellidos = undefined;
    }
  }

  checkPermisosAssociate() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      if (this.disabledSave()) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), "No puede realizar esa acción");
      } else {
        this.associate();
      }
    }
  }

  private associate() {
    if (this.body.numeroAsuntos != undefined && parseInt(this.body.numeroAsuntos) > 1 && !this.vieneDeJusticiable && this.body.nif != null) {
      this.dialogAssociate = true;
      this.showDialogRepre = true;
    } else {
      if (this.generalBody.idpersona != undefined && this.generalBody.idpersona != null && this.generalBody.idpersona.trim() != "") {
        if (this.generalBody.nif != undefined && this.generalBody.nif != "" && this.generalBody.nif != null && this.body != undefined && this.generalBody.nif == this.body.nif) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.justiciables.message.representanteNoPuedeSerPropioJusticiable"));
          this.representanteValido = false;
        } else {
          this.body.idrepresentantejg = Number(this.generalBody.idpersona);
          this.callServiceAssociate();
        }
      }
    }
  }

  checkPermisosDisassociate() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      if (this.disabledDisassociate()) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), "No puede realizar esa acción");
      } else {
        this.disassociate();
      }
    }
  }

  private disassociate() {
    if (this.body.numeroAsuntos != undefined && this.body.numeroAsuntos != "0") {
      this.dialogAssociate = false;
      this.showDialogRepre = true;
    } else {
      if (this.body.edad == undefined || (this.body.edad != undefined && JSON.parse(this.body.edad) > SigaConstants.EDAD_ADULTA)) {
        this.callServiceDisassociate();
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.justiciables.message.asociarRepresentante.menorJusticiable"));
      }
    }
  }

  private callServiceAssociate() {
    this.progressSpinner = true;

    if (this.fromInteresado) {
      let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
      let request = [designa.idInstitucion, sessionStorage.getItem("personaDesigna"), designa.ano, designa.idTurno, designa.numero, this.generalBody.apellidos.concat(",", this.generalBody.nombre)];
      this.sigaServices.post("designaciones_updateRepresentanteInteresado", request).subscribe(
        (n) => {
          this.bodyChange.emit(this.body);
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.persistenceService.setBody(this.generalBody);
        },
        (err) => {
          this.progressSpinner = false;
          this.translateService.instant("general.message.error.realiza.accion");
        },
      );
    } else if (this.fromContrario) {
      let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
      let request = [designa.idInstitucion, sessionStorage.getItem("personaDesigna"), designa.ano, designa.idTurno, designa.numero, this.generalBody.apellidos.concat(",", this.generalBody.nombre)];
      this.sigaServices.post("designaciones_updateRepresentanteContrario", request).subscribe(
        (n) => {
          this.bodyChange.emit(this.body);
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.persistenceService.setBody(this.generalBody);
        },
        (err) => {
          this.progressSpinner = false;
          this.translateService.instant("general.message.error.realiza.accion");
        },
      );
    } else if (this.fromContrarioEJG) {
      let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));
      let request = [sessionStorage.getItem("personaDesigna"), ejg.annio, ejg.numero, ejg.tipoEJG, this.generalBody.apellidos.concat(",", this.generalBody.nombre), this.generalBody.idpersona];
      this.sigaServices.post("gestionejg_updateRepresentanteContrarioEJG", request).subscribe(
        (n) => {
          this.bodyChange.emit(this.body);
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.persistenceService.setBody(this.generalBody);
        },
        (err) => {
          this.progressSpinner = false;
          this.translateService.instant("general.message.error.realiza.accion");
        },
      );
    } else {
      this.sigaServices.post("gestionJusticiables_associateRepresentante", this.body).subscribe(
        (n) => {
          this.bodyChange.emit(this.body);
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.showEnlaceRepresentante = true;
          this.persistenceService.setBody(this.generalBody);
        },
        (err) => {
          this.progressSpinner = false;
          this.translateService.instant("general.message.error.realiza.accion");
        },
      );
    }
  }

  private callServiceDisassociate() {
    this.progressSpinner = true;

    if (this.fromInteresado) {
      let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
      let request = [designa.idInstitucion, sessionStorage.getItem("personaDesigna"), designa.ano, designa.idTurno, designa.numero, ""];
      this.sigaServices.post("designaciones_updateRepresentanteInteresado", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.persistenceService.setBody(this.generalBody);
        },
        (err) => {
          this.progressSpinner = false;
          this.translateService.instant("general.message.error.realiza.accion");
        },
      );
      this.generalBody = null;
    } else if (this.fromContrario) {
      let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
      let request = [designa.idInstitucion, sessionStorage.getItem("personaDesigna"), designa.ano, designa.idTurno, designa.numero, ""];
      this.sigaServices.post("designaciones_updateRepresentanteContrario", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.persistenceService.setBody(this.generalBody);
        },
        (err) => {
          this.progressSpinner = false;
          this.translateService.instant("general.message.error.realiza.accion");
        },
      );
      this.generalBody = null;
    } else if (this.fromContrarioEJG) {
      let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));
      let request = [sessionStorage.getItem("personaDesigna"), ejg.annio, ejg.numero, ejg.tipoEJG, "", null];
      this.sigaServices.post("gestionejg_updateRepresentanteContrarioEJG", request).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.persistenceService.setBody(this.generalBody);
        },
        (err) => {
          this.progressSpinner = false;
          this.translateService.instant("general.message.error.realiza.accion");
        },
      );
      this.body.idrepresentantejg = undefined;
      this.rest();
    } else {
      this.sigaServices.post("gestionJusticiables_disassociateRepresentante", this.body).subscribe(
        (n) => {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.generalBody = new JusticiableItem();
          this.nifRepresentante = undefined;
          this.persistenceService.setBody(this.generalBody);
          this.body.idrepresentantejg = undefined;
          this.showEnlaceRepresentante = false;
          this.progressSpinner = false;
          this.showEnlaceRepresentante = false;
        },
        (err) => {
          this.progressSpinner = false;
          this.translateService.instant("general.message.error.realiza.accion");
        },
      );
    }
  }

  navigateToRepresentante() {
    if (this.generalBody.idpersona != undefined && this.generalBody.idpersona != null && this.generalBody.idpersona != "") {
      this.commonsService.scrollTop();
      this.idPersona = this.generalBody.idpersona;
      this.viewRepresentante.emit(this.generalBody);
    }
  }

  checkPermisosRest() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      this.rest();
    }
  }

  rest() {
    if (this.body.idrepresentantejg != undefined) {
      this.searchJusticiable();
    } else {
      this.generalBody = new JusticiableItem();
      this.nifRepresentante = undefined;
    }
  }

  private showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg,
    });
  }

  clear() {
    this.msgs = [];
  }

  ngOnDestroy(): void {
    this.generalBody = new JusticiableItem();
    this.nifRepresentante = undefined;
  }

  guardarDialog() {
    if (this.dialogRepreOpcion == undefined || this.dialogRepreOpcion == "") {
      this.showMessage("info", "info", "Debes seleccionar una opción");
    } else {
      if (this.dialogRepreOpcion == "s") {
        if (this.dialogAssociate) {
          if (this.generalBody.idpersona != undefined && this.generalBody.idpersona != null && this.generalBody.idpersona.trim() != "") {
            if (this.generalBody.nif != undefined && this.generalBody.nif != "" && this.generalBody.nif != null && this.body != undefined && this.generalBody.nif == this.body.nif) {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.justiciables.message.representanteNoPuedeSerPropioJusticiable"));
              this.representanteValido = false;
            } else {
              this.body.idrepresentantejg = Number(this.generalBody.idpersona);
              this.callServiceAssociate();
            }
          }
        } else {
          if (this.body.edad == undefined || (this.body.edad != undefined && JSON.parse(this.body.edad) > SigaConstants.EDAD_ADULTA)) {
            this.callServiceDisassociate();
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.justiciables.message.asociarRepresentante.menorJusticiable"));
          }
        }
      } else if (this.dialogRepreOpcion == "n") {
        this.progressSpinner = true;
        this.body.idrepresentantejg = this.dialogAssociate ? Number(this.generalBody.idpersona) : undefined;
        this.body.validacionRepeticion = true;
        this.body.asociarRepresentante = true;
        this.sigaServices.post("gestionJusticiables_createJusticiable", this.body).subscribe(
          (data) => {
            let idJusticiable = JSON.parse(data.body).id;
            this.body.idpersona = idJusticiable;
            this.createJusticiableByUpdateRepresentante.emit(this.body);
            this.progressSpinner = false;
          },
          (err) => {
            if (JSON.parse(err.error).error.description != "") {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
            } else {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
            }
            this.progressSpinner = false;
          },
        );
      }
      this.showDialogRepre = false;
    }
  }

  cerrarDialog() {
    this.showDialogRepre = false;
  }
}
