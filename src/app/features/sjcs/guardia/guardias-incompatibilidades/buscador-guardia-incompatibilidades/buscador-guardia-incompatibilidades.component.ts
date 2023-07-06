import { Component, OnInit, ViewChild } from '@angular/core';
import { TablaGuardiasComponent } from './tabla-guardias/tabla-guardias.component';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { procesos_guardia } from '../../../../../permisos/procesos_guarida';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { FiltrosGuardiaIncompatibilidadesComponent } from './filtros-guardia-incompatibilidades/filtros-guardia-incompatibilidades.component';
import { OldSigaServices } from '../../../../../_services/oldSiga.service';
import { IncompatibilidadesDatosEntradaItem } from './IncompatibilidadesDatosEntradaItem.model';
import { GuardiaItem } from '../../../../../models/guardia/GuardiaItem';
import { DeleteIncompatibilidadesDatosEntradaItem } from './DeleteIncompatibilidadesDatosEntradaItem';
import { SaveIncompatibilidadesDatosEntradaItem } from './SaveIncompatibilidadesDatosEntradaItem.model copy';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ResultadoIncompatibilidades } from './ResultadoIncompatibilidades.model';
import { Cell, Row, TablaResultadoMixIncompService } from '../../../../../commons/tabla-resultado-mix/tabla-resultado-mix-incompatib.service';
import { AuthenticationService } from '../../../../../_services/authentication.service';
import { ComboIncompatibilidadesDatosEntradaItem } from './ComboIncompatibilidadesDatosEntradaItem';
import { ComboIncompatibilidadesRes } from './ComboIncompatibilidadesRes';
import { SigaStorageService } from '../../../../../siga-storage.service';
interface GuardiaI {
  label: string,
  value: string
}
@Component({
  selector: 'app-buscador-guardia-incompatibilidades',
  templateUrl: './buscador-guardia-incompatibilidades.component.html',
  styleUrls: ['./buscador-guardia-incompatibilidades.component.scss']
})
export class BuscadorGuardiaIncompatibilidadesComponent implements OnInit {

