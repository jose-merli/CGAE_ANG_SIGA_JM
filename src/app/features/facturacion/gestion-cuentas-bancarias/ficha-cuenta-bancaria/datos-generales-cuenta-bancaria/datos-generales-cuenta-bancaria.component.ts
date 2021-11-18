import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate';
import { CuentasBancariasItem } from '../../../../../models/CuentasBancariasItem';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
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
  @Output() guardadoSend = new EventEmitter<any>();

  @Input() bodyInicial: CuentasBancariasItem;
  body: CuentasBancariasItem = new CuentasBancariasItem();
  estado: string;

  resaltadoDatos: boolean = false;
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

  ngOnChanges() {
    this.restablecer();
  }

  // Validación del IBAN

  removeSpacesFromIBAN(): void {
    this.focusIBAN = true;
    this.body.iban = this.body.iban.replace(/\s/g, "");
  }

  addSpacesToIBAN(): void {
    this.focusIBAN = false;
    this.body.iban = this.body.iban.replace(/\s/g, "").replace(/(.{4})/g,"$1 ").trim();
  }

  // Comprobar el estado

  checkEstado(): void {
    this.estado = this.body.fechaBaja ? `BAJA DESDE ${this.datePipe.transform(this.body.fechaBaja, 'dd/MM/yyyy')}` : 
        ( this.body.numUsos != undefined ? (this.body.numUsos > 0 ? "EN USO" : "SIN USO") : "-");
  }

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.checkEstado();
    this.addSpacesToIBAN();
    this.resaltadoDatos = false;
  }

  // Guadar

  isValid(): boolean {
    return this.body.iban != undefined && this.body.iban.trim() != "" && this.body.iban.length == 24;
  }

  checkSave(): void {
    this.removeSpacesFromIBAN();
    if (this.isValid()) {
      this.save();
    } else {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatos = true;
    }
  }

  save(): void {
    this.progressSpinner = true;

    if (this.modoEdicion) {
      this.sigaServices.post("facturacionPyS_actualizaCuentaBancaria", this.body).subscribe(
        n => {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.persistenceService.setDatos(this.body);
          this.guardadoSend.emit();
  
          this.progressSpinner = false;
        },
        err => {
          let error = JSON.parse(err.error).error;
          if (error != undefined && error.message != undefined) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.message));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          }

          this.addSpacesToIBAN();
  
          this.progressSpinner = false;
        }
      );
    } else {
      this.sigaServices.post("facturacionPyS_insertaCuentaBancaria", this.body).subscribe(
        n => {
          let bancosCodigo = JSON.parse(n.body).id;
          this.body.bancosCodigo = bancosCodigo;
          this.recuperarCuentaBancaria();

          this.progressSpinner = false;
        },
        err => {
          let error = JSON.parse(err.error).error;
          if (error != undefined && error.message != undefined) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.message));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          }
  
          this.addSpacesToIBAN();

          this.progressSpinner = false;
        }
      );
    }
    
  }

  recuperarCuentaBancaria(): void {
    this.sigaServices.getParam("facturacionPyS_getCuentasBancarias", "?idCuenta=" + this.body.bancosCodigo).subscribe(
      n => {
        let datos: CuentasBancariasItem[] = JSON.parse(n.body).cuentasBancariasITem;

        if (datos.length != 0) {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          this.body = datos.find(d => d.bancosCodigo == this.body.bancosCodigo);
          this.persistenceService.setDatos(this.body);
          this.guardadoSend.emit();
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
        
        this.progressSpinner = false;
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      }
    );
  }

  // Eliminar cuenta bancaria

  confirmEliminar(): void {
    let mess = "Se va a proceder a dar de baja la cuenta bancaria ¿Desea continuar?";
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
        this.body.fechaBaja = new Date();
        this.persistenceService.setDatos(this.body);
        this.guardadoSend.emit();
        this.showMessage("success", "Eliminar", "La cuenta bancaria ha sido dada de baja con exito.");
      },
      err => {
        console.log(err);
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  // Estilo obligatorio
  styleObligatorio(evento: string) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  // Comprueba si una serie se encuentra de baja o no
  esActivo(): boolean {
    return this.body.fechaBaja == undefined || this.body.fechaBaja == null;
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

  // Mensajes en pantalla

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
