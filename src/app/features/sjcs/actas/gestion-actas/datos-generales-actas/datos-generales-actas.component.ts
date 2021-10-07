import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { ActasItem } from '../../../../../models/sjcs/ActasItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { CommonsService } from '../../../../../_services/commons.service';
@Component({
  selector: 'app-datos-generales-actas',
  templateUrl: './datos-generales-actas.component.html',
  styleUrls: ['./datos-generales-actas.component.scss']
})
export class DatosGeneralesActasComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  valueResolucion: Date;
  valueReunion: Date;
  valueAnio: String;
  valueNumero: String;
  valuePresidente: String;
  valueSecretario: String;



  @Input() permisoEscritura;

  datosFiltro: ActasItem = new ActasItem();  
  comboPresidente = [];
  comboSecretario = [];

  //Resultados de la busqueda
  @Input() datos: ActasItem;
  @Input() modoEdicion;
  @Output() modoEdicionSend = new EventEmitter<any>();

  codigoPostalValido: boolean = true;

  openFicha: boolean = true;
  historico: boolean = false;
  isDisabledProvincia: boolean = true;

  movilCheck: boolean = false

  body: ActasItem;
  bodyInicial: ActasItem;
  idComisaria;
  provinciaSelecionada: string;


  comboProvincias;
  comboPoblacion;
  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones;


  visibleMovilValue: boolean = false;
  esDecanoValue: boolean = false;
  isCodigoEjisValue: boolean = false;

  progressSpinner: boolean = false;

  avisoMail: boolean = false
  emailValido: boolean = true;
  tlf1Valido: boolean = true;
  tlf2Valido: boolean = true;
  faxValido: boolean = true;
  mvlValido: boolean = true;
  edicionEmail: boolean = false;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private translateService: TranslateService, private commonsService: CommonsService) { }

  ngOnInit() {
    this.getComboPresidente();
    this.getComboSecretario();
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos()

    }

    

    this.getComboProvincias();

    this.validateHistorical();

    // if (this.modoEdicion) {
    //   this.body = this.datos;
    //   this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    //   if (this.body.codigoPostal == null) {
    //     this.body.codigoPostal = "";
    //   }

    //   if (this.datos.visibleMovil == "1")
    //     this.movilCheck = true

    //   if (this.body != undefined && this.datos.nombrePoblacion != null) {
    //     this.getComboPoblacion(this.body.nombrePoblacion);
    //   } else {
    //     this.progressSpinner = false;
    //   }

    //   this.changeEmail();

    // } else {
    //   this.body = new ComisariaItem();
    //   this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    // }
   }

   getComboPresidente() {
    this.sigaServices
      .get("filtrosejg_comboPresidente")
      .subscribe(
        n => {
          console.log("************************************************************************************getComboPresidente**************");
          this.comboPresidente = n.combooItems;
          this.commonsService.arregloTildesCombo(this.comboPresidente);
        },
        err => {
          console.log(err);
        }
      );
  }

  getComboSecretario() {
    this.sigaServices
      .get("filtrosejg_comboSecretario")
      .subscribe(
        n => {
          console.log("**************************************************************************************getComboSecretario**************");
          this.comboSecretario = n.combooItems;
          this.commonsService.arregloTildesCombo(this.comboSecretario);
        },
        err => {
          console.log(err);
        }
      );
  }


  transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);
    return fecha;
  }


  fillFechaResolucion(event) {
    if (event != null) {
      this.datosFiltro.fechaResolucion = this.transformDate(event);
    }
  }

  fillFechaReunion(event) {
    if (event != null) {
      this.datosFiltro.fechaReunion = this.transformDate(event);
    }
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  ngAfterViewInit(): void {

  }
  validateHistorical() {
    if (this.persistenceService.getDatos() != undefined) {

      if (this.persistenceService.getDatos().fechabaja != null || this.persistenceService.getDatos().institucionVal != undefined) {
        this.historico = true;
      } else {
        this.historico = false;
      }
    }
  }

  getComboProvincias() {
    this.progressSpinner = true;

    this.sigaServices.get("busquedaComisarias_provinces").subscribe(
      n => {
        this.comboProvincias = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboProvincias);
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

    // this.body.idPoblacion = "";
    // this.comboPoblacion = [];

    // if (this.body.idProvincia != undefined && this.body.idProvincia != "") {
    //   this.isDisabledPoblacion = false;
    // } else {
    //   this.isDisabledPoblacion = true;
    // }

  }

  onChangePoblacion() {
    // if (this.body.idPoblacion != undefined && this.body.idPoblacion != null) {
    //   let poblacionSelected = this.comboPoblacion.filter(pob => pob.value == this.body.idPoblacion);
    //   this.body.nombrePoblacion = poblacionSelected[0].label;
    // }
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
    // this.progressSpinner = true;

    // this.sigaServices
    //   .getParam(
    //     "busquedaCommisarias_poblacion",
    //     "?idProvincia=" + this.body.idProvincia + "&dataFilter=" + dataFilter.replace("'", "''")
    //   )
    //   .subscribe(
    //     n => {
    //       this.isDisabledPoblacion = false;
    //       this.comboPoblacion = n.combooItems;
    //       this.commonsService.arregloTildesCombo(this.comboPoblacion);

    //       this.progressSpinner = false;

    //     },
    //     error => {
    //       this.progressSpinner = false;
    //     },
    //     () => { }
    //   );
  }

  checkPermisosSave() {
    // let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.historico);

    // if (msg != undefined) {
    //   this.msgs = msg;
    // } else {
    //   if (this.disabledSave()) {
    //     this.msgs = this.commonsService.checkPermisoAccion();
    //   } else {
    //     this.save();
    //   }
    // }
  }

  save() {
    this.progressSpinner = true;
    let url = "";

    if (!this.modoEdicion) {
      url = "gestionComisarias_createComisaria";
      this.callSaveService(url);

    } else {
      url = "gestionComisarias_updateComisarias";
      this.callSaveService(url);
    }

  }

  cambiaMovil() {
    // if (this.movilCheck)
    //   this.body.visibleMovil = 1
    // else
    //   this.body.visibleMovil = 0
  }

  callSaveService(url) {
    // if (this.body.nombre != undefined) this.body.nombre = this.body.nombre.trim();
    // if (this.body.visibleMovil == null)
    //   this.body.visibleMovil = 0
    // this.sigaServices.post(url, this.body).subscribe(
    //   data => {

    //     if (!this.modoEdicion) {
    //       this.modoEdicion = true;
    //       this.idComisaria = JSON.parse(data.body).id;
    //       let send = {
    //         modoEdicion: this.modoEdicion,
    //         idComisaria: this.idComisaria
    //       }
    //       this.body.idComisaria = this.idComisaria
    //       this.persistenceService.setDatos(this.body);
    //       this.modoEdicionSend.emit(send);
    //     }

    //     this.bodyInicial = JSON.parse(JSON.stringify(this.body));

    //     this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
    //     this.progressSpinner = false;
    //   },
    //   err => {

    //     if (err.error != undefined && JSON.parse(err.error).error.description != "") {
    //       this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
    //     } else {
    //       this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
    //     }
    //     this.progressSpinner = false;
    //   },
    //   () => {
    //     this.progressSpinner = false;
    //   }
    // );

  }

  onChangeCodigoPostal() {
    // if (
    //   this.isValidCodigoPostal() &&
    //   this.body.codigoPostal.length == 5
    // ) {
    //   let value = this.body.codigoPostal.substring(0, 2);
    //   this.provinciaSelecionada = value;
    //   this.isDisabledPoblacion = false;
    //   if (value != this.body.idProvincia) {
    //     this.body.idProvincia = this.provinciaSelecionada;
    //     this.body.idPoblacion = "";
    //     this.body.nombrePoblacion = "";
    //     this.comboPoblacion = [];
    //     if (this.historico == true) {
    //       this.isDisabledPoblacion = true;
    //     } else {
    //       this.isDisabledPoblacion = false;
    //     }
    //   }
    //   this.codigoPostalValido = true;
    // } else {
    //   this.codigoPostalValido = false;
    //   this.isDisabledPoblacion = true;
    //   this.provinciaSelecionada = "";

    // }
  }

  isValidCodigoPostal(): boolean {
     return (true
    //   this.body.codigoPostal &&
    //   typeof this.body.codigoPostal === "string" &&
    //   /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(this.body.codigoPostal)
    );
  }

  checkPermisosRest() {
    // let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.historico);

    // if (msg != undefined) {
    //   this.msgs = msg;
    // } else {
    //   this.rest();
    // }
  }

  rest() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.changeEmail();

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
    this.commonsService.openOutlook(correo);
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

  disabledSave() {

    // if (!this.historico && ((this.body.nombre != null && this.body.nombre != undefined && this.body.nombre.trim() != "") &&
    //   (this.body.codigoPostal != undefined && this.body.codigoPostal != null && this.body.codigoPostal.trim() != "" && this.body.codigoPostal.trim().length >= 4 && this.body.codigoPostal.trim().length <= 5)
    //   && this.body.idProvincia != undefined &&
    //   this.body.idProvincia != "" && this.body.idPoblacion != null && this.body.idPoblacion != "" && !this.avisoMail && this.tlf1Valido
    //   && this.tlf2Valido && this.faxValido && this.mvlValido) && this.permisoEscritura && (JSON.stringify(this.body) != JSON.stringify(this.bodyInicial))) {
    //   return false;
    // } else {
    //   return true;
    // }
  }

  changeEmail() {
    // if (this.commonsService.validateEmail(this.body.email) && this.body.email != null && this.body.email != "") {
    //   this.emailValido = true
    //   this.avisoMail = false
    // }
    // else {

    //   if (this.body.email != null && this.body.email != "" && this.body.email != undefined) {
    //     this.avisoMail = true
    //     this.emailValido = false
    //   } else {
    //     this.emailValido = true
    //     this.avisoMail = false
    //   }

    // }
  }

  changeTelefono1() {
    // this.body.telefono1 = this.body.telefono1.trim();
    // this.tlf1Valido = this.commonsService.validateTelefono(this.body.telefono1);
  }

  changeTelefono2() {
    // this.body.telefono2 = this.body.telefono2.trim();
    // this.tlf2Valido = this.commonsService.validateTelefono(this.body.telefono2);
  }

  changeFax() {
    // this.body.fax1 = this.body.fax1.trim();
    // this.faxValido = this.commonsService.validateFax(this.body.fax1);
  }
  onChangeDireccion() {
    // this.body.domicilio = this.body.domicilio.trim();
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    else {
      return false;

    }
  }
  clear() {
    this.msgs = [];
  }

 }
