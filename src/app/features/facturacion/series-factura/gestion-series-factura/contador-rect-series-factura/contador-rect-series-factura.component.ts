import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/primeng';
import { ContadorItem } from '../../../../../models/ContadorItem';
import { ContadorSeriesItem } from '../../../../../models/ContadorSeriesItem';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-contador-rect-series-factura',
  templateUrl: './contador-rect-series-factura.component.html',
  styleUrls: ['./contador-rect-series-factura.component.scss']
})
export class ContadorRectSeriesFacturaComponent implements OnInit {

  msgs: Message[];
  progressSpinner: boolean = false;

  body: SerieFacturacionItem;
  bodyInicial: SerieFacturacionItem;

  comboContadorFacturasRectificativas: any[] = [];
  contadorFacturasRectificativasSeleccionado: ContadorSeriesItem = new ContadorSeriesItem();

  contadoresRectificativasSerie: ContadorSeriesItem[] = [];

  @Input() openTarjetaContadorFacturasRectificativas;
  @Output() guardadoSend = new EventEmitter<any>();
  
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    this.getComboContadorFacturasRectificativas();
    this.getContadoresRectificativasSerie();
    if (this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }
    

    this.progressSpinner = false;
  }

  // Combo de contador de facturas rectificativas

  getComboContadorFacturasRectificativas() {
    this.sigaServices.get("facturacionPyS_comboContadoresRectificativas").subscribe(
      n => {
        this.comboContadorFacturasRectificativas = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboContadorFacturasRectificativas);
      },
      err => {
        console.log(err);
      }
    );
  }
  
  // Datos de contadores

  getContadoresRectificativasSerie() {
    this.sigaServices.get("facturacionPyS_getContadoresRectificativasSerie").subscribe(
      n => {
        this.contadoresRectificativasSerie = n.contadorSeriesItems;
        console.log(this.contadoresRectificativasSerie);
        this.actualizarInputs();

      },
      err => {
        console.log(err);
      }
    );
  }

  // Actualizar información

  actualizarInputs() {
    if (this.body.idContadorFacturasRectificativas) {
      this.contadorFacturasRectificativasSeleccionado = this.contadoresRectificativasSerie.find(c => c.idContador == this.body.idContadorFacturasRectificativas);
      if (!this.contadorFacturasRectificativasSeleccionado) {
        this.contadorFacturasRectificativasSeleccionado = new ContadorSeriesItem();
      }
    } else {
      this.contadorFacturasRectificativasSeleccionado = new ContadorSeriesItem();
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
    return this.openTarjetaContadorFacturasRectificativas;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaContadorFacturasRectificativas = !this.openTarjetaContadorFacturasRectificativas;
  }

}
