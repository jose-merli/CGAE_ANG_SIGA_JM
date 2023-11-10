import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { GuardiaItem } from '../../../../../models/guardia/GuardiaItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { FiltrosGuardiaColegiadoComponent } from '../filtros-guardia-colegiado/filtros-guardia-colegiado.component';
import { select } from '@syncfusion/ej2-base';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tabla-guardia-colegiado',
  templateUrl: './tabla-guardia-colegiado.component.html',
  styleUrls: ['./tabla-guardia-colegiado.component.scss']
})
export class TablaGuardiaColegiadoComponent implements OnInit {

  @Input() datos;
  @Input() permisoEscritura:boolean;
  @Input() isColegiado:boolean;
  @Output() isOpen = new EventEmitter<boolean>();

  @ViewChild("tablaGuardCol") table: DataTable;
  @ViewChild(FiltrosGuardiaColegiadoComponent)filtros;
  
  initDatos: any;
  cols: any;
  buscadores = [];
  rowsPerPage: any = [];
  selectMultiple: boolean;
  selectedDatos;
  selectAll;
  numSelected: number = 0;
  selectedItem: number = 10;
  fechaValidacion: Date;
  msgs: { severity: string; summary: string; detail: string; }[];
  progressSpinner: boolean;
  permisos: any;
  validar:boolean = false;
  desvalidar: boolean = false;
  borrar: boolean = false;

  constructor(private translateService: TranslateService,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.isColegiado = this.isColegiado;
    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
    this.datos.forEach((guardia)=>{
      if(guardia.validada == '1'){
        guardia.validada = true;
      }else{
        guardia.validada = false;
      }
      if(guardia.facturado==1){
        guardia.estadoGuardia=guardia.estadoGuardia.split('*');
      }
    });
    console.log(this.datos);
  }

