import { ElementRef, Renderer2, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Message } from 'primeng/components/common/api';
import { ConfirmationService } from "primeng/api";
import { Row, Cell } from './gestion-bajas-temporales.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { procesos_oficio } from '../../../../../permisos/procesos_oficio';

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
  @Output() estadoPendiente = new EventEmitter<any>();

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
  textSelected: String = "{0} bajas temporales seleccionadas";
  @Input() totalRegistros = 0;
  @ViewChild('table') table: ElementRef;
  historico: boolean = false;
  isLetrado: boolean = false;
  isDisabled: boolean = true;
  rowGroupsActualizar: Row[] = [];

  resaltadoDatos: boolean = false;

  comboTipo = [
    { label: "Vacaciones", value: "V" },
    { label: "Maternidad", value: "M" },
    { label: "Baja", value: "B" },
    { label: "Suspensión por sanción", value: "S" }
  ];
  @ViewChild("tablaFoco") tablaFoco: ElementRef;
  permisosTarjeta: boolean = true;
  disableAll: boolean = false;
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };

  constructor(
    private renderer: Renderer2,
    private persistenceService: PersistenceService,
    private pipe: DatePipe,
    private router: Router,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService
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
    this.resaltadoDatos=true;

    this.totalRegistros = this.rowGroups.length;

    this.numCabeceras = this.cabeceras.length;

    this.numColumnas = this.numCabeceras;

    this.historico = JSON.parse(sessionStorage.getItem("historico"));
    // Si es un colegiado y es un letrado, no podrá guardar/restablecer datos de la inscripcion/personales
    if (sessionStorage.getItem("isLetrado") != null && sessionStorage.getItem("isLetrado") != undefined) {
      this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    }
    this.commonsService.checkAcceso(procesos_oficio.bajastemporales)
      .then(respuesta => {
        this.permisosTarjeta = respuesta;
        this.persistenceService.setPermisos(this.permisosTarjeta);
        if (this.permisosTarjeta == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        } else if (this.persistenceService.getPermisos() != true) {
          this.disableAll = true;
          this.isDisabled = true;
        }
      }
      ).catch(error => console.error(error));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (sessionStorage.getItem("nuevo")) {
      this.nuevo();
    }
    sessionStorage.removeItem("nuevo");
  }

  onChangeMulti(event, rowPosition, cell) {
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
    let idGuardia = this.rowGroups[rowPosition].cells[7];
    let idTurno = this.rowGroups[rowPosition].cells[8];
    let idTurnoIncompatible = this.rowGroups[rowPosition].cells[5];
    let idGuardiaIncompatible = this.rowGroups[rowPosition].cells[6];
    let nombreTurnoInc = this.rowGroups[rowPosition].cells[9];
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
      let cellguardiaInc: Cell = new Cell();
      cellguardiaInc.type = 'text';
      cellguardiaInc.value = labelSelected;
      this.rowGroups[rowPosition].cells[10].value.push(labelSelected);
      this.nuevoFromCombo(turno, cellguardiaInc, idGuardia, idTurno, idTurnoIncompatible, idGuardiaIncompatible, nombreTurnoInc);
    }
  }
  nuevoFromCombo(turno, guardiaInc, idGuardia, idTurno, idTurnoIncompatible, idGuardiaIncompatible, nombreTurnoInc) {
    this.enableGuardar = true;
    let labelSelected = '';
    let row: Row = new Row();
    let cell1: Cell = new Cell();
    let cell2: Cell = new Cell();
    let cellInvisible: Cell = new Cell();
    let cellMulti: Cell = new Cell();
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
      if (comboObj.value == idGuardia.value) {
        labelSelected = comboObj.label;
      }
    });
    cellArr.type = 'invisible';
    cellArr.value = [labelSelected];
    if (idGuardia.value != '') {
      this.comboGuardiasIncompatibles.push({ label: labelSelected, value: idGuardia.value })
    }
    row.cells = [turno, guardiaInc, cellMulti, cell1, cell2, idTurno, idGuardia, idGuardiaIncompatible, idTurnoIncompatible, cellInvisible, cellArr];
    if (idGuardia.value != '') {
      this.rowGroups.unshift(row);
    }
    this.totalRegistros = this.rowGroups.length;
    this.rowGroupsAux = this.rowGroups;
  }
  validaCheck(texto) {
    return texto === 'Si';
  }
  selectRow(rowId, row) {
    if (this.selectedArray.includes(rowId)) {
      const i = this.selectedArray.indexOf(rowId);
      this.selectedArray.splice(i, 1);
    } else {
      this.selectedArray.push(rowId);
    }

    this.estadoPendiente.emit(this.selectedArray);

    if (this.selectedArray.length != 0) {
      this.anySelected.emit(true);
    } else {
      this.anySelected.emit(false);
    }

    this.addCellChange(row);
  }

  addCellChange(row: Row){
    let repetida = false;
    //Si es el primero lo añadimos directamente
    if(this.rowGroupsActualizar.length == 0){
      this.rowGroupsActualizar[0] = row;
      repetida = true;
    } else{
      //Recorremos el array de filas, si hay coincidencia ignoramos, si no esta la insertamos
      for(let i = 0; i <= this.rowGroupsActualizar.length; i  ++ ){
        if(this.rowGroupsActualizar[i] == row){
          repetida = true;
        }
      }
    }
    if(!repetida){
      this.rowGroupsActualizar[this.rowGroupsActualizar.length] = row;
    }
  }

  isSelected(id) {
    if (this.selectedArray.includes(id)) {
      return true;
    } else {
      return false;
    }
  }

  isAnySelected() {
    return this.selectedArray.length > 0;
  }

  sortData(sort: Sort) {
    //console.log("entro en el método Sort con valor:"+ sort.active+","+sort.direction);
    let data: Row[] = [];
    this.rowGroups = this.rowGroups.filter((row) => {
      data.push(row);
    });
    data = data.slice();
    if (!sort.active || sort.direction === '') {
      this.rowGroups = data;
      return;
    }

    this.rowGroups = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      for (let i = 0; i < this.cabeceras.length; i++) {
        let nombreCabecera = this.cabeceras[i].id;
        if (nombreCabecera == sort.active) {
          //console.log("a.cells["+i+"].type:"+a.cells[i].type);

          if (a.cells[i].type == 'datePickerFin' && b.cells[i].type == 'datePickerFin') {
            return compareDate(a.cells[i].value[0], b.cells[i].value[0], isAsc);
          }

          let valorA = a.cells[i].value;
          let valorB = b.cells[i].value;
          if (valorA != null && valorB != null) {
            if (isNaN(valorA)) { //Checked for numeric
              const dayA = valorA.substr(0, 2);
              const monthA = valorA.substr(3, 2);
              const yearA = valorA.substr(6, 10);
              //console.log("fecha a:"+ yearA+","+monthA+","+dayA);
              var dt = new Date(yearA, monthA, dayA);
              if (!isNaN(dt.getTime())) { //Checked for date
                return compareDate(a.cells[i].value, b.cells[i].value, isAsc);
              } else {
              }
            } else {
            }
          }

          return compare(a.cells[i].value, b.cells[i].value, isAsc);

        }
      }

    });

  }

  getComboLabel(key: string) {
    for (let i = 0; i < this.comboTipo.length; i++) {
      if (this.comboTipo[i].value == key) {
        return this.comboTipo[i].label;
      }
    }
    return "";
  }


  searchChange(x: any) {
    let isReturnArr = [];
    this.rowGroups = this.rowGroupsAux.filter((row) => {
      let isReturn = true;
      for (let j = 0; j < this.cabeceras.length; j++) {
        if (this.searchText[j] != " " && this.searchText[j] != undefined) {
          if (row.cells[j].value) {
            //console.log("tipo de celda:"+row.cells[j].type);
            if (row.cells[j].type == 'select') {
              let labelCombo = this.getComboLabel(row.cells[j].value);
              //console.log("valor de celda:"+labelCombo);
              if (!labelCombo.toLowerCase().includes(this.searchText[j].toLowerCase())) {
                isReturn = false;
                break;
              }
            } else if (!row.cells[j].value.toString().toLowerCase().includes(this.searchText[j].toLowerCase())) {
              isReturn = false;
              break;
            }
          } else {
            if (this.searchText[j] != "") {
              isReturn = false;
              break;
            }
          }
        }
      }
      if (isReturn) {
        return row;
      }

    });
    this.totalRegistros = this.rowGroups.length;
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
  fromReg(event) {
    this.from = Number(event) - 1;
  }
  toReg(event) {
    this.to = Number(event);
  }
  perPage(perPage) {
    this.numperPage = perPage;
  }

  fillFecha(event, cell, row) {
    this.styleObligatorio(event);
    this.onlyCheckDatos();
    if(event != null && event != undefined){
      if (cell.value[0] != undefined) {
        cell.value[0] = this.pipe.transform(event, 'dd/MM/yyyy');
        row.cells[5].value[1] = new Date(event);
      } else {
        cell.value = this.pipe.transform(event, 'dd/MM/yyyy');
        row.cells[5].value[1] = new Date(event);
      }
    } else{
      this.rowGroups[0].cells[4].value = '';
    }

  }

  fillFecha2(event, cell, row) {
    this.styleObligatorio(event);
    this.onlyCheckDatos();
    if(event != null && event != undefined){
      if (cell.value[0] != undefined) {
        cell.value[0] = this.pipe.transform(event, 'dd/MM/yyyy');
        cell.value[1] = new Date(row.cells[4].value);
      } else {
        cell.value = this.pipe.transform(event, 'dd/MM/yyyy');
      }
    } else{
      this.rowGroups[0].cells[5].value = '';
    }
  }

  styleObligatorio(evento){
    if(this.resaltadoDatos && (evento == undefined || evento == null || evento == "")){
      return this.commonsService.styleObligatorio(evento);
    }
  }

  onlyCheckDatos(){
    if(this.rowGroups[0].cells[2].value != "" && this.rowGroups[0].cells[3].value != "" &&
      this.rowGroups[0].cells[4].value != "" && (this.rowGroups[0].cells[5].value != null && this.rowGroups[0].cells[5].value[0] != "")){
      this.resaltadoDatos=false;
    } else{
      this.resaltadoDatos=true;
    }
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
    const now = Date.now();
    const myFormattedDate = this.pipe.transform(now, 'dd/MM/yyyy');

    if (sessionStorage.getItem("buscadorColegiados")) {

      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));

      this.usuarioBusquedaExpress.nombreAp = busquedaColegiado.apellidos + ", " + busquedaColegiado.nombre;

      this.usuarioBusquedaExpress.numColegiado = busquedaColegiado.nColegiado;

      sessionStorage.removeItem("buscadorColegiados")
    } else {
      this.usuarioBusquedaExpress.nombreAp = sessionStorage.getItem("nombCol");

      this.usuarioBusquedaExpress.numColegiado = sessionStorage.getItem("nCol");
    }

    sessionStorage.removeItem("nombCol");
    sessionStorage.removeItem("nCol");

    if (this.usuarioBusquedaExpress.nombreAp != "" || this.usuarioBusquedaExpress.numColegiado != "") {
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
      cell6.type = 'datePickerFin';
      cell6.value = ['', ''];
      cell7.type = 'text';
      cell7.value = myFormattedDate;
      cell8.type = 'text';
      cell8.value = 'Pendiente';
      cell9.type = 'text';
      cell9.value = myFormattedDate;
      cell10.type = 'invisible';
      cell10.value = true;
      row.cells = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9, cell10];
      row.id = 0;
      this.rowGroups.unshift(row);
      this.rowGroupsAux = this.rowGroups;
      this.totalRegistros = this.rowGroups.length;
      sessionStorage.removeItem("nuevo");
    }
  }
  inputChange(event, i, z) {
    this.enableGuardar = true;
  }

  eliminar() {
    this.delete.emit(this.selectedArray);
    this.totalRegistros = this.rowGroups.length;
    this.rowGroupsAux = this.rowGroups;
    //this.to = this.totalRegistros;
  }

  searchHistorical() {
    this.historico = !this.historico;
    sessionStorage.removeItem("historico");
    this.persistenceService.setHistorico(this.historico);
    this.searchHistorico.emit(this.historico);
  }

  checkGuardar() {
    this.onlyCheckDatos();
    if (this.rowGroupsActualizar[0].cells[2].value != "" && this.rowGroupsActualizar[0].cells[3].value != "" &&
      this.rowGroupsActualizar[0].cells[4].value != "" && (this.rowGroupsActualizar[0].cells[5].value != null && this.rowGroupsActualizar[0].cells[5].value[0] != "")) {
        this.modDatos.emit(this.rowGroupsActualizar);
    } else {
      this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.message.camposObligatorios") });
    }
    this.totalRegistros = this.rowGroupsActualizar.length;
  }

  checkDenegar() {
    this.denegar.emit(this.selectedArray);
    this.totalRegistros = this.rowGroups.length;
  }

  checkValidar() {
    this.validar.emit(this.selectedArray);
    this.totalRegistros = this.rowGroups.length;
  }

  checkAnular() {
    this.anular.emit(this.selectedArray);
    this.totalRegistros = this.rowGroups.length;
  }

  eliminarFromCombo(rowToDelete) {
    this.deleteFromCombo.emit(rowToDelete);
  }
  selectedAll(evento) {
    this.seleccionarTodo = evento;
  }
}

