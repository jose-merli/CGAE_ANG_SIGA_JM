import { DatePipe } from '@angular/common';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cell, Row, TablaResultadoMixIncompService } from '../../../../commons/tabla-resultado-mix/tabla-resultado-mix-incompatib.service';
import { TranslateService } from '../../../../commons/translate';
import { CalendarioProgramadoItem } from '../../../../models/guardia/CalendarioProgramadoItem';
import { GuardiaItem } from '../../../../models/guardia/GuardiaItem';
import { procesos_guardia } from '../../../../permisos/procesos_guarida';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { CommonsService } from '../../../../_services/commons.service';
import { OldSigaServices } from '../../../../_services/oldSiga.service'
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { ComboIncompatibilidadesDatosEntradaItem } from '../guardias-incompatibilidades/buscador-guardia-incompatibilidades/ComboIncompatibilidadesDatosEntradaItem';
import { ComboIncompatibilidadesRes } from '../guardias-incompatibilidades/buscador-guardia-incompatibilidades/ComboIncompatibilidadesRes';
import { DeleteIncompatibilidadesDatosEntradaItem } from '../guardias-incompatibilidades/buscador-guardia-incompatibilidades/DeleteIncompatibilidadesDatosEntradaItem';
import { IncompatibilidadesDatosEntradaItem } from '../guardias-incompatibilidades/buscador-guardia-incompatibilidades/IncompatibilidadesDatosEntradaItem.model';
import { ResultadoIncompatibilidades } from '../guardias-incompatibilidades/buscador-guardia-incompatibilidades/ResultadoIncompatibilidades.model';
import { SaveIncompatibilidadesDatosEntradaItem } from '../guardias-incompatibilidades/buscador-guardia-incompatibilidades/SaveIncompatibilidadesDatosEntradaItem.model copy';
import { CalendariosDatosEntradaItem } from './CalendariosDatosEntradaItem.model';
import { FiltrosGuardiaCalendarioComponent } from './filtros-guardia-calendarios/filtros-guardia-calendarios.component';
import { saveAs } from "file-saver/FileSaver";
import { forEach } from '@angular/router/src/utils/collection';
import { ControlAccesoDto } from '../../../../models/ControlAccesoDto';

@Component({
  selector: 'app-programacionCalendarios',
  templateUrl: './programacionCalendarios.component.html',
  styleUrls: ['./programacionCalendarios.component.scss'],

})
export class ProgramacionCalendariosComponent implements OnInit {

  buscar: Boolean;
  historico: boolean = false;
  filtrosValues = new CalendarioProgramadoItem();
  url;
  datos;
  msgs;
  permisoEscritura
  progressSpinner: boolean = false;
  deleteIncompatibilidadesDatosEntradaItem: DeleteIncompatibilidadesDatosEntradaItem;
  saveIncompatibilidadesDatosEntradaItem: SaveIncompatibilidadesDatosEntradaItem;
  respuestaCalendario : CalendariosDatosEntradaItem[] = [];
  idGuardia;
  comboGuardiasIncompatibles: GuardiaItem[] = [];
  rowGroups: Row[];
  rowGroupsAux: Row[];
  totalRegistros = 0;
  allSelected = false;
  isDisabled = true;
  seleccionarTodo = false;
  comboIncompatibilidadesDatosEntradaItem: ComboIncompatibilidadesDatosEntradaItem;
  comboIncompatibilidadesRes: ComboIncompatibilidadesRes;
  dataToDuplicate;
  permisoTotal = true;
  cabeceras = [
    {
      id: "turno",
      name: "dato.jgr.guardia.guardias.turno",
      size: 250
    },
    {
      id: "guardia",
      name: "oficio.cargasMasivas.guardia",
      size: 250
    },
    {
      id: "fechaCalDesde",
      name: "justiciaGratuita.Calendarios.FechaDesde",
      size: 140
    },
    {
      id: "fechaCalHasta",
      name: "justiciaGratuita.Calendarios.FechaHasta",
      size: 140
    },
    {
      id: "fechaProgramada",
      name: "justiciaGratuita.Calendarios.FechaProgramada",
      size: 140
    },
    {
      id: "listaGuardias",
      name: "menu.justiciaGratuita.calendarios.ListaGuardias",
      size: 250
    },
    {
      id: "observaciones",
      name: "justiciaGratuita.Calendarios.Observaciones",
      size: 250
    },
    {
      id: "estado",
      name: "menu.justiciaGratuita.calendarios.Estado",
      size: 140
    },
    {
      id: "generado",
      name: "justiciaGratuita.Calendarios.Generado",
      size: 140
    },
    {
      id: "numGuardias",
      name: "justiciaGratuita.Calendarios.NumGuardias",
      size: 140
    }
  ];