  isSelectMultiple() {
    if (this.permisoEscritura) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    }
  }


  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
  getCols() {
    this.cols = [
      { field: "fechadesde", header: "facturacion.seriesFacturacion.literal.fInicio" },
      { field: "fechahasta", header: "censo.consultaDatos.literal.fechaFin" },
      { field: "tipoTurno", header: "dato.jgr.guardia.guardias.turno" },
      { field: "tipoGuardia", header: "menu.justiciaGratuita.GuardiaMenu" },
      { field: "tipoDiasGuardia", header: "dato.jgr.guardia.guardias.tipoDia" },
      { field: "letradosGuardia", header: "justiciaGratuita.justiciables.literal.colegiado" },
      { field: "numColegiado", header: "facturacionSJCS.facturacionesYPagos.nColegiado" },
      { field: "ordenGrupo", header: "administracion.informes.literal.orden" },
      { field: "validada", header: "dato.jgr.guardia.inscripciones.validada" },
      { field: "estadoGuardia", header: "dato.jgr.guardia.inscripciones.estado" },

    ];
    this.cols.forEach(it => this.buscadores.push(""))
    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
  }

  fillFechaValidacion(event){
    this.fechaValidacion = event;
  }

  rowSelected(selectedDatos){
    this.borrar = true;
    this.validar = true;
    this.desvalidar = true;
    let fechaActual = new Date();

    if (selectedDatos.length > 0){
      for (var guardia of selectedDatos) {
      
        if(guardia.fechaValidacion == null && guardia.validada!=1){
          this.desvalidar = false;
        }else{
          this.validar = false;
        }
        
        if(this.borrar && guardia.fechadesde < fechaActual){
          this.borrar = false;
        }
  
        if (!this.borrar && !this.validar && !this.desvalidar){
          break;
        }
      }
    } else {
      this.borrar = false;
      this.validar = false;
      this.desvalidar = false;
    }
    
  }

  resetBoton(){
    this.validar = false;
    this.desvalidar = false;
    this.borrar = false;
  }

  confirmValidar(selectedDatos) {
      /* let mess = this.translateService.instant(
        "messages.deleteConfirmation"
      ); */
      let mess = "¿Seguro que desea validar esta Guardia?"
      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          this.validarGuardia(selectedDatos);
        },
        reject: () => {
          this.msgs = [
            {
              severity: "info",
              summary: "Cancel",
              detail: this.translateService.instant(
                "general.message.accion.cancelada"
              )
            }
          ];
        }
      });
    
  }

  validarGuardia(selectedDatos){
    let callList:Observable<any>[] = []
    selectedDatos.forEach(guardia => {
      if(guardia.fechaValidacion == null || guardia.fechaValidacion == undefined){
        let guardiaAux = new GuardiaItem();
        guardiaAux.idTurno = guardia.idTurno;
        guardiaAux.idGuardia = guardia.idGuardia;
        guardiaAux.idPersona = guardia.idPersona;
        guardiaAux.fechadesde = guardia.fechadesde;
        if(this.fechaValidacion != null || this.fechaValidacion != undefined){
          guardiaAux.fechaValidacion = this.fechaValidacion
        }else{
          guardiaAux.fechaValidacion = new Date();
        }
        this.progressSpinner = true;
        callList = [...callList,  this.sigaServices.post("guardiasColegiado_validarSolicitudGuardia", guardiaAux) ]
      }else{
        this.showMessage({ severity: 'error', summary: this.translateService.instant("general.message.incorrect"), msg: "Guardia ya validada" });
      }
    });
    forkJoin(callList).subscribe(
      n => {
        let status = JSON.parse(n[0].body).status;

        if (status == 'OK') {
          this.validar = false;
          this.showMessage({ severity: "success", summary: this.translateService.instant("general.message.correct"), msg:this.translateService.instant("general.message.accion.realizada") });
        }else{
          this.showMessage({ severity: 'error', summary: this.translateService.instant("general.message.incorrect"), msg: "Error de base de datos" });
        }
        this.search();
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    )
    this.resetBoton();
  }

  confirmDesValidar(selectedDatos) {
      /* let mess = this.translateService.instant(
        "messages.deleteConfirmation"
      ); */
      let mess = "¿Seguro que desea desvalidar esta Guardia?"
      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          this.desvalidarGuardia(selectedDatos)
        },
        reject: () => {
          this.msgs = [
            {
              severity: "info",
              summary: "Cancel",
              detail: this.translateService.instant(
                "general.message.accion.cancelada"
              )
            }
          ];
        }
      });
    
  }

  desvalidarGuardia(selectedDatos){
    let callList:Observable<any>[] = []
    selectedDatos.forEach(guardia => {
      let guardiaAux = new GuardiaItem();
      guardiaAux=guardia;
      
      this.progressSpinner = true;
      callList = [...callList,  this.sigaServices.post("guardiasColegiado_desvalidarGuardiaColegiado", guardiaAux) ]
    })
    forkJoin(callList).subscribe(
      n => {
        let status = JSON.parse(n[0].body).status;

        if (status == 'OK') {
          this.desvalidar = false;
          this.showMessage({ severity: "success", summary: this.translateService.instant("general.message.correct"), msg:this.translateService.instant("general.message.accion.realizada") });
        }else{
          this.showMessage({ severity: 'error', summary: this.translateService.instant("general.message.incorrect"), msg: "Error de base de datos" });
        }
        this.search();
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    )
    this.resetBoton();
  }

  confirmDelete(selectedDatos) {
      let mess = this.translateService.instant(
        "messages.deleteConfirmation"
      );
      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          this.borrarGuardiaColegiado(selectedDatos)
        },
        reject: () => {
          this.msgs = [
            {
              severity: "info",
              summary: "Cancel",
              detail: this.translateService.instant(
                "general.message.accion.cancelada"
              )
            }
          ];
        }
      });
    
  }

  borrarGuardiaColegiado(selectedDatos){
    let fechaActual = new Date();
    let callList:Observable<any>[] = []
    selectedDatos.forEach(guardia => {
      if(guardia.fechadesde >= fechaActual){
        let guardiaAux = new GuardiaItem();
        guardiaAux=guardia;
        
        this.progressSpinner = true;
        callList = [...callList,  this.sigaServices.post("guardiasColegiado_eliminarGuardiaColegiado", guardiaAux) ]
      }else{
          this.showMessage({ severity: 'error', summary: this.translateService.instant("general.message.incorrect"), msg: "No se puede eliminar una guardia anterior a la fecha actual." });
      }
    })
    forkJoin(callList).subscribe(
      n => {
        let status = JSON.parse(n[0].body).status;

        if (status == 'OK') {
          this.borrar = false;
          this.showMessage({ severity: "success", summary: this.translateService.instant("general.message.correct"), msg:this.translateService.instant("general.message.accion.realizada") });
        }else{
          this.showMessage({ severity: 'error', summary: this.translateService.instant("general.message.incorrect"), msg: "Error de base de datos" });
        }
        this.search();
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    )
    this.resetBoton();
    
  }

  search(){
    this.isOpen.emit(false);
  }
  
  openTab(evento) {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    if (!this.selectAll && !this.selectMultiple) {
      this.progressSpinner = true;
      let guardia = new GuardiaItem()
      guardia = evento;
      this.persistenceService.setDatosColeg(guardia);
      sessionStorage.setItem("infoGuardiaColeg",JSON.stringify(guardia));
      sessionStorage.setItem("originGuardiaColeg","true");
      this.router.navigate(['/gestionGuardiaColegiado']);
    
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
