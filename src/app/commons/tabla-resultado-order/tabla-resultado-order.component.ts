import { ElementRef, Renderer2, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Row, Cell } from './tabla-resultado-order-cg.service';
import { SigaServices } from '../../_services/siga.service';
import { CommonsService } from '../../_services/commons.service';
import { eventInstanceToEventRange } from 'fullcalendar';
import { Router } from '@angular/router';
import { TranslateService } from '../translate';
import { DomSanitizer } from '@angular/platform-browser';
import 'rxjs/add/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import { GuardiaItem } from '../../models/guardia/GuardiaItem';
import { PersistenceService } from '../../_services/persistence.service';
import { BuscadorGuardiaComponent } from '../../features/sjcs/guardia/busqueda-guardias/buscador-guardia/buscador-guardia.component';
import { SigaStorageService } from '../../siga-storage.service';
@Component({
  selector: 'app-tabla-resultado-order',
  templateUrl: './tabla-resultado-order.component.html',
  styleUrls: ['./tabla-resultado-order.component.scss']
})
export class TablaResultadoOrderComponent implements OnInit {
  isDisabled = false;
  @Input() isDisabledNuevo = false;
  @Input() isDisabledByEstado = false;
  info = new FormControl();
  @Input() cabeceras = [];  
  @Input() rowGroups: Row[];
  @Input() rowGroupsAux: Row[];
  @Input() calendarios;
  @Input() listaGuardias : boolean = false;
  rowGroupsOrdered = [];
  @Input() seleccionarTodo = false;
  @Input() estado;
  @Output() anySelected = new EventEmitter<any>();
  @Output() selectedRow = new EventEmitter<any>();
  @Output() colaGuardiaModified = new EventEmitter<any>();
  @Output() colaGuardiaOrdenada = new EventEmitter<any>();
  
  @Output() rest = new EventEmitter<Boolean>();
  @Output() dupli = new EventEmitter<Boolean>();
  @Output() guardarGuardiasEnConjunto = new EventEmitter<any>();
  @Output() descargaLog = new EventEmitter<{}>();
  @Output() disableGen = new EventEmitter<Boolean>();
  @Output() saveGuardiasEnLista = new EventEmitter<Row[]>();
  @Input() permisosEscritura : boolean = true;
  @Input() tarjetaDatosGenerales = {
    'duplicar' : '',
    'tabla': [],
    'turno':'',
    'nombre': '',
    'generado': '',
    'numGuardias': '',
    'listaGuarias': {},
    'fechaDesde': '',
    'fechaHasta': '',
    'fechaProgramacion': null,
    'estado': '',
    'observaciones': '',
    'idCalendarioProgramado': '',
    'idTurno': '',
    'idGuardia': '',
    'filtrosBusqueda' : ''
  };
  anySelectedBol = false;
  from = 0;
  to = 10;
  cabecerasMultiselect = [];
  modalStateDisplay = true;
  msgs: Message[] = [];
  msgInfo: boolean = false;
  searchText = [];
  selectedHeader;
  positionsToDelete = [];
  numCabeceras = 0;
  numColumnas = 0;
  numColumnasChecked = 0;
  selected = false;
  selectedArray = [];
  RGid = "inicial";
  down = false;
  positionSelected = 0;
  grupos = [];
  x = 0;
  xArr = [];
  unavailableUp = false;
  unavailableDown = false;
  maxGroup = 0;
  wrongPositionArr = [];
  @Input() totalRegistros = 0;
  numperPage = 10;
  @ViewChild('table') table: ElementRef;
  @Output() delete = new EventEmitter<any>();
  comboTurno = [];
  @Input() comboGuardia = [];
  progressSpinner = false;
  rowwSelected;
  comboGenerado = [{ label: 'Sí', value: 'Si'},
  { label: 'No', value: 'No'}];
  @Output() guardiasCalendarioModified = new EventEmitter<any>();
  @Input() fromSlice : Number = 0;
  @Input() toSlice : Number = 10;
  @Input() manual;
  @Input() pantalla;
  @Input() minimoLetrado;
  @Input() s;
  @Output() linkGuardiaColegiado = new EventEmitter<any>();
  marcadoultimo = false;
  numPage = 0;
  isLetrado : boolean = false;
  currentRoute: String;
  idClasesComunicacionArray: string[] = [];
  idClaseComunicacion: String;
  keys: any[] = [];

  constructor(
    private renderer: Renderer2,
    private sigaServices: SigaServices,
    private commonServices: CommonsService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private translateService: TranslateService,
    private sanitizer: DomSanitizer,
    private persistenceService: PersistenceService,
    private sigaStorageService : SigaStorageService
  ) {
    /* this.renderer.listen('window', 'click',(event: { target: HTMLInputElement; })=>{
      for (let i = 0; i < this.table.nativeElement.children.length; i++) {

      if(!event.target.classList.contains("selectedRowClass")){
        this.selected = false;
        this.selectedArray = [];
        this.anySelectedBol = false;
      }
    }
    }); */
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.marcadoultimo = false;
    this.ordenarByOrderField();
    //console.log('rowGroups al inicio: ', this.rowGroups)
    this.selectedArray = [];
    this.isLetrado = this.sigaStorageService.isLetrado && this.sigaStorageService.idPersona;
    if(this.rowGroups != undefined){




      this.sigaServices.get("busquedaGuardia_turno").subscribe(
        n => {
          this.progressSpinner = false;
          let comboTurno = n.combooItems;
          this.cd.detectChanges();
          this.commonServices.arregloTildesCombo(comboTurno);
  
          this.rowGroups.forEach(rowG => {
            comboTurno.forEach(cT=> {
            if (cT.value == rowG.cells[1].value){
              rowG.cells[1].value = cT.label;
            }
          
            });
          });
  
          this.sigaServices.getParam(
            "busquedaGuardia_guardia", "?idTurno=" + null).subscribe(
              data => {
                this.progressSpinner = false;
                let comboGuardia = data.combooItems;
                this.commonServices.arregloTildesCombo(comboGuardia);
                this.rowGroups.forEach(rowG => {
                  comboGuardia.forEach(cG=> {
                     if (cG.value == rowG.cells[2].value){
                      rowG.cells[2].value = cG.label;
                    }
                    });
                  });
              },
              err => {
                this.progressSpinner = false;
                //console.log(err);
              }
            )
        },
        err => {
          this.progressSpinner = false;
          //console.log(err);
        }
      );
  







      
      this.totalRegistros = this.rowGroups.length;
    }
    this.numCabeceras = this.cabeceras.length;
    this.numColumnas = this.numCabeceras;
    this.cabeceras.forEach(cab =>{
      this.cabecerasMultiselect.push(cab.name);
    })
    if(!this.listaGuardias){
      this.xArr = [];
      if (this.rowGroups != undefined){
        this.rowGroups.forEach((rg, i) =>{
          if(this.pantalla == 'colaGuardias'){
            this.grupos.push(rg.cells[0].value);
          }else{
          this.grupos.push(rg.cells[1].value);
          }
          let x = this.ordenValue(i);
          this.xArr.push(x);
        });
      }
      if (!this.calendarios){
        if (this.grupos.length != 0){
          this.maxGroup = this.grupos.reduce((a, b)=>Math.max(a, b)); 
          this.ordenarGrupos();
        }

      }
    }
  }
  perPage(perPage){
    this.numperPage = perPage;
  }
  ordenValue(i){
  if(this.grupos[i-1] != undefined){
    if ((this.grupos[i] != undefined && this.grupos[i-1].value != this.grupos[i].value)){
      this.x = 1;
    } else {
      this.x = this.x + 1;
    }
  } else {
    this.x = 1;
  }
  return this.x;
}
  validaCheck(texto) {
    return texto === 'Si';
  }
  selectRow(rowId, rowSelected){
    if(this.selectedArray.includes(rowId)){
      const i = this.selectedArray.indexOf(rowId);
      this.selectedArray.splice(i, 1);
    }else{
      /*if (this.calendarios){
        this.positionSelected = Number(rowId) + 1;
      }else{*/
        this.positionSelected = rowId;
      
      
      this.selectedArray.push(rowId);
    }
    if(this.selectedArray.length != 0){
      this.anySelected.emit(true);
      this.anySelectedBol = true;
      this.selectedRow.emit(rowSelected);
      this.rowwSelected = rowSelected;
    }else{
      this.anySelected.emit(false);
      this.anySelectedBol = false;
    }
    
  }

