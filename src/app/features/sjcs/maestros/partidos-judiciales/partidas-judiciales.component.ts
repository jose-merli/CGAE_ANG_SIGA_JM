import { Component, OnInit, HostBinding, ViewChild, AfterViewInit, Output, EventEmitter, ContentChildren, QueryList } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { procesos_maestros } from '../../../../permisos/procesos_maestros';
import { Router } from '@angular/router';
import { PartidasPresupuestarias } from '../partidas/partidasPresupuestarias/partidasPresupuestarias.component';
import { TablaPartidasComponent } from '../partidas/gestion-partidas/gestion-partidaspresupuestarias.component';
import { FiltrosPartidasJudiciales } from './filtrosPartidosJudiciales/filtros-partidasjudiciales.component';
import { PersistenceService } from '../../../../_services/persistence.service';
// import { PartidasPresupuestarias } from './partidasPresupuestarias/partidasPresupuestarias.component';
// import { GestionPartidasComponent } from './partidas.module';
// import { TablaPartidasComponent } from './gestion-partidas/gestion-partidaspresupuestarias.component';

@Component({
  selector: 'app-partidasjudiciales',
  templateUrl: './partidas-judiciales.component.html',
  styleUrls: ['./partidas-judiciales.component.scss']
})
export class PartidosJudicialesComponent implements OnInit, AfterViewInit {

  buscar: boolean = false;
  messageShow: string;

  datos;
  progressSpinner: boolean = false;
  //Mediante esta sentencia el padre puede acceder a los datos y atributos del hijo
  /*a particularidad de éste método es que tenemos que esperar a que la vista esté totalmente 
  cargada para acceder a los atributos del hijo. Para ello creamos un método de Angular llamado
   ngAfterViewInit() en el que simplemente inicializamos la variable con el valor del atributo del hijo 
   el hijo lo declaramos como @ViewChild(ChildComponent)).*/

  @ViewChild(FiltrosPartidasJudiciales) filtros;
  @ViewChild(TablaPartidasComponent) tablapartida;
  //comboPartidosJudiciales
  msgs;
  permisoEscritura: any;

  institucionActual;

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private router: Router) { }


  ngOnInit() {
    this.buscar = this.filtros.buscar

    this.commonsService.checkAcceso(procesos_maestros.partidaJudicial)
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

  ngAfterViewInit() {
  }

  // busquedaReceive(event) {
  //   this.searchAreas();
  // }


  searchPartidas(event) {
    this.filtros.filtros.historico = event;
    this.progressSpinner = true;

    this.sigaServices.post("gestionPartidosJudi_busquedaPartidosJudi", this.filtros.filtros).subscribe(
      n => {
        this.datos = JSON.parse(n.body).partidasJudicialesItem;
        this.buscar = true;
        this.progressSpinner = false;

        if (this.tablapartida && this.tablapartida.tabla) {
          this.tablapartida.tabla.sortOrder = 0;
          this.tablapartida.tabla.sortField = '';
          this.tablapartida.tabla.reset();
          this.tablapartida.buscadores = this.tablapartida.buscadores.map(it => it = "");
        }

      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }, () => {
      }
    );
  }
  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
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
