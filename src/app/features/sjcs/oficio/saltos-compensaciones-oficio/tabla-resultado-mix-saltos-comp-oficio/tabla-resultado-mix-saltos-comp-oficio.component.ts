import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { Sort } from '@angular/material';
import { Message } from 'primeng/api';
import { SaltoCompItem } from '../../../../../models/guardia/SaltoCompItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { Cell, Row } from './tabla-resultado-mix-saltos-comp-oficio.service';

interface Cabecera {
  id: string,
  name: string
}

@Component({
  selector: 'app-tabla-resultado-mix-saltos-comp-oficio',
  templateUrl: './tabla-resultado-mix-saltos-comp-oficio.component.html',
  styleUrls: ['./tabla-resultado-mix-saltos-comp-oficio.component.scss']
})
export class TablaResultadoMixSaltosCompOficioComponent implements OnInit, OnChanges {

  @Input() cabeceras: Cabecera[] = [];
  @Input() rowGroups: Row[];
  @Input() rowGroupsAux: Row[];
  @Input() seleccionarTodo = false;
  @Input() totalRegistros = 0;
  @Input() comboTurnos = [];
  @Input() comboTipos = [];
  @Input() emptyResults: boolean = false;
  @Input() historico: boolean = false;

  @Output() anySelected = new EventEmitter<any>();
  @Output() saveEvent = new EventEmitter<Row[]>();
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() anularEvent = new EventEmitter<any>();
  @Output() searchHistory = new EventEmitter<boolean>();

  @ViewChild("tablaFoco") tablaFoco: ElementRef;
  @ViewChild('table') table: ElementRef;

  msgs: Message[] = [];
  cabecerasMultiselect = [];
  searchText = [];
  numCabeceras = 0;
  numColumnas = 0;
  selected = false;
  selectedArray = [];
  from = 0;
  to = 10;
  numperPage = 10;
  multiselectValue = [];
  multiselectLabels = [];
  cell = [];
  textFilter: string = "Seleccionar";
  textSelected: String = "{0} guardias seleccionadas";
  comboGuardias = [];
  comboColegiados = [];
  progressSpinner: boolean = false;
  isDisabled: boolean = true;

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

