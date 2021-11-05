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
import { Location } from '@angular/common';
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
  progressSpinner: boolean;
  buscar: boolean = false;
  permisoEscritura:boolean;
  dataBuscador = { 
    'guardia': '',
    'turno': '',
    'fechaDesde': '',
    'fechaHasta': ''
}
  isColegiado: boolean;

  constructor(private persistenceService: PersistenceService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    private location: Location,
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
      
      if(this.localStorageService.isLetrado
          && this.localStorageService.idPersona){
          
          this.isColegiado = true;

      }
      
      this.progressSpinner = false;
      this.dataBuscador = JSON.parse(sessionStorage.getItem("itemGuardiaColegiado"));
  }

  isOpenReceive(event) {
    
      this.search(event);
  }


  search(event){
    this.progressSpinner = true;
    let guardiaItem = Object.assign({},this.filtros.filtros);
    if(this.filtros.filtros.idTurno != "" && this.filtros.filtros.idTurno != undefined){
      guardiaItem.idTurno = this.filtros.filtros.idTurno.toString();
    }
    if(this.filtros.filtros.idGuardia != "" && this.filtros.filtros.idGuardia != undefined){
      guardiaItem.idGuardia = this.filtros.filtros.idGuardia.toString();
    }
    this.sigaServices.post("guardiasColegiado_buscarGuardiasColegiado", guardiaItem).subscribe(
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
        setTimeout(()=>{this.commonsService.scrollTablaFoco('tablaGuardCole');}, 5);
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

  backTo() {
    let datosFichaProgramacion = this.persistenceService.getDatos();
    this.persistenceService.setDatos(datosFichaProgramacion);
    sessionStorage.removeItem("itemGuardiaColegiado");
    this.location.back();
  }

}
