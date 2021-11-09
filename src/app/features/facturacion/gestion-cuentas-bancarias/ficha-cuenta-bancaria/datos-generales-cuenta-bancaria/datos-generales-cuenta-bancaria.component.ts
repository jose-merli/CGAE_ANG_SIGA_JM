import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class DatosGeneralesCuentaBancariaComponent implements OnInit {

  msgs;
  progressSpinner: boolean = false;

  @Input() openTarjetaDatosGenerales;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<any>();

  bodyInicial: CuentasBancariasItem;
  body: CuentasBancariasItem = new CuentasBancariasItem();

  resaltadoDatos: boolean = false;
  focusIBAN: boolean = false; // Para cambiar dinámicamente la restricción de longitud

  constructor(
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    if (this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();
      
      console.log(this.body);

      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }

    this.progressSpinner = false;
  }

  // Validación del IBAN

  onFocusIBAN(event): void {
    this.focusIBAN = true;
    this.body.iban = this.body.iban.replace(/\s/g, "");
  }

  onBlurIBAN(event): void {
    this.focusIBAN = false;
    this.body.iban = this.body.iban.replace(/\s/g, "").replace(/(.{4})/g,"$1 ").trim();
  }

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.resaltadoDatos = false;
  }

  // Eliminar series de facturación

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
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        this.persistenceService.setDatos(this.bodyInicial);
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
