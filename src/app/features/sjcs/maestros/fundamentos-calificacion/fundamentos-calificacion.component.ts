
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FiltroFundamentosCalificacionComponent } from './filtro-fundamentos-calificacion/filtro-fundamentos-calificacion.component';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { Router } from '../../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../../commons/translate';
import { PersistenceService } from '../../../../_services/persistence.service';
import { TablaFundamentosCalificacionComponent } from './tabla-fundamentos-calificacion/tabla-fundamentos-calificacion.component';
import { procesos_maestros } from '../../../../permisos/procesos_maestros';
export enum KEY_CODE {
  ENTER = 13
}
@Component({
  selector: 'app-fundamentos-calificacion',
  templateUrl: './fundamentos-calificacion.component.html',
  styleUrls: ['./fundamentos-calificacion.component.scss']
})
export class FundamentosCalificacionComponent implements OnInit {

  @ViewChild(FiltroFundamentosCalificacionComponent) filtros;
  @ViewChild(TablaFundamentosCalificacionComponent) tabla;

  msgs = [];
  datos;
  buscar;
  progressSpinner: boolean = false;

  permisoEscritura: boolean = false

  constructor(private sigaServices: SigaServices, private commonsService: CommonsService, private persistenceService: PersistenceService,
    private translateService: TranslateService, private router: Router
  ) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_maestros.fundamentoCalificacion)
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

  searchHistorico(event) {
    this.search(event)
  }

  search(event) {
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.sigaServices.post("busquedaFundamentosCalificacion_searchFundamentos", this.filtros.filtroAux).subscribe(
      n => {

        this.datos = JSON.parse(n.body).fundamentosCalificacionesItems;
        this.buscar = true;
        if (this.tabla != null && this.tabla != undefined) {
          this.tabla.historico = event;
        }
        this.resetSelect();
        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    );
  }

  resetSelect() {
    if (this.tabla != undefined) {
      this.tabla.selectedDatos = [];
      this.tabla.numSelected = 0;
      this.tabla.selectMultiple = false;
      this.tabla.selectAll = false;

      if (this.tabla && this.tabla.table) {

        this.tabla.tabla.sortOrder = 0;
        this.tabla.tabla.sortField = '';
        this.tabla.tabla.reset();
        this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
      }
    }
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
