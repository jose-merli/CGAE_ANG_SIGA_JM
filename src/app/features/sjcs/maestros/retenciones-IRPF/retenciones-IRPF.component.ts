import { Component, OnInit, ViewChild } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'
import { FiltrosRetencionesIrpfComponent } from './filtros-retenciones-irpf/filtros-retenciones-irpf.component';
import { TablaRetencionesIrpfComponent } from './tabla-retenciones-irpf/tabla-retenciones-irpf.component';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { TranslateService } from '../../../../commons/translate';
import { Router } from '../../../../../../node_modules/@angular/router';
import { procesos_maestros } from '../../../../permisos/procesos_maestros';


@Component({
  selector: 'app-retenciones-IRPF',
  templateUrl: './retenciones-IRPF.component.html',
  styleUrls: ['./retenciones-IRPF.component.scss'],

})
export class RetencionesIRPFComponent implements OnInit {

  buscar: boolean = false;
  historico: boolean = false;

  datos;

  progressSpinner: boolean = false;

  @ViewChild(FiltrosRetencionesIrpfComponent) filtros;
  @ViewChild(TablaRetencionesIrpfComponent) tabla;

  //comboPartidosJudiciales
  comboPJ;
  msgs;

  permisoEscritura;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsService: CommonsService, private translateService: TranslateService, private router: Router) { }


  ngOnInit() {

    this.commonsService.checkAcceso(procesos_maestros.retenciones)
      .then(respuesta => {

        this.permisoEscritura = respuesta;

        this.persistenceService.setPermisos(this.permisoEscritura);

        if (this.permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
      ).catch(error => console.error(error));
  }


  isOpenReceive(event) {
    this.search(event);
  }

  search(event) {
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.sigaServices.post("busquedaRetencionesIRPF_busquedaRetencionesIRPF", this.filtros.filtroAux).subscribe(
      n => {

        this.datos = JSON.parse(n.body).retencionItems;
        this.buscar = true;
        if (this.datos.length > 0) this.menorQueCero()
        if (this.datos.length > 0) this.ponComa()

        // this.datos = this.datos.map(it => {
        //   it.retencionReal = + it.retencion;
        //   return it;
        // });
        if (this.tabla != null && this.tabla != undefined) {
          this.tabla.historico = event;
          this.tabla.tabla.sortOrder = 0;
          this.tabla.tabla.sortField = '';
          this.tabla.tabla.reset();
          this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
        }

        this.progressSpinner = false;
        this.resetSelect();
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      });
  }

  resetSelect() {
    if (this.tabla != undefined) {
      this.tabla.selectedDatos = [];
      this.tabla.numSelected = 0;
      this.tabla.selectMultiple = false;
      this.tabla.selectAll = false;
    }
  }
  menorQueCero() {
    this.datos.map(dato => {
      if (dato.retencion != null && dato.retencion.length > 0 && dato.retencion[0] == '.') {
        dato.retencion = '0' + dato.retencion
      }
    });

  }
  ponComa() {
    this.datos.map(element => {
      if (element.retencion != null && element.retencion != undefined && element.retencion != "")
        element.retencion = element.retencion.replace(".", ",")
    });
  }
  showMessage(event) {
    this.msgs = [];
    this.msgs.push({
      severity: event.severity,
      summary: event.summary,
      detail: event.msg
    });
  }

  clear() {
    this.msgs = [];
  }




}
