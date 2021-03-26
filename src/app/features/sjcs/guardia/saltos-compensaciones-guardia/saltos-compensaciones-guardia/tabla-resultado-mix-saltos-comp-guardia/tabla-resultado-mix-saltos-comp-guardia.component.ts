import { ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Row, Cell } from './tabla-resultado-mix-saltos-comp.service';
import { Message } from 'primeng/components/common/api';

interface NewCell {
  position: string,
  value: string
}

interface Cabecera {
  id: string,
  name: string
}

@Component({
  selector: 'app-tabla-resultado-mix-saltos-comp-guardia',
  templateUrl: './tabla-resultado-mix-saltos-comp-guardia.component.html',
  styleUrls: ['./tabla-resultado-mix-saltos-comp-guardia.component.scss']
})
export class TablaResultadoMixSaltosCompGuardiaComponent implements OnInit {

  info = new FormControl();
  msgs: Message[] = [];
  @Input() cabeceras: Cabecera[] = [];
  @Input() rowGroups: Row[];
  @Input() rowGroupsAux: Row[];
  @Input() rowGroupsInit: Row[];
  @Input() seleccionarTodo = false;
  @Input() comboGuardiasIncompatibles;
  @Output() anySelected = new EventEmitter<any>();
  @Output() save = new EventEmitter<Row[]>();
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() anularEvent = new EventEmitter<any>();
  @Output() deleteFromCombo = new EventEmitter<any>();
  @Output() searchHistory = new EventEmitter<boolean>();
  @ViewChild("tablaFoco") tablaFoco: ElementRef;

