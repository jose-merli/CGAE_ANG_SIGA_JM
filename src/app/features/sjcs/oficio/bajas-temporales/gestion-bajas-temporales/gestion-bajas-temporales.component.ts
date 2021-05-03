import { ElementRef, Renderer2, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Message } from 'primeng/components/common/api';
import { Row, Cell } from './gestion-bajas-temporales.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate/translation.service';

interface GuardiaI {
  label: string,
  value: string
}
interface NewCell {
  position: string,
  value: string
}
@Component({
  selector: 'app-gestion-bajas-temporales',
  templateUrl: './gestion-bajas-temporales.component.html',
  styleUrls: ['./gestion-bajas-temporales.component.scss']
})
export class GestionBajasTemporalesComponent implements OnInit {
  
  info = new FormControl();
  msgs: Message[] = [];
  @Input() cabeceras = [];
  @Input() rowGroups: Row[];
  @Input() rowGroupsAux: Row[];
  @Input() seleccionarTodo = false;
  @Input() comboGuardiasIncompatibles;
  @Output() anySelected = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() deleteFromCombo = new EventEmitter<any>();
  @Output() denegar = new EventEmitter<any>();
  @Output() anular = new EventEmitter<any>();
  @Output() validar = new EventEmitter<any>();
  @Output() searchHistorico = new EventEmitter<any>();
  @Output() guardar = new EventEmitter<any>();
  @Output() modDatos = new EventEmitter<any>();

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
  inputValues: NewCell = {position: '', value: ''};
  inputValuesArr: NewCell[] = [];
  enableGuardar = false;
  multiselectValue = [];
  multiselectLabels = [];
  cell = [];
  textFilter: string = "Seleccionar";
  textSelected: String = "{0} bajas temporales seleccionadas";
  @Input() totalRegistros = 0;
  @ViewChild('table') table: ElementRef;
  historico: boolean = false;
  isLetrado: boolean = false;

  comboTipo = [
    { label: "Vacaciones", value: "V" },
    { label: "Maternidad", value: "M" },
    { label: "Baja", value: "B" },
    { label: "Suspensión por sanción", value: "S" }
  ];
  @ViewChild("tablaFoco") tablaFoco: ElementRef;

  usuarioBusquedaExpress = {​​​​​​​​​
    numColegiado: '',
    nombreAp: ''
  }​​​​​​​​​;

