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
@Component({
  selector: 'app-tabla-resultado-order',
  templateUrl: './tabla-resultado-order.component.html',
  styleUrls: ['./tabla-resultado-order.component.scss']
})
export class TablaResultadoOrderComponent implements OnInit {
  isDisabled = false;
  @Input() isDisabledNuevo = false;
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
  @Output() rest = new EventEmitter<Boolean>();
  @Output() dupli = new EventEmitter<Boolean>();
  @Output() guardarGuardiasEnConjunto = new EventEmitter<Row[]>();
  @Output() descargaLog = new EventEmitter<Boolean>();
  @Output() disableGen = new EventEmitter<Boolean>();
  @Output() saveGuardiasEnLista = new EventEmitter<Row[]>();
  @Input() permisosEscritura : boolean = false;
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
  ana = [];
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
  
  constructor(
    private renderer: Renderer2,
    private sigaServices: SigaServices,
    private commonServices: CommonsService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private translateService: TranslateService,
    private sanitizer: DomSanitizer,
    private persistenceService: PersistenceService,
  ) {
    this.renderer.listen('window', 'click',(event: { target: HTMLInputElement; })=>{
      for (let i = 0; i < this.table.nativeElement.children.length; i++) {

      if(!event.target.classList.contains("selectedRowClass")){
        this.selected = false;
        this.selectedArray = [];
        this.anySelectedBol = false;
      }
    }
    });
  }

