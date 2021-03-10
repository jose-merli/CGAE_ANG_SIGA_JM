import { Component, OnInit, HostBinding, ViewChild, AfterViewInit, Output, EventEmitter, ContentChildren, QueryList, ChangeDetectorRef, SimpleChanges, Input } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { Router } from '@angular/router';
// import { FiltrosTurnos } from './filtros-turnos/filtros-turnos.component';
// import { TablaTurnosComponent } from './gestion-turnos/gestion-turnos.component';
import { procesos_oficio } from '../../../../permisos/procesos_oficio';
import { FiltrosBajasTemporales } from './filtros-inscripciones/filtros-bajas-temporales.component';
import { TablaBajasTemporalesComponent } from './gestion-bajas-temporales/gestion-bajas-temporales.component';

@Component({
  selector: 'app-bajas-temporales',
  templateUrl: './busqueda-bajas-temporales.component.html',
  styleUrls: ['./busqueda-bajas-temporales.component.scss'],

})
export class BajasTemporalesComponent implements OnInit {
  buscar: boolean = false;
  messageShow: string;

  datos;
  progressSpinner: boolean = false;
  //Mediante esta sentencia el padre puede acceder a los datos y atributos del hijo
  /*a particularidad de éste método es que tenemos que esperar a que la vista esté totalmente 
  cargada para acceder a los atributos del hijo. Para ello creamos un método de Angular llamado
   ngAfterViewInit() en el que simplemente inicializamos la variable con el valor del atributo del hijo 
   el hijo lo declaramos como @ViewChild(ChildComponent)).*/

  @ViewChild(FiltrosBajasTemporales) filtros;
  @ViewChild(TablaBajasTemporalesComponent) tablapartida;
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
    this.sigaServices.post("bajasTemporales_busquedaBajasTemporales", this.filtros.filtroAux).subscribe(
      n => {
        this.datos = JSON.parse(n.body).bajasTemporalesItem;
        this.datos.forEach(element => {
          if(element.tipo == "V"){
            element.tiponombre = "Vacaciones";
          }
          if(element.tipo == "M"){
            element.tiponombre = "Maternidad";
          }
          if(element.tipo == "B"){
            element.tiponombre = "Baja";
          }
          if(element.tipo == "S"){
            element.tiponombre = "Suspensión por sanción";
          }
          element.ncolegiado = +element.ncolegiado;

        });
        this.buscar = true;
        this.progressSpinner = false;
        if (this.tablapartida != undefined) {
          this.tablapartida.tabla.sortOrder = 0;
          this.tablapartida.tabla.sortField = '';
          this.tablapartida.tabla.reset();
          this.tablapartida.buscadores = this.tablapartida.buscadores.map(it => it = "");
        }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }, () => {
        setTimeout(()=>{
          this.commonsService.scrollTablaFoco('tablaFoco');
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
