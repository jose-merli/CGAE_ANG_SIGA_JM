import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-configuracion-ficheros',
  templateUrl: './configuracion-ficheros.component.html',
  styleUrls: ['./configuracion-ficheros.component.scss']
})
export class ConfiguracionFicherosComponent implements OnInit {
  showFicha: boolean = false;
  progressSpinnerConfiguracionFic: boolean = false;

  msgs;

  @Input() permisos;

  constructor() { }

  ngOnInit() {
    this.progressSpinnerConfiguracionFic=false;
  }

  onHideFicha() {
    this.showFicha = !this.showFicha;
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
}
