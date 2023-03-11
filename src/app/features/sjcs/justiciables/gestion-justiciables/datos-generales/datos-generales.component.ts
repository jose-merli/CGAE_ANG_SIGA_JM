import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService } from 'primeng/components/common/api';
import { TranslateService } from '../../../../../commons/translate';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { JusticiableTelefonoItem } from '../../../../../models/sjcs/JusticiableTelefonoItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../../../../../_services/authentication.service';
import { Router } from '@angular/router';
import { SigaConstants } from '../../../../../utils/SigaConstants';
import { procesos_maestros } from '../../../../../permisos/procesos_maestros';
import { procesos_justiciables } from '../../../../../permisos/procesos_justiciables';
import { Checkbox, ConfirmDialog } from '../../../../../../../node_modules/primeng/primeng';
import { Dialog, DialogModule } from 'primeng/primeng';
import { UnidadFamiliarEJGItem } from '../../../../../models/sjcs/UnidadFamiliarEJGItem';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { FichaSojItem } from '../../../../../models/sjcs/FichaSojItem';
@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.scss']
})
export class DatosGeneralesComponent implements OnInit, OnChanges {

  bodyInicial;
  datosInicial;
  progressSpinner: boolean = false;

  edadAdulta: number = 18;
  modoEdicion: boolean = false;
  msgs;
  comboTipoIdentificacion;
  comboSexo;
  comboTipoPersona;
  comboEstadoCivil;
  comboIdiomas;
  comboProfesion;
  comboRegimenConyugal;
  comboMinusvalia;
  comboPais;
  comboNacionalidad;
  comboProvincia;
  poblacionBuscada;
  comboPoblacion;
  comboTipoVia;
  nuevoJusticiable: boolean = false;
  showConfirmacion: boolean = false;
  vieneDeJusticiable: boolean = false;

  provinciaSelecionada;
  isDisabledPoblacion: boolean = true;
  isDisabledProvincia: boolean = true;
  codigoPostalValido;
  poblacionExtranjera: boolean = true;
  justiciableBusquedaItem: JusticiableBusquedaItem;
  cols;
  datos: JusticiableTelefonoItem[] = [];
  checkOtraProvincia;

  edicionEmail: boolean = false;
  emailValido: boolean = true;
  faxValido: boolean = true;
  cpValido: boolean = true;
  resultadosPoblaciones;

  permisoEscritura: boolean = true;
  nuevoTelefono: boolean = false;
  personaRepetida: boolean = false;
  modoRepre: boolean = false;
  searchJusticiable: boolean = false;
  nuevoInteresado: boolean = false;
  nuevoContrario: boolean = false;
  nuevoAsistido: boolean = false;
  nuevoContrarioAsistencia: boolean = false;
  nuevaUniFamiliar: boolean = false;
  nuevoContrarioEJG: boolean = false;
  nuevoSoj: boolean = false;

  count: number = 1;
  selectedDatos = [];
  rowsPerPage: any = [];

  selectedItem: number = 10;
  selectAll: boolean = false;
  numSelected = 0;
  selectMultiple: boolean = false;

  selectionMode = "";

  @ViewChild("provincia") checkbox: Checkbox;
  @ViewChild("cdGeneralesUpdate") cdGeneralesUpdate: Dialog;
  @ViewChild("cdGeneralesSave") cdGeneralesSave: Dialog;
  @ViewChild("cdPreferenteSms") cdPreferenteSms: Dialog;
  @ViewChild("table") tabla;

  @Output() modoEdicionSend = new EventEmitter<any>();
  @Output() notifySearchJusticiableByNif = new EventEmitter<any>();
  @Output() newJusticiable = new EventEmitter<any>();
  @Output() searchJusticiableOverwritten = new EventEmitter<any>();
  @Output() opened = new EventEmitter<Boolean>();  // Evento para abrir la tarjeta
  @Output() idOpened = new EventEmitter<String>(); // Evento para pasar la Información.
  @Output() actualizaAsunto = new EventEmitter();

  @Input() showTarjeta;
  @Input() fromJusticiable;
  @Input() fromUniFamiliar: boolean = false;
  @Input() body: JusticiableItem;
  @Input() modoRepresentante;
  @Input() checkedViewRepresentante;
  @Input() tarjetaDatosGenerales;  // Tarjeta Datos Generales para comprobar su estado.


  confirmationSave: boolean = false;
  confirmationUpdate: boolean = false;
  nuevoRepresentante: boolean = false;
  tipoPersona;
  guardaOpcion: String;
  menorEdadJusticiable: boolean = false;

  generalBody: UnidadFamiliarEJGItem;
  initialBody: UnidadFamiliarEJGItem;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {

    this.progressSpinner = true;

    if (sessionStorage.getItem("origin") == "newRepresentante") {
      this.nuevoRepresentante = true;
    } else if (sessionStorage.getItem("origin") == "newInteresado") {
      this.nuevoInteresado = true;
    } else if (sessionStorage.getItem("origin") == "newContrario") {
      this.nuevoContrario = true;
    } else if (sessionStorage.getItem("origin") == "newAsistido") {
      this.nuevoAsistido = true;
    } else if (sessionStorage.getItem("origin") == "newContrarioAsistencia") {
      this.nuevoContrarioAsistencia = true;
    } else if (sessionStorage.getItem("origin") == "UnidadFamiliar") {
      this.nuevaUniFamiliar = true;
    } else if (sessionStorage.getItem("origin") == "newContrarioEJG") {
      this.nuevoContrarioEJG = true;
    } else if (sessionStorage.getItem("origin") == "newSoj") {
      this.nuevoSoj = true;
    }else {
      this.vieneDeJusticiable = true;
    }


    if (this.body != undefined && this.body.idpersona != undefined) {
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));