  guardar(ultimo){
      this.rowGroups.forEach(rG=>{
      if (rG.cells[0].value != undefined && rG.cells[0].value.toString().startsWith('U')){
        rG.cells[0].value = rG.cells[0].value.substring(1);
      }
    })
    this.progressSpinner = true;
    //console.log('this.rowGroups: ', this.rowGroups)
    if (this.calendarios){
      this.guardiasCalendarioModified.emit(this.rowGroups);
      this.totalRegistros = this.rowGroups.length;
    }else{
      this.wrongPositionArr = [];
      this.ordenarGrupos();
      if (this.pantalla == 'colaGuardias'){
      this.orderByOrder(1);
      } else{
        this.orderByOrder(1);
      }
      this.displayWrongSequence();
    let errorVacio = this.checkEmpty();
    let errorSecuenciaOrden = false;
    let errorSecuenciaGrupo = false;
    let errorMismoLetradoEnGrupo = false;
    let errorGrupoNoOrden = false;
    if (this.pantalla == 'colaGuardias') {
      if (!ultimo){
        errorSecuenciaGrupo = this.checkSequence(0);
        errorSecuenciaOrden = this.checkSequence(1);
      }
      errorMismoLetradoEnGrupo = this.checkLetrados();
      errorGrupoNoOrden = this.checkOrdeIfGrupo();
    }else{
      errorSecuenciaOrden = this.checkSequence(1);
    }
    this.totalRegistros = this.rowGroups.length;
    if (!errorVacio && !errorSecuenciaOrden && !errorSecuenciaGrupo){
      if (!ultimo){
          this.updateColaGuardia();
      }else{
          this.updateColaGuardiaSameOrder();
      }
    
        


      this.showMsg('success', 'Se ha guardado correctamente', '')
      this.progressSpinner = false;
    }else if (errorGrupoNoOrden){
      this.showMsg('error', 'Error. Todo letrado que pertenezcan a un grupo, tienen que tener valor en el campo orden.', '')
      this.progressSpinner = false;
    }else if (errorMismoLetradoEnGrupo){
      this.showMsg('error', 'Error. Un letrado no puede encontrarse 2 veces en el mismo grupo.', '')
      this.progressSpinner = false;
    } else if (errorVacio){
      this.showMsg('error', 'Error. Existen campos vacíos en la tabla.', '')
      this.progressSpinner = false;
    }else if (errorSecuenciaOrden && !errorSecuenciaGrupo){
      this.showMsg('error', 'Error. Los valores en la columna "Orden" deben ser secuenciales.', '')
      this.progressSpinner = false;
    }else if (errorSecuenciaGrupo && !errorSecuenciaOrden){
      this.showMsg('error', 'Error. Los valores en la columna "Grupo" deben ser secuenciales.', '')
      this.progressSpinner = false;
    }else if (errorSecuenciaGrupo && errorSecuenciaOrden){
      this.showMsg('error', 'Error. Los valores en las columnas "Grupo" y "Orden" deben ser secuenciales.', '')
      this.progressSpinner = false;
    }
    return errorVacio;
    }
    this.progressSpinner = false;
  }


  ordenarByOrderField(){
    if(this.rowGroupsAux != undefined){
      let data :Row[] = [];
      this.rowGroups = this.rowGroupsAux.filter((row) => {
          data.push(row);
      });
  
      this.rowGroups = data.sort((a, b) => {
        if (a.cells[0].value != null && b.cells[0].value != null){
        let resultado;
        resultado = compare(Number(a.cells[0].value), Number(b.cells[0].value), true);
        return resultado ;
        }else{
          return 0;
        }
    });
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
    }

  }

