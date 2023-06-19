
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService } from 'primeng/components/common/api';
import { TranslateService } from '../../../../../commons/translate';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { JusticiableTelefonoItem } from '../../../../../models/sjcs/JusticiableTelefonoItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { AuthenticationService } from '../../../../../_services/authentication.service';
import { Router } from '@angular/router';
import { SigaConstants } from '../../../../../utils/SigaConstants';
import { Checkbox } from '../../../../../../../node_modules/primeng/primeng';
import { Dialog } from 'primeng/primeng';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss']
})
export class DatosPersonalesComponent implements OnInit {

  bodyInicial;
  datosInicial;
  progressSpinner: boolean = false;
  direccionPostal: String = "";
  nombreVia: String = "";
  poblacion: String = "";
  provincia: String = "";
  pais: String = "";
  edadAdulta: number = 18;
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
  direccion;

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

  showConfirmacion: boolean = false;
  vieneDeJusticiable: boolean = false;
  guardaOpcion: String;
  count: number = 1;
  selectedDatos = [];
  rowsPerPage: any = [];

  selectedItem: number = 10;
  selectAll: boolean = false;
  numSelected = 0;
  selectMultiple: boolean = false;

  selectionMode = "";

  @ViewChild("provincia") checkbox: Checkbox;
  @ViewChild("cdPersonalesUpdate") cdPersonalesUpdate: Dialog;
  @ViewChild("cdGeneralesSave") cdGeneralesSave: Dialog;
  @ViewChild("cdPreferenteSms") cdPreferenteSms: Dialog;
  @ViewChild("table") tabla;

  @Output() modoEdicionSend = new EventEmitter<any>();
  @Output() notifySearchJusticiableByNif = new EventEmitter<any>();
  @Output() newJusticiable = new EventEmitter<any>();
  @Output() searchJusticiableOverwritten = new EventEmitter<any>();
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<String>();
  @Input() body: JusticiableItem;
  @Input() tarjetaDatosPersonales;
  @Input() showTarjeta;
  @Input() fromJusticiable: boolean = false;
  @Input() fromUniFamiliar: boolean = false;
  @Input() modoRepresentante;
  @Input() checkedViewRepresentante;

  modoEdicion: boolean = false;

  confirmationSave: boolean = false;
  confirmationUpdate: boolean = false;

  menorEdadJusticiable: boolean = false;

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

