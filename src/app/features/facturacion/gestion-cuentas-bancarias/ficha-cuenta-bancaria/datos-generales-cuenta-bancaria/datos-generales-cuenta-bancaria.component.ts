import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CuentasBancariasItem } from '../../../../../models/CuentasBancariasItem';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';

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

  constructor(
    private persistenceService: PersistenceService,
    private commonsService: CommonsService
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


}
