import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-traspaso-series-factura',
  templateUrl: './traspaso-series-factura.component.html',
  styleUrls: ['./traspaso-series-factura.component.scss']
})
export class TraspasoSeriesFacturaComponent implements OnInit, OnChanges {

  msgs: Message[];
  progressSpinner: boolean = false;

  body: SerieFacturacionItem;
  @Input() bodyInicial: SerieFacturacionItem;

  @Input() openTarjetaTraspasoFacturas;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<SerieFacturacionItem>();

  resaltadoDatos: boolean = false;
  
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial) {
      this.restablecer();
    }
  }

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }

  // Guardar

  isValid(): boolean {
    return this.body.traspasoFacturas == undefined ||!this.body.traspasoFacturas || ( this.body.traspasoFacturas 
      && this.body.traspasoPlantilla != undefined && this.body.traspasoPlantilla.trim() != "" && this.body.traspasoPlantilla.trim().length <= 10 
      && this.body.traspasoCodAuditoriaDef != undefined && this.body.traspasoCodAuditoriaDef.trim() != "" && this.body.traspasoCodAuditoriaDef.trim().length <= 10);
  }

  checkSave(): void {
    if (this.isValid() && !this.deshabilitarGuardado()) {
      this.guardadoSend.emit(this.body);
    } else {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatos = true;
    }
  }

  // Estilo obligatorio
  styleObligatorio(evento: string) {
    if (this.resaltadoDatos && this.body.traspasoFacturas && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.body.traspasoFacturas == this.bodyInicial.traspasoFacturas
      && this.body.traspasoPlantilla == this.bodyInicial.traspasoPlantilla
      && this.body.traspasoCodAuditoriaDef == this.bodyInicial.traspasoCodAuditoriaDef;
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

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaTraspasoFacturas;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaTraspasoFacturas = !this.openTarjetaTraspasoFacturas;
    this.opened.emit(this.openTarjetaTraspasoFacturas);
    this.idOpened.emit(key);
  }

}
