import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../commons/translate';
import { CertificacionesItem } from '../../../../models/sjcs/CertificacionesItem';
import { CertificacionesObject } from '../../../../models/sjcs/CertificacionesObject';
import { procesos_facturacionSJCS } from '../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../_services/commons.service';
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
  permisoEscritura: boolean = false;
  mostrarTabla: boolean = false;
  datos: CertificacionesItem[] = [];

  @ViewChild(FiltroCertificacionFacComponent) filtros: FiltroCertificacionFacComponent;
  @ViewChild(TablaCertificacionFacComponent) tabla: TablaCertificacionFacComponent;

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private router: Router
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

  }

  hayCamposRellenos(): boolean {
    let resultado: boolean = false;

    if (this.filtros && this.filtros.filtros &&
      (this.filtros.filtros.idInstitucionList && this.filtros.filtros.idInstitucionList != null && this.filtros.filtros.idInstitucionList.length > 0) ||
      (this.filtros.filtros.idPartidaPresupuestariaList && this.filtros.filtros.idPartidaPresupuestariaList != null && this.filtros.filtros.idPartidaPresupuestariaList.length > 0) ||
      (this.filtros.filtros.idGrupoFacturacionList && this.filtros.filtros.idGrupoFacturacionList != null && this.filtros.filtros.idGrupoFacturacionList.length > 0) ||
      (this.filtros.filtros.idHitoGeneralList && this.filtros.filtros.idHitoGeneralList != null && this.filtros.filtros.idHitoGeneralList.length > 0) ||
      (this.filtros.filtros.idEstadoCertificacionList && this.filtros.filtros.idEstadoCertificacionList != null && this.filtros.filtros.idEstadoCertificacionList.length > 0) ||
      (this.filtros.filtros.nombre && this.filtros.filtros.nombre != null && this.filtros.filtros.nombre.trim().length > 0) ||
      (this.filtros.filtros.fechaDesde && this.filtros.filtros.fechaDesde != null) ||
      (this.filtros.filtros.fechaHasta && this.filtros.filtros.fechaHasta != null)) {
      resultado = true;
    }

    return resultado;
  }

  getCertificaciones(event) {

    if (event == true) {

      if (this.hayCamposRellenos()) {
        this.mostrarTabla = false;
        this.progressSpinner = true;

        this.sigaServices.post("certificaciones_buscarCertificaciones", this.filtros.filtros).subscribe(
          data => {
            const resp: CertificacionesObject = JSON.parse(data.body);
            this.progressSpinner = false;

            if (resp && resp.error && resp.error != null && resp.error.description != null && resp.error.code != null && resp.error.code.toString() == "500") {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(resp.error.description.toString()));
            } else {
              if (resp.error != null && resp.error.description != null && resp.error.code != null && resp.error.code.toString() == "200") {
                this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(resp.error.description.toString()));
              }

              this.datos = resp.certificacionesItemList;
              this.mostrarTabla = true;
            }

          },
          err => {
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
            setTimeout(() => {
              this.tabla.tablaFoco.nativeElement.scrollIntoView();
            }, 5);
          }
        );
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
      }
    }
  }

  newCertificacion(event) {
    if (event == true) {
      this.router.navigate(['/fichaCertificacionFac']);
    }
  }

  deleteCertificacion(event) {
    if (event == true) {
      this.progressSpinner = true;
      const certificaciones = JSON.parse(JSON.stringify(this.tabla.selectedDatos));
      this.sigaServices.post("certificaciones_eliminarCertificaciones", certificaciones).subscribe(
        data => {
          this.progressSpinner = false;

          const res = JSON.parse(data.body);

          if (res && res.error && res.error != null && res.error.description != null && res.error.code != null && res.error.code.toString() == "500") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(res.error.description.toString()));
          } else {
            if (res.error != null && res.error.description != null && res.error.code != null && res.error.code.toString() == "200") {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), res.error.description.toString());
            } else {
              this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            }
          }
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.getCertificaciones(true);
        }
      );
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
}
