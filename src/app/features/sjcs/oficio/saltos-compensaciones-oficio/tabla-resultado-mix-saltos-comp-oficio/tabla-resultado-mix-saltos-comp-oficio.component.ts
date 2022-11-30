import { DatePipe, Location } from '@angular/common';
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
  @Input() activacionEditar: boolean = false;

  @Output() anySelected = new EventEmitter<any>();
  @Output() saveEvent = new EventEmitter<Row[]>();
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() anularEvent = new EventEmitter<any>();
  @Output() searchHistory = new EventEmitter<boolean>();

  @ViewChild("tablaFoco") tablaFoco: ElementRef;
  @ViewChild('table') table: ElementRef;

  msgs: Message[] = [];
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
  comboColegiados = [];
  progressSpinner: boolean = false;
  isDisabled: boolean = true;
  isDisabled2: boolean = true;
  disableTipo: boolean = true;
  disabledCheck: boolean = false;
  disabledRow = 0;
  contadorNuevo = 0;
  disableButtons = false;
  showVolver = false;

  constructor(private renderer: Renderer2, private datepipe: DatePipe, private sigaServices: SigaServices, private commonsService: CommonsService, private location: Location) {
    /* this.renderer.listen('window', 'click', (event: { target: HTMLInputElement; }) => {
      for (let i = 0; i < this.table.nativeElement.children.length; i++) {

        if (!event.target.classList.contains("selectedRowClass")) {
          this.selected = false;
          this.selectedArray = [];
        }
      }
    }); */
  }

  ngOnInit() {
    this.totalRegistros = this.rowGroups.length;
    this.numCabeceras = this.cabeceras.length;
    this.numColumnas = this.numCabeceras;
    if(sessionStorage.getItem("fromTurnoOficio") === "true"){
      this.disableButtons = true;
      this.disableTipo = false;
      this.showVolver = true;
    }else{
      this.disableButtons = false;
      this.showVolver = false;
    }
  }

  selectRow(rowId, cells) {

    // comprobamos si existe idSaltosTurno para no permitir que se seleccione un registro nuevo
    if (!this.emptyResults && cells[7].value != null && cells[7].value != '') {
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
        if (nombreCabecera == sort.active){
          //console.log("a.cells["+i+"].type:"+a.cells[i].type);

          if (a.cells[i].type=='datePickerFin' && b.cells[i].type=='datePickerFin'){
            return compareDate(a.cells[i].value[0], b.cells[i].value[0], isAsc);
          }

          let valorA = a.cells[i].value;
          let valorB = b.cells[i].value;
          if (valorA!=null && valorB!=null){
            if(isNaN(valorA)){ //Checked for numeric
              const dayA = valorA.substr(0, 2) ;
              const monthA = valorA.substr(3, 2);
              const yearA = valorA.substr(6, 10);
              //console.log("fecha a:"+ yearA+","+monthA+","+dayA);
              var dt=new Date(yearA, monthA, dayA);
              if(!isNaN(dt.getTime())){ //Checked for date
                return compareDate(a.cells[i].value, b.cells[i].value, isAsc);
              }else{
              }
            } else{
            }
          }

          return compare(a.cells[i].value, b.cells[i].value, isAsc);
          
        }
      }
 
    });

  }


  getComboLabel(key: string){
    for (let i = 0; i < this.comboTipos.length; i++){
      if (this.comboTipos[i].value == key){
        return this.comboTipos[i].label;
      }
    }
    return "";
  }


  searchChange(x: any) {
    let isReturnArr = [];
    this.rowGroups = this.rowGroupsAux.filter((row) => {
      let isReturn = true;
      for(let j=0; j<this.cabeceras.length;j++){
        if (this.searchText[j] != " " &&  this.searchText[j] != undefined){
          if (row.cells[j].value){
            //console.log("tipo de celda:"+row.cells[j].type);
            if(row.cells[j].type == 'select'){
              let labelCombo = this.getComboLabel(row.cells[j].value);
              //console.log("valor de celda:"+labelCombo);
              if (!labelCombo.toLowerCase().includes(this.searchText[j].toLowerCase())){
                isReturn = false;
                break;
              }
            } else if (!row.cells[j].value.toString().toLowerCase().includes(this.searchText[j].toLowerCase())){
              isReturn = false;
              break;
            }
          }else{
              if (this.searchText[j]!=""){
                isReturn = false;
                break;
              }
          }
        }
      }
      if (isReturn){
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
    this.disabledCheck = true;
    this.isDisabled2 = false;
    this.disableTipo = false;
    this.contadorNuevo = this.contadorNuevo + 1;
    if ((this.contadorNuevo - 1) != 0) {
      this.disabledRow = this.disabledRow + 1;
    }

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

    cell1.type = 'select';
    cell1.combo = this.comboTurnos;
    cell1.value = '';
    cell1.header = this.cabeceras[0].id;

    cell2.type = 'select';
    cell2.value = '';
    cell2.disabled = true;
    cell2.header = this.cabeceras[1].id;

    cell3.type = 'text';
    cell3.value = '';
    cell3.header = this.cabeceras[2].id;

    cell4.type = 'select-tipo';
    cell4.combo = this.comboTipos;
    cell4.value = '';
    cell4.header = this.cabeceras[3].id;

    cell5.type = 'datePicker';
    cell5.value = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
    cell5.header = this.cabeceras[4].id;

    cell6.type = 'textarea';
    cell6.value = '';
    cell6.header = this.cabeceras[5].id;

    cell7.type = 'text';
    cell7.value = '';
    cell7.header = this.cabeceras[6].id;

    cell8.type = 'invisible';
    cell8.value = '';
    cell8.header = 'idSaltosTurno';

    cell9.type = 'invisible';
    cell9.value = '';
    cell9.header = 'idTurno';

    cell10.type = 'invisible';
    cell10.value = '';
    cell10.header = 'idPersona';

    row.cells = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9, cell10];
    row.id = this.totalRegistros;
    this.rowGroups.unshift(row);
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
    this.tablaFoco.nativeElement.scrollIntoView();


    if (this.emptyResults) {
      this.rowGroups.pop();
      this.emptyResults = false;
    }
    
  }

  guardar() {
    let error = false;

    this.rowGroups.forEach(row => {
      if (
        (row.cells[0].value != undefined &&
        row.cells[1].value != undefined &&
        row.cells[2].value != undefined &&
        row.cells[3].value != undefined &&
        row.cells[4].value != undefined &&
        row.cells[5].value != undefined)  
        &&
        (row.cells[0].value == null || row.cells[0].value.trim() == '' ||
        row.cells[1].value == null || row.cells[1].value.trim() == '' ||
        row.cells[2].value == null || row.cells[2].value.trim() == '' ||
        row.cells[3].value == null || row.cells[3].value.trim() == '' ||
        row.cells[4].value == null || row.cells[4].value.trim() == '' ||
        row.cells[5].value == null || row.cells[5].value.trim() == '')
      ) {
        error = true;
      }
    });

    if (error) {
      this.showMsg({ severity: 'error', summary: 'Error. Existen campos vacíos en la tabla.', detail: '' });
    } else {
      this.disabledRow = 0;
      this.contadorNuevo = 0;
      this.isDisabled2 = true;
      this.disableTipo = true;
      this.disabledCheck = false;
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
    this.selectedArray = [];

    if (event) {
      this.rowGroups.forEach(row => {
        if (row.cells[7].value != null && row.cells[7].value != '') {

          if ((this.historico && this.rowGroups[row.id].italic) || (!this.historico)) {
            this.selectedArray.push(row.id);
          }

        }
      });
    }

  }

  restablecer() {
    this.disabledRow = 0;
    this.contadorNuevo = 0;
    this.isDisabled2 = true;
    this.disableTipo = true;
    this.disabledCheck = false;
    this.selectedArray = [];
    this.progressSpinner = true;
    this.rowGroups = [];
    this.rowGroups = JSON.parse(sessionStorage.getItem("rowGroupsInitSaltCompOficio"));
    this.rowGroupsAux = [];
    this.rowGroupsAux = JSON.parse(sessionStorage.getItem("rowGroupsInitSaltCompOficio"));
    this.totalRegistros = this.rowGroups.length;
    this.progressSpinner = false;
    this.showMsg({ severity: "success", summary: 'Operación realizada con éxito', detail: 'Los registros ha sido restablecidos' });
    this.tablaFoco.nativeElement.scrollIntoView();

    if (this.rowGroups.length == 0 || (this.rowGroups.length == 1 && this.rowGroups[0].cells[0].type == 'empty')) {
      this.emptyResults = true;
      this.rowGroups = [
        {
          id: 0,
          cells: [
            {
              type: 'empty',
              value: "No hay resultados",
              combo: null,
              disabled: false,
              header: null
            }
          ],
          italic: false
        }
      ];
    } else {
      this.emptyResults = false;
    }

  }

  anular() {
    this.disabledRow = 0;
    this.contadorNuevo = 0;
    this.isDisabled2 = true;
    this.disableTipo = true;
    this.disabledCheck = false;
    if (this.selectedArray != null && this.selectedArray.length > 0) {
      this.anularEvent.emit(this.selectedArray);
      this.selectedArray = [];
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
        this.getComboColegiados(row);
      }
      row.cells[2].value = '';
    } else if (header == 'nColegiado') {
      row.cells[2].value = '';
      let letrado = row.cells[1].combo.find(el => el.value == row.cells[1].value).label.split(')')[1].trim();
      row.cells[2].value = letrado;
    }
  }

  getComboColegiados(row: Row) {

    this.comboColegiados = [];
    let params = new SaltoCompItem();
    params.idTurno = row.cells[0].value;

    this.sigaServices.post(
      "saltosCompensacionesOficio_comboColegiados", params).subscribe(
        data => {
          let comboColegiados = JSON.parse(data.body).combooItems;
          let error = JSON.parse(data.body).error;
          this.comboColegiados = comboColegiados;
        },
        err => {
        },
        () => {
          this.rowGroups.find(el => el.id == row.id).cells[1].combo = this.comboColegiados;
        }
      );
  }

  isNew(row: Row) {
    return (row.cells[7].value == null || row.cells[7].value == '');
  }


  isSelectableInHistorical(row: Row) {
    return (row.italic != undefined && row.italic != null && row.italic);
  }

  ngOnChanges(changes: SimpleChanges) {

    if (sessionStorage.getItem("rowGroupsInitSaltCompOficio")) {
      sessionStorage.removeItem("rowGroupsInitSaltCompOficio");
    }

    if (changes.rowGroups.currentValue) {
      sessionStorage.setItem("rowGroupsInitSaltCompOficio", JSON.stringify(changes.rowGroups.currentValue));
    }
  }

  backTo() {
    this.location.back();
  }

}
function compareDate (fechaA:  any, fechaB:  any, isAsc: boolean){

  let dateA = null;
  let dateB = null;
  if (fechaA!=null){
    const dayA = fechaA.substr(0, 2) ;
    const monthA = fechaA.substr(3, 2);
    const yearA = fechaA.substr(6, 10);
    dateA = new Date(yearA, monthA, dayA);
  }

  if (fechaB!=null){
    const dayB = fechaB.substr(0, 2) ;
    const monthB = fechaB.substr(3, 2);
    const yearB = fechaB.substr(6, 10);
    dateB = new Date(yearB, monthB, dayB);
  }


  return compare(dateA, dateB, isAsc);


}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {

  if (typeof a === "string" && typeof b === "string") {
    a = a.toLowerCase();
    b = b.toLowerCase();
  }

  if (a==null && b!=null){
    return ( 1 ) * (isAsc ? 1 : -1);
  }
  if (a!=null && b==null){
    return ( -1 ) * (isAsc ? 1 : -1);
  }

  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}