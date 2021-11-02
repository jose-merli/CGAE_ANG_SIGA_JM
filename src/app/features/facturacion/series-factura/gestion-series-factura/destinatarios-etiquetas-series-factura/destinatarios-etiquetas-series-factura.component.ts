import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/components/common/message';
import { TranslateService } from '../../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-destinatarios-etiquetas-series-factura',
  templateUrl: './destinatarios-etiquetas-series-factura.component.html',
  styleUrls: ['./destinatarios-etiquetas-series-factura.component.scss']
})
export class DestinatariosEtiquetasSeriesFacturaComponent implements OnInit {

  msgs: Message[];
  progressSpinner: boolean = false;

  body: SerieFacturacionItem;
  
  etiquetasSeleccionadasInicial: any[];
  etiquetasNoSeleccionadasInicial: any[];

  etiquetasSeleccionadas: any[];
  etiquetasNoSeleccionadas: any[];

  @Input() openTarjetaDestinatariosEtiquetas;
  @Output() guardadoSend = new EventEmitter<any>();
  
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    if (this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();

      this.cargarDatos();
    }
    

    this.progressSpinner = false;
  }

  // Obtener todas las etiquetas

  cargarDatos() {
    this.sigaServices.get("facturacionPyS_comboEtiquetas").subscribe(
      n => {
        this.etiquetasNoSeleccionadas = n.combooItems;
        this.commonsService.arregloTildesCombo(this.etiquetasNoSeleccionadas);

        this.getSeleccionadas();
      },
      err => {
        console.log(err);
      }
    );
  }

  // Obtener etiquetas seleccionadas

  getSeleccionadas() {
    this.sigaServices.getParam("facturacionPyS_getEtiquetasSerie", "?idSerieFacturacion=" + this.body.idSerieFacturacion).subscribe(
      n => {
        this.etiquetasSeleccionadas = n.combooItems;
        this.commonsService.arregloTildesCombo(this.etiquetasSeleccionadas);

        this.etiquetasNoSeleccionadas = this.etiquetasNoSeleccionadas.filter(e1 => !this.etiquetasSeleccionadas.find(e2 => e1.value == e2.value));

        this.etiquetasSeleccionadasInicial = JSON.parse(JSON.stringify(this.etiquetasSeleccionadas));
        this.etiquetasNoSeleccionadasInicial = JSON.parse(JSON.stringify(this.etiquetasNoSeleccionadas));
      },
      err => {
        console.log(err);
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
    this.progressSpinner = true;

    let objEtiquetas = {
      idSerieFacturacion: this.body.idSerieFacturacion,
      combooItems: this.etiquetasSeleccionadas
    };

    this.sigaServices.post("facturacionPyS_guardarEtiquetasSerieFacturacion", objEtiquetas).subscribe(
      n => {
        // this.showSuccess(this.translateService.instant("informesYcomunicaciones.enviosMasivos.destinatarioIndv.mensaje.guardar.etiquetas.ok"));
        this.etiquetasSeleccionadasInicial = JSON.parse(JSON.stringify(this.etiquetasSeleccionadas));
        this.etiquetasNoSeleccionadasInicial = JSON.parse(JSON.stringify(this.etiquetasNoSeleccionadas));
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
        this.progressSpinner = false;
      });
  }

  clear() {
    this.msgs = [];
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaDestinatariosEtiquetas;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaDestinatariosEtiquetas = !this.openTarjetaDestinatariosEtiquetas;
  }

}
