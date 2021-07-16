import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '../../../../../../commons/translate';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../../../_services/commons.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion-ficheros',
  templateUrl: './configuracion-ficheros.component.html',
  styleUrls: ['./configuracion-ficheros.component.scss']
})
export class ConfiguracionFicherosComponent implements OnInit {
  showFicha: boolean = false;
  progressSpinner: boolean = false;
  msgs;
  permisos;

  constructor(private commonsService: CommonsService, private translateService: TranslateService, private router: Router) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaPagosTarjetaConfigFichAbonos).then(respuesta => {

      this.permisos = respuesta;

      if (this.permisos == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      this.progressSpinner = false;

    }).catch(error => console.error(error));

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
