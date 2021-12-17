import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-pago-automatico-series-factura',
  templateUrl: './pago-automatico-series-factura.component.html',
  styleUrls: ['./pago-automatico-series-factura.component.scss']
})
export class PagoAutomaticoSeriesFacturaComponent implements OnInit, OnChanges {

  msgs: Message[];
  progressSpinner: boolean = false;

  @Input() body: SerieFacturacionItem;
  
  formasPagosSeleccionadasInicial: any[];
  formasPagosNoSeleccionadasInicial: any[];

  formasPagosSeleccionadas: any[];
  formasPagosNoSeleccionadas: any[];

  @Input() openTarjetaPagoAutomatico;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() refreshData = new EventEmitter<void>();
  
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.body) {
      this.cargarDatos();
    }
  }

  // Obtener todas las etiquetas

  cargarDatos() {
    this.sigaServices.get("facturacionPyS_comboFormasPagoFactura").subscribe(
      n => {
        this.formasPagosNoSeleccionadas = n.combooItems;
        this.commonsService.arregloTildesCombo(this.formasPagosNoSeleccionadas);

        this.getSeleccionadas();
      },
      err => {
        console.log(err);
      }
    );
  }

  // Obtener etiquetas seleccionadas

  getSeleccionadas() {
    this.sigaServices.getParam("facturacionPyS_comboFormasPagosSerie", "?idSerieFacturacion=" + this.body.idSerieFacturacion).subscribe(
      n => {
        this.formasPagosSeleccionadas = n.combooItems;
        this.commonsService.arregloTildesCombo(this.formasPagosSeleccionadas);

        this.formasPagosNoSeleccionadas = this.formasPagosNoSeleccionadas.filter(e1 => !this.formasPagosSeleccionadas.find(e2 => e1.value == e2.value));

        this.formasPagosSeleccionadasInicial = JSON.parse(JSON.stringify(this.formasPagosSeleccionadas));
        this.formasPagosNoSeleccionadasInicial = JSON.parse(JSON.stringify(this.formasPagosNoSeleccionadas));
      },
      err => {
        console.log(err);
      }
    );
  }

  // Restablecer

  restablecer(): void {
    this.formasPagosSeleccionadas = JSON.parse(JSON.stringify(this.formasPagosSeleccionadasInicial));
    this.formasPagosNoSeleccionadas = JSON.parse(JSON.stringify(this.formasPagosNoSeleccionadasInicial));
  }

  // Guardar

  guardar() {
    this.progressSpinner = true;

    let objEtiquetas = {
      idSerieFacturacion: this.body.idSerieFacturacion,
      seleccionados: this.formasPagosSeleccionadas,
      noSeleccionados: this.formasPagosNoSeleccionadas
    };

    this.sigaServices.post("facturacionPyS_guardarFormasPagosSerie", objEtiquetas).subscribe(
      n => {
        this.refreshData.emit();
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
        this.progressSpinner = false;
      });
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.arraysEquals(this.formasPagosSeleccionadas, this.formasPagosSeleccionadasInicial);
  }

  arraysEquals(a, b): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }

    return true;
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

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaPagoAutomatico;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaPagoAutomatico = !this.openTarjetaPagoAutomatico;
    this.opened.emit(this.openTarjetaPagoAutomatico);
    this.idOpened.emit(key);
  }

}
