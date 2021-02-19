import { ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Row, Cell } from './tabla-resultado-order-cg.service';
@Component({
  selector: 'app-tabla-resultado-order',
  templateUrl: './tabla-resultado-order.component.html',
  styleUrls: ['./tabla-resultado-order.component.scss']
})
export class TablaResultadoOrderComponent implements OnInit {
  info = new FormControl();
  @Input() cabeceras = [];
  @Input() rowGroups: Row[];
  @Input() rowGroupsAux: Row[];
  rowGroupsOrdered = [];
  @Input() seleccionarTodo = false;
  @Output() anySelected = new EventEmitter<any>();
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
  @ViewChild('table') table: ElementRef;

  
  constructor(
    private renderer: Renderer2
  ) {
    this.renderer.listen('window', 'click',(event: { target: HTMLInputElement; })=>{
      for (let i = 0; i < this.table.nativeElement.children.length; i++) {

      if(!event.target.classList.contains("selectedRowClass")){
        this.selected = false;
        this.selectedArray = [];
      }
    }
    });
  }

  ngOnInit(): void {
    this.numCabeceras = this.cabeceras.length;
    this.numColumnas = this.numCabeceras;
    this.cabeceras.forEach(cab =>{
      this.cabecerasMultiselect.push(cab.name);
    })
    this.xArr = [];
    this.rowGroups.forEach((rg, i) =>{
      this.grupos.push(rg.cells[0]);
      let x = this.ordenValue(i);
      this.xArr.push(x);
    })
    
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
  selectRow(rowId){
    if(this.selectedArray.includes(rowId)){
      const i = this.selectedArray.indexOf(rowId);
      this.selectedArray.splice(i, 1);
    }else{
      this.positionSelected = rowId;
      this.selectedArray.push(rowId);
    }
    if(this.selectedArray.length != 0){
      this.anySelected.emit(true);
    }else{
      this.anySelected.emit(false);
    }
    
  }

  guardar(){
      this.ordenarGrupos();
      this.orderByOrder();
    let errorVacio = this.checkEmpty();
    let errorSecuencia = this.checkSequence();
    if (!errorVacio && !errorSecuencia){
      this.showMsg('success', 'Se ha guardado correctamente', '')
    } else if (errorVacio){
      this.showMsg('info', 'Error. Existen campos vacíos en la tabla.', '')
    }else if (errorSecuencia){
      this.showMsg('info', 'Error. Los valores en la columna "Orden" deben ser secuenciales.', '')
    }
    return errorVacio;
  }

  checkSequence(){
    let positions = "";
    const numbers = "123456789";
    let errorSecuencia = false;
    let errSeqArr = [];
    let err2 = false;
    this.rowGroups.forEach((row, i) => { 
      if (i < this.rowGroups.length - 1){
        if (this.rowGroups[i].cells[0].value != this.rowGroups[i + 1].cells[0].value){
          positions = positions + row.cells[1].value;
          errorSecuencia = numbers.indexOf(positions) === -1;
          errSeqArr.push(errorSecuencia);
          positions = "";
        } else {
          positions = positions + row.cells[1].value;
        }
      } else {
        positions = positions + row.cells[1].value;
        errorSecuencia = numbers.indexOf(positions) === -1;
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

  checkEmpty(){
    let errorVacio = false;
    this.rowGroups.forEach((row, i) => {
      row.cells.forEach(cell =>{
        if (cell.value == ''){
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
        if (this.rowGroups[i].cells[0].value != this.rowGroups[i + 1].cells[0].value){
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
        resultado = compare(a.cells[0].value, b.cells[0].value, true);
    return resultado ;
  });
  this.rowGroupsAux = this.rowGroups;
  }


valueChange(i, z, $event){
    this.rowGroups[i].cells[z].value = $event.target.value;
    if ( z ==0){
      this.rowGroups[i].cells[z].type = 'input';
      this.grupos[i].value = $event.target.value;
    }else if (z == 1){
      this.rowGroups[i].cells[z].type = 'position';
      this.xArr[i] = $event.target.value;
    }else{
      this.rowGroups[i].cells[z].type = $event.target.type;
    }
this.rowGroupsAux = this.rowGroups;
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
  moveRow(movement){
    let groupSelected = this.rowGroups[this.positionSelected].cells[0].value;
    this.rowGroupsAux.forEach((row, index)=> {
      
        if (movement == 'up'){
          if(Number(row.cells[0].value) == Number(groupSelected)){
            this.rowGroups[index].cells[0].value = (Number(groupSelected) - 1).toString();
          } else if (Number(row.cells[0].value) == Number(groupSelected) - 1){
            this.rowGroups[index].cells[0].value = groupSelected;
          }
        } else if (movement == 'down'){
          if(Number(row.cells[0].value) == Number(groupSelected)){
            this.rowGroups[index].cells[0].value = (Number(groupSelected) + 1).toString();
          } else if (Number(row.cells[0].value) == Number(groupSelected) + 1){
            this.rowGroups[index].cells[0].value = groupSelected;
          }
        }
      
    })
this.rowGroupsAux = this.rowGroups;
  }
  isSelected(id){
    if(this.selectedArray.includes(id)){
      return true;
    } else {
      return false;
    }
  }
  disableButton(type){
    let disable = false;
    if (this.positionSelected == 0 || this.grupos[this.positionSelected].value <= 1){
      this.unavailableUp = true;
    } else {
      this.unavailableUp = false;
    }
    if (this.positionSelected == this.grupos.length - 1 || this.grupos[this.positionSelected].value  >= this.grupos[this.grupos.length - 1]){
      this.unavailableDown = true;
    } else {
      this.unavailableDown = false;
    }

    if ( this.selectedArray.length != 1 || (this.unavailableUp && type == 'up')){
      disable = true;
    }else if ( this.selectedArray.length != 1 || (this.unavailableDown && type == 'down')){
      disable = true;
    }
    return disable;
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
      }

    isPar(numero):boolean {
      return numero % 2 === 0;
    }
  
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}