  comboEstados = [
    { label: "Pendiente", value: "5" },
    { label: "Programada", value: "1" },
    { label: "En proceso", value: "2" },
    { label: "Procesada con Errores", value: "3" },
    { label: "Generada", value: "4" }
  ];
  @ViewChild(FiltrosGuardiaCalendarioComponent) filtros;
  //@ViewChild(TablaGuardiasComponent) tabla;

  constructor(private persistenceService: PersistenceService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    public oldSigaServices: OldSigaServices,
    private trmService: TablaResultadoMixIncompService,
    private authenticationService: AuthenticationService,
    private datepipe: DatePipe) {
    this.url = oldSigaServices.getOldSigaUrl("guardiasIncompatibilidades");
    }

    ngOnInit() {

      this.checkAcceso();
      
      if (this.persistenceService.getDatos() != undefined && this.persistenceService.getDatos().duplicar) {
        console.log('¿duplicar?: ', this.persistenceService.getDatos().duplicar)
        this.dataToDuplicate = this.persistenceService.getDatos();
        console.log('DATA TO DUPLICATE 2', this.dataToDuplicate)
        this.rowGroups = this.dataToDuplicate.tabla;
        
        let objCells: Cell[] = [
          { type: 'text', value: this.dataToDuplicate.turno, combo: null, size: 250 , disabled: false},
          { type: 'text', value: this.dataToDuplicate.nombre, combo: null, size: 250 , disabled: false},
          { type: 'date', value: this.dataToDuplicate.fechaDesde, combo: null, size: 140, disabled: false},
          { type: 'date', value: this.dataToDuplicate.fechaHasta , combo: null, size: 140, disabled: false},
          { type: 'dateTime', value: this.dataToDuplicate.fechaProgramacion , combo: null, size: 140, disabled: false},
          { type: 'label', value: this.dataToDuplicate.listaGuarias, combo: null, size: 250, disabled: false},
          { type: 'link', value: this.dataToDuplicate.observaciones , combo: null, size: 250, disabled: false},
          { type: 'text', value: this.dataToDuplicate.estado , combo: null, size: 140, disabled: false},
          { type: 'text', value: this.dataToDuplicate.generado, combo: null , size: 140 , disabled: false},
          { type: 'text', value: this.dataToDuplicate.numGuardias, combo: null, size: 140 , disabled: false},
          { type: 'invisible', value: this.dataToDuplicate.idCalendarioProgramado, combo: null, size: 0, disabled: false},
          { type: 'invisible', value: this.dataToDuplicate.idTurno, combo: null, size: 0, disabled: false},
          { type: 'invisible', value: this.dataToDuplicate.idGuardia, combo: null, size: 0, disabled: false}          
          ];
      
          let obj: Row = {id: this.rowGroups.length, cells: objCells};
          this.rowGroups.push(obj);
          console.log('this.rowGroups: ', this.rowGroups)
        this.buscar = true;
      }
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
    }

