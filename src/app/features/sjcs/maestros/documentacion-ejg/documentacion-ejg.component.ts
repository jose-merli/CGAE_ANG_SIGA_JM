import { Component, OnInit, HostBinding, ViewChild, AfterViewInit, Output, EventEmitter, ContentChildren, QueryList } from '@angular/core';
import { FiltrosdocumentacionejgComponent } from './filtro-busqueda-ejg/filtros-documentacionejg.component';
import { TablaDocumentacionejgComponent } from './tabla-documentacionejg/tabla-documentacionejg.component';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
// import { FiltrosModulosComponent } from './tabla-busqueda-modulos/tabla-busqueda-modulos.component';
import { PersistenceService } from '../../../../_services/persistence.service';
import { procesos_maestros } from '../../../../permisos/procesos_maestros';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documentacion-ejg',
  templateUrl: './documentacion-ejg.component.html',
  styleUrls: ['./documentacion-ejg.component.scss'],

})
export class DocumentacionEJGComponent implements OnInit, AfterViewInit {

  buscar: boolean = false;
  historico: boolean = false;
  messageShow: string;

  datos;
  progressSpinner: boolean = false;
  //Mediante esta sentencia el padre puede acceder a los datos y atributos del hijo
  /*a particularidad de éste método es que tenemos que esperar a que la vista esté totalmente 
  cargada para acceder a los atributos del hijo. Para ello creamos un método de Angular llamado
   ngAfterViewInit() en el que simplemente inicializamos la variable con el valor del atributo del hijo 
   el hijo lo declaramos como @ViewChild(ChildComponent)).*/

  @ViewChild(FiltrosdocumentacionejgComponent) filtros;
  @ViewChild(TablaDocumentacionejgComponent) tabla;


  msgs;
  permisoEscritura: any;



  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private router: Router) { }


  ngOnInit() {
    this.buscar = this.filtros.buscar

    this.commonsService.checkAcceso(procesos_maestros.documentacionEjg)
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
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux();
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);

    this.progressSpinner = true;

    this.sigaServices.post("busquedaDocumentacionEjg_searchDocumento", this.filtros.filtroAux).subscribe(
      n => {
        this.datos = JSON.parse(n.body).documentacionejgItems;
        this.buscar = true;

        if (this.tabla != null && this.tabla != undefined) {
          this.tabla.historico = event;
          this.tabla.table.sortOrder = 0;
          this.tabla.table.sortField = '';
          this.tabla.table.reset();
          this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
        }
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    );
    /*
        this.sigaServices.post("maestros/busquedaDocumentacionEjg/searchTipoDocumento", this.filtros.filtros).subscribe(
          n => {
            this.datos = JSON.parse(n.body).modulosItem;
            this.buscar = true;
            this.progressSpinner = false;
          },
          err => {
            this.progressSpinner = false;
            //console.log(err);
          }
        );
    */
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
