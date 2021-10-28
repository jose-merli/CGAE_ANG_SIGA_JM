import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/primeng';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-exportacion-series-factura',
  templateUrl: './exportacion-series-factura.component.html',
  styleUrls: ['./exportacion-series-factura.component.scss']
})
export class ExportacionSeriesFacturaComponent implements OnInit {

  msgs: Message[];
  progressSpinner: boolean = false;

  body: SerieFacturacionItem;

  comboConfDeudor: any[] = [];
  comboConfIngresos: any[] = [];

  @Input() openTarjetaExportacionContabilidad;
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
    return this.openTarjetaExportacionContabilidad;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaExportacionContabilidad = !this.openTarjetaExportacionContabilidad;
  }

}
