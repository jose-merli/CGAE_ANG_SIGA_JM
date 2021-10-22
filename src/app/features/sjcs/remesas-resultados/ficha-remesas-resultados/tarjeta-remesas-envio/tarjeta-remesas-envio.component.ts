import { Component } from '@angular/core'

@Component({
    selector: 'app-tarjeta-remesas-envio',
    templateUrl: './tarjeta-remesas-envio.component.html',
    styleUrls: ['./tarjeta-remesas-envio.component.scss'],
  })
export class TarjetaRemesasEnvioComponent {
    progressSpinner: boolean = false;
    msgs;
    openFicha: boolean = false;



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