
import { Component, OnInit, HostBinding, ViewChild, AfterViewInit, Output, EventEmitter, ContentChildren, QueryList } from '@angular/core';
import { FiltrosModulosComponent } from './filtro-busqueda-modulos/filtros-modulos.component';
import { TablaModulosComponent } from './tabla-modulos/tabla-modulos.component';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
// import { FiltrosModulosComponent } from './tabla-busqueda-modulos/tabla-busqueda-modulos.component';
import { PersistenceService } from '../../../../_services/persistence.service';
import { procesos_maestros } from '../../../../permisos/procesos_maestros';
import { Router } from '@angular/router';
import { ModulosJuzgadoItem } from '../../../../models/sjcs/ModulosJuzgadoItem';

@Component({
  selector: 'app-busqueda-modulosybasesdecompensacion',
  templateUrl: './busqueda-modulosybasesdecompensacion.component.html',
  styleUrls: ['./busqueda-modulosybasesdecompensacion.component.scss']
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

  @ViewChild(FiltrosModulosComponent) filtros;
  filtrosJuzgado: ModulosJuzgadoItem = new ModulosJuzgadoItem();
  @ViewChild(TablaModulosComponent) tabla;

  //comboPartidosJudiciales
  msgs;
  permisoEscritura: any;

  vieneDeFichaJuzgado: String;



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

    if (sessionStorage.getItem("vieneDeFichaJuzgado")) this.vieneDeFichaJuzgado = sessionStorage.getItem("vieneDeFichaJuzgado");
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    if (sessionStorage.getItem("vieneDeFichaJuzgado")) sessionStorage.removeItem("vieneDeFichaJuzgado");
  }

  volverFichaJuzgado() {
    this.router.navigate(["gestionJuzgados"]);
  }

  // busquedaReceive(event) {
  //   this.searchAreas();
  // }


  searchModulos(event) {
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;

    if (this.vieneDeFichaJuzgado) {
      this.filtrosJuzgado.modulo = this.filtros.filtroAux;
      this.filtrosJuzgado.modulo.historico = event;
      this.filtrosJuzgado.idJuzgado = this.persistenceService.getIdJuzgado();
      this.filtrosJuzgado.historicoJuzgado = this.persistenceService.getHistoricoJuzgado();
      this.sigaServices.post("modulosYBasesDeCompensacion_searchModulosJuzgados", this.filtrosJuzgado).subscribe(
        n => {
          this.datos = JSON.parse(n.body).modulosItem;
          this.buscar = true
          if (this.datos != undefined)
            this.datos.forEach(element => {
              element.precio = element.importe.replace(".", ",");
              if (element.precio[0] == '.' || element.precio[0] == ',')
                element.precio = "0".concat(element.precio)
            });

          if (this.tabla != null && this.tabla != undefined) {
            this.tabla.historico = event;
            this.tabla.tabla.sortOrder = 0;
            this.tabla.tabla.sortField = '';
            this.tabla.tabla.reset();
            this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
          }
          this.progressSpinner = false;
          this.resetSelect();
        },
        err => {
          this.progressSpinner = false;
          //console.log(err);
        });
    } else {
      this.sigaServices.post("modulosYBasesDeCompensacion_searchModulos", this.filtros.filtroAux).subscribe(
        n => {
          this.datos = JSON.parse(n.body).modulosItem;
          this.buscar = true
          if (this.datos != undefined)
            this.datos.forEach(element => {
              element.precio = element.importe.replace(".", ",");
              if (element.precio[0] == '.' || element.precio[0] == ',')
                element.precio = "0".concat(element.precio)
            });

          if (this.tabla != null && this.tabla != undefined) {
            this.tabla.historico = event;
            this.tabla.tabla.sortOrder = 0;
            this.tabla.tabla.sortField = '';
            this.tabla.tabla.reset();
            this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
          }
          this.progressSpinner = false;
          this.resetSelect();
        },
        err => {
          this.progressSpinner = false;
          //console.log(err);
        });
    }


  }


  resetSelect() {
    if (this.tabla != undefined) {
      this.tabla.selectedDatos = [];
      this.tabla.numSelected = 0;
      this.tabla.selectMultiple = false;
      this.tabla.selectAll = false;
    }
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
