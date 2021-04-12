import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Row, TablaResultadoMixIncompService } from '../../../../commons/tabla-resultado-mix/tabla-resultado-mix-incompatib.service';
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
  @ViewChild(FiltrosGuardiaCalendarioComponent) filtros;
  //@ViewChild(TablaGuardiasComponent) tabla;

  constructor(private persistenceService: PersistenceService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    public oldSigaServices: OldSigaServices,
    private trmService: TablaResultadoMixIncompService,
    private authenticationService: AuthenticationService) {
    this.url = oldSigaServices.getOldSigaUrl("guardiasIncompatibilidades");
    }

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

    if (sessionStorage.getItem("filtrosBusquedaGuardiasFichaGuardia") == null || sessionStorage.getItem("filtrosBusquedaGuardiasFichaGuardia") == undefined) {
      this.datos = {};
    }

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
  
//let jsonEntrada  = JSON.parse(JSON.stringify(datosEntrada))
let datosEntrada = 
    { 'idTurno': this.filtrosValues.idTurno,
      'guardia': this.filtrosValues.guardia,
      'listaGuardias': this.filtrosValues.listaGuardias,
     // 'idGuardia': this.filtrosValues.idGuardia,
     'estado': this.filtrosValues.estado,
      //'turno': this.filtrosValues.turno,
      'fechaCalendarioDesde': this.filtrosValues.fechaCalendarioDesde,
      'fechaCalendarioHasta': this.filtrosValues.fechaCalendarioHasta,
      'fechaProgramadaDesde': this.filtrosValues.fechaProgramadaDesde,
      'fechaProgramadaHasta': this.filtrosValues.fechaProgramadaHasta,
    };

    this.sigaServices.post(
      "guardiaCalendario_buscar", datosEntrada).subscribe(
        data => {
          let error = JSON.parse(data.body).error;
          this.datos = JSON.parse(data.body);
   console.log('this.datos', this.datos)
          this.respuestaCalendario = [];
         // this.comboGuardiasIncompatibles = [];
          this.datos.forEach((dat, i) => {
            let responseObject = new CalendariosDatosEntradaItem(
              {
                'tipo': dat.tipo,
                'turno': dat.turno,
                'nombre': dat.nombre,
                'lugar': dat.lugar,
                'observaciones': dat.observaciones
              }
             
            );
            /*let objCombo: GuardiaI = {label: dat.nombreGuardiaIncompatible, value: dat.idGuardiaIncompatible};
            this.comboGuardiasIncompatibles.push(objCombo);*/
            this.respuestaCalendario.push(responseObject);
          });
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
  let generado = '??????';
  let numGuardias = '??????';
  let arr = [];
  this.respuestaCalendario.forEach((res, i) => {
    let objCells = [
    { type: 'text', value: res.turno },
    { type: 'text', value: res.nombre },
    { type: 'text', value: this.filtrosValues.fechaCalendarioDesde},
    { type: 'text', value: this.filtrosValues.fechaCalendarioHasta },
    { type: 'text', value: this.filtrosValues.fechaProgramadaDesde },
    { type: 'text', value: this.filtrosValues.listaGuardias },
    { type: 'text', value: res.observaciones },
    { type: 'text', value: this.filtrosValues.estado },
    { type: 'text', value: generado },
    { type: 'text', value: numGuardias}
    ];

    let obj = {id: i, cells: objCells};
    arr.push(obj);
  })
  console.log('arr: ', arr)
  //BORRAR!!!!******arr
  /*arr = [
    { id: 1,
      cells: 
      [
        { type: 'text', value: '28/08/2007' },
        { type: 'text', value: 'Designación' },
        { type: 'multiselect', combo: [{label: "Fact Ayto. Alicante - As. Joven", value: "1"},
                                      {label: "Fact Ayto. Alicante - As. Joven", value: "2"}] },
        { type: 'input', value: 'documentoX.txt' },
        { type: 'input', value: 'Euskara ResultadoConsulta' }
      ],
    },
    { id: 2,
      cells: 
      [
        { type: 'text', value: '28/08/2007' },
        { type: 'text', value: 'Designación' },
        { type: 'multiselect', combo: [{label: "Fact Ayto. Alicante - As. Joven", value: "1"},
                                      {label: "Fact Ayto. Alicante - As. Joven", value: "2"}]},
        { type: 'input', value: 'documentoX.txt' },
        { type: 'input', value: 'Euskara ResultadoConsulta' }
      ],
    },
    { id: 3,
      cells: 
      [
        { type: 'text', value: '28/08/2007' },
        { type: 'text', value: 'Designación' },
        { type: 'multiselect', combo: [{label: "Fact Ayto. Alicante - As. Joven", value: "1"},
                                      {label: "Fact Ayto. Alicante - As. Joven", value: "2"}] },
        { type: 'input', value: 'documentoX.txt' },
        { type: 'input', value: 'Euskara ResultadoConsulta' }
      ]
    },
  ];*/
   //*****BORRAR!!!!
   this.rowGroups = [];
  this.rowGroups = this.trmService.getTableData(arr);
  this.rowGroupsAux = [];
  this.rowGroupsAux = this.trmService.getTableData(arr);
  this.totalRegistros = this.rowGroups.length;
  console.log('rowGroups: ', this.rowGroups)
  this.buscar = true;
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

  deleteFromCombo(rowToDelete){

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
     /* if(c.type == "multiselect"){
        c.combo.forEach(comboValue => {
          comboValue.value
        })
      }*/
    })

    this.eliminarInc(idTurnoIncompatible, idGuardiaIncompatible, idGuardia, idTurno)
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
  }

delete(indexToDelete){
  let idGuardia;
  let idTurno;
  let toDelete:Row[] = [];
  indexToDelete.forEach(index => {
    toDelete.push(this.rowGroups[index]);
    this.rowGroups.splice(index, 1); 
  })
let idTurnoIncompatible;
let idGuardiaIncompatible;
  toDelete.forEach(row => {
    row.cells.forEach((c, index) => {
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
     /* if(c.type == "multiselect"){
        c.combo.forEach(comboValue => {
          comboValue.value
        })
      }*/
    })
    this.eliminarInc(idTurnoIncompatible, idGuardiaIncompatible, idGuardia, idTurno)
  })
  this.rowGroupsAux = this.rowGroups;
  this.totalRegistros = this.rowGroups.length;
  }



  eliminarInc(idTurnoIncompatible, idGuardiaIncompatible, idGuardia, idTurno){
    let idInstitucion = this.authenticationService.getInstitucionSession();
  this.deleteIncompatibilidadesDatosEntradaItem = new DeleteIncompatibilidadesDatosEntradaItem(
    { 'idTurno': idTurno,
      'idGuardia': idGuardia,
      'idTurnoIncompatible': idTurnoIncompatible,
      'idGuardiaIncompatible': idGuardiaIncompatible,
      'idInstitucion': idInstitucion, //DUDA
    }
  );
    this.sigaServices.post(
      "guardiasIncompatibilidades_eliminarIncompatibilidades", this.deleteIncompatibilidadesDatosEntradaItem).subscribe(
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