  historico: boolean = false;
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
  newInputValue = [];
  newInputValuePerRow = [];
  inputValues: NewCell = { position: '', value: '' };
  inputValuesArr: NewCell[] = [];
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
      values.push(row.cells[6].value);
    });

    values.forEach((v, i) => {
      let selecteCombo = { label: '', value: '' }
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

  onChangeMulti(event, rowPosition) {
    let deseleccionado;

    let selected = event.itemValue;
    let arraySelected = event.value;
    let labelSelected;
    if (arraySelected.includes(selected)) {
      deseleccionado = false;
    } else {
      deseleccionado = true;
    }
    let turno = this.rowGroups[rowPosition].cells[0];
    let guardia = this.rowGroups[rowPosition].cells[1];
    if (deseleccionado) {
      //eliminar doble
      this.eliminarFromCombo(this.rowGroups[rowPosition])
    } else {
      //guardar doble
      this.comboGuardiasIncompatibles.forEach(comboObj => {
        if (comboObj.value == selected) {
          labelSelected = comboObj.label;
        }
      })
      let cell: Cell = new Cell();
      cell.type = 'text';
      cell.value = labelSelected;
      this.nuevoFromCombo(turno, cell, guardia);
    }
  }
  nuevoFromCombo(turno, guardiaInc, idGuardia) {
    this.enableGuardar = true;
    let row: Row = new Row();
    let cell1: Cell = new Cell();
    let cell2: Cell = new Cell();
    let cellInvisible: Cell = new Cell();
    let cellMulti: Cell = new Cell();
    cell1.type = 'input';
    cell1.value = '';
    cell2.type = 'input';
    cell2.value = '0';
    cellInvisible.type = 'invisible';
    cellInvisible.value = ' ';
    cellMulti.combo = this.comboGuardiasIncompatibles;
    cellMulti.type = 'multiselect';
    cellMulti.value = [idGuardia.value];
    row.cells = [turno, guardiaInc, cellMulti, cell1, cell2, cellInvisible, cellInvisible, idGuardia];
    this.rowGroups.unshift(row);
    this.totalRegistros = this.rowGroups.length;
  }
  validaCheck(texto) {
    return texto === 'Si';
  }
  selectRow(rowId) {

    if (this.selectedArray.includes(rowId)) {
      const i = this.selectedArray.indexOf(rowId);
      this.selectedArray.splice(i, 1);
    } else {

      if ((this.historico && this.rowGroups[rowId].italic) || (!this.historico)) {
        this.selectedArray.push(rowId);
      }

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
  fromReg(event) {
    this.from = Number(event) - 1;
  }
  toReg(event) {
    this.to = Number(event);
  }
  perPage(perPage) {
    this.numperPage = perPage;
  }


  inputValueChange(event, i, z, cell) {
    let cells: Cell[] = [];
    let rowFilled: Row = new Row();
    rowFilled.cells = cells;
    if (this.inputValuesArr[z] != undefined) {
      if (z == 3) {
        this.inputValuesArr[z - 1] = { position: z, value: this.newInputValue[z] };
      } else {
        this.inputValuesArr[z] = { position: z, value: this.newInputValue[z] };
      }

    } else {
      this.inputValues.position = z;
      this.inputValues.value = this.newInputValue[z];
      this.inputValuesArr.push(Object.assign({}, this.inputValues));
    }
    this.rowGroups[this.rowGroups.length - 1].cells.forEach((cell, c) => {
      let cellFilled1 = new Cell();
      if (c != 2) {
        if (this.inputValuesArr[c] != undefined && c != 3) {
          let cellFilled = new Cell();
          cellFilled.value = this.inputValuesArr[c].value;
          cellFilled.type = 'newinput';
          cellFilled1 = cellFilled;
        }
        else if (this.inputValuesArr[c - 1] != undefined && c >= 3) {
          let cellFilled = new Cell();
          cellFilled.value = this.inputValuesArr[c - 1].value;
          cellFilled.type = 'newinput';
          cellFilled1 = cellFilled;
        }
        else {
          let cellFilled = new Cell();
          cellFilled.value = ' ';
          cellFilled.type = 'newinput';
          cellFilled1 = cellFilled;
        }

      } else {
        let cellFilled = new Cell();
        cellFilled.combo = this.comboGuardiasIncompatibles;
        cellFilled.type = 'multiselect';
        cellFilled1 = cellFilled;
      }
      rowFilled.cells.push(cellFilled1);
    })
    this.rowGroups[this.rowGroups.length - 1] = rowFilled;
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;

  }
  nuevo() {
    this.enableGuardar = true;
    let row: Row = new Row();
    let cell1: Cell = new Cell();
    let cellMulti: Cell = new Cell();
    cell1.type = 'newinput';
    cell1.value = ' ';
    cellMulti.combo = this.comboGuardiasIncompatibles;
    cellMulti.type = 'multiselect';
    row.cells = [cell1, cell1, cellMulti, cell1, cell1];
    this.rowGroups.unshift(row);
    this.totalRegistros = this.rowGroups.length;
  }

  inputChange(event, i, z) {
    this.enableGuardar = true;
  }

  guardar() {
    let anyEmptyArr = [];
    this.rowGroups.forEach(row => {
      if (row.cells[0].value == '' || row.cells[0].value == undefined || row.cells[1].value == '' || row.cells[1].value == undefined || row.cells[2].value == '' || row.cells[2].value == undefined || row.cells[4].value == '' || row.cells[4].value == undefined) {
        anyEmptyArr.push(true);
      } else {
        this.save.emit(this.rowGroups);
        this.enableGuardar = false;
        this.totalRegistros = this.rowGroups.length;
        anyEmptyArr.push(false);
      }

      if (anyEmptyArr.includes(true)) {
        this.showMsg('error', 'Error. Existen campos vacíos en la tabla.', '')
      } else {
        this.showMsg('success', 'Se ha guardado correctamente', '')
      }

    })
  }

  delete() {
    this.deleteEvent.emit(this.selectedArray);
  }

  eliminarFromCombo(rowToDelete) {
    this.deleteFromCombo.emit(rowToDelete);
  }

  toogleHistorico(valor: boolean) {
    this.historico = valor;
    this.searchHistory.emit(valor);
  }

  selectedAll(event) {
    this.seleccionarTodo = event;
  }

  restablecer() {
    this.rowGroups = this.rowGroupsInit;
    this.rowGroupsAux = this.rowGroupsInit;
    this.totalRegistros = this.rowGroups.length;
  }

  anular() {
    if (this.selectedArray != null && this.selectedArray.length > 0) {
      this.anularEvent.emit(this.selectedArray);
    }
  }

}
function compare(a: string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
