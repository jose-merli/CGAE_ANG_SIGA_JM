import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { t } from '@angular/core/src/render3';
import { ConfirmationService } from 'primeng/api';
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
export class DatosGeneralesSeriesFacturaComponent implements OnInit {

  msgs;
  progressSpinner: boolean = false;

  @Input() datos: SerieFacturacionItem;
  @Input() tarjetaDatosGenerales: string;
  @Input() openTarjetaDatosGenerales;
  @Output() guardadoSend = new EventEmitter<any>();

  bodyInicial: SerieFacturacionItem;
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
  

  resaltadoDatosGenerales: boolean = false;
  resaltadoDatos: boolean = false;
  
  constructor(
    private commonsService: CommonsService,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.resaltadoDatos = true;
    this.progressSpinner = false;

    if (this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      console.log(this.body);
    }

    this.getCombos();

    this.progressSpinner = false;
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
    this.sigaServices.get("tiposProductos_comboProducto").subscribe(
      n => {
        this.comboTiposProductos = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTiposProductos);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTiposServicios() {
    this.sigaServices.get("tiposServicios_comboServicios").subscribe(
      n => {
        this.comboTiposServicios = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTiposServicios);
      },
      err => {
        console.log(err);
      }
    );
  }

  // Funciones para el input de autocomplete

  filterLabelsTiposProductos(event) {
    let query = event.query;
    console.log(query)
    this.suggestionsTiposProductos = this.comboTiposProductos.filter(tp => {
      if (tp.label != undefined && query != undefined) {
        if (!this.body.tiposProductos.some(x => x.value === tp.value)) {
          return tp.label.toLowerCase().includes(query.toLowerCase()) || tp.labelSinTilde != undefined && tp.labelSinTilde.toLowerCase().includes(query.toLowerCase());
        }
      }
      
      return false;
    });
  }

  filterLabelsTiposServicios(event) {
    let query = event.query;
    console.log(query)
    this.suggestionsTiposServicios = this.comboTiposServicios.filter(ts => {
      if (ts.label != undefined && query != undefined) {
        if (!this.body.tiposServicios.some(x => x.value === ts.value)) {
          return ts.label.toLowerCase().includes(query.toLowerCase()) || ts.labelSinTilde != undefined && ts.labelSinTilde.toLowerCase().includes(query.toLowerCase());
        }
      }
      
      return false;
    });
  }

  // Eliminar series de facturación

  confirmEliminar(): void {
    let mess = "Se va a proceder a dar de baja las series de facturación seleccionadas ¿Desea continuar?";
    let icon = "fa fa-eraser";

    this.confirmationService.confirm({
      //key: "asoc",
      message: mess,
      icon: icon,
      accept: () => {
        this.progressSpinner = true;
        this.eliminar();
      },
      reject: () => {
        this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
      }
    });
  }

  eliminar(): void {
    this.sigaServices.post("facturacionPyS_eliminaSerieFacturacion", [this.body]).subscribe(
      data => {
        this.body.fechaBaja = null;
        this.showMessage("success", "Eliminar", "Las series de facturación han sido dadas de baja con exito.");
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
    let mess = "Se va a proceder a reactivar las series de facturación seleccionadas ¿Desea continuar?";
    let icon = "fa fa-eraser";

    this.confirmationService.confirm({
      //key: "asoc",
      message: mess,
      icon: icon,
      accept: () => {
        this.progressSpinner = true;
        this.reactivar();
      },
      reject: () => {
        this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
      }
    });
  }

  reactivar(): void {
    this.sigaServices.post("facturacionPyS_reactivarSerieFacturacion", [this.body]).subscribe(
      data => {
        this.body.fechaBaja = new Date();
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
  }

  // Guadar

  save(): void {
    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_guardarSerieFacturacion", this.body).subscribe(
      n => {
        this.bodyInicial = this.body;
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

  // Estilo obligatorio
  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  esActivo(): boolean {
    return this.body.fechaBaja == undefined || this.body.fechaBaja == null;
  }

  // Abrir y cerrar ficha

  
  esFichaActiva(): boolean {
    return true;// this.fichaPosible.activa;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  /*
  abreCierraFicha(key): void {
    this.resaltadoDatosGenerales = true;

    if (key == "datosGenerales" && !this.fichaPosible.activa) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }

    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }

    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }
  */
}