  ngOnInit() {

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

  selectRow(rowId, cells) {

    if (cells[8].value != null && cells[8].value != '') {
      if (this.selectedArray.includes(rowId)) {
        const i = this.selectedArray.indexOf(rowId);
        this.selectedArray.splice(i, 1);
      } else {

        if ((this.historico && this.rowGroups[rowId].italic) || (!this.historico)) {
          this.selectedArray.push(rowId);
        }

      }
    }

    if (this.selectedArray.length != 0) {
      this.anySelected.emit(true);
      this.isDisabled = false;
    } else {
      this.anySelected.emit(false);
      this.isDisabled = true;
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

  showMsg(msg) {
    this.msgs = [];
    this.msgs.push({
      severity: msg.severity,
      summary: msg.summary,
      detail: msg.detail
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

    cell1.type = 'select';
    cell1.combo = this.comboTurnos;
    cell1.value = '';
    cell1.header = this.cabeceras[0].id;

    cell2.type = 'select';
    cell2.value = '';
    cell2.disabled = true;
    cell2.header = this.cabeceras[1].id;

    cell3.type = 'select';
    cell3.value = '';
    cell3.disabled = true;
    cell3.header = this.cabeceras[2].id;

    cell4.type = 'text';
    cell4.value = '';
    cell4.header = this.cabeceras[3].id;

    cell5.type = 'select';
    cell5.combo = this.comboTipos;
    cell5.value = '';
    cell5.header = this.cabeceras[4].id;

    cell6.type = 'datePicker';
    cell6.value = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
    cell6.header = this.cabeceras[5].id;

    cell7.type = 'textarea';
    cell7.value = '';
    cell7.header = this.cabeceras[6].id;

    cell8.type = 'text';
    cell8.value = '';
    cell8.header = this.cabeceras[7].id;

    cell9.type = 'invisible';
    cell9.value = '';
    cell9.header = 'invisible';

    row.cells = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9];
    row.id = this.totalRegistros;
    this.rowGroups.unshift(row);
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
    this.tablaFoco.nativeElement.scrollIntoView();
  }

  guardar() {

    let error = false;

    this.rowGroups.forEach(row => {
      if (
        row.cells[0].value == null || row.cells[0].value.trim() == '' ||
        row.cells[1].value == null || row.cells[1].value.trim() == '' ||
        row.cells[2].value == null || row.cells[2].value.trim() == '' ||
        row.cells[3].value == null || row.cells[3].value.trim() == '' ||
        row.cells[4].value == null || row.cells[4].value.trim() == '' ||
        row.cells[5].value == null || row.cells[5].value.trim() == '' ||
        row.cells[6].value == null || row.cells[6].value.trim() == ''
      ) {
        error = true;
      }
    });

    if (error) {
      this.showMsg({ severity: 'error', summary: 'Error. Existen campos vacíos en la tabla.', detail: '' });
    } else {
      this.saveEvent.emit(this.rowGroups);
    }
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
    this.selectedArray = [];

    if (event) {
      this.rowGroups.forEach(row => {
        if (row.cells[8].value != null && row.cells[8].value != '') {

          if ((this.historico && this.rowGroups[row.id].italic) || (!this.historico)) {
            this.selectedArray.push(row.id);
          }

        }
      });
    }

  }

  restablecer() {
    this.progressSpinner = true;
    this.rowGroups = [];
    this.rowGroups = JSON.parse(sessionStorage.getItem("rowGroupsInitSaltCompOficio"));
    this.rowGroupsAux = [];
    this.rowGroupsAux = JSON.parse(sessionStorage.getItem("rowGroupsInitSaltCompOficio"));
    this.totalRegistros = this.rowGroups.length;
    this.progressSpinner = false;
    this.showMsg({ severity: "success", summary: 'Operación realizada con éxito', detail: 'Los registros ha sido restablecidos' });
    this.tablaFoco.nativeElement.scrollIntoView();
  }

  anular() {
    if (this.selectedArray != null && this.selectedArray.length > 0) {
      this.anularEvent.emit(this.selectedArray);
    }
  }

  fillFecha(event, cell) {
    cell.value = this.datepipe.transform(event, 'dd/MM/yyyy');
  }

  changeSelect(row: Row, cell) {
    const header = cell.header;

    if (header == 'turno') {
      if (row.cells[0].value == null) {
        row.cells[1].disabled = true;
        row.cells[1].value = '';
      } else {
        row.cells[1].value = '';
        row.cells[1].disabled = false;
      }
      row.cells[2].value = '';
      row.cells[2].disabled = true;
      row.cells[3].value = '';
      this.getComboGuardia(cell.value, row);
    } else if (header == 'guardia') {
      if (row.cells[1].value != null) {
        row.cells[2].disabled = false;
      }
      row.cells[2].value = '';
      row.cells[3].value = '';
      this.getComboColegiados(row);
    } else if (header == 'nColegiado') {
      row.cells[3].value = '';
      let letrado = row.cells[2].combo.find(el => el.value == row.cells[2].value).label.split(')')[1].trim();
      row.cells[3].value = letrado;
    }
  }

  getComboGuardia(idTurno, row) {
    this.comboGuardias = [];
    this.sigaServices.getParam(
      "busquedaGuardia_comboGuardia_Nogrupo", "?idTurno=" + idTurno).subscribe(
        data => {
          let comboGuardias = data.combooItems;
          this.commonsService.arregloTildesCombo(comboGuardias);
          this.comboGuardias = comboGuardias;
        },
        err => {
          console.log(err);
        },
        () => {
          this.rowGroups.find(el => el.id == row.id).cells[1].combo = this.comboGuardias;
        }
      );
  }

  getComboColegiados(row: Row) {

    this.comboColegiados = [];
    let params = new SaltoCompItem();
    params.idTurno = row.cells[0].value;
    params.idGuardia = row.cells[1].value;

    this.sigaServices.post(
      "saltosCompensacionesOficio_comboColegiados", params).subscribe(
        data => {
          let comboColegiados = JSON.parse(data.body).combooItems;
          let error = JSON.parse(data.body).error;
          this.comboColegiados = comboColegiados;
        },
        err => {
          console.log(err);
        },
        () => {
          this.rowGroups.find(el => el.id == row.id).cells[2].combo = this.comboColegiados;
        }
      );
  }

  isNew(row: Row) {
    return (row.cells[8].value == null || row.cells[8].value == '');
  }


  isSelectableInHistorical(row: Row) {
    return (row.italic != undefined && row.italic != null && row.italic);
  }

  ngOnChanges(changes: SimpleChanges) {

    if (sessionStorage.getItem("rowGroupsInitSaltCompOficio")) {
      sessionStorage.removeItem("rowGroupsInitSaltCompOficio");
    }

    sessionStorage.setItem("rowGroupsInitSaltCompOficio", JSON.stringify(changes.rowGroups.currentValue));
  }

}
function compare(a: string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