  saveCal(){
    
    this.disableGen.emit(false);
    let newRowGroups: Row[] = [];
    this.rowGroups.forEach(rowG => {
      if(rowG.cells[1].type == 'selectDependency' ||  rowG.cells[1].type == 'textNew'){
        newRowGroups.push(rowG);
      }
    })
    this.sigaServices.get("busquedaGuardia_turno").subscribe(
      n => {
        this.progressSpinner = false;
        let comboTurno = n.combooItems;
        this.cd.detectChanges();
        this.commonServices.arregloTildesCombo(comboTurno);

        this.rowGroups.forEach(rowG => {
          comboTurno.forEach(cT=> {
          if (cT.label == rowG.cells[1].value){
            rowG.cells[1].value = cT.value;
          }
        
          });
        });

        this.sigaServices.getParam(
          "busquedaGuardia_guardia", "?idTurno=" + null).subscribe(
            data => {
              this.progressSpinner = false;
              let comboGuardia = data.combooItems;
              this.commonServices.arregloTildesCombo(comboGuardia);
              this.rowGroups.forEach(rowG => {
                comboGuardia.forEach(cG=> {
                   if (cG.label == rowG.cells[2].value){
                    rowG.cells[2].value = cG.value;
                  }
                  });
                });

                let event = {
                  'newRowGroups': newRowGroups,
                  'update': false
                }
                if (newRowGroups.length == 0){
                  event = {
                    'newRowGroups': this.rowGroups,
                    'update': true
                  }
                  if(this.checkOrdern())
                    this.guardarGuardiasEnConjunto.emit(event);
                }else{
                  event = {
                    'newRowGroups': newRowGroups,
                    'update': false
                  }
                  if(this.checkOrdern())
                    this.guardarGuardiasEnConjunto.emit(event);
                }
            },
            err => {
              this.progressSpinner = false;
              //console.log(err);
            }
          )
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    );


 
  
    
   // this.rowGroups.sort((a, b) => a.cells[0].localeCompare(b.cells[0]))
  }
  updateColaGuardia(){
    this.colaGuardiaModified.emit(this.rowGroups);
    this.totalRegistros = this.rowGroups.length;
  }
  updateColaGuardiaSameOrder(){
    this.colaGuardiaOrdenada.emit(this.rowGroups);
    this.totalRegistros = this.rowGroups.length;
  }
displayWrongSequence(){
  
  this.wrongPositionArr = [];
  let positions = "";
  let numColArr = [];
    const numbers = "123456789";
  this.rowGroups.forEach((row, i) => { 
    if (this.rowGroups[i].cells[0].value != null){
    if (i < this.rowGroups.length - 1){
      if (this.rowGroups[i].cells[1].value != this.rowGroups[i + 1].cells[1].value){
        positions = positions + row.cells[2].value;
        numColArr.push(row.cells[3].value)
        this.compareStrings(numbers, positions, numColArr);
        positions = "";
        numColArr = [];
      } else {
        positions = positions + row.cells[2].value;
        numColArr.push(row.cells[3].value)
      }
    } else {
      positions = positions + row.cells[2].value;
      numColArr.push(row.cells[3].value)
      this.compareStrings(numbers, positions, numColArr);
    }
  }
  });
  //Returns false, 
}


isIncreasingSequence(numbers) {
  let errArr = [];
  let resultado = false;
  let numArr = Array.prototype.slice.call(numbers);
  for (var num = 0; num < numArr.length - 1; num++) {
      if (numArr[num] > numArr[num + 1] || Number.isNaN(numArr[num]) || Number.isNaN(numArr[num + 1])) {
        errArr.push(true);
      } else {
        errArr.push(false);
      }
  }
  errArr.forEach(err => {
if (err == true){
  resultado = err;
}
  });
  return resultado;
}

checkOrdeIfGrupo(){
  let errSeqArr = [];
  let err2 = false;
  this.rowGroups.forEach((row, i) => { 
    if (i < this.rowGroups.length - 1){
      if (this.rowGroups[i].cells[0].value != null && this.rowGroups[i].cells[0].value != undefined && this.rowGroups[i].cells[0].value != ""){
        if (this.rowGroups[i].cells[1].value != null && this.rowGroups[i].cells[1].value != undefined && this.rowGroups[i].cells[1].value != ""){
          errSeqArr.push(false);
        }else{
          errSeqArr.push(true);
        }
      }
    }
  });

  errSeqArr.forEach(err => {
    if (err){
      err2=true;
    }
  });
  return err2;
}

checkLetrados(){
  let errSeqArr = [];
  let err2 = false;
  this.rowGroups.forEach((row, i) => { 
    if (i < this.rowGroups.length - 1){
    //SI LOS GRUPOS SON IGUALES, COMPROBAMOS LOS LETRADOS
    if (this.rowGroups[i].cells[0].value == this.rowGroups[i + 1].cells[0].value){
      if (this.rowGroups[i].cells[2].value == this.rowGroups[i + 1].cells[2].value){
        errSeqArr.push(true);
      }else{
        errSeqArr.push(false);
      }
    }else 
        errSeqArr.push(false);
  }
  });

   errSeqArr.forEach(err => {
      if (err){
        err2=true;
      }
    });
    return err2;
}
  checkSequence(j){
    let positions = "";
    const numbers = "123456789";
    let errorSecuencia = false;
    let errSeqArr = [];
    let err2 = false;
    let arrNumbers : Number[] = [];
    this.rowGroups.forEach((row, i) => { 
      if (this.rowGroups[i].cells[j].value != undefined && this.rowGroups[i].cells[j].value.toString().startsWith('U')){
        this.rowGroups[i].cells[j].value = this.rowGroups[i].cells[j].value.substring(1);
      }
      if (i < this.rowGroups.length - 1){

        if (j == 1 && i > 1 && this.rowGroups[i - 1].cells[0].value != this.rowGroups[i].cells[0].value) {
          arrNumbers = [];
        }

        if (this.rowGroups[i].cells[j].value != null && this.rowGroups[i + 1].cells[j].value != null){
          if (this.rowGroups[i].cells[j].value != this.rowGroups[i + 1].cells[j].value){
            arrNumbers.push(Number(row.cells[j].value));
            //errorSecuencia = numbers.indexOf(positions) === -1;
            errorSecuencia = this.isIncreasingSequence(arrNumbers);
            errSeqArr.push(errorSecuencia);
            if (errorSecuencia == true){
              //console.log('error true ' , i)
            }
          } else {
            arrNumbers.push(Number(row.cells[j].value));
            if (j == 0){
              //Si estamos revisando el orden de grupos j == 0 y dos grupos consecutivos son iguales, revisamos si sus ordenes tambien lo son. En ese caso, error.
              if (this.rowGroups[i].cells[0].value == this.rowGroups[i + 1].cells[0].value && this.rowGroups[i].cells[1].value == this.rowGroups[i + 1].cells[1].value){
                errorSecuencia = true;
                errSeqArr.push(errorSecuencia);
              }
            }
          }
        } else {
          arrNumbers.push(Number(row.cells[j].value));
          errorSecuencia = this.isIncreasingSequence(positions);
          if (errorSecuencia == true){
          }
          //errorSecuencia = numbers.indexOf(positions) === -1;
          errSeqArr.push(errorSecuencia);
        }
      }
    });
    //Returns false, if the number is in sequence
    errSeqArr.forEach(err => {
      if (err){
        err2=true;
      }
    });
    return err2;
  }
  compareStrings(numbers, positions, numColArr){
   
    let z = 1;
    let numbersArr = Array.from(numbers);
    let positionsArr = Array.from(positions);
    z = 1;
    for (var i = 0, len = positionsArr.length; i < len; i++){
      if (this.pantalla == 'colaGuardias'){
        if (numbersArr[i] !== positionsArr[i]){
          z++;
          if (z<=2 && i != 0){
            this.wrongPositionArr.push(numColArr[i]);
          }
        }
      }else{
        if (numbersArr[i] !== positionsArr[i]){
          z++;
          if (z<=2){
            this.wrongPositionArr.push(numColArr[i]);
          }
        }
      }

    }
  }
  checkEmpty(){
    let errorVacio = false;
    this.rowGroups.forEach((row, r) => {
      row.cells.forEach((cell,i)  =>{
        if (cell.value == '' && ( i == 1 || i == 2)){
          errorVacio = true;
        }
      })
    })
    return errorVacio;
  }
orderByOrder(x){
    let rowsByGroup : Row[] = [];
    this.rowGroups.forEach((row, i) => { 
  if (this.rowGroups[i].cells[x].value != null){
      if (i < this.rowGroups.length - 1){
        if (this.rowGroups[i].cells[x].value != this.rowGroups[i + 1].cells[x].value){
          rowsByGroup.push(row);
          //ordenar y guardar
          this.orderSubGroups(rowsByGroup, x);
          rowsByGroup = [];
        } else {
          rowsByGroup.push(row);
        }
      } else {
        rowsByGroup.push(row);
        //ordenar y guardar
        this.orderSubGroups(rowsByGroup, x);
      }

      if (rowsByGroup.length < this.minimoLetrado){
        this.showMsg('error', 'Error. No se cumple el mínimo número de letrados por grupos configurado', '')
        this.progressSpinner = false;
      }
    }else{
      this.rowGroupsOrdered = this.rowGroups;
    }
    });
    this.rowGroups = this.rowGroupsOrdered;
    this.totalRegistros = this.rowGroups.length;
    this.rowGroupsAux = this.rowGroups;
    this.rowGroupsOrdered = [];
}

orderSubGroups(rowsByGroup, x){
  let data = rowsByGroup;
  rowsByGroup = data.sort((a, b) => {
    let resultado;
      resultado = compare(a.cells[x].value, b.cells[x].value, true);
  return resultado ;
});
rowsByGroup.forEach(row => {
  this.rowGroupsOrdered.push(row);
})
return rowsByGroup;
}
  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }
  
