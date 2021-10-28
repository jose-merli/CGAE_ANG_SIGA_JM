import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/primeng';
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

  comboModeloFactura: any[] = [];
  comboModeloComunicacion: any[] = [];

  @Input() openTarjetaGeneracion;
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

    }

    this.progressSpinner = false;
  }

  // Restablecer

  restablecer(): void {

  }

  clear() {
    this.msgs = [];
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaGeneracion;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaGeneracion = !this.openTarjetaGeneracion;
  }

}