  ngOnInit(): void {
    this.selectedArray = [];
    if(this.rowGroups != undefined){
      this.totalRegistros = this.rowGroups.length;
    }
    this.numCabeceras = this.cabeceras.length;
    this.numColumnas = this.numCabeceras;
    this.cabeceras.forEach(cab =>{
      this.cabecerasMultiselect.push(cab.name);
    })
    if(!this.listaGuardias){
      this.xArr = [];
      this.rowGroups.forEach((rg, i) =>{
        this.grupos.push(rg.cells[1].value);
        let x = this.ordenValue(i);
        this.xArr.push(x);
      })
      if (!this.calendarios){
        this.maxGroup = this.grupos.reduce((a, b)=>Math.max(a, b)); 
        this.ordenarGrupos();
      }
    }
  }
  perPage(perPage){
    this.numperPage = perPage;
  }
  ordenValue(i){
  if(this.grupos[i-1] != undefined){
    if ((this.grupos[i-1].value != this.grupos[i].value)){
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
      if (this.calendarios){
        this.positionSelected = Number(rowId) + 1;
      }else{
        this.positionSelected = rowId;
      }
      
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

  guardar(){
    if (this.calendarios){
      this.guardiasCalendarioModified.emit(this.rowGroups);
      this.totalRegistros = this.rowGroups.length;
    }else{
      this.wrongPositionArr = [];
      this.ordenarGrupos();
      this.orderByOrder();
      this.displayWrongSequence();
    let errorVacio = this.checkEmpty();
    let errorSecuencia = this.checkSequence();
    this.totalRegistros = this.rowGroups.length;
    if (!errorVacio && !errorSecuencia){
      this.updateColaGuardia();
      this.showMsg('success', 'Se ha guardado correctamente', '')
    } else if (errorVacio){
      this.showMsg('error', 'Error. Existen campos vacíos en la tabla.', '')
    }else if (errorSecuencia){
      this.showMsg('error', 'Error. Los valores en la columna "Orden" deben ser secuenciales.', '')
    }
    return errorVacio;
    }
  }

  saveCal(){
    this.disableGen.emit(false);
    let newRowGroups: Row[] = [];
    this.rowGroups.forEach(rowG => {
      if(rowG.cells[1].type == 'selectDependency'){
        newRowGroups.push(rowG);
      }
    })
    this.guardarGuardiasEnConjunto.emit(newRowGroups);
  }
  updateColaGuardia(){
    this.colaGuardiaModified.emit(this.rowGroups);
    this.totalRegistros = this.rowGroups.length;
  }
displayWrongSequence(){
  this.wrongPositionArr = [];
  let positions = "";
  let numColArr = [];
    const numbers = "123456789";
  this.rowGroups.forEach((row, i) => { 
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
  });
  //Returns false, 
}
isIncreasingSequence(numArr) {
  let errArr = [];
  let resultado = false;
  for (var num = 0; num < numArr.length - 1; num++) {
      if (numArr[num] >= numArr[num + 1] || Number.isNaN(numArr[num]) || Number.isNaN(numArr[num + 1])) {
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
  checkSequence(){
    let positions = "";
    const numbers = "123456789";
    let errorSecuencia = false;
    let errSeqArr = [];
    let err2 = false;
    this.rowGroups.forEach((row, i) => { 
      if (i < this.rowGroups.length - 1){
        if (this.rowGroups[i].cells[1].value != this.rowGroups[i + 1].cells[1].value){
          positions = positions + row.cells[1].value;
          //errorSecuencia = numbers.indexOf(positions) === -1;
          errorSecuencia = this.isIncreasingSequence(positions);
          errSeqArr.push(errorSecuencia);
          if (errorSecuencia == true){
          }
          positions = "";
        } else {
          positions = positions + row.cells[1].value;
        }
      } else {
        positions = positions + row.cells[1].value;
        errorSecuencia = this.isIncreasingSequence(positions);
        if (errorSecuencia == true){
        }
        //errorSecuencia = numbers.indexOf(positions) === -1;
        errSeqArr.push(errorSecuencia);
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
        if (numbersArr[i] !== positionsArr[i]){
          z++;
          if (z<=2){
            this.wrongPositionArr.push(numColArr[i]);
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
orderByOrder(){
    let rowsByGroup : Row[] = [];
    this.rowGroups.forEach((row, i) => { 
      if (i < this.rowGroups.length - 1){
        if (this.rowGroups[i].cells[1].value != this.rowGroups[i + 1].cells[1].value){
          rowsByGroup.push(row);
          //ordenar y guardar
          this.orderSubGroups(rowsByGroup);
          rowsByGroup = [];
        } else {
          rowsByGroup.push(row);
        }
      } else {
        rowsByGroup.push(row);
        //ordenar y guardar
        this.orderSubGroups(rowsByGroup);
      }
    });
    this.rowGroups = this.rowGroupsOrdered;
    this.totalRegistros = this.rowGroups.length;
    this.rowGroupsAux = this.rowGroups;
    this.rowGroupsOrdered = [];
}

orderSubGroups(rowsByGroup){
  let data = rowsByGroup;
  rowsByGroup = data.sort((a, b) => {
    let resultado;
      resultado = compare(a.cells[1].value, b.cells[1].value, true);
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
    this.rowGroups = data.sort((a, b) => {
      let resultado;
        resultado = compare(a.cells[1].value, b.cells[1].value, true);
    return resultado ;
  });
  this.rowGroupsAux = this.rowGroups;
  this.grupos = [];
  this.rowGroups.forEach((rg, i) =>{
    this.grupos.push(rg.cells[1].value);
  })
  this.totalRegistros = this.rowGroups.length;
  }


valueChange(i, z, $event){
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
    }else if(!this.listaGuardias){
      this.rowGroups[i].cells[z].type = $event.target.type;
    }
this.rowGroupsAux = this.rowGroups;
this.grupos = [];
this.rowGroups.forEach((rg, i) =>{
  this.grupos.push(rg.cells[1].value);
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
    let lastGroup = this.grupos[this.grupos.length - 1];
    let groupSelected = this.rowGroups[this.positionSelected].cells[1].value;
    this.rowGroupsAux.forEach((row, index)=> {
      if(Number(row.cells[1].value) == Number(groupSelected)){
        this.rowGroups[index].cells[1].value = lastGroup;
      } else if (Number(row.cells[1].value) > Number(groupSelected)){
        this.rowGroups[index].cells[1].value = Number(row.cells[1].value) - 1;
      }
  });
  this.guardar();
  this.totalRegistros = this.rowGroups.length;
  }
  moveRow(movement){
    this.disableGen.emit(true);
    let groupSelected;
    if (this.calendarios){
      groupSelected = this.rowGroups[this.positionSelected - 1].cells[1].value;
      //this.rowGroupsAux.forEach((row, index)=> {
      
        if (movement == 'up'){
          let first = this.rowGroups[this.positionSelected - 1];
          this.rowGroups[this.positionSelected - 1] = this.rowGroups[this.positionSelected - 2];
          this.rowGroups[this.positionSelected - 2] = first;
        } else if (movement == 'down'){
          let first = this.rowGroups[this.positionSelected - 1];
          this.rowGroups[this.positionSelected - 1] = this.rowGroups[this.positionSelected];
          this.rowGroups[this.positionSelected] = first;
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
    if (this.rowGroups != undefined){
    this.grupos = [];
    this.rowGroups.forEach((rg, i) =>{
    this.grupos.push(rg.cells[1].value);
  })
    let disable = false;
    if (this.positionSelected == 1 || this.grupos[this.positionSelected] <= 2){
      this.unavailableUp = true;
    } else {
      this.unavailableUp = false;
    }
    if(this.listaGuardias && this.positionSelected == 0){
      this.unavailableUp = true;
    }else if (this.listaGuardias && this.positionSelected > 0){
      this.unavailableUp = false;
    }
    if (this.calendarios){
      if (this.positionSelected == this.grupos.length || this.grupos[this.positionSelected]  >= this.maxGroup){
        this.unavailableDown = true;
      } else {
        this.unavailableDown = false;
      }
    }else{
      if (this.positionSelected == this.grupos.length - 1 || this.grupos[this.positionSelected]  >= this.maxGroup){
        this.unavailableDown = true;
      } else {
        this.unavailableDown = false;
      }
    }


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
      console.log('this.rowGroupsAux: ', this.rowGroupsAux)
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
        this.disableGen.emit(true);
        this.getComboTurno();
        let newCells: Cell[] = [
          { type: 'input', value: '', combo: null, hiddenValue:'', required:false},
          { type: 'selectDependency', value: '' , combo: this.comboTurno, hiddenValue:'', required:false},
          { type: 'selectDependency2', value: '', combo: this.comboGuardia, hiddenValue:'', required:false},
          { type: 'select', value: '', combo: this.comboGenerado, hiddenValue:'', required:false},
          { type: 'input', value: '', combo: null, hiddenValue:'', required:false}
          ];
          let rowObject: Row = new Row();
          rowObject.cells = newCells;
          this.rowGroups.push(rowObject);
          this.totalRegistros = this.rowGroups.length;
          console.log('this.rowGroups NUEVO: ', this.rowGroups)
          console.log('this.totalRegistros NUEVO: ', this.totalRegistros)
          this.to = this.totalRegistros;
          this.cd.detectChanges();
      }

    getComboTurno() {
      this.progressSpinner = true;
    this.sigaServices.get("busquedaGuardia_turno").subscribe(
      n => {
        this.progressSpinner = false;
        this.comboTurno = n.combooItems;
        console.log('this.comboTurno : ', this.comboTurno )
        this.cd.detectChanges();
        this.commonServices.arregloTildesCombo(this.comboTurno);
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }
    );
  }
  
  onChangeTurno(idTurno, row : Row) {
    this.getComboGuardia(idTurno);
    console.log('idTurno: ', idTurno)
    this.comboGuardia = [];
    if(this.listaGuardias){
      row.cells[3].value = '';
    }

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
              console.log(err);
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
  
  setCombouardia(){
    this.rowGroups.forEach((row, r) => {
      row.cells.forEach((cell, c) => {
        if (cell.type == 'selectDependency2'){
          
          console.log('this.comboGuardia: ', this.comboGuardia)
          this.rowGroups[r].cells[c].combo = this.comboGuardia;
          console.log('row.cells: ', row.cells)
        }
      })
    })
  }
  
    getComboGuardia(idTurno) {
      this.progressSpinner = true;
    this.sigaServices.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + idTurno).subscribe(
        data => {
          this.progressSpinner = false;
          this.comboGuardia = data.combooItems;
          this.setCombouardia();
          this.commonServices.arregloTildesCombo(this.comboGuardia);
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
        }
      )

  }
  
  anadirLetrado(){
    console.log('this.rowwSelected: ', this.rowwSelected)
    if (this.rowwSelected.length != 0){
      let calendario = {
           'orden': this.rowwSelected.cells[0].value,
              'turno': this.rowwSelected.cells[1].value,
              'guardia': this.rowwSelected.cells[2].value,
              'generado': this.rowwSelected.cells[3].value,
              'idGuardia': this.rowwSelected.cells[5].value,
              'idTurno': this.rowwSelected.cells[6].value
      }
    
    sessionStorage.setItem("calendariosProgramados","true");
    sessionStorage.setItem("calendarioSeleccinoado", JSON.stringify(calendario));
    this.router.navigate(["/buscadorColegiados"]);
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
    this.descargaLog.emit(true);
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
      console.log('this.rowGroups NUEVO: ', this.rowGroups)
      console.log('this.totalRegistros NUEVO: ', this.totalRegistros)
      this.to = this.totalRegistros;
      this.cd.detectChanges();
   }
  saveGuardias(){

    if(this.checkOrdenAndCamposObligatorios()){
      this.saveGuardiasEnLista.emit(this.rowGroups);
    }

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
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


