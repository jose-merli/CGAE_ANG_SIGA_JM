import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-envio-series-factura',
  templateUrl: './envio-series-factura.component.html',
  styleUrls: ['./envio-series-factura.component.scss']
})
export class EnvioSeriesFacturaComponent implements OnInit {

  msgs: Message[];
  progressSpinner: boolean = false;

  body: SerieFacturacionItem;
  bodyInicial: SerieFacturacionItem;

  comboPlantillasEnvio: any[] = [];

  @Input() openTarjetaEnvioFacturas;
  @Output() guardadoSend = new EventEmitter<any>();
  
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    this.getComboPlantillasEnvio();
    if (this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }

    this.progressSpinner = false;
  }

  // Combo de platillas envío masivo

  getComboPlantillasEnvio() {
    this.sigaServices.get("facturacionPyS_comboPlantillasEnvio").subscribe(
      n => {
        this.comboPlantillasEnvio = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboPlantillasEnvio);
        console.log(n);
      },
      err => {
        console.log(err);
      }
    );
  }

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }

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
    return this.openTarjetaEnvioFacturas;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaEnvioFacturas = !this.openTarjetaEnvioFacturas;
  }

}
