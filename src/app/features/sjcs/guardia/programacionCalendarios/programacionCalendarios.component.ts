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
  cabeceras = [
    {
      id: "turno",
      name: "dato.jgr.guardia.guardias.turno"
    },
    {
      id: "guardia",
      name: "dato.jgr.guardia.guardias.guardia"
    },
    {
      id: "fechaCalDesde",
      name: "justiciaGratuita.Calendarios.FechaDesde"
    },
    {
      id: "fechaCalHasta",
      name: "justiciaGratuita.Calendarios.FechaHasta"
    },
    {
      id: "fechaProgramada",
      name: "justiciaGratuita.Calendarios.FechaProgramada"
    },
    {
      id: "listaGuardias",
      name: "menu.justiciaGratuita.calendarios.ListaGuardias"
    },
    {
      id: "observaciones",
      name: "justiciaGratuita.Calendarios.Observaciones"
    },
    {
      id: "estado",
      name: "menu.justiciaGratuita.calendarios.Estado"
    },
    {
      id: "generado",
      name: "justiciaGratuita.Calendarios.Generado"
    },
    {
      id: "numGuardias",
      name: "justiciaGratuita.Calendarios.NumGuardias"
    }
  ];

  comboEstados = [
    { label: "Pendiente", value: "0" },
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
      
      if (this.persistenceService.getDatos() != undefined && this.persistenceService.getDatos().duplicar) {
        console.log('¿duplicar?: ', this.persistenceService.getDatos().duplicar)
        this.dataToDuplicate = this.persistenceService.getDatos();
        console.log('DATA TO DUPLICATE 2', this.dataToDuplicate)
        this.rowGroups = this.dataToDuplicate.tabla;
        
        let objCells: Cell[] = [
          { type: 'text', value: this.dataToDuplicate.turno, combo: null },
          { type: 'text', value: this.dataToDuplicate.nombre, combo: null },
          { type: 'text', value: this.dataToDuplicate.fechaDesde, combo: null},
          { type: 'text', value: this.dataToDuplicate.fechaHasta , combo: null},
          { type: 'text', value: this.dataToDuplicate.fechaProgramacion , combo: null},
          { type: 'label', value: this.dataToDuplicate.listaGuarias, combo: null},
          { type: 'text', value: this.dataToDuplicate.observaciones , combo: null},
          { type: 'text', value: this.dataToDuplicate.estado , combo: null},
          { type: 'text', value: this.dataToDuplicate.generado, combo: null },
          { type: 'text', value: this.dataToDuplicate.numGuardias, combo: null},
          { type: 'invisible', value: this.dataToDuplicate.idCalendarioProgramado, combo: null},
          { type: 'invisible', value: this.dataToDuplicate.idTurno, combo: null},
          { type: 'invisible', value: this.dataToDuplicate.idGuardia, combo: null},
          
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
                'idCalendarioProgramado': dat.idCalendarioProgramado
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
          this.commonsService.scrollTablaFoco('tablaFoco');
        });
}

jsonToRow(){
  this.buscar = false;
  let generado = '??????';
  let numGuardias = '??????';
  let arr = [];

  this.respuestaCalendario.forEach((res, i) => {
    let fP = {label: this.formatDate(res.fechaProgramacion), value: new Date(res.fechaProgramacion.toString())};
    let objCells = [
    { type: 'text', value: res.turno },
    { type: 'text', value: res.guardia },
    { type: 'text', value: this.changeDateFormat(res.fechaDesde)},
    { type: 'text', value: this.changeDateFormat(res.fechaHasta) },
    { type: 'date', value: fP },
    //{ type: 'text', value: new Date(res.fechaProgramacion.toString()) },
    { type: 'label', value: {label: res.listaGuardias, value: res.idCalG }},
    { type: 'text', value: res.observaciones },
    { type: 'text', value: this.getStatusValue(res.estado) },
    { type: 'text', value: res.generado },
    { type: 'text', value: res.numGuardias},
    { type: 'invisible', value: res.idCalendarioProgramado},
    { type: 'invisible', value: res.idTurno},
    { type: 'invisible', value: res.idGuardia},
    
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
;  
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
          this.commonsService.scrollTablaFoco('tablaFoco');
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
          this.commonsService.scrollTablaFoco('tablaFoco');
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

  
}
