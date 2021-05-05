import { ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Row, Cell } from './tabla-resultado-mix-saltos-comp.service';
import { Message } from 'primeng/components/common/api';
import { DatePipe } from '@angular/common';
import { SigaServices } from '../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../_services/commons.service';
interface Cabecera {
  id: string,
  name: string,
  width: string;
}
@Component({
  selector: 'app-tabla-resultado-mix-saltos-comp-guardia',
  templateUrl: './tabla-resultado-mix-saltos-comp-guardia.component.html',
  styleUrls: ['./tabla-resultado-mix-saltos-comp-guardia.component.scss']
})
export class TablaResultadoMixSaltosCompGuardiaComponent implements OnInit {

  @Input() cabeceras: Cabecera[] = [];
  @Input() rowGroups: Row[];
  @Input() rowGroupsAux: Row[];
  @Input() rowGroupsInit: Row[];
  @Input() seleccionarTodo = false;
  @Input() totalRegistros = 0;
  @Input() comboTurnos = [];
  @Input() comboTipos = [];

  @Output() anySelected = new EventEmitter<any>();
  @Output() saveEvent = new EventEmitter<Row[]>();
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() anularEvent = new EventEmitter<any>();
  @Output() searchHistory = new EventEmitter<boolean>();

  @ViewChild("tablaFoco") tablaFoco: ElementRef;
  @ViewChild('table') table: ElementRef;

  msgs: Message[] = [];
  historico: boolean = false;
  cabecerasMultiselect = [];
  searchText = [];
  numCabeceras = 0;
  numColumnas = 0;
  selected = false;
  selectedArray = [];
  from = 0;
  to = 10;
  numperPage = 10;
  enableGuardar = false;
  multiselectValue = [];
  multiselectLabels = [];
  cell = [];
  textFilter: string = "Seleccionar";
  textSelected: String = "{0} guardias seleccionadas";
  comboGuardias = [];

  constructor(private renderer: Renderer2, private datepipe: DatePipe, private sigaServices: SigaServices, private commonsService: CommonsService) {
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
    });
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

  nuevo() {
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

    cell1.type = 'select';
    cell1.combo = this.comboTurnos;
    cell1.value = '';

    cell2.type = 'select';
    cell2.value = '';

    cell3.type = 'text';
    cell3.value = '';

    cell4.type = 'text';
    cell4.value = '';

    cell5.type = 'select';
    cell5.combo = this.comboTipos;
    cell5.value = '';

    cell6.type = 'datePicker';
    cell6.value = this.datepipe.transform(new Date(), 'dd/MM/yyyy');

    cell7.type = 'textarea';
    cell7.value = '';

    cell8.type = 'text';
    cell8.value = '';

    row.cells = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8];
    this.rowGroups.unshift(row);
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
  }

  guardar() {
    console.log("file: tabla-resultado-mix-saltos-comp-guardia.component.ts ~ line 379 ~ TablaResultadoMixSaltosCompGuardiaComponent ~ guardar ~ this.rowGroups", this.rowGroups);

    /*let anyEmptyArr = [];
    this.rowGroups.forEach(row => {
      if (row.cells[0].value == '' || row.cells[0].value == undefined || row.cells[1].value == '' || row.cells[1].value == undefined || row.cells[2].value == '' || row.cells[2].value == undefined || row.cells[4].value == '' || row.cells[4].value == undefined) {
        anyEmptyArr.push(true);
      } else {
        this.saveEvent.emit(this.rowGroups);
        this.enableGuardar = false;
        this.totalRegistros = this.rowGroups.length;
        anyEmptyArr.push(false);
      }

      if (anyEmptyArr.includes(true)) {
        this.showMsg('error', 'Error. Existen campos vacíos en la tabla.', '')
      } else {
        this.showMsg('success', 'Se ha guardado correctamente', '')
      }

    })*/
  }

  delete() {
    this.deleteEvent.emit(this.selectedArray);
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

  fillFecha(event, cell) {
    cell.value = this.datepipe.transform(event, 'dd/MM/yyyy');
  }

  changeMultiSelect(cell) {
    if (cell.value.length > 1) {
      cell.value.shift();
    }
  }

  changeSelect(row, cell) {
    const header = cell.header;

    if (header == 'turno') {
      row.cells[1].value = '';
      row.cells[2].value = [];
      row.cells[2].disabled = true;
      this.getComboGuardia(cell.value, row);
    }
  }

  getComboGuardia(idTurno, row) {
    this.comboGuardias = [];
    this.sigaServices.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + idTurno).subscribe(
        data => {
          let comboGuardias = data.combooItems;
          this.commonsService.arregloTildesCombo(comboGuardias);
          this.comboGuardias = comboGuardias;
        },
        err => {
          console.log(err);
        },
        () => {
          this.rowGroups[row.id].cells[1].combo = this.comboGuardias;
        }
      );
  }

  getTamanioColumn(cabecera: string) {
    return this.cabeceras.find(el => el.id == cabecera).width;
  }

}
function compare(a: string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
