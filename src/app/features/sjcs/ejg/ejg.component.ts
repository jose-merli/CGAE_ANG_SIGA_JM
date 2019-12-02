import { Component, OnInit, ViewChild } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'
import { TranslateService } from '../../../commons/translate';
import { SigaServices } from '../../../_services/siga.service';
import { CommonsService } from '../../../_services/commons.service';
import { PersistenceService } from '../../../_services/persistence.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { TablaEjgComponent } from './tabla-ejg/tabla-ejg.component';
import { FiltrosEjgComponent } from './filtros-busqueda-ejg/filtros-ejg.component';


@Component({
  selector: 'app-ejg',
  templateUrl: './ejg.component.html',
  styleUrls: ['./ejg.component.scss'],

})
export class EJGComponent implements OnInit {

  url;
  historico: boolean = false;
  progressSpinner: boolean = false;
  permisoEscritura: any;
  buscar: boolean = false;
  datos;
  msgs;
  institucionActual;

  //Mediante esta sentencia el padre puede acceder a los datos y atributos del hijo
  // la particularidad de éste método es que tenemos que esperar a que la vista esté totalmente 
  // cargada para acceder a los atributos del hijo. Para ello creamos un método de Angular llamado
  //  ngAfterViewInit() en el que simplemente inicializamos la variable con el valor del atributo del hijo 
  //  el hijo lo declaramos como @ViewChild(ChildComponent)).

  @ViewChild(FiltrosEjgComponent) filtros;
  @ViewChild(TablaEjgComponent) tabla;

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private router: Router) { }

  ngOnInit() {
    this.buscar = this.filtros.buscar

    this.commonsService.checkAcceso("946")
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

  searchEJGs(event) {
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux();
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);

    this.progressSpinner = true;

    this.sigaServices.post("filtrosejg_busquedaEJG", this.filtros.filtroAux).subscribe(
      n => {
        this.datos = JSON.parse(n.body).ejgItems;
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