  buscar: boolean = false;
  historico: boolean = false;
  filtrosValues = new GuardiaItem();
  url;
  datos;
  msgs;
  permisoEscritura
  progressSpinner: boolean = false;
  incompatibilidadesDatosEntradaItem: IncompatibilidadesDatosEntradaItem;
  deleteIncompatibilidadesDatosEntradaItem: DeleteIncompatibilidadesDatosEntradaItem;
  saveIncompatibilidadesDatosEntradaItem: SaveIncompatibilidadesDatosEntradaItem;
  respuestaIncompatibilidades : ResultadoIncompatibilidades[] = [];
  idGuardia;
  comboGuardiasIncompatibles: GuardiaI[] = [];
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
      name: "menu.justiciaGratuita.GuardiaMenu"
    },
    {
      id: "guardiasIncompatibles",
      name: "dato.jgr.guardia.guardias.guardiasIncompatibles"
    },
    {
      id: "motivos",
      name: "dato.jgr.guardia.guardias.motivos"
    },
    {
      id: "diasSeparacion",
      name: "dato.jgr.guardia.guardias.diasSeparacion"
    }
  ];
  isLetrado : boolean = false;
  @ViewChild(FiltrosGuardiaIncompatibilidadesComponent) filtros;
  //@ViewChild(TablaGuardiasComponent) tabla;

  constructor(private persistenceService: PersistenceService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    public oldSigaServices: OldSigaServices,
    private trmService: TablaResultadoMixIncompService,
    private authenticationService: AuthenticationService,
    private sigaStorageService : SigaStorageService) {
    this.url = oldSigaServices.getOldSigaUrl("guardiasIncompatibilidades");
    }

    ngOnInit() {
      this.isLetrado = this.sigaStorageService.isLetrado && this.sigaStorageService.idPersona;
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
  getFiltrosValues(event){
    this.filtrosValues = event;
    this.convertArraysToStrings();
    this.buscarInc();
    
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

  getComboGuardiasInc(){
    this.comboGuardiasIncompatibles = [];
    let idInstitucion = this.authenticationService.getInstitucionSession();
    this.comboIncompatibilidadesDatosEntradaItem = new ComboIncompatibilidadesDatosEntradaItem(
      { 'idTurno': '',
        'idTipoGuardia': '',
        'idPartidaPresupuestaria': '',
        'labels': true,
        'idInstitucion': idInstitucion
      }  );


    this.sigaServices.post(
      "guardiasIncompatibilidades_getCombo", this.comboIncompatibilidadesDatosEntradaItem).subscribe(
        data => {
          this.comboIncompatibilidadesRes = new ComboIncompatibilidadesRes(
            {
              'values': JSON.parse(data.body).values,
              'labels': JSON.parse(data.body).labels
            });
            this.comboIncompatibilidadesRes.labels.forEach((l,i) => {
              let objCombo: GuardiaI = {label: l, value: this.comboIncompatibilidadesRes.values[i]};
              this.comboGuardiasIncompatibles.push(objCombo);
            });
            this.jsonToRow();
  },
    err => {
      this.progressSpinner = false;
      //console.log(err);
    });
}

sortOptions(value) {
  if (this.comboGuardiasIncompatibles && value) {
    this.comboGuardiasIncompatibles.sort((a, b) => {
      //const includeA = this.etiquetasPersonaJuridicaSelecionados.includes(a);
      //const includeB = this.etiquetasPersonaJuridicaSelecionados.includes(b)
      const includeA = value.find(item => item == a.value);
      const includeB = value.find(item => item == b.value);
      if (includeA && !includeB) {
      //const includeA = this.etiquetasPersonaJuridicaSelecionados.indexOf(a);
      //const includeB = this.etiquetasPersonaJuridicaSelecionados.indexOf(b);
      //if ((includeA != -1) && (includeB == -1)) {
        return -1;
      }
      else if (!includeA && includeB) {
      //else if ((includeA == -1) && (includeB != -1)) {
        return 1;
      }
      return a.label.localeCompare(b.label);
    });
  }
}
  

buscarInc(){
  this.buscar = false;
  this.progressSpinner = true;
//let jsonEntrada  = JSON.parse(JSON.stringify(datosEntrada))
this.incompatibilidadesDatosEntradaItem = new IncompatibilidadesDatosEntradaItem(
    { 'idTurno': (this.filtrosValues.idTurno  && this.filtrosValues.idTurno.length > 0) ? this.filtrosValues.idTurno.toString() :  "",
      'nombreGuardia': this.filtrosValues.nombre,
      'idArea': (this.filtrosValues.area && this.filtrosValues.area.length > 0) ? this.filtrosValues.area.toString() : "",
      'idMateria': (this.filtrosValues.materia  && this.filtrosValues.materia.length > 0) ? this.filtrosValues.materia.toString() : "",
      'idZona':  (this.filtrosValues.zona  && this.filtrosValues.zona.length >0) ? this.filtrosValues.zona.toString() : "",
      'idSubZona': (this.filtrosValues.grupoZona  && this.filtrosValues.grupoZona.length > 0) ? this.filtrosValues.grupoZona.toString() : "",
      'idJurisdiccion': this.filtrosValues.jurisdiccion,
      'idGrupoFacturacion': this.filtrosValues.grupoFacturacion,
      'idPartidaPresupuestaria': this.filtrosValues.partidaPresupuestaria,
      'idTipoTurno': this.filtrosValues.tipoTurno,
      'idTipoGuardia': this.filtrosValues.idTipoGuardia
    }  );

    this.sigaServices.post(
      "guardiasIncompatibilidades_buscarIncompatibilidades", this.incompatibilidadesDatosEntradaItem).subscribe(
        data => {

          let error = JSON.parse(data.body).error;
          this.datos = JSON.parse(data.body).incompatibilidadesItem;
          this.buscar = true;
          this.datos = this.datos.map(it => {
            it.letradosIns = +it.letradosIns;
            return it;
          })
          this.respuestaIncompatibilidades = [];
         // this.comboGuardiasIncompatibles = [];
          this.datos.forEach((dat, i) => {
            let responseObject = new ResultadoIncompatibilidades(
              {
                'existe': dat.existe,
                'idTurno': dat.idTurno,
                'nombreTurno': dat.nombreTurno,
                'nombreGuardia': dat.nombreGuardia,
                'idGuardia': dat.idGuardia,
                'nombreTurnoIncompatible': dat.nombreTurnoIncompatible,
                'idTurnoIncompatible': dat.idTurnoIncompatible,
                'nombreGuardiaIncompatible': dat.nombreGuardiaIncompatible,
                'idGuardiaIncompatible': dat.idGuardiaIncompatible,
                'motivos': dat.motivos,
                'diasSeparacionGuardias': dat.diasSeparacionGuardias
              }
              
            );
            /*let objCombo: GuardiaI = {label: dat.nombreGuardiaIncompatible, value: dat.idGuardiaIncompatible};
            this.comboGuardiasIncompatibles.push(objCombo);*/
            this.respuestaIncompatibilidades.push(responseObject);
          })
          this.getComboGuardiasInc();
          this.jsonToRow();

          this.buscar = true;
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
          //console.log(err);
        },
        () => {
          setTimeout(()=>{this.commonsService.scrollTablaFoco('tablaFoco')},5);
        });
}

jsonToRow(){
  
  let arr = [];
  this.respuestaIncompatibilidades.forEach((res, i) => {
    let arrids = res.idGuardiaIncompatible.split(',');
    let st = "";
    /*arr.foreach(id =>{
      st = st + "'" + id + "'" + ", ";
    })*/
    let ArrComboValue = [""] ;
    ArrComboValue = arrids;
    let ArrNombresGI = [res.nombreGuardiaIncompatible]
    let objCells = [
    { type: 'text', value: res.nombreTurno },
    { type: 'text', value: res.nombreGuardia },
    { type: 'multiselect', combo: this.comboGuardiasIncompatibles, value: ArrComboValue, disabled: (this.isLetrado || !this.permisoEscritura) },
    { type: 'input', value: res.motivos, disabled: (this.isLetrado || !this.permisoEscritura) },
    { type: 'input', value: res.diasSeparacionGuardias, disabled: (this.isLetrado || !this.permisoEscritura) },
    { type: 'invisible', value: res.idTurnoIncompatible },
    { type: 'invisible', value: res.idGuardiaIncompatible },
    { type: 'invisible', value: res.idGuardia },
    { type: 'invisible', value: res.idTurno },
    { type: 'invisible', value: res.nombreTurnoIncompatible },
    { type: 'invisible', value: ArrNombresGI }]
    ;

    let obj = {id: i, cells: objCells};
    this.sortOptions(ArrComboValue)
    arr.push(obj);
  })
  //BORRAR!!!!******
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
}

save(event){
  let idInstitucion = this.authenticationService.getInstitucionSession();
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
  let incompArray : SaveIncompatibilidadesDatosEntradaItem [] = [];
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
    incompArray.push(this.saveIncompatibilidadesDatosEntradaItem);
  });
  if(incompArray && incompArray.length > 0){
    this.guardarInc(incompArray);
  
    this.rowGroups = event;
    this.rowGroupsAux = event;
    this.totalRegistros = this.rowGroups.length;
  }
  
}

  deleteFromCombo(incompToDelete){

    let incompArray : DeleteIncompatibilidadesDatosEntradaItem [] = [];
    let idInstitucion = this.authenticationService.getInstitucionSession();
    let idTurnoIncompatible;
    let idGuardiaIncompatible;
    let idGuardia;
    let idTurno;
    
    this.deleteIncompatibilidadesDatosEntradaItem = new DeleteIncompatibilidadesDatosEntradaItem(
      { 'idTurno': incompToDelete.idTurno.value,
        'idGuardia': incompToDelete.idGuardia.value,
        'idTurnoIncompatible': "",
        'idGuardiaIncompatible': incompToDelete.idGuardiaIncomp,
        'idInstitucion': idInstitucion //DUDA
      }
    );
    incompArray.push(this.deleteIncompatibilidadesDatosEntradaItem);

    this.eliminarInc(incompArray)
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
  }

