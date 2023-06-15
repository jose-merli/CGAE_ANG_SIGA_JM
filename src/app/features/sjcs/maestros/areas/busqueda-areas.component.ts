import { Component, OnInit, HostBinding, ViewChild, AfterViewInit, Output, EventEmitter, ContentChildren, QueryList } from '@angular/core';
import { FiltroBusquedaAreasComponent } from './filtro-busqueda-areas/filtro-busqueda-areas.component';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { TablaBusquedaAreasComponent } from './tabla-busqueda-areas/tabla-busqueda-areas.component';
import { PersistenceService } from '../../../../_services/persistence.service';
import { procesos_maestros } from '../../../../permisos/procesos_maestros';
import { Router } from '@angular/router';

@Component({
  selector: 'app-busqueda-areas',
  templateUrl: './busqueda-areas.component.html',
  styleUrls: ['./busqueda-areas.component.scss']
})
export class BusquedaAreasComponent implements OnInit {

  buscar: boolean = false;
  messageShow: string;

  datos;
  progressSpinner: boolean = false;
  //Mediante esta sentencia el padre puede acceder a los datos y atributos del hijo
  /*a particularidad de éste método es que tenemos que esperar a que la vista esté totalmente 
  cargada para acceder a los atributos del hijo. Para ello creamos un método de Angular llamado
   ngAfterViewInit() en el que simplemente inicializamos la variable con el valor del atributo del hijo 
   el hijo lo declaramos como @ViewChild(ChildComponent)).*/

  @ViewChild(FiltroBusquedaAreasComponent) filtros;
  @ViewChild(TablaBusquedaAreasComponent) tabla;

  //comboPartidosJudiciales
  comboPJ;
  msgs;
  permisoEscritura: any;



  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private router: Router) { }


  ngOnInit() {
    this.buscar = this.filtros.buscar

    this.commonsService.checkAcceso(procesos_maestros.areasMaterias)
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


  searchAreas(event) {
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.sigaServices.post("fichaAreas_searchAreas", this.filtros.filtroAux).subscribe(
      n => {
        this.datos = JSON.parse(n.body).areasItems;
        this.buscar = true;
        this.progressSpinner = false;
        if (this.tabla != null && this.tabla != undefined) {
          this.tabla.historico = event;
        }
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
      if (this.tabla.tabla) {
        this.tabla.tabla.sortOrder = 0;
        this.tabla.tabla.sortField = '';
        this.tabla.tabla.reset();
        this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
      }
    }
  }
  // searchZonasSend(event) {
  //   this.filtros.filtros.historico = event;
  //   this.searchZonas();
  // }

  // showMessage(event) {
  //   this.msgs = [];
  //   this.msgs.push({
  //     severity: event.severity,
  //     summary: event.summary,
  //     detail: event.msg
  //   });
  // }

  clear() {
    this.msgs = [];
  }

}
