import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { TranslateService } from '../../../../commons/translate';
import { procesos_guardia } from '../../../../permisos/procesos_guarida';
import { SigaStorageService } from '../../../../siga-storage.service';
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
      
      this.isColegiado = this.localStorageService.isLetrado;

      if(this.isColegiado == undefined){
          this.commonsService.getLetrado()
          .then(respuesta => {
            this.isColegiado = respuesta;
            
          });
        setTimeout(() => {
          //esperando isLetrado
          console.log("Se ha refrescado la pantalla");
        }, 500);
      }
      
      this.progressSpinner = false;
      //this.dataBuscador = JSON.parse(sessionStorage.getItem("itemGuardiaColegiado"));
      if(sessionStorage.getItem("ProcedenciaGuardiasColegiado")==null){
        this.dataBuscador = JSON.parse(sessionStorage.getItem("itemGuardiaColegiado"));
        sessionStorage.removeItem("itemGuardiaColegiado");
        //this.filtros.filtros = this.dataBuscador;
      }else{
        this.dataBuscador = JSON.parse(sessionStorage.getItem("filtros"));
      }
      
  }

  isOpenReceive(event) {
    
      this.search(event);
  }


  search(event){
    if(this.checkFilters()){
      this.progressSpinner = true;
      let guardiaItem = Object.assign({},this.filtros.filtros);
      if(this.filtros.filtros.idTurno  && this.filtros.filtros.idTurno.length > 0){
        guardiaItem.idTurno = this.filtros.filtros.idTurno.toString();
      }else{
        guardiaItem.idTurno = "";
      }
      if(this.filtros.filtros.idGuardia && this.filtros.filtros.idGuardia.length > 0){
        guardiaItem.idGuardia = this.filtros.filtros.idGuardia.toString();
      }else{
        guardiaItem.idGuardia = "";
      }
      this.persistenceService.setFiltros(this.filtros.filtros)
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
          //console.log(err);
        },
        () => {
          setTimeout(()=>{this.commonsService.scrollTablaFoco('tablaGuardCole');}, 5);
        });
    }
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

  checkFilters(){
    if (//(this.filtros.filtros.idTurno != null && this.filtros.filtros.idTurno != undefined && this.filtros.filtros.idTurno.length != 0) ||
        //(this.filtros.filtros.idGuardia != null && this.filtros.filtros.idGuardia != undefined && this.filtros.filtros.idGuardia.length != 0) ||
        (this.filtros.filtros.fechadesde != null && this.filtros.filtros.fechadesde != undefined && this.filtros.filtros.fechadesde != "" ) || 
        (this.filtros.filtros.fechahasta != null && this.filtros.filtros.fechahasta != undefined && this.filtros.filtros.fechahasta != "" ) //||
        //(this.filtros.filtros.validada != null && this.filtros.filtros.validada != undefined && this.filtros.filtros.validada.length != 0)
        ){
          return true;
      } else {   
        this.showMsg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("scs.busqueda.error.guardiasColegiado"));
        return false;
      }
    }

    showMsg(severityParam : string, summaryParam : string, detailParam : string) {
      this.msgs = [];
      this.msgs.push({
        severity: severityParam,
        summary: summaryParam,
        detail: detailParam
      });
    }

}
