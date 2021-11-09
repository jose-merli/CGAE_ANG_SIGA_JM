import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CuentasBancariasItem } from '../../../../../models/CuentasBancariasItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-comision-cuenta-bancaria',
  templateUrl: './comision-cuenta-bancaria.component.html',
  styleUrls: ['./comision-cuenta-bancaria.component.scss']
})
export class ComisionCuentaBancariaComponent implements OnInit {

  msgs;
  progressSpinner: boolean = false;

  @Input() openTarjetaComision;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<any>();

  bodyInicial: CuentasBancariasItem;
  body: CuentasBancariasItem = new CuentasBancariasItem();

  resaltadoDatos: boolean = false;

  // Combos
  comboTiposIVA = [];

  constructor(
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    if (this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }

    this.getComboTiposIVA();

    this.progressSpinner = false;
  }

  // Combo de tipos IVA
  getComboTiposIVA() {
    this.sigaServices.getParam("facturacionPyS_comboTiposIVA", "?codBanco=" + this.body.codBanco).subscribe(
      n => {
        this.comboTiposIVA = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTiposIVA);
      },
      err => {
        console.log(err);
      }
    );
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
    return this.openTarjetaComision;
  }

  abreCierraFicha(key): void {
    this.openTarjetaComision = !this.openTarjetaComision;
    this.opened.emit(this.openTarjetaComision);
    this.idOpened.emit(key);
  }


}
