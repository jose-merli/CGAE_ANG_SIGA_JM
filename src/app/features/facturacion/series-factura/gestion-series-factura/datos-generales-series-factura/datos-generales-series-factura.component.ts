import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
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
  @Output() guardadoSend = new EventEmitter<any>();

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
    private translateService: TranslateService
  ) { }

  ngOnInit() { }

  ngOnChanges() {
    this.restablecer();
    this.getCombos();
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
        this.body.fechaBaja = new Date();
        this.persistenceService.setDatos(this.body);
        this.guardadoSend.emit();
        this.showMessage("success", "Eliminar", "Las serie de facturación han sido dada de baja con exito.");
      },
      err => {
        console.log(err);
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
        this.body.fechaBaja = null;
        this.persistenceService.setDatos(this.body);
        this.guardadoSend.emit();
        this.showMessage("success", "Reactivar", "Las series de facturación han sido reactivadas con éxito.");
      },
      err => {
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
    this.estado = this.esActivo() ? "Alta" : "Baja";

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
      this.save();
    } else {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatos = true;
    }
  }

  save(): void {
    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_guardarSerieFacturacion", this.body).subscribe(
      n => {
        let idSerieFacturacion = JSON.parse(n.body).id;

        if (this.modoEdicion) {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.persistenceService.setDatos(this.body);
          this.guardadoSend.emit();
        } else {
          this.body.idSerieFacturacion = idSerieFacturacion;
          this.recuperarDatosSerieFacuturacion();
        }
        
        this.progressSpinner = false;
      },
      err => {
        let error = JSON.parse(err.error).error;
        if (error != undefined && error.code == 500 && error.message != undefined) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.message));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }

        this.progressSpinner = false;
      }
    );
  }

  recuperarDatosSerieFacuturacion(): void {
    let filtros = new SerieFacturacionItem();
    filtros.idSerieFacturacion = this.body.idSerieFacturacion;
    
    this.sigaServices.post("facturacionPyS_getSeriesFacturacion", filtros).subscribe(
      n => {
        let datos: SerieFacturacionItem[] = JSON.parse(n.body).serieFacturacionItems;

        if (datos.length != 0) {
          this.body = datos.find(d => d.idSerieFacturacion == this.body.idSerieFacturacion);
          this.persistenceService.setDatos(this.body);
          this.guardadoSend.emit();
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
        
        this.progressSpinner = false;
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      }
    );
  }
  

  // Estilo obligatorio
  styleObligatorio(evento: string) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
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