  clear() {
    this.msgs = [];
  }

  ordenarGrupos(){
    let data :Row[] = [];
    this.rowGroups = this.rowGroupsAux.filter((row) => {
        data.push(row);
    });
    //console.log('this.rowGroupsAux: ', this.rowGroupsAux)
    //console.log('data: ', data)
    this.rowGroups = data.sort((a, b) => {
      //console.log('a.cells[0].value: ', a.cells[0].value)
      //console.log('a.cells[3].value: ', a.cells[3].value)
      //console.log('b.cells[0].value: ', b.cells[0].value)
      //console.log('b.cells[3].value: ', b.cells[3].value)
      if (a.cells[0].value != null && b.cells[0].value != null){
      let resultado;
      if (this.pantalla == 'colaGuardias'){
        if (Number(a.cells[0].value) == Number(b.cells[0].value)){
          resultado = 0;
        }else{
          resultado = compare(Number(a.cells[0].value), Number(b.cells[0].value), true); //ordenamos por grupo
        }
      }else{
        resultado = compare(Number(a.cells[1].value), Number(b.cells[1].value), true);
      }
      //console.log('resultado: ',resultado)
    return resultado ;
      }else{
        //console.log('resultado 0: ',0)
        return 0;
        /*let last = this.rowGroups[this.rowGroups.length - 1];
        this.rowGroups[this.rowGroups.length - 1] = a;
        this.rowGroups[this.rowGroups.length - 2] = last;*/
      }
  });
  this.rowGroupsAux = this.rowGroups;
  this.grupos = [];
  this.rowGroups.forEach((rg, i) =>{
    if (this.pantalla == 'colaGuardias'){
      this.grupos.push(rg.cells[0].value);
    }else{
      this.grupos.push(rg.cells[1].value);
    }
  })
  this.totalRegistros = this.rowGroups.length;
  }

  getPageNumber(event){
    this.numPage = event;
  }
valueChange(i, z, $event){
  //console.log('valueChange')
  if (this.pantalla == 'colaGuardias'){
    let posicion = this.numperPage*(this.numPage) + i
    if ( z == 1){
      this.rowGroups[posicion].cells[z].value = Number($event.target.value);
    } else {
        this.rowGroups[posicion].cells[z].value = $event.target.value.toString();
    }
    if ( z ==1){
      this.rowGroups[posicion].cells[z].type = 'input';
      this.grupos[posicion] = Number($event.target.value);
    }else if (z == 2){
      this.rowGroups[posicion].cells[z].type = 'position';
      this.xArr[posicion] = $event.target.value;
    }else if(!this.listaGuardias && this.pantalla != 'calendarios'){
      this.rowGroups[posicion].cells[z].type = $event.target.type;
    }
  }else{
    if ( z == 1){
      this.rowGroups[i].cells[z].value = Number($event.target.value);
    } else {
      this.rowGroups[i].cells[z].value = $event.target.value.toString();
    }
    if ( z ==1){
      this.rowGroups[i].cells[z].type = 'input';
      this.grupos[i] = Number($event.target.value);
    }else if (z == 2){
      this.rowGroups[i].cells[z].type = 'position';
      this.xArr[i] = $event.target.value;
    }else if(!this.listaGuardias && this.pantalla != 'calendarios'){
      this.rowGroups[i].cells[z].type = $event.target.type;
    }
  }
this.rowGroupsAux = this.rowGroups;
this.grupos = [];
this.rowGroups.forEach((rg, i) =>{
  if (this.pantalla == 'colaGuardias'){
    this.grupos.push(rg.cells[0].value);
  }else{
    this.grupos.push(rg.cells[1].value);
  }
})
this.totalRegistros = this.rowGroups.length;
  }
 /* moveRow( movement){
    let position = this.positionSelected;
      let desiredPosition = 0;
    if (movement == 'up'){
      if (position == 0){
        this.unavailableUp = true;
      }
      desiredPosition = position - 1;
    }else{
      if (position == this.grupos.length){
        this.unavailableDown = true;
      }
      desiredPosition = position + 1;
    }

    //Si pertenecen al mismp Grupo (columna 1)
    if (this.rowGroups[position].cells[0].value == this.rowGroups[desiredPosition].cells[0].value){
      const temp = this.rowGroups[desiredPosition];
      this.rowGroups[desiredPosition] = this.rowGroups[position];
      this.rowGroups[position] = temp;
    }

  }*/
  moveToLast(){
    this.rowGroups.forEach(rG=>{
      if (rG.cells[0].value != undefined && rG.cells[0].value.toString().startsWith('U')){
        rG.cells[0].value = rG.cells[0].value.substring(1);
      }
    })
    let posicionEntabla = this.from + this.positionSelected;
    if (this.rowGroups[posicionEntabla].cells[16] != undefined){
      this.rowGroups[posicionEntabla].cells[16].value = 1;
    }
    
   
    /*this.rowGroups.forEach((rG, i) => {
      if (this.rowGroups[posicionEntabla].cells[12] != undefined){
        if (i == posicionEntabla){
          this.rowGroups[posicionEntabla].cells[12].value = 1;
        }else{
          this.rowGroups[i].cells[12].value = 0;
        }
      }else if (this.rowGroups[posicionEntabla].cells[16] != undefined){
        if (i == posicionEntabla){
          this.rowGroups[posicionEntabla].cells[16].value = 1;
        }else{
          this.rowGroups[i].cells[16].value = 0;
        }
      }

    })*/
    this.rowGroupsAux = this.rowGroups;

    this.marcadoultimo = true;
    let i = 1;
    let lastGroup = this.grupos[this.grupos.length - 1];
    let groupSelected = 0;
    if (this.pantalla == 'colaGuardias'){
      while (lastGroup == null && i <= this.grupos.length){
      i++;
      lastGroup = this.grupos[this.grupos.length - i];
      }
      groupSelected = this.rowGroups[posicionEntabla].cells[0].value;
       this.rowGroupsAux.forEach((row, index)=> {
          if(groupSelected != null && row.cells[0].value != null && Number(row.cells[0].value) == Number(groupSelected)){
            this.rowGroups[index].cells[0].value = lastGroup;
          } else if (groupSelected != null && row.cells[0].value != null && Number(row.cells[0].value) > Number(groupSelected)){
            this.rowGroups[index].cells[0].value = Number(row.cells[0].value) - 1;
          }else if (groupSelected != null && row.cells[0].value == null){
            let last = this.rowGroups[this.rowGroups.length - 1];
            this.rowGroups[this.rowGroups.length - 1] = this.rowGroups[index];
            this.rowGroups[this.rowGroups.length - 2] = last;
            //this.rowGroups[index].cells[0].value = Number(row.cells[0].value);
          }
      });
      
  if (groupSelected == null){
      let selected = this.rowGroups[posicionEntabla];
          let ordenColaSeleccionado = Object.assign({},selected.cells[12]);
         let ordenColaUltimo = Object.assign({},this.rowGroups[this.rowGroups.length - 1].cells[12]);
         let ordenColaPrimero = Object.assign({},this.rowGroups[0].cells[12]);
        let j = 0;
        while (j < posicionEntabla){
          //this.rowGroups[index] = this.rowGroupsAux[index - 1];
          this.rowGroups[j].cells[12].value = this.rowGroupsAux[j+1].cells[12].value;
          j++;
          }
       
         //selected = last
         this.rowGroups[posicionEntabla].cells[12].value = ordenColaUltimo.value;
         //last = first
         this.rowGroups[this.rowGroups.length - 1].cells[12].value = ordenColaPrimero.value;
         
        
      }
    }else{
      groupSelected = this.rowGroups[posicionEntabla].cells[1].value;
       this.rowGroupsAux.forEach((row, index)=> {
      if(Number(row.cells[1].value) == Number(groupSelected)){
        this.rowGroups[index].cells[1].value = lastGroup;
      } else if (Number(row.cells[1].value) > Number(groupSelected)){
        this.rowGroups[index].cells[1].value = Number(row.cells[1].value) - 1;
      }
  });
    }
   
 
  this.rowGroupsAux = this.rowGroups;
  this.totalRegistros = this.rowGroups.length;
  this.guardar(true);
  }
  