delete(indexToDelete){
  let incompArray : DeleteIncompatibilidadesDatosEntradaItem [] = [];
  let idInstitucion = this.authenticationService.getInstitucionSession();
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
      this.deleteIncompatibilidadesDatosEntradaItem = new DeleteIncompatibilidadesDatosEntradaItem(
        { 'idTurno': idTurno,
          'idGuardia': idGuardia,
          'idTurnoIncompatible': idTurnoIncompatible,
          'idGuardiaIncompatible': idGuardiaIncompatible,
          'idInstitucion': idInstitucion, //DUDA
        }
      );
      incompArray.push(this.deleteIncompatibilidadesDatosEntradaItem);
    })
    this.eliminarInc(incompArray)
  })
  this.rowGroupsAux = this.rowGroups;
  this.totalRegistros = this.rowGroups.length;
  }



  eliminarInc(incompArray : DeleteIncompatibilidadesDatosEntradaItem []){
    
    this.progressSpinner = true;
    this.sigaServices.post(
      "guardiasIncompatibilidades_eliminarIncompatibilidades", incompArray).subscribe(
        data => {
          let error = JSON.parse(data.body).error;
          this.datos = JSON.parse(data.body).guardiaItems;
          this.buscar = true;
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
          } else{
            this.buscarInc();
          }
        },
        err => {
          this.progressSpinner = false;
          //console.log(err);
        },
        () => {
          setTimeout(()=>{this.commonsService.scrollTablaFoco('tablaFoco')},5);
        });
  
}

guardarInc(incompArray : SaveIncompatibilidadesDatosEntradaItem []){
  this.progressSpinner = true;
    this.sigaServices.post(
      "guardiasIncompatibilidades_guardarIncompatibilidades", incompArray).subscribe(
        data => {
          let error = JSON.parse(data.body).error;
          this.datos = JSON.parse(data.body).guardiaItems;
          this.buscar = true;
          if(this.datos){
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
          } else{
            this.buscarInc();
          }
        },
        err => {
          this.progressSpinner = false;
          //console.log(err);
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
        //console.log(err);
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
    const array = ['idTurno', 'idGuardia', 'jurisdiccion', 'grupoFacturacion', 'partidaPresupuestaria', 'tipoTurno', 'idTipoGuardia'];
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