import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-generacion-series-factura',
  templateUrl: './generacion-series-factura.component.html',
  styleUrls: ['./generacion-series-factura.component.scss']
})
export class GeneracionSeriesFacturaComponent implements OnInit {

  msgs: Message[];
  progressSpinner: boolean = false;

  body: SerieFacturacionItem;
  bodyInicial: SerieFacturacionItem;

  comboModeloFactura: any[] = [];

  @Input() openTarjetaGeneracion;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<any>();

  resaltadoDatos: boolean = false;
  
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    this.getComboModelosComunicacion();
    if (this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }

    this.progressSpinner = false;
  }

  getComboModelosComunicacion() {
    this.sigaServices.get("facturacionPyS_comboModelosComunicacion").subscribe(
      n => {
        this.comboModeloFactura = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboModeloFactura);
        console.log(n);
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

  // Guardar

  isValid(): boolean {
    return this.body.idModeloFactura != undefined && this.body.idModeloFactura.trim() != ""
      && this.body.idModeloRectificativa != undefined && this.body.idModeloRectificativa.trim() != "";
  }

  checkSave(): void {
    if (this.isValid()) {
      this.guardar();
    } else {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatos = true;
    }
  }

  guardar(): void {
    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_guardarSerieFacturacion", this.body).subscribe(
      n => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        this.persistenceService.setDatos(this.bodyInicial);
        this.guardadoSend.emit();

        this.progressSpinner = false;
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      }
    );
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
    return this.openTarjetaGeneracion;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaGeneracion = !this.openTarjetaGeneracion;
    this.opened.emit(this.openTarjetaGeneracion);
    this.idOpened.emit(key);
  }

}
