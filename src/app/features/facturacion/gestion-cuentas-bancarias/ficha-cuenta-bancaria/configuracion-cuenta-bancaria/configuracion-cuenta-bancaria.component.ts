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
  @Output() guardadoSend = new EventEmitter<CuentasBancariasItem>();

  @Input() bodyInicial: CuentasBancariasItem;
  body: CuentasBancariasItem;
  
  tipoFicheros: string = '1'; // SEPA_TIPO_FICHEROS

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
    this.cargarParametrosSEPA();

    this.progressSpinner = false;
  }

  ngOnChanges() {
    this.restablecer();
  }

  // Cargar combos

  getCombos() {
    this.comboConfigFicherosSecuencia = [
      { value: "0", label: this.translateService.instant("facturacion.cuentaBancaria.configFicherosSecuencia0") },
      { value: "1", label: this.translateService.instant("facturacion.cuentaBancaria.configFicherosSecuencia1") },
      { value: "2", label: this.translateService.instant("facturacion.cuentaBancaria.configFicherosSecuencia2") }
    ];

    this.comboconfigFicherosEsquema = [
      { value: "0", label: this.translateService.instant("facturacion.cuentaBancaria.configFicherosEsquema0") },
      { value: "1", label: this.translateService.instant("facturacion.cuentaBancaria.configFicherosEsquema1") },
      { value: "2", label: this.translateService.instant("facturacion.cuentaBancaria.configFicherosEsquema2") }
    ];

    this.comboConfigLugaresQueMasSecuencia = [
      { value: "0", label: this.translateService.instant("facturacion.cuentaBancaria.configLugaresQueMasSecuencia0") },
      { value: "1", label: this.translateService.instant("facturacion.cuentaBancaria.configLugaresQueMasSecuencia1") }
    ];

    this.comboConfigConceptoAmpliado = [
      { value: "0", label: this.translateService.instant("facturacion.cuentaBancaria.configConceptoAmpliado0") },
      { value: "1", label: this.translateService.instant("facturacion.cuentaBancaria.configConceptoAmpliado1") }
    ];
  }

  cargarParametrosSEPA(){
    this.progressSpinner=true;
    
    this.sigaServices.get("facturacionPyS_parametrosSEPA").subscribe(
      n => {
        let data: any[] = n.combooItems;
        
        for(let i=0; data.length>i; i++){
          
          if(data[i].value=="SEPA_TIPO_FICHEROS"){
            this.tipoFicheros = data[i].label;
            //console.log(this.tipoFicheros)
          }
        }

        this.progressSpinner=false;
      },
      err => {
        this.progressSpinner=false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
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
    return (this.tipoFicheros != '0' || this.body.configFicherosSecuencia != undefined && this.body.configFicherosSecuencia.trim() != "")
      && this.body.configFicherosEsquema != undefined && this.body.configFicherosEsquema.trim() != ""
      && this.body.configLugaresQueMasSecuencia != undefined && this.body.configLugaresQueMasSecuencia.trim() != ""
      && this.body.configConceptoAmpliado != undefined && this.body.configConceptoAmpliado.trim() != "";
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

  // Estilo obligatorio
  styleObligatorio(evento: string) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.body.configConceptoAmpliado == this.bodyInicial.configConceptoAmpliado 
      && this.body.configFicherosEsquema == this.bodyInicial.configFicherosEsquema
      && this.body.configFicherosSecuencia == this.bodyInicial.configFicherosSecuencia
      && this.body.configLugaresQueMasSecuencia == this.bodyInicial.configLugaresQueMasSecuencia;
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