  moveRow(movement){
    this.rowGroups.forEach(rG=>{
      if (rG.cells[0].value != undefined && rG.cells[0].value.toString().startsWith('U')){
        rG.cells[0].value = rG.cells[0].value.substring(1);
      }
    })
    let posicionEntabla = this.from + this.positionSelected;
    this.disableGen.emit(true);
    let groupSelected;
    if (this.calendarios){
      //groupSelected = this.rowGroups[this.positionSelected - 1].cells[1].value;
      //this.rowGroupsAux.forEach((row, index)=> {
        let ordenSelected = this.rowGroups[this.positionSelected].cells[0].value;
        if (movement == 'up'){
         /* let first = this.rowGroups[this.positionSelected - 1];
          this.rowGroups[this.positionSelected - 1] = this.rowGroups[this.positionSelected - 2];
          this.rowGroups[this.positionSelected - 2] = first;*/
          let aboveRow = this.rowGroups[this.positionSelected - 1];
          let aboveOrden = aboveRow.cells[0].value;
          this.rowGroups[this.positionSelected - 1] = this.rowGroups[this.positionSelected];
          this.rowGroups[this.positionSelected - 1].cells[0].value = aboveOrden;
          this.rowGroups[this.positionSelected] = aboveRow;
          this.rowGroups[this.positionSelected].cells[0].value = ordenSelected;
        } else if (movement == 'down'){
          //let first = this.rowGroups[this.positionSelected - 1];
          //this.rowGroups[this.positionSelected - 1] = this.rowGroups[this.positionSelected];
          //this.rowGroups[this.positionSelected] = first;
          let belowRow = this.rowGroups[this.positionSelected + 1];
          let belowOrden = belowRow.cells[0].value;
          this.rowGroups[this.positionSelected + 1] = this.rowGroups[this.positionSelected];
          this.rowGroups[this.positionSelected + 1].cells[0].value = belowOrden;
          this.rowGroups[this.positionSelected] = belowRow;
          this.rowGroups[this.positionSelected].cells[0].value = ordenSelected;
        }
      //});
    }else if(this.listaGuardias){
      let ordenSelected = this.rowGroups[this.positionSelected].cells[0].value;

      if (movement == 'up'){
        let aboveRow = this.rowGroups[this.positionSelected - 1];
        let aboveOrden = aboveRow.cells[0].value;
        this.rowGroups[this.positionSelected - 1] = this.rowGroups[this.positionSelected];
        this.rowGroups[this.positionSelected - 1].cells[0].value = aboveOrden;
        this.rowGroups[this.positionSelected] = aboveRow;
        this.rowGroups[this.positionSelected].cells[0].value = ordenSelected;
      } else if (movement == 'down'){
        let belowRow = this.rowGroups[this.positionSelected + 1];
        let belowOrden = belowRow.cells[0].value;
        this.rowGroups[this.positionSelected + 1] = this.rowGroups[this.positionSelected];
        this.rowGroups[this.positionSelected + 1].cells[0].value = belowOrden;
        this.rowGroups[this.positionSelected] = belowRow;
        this.rowGroups[this.positionSelected].cells[0].value = ordenSelected;
      }
      }else if (this.pantalla == "colaGuardias"){
      groupSelected = this.rowGroups[posicionEntabla].cells[0].value;
     
        /*if (movement == 'up'){
          let first = this.rowGroups[this.positionSelected - 1];
          this.rowGroups[this.positionSelected - 1] = this.rowGroups[this.positionSelected - 2];
          this.rowGroups[this.positionSelected - 2] = first;
        } else if (movement == 'down'){
          let first = this.rowGroups[this.positionSelected - 1];
          this.rowGroups[this.positionSelected - 1] = this.rowGroups[this.positionSelected];
          this.rowGroups[this.positionSelected] = first;
        }*/
        let y = 0;
        if (groupSelected == null){
          y = 12;
          if (movement == 'up'){
            let or = Object.assign({},this.rowGroups[posicionEntabla].cells[12]);
          this.rowGroups[posicionEntabla].cells[12].value = this.rowGroups[posicionEntabla - 1].cells[12].value;
          this.rowGroups[posicionEntabla - 1].cells[12].value = or.value;
          } else if (movement == 'down'){
            let or = Object.assign({},this.rowGroups[posicionEntabla].cells[12]);
          this.rowGroups[posicionEntabla].cells[12].value = this.rowGroups[posicionEntabla + 1].cells[12].value;
          this.rowGroups[posicionEntabla + 1].cells[12].value = or.value;
          }
          this.rowGroupsAux = this.rowGroups;
          this.guardar(true);
        }else{
          

          if (movement == 'up'){
            let newGroup = parseInt(groupSelected) - 1;

            let actual = this.rowGroups.filter(row => row.cells[y].value == groupSelected);
            let aDesplazar = this.rowGroups.filter(row => row.cells[y].value == newGroup);
            
            this.rowGroups = this.swapElements(this.rowGroups,
              this.rowGroups.indexOf(actual[0]), this.rowGroups.indexOf(actual[actual.length - 1]) + 1,
              this.rowGroups.indexOf(aDesplazar[0]), this.rowGroups.indexOf(aDesplazar[aDesplazar.length - 1]) + 1);

            actual.forEach(row => row.cells[y].value = newGroup);
            aDesplazar.forEach(row => row.cells[y].value = groupSelected);

            this.rowGroupsAux = this.rowGroups;
          } else if (movement == 'down'){
            let newGroup = parseInt(groupSelected) + 1;

            let actual = this.rowGroups.filter(row => row.cells[y].value == groupSelected);
            let aDesplazar = this.rowGroups.filter(row => row.cells[y].value == newGroup);

            this.rowGroups = this.swapElements(this.rowGroups,
              this.rowGroups.indexOf(actual[0]), this.rowGroups.indexOf(actual[actual.length - 1]) + 1,
              this.rowGroups.indexOf(aDesplazar[0]), this.rowGroups.indexOf(aDesplazar[aDesplazar.length - 1]) + 1);

            actual.forEach(row => row.cells[y].value = newGroup);
            aDesplazar.forEach(row => row.cells[y].value = groupSelected);

            this.rowGroupsAux = this.rowGroups;
          }
        }
    }else{
      groupSelected = this.rowGroups[this.positionSelected].cells[1].value;
      this.rowGroupsAux.forEach((row, index)=> {
      
        if (movement == 'up'){
          
          if(Number(row.cells[1].value) == Number(groupSelected)){
            this.rowGroups[index].cells[1].value = (Number(groupSelected) - 1);
          } else if (Number(row.cells[1].value) == Number(groupSelected) - 1){
            this.rowGroups[index].cells[1].value = groupSelected;
          }
        } else if (movement == 'down'){
          
          if(Number(row.cells[1].value) == Number(groupSelected)){
            this.rowGroups[index].cells[1].value = (Number(groupSelected) + 1);
          } else if (Number(row.cells[1].value) == Number(groupSelected) + 1){
            this.rowGroups[index].cells[1].value = groupSelected;
          }
        }
      
      })
      
    
  }
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
  }

