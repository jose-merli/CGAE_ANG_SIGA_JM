import { Component, OnInit, HostBinding, ViewChild, AfterViewInit, Output, EventEmitter, ContentChildren, QueryList } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { procesos_maestros } from '../../../../permisos/procesos_maestros';
import { Router } from '@angular/router';
import { PartidasPresupuestarias } from './partidasPresupuestarias/partidasPresupuestarias.component';
import { TablaPartidasComponent } from './gestion-partidas/gestion-partidaspresupuestarias.component';

@Component({
  selector: 'app-partidas',
  templateUrl: './partidas.component.html',
  styleUrls: ['./partidas.component.scss']
})
export class PartidasComponent implements OnInit, AfterViewInit {

  buscar: boolean = false;
  messageShow: string;

  datos;
  progressSpinner: boolean = false;
  //Mediante esta sentencia el padre puede acceder a los datos y atributos del hijo
  /*a particularidad de éste método es que tenemos que esperar a que la vista esté totalmente 
  cargada para acceder a los atributos del hijo. Para ello creamos un método de Angular llamado
   ngAfterViewInit() en el que simplemente inicializamos la variable con el valor del atributo del hijo 
   el hijo lo declaramos como @ViewChild(ChildComponent)).*/

  @ViewChild(PartidasPresupuestarias) filtros;
  @ViewChild(TablaPartidasComponent) tablapartida;
  //comboPartidosJudiciales
  msgs;
  permisoEscritura: any;



  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private router: Router) { }


  ngOnInit() {
    this.buscar = this.filtros.buscar

    this.commonsService.checkAcceso(procesos_maestros.partidaPresupuesto)
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
    let permanencia = false;
    let nombre;
    let descripcion;
    if (this.filtros.filtros.nombrepartidatemp != undefined) {
      nombre = this.filtros.filtros.nombrepartida;
      this.filtros.filtros.nombrepartida = this.filtros.filtros.nombrepartidatemp;
      permanencia = true;
    }
    if (this.filtros.filtros.descripciontemp != undefined) {
      descripcion = this.filtros.filtros.descripcion;
      this.filtros.filtros.descripcion = this.filtros.filtros.descripciontemp;
      permanencia = true;
    }
    this.filtros.filtros.historico = event;
    if (this.tablapartida != undefined) {
      this.tablapartida.historico = event;
    }
    this.progressSpinner = true;

    this.sigaServices.post("gestionPartidasPres_searchPartidasPres", this.filtros.filtros).subscribe(
      n => {
        this.datos = JSON.parse(n.body).partidasItem;
        this.buscar = true;
        if (this.tablapartida && this.tablapartida.tabla) {
          this.tablapartida.tabla.sortOrder = 0;
          this.tablapartida.tabla.sortField = '';
          this.tablapartida.tabla.reset();
          this.tablapartida.buscadores = this.tablapartida.buscadores.map(it => it = "");
        }
        this.progressSpinner = false;

        this.datos.forEach(element => {
          element.importepartidaReal = + element.importepartida;
          element.importepartida = element.importepartida.replace(".", ",");
          if (element.importepartida[0] == ',')
            element.importepartida = "0".concat(element.importepartida)
        });

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }, () => {
        if (permanencia) {
          this.filtros.filtros.descripcion = descripcion;
          this.filtros.filtros.nombrepartida = nombre;
        }
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
