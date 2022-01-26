import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/components/common/message';
import { TranslateService } from '../../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { saveAs } from 'file-saver/FileSaver';
@Component({
  selector: 'app-destinatarios-etiquetas-series-factura',
  templateUrl: './destinatarios-etiquetas-series-factura.component.html',
  styleUrls: ['./destinatarios-etiquetas-series-factura.component.scss']
})
export class DestinatariosEtiquetasSeriesFacturaComponent implements OnInit, OnChanges {

  msgs: Message[];
  progressSpinner: boolean = false;
  msgsDescarga: any;
  @Input() body: SerieFacturacionItem;
  
  etiquetasSeleccionadasInicial: any[];
  etiquetasNoSeleccionadasInicial: any[];

  etiquetasSeleccionadas: any[];
  etiquetasNoSeleccionadas: any[];

  @Input() openTarjetaDestinatariosEtiquetas;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() refreshData = new EventEmitter<void>();
  
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() { 
    if (sessionStorage.getItem('descargasPendientes') == undefined) {
      sessionStorage.setItem('descargasPendientes', '0');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.body && this.body.idSerieFacturacion != undefined) {
      this.cargarDatos(); 
    }
  }

  // Obtener todas las etiquetas

  cargarDatos() {
    this.progressSpinner = true;

    this.sigaServices.get("facturacionPyS_comboEtiquetas").subscribe(
      n => {
        this.etiquetasNoSeleccionadas = n.combooItems;
        this.commonsService.arregloTildesCombo(this.etiquetasNoSeleccionadas);

        this.getSeleccionadas();
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  // Obtener etiquetas seleccionadas

  getSeleccionadas() {
    this.sigaServices.getParam("facturacionPyS_comboEtiquetasSerie", "?idSerieFacturacion=" + this.body.idSerieFacturacion).subscribe(
      n => {
        this.etiquetasSeleccionadas = n.combooItems;
        this.commonsService.arregloTildesCombo(this.etiquetasSeleccionadas);

        this.etiquetasNoSeleccionadas = this.etiquetasNoSeleccionadas.filter(e1 => !this.etiquetasSeleccionadas.find(e2 => e1.value == e2.value));

        this.etiquetasSeleccionadasInicial = JSON.parse(JSON.stringify(this.etiquetasSeleccionadas));
        this.etiquetasNoSeleccionadasInicial = JSON.parse(JSON.stringify(this.etiquetasNoSeleccionadas));

        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  // Restablecer

  restablecer(): void {
    this.etiquetasSeleccionadas = JSON.parse(JSON.stringify(this.etiquetasSeleccionadasInicial));
    this.etiquetasNoSeleccionadas = JSON.parse(JSON.stringify(this.etiquetasNoSeleccionadasInicial));
  }

  // Guardar

  guardar(): void {
    if (!this.deshabilitarGuardado()) {
      this.progressSpinner = true;

      let objEtiquetas = {
        idSerieFacturacion: this.body.idSerieFacturacion,
        seleccionados: this.etiquetasSeleccionadas,
        noSeleccionados: this.etiquetasNoSeleccionadas
      };

      this.sigaServices.post("facturacionPyS_guardarEtiquetasSerieFacturacion", objEtiquetas).subscribe(
        n => {
          this.refreshData.emit();
          this.progressSpinner = false;
        },
        error => {
          this.progressSpinner = false;
      });
    }
    
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.arraysEquals(this.etiquetasSeleccionadasInicial, this.etiquetasSeleccionadas);
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

  // Funciones para mostrar mensajes

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
    return this.openTarjetaDestinatariosEtiquetas;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaDestinatariosEtiquetas = !this.openTarjetaDestinatariosEtiquetas;
    this.opened.emit(this.openTarjetaDestinatariosEtiquetas);
    this.idOpened.emit(key);
  }

  generarExcel(){

      let objEtiquetas = {
        idSerieFacturacion: this.body.idSerieFacturacion,
        seleccionados: this.etiquetasSeleccionadas,
        noSeleccionados: this.etiquetasNoSeleccionadas
      };

      let descargasPendientes = JSON.parse(sessionStorage.getItem('descargasPendientes'));
    descargasPendientes = descargasPendientes + 1;
    sessionStorage.setItem('descargasPendientes', descargasPendientes);
    this.showInfoPerenne(
      this.translateService.instant("general.accion.descargaCola.inicio") + descargasPendientes
    );


    this.sigaServices
      .postDownloadFiles("facturacionPyS_generarExcel", objEtiquetas)
      .subscribe(data => {
        if (data == null) {
          this.showInfo(this.translateService.instant("informesYcomunicaciones.consultas.mensaje.sinResultados"));
          descargasPendientes = JSON.parse(sessionStorage.getItem('descargasPendientes')) - 1;
          sessionStorage.setItem('descargasPendientes', descargasPendientes);        
        } else {
          let nombre = this.translateService.instant("censo.nombre.fichero.generarexcel") + new Date().getTime() + ".xlsx";
          saveAs(data, nombre);
          descargasPendientes = JSON.parse(sessionStorage.getItem('descargasPendientes')) - 1;
          sessionStorage.setItem('descargasPendientes', descargasPendientes);
          this.showInfoPerenne(
            this.translateService.instant("general.accion.descargaCola.fin")  + descargasPendientes
          );
        }
      }, error => {
        descargasPendientes = JSON.parse(sessionStorage.getItem('descargasPendientes')) - 1;
        sessionStorage.setItem('descargasPendientes', descargasPendientes);

        this.showFail(this.translateService.instant("informesYcomunicaciones.consultas.mensaje.error.ejecutarConsulta"));
      }, () => {
        
      });
    
  }

    // Mensajes
    showFail(mensaje: string) {

      this.msgs = [];
      this.msgs.push({ severity: "error", summary: "", detail: mensaje });
    }
  
    showSuccess(mensaje: string) {
  
      this.msgs = [];
      this.msgs.push({ severity: "success", summary: "", detail: mensaje });
    }
  
    showInfo(mensaje: string) {
  
      this.msgs = [];
      this.msgs.push({ severity: "info", summary: "", detail: mensaje });
    }
  
    showInfoPerenne(mensaje: string) {
      this.msgsDescarga = [];
      this.msgsDescarga.push({ severity: 'info', summary: '', detail: mensaje });
    }

}
