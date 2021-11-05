import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CuentasBancariasItem } from '../../../../../models/CuentasBancariasItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-configuracion-cuenta-bancaria',
  templateUrl: './configuracion-cuenta-bancaria.component.html',
  styleUrls: ['./configuracion-cuenta-bancaria.component.scss']
})
export class ConfiguracionCuentaBancariaComponent implements OnInit {

  msgs;
  progressSpinner: boolean = false;

  @Input() openTarjetaConfiguracion;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<any>();

  bodyInicial: CuentasBancariasItem;
  body: CuentasBancariasItem = new CuentasBancariasItem();

  resaltadoDatos: boolean = false;

  // Combos
  comboConfigFicherosSecuencia = [];
  comboConfigFicheroEsquema = [];
  comboConfigLugaresQueMasSecuencia = [];
  comboConfigConceptoAmpliado = [];

  constructor(
    private persistenceService: PersistenceService,
    private commonsService: CommonsService
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    if (this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }

    this.progressSpinner = false;
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

  // Estilo obligatorio
  styleObligatorio(evento: string) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaConfiguracion;
  }

  abreCierraFicha(key): void {
    this.openTarjetaConfiguracion = !this.openTarjetaConfiguracion;
    this.opened.emit(this.openTarjetaConfiguracion);
    this.idOpened.emit(key);
  }

}
