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
// import { FiltrosTurnos } from './filtros-turnos/filtros-turnos.component';
// import { TablaTurnosComponent } from './gestion-turnos/gestion-turnos.component';
import { procesos_oficio } from '../../../../permisos/procesos_oficio';
import { TablaInscripcionesComponent } from './gestion-inscripciones/gestion-inscripciones.component';
import { FiltrosInscripciones } from './filtros-inscripciones/filtros-inscripciones.component';
import { InscripcionesItems } from '../../../../models/sjcs/InscripcionesItems';
import { Location } from '@angular/common';

@Component({
  selector: 'app-inscripciones',
  templateUrl: './busqueda-inscripciones.component.html',
  styleUrls: ['./busqueda-inscripciones.component.scss'],

})
export class InscripcionesComponent implements OnInit {
  buscar: boolean = false;
  messageShow: string;

  datos;
  progressSpinner: boolean = false;
  //Mediante esta sentencia el padre puede acceder a los datos y atributos del hijo
  /*a particularidad de éste método es que tenemos que esperar a que la vista esté totalmente 
  cargada para acceder a los atributos del hijo. Para ello creamos un método de Angular llamado
   ngAfterViewInit() en el que simplemente inicializamos la variable con el valor del atributo del hijo 
   el hijo lo declaramos como @ViewChild(ChildComponent)).*/

  @ViewChild(FiltrosInscripciones) filtros;
  @ViewChild(TablaInscripcionesComponent) tablapartida;
  //comboPartidosJudiciales
  msgs;
  permisoEscritura: any;



  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private router: Router,
    private location: Location) { }


  ngOnInit() {
    this.buscar = this.filtros.buscar;
    if (sessionStorage.getItem("origin") =="newInscrip") {
      sessionStorage.removeItem('origin');
    }
    //Se elimina cual posible inscripciones que haya guardada en la capa de persistencia al acceder a un turno o una guardia
    sessionStorage.removeItem('Inscripciones');
    this.commonsService.checkAcceso(procesos_oficio.inscripciones)
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

  backTo() {
    this.location.back();
  }

  searchPartidas(event) {
    this.filtros.filtroAux = new InscripcionesItems();
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux();
    if(this.filtros.filtroAux.estado != undefined){
      let estadoAux = this.filtros.filtroAux.estado.toString();
      if(estadoAux == "" ) this.filtros.filtroAux.estado = null;
      else this.filtros.filtroAux.estado = estadoAux;
    }
    if(this.filtros.filtroAux.idturno != undefined){
      let idturnoAux = this.filtros.filtroAux.idturno.toString();
      if( idturnoAux == "") this.filtros.filtroAux.idturno = null;
      else this.filtros.filtroAux.idturno = idturnoAux;
    } 
    
    if((<HTMLInputElement>document.querySelector("input[formControlName='numColegiado']"))){
      let ncolegiadoAux = (<HTMLInputElement>document.querySelector("input[formControlName='numColegiado']")).value;
      if( ncolegiadoAux == "") this.filtros.filtroAux.ncolegiado = null;
      else this.filtros.filtroAux.ncolegiado = ncolegiadoAux;
    } 
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.sigaServices.post("inscripciones_busquedaInscripciones", this.filtros.filtroAux).subscribe(
      n => {
        this.datos = JSON.parse(n.body).inscripcionesItem;
        this.buscar = true;
        let error = JSON.parse(n.body).error;
        this.progressSpinner = false;
        
        this.datos.forEach(element => {
          switch(element.estado){
            case "0": element.estadonombre = "Alta"; break;
            case "1": element.estadonombre = "Baja"; break;
            case "2": element.estadonombre = "Alta confirmada"; break;
            case "3": element.estadonombre = "Baja confirmada"; break;
            case "4": element.estadonombre = "Alta denegada"; break;
            case "5": element.estadonombre = "Baja denegada"; break;
            case "6": element.estadonombre = "Alta pendiente"; break;
            case "7": element.estadonombre = "Baja pendiente"; break;
            default: element.estadonombre = ""; break;
          }
          element.ncolegiado = +element.ncolegiado;
        });
        
        if (this.tablapartida != undefined) {
          this.tablapartida.tabla.sortOrder = 0;
          this.tablapartida.tabla.sortField = '';
          this.tablapartida.tabla.reset();
          this.tablapartida.buscadores = this.tablapartida.buscadores.map(it => it = "");
        }
        this.commonsService.scrollTablaFoco("tablaFoco");
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
      }, () => {
        this.commonsService.scrollTablaFoco("tablaFoco");
      }
    );
    this.commonsService.scrollTablaFoco('tablaFoco');
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
