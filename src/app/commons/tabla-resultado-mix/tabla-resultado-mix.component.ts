import { ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Row, Cell } from './tabla-resultado-mix-incompatib.service';
import { Message } from 'primeng/components/common/api';
import { ValidationModule } from '../validation/validation.module';
@Component({
  selector: 'app-tabla-resultado-mix',
  templateUrl: './tabla-resultado-mix.component.html',
  styleUrls: ['./tabla-resultado-mix.component.scss']
})
export class TablaResultadoMixComponent implements OnInit {
  
  info = new FormControl();
  msgs: Message[] = [];
  @Input() cabeceras = [];
  @Input() rowGroups: Row[];
  @Input() rowGroupsAux: Row[];
  @Input() seleccionarTodo = false;
  @Input() comboGuardiasIncompatibles;
  @Output() anySelected = new EventEmitter<any>();
  @Output() save = new EventEmitter<Row[]>();
  @Output() delete = new EventEmitter<any>();
  @Output() deleteFromCombo = new EventEmitter<any>();

  cabecerasMultiselect = [];
  modalStateDisplay = true;
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
  from = 0;
  to = 10;
  numperPage = 10;
  enableGuardar = false;
  multiselectValue = [];
  multiselectLabels = [];
  cell = [];
  textFilter: string = "Seleccionar";
  textSelected: String = "{0} guardias seleccionadas";
  @Input() totalRegistros = 0;
  @ViewChild('table') table: ElementRef;


  constructor(
    private renderer: Renderer2
  ) {
    this.renderer.listen('window', 'click', (event: { target: HTMLInputElement; }) => {
      for (let i = 0; i < this.table.nativeElement.children.length; i++) {

        if (!event.target.classList.contains("selectedRowClass")) {
          this.selected = false;
          this.selectedArray = [];
        }
      }
    });
  }

  ngOnInit(): void {
    let values = [];
    let labels = [];
    let arrayOfSelected = [];
      this.rowGroups.forEach((row, i) => {
        //selecteCombo = {label: ?, value: row.cells[7].value}
        values.push(row.cells[6].value);
      });
      this.comboGuardiasIncompatibles.forEach(combo => {
        values.forEach(v => {
          if (combo.value == v){
            labels.push(combo.label)
          }
        });
       });
      values.forEach((v, i) => {
        let selecteCombo = {label: '', value: ''}
        selecteCombo.label = labels[i];
        selecteCombo.value = v;
        arrayOfSelected[i] = selecteCombo;
        this.multiselectValue[i] = arrayOfSelected[i];
      });
      this.multiselectLabels = labels;
    this.totalRegistros = this.rowGroups.length;
    this.numCabeceras = this.cabeceras.length;
    this.numColumnas = this.numCabeceras;
    this.cabeceras.forEach(cab => {
      this.cabecerasMultiselect.push(cab.name);
    })
  }

