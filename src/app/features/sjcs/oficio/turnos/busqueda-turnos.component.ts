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
import { TurnosItem } from '../../../../models/sjcs/TurnosItem';

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
    this.buscar = this.filtros.buscar;
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
    this.filtros.filtroAux = new TurnosItem();
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux();
    if(this.filtros.filtroAux.idarea != undefined){
      let idAreaAux = this.filtros.filtroAux.idarea.toString();
      this.filtros.filtroAux.idarea = idAreaAux;
    }
    if(this.filtros.filtroAux.grupofacturacion != undefined){
      let grupoFacturacionAux = this.filtros.filtroAux.grupofacturacion.toString();
      this.filtros.filtroAux.grupofacturacion = grupoFacturacionAux;
    }
    if(this.filtros.filtroAux.idpartidapresupuestaria != undefined){
      let idPartidaPresupuestariaAux = this.filtros.filtroAux.idpartidapresupuestaria.toString();
      this.filtros.filtroAux.idpartidapresupuestaria = idPartidaPresupuestariaAux;
    }
    if(this.filtros.filtroAux.idtipoturno != undefined){
      let idTipoTurnoAux = this.filtros.filtroAux.idtipoturno.toString();
      this.filtros.filtroAux.idtipoturno = idTipoTurnoAux;
    }
    if(this.filtros.filtroAux.idzona != undefined){
      let idZonaAux = this.filtros.filtroAux.idzona.toString();
      this.filtros.filtroAux.idzona = idZonaAux;
    }
    if(this.filtros.filtroAux.idsubzona != undefined){
      let idZubZonaAux = this.filtros.filtroAux.idsubzona.toString();
      this.filtros.filtroAux.idzubzona = idZubZonaAux;
    }
    if(this.filtros.filtroAux.jurisdiccion != undefined){
      let jurisdiccionAux = this.filtros.filtroAux.jurisdiccion.toString();
      this.filtros.filtroAux.jurisdiccion = jurisdiccionAux;
    }
    if(this.filtros.filtroAux.idmateria != undefined){
      let idMateriaAux = this.filtros.filtroAux.idmateria.toString();
      this.filtros.filtroAux.idmateria = idMateriaAux;
    }
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.filtros.filtroAux.idsubzona = "";
    this.sigaServices.post("turnos_busquedaTurnos", this.filtros.filtroAux).subscribe(
      n => {
        let error = JSON.parse(n.body).error;
        this.datos = JSON.parse(n.body).turnosItem;
        this.datos.forEach(element => {
          element.nletrados = +element.nletrados;
        });
        this.buscar = true;
        this.progressSpinner = false;
        if (this.tablapartida != undefined) {
          this.tablapartida.tabla.sortOrder = 0;
          this.tablapartida.tabla.sortField = '';
          this.tablapartida.tabla.reset();
          this.tablapartida.buscadores = this.tablapartida.buscadores.map(it => it = "");
        }
        if (this.tablapartida != null && this.tablapartida != undefined) {
          this.tablapartida.historico = event;
        }
        setTimeout(() => {
          this.commonsService.scrollTablaFoco("tablaFoco");
        }, 5);

        if (error != null && error.description != null) {
          this.msgs = [];
          this.msgs.push({
            severity:"info", 
            summary:this.translateService.instant("general.message.informacion"), 
            detail: error.description});
        }
      },
      err => {
        this.progressSpinner = false;
        setTimeout(() => {
          this.commonsService.scrollTablaFoco("tablaFoco");
        }, 5);
      }, () => {
        setTimeout(() => {
          this.commonsService.scrollTablaFoco("tablaFoco");
        }, 5);
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
