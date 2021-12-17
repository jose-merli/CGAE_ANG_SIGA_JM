import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { t } from '@angular/core/src/render3';
import { ConfirmationService } from 'primeng/api';
import { AutoComplete } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-datos-generales-series-factura',
  templateUrl: './datos-generales-series-factura.component.html',
  styleUrls: ['./datos-generales-series-factura.component.scss']
})
export class DatosGeneralesSeriesFacturaComponent implements OnInit, OnChanges {

  msgs;
  progressSpinner: boolean = false;

  @Input() openTarjetaDatosGenerales;
  @Input() modoEdicion: boolean;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<SerieFacturacionItem>();
  @Output() refreshData = new EventEmitter<void>();

  @Input() bodyInicial: SerieFacturacionItem;
  body: SerieFacturacionItem = new SerieFacturacionItem();

  // Opciones de los combos y el autocompletado
  comboPlanificacion = [];
  comboCuentaBancaria = [];
  comboSufijo = [];
  comboTiposProductos = [];
  comboTiposServicios = [];

  // Sugerencias de los campos de autocompletado
  suggestionsTiposProductos = [];
  suggestionsTiposServicios = [];

  // Autocompletado
  @ViewChild("autocompleteTopics")
  autocompleteTiposProductos: AutoComplete;

  @ViewChild("autocompleteTopics")
  autocompleteTiposServicios: AutoComplete;

  estado: string = "";

  resaltadoDatos: boolean = false;
  
