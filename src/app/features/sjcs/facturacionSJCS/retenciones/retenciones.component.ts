import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonsService } from '../../../../_services/commons.service';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../commons/translate';
import { RetencionesAplicadasItem } from '../../../../models/sjcs/RetencionesAplicadasItem';
import { RetencionesAplicadasObject } from '../../../../models/sjcs/RetencionesAplicadasObject';
import { RetencionesItem } from '../../../../models/sjcs/RetencionesItem';
import { RetencionesObject } from '../../../../models/sjcs/RetencionesObject';
import { RetencionesRequestDto } from '../../../../models/sjcs/RetencionesRequestDTO';
import { SigaServices } from '../../../../_services/siga.service';
import { TablaBusquedaRetencionesAplicadasComponent } from './tabla-busqueda-retenciones-aplicadas/tabla-busqueda-retenciones-aplicadas.component';
import { TablaBusquedaRetencionesComponent } from './tabla-busqueda-retenciones/tabla-busqueda-retenciones.component';
import { procesos_facturacionSJCS } from '../../../../permisos/procesos_facturacionSJCS';

export enum TIPOBUSQUEDA {
  RETENCIONES = "r",
  RETENCIONESAPLICADAS = "a"
}
@Component({
  selector: 'app-retenciones',
  templateUrl: './retenciones.component.html',
  styleUrls: ['./retenciones.component.scss']
})
export class RetencionesComponent implements OnInit {

  msgs = [];
  progressSpinner: boolean = false;
  retencionesItemList: RetencionesItem[] = [];
  retencionesAplicadasItemList: RetencionesAplicadasItem[] = [];
  mostrarTablaResultados: boolean = false;
  filtros: RetencionesRequestDto;
  modoBusqueda: string = TIPOBUSQUEDA.RETENCIONES;
  permisoEscritura: boolean;

  @ViewChild(TablaBusquedaRetencionesComponent) tablaRetenciones: TablaBusquedaRetencionesComponent;
  @ViewChild(TablaBusquedaRetencionesAplicadasComponent) tablaRetencionesAplicadas: TablaBusquedaRetencionesAplicadasComponent;

  constructor(private sigaServices: SigaServices, 
    private translateService: TranslateService, 
    private commonsService: CommonsService,
		private router: Router) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.busquedaRetenciones).then(respuesta => {

		this.permisoEscritura = respuesta;

			if (this.permisoEscritura == undefined) {
				sessionStorage.setItem("codError", "403");
				sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
				this.router.navigate(["/errorAcceso"]);
			}
		}).catch(error => console.error(error));

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

  changeModoBusqueda(event) {
    this.modoBusqueda = event;
    this.mostrarTablaResultados = false;
  }

  buscarRetenciones(historico: boolean, event?: RetencionesRequestDto) {

    if (event) {
      this.mostrarTablaResultados = false;
      this.filtros = JSON.parse(JSON.stringify(event));
    }

    this.filtros.historico = historico;

    if (Array.isArray(this.filtros.idDestinatarios) && this.filtros.idDestinatarios.length > 0) {
      this.filtros.idDestinatarios = this.filtros.idDestinatarios.toString();
    }

    if (Array.isArray(this.filtros.idPagos) && this.filtros.idPagos.length > 0) {
      this.filtros.idPagos = this.filtros.idPagos.toString();
    }

    if (Array.isArray(this.filtros.tiposRetencion) && this.filtros.tiposRetencion.length > 0) {
      this.filtros.tiposRetencion = (this.filtros.tiposRetencion.map(el => "'" + el + "'")).toString();
    }

    this.progressSpinner = true;

    this.sigaServices.post("retenciones_buscarRetenciones", this.filtros).subscribe(
      data => {
        const res: RetencionesObject = JSON.parse(data.body);

        if (res.error != null && res.error.description != null && res.error.code != null && res.error.code.toString() == "500") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(res.error.description.toString()));
        } else {
          if (res.error != null && res.error.description != null && res.error.code != null && res.error.code.toString() == "200") {
            this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(res.error.description.toString()));
          }
          this.retencionesItemList = res.retencionesItemList;
          this.mostrarTablaResultados = true;
        }

        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        setTimeout(() => {
          this.tablaRetenciones.tablaFoco.nativeElement.scrollIntoView();
        }, 5);
      }
    );
  }

  eliminarRetenciones(event: { retenciones: RetencionesItem[], historico: boolean }) {

    this.progressSpinner = true;

    this.sigaServices.post("retenciones_eliminarRetenciones", event.retenciones).subscribe(
      data => {
        const res = JSON.parse(data.body);
        this.progressSpinner = false;
        if (res.status == 'KO' && res.error != null && res.error.description != null && res.error.code != null && res.error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(res.error.description.toString()));
        } else if (res.status == 'OK') {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.buscarRetenciones(event.historico);
        }
      },
      err => {
        this.progressSpinner = false;
      });
  }

  buscarRetencionesAplicadas(historico: boolean, event?: RetencionesRequestDto) {

    if (event) {
      this.mostrarTablaResultados = false;
      this.filtros = JSON.parse(JSON.stringify(event));
    }

    this.filtros.historico = historico;

    if (Array.isArray(this.filtros.idDestinatarios) && this.filtros.idDestinatarios.length > 0) {
      this.filtros.idDestinatarios = this.filtros.idDestinatarios.toString();
    }

    if (Array.isArray(this.filtros.idPagos) && this.filtros.idPagos.length > 0) {
      this.filtros.idPagos = this.filtros.idPagos.toString();
    }

    if (Array.isArray(this.filtros.tiposRetencion) && this.filtros.tiposRetencion.length > 0) {
      this.filtros.tiposRetencion = (this.filtros.tiposRetencion.map(el => "'" + el + "'")).toString();
    }

    this.progressSpinner = true;

    this.sigaServices.post("retenciones_buscarRetencionesAplicadas", this.filtros).subscribe(
      data => {
        const res: RetencionesAplicadasObject = JSON.parse(data.body);

        if (res.error != null && res.error.description != null && res.error.code != null && res.error.code.toString() == "500") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(res.error.description.toString()));
        } else {
          if (res.error != null && res.error.description != null && res.error.code != null && res.error.code.toString() == "200") {
            this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(res.error.description.toString()));
          }
          this.retencionesAplicadasItemList = res.retencionesAplicadasItemList;
          this.retencionesAplicadasItemList.forEach((el, index) => el.id = index.toString());
          this.mostrarTablaResultados = true;
        }

        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        setTimeout(() => {
          this.tablaRetencionesAplicadas.tablaFoco.nativeElement.scrollIntoView();
        }, 5);
      }
    );
  }

}