    if (this.body != undefined && this.body.idpersona != undefined) {
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));

      this.parseFechas();

    } else {
      this.body = new JusticiableItem();
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
    
    if (sessionStorage.getItem("origin") != "newRepresentante" && sessionStorage.getItem("origin") != "newInteresado"
    && sessionStorage.getItem("origin") != "newContrario" && sessionStorage.getItem("origin") != "newAsistido" 
    && sessionStorage.getItem("origin") != "newContrarioAsistencia" && sessionStorage.getItem("origin") != "UnidadFamiliar"
    && sessionStorage.getItem("origin") != "newContrarioEJG" && sessionStorage.getItem("origin") != "newSoj") {
      this.vieneDeJusticiable = true;
    }

  }


  ngOnChanges() {
    this.progressSpinner = true;

    if (this.body != undefined) {
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      this.getDatosContacto();
      this.parseFechas();
    } else {
      this.body = new JusticiableItem();
      this.progressSpinner = false;
    }

    if (this.body.idpersona == undefined) {
      this.modoEdicion = false;
      this.body.fechaalta = new Date();
    } else {
      this.modoEdicion = true;

      if (this.body.idprovincia != undefined && this.body.idprovincia != null &&
        this.body.idprovincia != "") {
        this.isDisabledPoblacion = false;
        this.getComboPoblacion("-1");
      } else {
        this.isDisabledPoblacion = true;
      }
    }

    if (this.pais != "" && this.poblacion != "" && this.provincia != "") {
      this.rellenarDireccionPostal();
    }

    if (this.body.nif != undefined && this.body.nif != null && this.body.nif != "") {
      this.compruebaDNI();
    }

    if (this.tarjetaDatosPersonales == true) this.showTarjeta = this.tarjetaDatosPersonales;
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
    // Rellenar Dirección Postal
    // Calle XXXX, Nº XX X X, XXXX XXXXX,XXXX(XXXXX)
    this.getComboPais();
    this.getComboProvincia();
    this.rellenarDireccionPostal();

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
              if (this.body.numeroAsuntos != undefined && parseInt(this.body.numeroAsuntos) > 1 && !this.vieneDeJusticiable) {
                this.callConfirmationUpdate();
             
              } else {
                let url = "gestionJusticiables_updateJusticiable";
                this.validateCampos(url);
              }
            
          }
        } else {
          if (this.body.numeroAsuntos != undefined && parseInt(this.body.numeroAsuntos) > 1 && !this.vieneDeJusticiable && this.body.nif != null) {
            this.callConfirmationUpdate();

          } else {
            if (this.body.nif == null || this.body.nif.length == 0){
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.justiciables.message.asociarRepresentante.nombreVacioJusticiable"));
            } else {
              let url = "gestionJusticiables_updateJusticiable";
              this.validateCampos(url);
            }
          }
        }

      } else {
        this.progressSpinner = false;
      }
    }
    this.progressSpinner = false;
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

        } else {
          this.callConfirmationSave(JSON.parse(data.body).id);
          // this.personaRepetida = true;
        }

      },
      err => {

        if (JSON.parse(err.error).error.description != "") {
          if (err.error != undefined && JSON.parse(err.error).error.code == "600") {
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
      }
    );
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
      key: "cdPersonalesUpdate",
      message: this.translateService.instant("gratuita.personaJG.mensaje.actualizarJusticiableParaTodosAsuntos"),
      icon: "fa fa-search ",
      accept: () => {
        this.progressSpinner = true;
        this.confirmationUpdate = false;
        let url = "gestionJusticiables_updateJusticiable";
        this.validateCampos(url);
      },
      reject: () => { }
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
      this.cdPersonalesUpdate.hide();
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

    // Rellenar Dirección Postal
    this.rellenarDireccionPostal();

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
    //this.progressSpinner = true;

    this.sigaServices.get("direcciones_comboPais").subscribe(
      n => {
        this.comboPais = n.combooItems;
        this.comboNacionalidad = n.combooItems;

        this.comboNacionalidad.push({ label: "DESCONOCIDO", value: "D" });

        if (this.comboNacionalidad != null || this.comboNacionalidad != undefined) {
          this.comboNacionalidad.forEach(element => {
            if (element.value == this.body.idpais) {
              this.pais = element.label;
              // Rellenar Dirección Postal
              this.rellenarDireccionPostal();
            }
          });
        }


        this.commonsService.arregloTildesCombo(this.comboPais);
        //this.progressSpinner = false;
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
      { label: "Indetermninado", value: "I" },
      { label: "Gananciales", value: "G" },
      { label: "Separación de bienes", value: "S" }
    ];

    this.commonsService.arregloTildesCombo(this.comboRegimenConyugal);


  }

  getComboTipoPersona() {

    this.progressSpinner = true;

    this.comboTipoPersona = [
      { label: "Física", value: "F" },
      { label: "Jurídica", value: "J" }

    ];

    this.commonsService.arregloTildesCombo(this.comboTipoPersona);

  }

  getComboSexo() {

    this.progressSpinner = true;

    this.comboSexo = [
      { label: "Hombre", value: "H" },
      { label: "Mujer", value: "M" },
      { label: "No Consta", value: "N" }
    ];

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
    this.sigaServices.getParam("gestionJusticiables_comboTipoVias2", "?idTipoViaJusticiable=" + this.body.idtipovia).subscribe(
      n => {
        this.comboTipoVia = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTipoVia);

        this.comboTipoVia.forEach(element => {
          if (element.value == this.body.idtipovia) this.nombreVia = element.label;
        });

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
    //this.progressSpinner = true;
    this.sigaServices.get("integrantes_provincias").subscribe(
      n => {
        this.comboProvincia = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboProvincia);

        if (this.comboProvincia != null || this.comboProvincia != undefined) {
          this.comboProvincia.forEach(element => {
            if (element.value == this.body.idprovincia) {
              this.provincia = element.label;
              // Rellenar Dirección Postal
              this.rellenarDireccionPostal();
            }
          });
        }


        //if (this.body.idpoblacion != undefined && this.body.idpoblacion != null) {
        //  this.getComboPoblacionByIdPoblacion(this.body.idpoblacion);
        //}
      },
      error => { },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  getComboPoblacionByIdPoblacion(idpoblacion) {
    //this.progressSpinner = true;

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

          if (this.comboPoblacion != null || this.comboPoblacion != undefined) {
            this.comboPoblacion.forEach(element => {
              if (element.value == this.body.idpoblacion) {
                this.poblacion = element.label;
                // Rellenar Dirección Postal
                this.rellenarDireccionPostal();
              }
            });
          }


        },
        error => {
          this.progressSpinner = false;

        }, () => {
          // this.progressSpinner = false;

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
          this.getComboPoblacion("-1");
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
    if (
      //this.body.idtipoidentificacion != undefined && this.body.idtipoidentificacion != "" &&
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
    this.opened.emit(this.showTarjeta);   // Emit donde pasamos el valor de la Tarjeta Personales.
    this.idOpened.emit('Personales'); // Constante para abrir la Tarjeta de Personales.
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
      /* this.selectionMode = "multiple";
      let arrays = JSON.parse(JSON.stringify(this.datos));
      arrays.shift();
      arrays.shift();
      this.selectedDatos = JSON.parse(JSON.stringify(arrays));
      this.selectMultiple = true; */
      this.selectMultiple = true;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
      this.selectionMode = "multiple";

    } else {
      this.selectionMode = "single";
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectMultiple = false;
    }

  }

 /* ORIGINAL    */
 isSelectMultiple() {
    if (this.permisoEscritura) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectionMode = "single";
        this.selectAll = false;
        this.selectMultiple = false;
      } else {
        this.selectAll = false;
        this.selectMultiple = true;
        this.selectedDatos = [];
        this.selectionMode = "multiple";
        this.numSelected = 0;
      }
    }
  }

  /* ANALOGO A TABLA ACREDITACIONES 
  isSelectMultiple() {

    if (this.permisoEscritura) {
    this.selectAll = false;
    this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectionMode = "single";

      } else {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectionMode = "multiple";
      }
    } else {
      this.selectionMode = undefined;
    }
  }*/

  selectFila(event) {
    this.numSelected = event.length;
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

  rellenarDireccionPostal() {

    if (this.body.codigopostal == null || this.body.codigopostal == undefined) {
      this.body.codigopostal = "";
    }

    if (this.body.direccion == null || this.body.direccion == undefined) {
      this.direccionPostal == "";
    } else {
      this.direccionPostal = this.nombreVia+" "+ this.body.direccion + ", " + this.body.codigopostal + ",  " + this.poblacion + ", " +
        this.provincia + " (" + this.pais + ") ";
    }

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
        this.cdPersonalesUpdate.hide();
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
    this.showConfirmacion = false;
  }
  cancelar(){
    this.showConfirmacion = false;
  }

}
