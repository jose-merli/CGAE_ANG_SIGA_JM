import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/primeng';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-pago-automatico-series-factura',
  templateUrl: './pago-automatico-series-factura.component.html',
  styleUrls: ['./pago-automatico-series-factura.component.scss']
})
export class PagoAutomaticoSeriesFacturaComponent implements OnInit {

  msgs: Message[];
  progressSpinner: boolean = false;

  body: SerieFacturacionItem;
  
  formasPagoSeleccionadasInicial: any[];
  formasPagoNoSeleccionadasInicial: any[];

  formasPagoSeleccionadas: any[];
  formasPagoNoSeleccionadas: any[];

  @Input() openTarjetaPagoAutomatico;
  @Output() guardadoSend = new EventEmitter<any>();
  
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    if (this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();

      this.cargarDatos();
    }
    

    this.progressSpinner = false;
  }

  // Obtener todas las etiquetas

  cargarDatos() {
    this.sigaServices.get("facturacionPyS_getFormasPagosDisponiblesSeries").subscribe(
      n => {
        this.formasPagoNoSeleccionadas = n.combooItems;
        this.commonsService.arregloTildesCombo(this.formasPagoNoSeleccionadas);

        this.getSeleccionadas();
      },
      err => {
        console.log(err);
      }
    );
  }

  // Obtener etiquetas seleccionadas

  getSeleccionadas() {
    this.sigaServices.getParam("facturacionPyS_getFormasPagosSerie", "?idSerieFacturacion=" + this.body.idSerieFacturacion).subscribe(
      n => {
        this.formasPagoSeleccionadas = n.combooItems;
        this.commonsService.arregloTildesCombo(this.formasPagoSeleccionadas);

        this.formasPagoNoSeleccionadas = this.formasPagoNoSeleccionadas.filter(e1 => !this.formasPagoSeleccionadas.find(e2 => e1.value == e2.value));

        this.formasPagoSeleccionadasInicial = JSON.parse(JSON.stringify(this.formasPagoSeleccionadas));
        this.formasPagoNoSeleccionadasInicial = JSON.parse(JSON.stringify(this.formasPagoNoSeleccionadas));
      },
      err => {
        console.log(err);
      }
    );
  }

  // Restablecer

  restablecer(): void {
    this.formasPagoSeleccionadas = JSON.parse(JSON.stringify(this.formasPagoSeleccionadasInicial));
    this.formasPagoNoSeleccionadas = JSON.parse(JSON.stringify(this.formasPagoNoSeleccionadasInicial));
  }

  clear() {
    this.msgs = [];
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaPagoAutomatico;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaPagoAutomatico = !this.openTarjetaPagoAutomatico;
  }

}
