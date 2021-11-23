import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { t } from '@angular/core/src/render3';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/message';
import { TranslateService } from '../../../../../commons/translate';
import { ComboItem } from '../../../../../models/ComboItem';
import { FacFacturacionprogramadaItem } from '../../../../../models/FacFacturacionprogramadaItem';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-serie-factura-fact-programadas',
  templateUrl: './serie-factura-fact-programadas.component.html',
  styleUrls: ['./serie-factura-fact-programadas.component.scss']
})
export class SerieFacturaFactProgramadasComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  @Input() modoEdicion: boolean;
  @Input() openTarjetaSerieFactura;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<FacFacturacionprogramadaItem>();

  @Input() bodyInicial: FacFacturacionprogramadaItem;
  body: FacFacturacionprogramadaItem = new FacFacturacionprogramadaItem();
  serieFacturacionSeleccionada: SerieFacturacionItem = new SerieFacturacionItem();
  tiposProductos: string;
  tiposServicios: string;

  resaltadoDatos: boolean = false;

  comboSeriesFacturacion: ComboItem[] = [];

  constructor(
    private commonsService: CommonsService,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getComboSerieFacturacion();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial != undefined)
      this.restablecer();
  }

  // Combo de Series de Facturación

  getComboSerieFacturacion() {
    this.sigaServices.get("facturacionPyS_comboSeriesFacturacion").subscribe(
      n => {
        this.comboSeriesFacturacion = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboSeriesFacturacion);
      },
      err => {
        console.log(err);
      }
    );
  }

  actualizarInputs() {
    if (this.body.idSerieFacturacion != undefined) {
      this.searchSeriesFacturas();
    } else {
      this.serieFacturacionSeleccionada = new SerieFacturacionItem();
      this.tiposProductos = "";
      this.tiposServicios = "";
    }
  }

  navigateToSerieFacturacion() {
    let filtros = { idSerieFacturacion: this.body.idSerieFacturacion };

    this.sigaServices.post("facturacionPyS_getSeriesFacturacion", filtros).subscribe(
      n => {
        let results: SerieFacturacionItem[] = JSON.parse(n.body).serieFacturacionItems;
        if (results != undefined && results.length != 0) {
          let serieFacturacionItem: SerieFacturacionItem = results[0];

          sessionStorage.setItem("facturacionProgramadaItem", JSON.stringify(this.bodyInicial));
          sessionStorage.setItem("volver", "true");

          sessionStorage.setItem("serieFacturacionItem", JSON.stringify(serieFacturacionItem));
          this.router.navigate(["/datosSeriesFactura"]);
        }
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  searchSeriesFacturas(): void {
    let filtros = { idSerieFacturacion: this.body.idSerieFacturacion };

    this.sigaServices.post("facturacionPyS_getSeriesFacturacion", filtros).subscribe(
      n => {
        let results: SerieFacturacionItem[] = JSON.parse(n.body).serieFacturacionItems;
        if (results != undefined && results.length != 0)        
          this.serieFacturacionSeleccionada = results[0];
          this.tiposProductos = this.collapseTiposIncluidos(this.serieFacturacionSeleccionada.tiposProductos.map(t => t.label));
          this.tiposServicios = this.collapseTiposIncluidos(this.serieFacturacionSeleccionada.tiposServicios.map(t => t.label));
          console.log(this.serieFacturacionSeleccionada);
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  // Muestra solo el primer tipo incluido
  collapseTiposIncluidos(tiposIncluidos: string[]): string {
    let res = "";

    if (tiposIncluidos.length != 0) {
      res = tiposIncluidos[0];
    }

    if (tiposIncluidos.length > 1) {
      res += "... y " + (tiposIncluidos.length - 1).toString() + " más";
    }

    return res;
  }

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.actualizarInputs();
    this.resaltadoDatos = false;
  }

  // Guadar

  isValid(): boolean {
    return this.body.idSerieFacturacion != undefined && this.body.idSerieFacturacion.trim() != "";
  }

  checkSave(): void {
    if (this.isValid()) {
      this.guardadoSend.emit(this.body);
    } else {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatos = true;
    }
  }

  // Estilo obligatorio
  styleObligatorio(evento: string) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaSerieFactura;
  }

  abreCierraFicha(key): void {
    this.openTarjetaSerieFactura = !this.openTarjetaSerieFactura;
    this.opened.emit(this.openTarjetaSerieFactura);
    this.idOpened.emit(key);
  }

  // Mensajes en pantalla

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

}
