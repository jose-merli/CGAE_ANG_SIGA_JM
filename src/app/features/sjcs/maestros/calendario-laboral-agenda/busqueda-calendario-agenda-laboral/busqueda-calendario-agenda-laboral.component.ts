import { Component, OnInit, ViewChild } from '@angular/core';
import { FiltroCalendarioAgendaLaboralComponent } from './filtro-calendario-agenda-laboral/filtro-calendario-agenda-laboral.component';
import { TablaCalendarioAgendaLaboralComponent } from './tabla-calendario-agenda-laboral/tabla-calendario-agenda-laboral.component';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { procesos_maestros } from '../../../../../permisos/procesos_maestros';

@Component({
  selector: 'app-busqueda-calendario-agenda-laboral',
  templateUrl: './busqueda-calendario-agenda-laboral.component.html',
  styleUrls: ['./busqueda-calendario-agenda-laboral.component.scss']
})
export class BusquedaCalendarioAgendaLaboralComponent implements OnInit {

  buscar: boolean = false;
  historico: boolean = false;

  datos;

  progressSpinner: boolean = false;

  @ViewChild(FiltroCalendarioAgendaLaboralComponent) filtros;
  @ViewChild(TablaCalendarioAgendaLaboralComponent) tabla;

  //comboPartidosJudiciales
  comboPJ;
  msgs;

  permisoEscritura;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsService: CommonsService, private translateService: TranslateService, private router: Router) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_maestros.calendarioLaboralAgenda)
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

    this.sigaServices.post("calendarioLaboralAgenda_searchFestivos", this.filtros.filtroAux).subscribe(
      n => {

        this.datos = JSON.parse(n.body).eventos;
        this.buscar = true;
        this.progressSpinner = false;
        if (this.tabla != null && this.tabla != undefined) {
          this.tabla.historico = event;
        }
        if (this.tabla && this.tabla.table) {
          this.tabla.table.sortOrder = 0;
          this.tabla.table.sortField = '';
          this.tabla.table.reset();
          this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
        }
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
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