    if(sessionStorage.getItem("originGuarCole") == "true"){
      if (sessionStorage.getItem("datosCalendarioGuardiaColeg") == null || sessionStorage.getItem("datosCalendarioGuardiaColeg") == undefined) {
        this.datos = JSON.parse(sessionStorage.getItem("datosCalendarioGuardiaColeg"));
        sessionStorage.removeItem("datosCalendarioGuardiaColeg");
      }
      sessionStorage.removeItem("originGuarCole");
    }
    

  }

  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "997";
    let derechoAcceso;
    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisosTree = JSON.parse(data.body);
        let permisosArray = permisosTree.permisoItems;
        derechoAcceso = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        if (derechoAcceso == 3) {
          //permiso total
          this.permisoTotal = true;
        } else if (derechoAcceso == 2) {
          // solo lectura
          this.permisoTotal = false;
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
    );
  }

  getStatusValue(id){
    let status;
    this.comboEstados.forEach(estado => {
      if (estado.value != null && id != null){
        if ( estado.value.toString() == id.toString()){
          status = estado.label;
        }
      }
    })
    return status;
  }
  getFiltrosValues(event){
    this.filtrosValues = event;
    this.convertArraysToStrings();
    this.buscarCal();
    
    
  }

  selectedAll(event) {
    this.seleccionarTodo = event;
    this.isDisabled = !event;
  }
  notifyAnySelected(event) {
    if (this.seleccionarTodo || event) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }




buscarCal(){
  this.progressSpinner = true;
  this.buscar = false;
  console.log('filtrosValues: ', this.filtrosValues)
//let jsonEntrada  = JSON.parse(JSON.stringify(datosEntrada))
let datosEntrada = 
    { 'idTurno': this.filtrosValues.idTurno,
      'idConjuntoGuardia': this.filtrosValues.listaGuardias,
     'idGuardia': this.filtrosValues.idGuardia,
     'estado': this.filtrosValues.estado,
      'fechaCalendarioDesde': this.filtrosValues.fechaCalendarioDesde,
      'fechaCalendarioHasta': this.filtrosValues.fechaCalendarioHasta,
      'fechaProgramadaDesde': this.filtrosValues.fechaProgramadaDesde,
      'fechaProgramadaHasta': this.filtrosValues.fechaProgramadaHasta,
    };

    this.sigaServices.post(
      "guardiaCalendario_buscar", datosEntrada).subscribe(
        data => {
          console.log('data: ', data.body)
          let error = JSON.parse(data.body).error;
          this.datos = JSON.parse(data.body);
          console.log(' this.datos: ',  this.datos)
   console.log('this.datos', this.datos)
          this.respuestaCalendario = [];
         // this.comboGuardiasIncompatibles = [];
          this.datos.forEach((dat, i) => {
            let responseObject = new CalendariosDatosEntradaItem(
              {

                'turno': dat.turno,
                'guardia': dat.guardia,
                'idTurno': dat.idTurno,
                'idGuardia': dat.idGuardia,
                'observaciones': dat.observaciones,
                'fechaDesde': dat.fechaDesde,
                'fechaHasta': dat.fechaHasta,
                'fechaProgramacion': dat.fechaProgramacion,
                'estado': dat.estado,
                'generado': dat.generado,
                'numGuardias': dat.numGuardias,
                'idCalG': dat.idCalG,
                'listaGuardias': dat.listaGuardias,
                'idCalendarioProgramado': dat.idCalendarioProgramado,
                'facturado': dat.facturado,
                'asistenciasAsociadas': dat.asistenciasAsociadas
              }
             
            );
           
            /*let objCombo: GuardiaI = {label: dat.nombreGuardiaIncompatible, value: dat.idGuardiaIncompatible};
            this.comboGuardiasIncompatibles.push(objCombo);*/
            this.respuestaCalendario.push(responseObject);
          });
          console.log('respuestaCalendario: ', this.respuestaCalendario)
          this.jsonToRow();
          this.progressSpinner = false;
          /*if (this.tabla != null && this.tabla != undefined) {
            this.tabla.historico = event;
          }*/
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
          setTimeout(()=>{this.commonsService.scrollTablaFoco('tablaFoco')},5);
        });
}
formatOfficial(fechaB){
  const dayB = fechaB.substr(0, 2) ;
  const monthB = fechaB.substr(3, 2);
  const yearB = fechaB.substr(6, 4);
  const hourB = fechaB.substr(11, 2);
  const minB = fechaB.substr(14, 2);
  const segB = fechaB.substr(17, 2);
  return yearB + "-" + monthB + "-" + dayB + "T" + hourB + ":" + minB + ":" + segB;
  //'1968-11-16T00:00:00'
}
jsonToRow(){
  this.buscar = false;
  let generado = '??????';
  let numGuardias = '??????';
  let arr = [];

  this.respuestaCalendario.forEach((res, i) => {
    let fP = {label: res.fechaProgramacion, value: new Date(this.formatOfficial(res.fechaProgramacion))};
    //let fP = {label: res.fechaProgramacion, value: res.fechaProgramacion};
    let objCells = [
    { type: 'text', value: res.turno, size: 250 },
    { type: 'text', value: res.guardia, size: 250  },
    { type: 'date', value: this.changeDateFormat(res.fechaDesde), size: 140 },
    { type: 'date', value: this.changeDateFormat(res.fechaHasta), size: 140 },
    { type: 'dateTime', value: fP, size: 140 },
    //{ type: 'text', value: new Date(res.fechaProgramacion.toString()) },
    { type: 'label', value: {label: res.listaGuardias, value: res.idCalG }, size: 250 },
    { type: 'link', value: res.observaciones, size: 250  },
    { type: 'text', value: this.getStatusValue(res.estado), size: 140 },
    { type: 'text', value: res.generado, size: 140 },
    { type: 'text', value: res.numGuardias, size: 140},
    { type: 'invisible', value: res.idCalendarioProgramado, size: 0},
    { type: 'invisible', value: res.idTurno, size: 0},
    { type: 'invisible', value: res.idGuardia, size: 0},
    { type: 'invisible', value: res.facturado, size: 0},
    { type: 'invisible', value: res.asistenciasAsociadas, size: 0},
    
    ];
console.log('res.fechaProgramacion: ', res.fechaProgramacion)
    let obj = {id: i, cells: objCells};
    arr.push(obj);
  })
  console.log('arr: ', arr)

   this.rowGroups = [];
  this.rowGroups = this.trmService.getTableData(arr);
  this.rowGroupsAux = [];
  this.rowGroupsAux = this.trmService.getTableData(arr);
  this.totalRegistros = this.rowGroups.length;
  console.log('rowGroups: ', this.rowGroups)
  this.buscar = true;
}

