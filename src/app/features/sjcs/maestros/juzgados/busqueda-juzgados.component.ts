import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FiltroJuzgadosComponent } from './filtro-juzgados/filtro-juzgados.component';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { procesos_maestros } from '../../../../permisos/procesos_maestros';
import { TranslateService } from '../../../../commons/translate/translation.service';
import { Router } from '@angular/router';
import { TablaJuzgadosComponent } from './tabla-juzgados/tabla-juzgados.component';

@Component({
  selector: 'app-busqueda-juzgados',
  templateUrl: './busqueda-juzgados.component.html',
  styleUrls: ['./busqueda-juzgados.component.scss']
})
export class BusquedaJuzgadosComponent implements OnInit {

  buscar: boolean = false;
  historico: boolean = false;

  datos;

  institucionActual;

  progressSpinner: boolean = false;
  @ViewChild(FiltroJuzgadosComponent) filtros;

  @ViewChild(TablaJuzgadosComponent) tabla;
  //comboPartidosJudiciales
  comboPJ;
  msgs;

  permisoEscritura;



  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsService: CommonsService, private translateService: TranslateService, private router: Router) { }


  ngOnInit() {

    this.commonsService.checkAcceso(procesos_maestros.juzgados)
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

  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
    });
  }
  search(event) {
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.sigaServices.post("busquedaJuzgados_searchCourt", this.filtros.filtroAux).subscribe(
      n => {

        this.datos = JSON.parse(n.body).juzgadoItems;
        this.buscar = true;

        if (this.tabla != null && this.tabla != undefined) {
          this.tabla.historico = event;
          this.tabla.table.sortOrder = 0;
          this.tabla.table.sortField = '';
          this.tabla.table.reset();
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