  constructor(
    private commonsService: CommonsService,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private datepipe: DatePipe
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial) {
      this.restablecer();
      this.getCombos();
    }
  }

  getCombos() {
    this.getComboPlanificacion();
    this.getComboCuentaBancaria();
    this.getComboSufijo();
    this.getComboTiposProductos();
    this.getComboTiposServicios();
  }

  // Combos

  getComboPlanificacion() {
    this.sigaServices.getParam("facturacionPyS_comboPlanificacion", "?idSerieFacturacion=" + this.body.idSerieFacturacion).subscribe(
      n => {
        this.comboPlanificacion = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboPlanificacion);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboCuentaBancaria() {
    this.sigaServices.get("facturacionPyS_comboCuentaBancaria").subscribe(
      n => {
        this.comboCuentaBancaria = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboCuentaBancaria);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboSufijo() {
    this.sigaServices.get("facturacionPyS_comboSufijo").subscribe(
      n => {
        this.comboSufijo = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboSufijo);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTiposProductos() {
    this.sigaServices.get("facturacionPyS_comboProductos").subscribe(
      n => {
        this.comboTiposProductos = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTiposProductos);

        this.comboTiposProductos.forEach(e => {
          if (e.color == undefined) {
            e.color = "#024eff";
          }
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTiposServicios() {
    this.sigaServices.get("facturacionPyS_comboServicios").subscribe(
      n => {
        this.comboTiposServicios = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTiposServicios);

        this.comboTiposServicios.forEach(e => {
          if (e.color == undefined) {
            e.color = "#024eff";
          }
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  // Funciones para el input de autocomplete

  filterLabelsTiposProductos(event) {
    let query: string = event.query;
    
    if (query != undefined && query.length > 2) {
      this.suggestionsTiposProductos = this.comboTiposProductos.filter(tp => {
        if (tp.label != undefined && !this.body.tiposProductos.some(x => x.value === tp.value)) {
          return tp.label.toLowerCase().includes(query.toLowerCase()) || tp.labelSinTilde != undefined && tp.labelSinTilde.toLowerCase().includes(query.toLowerCase());
        }
        
        return false;
      });
    } else {
      this.suggestionsTiposProductos = [];
    }
    
  }

  filterLabelsTiposServicios(event) {
    let query: string = event.query;
    
    if (query != undefined && query.length > 2) {
      this.suggestionsTiposServicios = this.comboTiposServicios.filter(ts => {
        if (ts.label != undefined && !this.body.tiposServicios.some(x => x.value === ts.value)) {
          return ts.label.toLowerCase().includes(query.toLowerCase()) || ts.labelSinTilde != undefined && ts.labelSinTilde.toLowerCase().includes(query.toLowerCase());
        }
        
        return false;
      });
    } else {
      this.suggestionsTiposServicios = [];
    }
    
  }

  // Eliminar series de facturación

  confirmEliminar(): void {
    let mess = "Se va a proceder a dar de baja la serie de facturación ¿Desea continuar?";
    let icon = "fa fa-eraser";

    this.confirmationService.confirm({
      //key: "asoc",
      message: mess,
      icon: icon,
      accept: () => {
        this.eliminar();
      },
      reject: () => {
        this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
      }
    });
  }

  eliminar(): void {
    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_eliminaSerieFacturacion", [this.body]).subscribe(
      data => {
        this.refreshData.emit();
        // this.showMessage("success", "Eliminar", "Las serie de facturación han sido dada de baja con exito.");
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  // Reactivar series de facturación

  confirmReactivar(): void {
    let mess = "Se va a proceder a reactivar la serie de facturación ¿Desea continuar?";
    let icon = "fa fa-eraser";

    this.confirmationService.confirm({
      //key: "asoc",
      message: mess,
      icon: icon,
      accept: () => {
        this.reactivar();
      },
      reject: () => {
        this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
      }
    });
  }

  reactivar(): void {
    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_reactivarSerieFacturacion", [this.body]).subscribe(
      data => {
        this.refreshData.emit();
        // this.showMessage("success", "Reactivar", "Las series de facturación han sido reactivadas con éxito.");
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.estado = this.esActivo() ? "Alta" : `Baja desde ${this.datepipe.transform(this.body.fechaBaja, 'dd/MM/yyyy')}`;

    if (this.body.tiposProductos != undefined) {
      this.body.tiposProductos.forEach(e => {
        if (e.color == undefined) {
          e.color = "#024eff";
        }
      });
    }
    
    if (this.body.tiposServicios != undefined) {
      this.body.tiposServicios.forEach(e => {
        if (e.color == undefined) {
          e.color = "#024eff";
        }
      });
    }

    this.resaltadoDatos = false;
  }

  // Guadar

  isValid(): boolean {
    return this.body.abreviatura != undefined && this.body.abreviatura.trim() != "" && this.body.abreviatura.length <= 20
          && this.body.descripcion != undefined && this.body.descripcion.trim() != "" && this.body.descripcion.length <= 100
          && this.body.idCuentaBancaria != undefined && this.body.idCuentaBancaria.trim() != ""
          && this.body.idSufijo != undefined && this.body.idSufijo.trim() != "";
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

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.body.abreviatura == this.bodyInicial.abreviatura
      && this.body.descripcion == this.bodyInicial.descripcion
      && this.body.idCuentaBancaria == this.bodyInicial.idCuentaBancaria
      && this.body.idSufijo == this.bodyInicial.idSufijo
      && this.body.idSerieFacturacionPrevia == this.bodyInicial.idSerieFacturacionPrevia
      && this.body.serieGenerica == this.bodyInicial.serieGenerica
      && this.arraysEquals(this.body.tiposProductos, this.bodyInicial.tiposProductos)
      && this.arraysEquals(this.body.tiposServicios, this.bodyInicial.tiposServicios);
  }

  arraysEquals(a, b): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    for (let i = 0; i < a.length; ++i) {
      if (a[i].value !== b[i].value) return false;
    }

    return true;
  }

  // Comprueba si una serie se encuentra de baja o no
  esActivo(): boolean {
    return this.body.fechaBaja == undefined || this.body.fechaBaja == null;
  }

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

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaDatosGenerales;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaDatosGenerales = !this.openTarjetaDatosGenerales;
    this.opened.emit(this.openTarjetaDatosGenerales);
    this.idOpened.emit(key);
  }

}