  onChangeMulti(event, rowPosition, cell){
    let deseleccionado;
   
    let selected = event.itemValue;
    let arraySelected = event.value;
    let labelSelected;
    if (arraySelected.includes(selected)){
      deseleccionado = false;
    } else {
      deseleccionado = true;
    }
    let turno = this.rowGroups[rowPosition].cells[0];
    let idGuardia = this.rowGroups[rowPosition].cells[7];
    let idTurno = this.rowGroups[rowPosition].cells[8];
    let idTurnoIncompatible = this.rowGroups[rowPosition].cells[5];
    let idGuardiaIncompatible = this.rowGroups[rowPosition].cells[6];
    let nombreTurnoInc = this.rowGroups[rowPosition].cells[9];
    if (deseleccionado){
      //eliminar doble
      this.eliminarFromCombo(this.rowGroups[rowPosition])
    } else {
      //guardar doble
      
      this.comboGuardiasIncompatibles.forEach(comboObj => {
        if ( comboObj.value == selected){
          labelSelected = comboObj.label;
        }
      })
      let cellguardiaInc:  Cell = new Cell();
      cellguardiaInc.type = 'text';
      cellguardiaInc.value = labelSelected;
      this.rowGroups[rowPosition].cells[10].value.push(labelSelected);
      this.nuevoFromCombo(turno, cellguardiaInc, idGuardia, idTurno, idTurnoIncompatible, idGuardiaIncompatible, nombreTurnoInc);
    }
  
  }
  nuevoFromCombo(turno, guardiaInc, idGuardia, idTurno, idTurnoIncompatible, idGuardiaIncompatible, nombreTurnoInc){
    this.enableGuardar = true;
    let labelSelected = '';
    let row: Row = new Row();
    let cell1: Cell = new Cell();
    let cell2: Cell = new Cell();
    let cellInvisible: Cell = new Cell();
    let cellMulti:  Cell = new Cell();
    let cellArr: Cell = new Cell();
    let idG;
    cell1.type = 'input';
    cell1.value = '';
    cell2.type = 'input';
    cell2.value = '0';
    cellInvisible.type = 'invisible';
    cellInvisible.value = nombreTurnoInc;
    cellMulti.combo = this.comboGuardiasIncompatibles;
    cellMulti.type = 'multiselect'; 
    cellMulti.value = [idGuardia.value];
    this.comboGuardiasIncompatibles.forEach(comboObj => {
      if ( comboObj.value == idGuardia.value){
        labelSelected = comboObj.label;
      }
    });
    cellArr.type = 'invisible';
    cellArr.value = [labelSelected];
    if (idGuardia.value != ''){
      this.comboGuardiasIncompatibles.push({ label: labelSelected, value: idGuardia.value})
    }
   
    row.cells = [turno, guardiaInc, cellMulti, cell1, cell2, idTurno, idGuardia, idGuardiaIncompatible, idTurnoIncompatible, cellInvisible, cellArr];
    if (idGuardia.value != ''){
    this.rowGroups.unshift(row);
    }
    this.totalRegistros = this.rowGroups.length;
    this.rowGroupsAux = this.rowGroups;
  }
  validaCheck(texto) {
    return texto === 'Si';
  }
  selectRow(rowId) {
 
    if (this.selectedArray.includes(rowId)) {
      const i = this.selectedArray.indexOf(rowId);
      this.selectedArray.splice(i, 1);
    } else {
      this.selectedArray.push(rowId);
    }
    if (this.selectedArray.length != 0) {
      this.anySelected.emit(true);
    } else {
      this.anySelected.emit(false);
    }

  }
  isSelected(id) {
    if (this.selectedArray.includes(id)) {
      return true;
    } else {
      return false;
    }
  }
  sortData(sort: Sort) {
    let data: Row[] = [];
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
      return resultado;
    });
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;

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
    this.rowGroupsAux = this.rowGroups;
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

  isPar(numero): boolean {
    return numero % 2 === 0;
  }
  fromReg(event){
    this.from = Number(event) - 1;
  }
  toReg(event){
    this.to = Number(event);
    if (this.to > this.totalRegistros){
      this.to = this.totalRegistros;
    }
  }
  perPage(perPage){
    this.numperPage = perPage;
  }

  nuevo(){
        /*{ type: 'text', value: res.nombreTurno },
    { type: 'text', value: res.nombreGuardia },
    { type: 'multiselect', combo: this.comboGuardiasIncompatibles, value: ArrComboValue },
    { type: 'input', value: res.motivos },
    { type: 'input', value: res.diasSeparacionGuardias },
    { type: 'invisible', value: res.idTurnoIncompatible },
    { type: 'invisible', value: res.idGuardiaIncompatible },
    { type: 'invisible', value: res.idGuardia },
    { type: 'invisible', value: res.idTurno },
    { type: 'invisible', value: res.nombreTurnoIncompatible },
    { type: 'invisible', value: res.nombreGuardiaIncompatible }]*/
    this.enableGuardar = true;
    let row: Row = new Row();
    let cell1: Cell = new Cell();
    let cell2: Cell = new Cell();
    let cell3: Cell = new Cell();
    let cell4: Cell = new Cell();
    let cell5: Cell = new Cell();
    let cell6: Cell = new Cell();
    let cell7: Cell = new Cell();
    let cell8: Cell = new Cell();
    let cell9: Cell = new Cell();
    let cell10: Cell = new Cell();
    let cellMulti:  Cell = new Cell();
    cell1.type = 'input';
    cell1.value = '';
    cell2.type = 'input';
    cell2.value = '';
    cell3.type = 'input';
    cell3.value = '';
    cell4.type = 'input';
    cell4.value = '';

    cell5.type = 'invisible';
    cell5.value = '';
    cell6.type = 'invisible';
    cell6.value = '';
    cell7.type = 'invisible';
    cell7.value = '';
    cell8.type = 'invisible';
    cell8.value = '';
    cell9.type = 'invisible';
    cell9.value = '';
    cell10.type = 'invisible';
    cell10.value = [];
    cellMulti.combo = this.comboGuardiasIncompatibles;
    cellMulti.type = 'multiselect'; 
    row.cells = [cell1, cell2, cellMulti, cell3, cell4, cell5, cell6, cell7, cell8, cell9, cell2];
    this.rowGroups.unshift(row);
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
    //this.to = this.totalRegistros;
  }
  inputChange(event, i, z, cell){
    this.enableGuardar = true;
  }

  guardar(){
    let anyEmptyArr = [];
    this.rowGroups.forEach(row =>{
      if(row.cells[0].value == '' ||  row.cells[0].value == null || row.cells[1].value == '' ||  row.cells[1].value == null || row.cells[2].value == '' ||  row.cells[2].value == null || row.cells[4].value == '' ||  row.cells[4].value == null){
        anyEmptyArr.push(true);
        return ;
      } else{
        anyEmptyArr.push(false);
      }
    })
    
    if (anyEmptyArr.includes(true)){
      this.showMsg('error', 'Error. Existen campos vacíos en la tabla.', '')
    }else{
      this.showMsg('success', 'Se ha guardado correctamente', '')
      this.save.emit( this.rowGroups);
      this.enableGuardar = false;
      this.totalRegistros = this.rowGroups.length;
    }
  }
  eliminar(){
  this.delete.emit(this.selectedArray);
  this.totalRegistros = this.rowGroups.length;
  this.rowGroupsAux = this.rowGroups;
  //this.to = this.totalRegistros;
  }

  eliminarFromCombo(rowToDelete){
    this.deleteFromCombo.emit(rowToDelete);
    this.rowGroupsAux = this.rowGroups;
  }
  selectedAll(evento){
    this.seleccionarTodo = evento;
  }
}
function compare(a: string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}