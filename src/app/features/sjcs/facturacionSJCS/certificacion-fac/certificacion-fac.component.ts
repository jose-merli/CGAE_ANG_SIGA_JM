import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../commons/translate';
import { procesos_facturacionSJCS } from '../../../../permisos/procesos_facturacionSJCS';
import { SigaStorageService } from '../../../../siga-storage.service';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { FiltroCertificacionFacComponent } from './filtro-certificacion-fac/filtro-certificacion-fac.component';
import { TablaCertificacionFacComponent } from './tabla-certificacion-fac/tabla-certificacion-fac.component';

@Component({
  selector: 'app-certificacion-fac',
  templateUrl: './certificacion-fac.component.html',
  styleUrls: ['./certificacion-fac.component.scss']
})
export class CertificacionFacComponent implements OnInit {
  msgs: any[];
  progressSpinner: boolean = false;
  permisoEscritura;
  buscar;
  datos
  disableColegio: boolean;

  @ViewChild(FiltroCertificacionFacComponent) filtros: FiltroCertificacionFacComponent;
  @ViewChild(TablaCertificacionFacComponent) tabla: TablaCertificacionFacComponent;

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private router: Router,
    private localStorageService: SigaStorageService
  ) { }

  ngOnInit() {

    this.progressSpinner = true;
    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaCertificacion).then(respuesta => {

      this.permisoEscritura = respuesta;

      if (this.permisoEscritura == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }
    }).catch(error => console.error(error));

    this.progressSpinner = false;

    this.isConsejo();


  }

  getCertificaciones(event) {
    if (event == true) {
      this.buscar = true;
      console.log(this.filtros.filtros)
    }
  }

  newCertificacion(event) {
    if (event == true) {
      this.router.navigate(['/fichaCertificacionFac']);
    }
  }

  deleteCertificacion(event) {
    if (event != null || event != undefined) {

    }
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

  isConsejo() {
    let institucion = this.localStorageService.institucionActual;

    switch (institucion) {
      case "2000":
      case "3003":
      case "3004":
      case "3006":
      case "3007":
      case "3008":
      case "3009":
      case "3010":
        this.disableColegio = false;
        break;
      default:
        this.disableColegio = true;
        this.filtros.filtros.idColegio = this.localStorageService.institucionActual;
        break;

    }
  }
}
