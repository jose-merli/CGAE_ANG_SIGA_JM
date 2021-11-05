import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CuentasBancariasItem } from '../../../../../models/CuentasBancariasItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-uso-ficheros-cuenta-bancaria',
  templateUrl: './uso-ficheros-cuenta-bancaria.component.html',
  styleUrls: ['./uso-ficheros-cuenta-bancaria.component.scss']
})
export class UsoFicherosCuentaBancariaComponent implements OnInit {

  msgs;
  progressSpinner: boolean = false;

  @Input() openTarjetaUsoFicheros;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<any>();

  bodyInicial: CuentasBancariasItem;
  body: CuentasBancariasItem = new CuentasBancariasItem();

  resaltadoDatos: boolean = false;

  // Combos
  comboSufijos = [];

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
    if (this.resaltadoDatos && this.body.sjcs && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaUsoFicheros;
  }

  abreCierraFicha(key): void {
    this.openTarjetaUsoFicheros = !this.openTarjetaUsoFicheros;
    this.opened.emit(this.openTarjetaUsoFicheros);
    this.idOpened.emit(key);
  }

}
