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
  totalRegistros;
  seleccionarTodo;
  cabeceras;
  rowGroupsAux;
  rowGroups;
  abogado = false;
  @ViewChild(FiltrosGuardiaComponent) filtros;
  @ViewChild(TablaGuardiasComponent) tabla;

  constructor(private persistenceService: PersistenceService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router) { }

  ngOnInit() {
    this.abogado = sessionStorage.getItem("permisoAbogado") === "true";
    console.log('this.abogado: ', this.abogado)
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

    if (sessionStorage.getItem("filtrosBusquedaGuardiasFichaGuardia") == null || sessionStorage.getItem("filtrosBusquedaGuardiasFichaGuardia") == undefined) {
      this.datos = {};
      this.buscar = false;
    }

  }


  isOpenReceive(event) {
    if (this.persistenceService.getFiltros())
      this.search(event);
  }

  search(event) {

    this.filtros.filtroAux = this.persistenceService.getFiltrosAux()

    this.convertArraysToStrings();

    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.sigaServices.post("busquedaGuardias_searchGuardias", this.filtros.filtroAux).subscribe(
      n => {
        let error = JSON.parse(n.body).error;
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

        if (error != null && error.description != null) {
          this.showMessage({ severity: 'info', summary: this.translateService.instant("general.message.informacion"), msg: error.description });
        }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      },
      () => {
        setTimeout(() => {
          this.commonsService.scrollTablaFoco('tablaFoco');
        }, 5);
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

  convertArraysToStrings() {

    const array = ['idTurno', 'jurisdiccion', 'grupoFacturacion', 'partidaPresupuestaria', 'tipoTurno', 'idTipoGuardia'];

    array.forEach(element => {
      if (this.filtros.filtroAux[element] != undefined && this.filtros.filtroAux[element] != null && this.filtros.filtroAux[element].length > 0) {
        let aux = this.filtros.filtroAux[element].toString();
        this.filtros.filtroAux[element] = aux;
      }

      if (this.filtros.filtroAux[element] != undefined && this.filtros.filtroAux[element] != null && this.filtros.filtroAux[element].length == 0) {
        delete this.filtros.filtroAux[element];
      }

    });

  }

  notifyAnySelected(event){

  }

  checkSelectedRow(event){

  }

}
