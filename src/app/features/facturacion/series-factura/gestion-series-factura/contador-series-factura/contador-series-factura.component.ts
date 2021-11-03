import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
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
    private commonsService: CommonsService,
    private translateService: TranslateService
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
        
        if (!this.contadoresSerie.find(c => c.idContador == this.body.idContadorFacturas)) {
          this.body.idContadorFacturas = null;
        }
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

  // Guardar

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

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaContadorFacturas;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaContadorFacturas = !this.openTarjetaContadorFacturas;
  }

}
