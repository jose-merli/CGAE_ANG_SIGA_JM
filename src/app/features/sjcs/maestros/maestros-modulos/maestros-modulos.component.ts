
import { Component, OnInit, HostBinding, ViewChild, AfterViewInit, Output, EventEmitter, ContentChildren, QueryList } from '@angular/core';
import { BusquedaModulosYBasesDeCompensacion } from './filtro-busqueda-modulos/busqueda-modulosybasesdecompensacion.component';
import { TablaModulosComponent } from './gestion-modulos/gestion-modulosybasesdecompensacion.component';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
// import { BusquedaModulosYBasesDeCompensacion } from './tabla-busqueda-modulos/tabla-busqueda-modulos.component';
import { PersistenceService } from '../../../../_services/persistence.service';
import { procesos_maestros } from '../../../../permisos/procesos_maestros';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maestros-modulos',
  templateUrl: './maestros-modulos.component.html',
  styleUrls: ['./maestros-modulos.component.scss']
})
export class MaestrosModulosComponent implements OnInit, AfterViewInit {

  buscar: boolean = false;
  messageShow: string;

  datos;
  progressSpinner: boolean = false;
  //Mediante esta sentencia el padre puede acceder a los datos y atributos del hijo
  /*a particularidad de éste método es que tenemos que esperar a que la vista esté totalmente 
  cargada para acceder a los atributos del hijo. Para ello creamos un método de Angular llamado
   ngAfterViewInit() en el que simplemente inicializamos la variable con el valor del atributo del hijo 
   el hijo lo declaramos como @ViewChild(ChildComponent)).*/

  @ViewChild(BusquedaModulosYBasesDeCompensacion) filtros;

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

    this.commonsService.checkAcceso(procesos_maestros.modulo)
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


  searchModulos(event) {
    this.filtros.filtros.historico = event;

    this.progressSpinner = true;

    this.sigaServices.post("modulosYBasesDeCompensacion_searchModulos", this.filtros.filtros).subscribe(
      n => {
        this.datos = JSON.parse(n.body).modulosItem;
        this.buscar = true;
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
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
