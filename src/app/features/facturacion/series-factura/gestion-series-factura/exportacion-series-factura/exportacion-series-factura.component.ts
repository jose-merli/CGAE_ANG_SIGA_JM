import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-exportacion-series-factura',
  templateUrl: './exportacion-series-factura.component.html',
  styleUrls: ['./exportacion-series-factura.component.scss']
})
export class ExportacionSeriesFacturaComponent implements OnInit, OnChanges {

  msgs: Message[];
  progressSpinner: boolean = false;

  body: SerieFacturacionItem;
  @Input() bodyInicial: SerieFacturacionItem;

  comboConfDeudor: any[] = [];
  comboConfIngresos: any[] = [];

  @Input() openTarjetaExportacionContabilidad;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<SerieFacturacionItem>();
  
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    this.getCombos();

    this.progressSpinner = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial) {
      this.restablecer();
    }
  }

  // Get combos

  getCombos(): void {
    this.comboConfDeudor = [
      {value: 'F', label: 'Fijo'},
      {value: 'C', label: 'Incorporar Subcuenta Cliente'}
    ];

    this.comboConfIngresos = [
      {value: 'F', label: 'Fijo'},
      {value: 'C', label: 'Incorporar Subcuenta Cliente'},
      {value: 'P', label: 'Incorporar Subcuenta Productos/Servicios'},
    ];
  }

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }

  // Guardar

  guardar(): void {
    if (!this.deshabilitarGuardado()) {
      this.guardadoSend.emit(this.body);
    }
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.body.confDeudor == this.bodyInicial.confDeudor
      && this.body.ctaClientes == this.bodyInicial.ctaClientes
      && this.body.confIngresos == this.bodyInicial.confIngresos
      && this.body.ctaIngresos == this.bodyInicial.ctaIngresos;
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

  // Label de un combo
  findLabelInCombo(combo: any[], value) {
    let item = combo.find(c => c.value == value);
    return item ? item.label : "";
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaExportacionContabilidad;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaExportacionContabilidad = !this.openTarjetaExportacionContabilidad;
    this.opened.emit(this.openTarjetaExportacionContabilidad);
    this.idOpened.emit(key);
  }

}
