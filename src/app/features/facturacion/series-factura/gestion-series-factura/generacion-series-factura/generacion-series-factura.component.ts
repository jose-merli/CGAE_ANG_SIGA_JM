import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-generacion-series-factura',
  templateUrl: './generacion-series-factura.component.html',
  styleUrls: ['./generacion-series-factura.component.scss']
})
export class GeneracionSeriesFacturaComponent implements OnInit, OnChanges {

  msgs: Message[];
  progressSpinner: boolean = false;

  body: SerieFacturacionItem;
  @Input() bodyInicial: SerieFacturacionItem;

  comboModeloFactura: any[] = [];
  comboModeloFacturaRectificativa: any[] = [];

  @Input() openTarjetaGeneracion;
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

  ngOnInit() { 
    this.progressSpinner = true;
    Promise.all([
      this.getComboModelosComunicacion(),
      this.getComboModelosComunicacionRectificativa()
    ]).then(() => this.progressSpinner = false);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial) {
      this.restablecer();
    }
  }

  getComboModelosComunicacion() {
    this.sigaServices.get("facturacionPyS_comboModelosComunicacion").subscribe(
      n => {
        this.comboModeloFactura = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboModeloFactura);
      },
      err => {

      }
    );
  }

  getComboModelosComunicacionRectificativa() {
    this.sigaServices.getParam("facturacionPyS_comboModelosComunicacion", "?esRectificativa=true").subscribe(
      n => {
        this.comboModeloFacturaRectificativa = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboModeloFacturaRectificativa);
      },
      err => {

      }
    );
  }

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.resaltadoDatos = false;
  }

  // Guardar

  isValid(): boolean {
    return this.body.idModeloFactura != undefined && this.body.idModeloFactura.trim() != ""
      && this.body.idModeloRectificativa != undefined && this.body.idModeloRectificativa.trim() != "";
  }

  checkSave(): void {
    if (this.isValid()) {
      this.guardadoSend.emit(this.body);
    } else {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatos = true;
    }
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

  // Estilo obligatorio
  styleObligatorio(evento: string) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.body != undefined && this.body.generarPDF == this.bodyInicial.generarPDF
      && this.body.idModeloFactura == this.bodyInicial.idModeloFactura
      && this.body.idModeloRectificativa == this.bodyInicial.idModeloRectificativa;
  }

  // Label de un combo
  findLabelInCombo(combo: any[], value) {
    let item = combo.find(c => c.value == value);
    return item ? item.label : "";
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaGeneracion;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaGeneracion = !this.openTarjetaGeneracion;
    this.opened.emit(this.openTarjetaGeneracion);
    this.idOpened.emit(key);
  }

}