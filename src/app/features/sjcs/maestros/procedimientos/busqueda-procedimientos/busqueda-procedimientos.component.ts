import { Component, OnInit, ViewChild } from '@angular/core';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { TranslateService } from '../../../../../commons/translate';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { FiltrosProcedimientosComponent } from './filtros-procedimientos/filtros-procedimientos.component';
import { TablaProcedimientosComponent } from './tabla-procedimientos/tabla-procedimientos.component';
import { procesos_maestros } from '../../../../../permisos/procesos_maestros';

@Component({
  selector: 'app-busqueda-procedimientos',
  templateUrl: './busqueda-procedimientos.component.html',
  styleUrls: ['./busqueda-procedimientos.component.scss']
})
export class BusquedaProcedimientosComponent implements OnInit {

  buscar: boolean = false;
  historico: boolean = false;

  datos;

  progressSpinner: boolean = false;

  @ViewChild(FiltrosProcedimientosComponent) filtros;
  @ViewChild(TablaProcedimientosComponent) tabla;

  //comboPartidosJudiciales
  comboPJ;
  msgs;

  permisoEscritura;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsService: CommonsService, private translateService: TranslateService, private router: Router) { }


  ngOnInit() {

    this.commonsService.checkAcceso(procesos_maestros.procedimientos)
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
    // this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.sigaServices.post("busquedaProcedimientos_searchProcedimientos", this.filtros.filtroAux).subscribe(
      n => {

        this.datos = JSON.parse(n.body).pretensionItems;
        this.buscar = true;
        this.progressSpinner = false;
        if (this.tabla != null && this.tabla != undefined) {
          this.tabla.historico = event;
        }

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
      this.tabla.tabla.sortOrder = 0;
      this.tabla.tabla.sortField = '';
      this.tabla.tabla.reset();
      this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");

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