function compareDate(fechaA: any, fechaB: any, isAsc: boolean) {

  let dateA = null;
  let dateB = null;
  if (fechaA != null) {
    const dayA = fechaA.substr(0, 2);
    const monthA = fechaA.substr(3, 2);
    const yearA = fechaA.substr(6, 10);
    //console.log("fecha a:"+ yearA+","+monthA+","+dayA);
    dateA = new Date(yearA, monthA, dayA);
  }

  if (fechaB != null) {
    const dayB = fechaB.substr(0, 2);
    const monthB = fechaB.substr(3, 2);
    const yearB = fechaB.substr(6, 10);
    //console.log("fecha b:"+ yearB+","+monthB+","+dayB);
    dateB = new Date(yearB, monthB, dayB);
  }

  //console.log("comparacionDate isAsc:"+ isAsc+";");

  return compare(dateA, dateB, isAsc);


}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  //console.log("comparacion  a:"+ a+"; b:"+ b);

  if (typeof a === "string" && typeof b === "string") {
    //console.log("comparacion  de cadenas");
    a = a.toLowerCase();
    b = b.toLowerCase();
  }

  //console.log("compare isAsc:"+ isAsc+";");

  if (a == null && b != null) {
    return (1) * (isAsc ? 1 : -1);
  }
  if (a != null && b == null) {
    return (-1) * (isAsc ? 1 : -1);
  }

  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


