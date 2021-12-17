import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate';
import { CuentasBancariasItem } from '../../../../../models/CuentasBancariasItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-datos-generales-cuenta-bancaria',
  templateUrl: './datos-generales-cuenta-bancaria.component.html',
  styleUrls: ['./datos-generales-cuenta-bancaria.component.scss']
})
export class DatosGeneralesCuentaBancariaComponent implements OnInit, OnChanges {

  msgs;
  progressSpinner: boolean = false;

  @Input() modoEdicion: boolean;
  @Input() openTarjetaDatosGenerales;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<CuentasBancariasItem>();
  @Output() refreshData = new EventEmitter<void>();

  @Input() bodyInicial: CuentasBancariasItem;
  body: CuentasBancariasItem = new CuentasBancariasItem();
  estado: string;

  resaltadoDatos: boolean = false;
  resaltadoIBAN: boolean = false;
  focusIBAN: boolean = false; // Para cambiar dinámicamente la restricción de longitud

  constructor(
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() { }

  // Solo se restablecen los datos si el body cambia
  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial || changes.modoEdicion) {
      this.restablecer();
    }
    
  }

  // Eliminar espacios del IBAN
  removeSpacesFromIBAN(): void {
    this.focusIBAN = true;
    this.body.iban = this.body.iban.replace(/\s/g, "");
  }

  // Añadir espacios al IBAN
  addSpacesToIBAN(): void {
    this.focusIBAN = false;
    
    if (this.modoEdicion) {
      this.body.iban = this.body.iban.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
    } else if(this.body.iban != undefined && this.body.iban.trim().length != 0) {
      this.body.iban = this.body.iban.toUpperCase();
      this.validarIBAN(this.body.iban);
      this.body.iban = this.body.iban.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
    } else {
      this.body.bic = "";
      this.body.nombre = "";
      this.body.descripcion = "";
    }

  }

  // Propiedad derivada: Estado
  checkEstado(): void {
    this.estado = this.body.fechaBaja ? `BAJA DESDE ${this.datePipe.transform(this.body.fechaBaja, 'dd/MM/yyyy')}` :
      (this.body.numUsos != undefined ? (this.body.numUsos > 0 ? "EN USO" : "SIN USO") : "-");
  }

  // Obtener descripción

  calcDescripcion(): void {
    let abrBanco: string = "";

    if (this.body.nombre.indexOf("~") > 1) {
      abrBanco = this.body.nombre.substring(0, this.body.nombre.indexOf("~")).trim();
    } else if (this.body.nombre.indexOf("(") > 0) {
      abrBanco = this.body.nombre.substring(0, this.body.nombre.indexOf("(")).trim();
    } else {
      abrBanco = this.body.nombre;
    }

    let ibanEnd: string = this.body.iban.slice(-4);
    this.body.descripcion = `${abrBanco} (...${ibanEnd})`;
  }

  // Botón de restablecer
  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.checkEstado();
    this.addSpacesToIBAN();
    
    this.resaltadoDatos = false;
  }

  // Validar IBAN
  validarIBAN(cuenta: string): void {
    let esValido = cuenta != undefined && cuenta.length == 24;

    if (!esValido) {
      this.showMessage("error", "Error", this.translateService.instant("facturacion.cuentaBancaria.iban.invalid.longitud"));
      this.body.bic = "";
        this.body.nombre = "";
        this.body.descripcion = "";
        this.resaltadoIBAN = true;
    } else {
      esValido = /^\d+$/.test(cuenta.substring(2, 24));

      if (!esValido) {
        this.showMessage("error", "Error", this.translateService.instant("censo.datosBancarios.mensaje.control.ibanIncorrecto"));
        this.body.bic = "";
        this.body.nombre = "";
        this.body.descripcion = "";
        this.resaltadoIBAN = true;
      } else {
        this.progressSpinner = true;

        this.validateIBANBackend(cuenta).catch(error => {
          this.body.bic = "";
          this.body.nombre = "";
          this.body.descripcion = "";
          this.resaltadoIBAN = true;
          
          if (error != undefined) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), error);
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          }
        }).then(() => this.progressSpinner = false);
      }
    }

  }

  // Valida el IBAN en Backend y devuelve información del banco
  validateIBANBackend(cuenta: string): Promise<any> {
    return this.sigaServices.post("facturacionPyS_validarIBANCuentaBancaria", {iban: cuenta}).toPromise().then(
      n => {
        let datos: CuentasBancariasItem[] =  JSON.parse(n.body).cuentasBancariasITem;
        
        if (datos.length != 0) {
          this.resaltadoIBAN = false;
          this.body.bic = datos[0].bic;
          this.body.nombre = datos[0].nombre;

          this.calcDescripcion();
        } else {
          return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
        }
      },
      err => {
        let error = JSON.parse(err.error).error;
        if (error != undefined && error.message != undefined) {
          let translatedError = this.translateService.instant(error.message);
          if (translatedError && translatedError.trim().length != 0) {
            return Promise.reject(translatedError);
          }
        }

        return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  // Guadar si el body ha cambiado y si el iban es valido
  isValid(): boolean {
    return this.body.descripcion != undefined && this.body.descripcion.trim() != "";
  }

  checkSave(): void {
    if (this.isValid() && !this.deshabilitarGuardado()) {
      this.removeSpacesFromIBAN();
      this.guardadoSend.emit(this.body);
    } else {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatos = true;
    }
  }

  // Eliminar cuenta bancaria
  confirmEliminar(): void {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    let icon = "fa fa-eraser";

    this.confirmationService.confirm({
      //key: "asoc",
      message: mess,
      icon: icon,
      accept: () => {
        this.eliminar();
      },
      reject: () => {
        this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
      }
    });
  }

  eliminar(): void {
    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_borrarCuentasBancarias", [this.body]).subscribe(
      data => {
        this.progressSpinner = false;
        this.refreshData.emit();
      },
      err => {
        let error = JSON.parse(err.error).error;
        if (error != undefined && error.message != undefined) {
          let translatedError = this.translateService.instant(error.message);
          if (translatedError && translatedError.trim().length != 0) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), error);
          }
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }
        
      }
    );
  }

  styleIBANIncorrecto() {
    if (this.resaltadoIBAN) {
      return 'camposObligatorios';
    }
  }

  styleObligatorio(evento: string) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  // Comprueba si una serie se encuentra de baja o no
  esActivo(): boolean {
    return this.body.fechaBaja == undefined || this.body.fechaBaja == null;
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.body.iban == undefined || this.body.iban.trim().length == 0 || this.body.descripcion == undefined || this.modoEdicion 
      && this.body.descripcion == this.bodyInicial.descripcion
      && (this.body.asientoContable == this.bodyInicial.asientoContable || (this.body.asientoContable == undefined || this.body.asientoContable.length == 0) && (this.bodyInicial.asientoContable == undefined || this.bodyInicial.asientoContable.length == 0))
      && (this.body.cuentaContableTarjeta == this.bodyInicial.cuentaContableTarjeta || (this.body.cuentaContableTarjeta == undefined || this.body.cuentaContableTarjeta.length == 0) && (this.bodyInicial.cuentaContableTarjeta == undefined || this.bodyInicial.cuentaContableTarjeta.length == 0));
  }

  // Abrir y cerrar la ficha
  esFichaActiva(): boolean {
    return this.openTarjetaDatosGenerales;
  }

  abreCierraFicha(key): void {
    this.openTarjetaDatosGenerales = !this.openTarjetaDatosGenerales;
    this.opened.emit(this.openTarjetaDatosGenerales);
    this.idOpened.emit(key);
  }

  // Funciones de utilidad para los mensajes
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }
}