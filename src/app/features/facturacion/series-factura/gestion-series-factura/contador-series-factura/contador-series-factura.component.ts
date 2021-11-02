import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/primeng';
import { ContadorItem } from '../../../../../models/ContadorItem';
import { ContadorSeriesItem } from '../../../../../models/ContadorSeriesItem';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-contador-series-factura',
  templateUrl: './contador-series-factura.component.html',
  styleUrls: ['./contador-series-factura.component.scss']
})
export class ContadorSeriesFacturaComponent implements OnInit {

  msgs: Message[];
  progressSpinner: boolean = false;

  body: SerieFacturacionItem;
  bodyInicial: SerieFacturacionItem;

  comboContadorFacturas: any[] = [];
  contadorFacturasSeleccionado: ContadorSeriesItem = new ContadorSeriesItem();

  contadoresSerie: ContadorSeriesItem[] = [];

  @Input() openTarjetaContadorFacturas;
  @Output() guardadoSend = new EventEmitter<any>();
  
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    this.getComboContadorFacturas();
    this.getContadoresSerie();
    if (this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }
    

    this.progressSpinner = false;
  }

  // Combo de contador de facturas

  getComboContadorFacturas() {
    this.sigaServices.get("facturacionPyS_comboContadores").subscribe(
      n => {
        this.comboContadorFacturas = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboContadorFacturas);
      },
      err => {
        console.log(err);
      }
    );
  }

  // Datos de contadores

  getContadoresSerie() {
    this.sigaServices.get("facturacionPyS_getContadoresSerie").subscribe(
      n => {
        this.contadoresSerie = n.contadorSeriesItems;
        console.log(this.contadoresSerie);
        this.actualizarInputs();
      },
      err => {
        console.log(err);
      }
    );
  }

  // Actualizar información

  actualizarInputs() {
    if (this.body.idContadorFacturas) {
      this.contadorFacturasSeleccionado = this.contadoresSerie.find(c => c.idContador == this.body.idContadorFacturas);
      if (!this.contadorFacturasSeleccionado) {
        this.contadorFacturasSeleccionado = new ContadorSeriesItem();
      }
    } else {
      this.contadorFacturasSeleccionado = new ContadorSeriesItem();
    }
  }

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }

  clear() {
    this.msgs = [];
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaContadorFacturas;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaContadorFacturas = !this.openTarjetaContadorFacturas;
  }

}
