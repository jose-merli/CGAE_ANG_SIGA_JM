import { Component, OnInit, HostBinding, ViewChild, AfterViewInit, Output, EventEmitter, ContentChildren, QueryList } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { procesos_maestros } from '../../../../permisos/procesos_maestros';
import { Router } from '@angular/router';
import { PartidasPresupuestarias } from '../partidas/partidasPresupuestarias/partidasPresupuestarias.component';
import { TablaPartidasComponent } from '../partidas/gestion-partidas/gestion-partidaspresupuestarias.component';
import { FiltrosRetenciones } from './filtros-retenciones/filtrosretenciones.component';
import { TablaDestinatariosComponent } from './gestion-retenciones/gestion-retenciones.component';


@Component({
  selector: 'app-destinatarios-retenciones',
  templateUrl: './destinatarios-retenciones.component.html',
  styleUrls: ['./destinatarios-retenciones.component.scss'],

})
export class DestinatariosRetencionesComponent implements OnInit {

  buscar: boolean = false;
  messageShow: string;

  datos;
  progressSpinner: boolean = false;
  //Mediante esta sentencia el padre puede acceder a los datos y atributos del hijo
  /*a particularidad de éste método es que tenemos que esperar a que la vista esté totalmente 
  cargada para acceder a los atributos del hijo. Para ello creamos un método de Angular llamado
   ngAfterViewInit() en el que simplemente inicializamos la variable con el valor del atributo del hijo 
   el hijo lo declaramos como @ViewChild(ChildComponent)).*/

  @ViewChild(FiltrosRetenciones) filtros;
  @ViewChild(TablaDestinatariosComponent) tablapartida;
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

    this.commonsService.checkAcceso(procesos_maestros.destinatariosRetenciones)
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
    let cuentacontable;
    if (this.filtros.filtros.nombrepartidatemp != undefined) {
      nombre = this.filtros.filtros.nombre;
      this.filtros.filtros.nombre = this.filtros.filtros.nombrepartidatemp;
      permanencia = true;
    }
    if (this.filtros.filtros.descripciontemp != undefined) {
      descripcion = this.filtros.filtros.orden;
      this.filtros.filtros.orden = this.filtros.filtros.descripciontemp;
      permanencia = true;
    }
    if (this.filtros.filtros.cuentacontabletemp != undefined) {
      cuentacontable = this.filtros.filtros.cuentacontable;
      this.filtros.filtros.cuentacontable = this.filtros.filtros.cuentacontabletemp;
      permanencia = true;
    }
    this.filtros.filtros.historico = event;
    if (this.tablapartida != undefined) {
      this.tablapartida.historico = event;
    }
    this.progressSpinner = true;

    this.sigaServices.post("gestionDestinatariosRetenc_searchDestinatariosRetenc", this.filtros.filtros).subscribe(
      n => {
        this.datos = JSON.parse(n.body).destinatariosItem;
        this.buscar = true;
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }, () => {
        if (permanencia) {
          this.filtros.filtros.orden = descripcion;
          this.filtros.filtros.nombre = nombre;
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
