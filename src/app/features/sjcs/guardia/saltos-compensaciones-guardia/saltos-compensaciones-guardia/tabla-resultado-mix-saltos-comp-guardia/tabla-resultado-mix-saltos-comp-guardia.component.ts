import { ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Row, Cell } from './tabla-resultado-mix-saltos-comp.service';
import { Message } from 'primeng/components/common/api';
import { DatePipe } from '@angular/common';
import { SigaServices } from '../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SaltoCompItem } from '../../../../../../models/guardia/SaltoCompItem';
import { FileAlreadyExistException } from '@angular-devkit/core';
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
  comboColegiados = [];
  isDisabled;
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

  nuevo(grupo) {
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
    let cell11: Cell = new Cell();
    let cell12: Cell = new Cell();
    let cell13: Cell = new Cell();
    let cell14: Cell = new Cell();

    if (grupo){
        
      cell1.type = 'select-grupo';
      cell1.combo = this.comboTurnos;
      cell1.value = '';
      cell1.header = this.cabeceras[0].id;

      cell2.type = 'select-grupo';
      cell2.value = '';
      cell2.disabled = true;
      cell2.header = this.cabeceras[1].id;

      cell3.type = 'multiselect-grupo';
      cell3.disabled = true;
      cell3.value = '';
      cell3.header = this.cabeceras[2].id;
    }else{
        
      cell1.type = 'select';
      cell1.combo = this.comboTurnos;
      cell1.value = '';
      cell1.header = this.cabeceras[0].id;

      cell2.type = 'select';
      cell2.value = '';
      cell2.disabled = true;
      cell2.header = this.cabeceras[1].id;

      cell3.type = 'multiselect';
      cell3.disabled = true;
      cell3.value = '';
      cell3.header = this.cabeceras[2].id;
    }

    cell4.type = 'arrayText';
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
    cell9.header = 'idSaltosTurno';

    cell10.type = 'invisible';
    cell10.value = '';
    cell10.header = 'idTurno';

    cell11.type = 'invisible';
    cell11.value = '';
    cell11.header = 'idPersona';
    
    cell12.type = 'invisible';
    cell12.value = '';
    cell12.header = 'idGuardia';

    cell13.type = 'invisible';
    cell13.value = '';
    cell13.header = 'grupo';

    cell14.type = 'invisible';
    cell14.value = '';
    cell14.header = 'numeroColegiado';

    //TODO Falta añadir Grupo y Colegiado Grupo
    row.cells = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9, cell10, cell11, cell12, cell13, cell14];
    this.rowGroups.unshift(row);
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
  }

  guardar() {
    let error = false;

    this.rowGroups.forEach(row => {
      console.log("Row ->", row);
      if (
        row.cells[0].value == null || row.cells[0].value.trim() == '' ||
        row.cells[1].value == null || row.cells[1].value.trim() == '' ||
        row.cells[2].value == null ||
        row.cells[3].value == null || 
        row.cells[4].value == null || row.cells[4].value.trim() == '' ||
        row.cells[5].value == null || row.cells[5].value.trim() == '' ||
        row.cells[6].value == null || row.cells[6].value.trim() == ''
      ) {
        error = true;
      }
    });

    if (error) {
      this.showMsg('error', 'Error. Existen campos vacíos en la tabla.', '' );
    } else {
      console.log("Lista pre", this.rowGroups);
      this.saveEvent.emit(this.rowGroups);
      this.selectedArray = [];
    }
  }

  delete() {
    if (this.selectedArray != null && this.selectedArray.length > 0) {
      this.deleteEvent.emit(this.selectedArray);
      this.selectedArray = [];
    }
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
      this.selectedArray = [];
    }
  }

  fillFecha(event, cell) {
    cell.value = this.datepipe.transform(event, 'dd/MM/yyyy');
  }

  changeMultiSelect(row, cell) {
    if (cell.value.length > 1) {
      cell.value.shift();
    }
    const header = cell.header;
    if (header == 'nColegiado') {
      row.cells[3].value = '';
      let letrado = [];
      row.cells[2].value.forEach(element => {
        letrado.push(row.cells[2].combo.find(el => el.value == element).label.split(')')[1].trim());
      });
      row.cells[3].value = letrado;
      // Si es grupo se pone el grupo
      row.cells[12].value = null;
      //Si no, se pone el numColegiado
      row.cells[13].value = row.cells[2].value[0];
    }
  }

  changeMultiSelectGrupo(row, cell){
    if (cell.value.length > 1) {
      cell.value.shift();
    }
    const header = cell.header;
    if (header == 'nColegiado') {
      //Marcar todos los values que empiecen por grupo
      let values = [];
      row.cells[2].combo.forEach(element => {
        if (element.label.startsWith("["+row.cells[2].value[0].split('/')[0]+"]")){
          values.push(element.value);
        }
      });
      console.log("values ->", values);
      row.cells[2].value = values;
      row.cells[3].value = '';
      let letrado = "";
      row.cells[2].value.forEach(element => {
        letrado = letrado.concat(row.cells[2].combo.find(el => el.value == element).label.split(')')[1].trim());
        //Salto de linea
        letrado = letrado.concat(". ");
      });
      row.cells[3].value = letrado;
      // Si es grupo se pone el grupo
      row.cells[12].value = row.cells[2].value[0].split('/')[0];
      //Si no, se pone el numColegiado
      row.cells[13].value = null;
    }
  }

  changeSelect(row, cell) {
    const header = cell.header;
    if (header == 'turno') {
        row.cells[2].disabled = true;
        row.cells[2].value = '';
        row.cells[3].value = '';
      if (row.cells[0].value == null) {
        row.cells[1].disabled = true;
        row.cells[1].value = '';
      }else{
        row.cells[1].value = '';
        row.cells[1].disabled = false;
        this.getComboGuardia(cell.value, row, false);
      }
    } else if (header == 'guardia'){
      row.cells[2].value = '';
      row.cells[3].value = '';
      if (row.cells[1].value == null) {
        row.cells[2].disabled = true;
      }else{
        row.cells[2].disabled = false;
        this.getComboColegiados(row, false);
      }
    }
  }

  changeSelectGroup(row, cell) {
    const header = cell.header;
    if (header == 'turno') {
      row.cells[2].disabled = true;
      row.cells[2].value = '';
      row.cells[3].value = '';
      if (row.cells[0].value == null) {
        row.cells[1].disabled = true;
        row.cells[1].value = '';
      }else{
        row.cells[1].value = '';
        row.cells[1].disabled = false;
        this.getComboGuardia(cell.value, row, true);
      }
    } else if (header == 'guardia'){
      row.cells[2].value = '';
      row.cells[3].value = '';
      if (row.cells[1].value == null) {
        row.cells[2].disabled = true;
      }else{
        row.cells[2].disabled = false;
        this.getComboColegiados(row, true);
      }
    }
  }

  getComboGuardia(idTurno, row, grupo) {
    this.comboGuardias = [];
    let url;
    if (grupo){
      url = "busquedaGuardia_grupo";
    }else {
      url = "busquedaGuardia_noGrupo";
    }
    this.sigaServices.getParam(
      url, "?idTurno=" + idTurno).subscribe(
        data => {
          let comboGuardias = data.combooItems;
          this.commonsService.arregloTildesCombo(comboGuardias);
          this.comboGuardias = comboGuardias;
        },
        err => {
          console.log(err);
        },
        () => {
          row.cells[1].combo = this.comboGuardias;
        }
      );
  }

  getComboColegiados(row: Row, grupo) {

    this.comboColegiados = [];
    let params = new SaltoCompItem();
    params.idTurno = row.cells[0].value;
    params.idGuardia = row.cells[1].value;
    this.sigaServices.post(
      "saltosCompensacionesGuardia_comboColegiados", params).subscribe(
        data => {
          let comboColegiados = JSON.parse(data.body).letradosGuardiaItem;
          let error = JSON.parse(data.body).error;
          comboColegiados.forEach(combo => {
            if (grupo){
              this.comboColegiados.push({
                label:"["+combo.grupo+"]"+"("+combo.numeroColegiado+") "+combo.apellidos1+combo.apellidos2+", "+combo.nombre,
                value:combo.grupo+"/"+combo.numeroColegiado});
            }else{
              this.comboColegiados.push({
                label:"("+combo.numeroColegiado+") "+combo.apellidos1+combo.apellidos2+", "+combo.nombre,
                value:combo.numeroColegiado});
            }
          });
        },
        err => {
        },
        () => {
          this.rowGroups.find(el => el.id == row.id).cells[2].combo = this.comboColegiados;
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
