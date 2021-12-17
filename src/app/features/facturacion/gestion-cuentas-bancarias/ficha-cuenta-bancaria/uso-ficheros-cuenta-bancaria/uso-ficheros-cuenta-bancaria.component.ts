import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { CuentasBancariasItem } from '../../../../../models/CuentasBancariasItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-uso-ficheros-cuenta-bancaria',
  templateUrl: './uso-ficheros-cuenta-bancaria.component.html',
  styleUrls: ['./uso-ficheros-cuenta-bancaria.component.scss']
})
export class UsoFicherosCuentaBancariaComponent implements OnInit, OnChanges {

  msgs;
  progressSpinner: boolean = false;

  @Input() openTarjetaUsoFicheros;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<CuentasBancariasItem>();

  @Input() bodyInicial: CuentasBancariasItem;
  body: CuentasBancariasItem;

  resaltadoDatos: boolean = false;

  // Combos
  comboSufijos = [];

  constructor(
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private sigaServices: SigaServices,
    private translateService: TranslateService
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial) {
      this.getComboSufijo();
      this.restablecer();
    }
  }

  // Combo de sufijos

  getComboSufijo() {
    this.sigaServices.get("facturacionPyS_comboSufijo").subscribe(
      n => {
        this.comboSufijos = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboSufijos);
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
    return !this.body.sjcs || (this.body.sjcs && this.body.idSufijoSjcs != undefined && this.body.idSufijoSjcs.trim() != "");
  }

  checkSave(): void {
    if (this.isValid() && !this.deshabilitarGuardado()) {
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

  // Label de un combo
  findLabelInCombo(combo: any[], value) {
    let item = combo.find(c => c.value == value);
    return item ? item.label : "";
  }

  // Estilo obligatorio
  styleObligatorio(evento: string) {
    if (this.resaltadoDatos && this.body.sjcs && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.body.sjcs == this.bodyInicial.sjcs && this.body.idSufijoSjcs == this.bodyInicial.idSufijoSjcs;
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