  constructor(
    private renderer: Renderer2,
    private persistenceService: PersistenceService,
    private pipe : DatePipe,
		private router: Router,
    private translateService: TranslateService
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

  ngOnInit() {
    this.totalRegistros = this.rowGroups.length;

    this.numCabeceras = this.cabeceras.length;

    this.numColumnas = this.numCabeceras;

    // Si es un colegiado y es un letrado, no podrá guardar/restablecer datos de la inscripcion/personales
    if (sessionStorage.getItem("isLetrado") != null && sessionStorage.getItem("isLetrado") != undefined) {
      this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(sessionStorage.getItem("nuevo")){
      this.nuevo();
    }
    sessionStorage.removeItem("nuevo");
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
    console.log('idGuardiaIncompatible: ', idGuardiaIncompatible)
    console.log('idGuardia: ', idGuardia)
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
    console.log('idGuardia.value: ', idGuardia.value)
    console.log('this.comboGuardiasIncompatibles: ', this.comboGuardiasIncompatibles)
    console.log('cellMulti.value: ', cellMulti.value)
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

  isPar(numero): boolean {
    return numero % 2 === 0;
  }
  fromReg(event){
    this.from = Number(event) - 1;
  }
  toReg(event){
    this.to = Number(event);
  }
  perPage(perPage){
    this.numperPage = perPage;
  }

  fillFecha(event, cell) {
    cell.value = this.pipe.transform(event, 'dd/MM/yyyy');
  }
 
  inputValueChange(event, i , z, cell){
    let cells: Cell[] = [];
    let rowFilled: Row =  new Row();
    rowFilled.cells = cells;
    if (this.inputValuesArr[z]  != undefined){
      if (z == 3){
        this.inputValuesArr[z - 1] = { position: z , value: this.newInputValue[z]};
      }else{
        this.inputValuesArr[z] = { position: z , value: this.newInputValue[z]};
      }
     
    }else{
      this.inputValues.position = z;
      this.inputValues.value = this.newInputValue[z];
      this.inputValuesArr.push(Object.assign({},this.inputValues));
    }
             this.rowGroups[this.rowGroups.length -1].cells.forEach((cell, c) => {
              let cellFilled1 = new Cell();
            if (c != 2){  
              if (this.inputValuesArr[c]!= undefined && c != 3){
                let cellFilled = new Cell();
                cellFilled.value = this.inputValuesArr[c].value;
                cellFilled.type = 'newinput';
                cellFilled1 = cellFilled;
              }
                else if (this.inputValuesArr[c-1]!= undefined && c >= 3){
                  let cellFilled = new Cell();
                  cellFilled.value = this.inputValuesArr[c-1].value;
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

  nuevo(){
    const now = Date.now();
    const myFormattedDate = this.pipe.transform(now, 'dd/MM/yyyy');

    if(sessionStorage.getItem("buscadorColegiados")){​​

      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));

      this.usuarioBusquedaExpress.nombreAp=busquedaColegiado.apellidos+", "+busquedaColegiado.nombre;

      this.usuarioBusquedaExpress.numColegiado=busquedaColegiado.nColegiado;
    }​​else{
      this.usuarioBusquedaExpress.nombreAp=sessionStorage.getItem("nombCol");

      this.usuarioBusquedaExpress.numColegiado=sessionStorage.getItem("nCol");
    }

    sessionStorage.removeItem("nombCol");
    sessionStorage.removeItem("nCol");

    if(this.usuarioBusquedaExpress.nombreAp != "" || this.usuarioBusquedaExpress.numColegiado != ""){
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

      cell1.type = 'text';
      cell1.value = this.usuarioBusquedaExpress.numColegiado;
      cell2.type = 'text';
      cell2.value = this.usuarioBusquedaExpress.nombreAp;
      cell3.type = 'select';
      cell3.combo = this.comboTipo;
      cell3.value = '';
      cell4.type = 'input';
      cell4.value = '';
      cell5.type = 'datePicker';
      cell5.value = '';
      cell6.type = 'datePicker';
      cell6.value = '';
      cell7.type = 'text';
      cell7.value = myFormattedDate;
      cell8.type = 'text';
      cell8.value = 'Pendiente';
      cell9.type = 'text';
      cell9.value = myFormattedDate;
      cell10.type = 'invisible';
      cell10.value = true;
      row.cells = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9, cell10];
      this.rowGroups.unshift(row);
      this.rowGroupsAux = this.rowGroups;
      this.totalRegistros = this.rowGroups.length;
      sessionStorage.removeItem("nuevo");
    }
}
  inputChange(event, i, z){
    this.enableGuardar = true;
  }
  
  eliminar(){
  this.delete.emit(this.selectedArray);
  this.totalRegistros = this.rowGroups.length;
  this.rowGroupsAux = this.rowGroups;
  //this.to = this.totalRegistros;
  }

  searchHistorical() {
    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    this.searchHistorico.emit(this.historico);
  }

  checkGuardar(){
    if(this.rowGroups[0].cells[2].value != "" && this.rowGroups[0].cells[3].value != "" && this.rowGroups[0].cells[4].value != "" && this.rowGroups[0].cells[5].value != ""){
      this.modDatos.emit(this.rowGroups);
    }else{
      this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.message.camposObligatorios")});
    }
    this.totalRegistros = this.rowGroups.length;
  }

  checkDenegar(){
    this.denegar.emit(this.selectedArray);
    this.totalRegistros = this.rowGroups.length;
  }

  checkValidar(){
    this.validar.emit(this.selectedArray);
    this.totalRegistros = this.rowGroups.length;
  }

  checkAnular(){
    this.anular.emit(this.selectedArray);
    this.totalRegistros = this.rowGroups.length;
  }

  eliminarFromCombo(rowToDelete){
    this.deleteFromCombo.emit(rowToDelete);
  }
  selectedAll(evento){
    this.seleccionarTodo = evento;
  }
}
function compare(a: string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}