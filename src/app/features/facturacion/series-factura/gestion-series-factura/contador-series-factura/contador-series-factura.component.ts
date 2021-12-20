import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
export class ContadorSeriesFacturaComponent implements OnInit, OnChanges {

  msgs: Message[];
  progressSpinner: boolean = false;

  body: SerieFacturacionItem;
  @Input() bodyInicial: SerieFacturacionItem;

  comboContadorFacturas: any[] = [];
  contadorFacturasSeleccionado: ContadorSeriesItem = new ContadorSeriesItem();
  nuevo: boolean = false;
  resaltadoDatos: boolean = false;

  contadoresSerie: ContadorSeriesItem[] = [];

  @Input() openTarjetaContadorFacturas;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<any>();
  @Output() refreshData = new EventEmitter<void>();
  
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial) {
      this.getComboContadorFacturas();
      this.getContadoresSerie();
      this.restablecer();
    }
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

  // Nuevo
  nuevoContador() {
    this.restablecer();
    this.nuevo = true;
    this.contadorFacturasSeleccionado = new ContadorSeriesItem();
    this.contadorFacturasSeleccionado.contador = "1";
  }

  // Back to select
  backToSelect() {
    this.restablecer();
    this.nuevo = false;
    this.actualizarInputs();
  }

  // Restablecer

  restablecer(): void {
    if (!this.nuevo) {
      this.body = JSON.parse(JSON.stringify(this.bodyInicial));
      this.actualizarInputs();
    } else {
      this.contadorFacturasSeleccionado = new ContadorSeriesItem();
      this.contadorFacturasSeleccionado.contador = "1";
    }

    this.resaltadoDatos = false;
  }

  // Guardar
  isValid(): boolean {
    return !this.nuevo && this.body.idContadorFacturas != undefined 
      || this.nuevo && this.contadorFacturasSeleccionado.nombre != undefined && this.contadorFacturasSeleccionado.nombre.trim() != ""
      && this.contadorFacturasSeleccionado.contador != undefined && this.contadorFacturasSeleccionado.contador.trim() != "";
  }

  guardar(): void {
    this.progressSpinner = true;

    if (this.nuevo && this.isValid() && !this.deshabilitarGuardado()) {
      this.contadorFacturasSeleccionado.idSerieFacturacion = this.body.idSerieFacturacion;
      this.sigaServices.post("facturacionPyS_guardarContadorSerie", this.contadorFacturasSeleccionado).subscribe(
        n => {
          this.refreshData.emit();

          this.progressSpinner = false;
        },
        err => {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          this.progressSpinner = false;
        }
      );
    } else if (this.isValid() && !this.deshabilitarGuardado()) {
      this.progressSpinner = false;
      this.guardadoSend.emit(this.body);
    } else {
      this.progressSpinner = false;
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatos = true;
    }
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return !this.nuevo && this.body.idContadorFacturas == this.bodyInicial.idContadorFacturas 
      || this.nuevo && this.contadorFacturasSeleccionado.nombre == undefined
      || this.nuevo && this.contadorFacturasSeleccionado.contador == undefined;
  }

  // Estilo obligatorio
  styleObligatorio(activo, evento: string) {
    if (this.resaltadoDatos && activo && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
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
    this.opened.emit(this.openTarjetaContadorFacturas);
    this.idOpened.emit(key);
  }

}
