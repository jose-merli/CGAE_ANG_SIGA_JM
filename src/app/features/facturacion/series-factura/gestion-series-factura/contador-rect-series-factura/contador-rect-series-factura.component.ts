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
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<any>();
  
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private translateService: TranslateService
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

        if (this.contadoresRectificativasSerie.find(c => c.idContador == this.body.idContadorFacturas)) {
          this.body.idContadorFacturasRectificativas = this.body.idContadorFacturas;
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
    return this.openTarjetaContadorFacturasRectificativas;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaContadorFacturasRectificativas = !this.openTarjetaContadorFacturasRectificativas;
    this.opened.emit(this.openTarjetaContadorFacturasRectificativas);
    this.idOpened.emit(key);
  }

}
