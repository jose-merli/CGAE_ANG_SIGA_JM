import { Component, OnInit, ViewChild } from '@angular/core';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { FiltrosProcuradoresComponent } from './filtros-procuradores/filtros-procuradores.component';
import { TablaProcuradoresComponent } from './tabla-procuradores/tabla-procuradores.component';
import { procesos_maestros } from '../../../../../permisos/procesos_maestros';

@Component({
  selector: 'app-busqueda-procuradores',
  templateUrl: './busqueda-procuradores.component.html',
  styleUrls: ['./busqueda-procuradores.component.scss']
})
export class BusquedaProcuradoresComponent implements OnInit {

  buscar: boolean = false;
  historico: boolean = false;

  datos;
  institucionActual: any;

  progressSpinner: boolean = false;

  @ViewChild(FiltrosProcuradoresComponent) filtros;
  @ViewChild(TablaProcuradoresComponent) tabla;

  //comboPartidosJudiciales
  comboPJ;
  msgs;

  permisoEscritura;
  fromProcuradorContrario=false;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsService: CommonsService, private translateService: TranslateService, private router: Router) { }


  ngOnInit() {

    if(sessionStorage.getItem("origin")=="fromProcuradorContrario"){
      sessionStorage.removeItem('origin');
      this.fromProcuradorContrario=true;
    }
    this.commonsService.checkAcceso(procesos_maestros.procuradores)
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
        this.getInstitucion();

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
    this.sigaServices.post("busquedaProcuradores_searchProcuradores", this.filtros.filtroAux).subscribe(
      n => {

        this.datos = JSON.parse(n.body).procuradorItems;
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
      if (this.tabla.table) {

        this.tabla.table.sortOrder = 0;
        this.tabla.table.sortField = '';
        this.tabla.table.reset();
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
  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
    });
  }

}
