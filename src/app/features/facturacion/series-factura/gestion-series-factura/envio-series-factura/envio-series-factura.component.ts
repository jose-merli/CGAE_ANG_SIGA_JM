import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-envio-series-factura',
  templateUrl: './envio-series-factura.component.html',
  styleUrls: ['./envio-series-factura.component.scss']
})
export class EnvioSeriesFacturaComponent implements OnInit, OnChanges {

  msgs: Message[];
  progressSpinner: boolean = false;

  body: SerieFacturacionItem;
  @Input() bodyInicial: SerieFacturacionItem;
  resaltadoDatos: boolean = false;

  comboPlantillasEnvio: any[] = [];

  @Input() openTarjetaEnvioFacturas;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<SerieFacturacionItem>();
  
  constructor(
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial) {
      this.getComboPlantillasEnvio();
      this.restablecer();
    }
  }

  // Combo de plantillas envío masivo

  getComboPlantillasEnvio() {
    this.progressSpinner = true;

    this.sigaServices.get("facturacionPyS_comboPlantillasEnvio").subscribe(
      n => {
        this.comboPlantillasEnvio = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboPlantillasEnvio);
        console.log(n);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.resaltadoDatos = false;
  }

  
  isValid(): boolean {
    return !this.body.envioFacturas || (this.body.envioFacturas && this.body.idPlantillaMail != null );
  }

  checkSave(): void {
    if (this.isValid() && !this.deshabilitarGuardado()) {
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

  // Label de un combo
  findLabelInCombo(combo: any[], value) {
    let item = combo.find(c => c.value == value);
    return item ? item.label : "";
  }

  // Estilo obligatorio
  styleObligatorio(evento: string) {
    if (this.resaltadoDatos && this.body.envioFacturas && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.body.envioFacturas == this.bodyInicial.envioFacturas
      && this.body.idPlantillaMail == this.bodyInicial.idPlantillaMail;
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaEnvioFacturas;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaEnvioFacturas = !this.openTarjetaEnvioFacturas;
    this.opened.emit(this.openTarjetaEnvioFacturas);
    this.idOpened.emit(key);
  }

}
