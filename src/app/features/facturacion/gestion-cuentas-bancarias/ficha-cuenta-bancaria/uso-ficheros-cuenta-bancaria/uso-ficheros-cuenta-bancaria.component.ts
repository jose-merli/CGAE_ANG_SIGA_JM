import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
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
  @Output() guardadoSend = new EventEmitter<any>();

  bodyInicial: CuentasBancariasItem;
  @Input() body: CuentasBancariasItem;

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

  ngOnChanges() {
    this.getComboSufijo();
    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
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
