import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../commons/translate';
import { procesos_oficio } from '../../../../permisos/procesos_oficio';
import { CommonsService } from '../../../../_services/commons.service';
import { OldSigaServices } from '../../../../_services/oldSiga.service'
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { FiltrosInscripciones } from '../inscripciones/filtros-inscripciones/filtros-inscripciones.component';
import { FiltrosSaltosYCompensaciones } from './filtros-saltosYcompensaciones/filtros-saltosYcompensaciones.component';


@Component({
  selector: 'app-saltos-compensaciones',
  templateUrl: './saltos-compensaciones.component.html',
  styleUrls: ['./saltos-compensaciones.component.scss'],

})
export class SaltosYCompensacionesComponent implements OnInit {
  buscar: boolean = false;
  messageShow: string;

  datos;
  progressSpinner: boolean = false;
  //Mediante esta sentencia el padre puede acceder a los datos y atributos del hijo
  /*a particularidad de éste método es que tenemos que esperar a que la vista esté totalmente 
  cargada para acceder a los atributos del hijo. Para ello creamos un método de Angular llamado
   ngAfterViewInit() en el que simplemente inicializamos la variable con el valor del atributo del hijo 
   el hijo lo declaramos como @ViewChild(ChildComponent)).*/

  @ViewChild(FiltrosSaltosYCompensaciones) filtros;
  // @ViewChild(TablaInscripcionesComponent) tablapartida;
  //comboPartidosJudiciales
  msgs;
  permisoEscritura: any;



  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private router: Router) { }


  ngOnInit() {
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


  searchPartidas(event) {
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.sigaServices.post("inscripciones_busquedaInscripciones", this.filtros.filtroAux).subscribe(
      n => {
        this.datos = JSON.parse(n.body).inscripcionesItem;
        this.datos.forEach(element => {
          if(element.estado == "0"){
            element.estadonombre = "Pendiente de Alta";
          }
          if(element.estado == "1"){
            element.estadonombre = "Alta";
          }
          if(element.estado == "2"){
            element.estadonombre = "Pendiente de Baja";
          }
          if(element.estado == "3"){
            element.estadonombre = "Baja";
          }
          if(element.estado == "4"){
            element.estadonombre = "Denegada";
          }
          element.ncolegiado = +element.ncolegiado;
        });
        this.buscar = true;
        this.progressSpinner = false;
        // if (this.tablapartida != undefined) {
        //   this.tablapartida.tabla.sortOrder = 0;
        //   this.tablapartida.tabla.sortField = '';
        //   this.tablapartida.tabla.reset();
        //   this.tablapartida.buscadores = this.tablapartida.buscadores.map(it => it = "");
        // }
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
