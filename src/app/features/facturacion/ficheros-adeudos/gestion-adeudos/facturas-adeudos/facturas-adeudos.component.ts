import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate';
import { FicherosAdeudosItem } from '../../../../../models/sjcs/FicherosAdeudosItem';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-facturas-adeudos',
  templateUrl: './facturas-adeudos.component.html',
  styleUrls: ['./facturas-adeudos.component.scss']
})
export class FacturasAdeudosComponent implements OnInit {

  @Input() bodyInicial: FicherosAdeudosItem;
  @Input() modoEdicion;
  @Input() openTarjetaFacturas;
  @Input() permisoEscritura;
  @Input() tarjetaFacturas: string;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  // @Output() guardadoSend = new EventEmitter<any>();

  openFicha: boolean = true;
  progressSpinner: boolean = false;
  resaltadoDatos: boolean = false;
  activacionTarjeta: boolean = true;

  body: FicherosAdeudosItem;

  msgs;

  fichaPosible = {
    key: "facturas",
    activa: false
  }
  
  constructor(private sigaServices: SigaServices, private confirmationService: ConfirmationService, private commonsServices: CommonsService, private translateService: TranslateService, private localStorageService: SigaStorageService) { }

  async ngOnInit() {
    await this.rest();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaFacturas == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
  }

  rest(){
    this.body =  JSON.parse(JSON.stringify(this.bodyInicial));
    this.resaltadoDatos = false;

    // this.arreglaFechas();
  }

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

  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsServices.styleObligatorio(evento);
    }
  }

  muestraCamposObligatorios() {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatos = true;
  }

  esFichaActiva(key) {
    return this.fichaPosible.activa;
  }

  abreCierraFicha(key) {
    if (key == "facturas" && !this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }

    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }
}
