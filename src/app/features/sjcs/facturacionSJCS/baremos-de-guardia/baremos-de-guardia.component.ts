import { Component, OnInit } from '@angular/core';
import { procesos_facturacionSJCS } from '../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../_services/commons.service';
import { TranslateService } from '../../../../commons/translate/translation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-baremos-de-guardia',
  templateUrl: './baremos-de-guardia.component.html',
  styleUrls: ['./baremos-de-guardia.component.scss']
})
export class BaremosDeGuardiaComponent implements OnInit {

  permisoEscritura: boolean = false;
  mostrarTablaResultados: boolean = false;

  constructor(
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.busquedaBaremosDeGuardia).then(respuesta => {

      this.permisoEscritura = respuesta;

      if (this.permisoEscritura == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

    }).catch(error => console.error(error));

  }

}
