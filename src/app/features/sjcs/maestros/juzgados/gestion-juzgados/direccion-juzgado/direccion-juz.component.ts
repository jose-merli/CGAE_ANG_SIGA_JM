import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../../commons/translate';
import { JuzgadoItem } from '../../../../../../models/sjcs/JuzgadoItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-direccion-juz',
  templateUrl: './direccion-juz.component.html',
  styleUrls: ['./direccion-juz.component.scss']
})
export class DireccionJuzComponent implements OnInit {

   //Resultados de la busqueda
   @Input() datos: JuzgadoItem;
   datosInicial: JuzgadoItem;
   @Input() modoEdicion;
   @Output() modoEdicionSend = new EventEmitter<any>();

   msgs: Message[];
   openFicha: boolean = true;
   permisoEscritura: boolean = true;
   historico: boolean = false;
   provinciaSelecionada: string;
   isDisabledPoblacion: boolean = true;
   comboProvincias;
   comboPoblacion;
   resultadosPoblaciones;
   codigoPostalValido: boolean = false;
   emailValido: boolean = true;
   tlf1Valido: boolean = true;
   tlf2Valido: boolean = true;
   faxValido: boolean = true;
   mvlValido: boolean = true;
   progressSpinner: boolean = false;
   edicionEmail: boolean = false;
   columnasDirecciones: any = [];
   datosContacto: any[];
   idJuzgado;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private translateService: TranslateService, private commonsService: CommonsService) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos()
    }

    if (this.datos != undefined && this.datos.nombrePoblacion != null) {
      this.getComboPoblacion(this.datos.nombrePoblacion);
    } else {
      this.progressSpinner = false;
    }

    this.getComboProvincias();
    this.validateHistorical();
    this.getDatosContactos();
    
  }

  getDatosContactos() {
    this.columnasDirecciones = [
      {
        field: "tipo",
        header: "censo.consultaDatosGenerales.literal.tipoCliente"
      },
      {
        field: "valor",
        header: "administracion.parametrosGenerales.literal.valor"
      }
    ];
    this.generarTabla();
  }

  generarTabla() {
    this.datosContacto = [
      {
        tipo: "Telefono",
        valor: this.datos.telefono1,
        longitud: 20
      },
      {
        tipo: "Telefono 2",
        valor: this.datos.telefono2,
        longitud: 20
      },
      {
        tipo: "Móvil",
        valor: this.datos.movil,
        longitud: 20
      },
      {
        tipo: "Correo-Electrónico",
        valor: this.datos.email,
        longitud: 100
      },
      {
        tipo: "Fax",
        valor: this.datos.fax,
        longitud: 20
      }
    ];
  }


  abrirFicha() {
    this.openFicha = !this.openFicha;
  }

  clear() {
    this.msgs = [];
  }

  deshabilitarDireccion(): boolean {
    if (!this.codigoPostalValido) {
      return true;
    } else {
      return false;
    }
  }

  changeEmail() {
    this.datos.email = this.datos.email.trim();
    this.emailValido = this.commonsService.validateEmail(this.datos.email);
  }

  editEmail() {
    if (this.edicionEmail)
      this.edicionEmail = false;
    else this.edicionEmail = true;
  }

  changeTelefono1() {
    // if (this.datos.telefono1.length > 8) {
    this.tlf1Valido = this.commonsService.validateTelefono(this.datos.telefono1);
    // }
  }

  changeTelefono2() {
    // if (this.datos.telefono2.length > 8) {
    this.tlf2Valido = this.commonsService.validateTelefono(this.datos.telefono2);
    // }
  }
  changeFax() {
    // if (this.datos.fax.length > 8) {
    this.faxValido = this.commonsService.validateFax(this.datos.fax);
    // }
  }

  changeMovil() {
    // if (this.datos.movil.length > 8) {
    this.mvlValido = this.commonsService.validateMovil(this.datos.movil);
    // }
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

  
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    // this.datosInicial.find(item => item.idAcreditacion === dato.idAcreditacion);

    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    else {
      return false;
    }
  }

  onChangeCodigoPostal() {
    if (
      this.isValidCodigoPostal() &&
      this.datos.codigoPostal.length == 5
    ) {
      let value = this.datos.codigoPostal.substring(0, 2);
      this.provinciaSelecionada = value;
      this.isDisabledPoblacion = false;
      if (value != this.datos.idProvincia) {
        this.datos.idProvincia = this.provinciaSelecionada;
        this.datos.idPoblacion = "";
        this.datos.nombrePoblacion = "";
        this.comboPoblacion = [];
        if (this.historico == true) {
          this.isDisabledPoblacion = true;
        } else {
          this.isDisabledPoblacion = false;
        }
      }
      this.codigoPostalValido = true;
    } else {
      this.datos.idProvincia = undefined;
      this.codigoPostalValido = false;
      this.isDisabledPoblacion = true;
      this.provinciaSelecionada = "";

    }
    this.disabledSave();
  }

  disabledSave() {
    if (!this.historico && ((this.datos.idProvincia != undefined && this.datos.idProvincia != "") &&
      (this.datos.idPoblacion != null && this.datos.idPoblacion != "") && this.emailValido && this.tlf1Valido && !this.isDisabledPoblacion
      && this.tlf2Valido && this.faxValido && this.mvlValido) && this.permisoEscritura && (JSON.stringify(this.datos) != JSON.stringify(this.datosInicial))) {
      return false;
    } else {
      return true;
    }
  }

  isValidCodigoPostal(): boolean {
    return (
      this.datos.codigoPostal &&
      typeof this.datos.codigoPostal === "string" &&
      /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(this.datos.codigoPostal)
    );
  }

  
  getComboProvincias() {
    this.sigaServices.get("busquedaJuzgados_provinces").subscribe(
      n => {
        this.comboProvincias = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboProvincias);
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
      }
    );
  }

  getComboPoblacion(dataFilter) {
    this.sigaServices
      .getParam(
        "busquedaJuzgados_population",
        "?idProvincia=" + this.datos.idProvincia + "&dataFilter=" + dataFilter
      )
      .subscribe(
        n => {
          this.isDisabledPoblacion = false;
          this.comboPoblacion = n.combooItems;
          this.commonsService.arregloTildesCombo(this.comboPoblacion);

          this.progressSpinner = false;

        },
        error => {
          this.progressSpinner = false;
        },
        () => { }
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
    this.disabledSave();
  }

  onChangeProvincia() {

    this.datos.idPoblacion = "";
    this.comboPoblacion = [];

    if (this.datos.idProvincia != undefined && this.datos.idProvincia != "") {
      this.isDisabledPoblacion = false;
    } else {
      this.isDisabledPoblacion = true;
    }
    this.disabledSave();
  }

  checkPermisosRest(){
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.historico);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.rest();
    }
  }

  rest(){
    this.datos = JSON.parse(JSON.stringify(this.datosInicial));
  }

  checkPermisosSave() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.historico);

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

    if (!this.modoEdicion) {
      url = "gestionJuzgados_createCourt";
      this.callSaveService(url);

    } else {
      url = "gestionJuzgados_updateCourt";
      this.callSaveService(url);
    }

  }

  callSaveService(url) {
    if (this.datos.nombre != undefined && this.datos.nombre != "") {
      this.datos.nombre = this.datos.nombre.trim();
    }
    this.sigaServices.post(url, this.datos).subscribe(
      data => {

        if (!this.modoEdicion) {
          this.modoEdicion = true;
          this.idJuzgado = JSON.parse(data.datos).id;
          let send = {
            modoEdicion: this.modoEdicion,
            idJuzgado: this.idJuzgado
          }
          this.datos.idJuzgado = this.idJuzgado
          this.persistenceService.setDatos(this.datos);
          this.modoEdicionSend.emit(send);
        }

        this.datosInicial = JSON.parse(JSON.stringify(this.datos));

        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {

        if (err.error != undefined && JSON.parse(err.error).error.description != "") {
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

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

}
