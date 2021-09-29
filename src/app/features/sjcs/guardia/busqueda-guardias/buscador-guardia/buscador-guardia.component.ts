import { Component, OnInit, ViewChild } from '@angular/core';
import { FiltrosGuardiaComponent } from './filtros-guardia/filtros-guardia.component';
import { TablaGuardiasComponent } from './tabla-guardias/tabla-guardias.component';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { procesos_guardia } from '../../../../../permisos/procesos_guarida';
import { Router } from '../../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-buscador-guardia',
  templateUrl: './buscador-guardia.component.html',
  styleUrls: ['./buscador-guardia.component.scss']
})
export class BuscadorGuardiaComponent implements OnInit {

  buscar: boolean = false;
  historico: boolean = false;

  datos;
  msgs;
  permisoEscritura
  progressSpinner: boolean = false;

  @ViewChild(FiltrosGuardiaComponent) filtros;
  @ViewChild(TablaGuardiasComponent) tabla;

  constructor(private persistenceService: PersistenceService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router) { }

  ngOnInit() {
    this.commonsService.checkAcceso(procesos_guardia.guardias)
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


  isOpenReceive(event) {
    if (this.persistenceService.getFiltros())
      this.search(event);
  }

  search(event) {
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.sigaServices.post("busquedaGuardias_searchGuardias", this.filtros.filtroAux).subscribe(
      n => {

        this.datos = JSON.parse(n.body).guardiaItems;
        this.buscar = true;
        this.datos = this.datos.map(it => {
          it.letradosIns = +it.letradosIns;
          return it;
        })
        this.progressSpinner = false;
        if (this.tabla != null && this.tabla != undefined) {
          this.tabla.historico = event;
        }
        this.resetSelect();
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      },
      ()=>{
        this.commonsService.scrollTablaFoco('tablaFoco');
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