      this.parseFechas();

    } else {
      this.body = new JusticiableItem();
      if (sessionStorage.getItem("nif")) {
        this.body.nif = sessionStorage.getItem("nif");
        this.compruebaDNI();
        sessionStorage.removeItem("nif");
      }
    }

    //Obligatorio pais españa
    this.body.idpaisdir1 = "191";

    if (this.body.idpersona == undefined) {
      this.modoEdicion = false;
      this.body.fechaalta = new Date();
    } else {
      this.modoEdicion = true;

      if (this.body.idprovincia != undefined && this.body.idprovincia != null &&
        this.body.idprovincia != "") {
        this.isDisabledPoblacion = false;
      } else {
        this.isDisabledPoblacion = true;
      }

    }

    this.progressSpinner = false;

    this.sigaServices.guardarDatosSolicitudJusticiable$.subscribe((data) => {
      this.body.autorizaavisotelematico = data.autorizaavisotelematico;
      this.body.asistidoautorizaeejg = data.asistidoautorizaeejg;
      this.body.asistidosolicitajg = data.asistidosolicitajg;
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    });

    this.getCombos();
    this.getColsDatosContacto();
    this.getDatosContacto();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.progressSpinner = true;

    if (this.body != undefined) {
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      this.getDatosContacto();
      this.parseFechas();
    } else {
      this.body = new JusticiableItem();
      this.progressSpinner = false;
    }

    //Obligatorio pais españa
    this.body.idpaisdir1 = "191";

    if (this.body.idpersona == undefined) {
      this.modoEdicion = false;
      this.body.fechaalta = new Date();
    } else {
      this.modoEdicion = true;

      if (this.body.idprovincia != undefined && this.body.idprovincia != null &&
        this.body.idprovincia != "") {
        this.isDisabledPoblacion = false;
      } else {
        this.isDisabledPoblacion = true;
      }
    }

    this.styleObligatorio(this.body.nombre);
    if (this.body.nif != undefined && this.body.nif != null && this.body.nif != "") {
      this.compruebaDNI();
    }

    // Comprobar que la tarjeta general venga rellena y la mostramos.
    if (this.tarjetaDatosGenerales == true) this.showTarjeta = this.tarjetaDatosGenerales;
  }

  parseFechas() {
    if (this.body.fechanacimiento != undefined && this.body.fechanacimiento != null) {
      this.calculateAge();
      let fechaNacimiento = new Date(this.body.fechanacimiento);
      this.body.fechanacimiento = fechaNacimiento;
    }

    if (this.body.fechaalta != undefined && this.body.fechaalta != null) {
      let fechaAlta = new Date(this.body.fechaalta);
      this.body.fechaalta = fechaAlta;
    }

  }

  getCombos() {
    this.getComboSexo();
    this.getComboEstadoCivil();
    this.getComboTipoPersona();
    this.getComboIdiomas();
    this.getComboTiposIdentificacion();
    this.getComboProfesion();
    this.getComboRegimenConyugal();
    this.getComboMinusvalia();
    this.getComboPais();
    this.getComboProvincia();
    this.getComboTipoVia();
  }

  checkInteresado(justiciable) {
    let interesados: any = sessionStorage.getItem("interesados");
    if (interesados != "") interesados = JSON.parse(interesados);
    let exist = false;

    let filtros: JusticiableBusquedaItem = new JusticiableBusquedaItem();

    if (this.persistenceService.getFiltrosAux() != undefined) {
      filtros = this.persistenceService.getFiltrosAux();
    }
    else filtros = this.persistenceService.getFiltros();

    if (interesados == "" || filtros.idRol == "1") exist = false;
    else {
      //Comprobamos que el justiciable no esta ya en la designacion
      interesados.forEach(element => {
        if (element.idPersona == justiciable.idpersona) exist = true;
      });
    }

    return !exist;
  }

  insertInteresado(justiciable) {
    this.progressSpinner = true;

    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));

    let request = [designa.idInstitucion, justiciable.idpersona, designa.ano, designa.idTurno, designa.numero]
    this.sigaServices.post("designaciones_insertInteresado", request).subscribe(
      data => {
        sessionStorage.removeItem('origin');
        sessionStorage.setItem('tarjeta', 'sjcsDesigInt');
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        this.router.navigate(["/fichaDesignaciones"]);
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
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

  checkContrario(justiciable) {

    let contrarios: any = sessionStorage.getItem("contrarios");
    let exist = false;
    if (contrarios != "") contrarios = JSON.parse(contrarios);

    if (contrarios == "") exist = false;
    else {
      //Comprobamos que el justiciable no esta ya en la designacion
      contrarios.forEach(element => {
        if (element.idPersona == justiciable.idpersona) exist = true;
      });
    }

    return !exist;
  }

  insertContrario(justiciable) {
    this.progressSpinner = true;

    let designa: any = JSON.parse(sessionStorage.getItem("designaItemLink"));

    let request = [designa.idInstitucion, justiciable.idpersona, designa.ano, designa.idTurno, designa.numero]
    this.sigaServices.post("designaciones_insertContrario", request).subscribe(
      data => {
        sessionStorage.removeItem('origin');
        sessionStorage.setItem('tarjeta', 'sjcsDesigContra');
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        this.router.navigate(["/fichaDesignaciones"]);
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
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


  asociarAsistido(justiciable: JusticiableItem) {

    let idAsistencia = sessionStorage.getItem("asistenciaAsistido");
    if (idAsistencia) {

      this.sigaServices
        .postPaginado("busquedaGuardias_asociarAsistido", "?anioNumero=" + idAsistencia + "&actualizaDatos='S'", justiciable)
        .subscribe(
          data => {
            let result = JSON.parse(data["body"]);
            if (result.error) {
              this.showMessage('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
            } else {
              this.showMessage('success', this.translateService.instant("general.message.accion.realizada"), '');
              this.router.navigate(["/fichaAsistencia"]);
            }

          },
          err => {
            //console.log(err);
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
          }
        );

    }

  }

  asociarContrarioAsistencia(justiciable: JusticiableItem) {

    let idAsistencia = sessionStorage.getItem("idAsistencia");
    sessionStorage.setItem('tarjeta', 'idAsistenciaContrarios');
    let justiciables: JusticiableItem[] = []
    justiciables.push(justiciable);
    if (idAsistencia) {

      this.sigaServices
        .postPaginado("busquedaGuardias_asociarContrario", "?anioNumero=" + idAsistencia, justiciables)
        .subscribe(
          data => {
            let result = JSON.parse(data["body"]);
            if (result.error) {
              this.showMessage('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
            } else {
              this.showMessage('success', this.translateService.instant("general.message.accion.realizada"), '');
              this.router.navigate(["/fichaAsistencia"]);
            }

          },
          err => {
            //console.log(err);
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
          }
        );

    }
  }

  checkContrarioEJG(justiciable) {

    let contrarios: any = sessionStorage.getItem("contrariosEJG");
    let exist = false;
    if (contrarios != "") contrarios = JSON.parse(contrarios);

    if (contrarios == "") exist = false;
    else {
      //Comprobamos que el justiciable no esta ya en la designacion
      contrarios.forEach(element => {
        if (element.idPersona == justiciable.idpersona) exist = true;
      });
    }

    return !exist;
  }

  insertContrarioEJG(justiciable) {
    this.progressSpinner = true;

    let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));


    let request = [justiciable.idpersona, ejg.annio, ejg.tipoEJG, ejg.numero]
    this.sigaServices.post("gestionejg_insertContrarioEJG", request).subscribe(
      data => {
        sessionStorage.removeItem('origin');
        sessionStorage.setItem('tarjeta', 'contrariosPreDesigna');
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        this.persistenceService.setDatosEJG(JSON.parse(sessionStorage.getItem("EJGItem")));
        sessionStorage.removeItem("EJGItem");
        this.router.navigate(["/gestionEjg"]);
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
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

  checkUniFamiliar(justiciable) {
    let datosFamiliares: any = sessionStorage.getItem("datosFamiliares");
    if (datosFamiliares != "") datosFamiliares = JSON.parse(datosFamiliares);
    let exist = false;

    if (datosFamiliares == "") exist = false;
    else {
      //Comprobamos que el justiciable no esta ya en la designacion
      datosFamiliares.forEach(element => {
        if (element.uf_idPersona == justiciable.idpersona && element.fechaBaja == null) exist = true;
      });
    }

    return !exist;
  }

  insertUniFamiliar(justiciable) {
    this.progressSpinner = true;

    let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));


    let request = [ejg.idInstitucion, justiciable.idpersona, ejg.annio, ejg.tipoEJG, ejg.numero]
    this.sigaServices.post("gestionejg_insertFamiliarEJG", request).subscribe(
      data => {
        sessionStorage.removeItem('origin');
        //Para que se abra la tarjeta de unidad familiar y se haga scroll a ella
        sessionStorage.setItem('tarjeta', 'unidadFamiliar');
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        //this.router.navigate(["/gestionEjg"]);
        //Para prevenir que se vaya a una ficha en blanco despues de que se haya creado un justiciable
        this.persistenceService.setDatosEJG(JSON.parse(sessionStorage.getItem("EJGItem")));
        sessionStorage.removeItem("EJGItem");
        this.router.navigate(["/gestionEjg"]);
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error != null) {
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


  checkPermisosSave() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

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
    this.body.validacionRepeticion = false;

    if ((this.body.edad != undefined && JSON.parse(this.body.edad) < this.edadAdulta && this.body.idrepresentantejg != undefined) || this.body.edad == undefined
      || (this.body.edad != undefined && JSON.parse(this.body.edad) >= this.edadAdulta)) {
      this.menorEdadJusticiable = false;

    } else {
      this.menorEdadJusticiable = true;
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.justiciables.message.asociarRepresentante.menorJusticiable"));
    }

    if (!this.modoEdicion) {
      //Si es menor no se guarda la fehca nacimiento hasta que no se le asocie un representante
      if (this.menorEdadJusticiable) {
        this.body.fechanacimiento = undefined;
        this.body.edad = undefined;
      }

      url = "gestionJusticiables_createJusticiable";
      this.validateCampos(url);
    } else {

      if (!this.menorEdadJusticiable) {
        url = "gestionJusticiables_updateJusticiable";
        //Comprueba que si autorizaavisotelematico el correo no se pueda borrar
        if (this.bodyInicial.autorizaavisotelematico == "1") {
          if (!(this.body.correoelectronico != undefined && this.body.correoelectronico != "")) {
            this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.justiciables.message.necesarioCorreoElectronico.recibirNotificaciones"));
            this.progressSpinner = false;
          } else {

            if (this.body.numeroAsuntos != undefined && this.body.numeroAsuntos != "0" && !this.vieneDeJusticiable) {
              this.callConfirmationUpdate();

            } else {
              let url = "gestionJusticiables_updateJusticiable";
              this.validateCampos(url);
            }
          }
        } else {
          if (this.body.numeroAsuntos != undefined && this.body.numeroAsuntos != "0" && !this.vieneDeJusticiable) {
            this.callConfirmationUpdate();

          } else {
            let url = "gestionJusticiables_updateJusticiable";
            this.validateCampos(url);
          }
        }

      } else {
        this.progressSpinner = false;
      }
    }
  }

  asociarJusticiable() {
    let icon = "fa fa-edit";
    /*let message = "¿ Deseas asociar el justiciable ?";//this.translateService.instant("justiciaGratuita.justiciables.message.cambiarTelefonoPreferente");

    this.confirmationService.confirm({
      key: "cdAsociarJusticiable",
      message: message,
      icon: icon,
      accept: () => {*/
        // Asociar para Interesados.
        if (this.nuevoInteresado) {
          if (this.checkInteresado(this.body)) {
            this.insertInteresado(this.body);
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.designas.interesados.existente"));
          }
          // Asociar para Contrarios.
        } else if (this.nuevoContrario) {
          if (this.checkContrario(this.body)) {
            this.insertContrario(this.body);
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.existente"));
          }
          // Asociar para Asistido
        } else if (this.nuevoAsistido) {
          this.asociarAsistido(this.body);
          // Asociar para Nuevo Contrario Asistencia
        } else if (this.nuevoContrarioAsistencia) {

          if (this.checkContrario(this.body)) {
            this.asociarContrarioAsistencia(this.body);
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.existente"))
          }
          // Asociar para Nuevo Contrario EJG
        } else if (this.nuevoContrarioEJG) {
          if (this.checkContrarioEJG(this.body)) {
            this.insertContrarioEJG(this.body);
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.existente"));
          }
        }
        // Asociar para Nueva Unidad Familiar
        else if (this.nuevaUniFamiliar) {
          if (this.checkUniFamiliar(this.body)) {
            this.insertUniFamiliar(this.body);
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.ejg.uniFamiliar.existente"));
          }
        }
        // Asociar para Nuevo Representante
        else if (this.modoRepre) {
          this.persistenceService.clearBody();
          this.persistenceService.setBody(this.body);
          //sessionStorage.setItem("newRepresentante",JSON.stringify(evento));
          //this.router.navigate(["/gestionJusticiables"]);
          if (sessionStorage.getItem("fichaJust") != null) {
            sessionStorage.setItem("origin", sessionStorage.getItem("fichaJust"));
            sessionStorage.removeItem("fichaJust");

          }
        } else {
          let filtros: JusticiableBusquedaItem = new JusticiableBusquedaItem();
          if (filtros.idRol == "2") {
            let fichasPosibles = this.persistenceService.getFichasPosibles();
            fichasPosibles[6].activa = true;
            fichasPosibles[7].activa = true;
            this.persistenceService.setFichasPosibles(fichasPosibles);

          }
        }

      /*},
      reject: () => {
        this.showMessage("info", "Cancelada", this.translateService.instant("general.message.accion.cancelada"));
      }
    });*/
  }

  asociarSOJ(justiciable){
    let itemSojJusticiable = new FichaSojItem();
    if (sessionStorage.getItem("sojAsistido")) {
      let itemSoj = JSON.parse(sessionStorage.getItem("sojAsistido"));
      itemSojJusticiable.anio = itemSoj.anio;
      itemSojJusticiable.idTipoSoj = itemSoj.idTipoSoj;
      itemSojJusticiable.numero = itemSoj.numero;
      itemSojJusticiable.actualizaDatos = "S"; 
      itemSojJusticiable.justiciable = justiciable; 
    }
    if (itemSojJusticiable != undefined || itemSojJusticiable != null ) {
      this.sigaServices
        .post("gestionSoj_asociarSOJ", itemSojJusticiable)
        .subscribe(
          data => {
            let result = JSON.parse(data["body"]);
            if (result.error) {
              this.showMessage('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
            } else {
              this.showMessage('success', this.translateService.instant("general.message.accion.realizada"), '');
              this.router.navigate(["/detalle-soj"]);
            }

          },
          err => {
            this.showMessage('error', this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
          }
        );
    }
  }

  validateCampos(url) {

    if (this.body.nombre != null && this.body.nombre != undefined) {
      this.body.nombre = this.body.nombre.trim();
    }

    if (this.body.apellido1 != null && this.body.apellido1 != undefined) {
      this.body.apellido1 = this.body.apellido1.trim();
    }

    if (this.body.apellido2 != null && this.body.apellido2 != undefined) {
      this.body.apellido2 = this.body.apellido2.trim();
    }

    if (this.body.codigopostal != null && this.body.codigopostal != undefined) {
      this.body.codigopostal = this.body.codigopostal.trim();
    }

    if (this.body.nif != null && this.body.nif != undefined) {
      this.body.nif = this.body.nif.trim();
    }

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

    if (this.body.puertadir != null && this.body.puertadir != undefined) {
      this.body.puertadir = this.body.puertadir.trim();
    }

    if (this.body.correoelectronico != null && this.body.correoelectronico != undefined) {
      this.body.correoelectronico = this.body.correoelectronico.trim();
    }

    if (this.body.fax != null && this.body.fax != undefined) {
      this.body.fax = this.body.fax.trim();
    }
    this.callSaveService(url);
  }

  callSaveService(url) {

    if (this.body.edad != undefined) {
      this.body.edad = this.body.edad;
    }

    if (this.datos != undefined && this.datos.length > 0) {
      let arrayTelefonos = JSON.parse(JSON.stringify(this.datos));
      arrayTelefonos.splice(0, 2);

      for (let index = 0; index < arrayTelefonos.length; index++) {
        arrayTelefonos[index].numeroTelefono = arrayTelefonos[index].numeroTelefono.trim();

        if (arrayTelefonos[index].preferenteSmsCheck) {
          arrayTelefonos[index].preferenteSms = "1";
        } else {
          arrayTelefonos[index].preferenteSms = "0";
        }
      }

      this.body.telefonos = arrayTelefonos;
    }

    this.body.tipojusticiable = SigaConstants.SCS_JUSTICIABLE;
    this.sigaServices.post(url, this.body).subscribe(
      data => {
        this.progressSpinner = false;

        //Si se manda un mensaje igual a C significa que el nif del justiciable introducido esta repetido 
        if (JSON.parse(data.body).error.message != "C") {

          //Si la persona es sobreescrita
          // if (this.personaRepetida) {
          //   this.modoEdicion = true;
          //   this.personaRepetida = false;
          //   this.searchJusticiableOverwritten.emit(this.body);
          // }

          if (!this.modoEdicion) {
            this.modoEdicion = true;
            let idJusticiable = JSON.parse(data.body).id;
            this.body.idpersona = idJusticiable;
            this.body.idinstitucion = this.authenticationService.getInstitucionSession();

            if (!this.modoRepresentante) {
              //Si estamos en la creacion de Datos Generales 
              if (sessionStorage.getItem("EJGItem")) {
                let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));
                sessionStorage.setItem("EJGItem", JSON.stringify(ejg));
                this.persistenceService.setDatos(ejg);
              }
              //Si se esta editando Datos Generales desde su tarjeta en ejg
              else if (this.persistenceService.getDatos()) {
                let ejg: EJGItem = this.persistenceService.getDatos();
                this.persistenceService.setDatos(ejg);
              }

              this.newJusticiable.emit(this.body);
            }
          } else {
            this.getTelefonosJusticiable();

            if (this.modoRepresentante) {
              if (this.persistenceService.getBody() != undefined) {
                let representante = this.persistenceService.getBody();
                representante.nif = this.body.nif;
                this.persistenceService.setBody(representante);
              }
            }
          }

          if (this.nuevoTelefono) {
            this.nuevoTelefono = false;
          }

          this.selectedDatos = [];

          if (this.modoRepresentante && !this.checkedViewRepresentante) {
            this.persistenceService.setBody(this.body);
            this.sigaServices.notifyGuardarDatosGeneralesRepresentante(this.body);
          } else if (this.modoRepresentante && this.checkedViewRepresentante) {
            this.sigaServices.notifyGuardarDatosGeneralesRepresentante(this.body);
          } else {
            this.bodyInicial = JSON.parse(JSON.stringify(this.body));
            this.datosInicial = JSON.parse(JSON.stringify(this.datos));
            this.sigaServices.notifyGuardarDatosGeneralesJusticiable(this.body);
          }

          if (!this.menorEdadJusticiable) {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          }
          this.preAsociarJusticiable();
        } else {
          this.callConfirmationSave(JSON.parse(data.body).id);
          // this.personaRepetida = true;
        }
      },
      err => {

        if (err.error != undefined && JSON.parse(err.error).error.description != "") {
          if (JSON.parse(err.error).error.code == "600") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          }

        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        //Actualizamos la Tarjeta Asuntos
        this.persistenceService.setDatos(this.body);
        this.actualizaAsunto.emit();
        sessionStorage.removeItem("nuevoJusticiable");
        if(this.vieneDeJusticiable && this.nuevoJusticiable){
          sessionStorage.setItem("origin", "Nuevo");
          this.router.navigate(["/gestionJusticiables"], { queryParams: { rp: "2" } });
        }
      }
    );
  }
  preAsociarJusticiable() {
    // Asociar solo si viene de EJG, Asistencia 
    // Controlar Justiciable vienen de EJG.
    if (sessionStorage.getItem("itemEJG") || sessionStorage.getItem("itemAsistencia") || sessionStorage.getItem("itemDesignas")) {
      this.asociarJusticiable();
      if (sessionStorage.getItem("itemEJG")) {
        sessionStorage.removeItem("itemEJG");
      }
      if (sessionStorage.getItem("itemAsistencia")) {
        sessionStorage.removeItem("itemAsistencia");
      }
      if (sessionStorage.getItem("itemDesignas")) {
        sessionStorage.removeItem("itemDesignas");
      }
    }else if(this.nuevoSoj){
      this.asociarSOJ(this.body);
    }
  }

  callConfirmationSave(id) {
    this.progressSpinner = false;
    this.confirmationSave = true;
    this.confirmationService.confirm({
      key: "cdGeneralesSave",
      message: this.translateService.instant("gratuita.personaJG.mensaje.existeJusticiable.pregunta.crearNuevo"),
      icon: "fa fa-search ",
      accept: () => {
        // this.progressSpinner = true;
        // this.modoEdicion = true;
        // let url = "gestionJusticiables_updateJusticiable";
        // this.body.idpersona = id;
        // this.body.validacionRepeticion = false;
        // this.callSaveService(url);
        // this.confirmationSave = false;


        this.confirmationSave = false;
        this.progressSpinner = true;
        let url = "gestionJusticiables_createJusticiable";
        //Ya estavalidada la repeticion y puede crear al justiciable
        this.body.validacionRepeticion = true;
        this.callSaveService(url);
        this.cdGeneralesSave.hide();
      },
      reject: () => {

      }
    });
  }

  callConfirmationUpdate() {
    this.progressSpinner = false;
    this.confirmationUpdate = true;
    this.showConfirmacion = true;

    /*this.confirmationService.confirm({
      key: "cdGeneralesUpdate",
      message: this.translateService.instant("gratuita.personaJG.mensaje.actualizarJusticiableParaTodosAsuntos"),
      icon: "fa fa-search ",
      accept: () => {
        this.progressSpinner = true;
        this.confirmationUpdate = false;
        let url = "gestionJusticiables_updateJusticiable";
        this.validateCampos(url);
      },
      reject: () => {
        if (this.confirmationUpdate) {
          this.confirmationUpdate = false;
          this.progressSpinner = true;
          this.modoEdicion = false;
          let url = "gestionJusticiables_createJusticiable";
          this.body.asuntos = undefined;
          this.body.datosAsuntos = [];
          this.body.numeroAsuntos = undefined;
          this.body.ultimoAsunto = undefined;
          //Ya estavalidada la repeticion y puede crear al justiciable
          this.body.validacionRepeticion = true;
          this.body.asociarRepresentante = true;
          this.validateCampos(url);
          this.cdGeneralesUpdate.hide();
        } else if (this.confirmationSave) {
          this.confirmationSave = false;

          this.progressSpinner = true;
          let url = "gestionJusticiables_createJusticiable";
          //Ya esta validada la repeticion y puede crear al justiciable
          this.body.validacionRepeticion = true;
          this.body.asociarRepresentante = true;
          this.callSaveService(url);
          this.cdGeneralesSave.hide();
        }
      }
    });*/
  }

  reject() {

    if (this.confirmationUpdate) {
      this.confirmationUpdate = false;
      this.progressSpinner = true;
      this.modoEdicion = false;
      let url = "gestionJusticiables_createJusticiable";
      this.body.asuntos = undefined;
      this.body.datosAsuntos = [];
      this.body.numeroAsuntos = undefined;
      this.body.ultimoAsunto = undefined;
      //Ya estavalidada la repeticion y puede crear al justiciable
      this.body.validacionRepeticion = true;
      this.body.asociarRepresentante = true;
      this.validateCampos(url);
      this.cdGeneralesUpdate.hide();
    } else if (this.confirmationSave) {
      this.confirmationSave = false;

      this.progressSpinner = true;
      let url = "gestionJusticiables_createJusticiable";
      //Ya esta validada la repeticion y puede crear al justiciable
      this.body.validacionRepeticion = true;
      this.body.asociarRepresentante = true;
      this.callSaveService(url);
      this.cdGeneralesSave.hide();
    }
  }

  getTelefonosJusticiable() {
    this.progressSpinner = true;
    this.sigaServices.post("gestionJusticiables_getTelefonos", this.body).subscribe(result => {

      this.body.telefonos = JSON.parse(result.body).telefonosJusticiables;
      this.getDatosContacto();
      this.progressSpinner = false;

    }, error => {
      this.progressSpinner = false;
      //console.log(error);
    });
  }

  getColsDatosContacto() {

    this.cols = [
      { field: 'tipo', header: "censo.busquedaClientesAvanzada.literal.tipoCliente" },
      { field: 'numeroTelefono', header: "administracion.parametrosGenerales.literal.valor" }
    ]

    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
  }

  getDatosContacto() {
    this.datos = [];
    this.count = 1;


    let rowCorreoElectronico = new JusticiableTelefonoItem();
    rowCorreoElectronico.tipo = "Correo-Electrónico";
    rowCorreoElectronico.nombreTelefono = "Correo-Electrónico";
    rowCorreoElectronico.numeroTelefono = this.body.correoelectronico;
    rowCorreoElectronico.preferenteSmsCheck = false;
    rowCorreoElectronico.count = this.count;

    this.count += 1;

    let rowFax = new JusticiableTelefonoItem();
    rowFax.nombreTelefono = "Fax";
    rowFax.tipo = "Fax";
    rowFax.numeroTelefono = this.body.fax;
    rowFax.preferenteSmsCheck = false;
    rowFax.count = this.count;

    this.count += 1;

    this.datos.push(rowCorreoElectronico);
    this.datos.push(rowFax);

    if (this.body.telefonos != null && this.body.telefonos != undefined && this.body.telefonos.length > 0) {
      this.body.telefonos.forEach(element => {
        element.count = this.count;
        element.tipo = "Telefono";
        element.nuevo = false;
        element.tlfValido = true;

        if (element.preferenteSms == null || element.preferenteSms == "0") {
          element.preferenteSmsCheck = false;
        } else {
          element.preferenteSmsCheck = true;
        }

        this.datos.push(element);
        this.count++;
      });
    }

    this.progressSpinner = false;
    this.datosInicial = JSON.parse(JSON.stringify(this.datos));

  }

  getComboMinusvalia() {

    this.progressSpinner = true;

    this.sigaServices.get("gestionJusticiables_comboMinusvalias").subscribe(
      n => {
        this.comboMinusvalia = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboMinusvalia);
        this.progressSpinner = false;

      },
      err => {
        //console.log(err);
        this.progressSpinner = false;

      }
    );
  }



  getComboPais() {
    this.progressSpinner = true;

    this.sigaServices.get("direcciones_comboPais").subscribe(
      n => {
        this.comboPais = n.combooItems;
        this.comboNacionalidad = n.combooItems;

        this.comboNacionalidad.push({ label: "DESCONOCIDO", value: "0" });
        this.commonsService.arregloTildesCombo(this.comboPais);
        this.progressSpinner = false;

      // Asignar por defecto nacionalidad(España).
      if (sessionStorage.getItem("nuevoJusticiable")) {
        this.body.idpais = this.comboNacionalidad[0].value;
        this.nuevoJusticiable = true;
      }
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  getComboProfesion() {
    this.progressSpinner = true;

    this.sigaServices.get("gestionJusticiables_comboProfesiones").subscribe(
      n => {
        this.comboProfesion = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboProfesion);


        this.progressSpinner = false;

      },
      err => {
        //console.log(err);
        this.progressSpinner = false;

      }
    );
  }

  getComboRegimenConyugal() {
    this.progressSpinner = true;

    this.comboRegimenConyugal = [
      { label: "Indeterminado", value: "I" },
      { label: "Gananciales", value: "G" },
      { label: "Separación de bienes", value: "S" }
    ];

    this.commonsService.arregloTildesCombo(this.comboRegimenConyugal);

    // Asignar por defecto el regimen conyugal(Indeterminado).
    if (sessionStorage.getItem("nuevoJusticiable")) {
      this.body.regimenConyugal = this.comboRegimenConyugal[0].value;
      this.nuevoJusticiable = true;
    }

  }

  getComboTipoPersona() {

    this.progressSpinner = true;

    this.comboTipoPersona = [
      { label: "Física", value: "F" },
      { label: "Jurídica", value: "J" }

    ];
    // Asignar por defecto el Valor Física.
    if (sessionStorage.getItem("nuevoJusticiable")) {
      this.body.tipopersonajg = this.comboTipoPersona[0].value;
      this.tipoPersona = this.comboTipoPersona[0].value;
      this.nuevoJusticiable = true;
    }

    this.commonsService.arregloTildesCombo(this.comboTipoPersona);

  }

  getComboSexo() {

    this.progressSpinner = true;

    this.comboSexo = [
      { label: "Hombre", value: "H" },
      { label: "Mujer", value: "M" },
      { label: "No Consta", value: "N" }
    ];

    // Asignar por defecto el sexo(No-Consta).
    if (sessionStorage.getItem("nuevoJusticiable")) {
       this.body.sexo = this.comboSexo[2].value;
       this.nuevoJusticiable = true;
    }
  }

  getComboTiposIdentificacion() {
    this.progressSpinner = true;

    this.sigaServices.get("fichaPersona_tipoIdentificacionCombo").subscribe(
      n => {
        this.comboTipoIdentificacion = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTipoIdentificacion);

        this.progressSpinner = false;

      },
      err => {
        //console.log(err);
        this.progressSpinner = false;

      }
    );
  }

  getComboTipoVia() {
    this.progressSpinner = true;
    this.sigaServices.get("gestionJusticiables_comboTipoVias").subscribe(
      n => {
        this.comboTipoVia = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTipoVia);

        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }
    );

  }

  getComboEstadoCivil() {
    this.progressSpinner = true;
    this.sigaServices.get("fichaColegialGenerales_estadoCivil").subscribe(
      n => {
        this.comboEstadoCivil = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboEstadoCivil);
               // Asignar por defecto el estado civil(Desconocido).
               if (sessionStorage.getItem("nuevoJusticiable")) {
                this.body.idestadocivil = this.comboEstadoCivil[1].value;
                this.nuevoJusticiable = true;
             }

        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }
    );

    }

  getComboIdiomas() {
    this.progressSpinner = true;
    this.sigaServices.get("etiquetas_lenguaje").subscribe(
      n => {
        this.comboIdiomas = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboIdiomas);

        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  getComboProvincia() {
    this.progressSpinner = true;
    this.sigaServices.get("integrantes_provincias").subscribe(
      n => {
        this.comboProvincia = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboProvincia);

        if (this.body.idpoblacion != undefined && this.body.idpoblacion != null) {
          this.getComboPoblacionByIdPoblacion(this.body.idpoblacion);
        }
      },
      error => { },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  getComboPoblacionByIdPoblacion(idpoblacion) {
    this.progressSpinner = true;

    this.sigaServices
      .getParam(
        "gestionJusticiables_comboPoblacion",
        "?idPoblacion=" +
        idpoblacion
      )
      .subscribe(
        n => {
          this.comboPoblacion = n.combooItems;
          this.commonsService.arregloTildesCombo(this.comboPoblacion)

        },
        error => {
          this.progressSpinner = false;

        }, () => {
          this.progressSpinner = false;

        }
      );
  }

  getComboPoblacion(filtro: string) {
    this.progressSpinner = true;
    this.poblacionBuscada = this.getLabelbyFilter(filtro);

    this.sigaServices
      .getParam(
        "direcciones_comboPoblacion",
        "?idProvincia=" +
        this.body.idprovincia +
        "&filtro=" +
        this.poblacionBuscada
      )
      .subscribe(
        n => {
          this.comboPoblacion = n.combooItems;
          this.commonsService.arregloTildesCombo(this.comboPoblacion);
        },
        error => {
          this.progressSpinner = false;

        }, () => {
          this.progressSpinner = false;

        }
      );
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

  onChangeCodigoPostal() {
    if (this.body.idpaisdir1 == "191" || this.body.idpaisdir1 == null || this.body.idpaisdir1 == undefined) {
      if (
        this.commonsService.validateCodigoPostal(this.body.codigopostal) &&
        this.body.codigopostal.length == 5) {
        let value = this.body.codigopostal.substring(0, 2);
        this.provinciaSelecionada = value;
        this.isDisabledPoblacion = false;
        if (value != this.body.idprovincia) {
          this.body.idprovincia = this.provinciaSelecionada;
          this.body.idpoblacion = "";
          this.comboPoblacion = [];
          this.isDisabledProvincia = true;
          this.isDisabledPoblacion = false;
        }
        this.codigoPostalValido = true;
        this.cpValido = true;
      } else {
        if (this.body.codigopostal != null && this.body.codigopostal != undefined && this.body.codigopostal != "") {
          this.cpValido = false;
        } else {
          this.cpValido = true;
        }

        this.codigoPostalValido = false;
        this.isDisabledPoblacion = true;
        this.provinciaSelecionada = "";
        this.body.idpoblacion = undefined;
        this.body.idprovincia = undefined;
      }
    }

    if (this.body.codigopostal == undefined || this.body.codigopostal == "") {
      this.cpValido = true;
    }
  }

  onChangePais() {
    //Si se selecciona un pais extranjero
    if (this.body.idpaisdir1 != "191") {
      this.body.idprovincia = "";
      this.body.idpoblacion = "";
      this.poblacionExtranjera = true;
      this.isDisabledPoblacion = true;
      this.comboPoblacion = [];
      //Si se selecciona españa
    } else {
      this.poblacionExtranjera = false;

      if (this.body.idprovincia != undefined && this.body.idprovincia != null && this.body.idprovincia != "") {
        this.isDisabledPoblacion = false;
      } else {
        this.isDisabledPoblacion = true;
      }

      this.isDisabledProvincia = true;

      if (this.body.codigopostal != undefined && this.body.codigopostal != null) {
        this.onChangeCodigoPostal();
      }

    }
  }


  onChangeProvincia() {
    this.body.idpoblacion = "";
    this.comboPoblacion = [];
  }

  onChangeOtherProvincia(event) {
    if (event) {
      this.isDisabledPoblacion = true;

      if (this.body.idpais == "191") {
        this.isDisabledProvincia = false;
      }

      if (
        (this.body.idpoblacion == null &&
          this.body.idpoblacion == undefined) ||
        this.body.idpoblacion == "") {
        this.showMessage("error", "Error", this.translateService.instant("censo.datosDirecciones.mensaje.seleccionar.poblacion"));
        this.isDisabledPoblacion = false;
        this.isDisabledProvincia = true;
        this.checkbox.checked = false;
      }
    } else {

      if (
        this.body.idpais == "191" &&
        !this.checkOtraProvincia
      ) {
        this.isDisabledPoblacion = false;
      }

      this.isDisabledProvincia = true;
      this.onChangeCodigoPostal();
      this.checkOtraProvincia = false;
    }
  }

  compruebaDNI() {

    if (this.body.nif != undefined && this.body.nif.trim() != "" && this.body.nif != null) {
      //if (this.body.idtipoidentificacion != "50") {
      if (this.commonsService.isValidDNI(this.body.nif)) {
        this.body.idtipoidentificacion = "10";
        return true;
      } else if (this.commonsService.isValidPassport(this.body.nif)) {
        this.body.idtipoidentificacion = "30";
        return true;
      } else if (this.commonsService.isValidNIE(this.body.nif)) {
        this.body.idtipoidentificacion = "40";
        return true;
      } else if (this.commonsService.isValidCIF(this.body.nif)) {
        this.body.idtipoidentificacion = "20";
        return true;
      } else {
        this.body.idtipoidentificacion = "30";
        return true;
      }
      //}
    } else {
      this.body.idtipoidentificacion = undefined;
    }

  }

  getLabelbyFilter(string): string {
    /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
    let labelSinTilde = string;
    let accents =
      "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
    let accentsOut =
      "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    let i;
    let x;
    for (i = 0; i < string.length; i++) {
      if ((x = accents.indexOf(string.charAt(i))) != -1) {
        labelSinTilde = string.replace(string.charAt(i), accentsOut[x]);
        return labelSinTilde;
      }
    }

    return labelSinTilde;
  }

  checkPermisosRest() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.rest();
    }
  }

  rest() {

    this.nuevoTelefono = false;
    this.selectedDatos = [];
    this.body.idpaisdir1 = "191";

    if (this.modoEdicion) {
      if (this.bodyInicial != undefined) this.body = JSON.parse(JSON.stringify(this.bodyInicial));
      if (this.body.idpoblacion != undefined) {
        this.getComboPoblacionByIdPoblacion(this.body.idpoblacion);
      }

      this.parseFechas();

      if (this.datosInicial != undefined) this.datos = JSON.parse(JSON.stringify(this.datosInicial));
      this.faxValido = true;
      this.emailValido = true;

      if (this.body.idpaisdir1 != "191") {
        this.poblacionExtranjera = true;
      } else {
        this.poblacionExtranjera = false;
      }

    } else {
      this.body = new JusticiableItem();
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

  checkPermisosNewData() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (!this.permisoEscritura || this.selectAll || this.selectMultiple) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.newData();
      }
    }
  }

  newData() {

    this.nuevoTelefono = true;

    let dato = new JusticiableTelefonoItem();
    dato.nuevo = true;
    dato.preferenteSmsCheck = false;
    dato.preferenteSms = "0";
    dato.count = this.count;
    dato.tlfValido = true;
    dato.numeroTelefono = undefined;
    dato.nombreTelefono = undefined;

    this.datos.push(dato);

    this.count += 1;
  }

  onChangePreferente(dato) {

    let checkedFind = this.datos.find(x => x.preferenteSmsCheck == true && x.count != dato.count);

    if (checkedFind != undefined) {

      let icon = "fa fa-edit";
      let message = this.translateService.instant("justiciaGratuita.justiciables.message.cambiarTelefonoPreferente");

      this.confirmationService.confirm({
        key: "cdPreferenteSms",
        message: message,
        icon: icon,
        accept: () => {

          this.datos.forEach(element => {
            element.preferenteSmsCheck = false;
            element.preferenteSms = "0";
          });

          dato.preferenteSmsCheck = true;
          dato.preferenteSms = "1";
        },
        reject: () => {

          dato.preferenteSmsCheck = false;

          this.msgs = [
            {
              severity: "info",
              summary: "Cancelada",
              detail: this.translateService.instant(
                "general.message.accion.cancelada"
              )
            }
          ];
        }
      });
    }
  }

  calculateAge() {
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

    // if (JSON.parse(this.body.edad) < this.edadAdulta) {
    //   this.sigaServices.notifyEsMenorEdad(this.body);
    // }
  }

  searchJusticiableByNif() {

    if (this.body.nif.trim() != undefined && this.body.nif.trim() != "") {
      let bodyBusqueda = new JusticiableBusquedaItem();
      bodyBusqueda.nif = this.body.nif;
      this.notifySearchJusticiableByNif.emit(bodyBusqueda);
    }

  }

  search() {
    this.persistenceService.clearBody();
    this.router.navigate(["/justiciables"], { queryParams: { rp: "2" } });
  }

  clear() {
    this.msgs = [];
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
    if (//this.body.idtipoidentificacion != undefined && this.body.idtipoidentificacion != "" &&
      //this.body.nif != undefined && this.body.nif.trim() != "" &&
      this.body.nombre != undefined && this.body.nombre.trim() != "" &&
      this.body.apellido1 != undefined && this.body.apellido1.trim() != "" &&
      this.body.tipopersonajg != undefined && this.body.tipopersonajg != "" &&
      this.faxValido && this.emailValido && this.cpValido) {

      if (this.datos.length > 2) {
        let valido = true;

        let arrayTelefonos = JSON.parse(JSON.stringify(this.datos));
        arrayTelefonos.splice(0, 2);

        arrayTelefonos.forEach(element => {

          if (valido) {
            if (element.tlfValido && element.numeroTelefono != undefined && element.numeroTelefono.trim() != "") {
              valido = true;
            } else {
              valido = false;
            }
          } else {
            return true;
          }
        });

        if (valido) {
          return false;
        } else {
          return true;
        }
      }

      return false;

    } else {
      return true;
    }
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta; // Funcionalidad para mostrar contenido de la Tarjeta pulsando a la misma.
    this.opened.emit(this.showTarjeta);   // Emit donde pasamos el valor de la Tarjeta Resumen.
    this.idOpened.emit('datosGenerales'); // Constante para abrir la Tarjeta de Resumen.
  }

  changeEmail(value) {
    this.emailValido = this.commonsService.validateEmail(value.numeroTelefono);

    if (this.emailValido) {
      this.body.correoelectronico = value.numeroTelefono;
    }
  }

  changeTelefono(value) {
    value.tlfValido = this.commonsService.validateTelefono(value.numeroTelefono);
  }

  changeFax(value) {
    this.faxValido = this.commonsService.validateFax(value.numeroTelefono);

    if (this.faxValido) {
      this.body.fax = value.numeroTelefono;
    }
  }

  editEmail() {
    if (this.edicionEmail)
      this.edicionEmail = false;
    else this.edicionEmail = true;
  }

  checkPermisosRestData() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.restData();
    }
  }

  restData() {

    if (this.datosInicial != undefined) this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    this.faxValido = true;
    this.emailValido = true;
    this.selectedDatos = [];
  }

  checkPermisosDeleteData(selectedDatos) {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.disabledDelete()) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.deleteData(selectedDatos);
      }
    }
  }

  deleteData(selectedDatos) {

    selectedDatos.forEach(element => {

      if (!element.nuevo) {
        let pos = this.datos.findIndex(
          x => x.idTelefono == element.idTelefono);

        if (pos != -1) {
          this.datos.splice(pos, 1);
        }
      } else {
        let pos = this.datos.findIndex(
          x => x.count == element.count);

        if (pos != -1) {
          this.datos.splice(pos, 1);
        }
      }

    });

    this.selectedDatos = [];
  }

  onRowSelect(dato) {

    if (!this.selectMultiple && !this.selectAll) {
      if (this.selectionMode == "single") {
        this.selectedDatos = undefined;
      } else {
        this.selectedDatos.pop();
      }
    } else {
      if (dato.data.count == 1 || dato.data.count == 2) {
        this.selectedDatos.pop();
      }
    }

  }

  editarCompleto(event, dato) {
    let NUMBER_REGEX = /^\d{1,5}$/;
    if (NUMBER_REGEX.test(dato)) {
      if (dato != null && dato != undefined && (dato < 0 || dato > 99999)) {
        this.body.codigopostal = event.currentTarget.value.slice(0, 5);
        this.cpValido = true;
      }
    } else {

      if (dato != null && dato != undefined && (dato < 0 || dato > 99999)) {
        this.body.codigopostal = event.currentTarget.value.slice(0, 5);
        this.cpValido = true;
      } else {
        this.body.codigopostal = "";
        event.currentTarget.value = "";
        this.cpValido = true;
      }

    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  onChangeSelectAll() {
    if (this.selectAll) {
      this.selectionMode = "multiple";
      let arrays = JSON.parse(JSON.stringify(this.datos));
      arrays.shift();
      arrays.shift();
      this.selectedDatos = JSON.parse(JSON.stringify(arrays));
      this.selectMultiple = true;

    } else {
      this.selectionMode = "";
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectMultiple = false;
    }

  }

  isSelectMultiple() {
    if (this.permisoEscritura) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectionMode = "";
      } else {
        this.selectAll = false;
        this.selectedDatos = [];
        this.selectionMode = "multiple";
        this.numSelected = 0;
      }
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  disabledDelete() {
    if (!this.selectMultiple && !this.selectAll) {
      return true;

    } else {

      if ((this.selectionMode == "" && !this.selectedDatos) ||
        ((this.selectionMode == "multiple" && this.selectedDatos.length == 0))) {
        return true;
      } else {
        return false;
      }

    }

  }

  styleObligatorio(evento) {
    if ((evento == undefined || evento == null || evento == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }
  muestraCamposObligatorios() {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];

  }

  guardar(){
    if(this.guardaOpcion=="s"){
      
      this.progressSpinner = true;
      this.confirmationUpdate = false;
      let url = "gestionJusticiables_updateJusticiable";
      this.validateCampos(url);
      
    }else if(this.guardaOpcion=="n"){
      if (this.confirmationUpdate) {
        this.confirmationUpdate = false;
        this.progressSpinner = true;
        this.modoEdicion = false;
        let url = "gestionJusticiables_createJusticiable";
        this.body.asuntos = undefined;
        this.body.datosAsuntos = [];
        this.body.numeroAsuntos = undefined;
        this.body.ultimoAsunto = undefined;
        //Ya estavalidada la repeticion y puede crear al justiciable
        this.body.validacionRepeticion = true;
        this.body.asociarRepresentante = true;
        this.validateCampos(url);
        this.cdGeneralesUpdate.hide();
      } else if (this.confirmationSave) {
        this.confirmationSave = false;

        this.progressSpinner = true;
        let url = "gestionJusticiables_createJusticiable";
        //Ya esta validada la repeticion y puede crear al justiciable
        this.body.validacionRepeticion = true;
        this.body.asociarRepresentante = true;
        this.callSaveService(url);
      }

    }
    this.showConfirmacion = false;
  }
  cancelar(){
    this.showConfirmacion = false;
  }

}