formatDate(date) {
  const pattern = 'yyyy-MM-dd HH:mm:ss-SS';
    return this.datepipe.transform(date, pattern);
  }
changeDateFormat(date1){
  let year = date1.substring(0, 4)
  let month = date1.substring(5,7)
  let day = date1.substring(8, 10)
  let date2 = day + '/' + month + '/' + year;
  return date2;
}

save(event){
  let idTurnoIncompatible;
  let idGuardiaIncompatible;
  let motivos;
  let diasSeparacionGuardias;
  let idGuardia;
  let idTurno;
  let nombreTurno;
  let nombreGuardia;
  let nombreTurnoIncompatible;
  let nombreGuardiaIncompatible;
  event.forEach((row, i) => {
    row.cells.forEach((c, index) => {
      if (index == 0){
        nombreTurno = c.value;
      }
      if (nombreGuardia == 1){
        motivos = c.value;
      }
      if (index == 3){
        motivos = c.value;
      }
      if (index == 4){
        diasSeparacionGuardias = c.value;
      }    
      if (index == 5){
        idTurnoIncompatible = c.value;
      }
      if (index == 6){
        idGuardiaIncompatible = c.value;
      }
      if (index == 7){
        idGuardia = c.value;
      }
      if (index == 8){
        idTurno = c.value;
      }
      if (index == 9){
        nombreTurnoIncompatible = c.value;
      }
      if (index == 10){
        nombreGuardiaIncompatible = c.value;
      }
    });
    this.guardarInc(nombreTurno, nombreGuardia, nombreTurnoIncompatible, nombreGuardiaIncompatible, idTurnoIncompatible, idGuardiaIncompatible, motivos, diasSeparacionGuardias, idGuardia, idTurno)
  });
  
   this.rowGroups = event;
   this.rowGroupsAux = event;
   this.totalRegistros = this.rowGroups.length;
  }

 /* deleteFromCombo(rowToDelete){

    let idTurnoIncompatible;
    let idGuardiaIncompatible;
    let idGuardia;
    let idTurno;
rowToDelete.cells.forEach((c, index) => {
      if (index == 5){
        idTurnoIncompatible = c.value;
      }
      if (index == 6){
        idGuardiaIncompatible = c.value;
      }
      if (index == 7){
        idGuardia = c.value;
      }
      if (index == 8){
        idTurno = c.value;
      }

    })

    this.eliminarInc(idTurnoIncompatible, idGuardiaIncompatible, idGuardia, idTurno)
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
  }*/

