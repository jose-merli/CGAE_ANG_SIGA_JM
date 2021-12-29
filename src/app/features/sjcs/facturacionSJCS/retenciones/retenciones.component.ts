import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
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
import { SigaStorageService } from '../../../../siga-storage.service';
import { RetencionesService } from './retenciones.service';

export enum TIPOBUSQUEDA {
  RETENCIONES = "r",
  RETENCIONESAPLICADAS = "a"
}
@Component({
  selector: 'app-retenciones',
  templateUrl: './retenciones.component.html',
  styleUrls: ['./retenciones.component.scss']
})
export class RetencionesComponent implements OnInit, AfterViewChecked {

  msgs = [];
  progressSpinner: boolean = false;
  retencionesItemList: RetencionesItem[] = [];
  retencionesAplicadasItemList: RetencionesAplicadasItem[] = [];
  mostrarTablaResultados: boolean = false;
  filtros: RetencionesRequestDto;
  modoBusqueda: string = TIPOBUSQUEDA.RETENCIONES;
  permisoEscritura: boolean;
  isLetrado: boolean = false;

  @ViewChild(TablaBusquedaRetencionesComponent) tablaRetenciones: TablaBusquedaRetencionesComponent;
  @ViewChild(TablaBusquedaRetencionesAplicadasComponent) tablaRetencionesAplicadas: TablaBusquedaRetencionesAplicadasComponent;
  datosColegiado: any;
  disabledLetradoFicha: boolean = false;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private commonsService: CommonsService,
    private router: Router,
    private sigaStorageService: SigaStorageService,
    private retencionesService: RetencionesService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.busquedaRetenciones).then(respuesta => {

      this.permisoEscritura = respuesta;

      if (this.permisoEscritura == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      this.isLetrado = this.sigaStorageService.isLetrado;
      this.retencionesService.modoEdicion = false;
      this.retencionesService.retencion = undefined;

    }).catch(error => console.error(error));

    if (sessionStorage.getItem("datosColegiado") != null || sessionStorage.getItem("datosColegiado") != undefined) {
      this.datosColegiado = JSON.parse(sessionStorage.getItem("datosColegiado"));
      const { numColegiado, nombre, idPersona } = this.datosColegiado;
      this.disabledLetradoFicha = true;
      this.retencionesService.filtrosRetenciones.ncolegiado = numColegiado;
      this.retencionesService.filtrosRetenciones.nombreApellidoColegiado =  nombre.replace(/,/g, "");
      this.retencionesService.filtrosRetenciones.idPersona =  idPersona;

      this.buscarDesdeEnlace();
      sessionStorage.removeItem("datosColegiado");

    }

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

  buscarDesdeEnlace() {

    this.filtros = new RetencionesRequestDto();
    this.filtros.ncolegiado = this.retencionesService.filtrosRetenciones.ncolegiado;
    this.filtros.nombreApellidoColegiado = this.retencionesService.filtrosRetenciones.nombreApellidoColegiado;
    this.filtros.idPersona = this.retencionesService.filtrosRetenciones.idPersona;

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
    let contadorRetenciones = 0;
    for (var i = 0; i < event.retenciones.length; i++) {
      let restantepunto = event.retenciones[i].restante.replace(',', '.');
      let restante = Number(restantepunto);
      let importe = Number(event.retenciones[i].importe);
      console.log(importe > restante);
      console.log(restante > 0);
      console.log(restante == 0);
      if( (importe > restante) && (restante > 0)){
        contadorRetenciones ++;
      }else if(restante == 0){
        contadorRetenciones ++;
      }
   }
    if(contadorRetenciones == 0){
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
    }else{
      this.progressSpinner = false;
      this.showMessage("error", this.translateService.instant("general.message.incorrect"),this.translateService.instant("facturacionSJCS.retenciones.error.yaAplicadas"));
    }
    
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

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

}
