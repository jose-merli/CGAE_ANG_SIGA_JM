import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { CuentasBancariasItem } from '../../../../../models/CuentasBancariasItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-configuracion-cuenta-bancaria',
  templateUrl: './configuracion-cuenta-bancaria.component.html',
  styleUrls: ['./configuracion-cuenta-bancaria.component.scss']
})
export class ConfiguracionCuentaBancariaComponent implements OnInit, OnChanges {

  msgs;
  progressSpinner: boolean = false;

  @Input() openTarjetaConfiguracion;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<any>();

  bodyInicial: CuentasBancariasItem;
  @Input() body;

  resaltadoDatos: boolean = false;

  // Combos
  comboConfigFicherosSecuencia = [];
  comboconfigFicherosEsquema = [];
  comboConfigLugaresQueMasSecuencia = [];
  comboConfigConceptoAmpliado = [];

  constructor(
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    this.getCombos();

    this.progressSpinner = false;
  }

  ngOnChanges() {
    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
  }

  // Cargar combos

  getCombos() {
    this.comboConfigFicherosSecuencia = [
      { value: "0", label: "Uno para todos los recibos (primeros + recurrentes)" },
      { value: "1", label: "Uno para primeros recibos y otro para recurrentes" },
      { value: "2", label: "Todos los recibos se consideran recurrentes" }
    ];

    this.comboconfigFicherosEsquema = [
      { value: "0", label: "Uno para todos los esquemas (CORE+COR1+B2B)" },
      { value: "1", label: "Uno para CORE+COR1 y otro para B2B" },
      { value: "2", label: "Uno para cada esquema separados CORE; COR1; B2B" }
    ];

    this.comboConfigLugaresQueMasSecuencia = [
      { value: "0", label: "En el bloque del acreedor (normativa AEB)" },
      { value: "1", label: "En cada registro individual (normativa UE)" }
    ];

    this.comboConfigConceptoAmpliado = [
      { value: "0", label: "Normal (140 caracteres)" },
      { value: "1", label: "Ampliado (640 caracteres)" }
    ];
  }

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.resaltadoDatos = false;
  }

  // Guadar

  isValid(): boolean {
    return this.body.configFicherosSecuencia != undefined && this.body.configFicherosSecuencia.trim() != ""
      && this.body.configFicherosEsquema != undefined && this.body.configFicherosEsquema.trim() != ""
      && this.body.configLugaresQueMasSecuencia != undefined && this.body.configLugaresQueMasSecuencia.trim() != ""
      && this.body.configConceptoAmpliado != undefined && this.body.configConceptoAmpliado.trim() != "";
  }

  checkSave(): void {
    if (this.isValid()) {
      this.save();
    } else {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatos = true;
    }
  }

  save(): void {
    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_actualizaCuentaBancaria", this.body).subscribe(
      n => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.persistenceService.setDatos(this.body);
        this.guardadoSend.emit();

        this.progressSpinner = false;
      },
      err => {
        let error = JSON.parse(err.error).error;
        if (error != undefined && error.message != undefined) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.message));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }

        this.progressSpinner = false;
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

  // Label de un combo
  findLabelInCombo(combo: any[], value) {
    let item = combo.find(c => c.value == value);
    return item ? item.label : "";
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