delete(indexToDelete){
  console.log('indexToDelete: ', indexToDelete)
  let idGuardia;
  let idTurno;
  let idCalendarioProgramado;
  let toDelete:Row[] = [];
  indexToDelete.forEach(index => {
    toDelete.push(this.rowGroups[index]);
    this.rowGroups.splice(index, 1); 
  })

  toDelete.forEach(row => {
    row.cells.forEach((c, index) => {
      if (index == 10){
        idCalendarioProgramado = c.value;
      }
      if (index == 12){
        idGuardia = c.value;
      }
      if (index == 11){
        idTurno = c.value;
      }
     /* if(c.type == "multiselect"){
        c.combo.forEach(comboValue => {
          comboValue.value
        })
      }*/
    })
    this.eliminarCal(idCalendarioProgramado, idGuardia, idTurno)
  })
  this.rowGroupsAux = this.rowGroups;
  this.totalRegistros = this.rowGroups.length;
  }



  eliminarCal(idCalendarioProgramado, idGuardia, idTurno){
    let idInstitucion = this.authenticationService.getInstitucionSession();
 let deleteParams = 
    { 'idTurno': idTurno,
      'idGuardia': idGuardia,
      'idCalendarioProgramado': idCalendarioProgramado,
      'idInstitucion': idInstitucion
    }
;  this.progressSpinner = true;
    this.sigaServices.post(
      "guardiaCalendario_eliminar", deleteParams).subscribe(
        data => {
          let error = JSON.parse(data.body).error;
          this.datos = JSON.parse(data.body).guardiaItems;
          if (this.datos != undefined){
            this.datos = this.datos.map(it => {
              it.letradosIns = +it.letradosIns;
              return it;
            })
          }
          this.progressSpinner = false;
          /*if (this.tabla != null && this.tabla != undefined) {
            this.tabla.historico = event;
          }*/
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
          setTimeout(()=>{this.commonsService.scrollTablaFoco('tablaFoco')},5);
        });
  
}

