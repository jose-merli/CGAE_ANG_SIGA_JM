import { Component, OnInit, HostBinding, ViewChild, AfterViewInit, Output, EventEmitter, ContentChildren, QueryList, ChangeDetectorRef, SimpleChanges, Input } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { procesos_maestros } from '../../../../permisos/procesos_maestros';
import { Router } from '@angular/router';
import { MultiSelect } from '../../../../../../node_modules/primeng/primeng';
import { TiposActuacionObject } from '../../../../models/sjcs/TiposActuacionObject';
import { PartidasPresupuestarias } from '../../maestros/partidas/partidasPresupuestarias/partidasPresupuestarias.component';
import { TablaPartidasComponent } from '../../maestros/partidas/gestion-partidas/gestion-partidaspresupuestarias.component';
import { FiltrosTurnos } from './filtros-turnos/filtros-turnos.component';
import { TablaTurnosComponent } from './gestion-turnos/gestion-turnos.component';
import { procesos_oficio } from '../../../../permisos/procesos_oficio';

@Component({
  selector: 'app-turnos',
  templateUrl: './busqueda-turnos.component.html',
  styleUrls: ['./busqueda-turnos.component.scss'],

})
export class TurnosComponent implements OnInit {
  buscar: boolean = false;
  messageShow: string;

  datos;
  progressSpinner: boolean = false;
  //Mediante esta sentencia el padre puede acceder a los datos y atributos del hijo
  /*a particularidad de éste método es que tenemos que esperar a que la vista esté totalmente 
  cargada para acceder a los atributos del hijo. Para ello creamos un método de Angular llamado
   ngAfterViewInit() en el que simplemente inicializamos la variable con el valor del atributo del hijo 
   el hijo lo declaramos como @ViewChild(ChildComponent)).*/

  @ViewChild(FiltrosTurnos) filtros;
  @ViewChild(TablaTurnosComponent) tablapartida;
  //comboPartidosJudiciales
  msgs;
  permisoEscritura: any;



  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private router: Router) { }


  ngOnInit() {
    this.commonsService.checkAcceso(procesos_oficio.turnos)
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

  ngAfterViewInit() {
  }

  // busquedaReceive(event) {
  //   this.searchAreas();
  // }


  searchPartidas(event) {
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.sigaServices.post("turnos_busquedaTurnos", this.filtros.filtroAux).subscribe(
      n => {
        this.datos = JSON.parse(n.body).turnosItem;
        this.datos.forEach(element => {
          element.nletrados = +element.nletrados;
        });
        this.buscar = true;
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }, () => {
      }
    );
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
