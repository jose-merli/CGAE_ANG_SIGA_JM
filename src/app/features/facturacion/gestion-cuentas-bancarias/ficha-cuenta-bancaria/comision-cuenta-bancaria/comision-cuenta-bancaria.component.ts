import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { CuentasBancariasItem } from '../../../../../models/CuentasBancariasItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-comision-cuenta-bancaria',
  templateUrl: './comision-cuenta-bancaria.component.html',
  styleUrls: ['./comision-cuenta-bancaria.component.scss']
})
export class ComisionCuentaBancariaComponent implements OnInit, OnChanges {

  msgs;
  progressSpinner: boolean = false;

  @Input() openTarjetaComision;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<CuentasBancariasItem>();

  @Input() bodyInicial: CuentasBancariasItem;
  body: CuentasBancariasItem;

  resaltadoDatos: boolean = false;

  // Combos
  comboTiposIVA = [];

  constructor(
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private sigaServices: SigaServices,
    private translateService: TranslateService
  ) { }

  ngOnInit() { }

  ngOnChanges() {
    this.restablecer();
    this.getComboTiposIVA();
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

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.resaltadoDatos = false;
  }

  // Guadar

  isValid(): boolean {
    return this.body.comisionImporte != undefined 
      && this.body.comisionDescripcion != undefined && this.body.comisionDescripcion.trim() != ""
      && this.body.idTipoIVA != undefined && this.body.idTipoIVA.trim() != "";
  }

  checkSave(): void {
    if (this.isValid()) {
      this.guardadoSend.emit(this.body);
    } else {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatos = true;
    }
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

  // Label de un combo
  findLabelInCombo(combo: any[], value) {
    let item = combo.find(c => c.value == value);
    return item ? item.label : "";
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