guardarInc(nombreTurno, nombreGuardia, nombreTurnoIncompatible, nombreGuardiaIncompatible, idTurnoIncompatible, idGuardiaIncompatible, motivos, diasSeparacionGuardias, idGuardia, idTurno){
  let idInstitucion = this.authenticationService.getInstitucionSession();
  this.saveIncompatibilidadesDatosEntradaItem = new SaveIncompatibilidadesDatosEntradaItem(
    { 'idTurno': idTurno,
      'idGuardia': idGuardia,
      'idTurnoIncompatible': idTurnoIncompatible,
      'idGuardiaIncompatible': idGuardiaIncompatible,
      'idInstitucion': idInstitucion, 
      'motivos': motivos,
      'diasSeparacionGuardias': diasSeparacionGuardias,
      'usuario': "1", //se setea en backend
      'nombreTurno' : nombreTurno,
      'nombreGuardia' : nombreGuardia,
      'nombreTurnoIncompatible' : nombreTurnoIncompatible,
      'nombreGuardiaIncompatible' : nombreGuardiaIncompatible
    }
  );
    this.sigaServices.post(
      "guardiasIncompatibilidades_guardarIncompatibilidades", this.saveIncompatibilidadesDatosEntradaItem).subscribe(
        data => {
          let error = JSON.parse(data.body).error;
          this.datos = JSON.parse(data.body).guardiaItems;
          this.datos = this.datos.map(it => {
            it.letradosIns = +it.letradosIns;
            return it;
          })
          this.progressSpinner = false;
          /*if (this.tabla != null && this.tabla != undefined) {
            this.tabla.historico = event;
          }*/
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
          setTimeout(()=>{this.commonsService.scrollTablaFoco('tablaFoco')},5);
        });

}
  isOpenReceive(event) {
    
    if (this.persistenceService.getFiltros())
      this.search(event);
  }

  search(event) {

    /*this.filtros.filtroAux = this.persistenceService.getFiltrosAux()

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
        this.commonsService.scrollTablaFoco('tablaFoco');
      });*/
  }

  resetSelect() {
   /* if (this.tabla) {
      this.tabla.selectedDatos = [];
      this.tabla.numSelected = 0;
      this.tabla.selectMultiple = false;
      this.tabla.selectAll = false;
      this.tabla.table.sortOrder = 0;
      this.tabla.table.sortField = '';
      this.tabla.table.reset();
      this.tabla.buscadores = this.tabla.buscadores.map(it => it = "")
    }*/
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
    if ( this.filtrosValues != undefined){
        array.forEach(element => {
          if (this.filtrosValues[element] != undefined && this.filtrosValues[element] != null && this.filtrosValues[element].length > 0) {
            let aux =  this.filtrosValues[element].toString();
            this.filtrosValues[element] = aux;
          }

          if (this.filtrosValues[element] != undefined && this.filtrosValues[element] != null && this.filtrosValues[element].length == 0) {
            delete this.filtrosValues[element];
          }

        });

      }
  }


  descargaLOG(eventArr){
    let noGenerado = false;
    let dataToZipArr = [];
    eventArr.forEach(event => {
   if (event.estado == 'Generada'){
        let estadoNumerico = "0";
        switch (event.estado) {
          case "Pendiente":
            estadoNumerico = "5";
            break;
          case "Programada":
            estadoNumerico = "1";
            break;
          case "En proceso":
            estadoNumerico = "2";
            break;
          case "Procesada con Errores":
            estadoNumerico = "3";
            break;
          case "Generada":
            estadoNumerico = "4";
            break;
          default:
            estadoNumerico = "0";
            break;
        }
        let dataToZip = {
          'turno': event.turno,
          'guardia': event.nombre,
          'idGuardia': event.idGuardia,
          'idTurno': event.idTurno,
          'observaciones': event.observaciones,
          'fechaDesde': event.fechaDesde,
          'fechaHasta': event.fechaHasta,
          'fechaProgramacion': event.fechaProgramacion,
          'estado': estadoNumerico,
          'generado': event.generado,
          'numGuardias': event.numGuardias,
          'idCalG': event.listaGuarias.value,
          'listaGuardias': event.listaGuarias.label,
          'idCalendarioProgramado': event.idCalendarioProgramado,
        };
        dataToZipArr.push(dataToZip);
        } else{
          noGenerado = true;
        }
      })
        if (noGenerado){
        this.showMessage({ severity: 'info', summary: 'No puede descargar el log porque no se ha comenzado la generación del calendario', msg: 'No puede descargar el log porque no se ha comenzado la generación del calendario' });
        
        } else{
        this.descargarZipLogGenerados(dataToZipArr);
          }
  }

  /*descargarZipLogGenerados(datos){
    this.sigaServices.post(
      "guardiaCalendario_zipLog",  datos).subscribe(
        data => {
          let blob = null;
          blob = new Blob([data], { type: "application/zip" });
          saveAs(blob, "GeneracionCalendariosLog_ZIP.zip");
        this.progressSpinner = false;
        }, err => {
          console.log(err);
        });
  }*/


  descargarZipLogGenerados(datos){
  let resHead ={
    'response' : null,
    'header': null    };
    this.progressSpinner = true;
    let descarga =  this.sigaServices.getDownloadFiles(
      "guardiaCalendario_zipLog", datos);
    descarga.subscribe(resp =>{
      this.progressSpinner = false;
        resHead.response = resp.body;
        resHead.header = resp.headers;
        let contentDispositionHeader = resHead.header.get('Content-Disposition');
        let fileName = contentDispositionHeader.split(';')[1].trim().split('=')[1];
        console.log('fileName: ', fileName)
        let blob = new Blob([resHead.response], { type: 'application/zip' });
        saveAs(blob, fileName);
        this.showMessage({ severity: 'success', summary: 'LOG descargado correctamente', msg: 'LOG descargado correctamente' });
      }, err => {
        this.progressSpinner = false;
        console.log(err);
        this.showMessage({ severity: 'error', summary: 'El LOG no pudo descargarse', msg: 'El LOG no pudo descargarse' });
      });
}
  formatDate2(date) {
    const pattern = 'dd/MM/yyyy';
      return this.datepipe.transform(date, pattern);
    }
  
}