  swapElements<T>(array: T[], startFirst: number, endFirst: number, startSecond: number, endSecond: number): T[] {
    const finalArray: T[] = [];
    let firstIntervalFinished = false;
    let secondIntervalFinished = false;

    array.forEach((element, index) => {
      const firstInterval = index >= startFirst && index < endFirst;
      const secondInterval = index >= startSecond && index < endSecond;

      if (!firstInterval && !secondInterval) {
        finalArray.push(element);
      } else if (firstInterval && !secondIntervalFinished) {
        for (let i = startSecond; i < endSecond; i++) {
          finalArray.push(array[i]);      
        }
        secondIntervalFinished = true;
      } else if (secondInterval && !firstIntervalFinished) {
        for (let i = startFirst; i < endFirst; i++) {
          finalArray.push(array[i]);      
        }
        firstIntervalFinished = true;
      }
    })

    return finalArray;
  }


  isSelected(id){
    if(this.selectedArray.includes(id)){
      return true;
    } else {
      return false;
    }
  }
  selectWrong(i){
    if (this.wrongPositionArr.includes(this.rowGroups[i].cells[2].value)){
      return true;
    } else {
      return false;
    }
  }
  disableButton(type){
    let posicion = this.numperPage*(this.numPage) + this.positionSelected;
    if (this.rowGroups != undefined){
    this.grupos = [];
    this.rowGroups.forEach((rg, i) =>{
      if (this.pantalla == 'colaGuardias'){
        this.grupos.push(rg.cells[0].value);
      }else{
        this.grupos.push(rg.cells[1].value);
      }
  })
    let disable = false;
    if (posicion == 1 || this.grupos[posicion] <= 2){
      this.unavailableUp = true;
    } else {
      this.unavailableUp = false;
    }
    if((this.listaGuardias || this.calendarios) && posicion == 0){
      this.unavailableUp = true;
    }else if ((this.listaGuardias || this.calendarios) && posicion > 0){
      this.unavailableUp = false;
    }

   /* if (this.calendarios){
      if (posicion== this.grupos.length || this.grupos[posicion]  >= this.maxGroup){
        this.unavailableDown = true;
      } else {
        this.unavailableDown = false;
      }
    }else{*/
    
      if (posicion == this.grupos.length - 1 || this.grupos[posicion]  >= this.maxGroup && this.grupos[posicion] != null){
        this.unavailableDown = true;
      } else {
        this.unavailableDown = false;
      }

      //this.grupos = this.grupos.map(g => g.startsWith("U") ? g.substring(1) : g);

    //}


    if ( this.selectedArray.length != 1 || (this.unavailableUp && type == 'up')){
      disable = true;
    }else if ( this.selectedArray.length != 1 || (this.unavailableDown && type == 'down')){
      disable = true;
    }
    return disable;
  }
  }
  sortData(sort: Sort) {
    let data :Row[] = [];
    this.rowGroups = this.rowGroupsAux.filter((row) => {
        data.push(row);
    });
    data = data.slice();
    if (!sort.active || sort.direction === '') {
      this.rowGroups = data;
      return;
    }
    this.rowGroups = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      let resultado;
        for (let i = 0; i < a.cells.length; i++) {
        resultado = compare(a.cells[i].value, b.cells[i].value, isAsc);
        }
    return resultado ;
  });
  this.rowGroupsAux = this.rowGroups;
  
    } 


    searchChange(j: any) {
      let isReturn = true;
      let isReturnArr = [];
      this.rowGroups = this.rowGroupsAux.filter((row) => {
            if (
              this.searchText[j] != " " &&
              this.searchText[j] != undefined && 
              !row.cells[j].value.toString().toLowerCase().includes(this.searchText[j].toLowerCase())
            ) {
              isReturn = false;
            } else {
              isReturn = true;
            }
        if (isReturn) {
          return row;
        }
      });
      this.totalRegistros = this.rowGroups.length;
      }

    isPar(numero):boolean {
      return numero % 2 === 0;
    }

    isLast(numero):boolean {
      return numero == this.to - 1;
    }
    restablecer(){
      this.disableGen.emit(false);
      //console.log('this.rowGroupsAux: ', this.rowGroupsAux)
      this.rowGroups = this.rowGroupsAux;
      this.rest.emit(true);
    }
    duplicar(){
      this.dupli.emit(true);
    }
    selectedAll(evento){
      this.seleccionarTodo = evento;
    }
    fromReg(event){
      this.from = Number(event) - 1;
    }
    toReg(event){
      this.to = Number(event);
    }

    eliminar(){
      this.disableGen.emit(true);
      if (this.calendarios){
        if ( this.estado == "Pendiente"){
          this.delete.emit(this.selectedArray);
        this.totalRegistros = this.rowGroups.length;
        this.rowGroupsAux = this.rowGroups;
        }else{
          this.showMsg('error', 'Error. No pueden eliminarse guardias con estado distinto de Pendiente', '')
        }
      }else{
        this.delete.emit(this.selectedArray);
        this.totalRegistros = this.rowGroups.length;
        this.rowGroupsAux = this.rowGroups;
      }
      //this.to = this.totalRegistros;
      }
      nuevo(){
        /*
        this.comboTurno.forEach(cT=> {
          if (cT.value == this.rowGroups[0].cells[1].value){
            this.rowGroups[0].cells[1].value = cT.label;
          }else if (cT.value == this.rowGroups[this.rowGroups.length - 1].cells[1].value){
            this.rowGroups[this.rowGroups.length - 1].cells[1].value = cT.label;
          }
        
        });
        this.comboGuardia.forEach(cG=> {
          if (cG.value == this.rowGroups[0].cells[2].value){
            this.rowGroups[0].cells[2].value = cG.label;
          }else if (cG.value == this.rowGroups[this.rowGroups.length - 1].cells[2].value){
            this.rowGroups[this.rowGroups.length - 1].cells[2].value = cG.label;
          }
        
        });
        this.rowGroups[0].cells[1].type = 'textNew';
        this.rowGroups[0].cells[1].combo = null;
        this.rowGroups[0].cells[2].type = 'linkNew';
        this.rowGroups[0].cells[2].combo = null;
        this.rowGroups[this.rowGroups.length - 1].cells[1].type = 'textNew';
        this.rowGroups[this.rowGroups.length - 1].cells[1].combo = null;
        this.rowGroups[this.rowGroups.length - 1].cells[2].type = 'linkNew';
        this.rowGroups[this.rowGroups.length - 1].cells[2].combo = null;
        //console.log(this.rowGroups)
        //this.disableGen.emit(true);
        */

        this.disableGen.emit(false);

        this.getComboTurno();
        let newCells: Cell[] = [
          { type: 'inputNumber', value: '', combo: null, hiddenValue:'', required:true},
          { type: 'selectDependency', value: '' , combo: this.comboTurno, hiddenValue:'', required:true },
          { type: 'selectDependency2', value: '', combo: this.comboGuardia, hiddenValue:'', required:true },
          { type: 'text', value: '', combo: null, hiddenValue:'', required:false },
          { type: 'text', value: '', combo: null, hiddenValue:'', required:false }
          ];
          let rowObject: Row = new Row();
          rowObject.cells = newCells;
          this.rowGroups.push(rowObject);
          this.rowGroupsAux = this.rowGroups;
          this.totalRegistros = this.rowGroups.length;
          this.to = this.totalRegistros <= this.numperPage ? this.totalRegistros : this.numperPage;
          this.cd.detectChanges();

          //console.log(this.rowGroups);
      }

    getComboTurno() {
      this.progressSpinner = true;
    this.sigaServices.get("busquedaGuardia_turno").subscribe(
      n => {
        this.progressSpinner = false;
        this.comboTurno = n.combooItems;
        //console.log('this.comboTurno : ', this.comboTurno )
        this.cd.detectChanges();
        this.commonServices.arregloTildesCombo(this.comboTurno);
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    );
  }
  
  onChangeTurno(idTurno, row : Row) {
    this.getComboGuardia(idTurno, row);
    //console.log('idTurno: ', idTurno)
    /*
    this.comboGuardia = [];
    if(this.listaGuardias){
      row.cells[3].value = '';
    }*/

  }

  onChangeGuardia(row : Row){
    
    if(this.listaGuardias){
      let idTurno : string = row.cells[1].value;
      let idGuardia : string = row.cells[2].value;
      row.cells[1].hiddenValue = idTurno;
      row.cells[2].hiddenValue = idGuardia;
      if(idTurno && idGuardia){
        this.progressSpinner = true;
        this.sigaServices.getParam(
          "listasGuardias_searchTipoDiaGuardia", "?idTurno=" + idTurno + "&idGuardia=" + idGuardia).subscribe(
            data => {
                row.cells[3].value = data.valor;
                this.progressSpinner = false;
            },
            err => {
              //console.log(err);
              this.progressSpinner = false;
            },
            ()=>{
              this.progressSpinner = false;
            }
          );
      }else if(!idGuardia){
        row.cells[3].value = '';
      }

    }
  }
  
  
  
    getComboGuardia(idTurno, row) {
      this.progressSpinner = true;
    this.sigaServices.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + idTurno).subscribe(
        data => {
          this.progressSpinner = false;
          let comboGuardia = data.combooItems;
          this.commonServices.arregloTildesCombo(comboGuardia);
          row.cells.find(c => c.type == 'selectDependency2').combo = comboGuardia;
        },
        err => {
          this.progressSpinner = false;
          //console.log(err);
        }
      )

  }
  
  anadirLetrado(){
    //console.log('this.rowwSelected: ', this.rowwSelected)
    if (this.rowwSelected.length != 0){
      let calendario = {
           'orden': this.rowwSelected.cells[0].value,
              'turno': this.rowwSelected.cells[1].value,
              'guardia': this.rowwSelected.cells[2].value,
              'generado': this.rowwSelected.cells[3].value,
              'idGuardia': this.rowwSelected.cells[5].value,
              'idTurno': this.rowwSelected.cells[6].value
      }
    
    this.linkGuardiaColegiado.emit(calendario);
    }
  }
  showFail(msg) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: msg
    });
  }


  public base64ToBlob(b64Data, sliceSize=512) {
    let byteCharacters = atob(b64Data); //data.file there
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);
    
        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    }
  descargarLog(){
    if (this.estado != 'Pendiente' || this.estado != 'Procesada con Errores'){
    let datosCalendariosSeleccionado = {
      'idCalendarioGuardias': this.rowwSelected.cells[7].value,
      'idTurno': this.rowwSelected.cells[6].value,
      'idGuardia': this.rowwSelected.cells[5].value,
    };
    this.descargaLog.emit(datosCalendariosSeleccionado);
    }else{
      this.showMsg('error','Error', 'No existe LOG , ya que no ha comenzado la generación');
    }
    }


  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openTab(row) {
    let guardiaItem = new GuardiaItem();
    guardiaItem.idGuardia = row.cells[2].value;
    guardiaItem.idTurno = row.cells[1].value;
    this.persistenceService.setDatos(this.tarjetaDatosGenerales);
    sessionStorage.setItem(
      "filtrosBusquedaGuardiasFichaGuardia",
      JSON.stringify(guardiaItem)
    );
    //this.persistenceService.setHistorico(evento.fechabaja ? true : false);
    this.router.navigate(["/gestionGuardias"]); // ficha guardias
   }

   openTab2(row) {
     let itemGuardiaColegiado = { 'guardia': row.cells[5].value,
                                  'turno': row.cells[6].value,
                                  'fechaDesde': this.tarjetaDatosGenerales.fechaDesde,
                                  'fechaHasta': this.tarjetaDatosGenerales.fechaHasta
                                }
    sessionStorage.setItem("itemGuardiaColegiado", JSON.stringify(itemGuardiaColegiado));

    this.persistenceService.setDatos(this.tarjetaDatosGenerales);
    this.router.navigate(["/guardiasColegiado"]);  //busqueda guardias colegiado
   }

   nuevaGuardia(){
    this.getComboTurno();
    let newCells: Cell[] = [
        { type: 'inputNumber', value: '', combo: null, hiddenValue:'', required:true},
        { type: 'selectDependency', value: '' , combo: this.comboTurno, hiddenValue:'', required:true},
        { type: 'selectDependency2', value: '', combo: this.comboGuardia, hiddenValue:'', required:true},
        { type: 'text', value: '', combo: null, hiddenValue:'', required:false}
      ];
      let rowObject: Row = new Row();
      rowObject.cells = newCells;
      this.rowGroups.push(rowObject); 
      this.totalRegistros = this.rowGroups.length;
      //console.log('this.rowGroups NUEVO: ', this.rowGroups)
      //console.log('this.totalRegistros NUEVO: ', this.totalRegistros)
      this.to = this.totalRegistros;
      this.cd.detectChanges();
   }
  saveGuardias(){
    if(this.checkOrdenAndCamposObligatorios()){
      this.saveGuardiasEnLista.emit(this.rowGroups);
    }

  }
  checkOrdern(){
    let ok : boolean = true;
    if(ok){
      this.rowGroups.forEach(row => {
        if(ok){
          let numero = row.cells[0].value;
          let frecuencia = 0;

          this.rowGroups.forEach( rowAux => {
            if(numero == rowAux.cells[0].value){
              frecuencia ++ ;
            }
            if(frecuencia >= 2 && ok){  
              ok = false;
              this.showFail('No pueden haber dos campos Orden con el mismo valor');
            }
          });
        }
      })
    }
    return ok;
  }

  checkOrdenAndCamposObligatorios (){

    let ok : boolean = true;
    if(this.rowGroups.find(row => !row.cells[0].value || !row.cells[1].hiddenValue || !row.cells[2].hiddenValue)){
      ok = false;
      this.showMsg('error','Error', 'Rellene los campos obligatorios');
    }
    if(ok){
      this.rowGroups.forEach(row => {
        if(ok){
          let numero = row.cells[0].value;
          let frecuencia = 0;

          this.rowGroups.forEach( rowAux => {
            if(numero == rowAux.cells[0].value){
              frecuencia ++ ;
            }
            if(frecuencia >= 2 && ok){  
              ok = false;
              this.showFail('No pueden haber dos campos Orden con el mismo valor');
            }
          });
        }
      })
    }
    return ok;
  }

   styleObligatorio(mandatory : boolean, evento){
    if(mandatory && (evento==undefined || evento==null || evento=="")){
      return this.commonServices.styleObligatorio(evento);
    }
  }

  nuevoSaltoComp(){
    let pos = this.from + this.positionSelected;
    let dataFilterFromColaGuardia = { 
      'turno': 0,
      'guardia': 0,
      'colegiado': 0,
      'grupo': 0,
      'idPersona': 0,
      'letrado': 0
    };

    dataFilterFromColaGuardia.turno = this.rowGroups[pos].cells[10].value;
    dataFilterFromColaGuardia.guardia = this.rowGroups[pos].cells[11].value;
    dataFilterFromColaGuardia.colegiado = this.rowGroups[pos].cells[2].value;
    dataFilterFromColaGuardia.grupo = this.rowGroups[pos].cells[14].value;
    dataFilterFromColaGuardia.idPersona = this.rowGroups[pos].cells[15].value;
    dataFilterFromColaGuardia.letrado = this.rowGroups[pos].cells[3].value;
    this.persistenceService.setDatos(dataFilterFromColaGuardia);
    sessionStorage.setItem(
      "itemSaltosCompColaGuardia",
      JSON.stringify(dataFilterFromColaGuardia)
    );
    //this.persistenceService.setHistorico(evento.fechabaja ? true : false);
    // this.router.navigate(["/guardiasSaltosCompensaciones"]); 
    sessionStorage.setItem("fromTurnoOficio", "true");
    this.router.navigate(["/guardiasSaltosCompensaciones"], { queryParams: { 
      idturno: dataFilterFromColaGuardia.turno, 
      idguardia: dataFilterFromColaGuardia.guardia, 
      idpersona: dataFilterFromColaGuardia.idPersona, 
      numerocolegiado: dataFilterFromColaGuardia.colegiado, 
      letrado: dataFilterFromColaGuardia.letrado,
      grupo: dataFilterFromColaGuardia.grupo
    } });
  }

  navigateComunicar(dato) {
    sessionStorage.setItem("rutaComunicacion", this.currentRoute.toString());
    //IDMODULO de SJCS es 10
    sessionStorage.setItem("idModulo", '10');
    
    this.getDatosComunicar();
  }
  
  getKeysClaseComunicacion() {
    this.sigaServices.post("dialogo_keys", this.idClaseComunicacion).subscribe(
      data => {
        this.keys = JSON.parse(data["body"]);
      },
      err => {
        //console.log(err);
      }
    );
  }


  getDatosComunicar() {
    let datosSeleccionados = [];
    let rutaClaseComunicacion = this.currentRoute.toString();

    this.sigaServices
      .post("dialogo_claseComunicacion", rutaClaseComunicacion)
      .subscribe(
        data => {
          this.idClaseComunicacion = JSON.parse(
            data["body"]
          ).clasesComunicaciones[0].idClaseComunicacion;
          this.sigaServices
            .post("dialogo_keys", this.idClaseComunicacion)
            .subscribe(
              data => {
                this.keys = JSON.parse(data["body"]).keysItem;
                this.selectedArray.forEach(element => {
                  let keysValues = [];
                  this.keys.forEach(key => {
                    if (element[key.nombre.toLowerCase()] != undefined) {
                      keysValues.push(element[key.nombre.toLowerCase()]);
                    }
                  });
                  datosSeleccionados.push(keysValues);
                });

                sessionStorage.setItem(
                  "datosComunicar",
                  JSON.stringify(datosSeleccionados)
                );
                this.router.navigate(["/dialogoComunicaciones"]);
              },
              err => {
                //console.log(err);
              }
            );
        },
        err => {
          //console.log(err);
        }
      );
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


