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
  selector: 'app-contador-rect-series-factura',
  templateUrl: './contador-rect-series-factura.component.html',
  styleUrls: ['./contador-rect-series-factura.component.scss']
})
export class ContadorRectSeriesFacturaComponent implements OnInit, OnChanges {

  msgs: Message[];
  progressSpinner: boolean = false;

  body: SerieFacturacionItem;
  @Input() bodyInicial: SerieFacturacionItem;

  comboContadorFacturasRectificativas: any[] = [];
  contadorFacturasRectificativasSeleccionado: ContadorSeriesItem = new ContadorSeriesItem();
  nuevo: boolean = false;
  resaltadoDatos: boolean = false;

  contadoresRectificativasSerie: ContadorSeriesItem[] = [];

  @Input() openTarjetaContadorFacturasRectificativas;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<any>();
  @Output() refreshData = new EventEmitter<void>();
  
  constructor(
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial) {
      this.getComboContadorFacturasRectificativas();
      this.getContadoresRectificativasSerie();
      this.restablecer(); 
    }
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
    this.progressSpinner = true;

    this.sigaServices.get("facturacionPyS_getContadoresRectificativasSerie").subscribe(
      n => {
        this.contadoresRectificativasSerie = n.contadorSeriesItems;
        console.log(this.contadoresRectificativasSerie);

        if (this.contadoresRectificativasSerie.find(c => c.idContador == this.body.idContadorFacturas)) {
          this.body.idContadorFacturasRectificativas = this.body.idContadorFacturas;
          this.body.idContadorFacturas = null;
        }
        this.actualizarInputs();
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
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

  // Nuevo
  nuevoContador() {
    this.nuevo = true;
    this.contadorFacturasRectificativasSeleccionado = new ContadorSeriesItem();
    this.contadorFacturasRectificativasSeleccionado.contador = "1";
  }

  // Back to select
  backToSelect() {
    this.nuevo = false;
    this.actualizarInputs();
  }

  // Restablecer

  restablecer(): void {
    if (!this.nuevo) {
      this.body = JSON.parse(JSON.stringify(this.bodyInicial));
      this.actualizarInputs();
    } else {
      this.contadorFacturasRectificativasSeleccionado = new ContadorSeriesItem();
      this.contadorFacturasRectificativasSeleccionado.contador = "1";
    }

    this.resaltadoDatos = false;
  }

  // Guardar
  isValid(): boolean {
    return !this.nuevo && this.body.idContadorFacturasRectificativas != undefined 
      || this.nuevo && this.contadorFacturasRectificativasSeleccionado.nombre != undefined && this.contadorFacturasRectificativasSeleccionado.nombre.trim() != ""
      && this.contadorFacturasRectificativasSeleccionado.contador != undefined && this.contadorFacturasRectificativasSeleccionado.contador.trim() != "";
  }

  guardar(): void {
    this.progressSpinner = true;

    if (this.nuevo && this.isValid() && !this.deshabilitarGuardado()) {
      this.contadorFacturasRectificativasSeleccionado.facturaRectificativa = true;
      this.contadorFacturasRectificativasSeleccionado.idSerieFacturacion = this.body.idSerieFacturacion;
      this.sigaServices.post("facturacionPyS_guardarContadorSerie", this.contadorFacturasRectificativasSeleccionado).subscribe(
        n => {
          this.nuevo = false;
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
    return !this.nuevo && this.body.idContadorFacturasRectificativas == this.bodyInicial.idContadorFacturasRectificativas 
      || this.nuevo && this.contadorFacturasRectificativasSeleccionado.nombre == undefined
      || this.nuevo && this.contadorFacturasRectificativasSeleccionado.contador == undefined;
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
    return this.openTarjetaContadorFacturasRectificativas;
  }

  abreCierraFicha(key): void {
    this.openTarjetaContadorFacturasRectificativas = !this.openTarjetaContadorFacturasRectificativas;
    this.opened.emit(this.openTarjetaContadorFacturasRectificativas);
    this.idOpened.emit(key);
  }

}
