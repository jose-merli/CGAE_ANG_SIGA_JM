import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-exportacion-series-factura',
  templateUrl: './exportacion-series-factura.component.html',
  styleUrls: ['./exportacion-series-factura.component.scss']
})
export class ExportacionSeriesFacturaComponent implements OnInit {

  msgs: Message[];
  progressSpinner: boolean = false;

  body: SerieFacturacionItem;
  bodyInicial: SerieFacturacionItem;

  comboConfDeudor: any[] = [];
  comboConfIngresos: any[] = [];

  @Input() openTarjetaExportacionContabilidad;
  @Output() guardadoSend = new EventEmitter<any>();
  
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    this.getCombos();
    if (this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }

    this.progressSpinner = false;
  }

  // Get combos

  getCombos(): void {
    this.comboConfDeudor = [
      {value: 'F', label: 'Fijo'},
      {value: 'C', label: 'Incorporar Subcuenta Cliente'}
    ];

    this.comboConfIngresos = [
      {value: 'F', label: 'Fijo'},
      {value: 'C', label: 'Incorporar Subcuenta Cliente'},
      {value: 'P', label: 'Incorporar Subcuenta Productos/Servicios'},
    ];
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
    return this.openTarjetaExportacionContabilidad;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaExportacionContabilidad = !this.openTarjetaExportacionContabilidad;
  }

}
