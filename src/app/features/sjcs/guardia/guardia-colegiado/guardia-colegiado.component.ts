import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../commons/translate';
import { ColegiadoItem } from '../../../../models/ColegiadoItem';
import { procesos_guardia } from '../../../../permisos/procesos_guarida';
import { SigaStorageService } from '../../../../siga-storage.service';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { FiltrosGuardiaColegiadoComponent } from './filtros-guardia-colegiado/filtros-guardia-colegiado.component';
import { TablaGuardiaColegiadoComponent } from './tabla-guardia-colegiado/tabla-guardia-colegiado.component';

@Component({
  selector: 'app-guardia-colegiado',
  templateUrl: './guardia-colegiado.component.html',
  styleUrls: ['./guardia-colegiado.component.scss']
})
export class GuardiaColegiadoComponent implements OnInit {
  @ViewChild(FiltrosGuardiaColegiadoComponent)filtros;
  @ViewChild(TablaGuardiaColegiadoComponent) tabla;

  datos;
  msgs;
  permisosEscritura:boolean = false;
  progressSpinner: boolean = false;
  buscar: boolean = false;
  permisoEscritura;
  isColegiado: boolean;

  constructor(private persistenceService: PersistenceService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    private localStorageService: SigaStorageService) { }

  ngOnInit() {



    this.progressSpinner = true;
    this.commonsService.checkAcceso(procesos_guardia.guardias_colegiado)
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
      this.isColegiado = JSON.parse(sessionStorage.getItem('esColegiado'));
      this.progressSpinner = false;

  }

  isOpenReceive(event) {
    
      this.search(event);
  }


  search(event){
    this.progressSpinner = true;
    this.sigaServices.post("guardiasColegiado_buscarGuardiasColegiado", this.filtros.filtros).subscribe(
      n => {
        let error = JSON.parse(n.body).error;
        this.datos = JSON.parse(n.body).guardiaItems;
        this.buscar = true;
       /*  this.datos = this.datos.map(it => {
          it.letradosIns = +it.letradosIns;
          return it;
        }) */
        this.progressSpinner = false;
        this.resetSelect();

        if (error != null && error.description != null) {
          this.showMessage({ severity: 'info', summary: this.translateService.instant("general.message.informacion"), msg: error.description });
        }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      },
      () => {
        this.commonsService.scrollTablaFoco('tablaGuardCole');
      });

  }

  resetSelect() {
    if (this.tabla) {
      this.tabla.selectedDatos = [];
      this.tabla.numSelected = 0;
      this.tabla.selectMultiple = false;
      this.tabla.selectAll = false;
      this.tabla.table.sortOrder = 0;
      this.tabla.table.sortField = '';
      this.tabla.table.reset();
      this.tabla.buscadores = this.tabla.buscadores.map(it => it = "")
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
