import { ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Row, Cell } from './tabla-resultado-mix-incompatib.service';
import { Message } from 'primeng/components/common/api';
import { ValidationModule } from '../validation/validation.module';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { PersistenceService } from '../../_services/persistence.service';

/*interface Cabecera {
  id: string,
  name: string,
}*/

@Component({
  selector: 'app-tabla-resultado-mix',
  templateUrl: './tabla-resultado-mix.component.html',
  styleUrls: ['./tabla-resultado-mix.component.scss']
})
export class TablaResultadoMixComponent implements OnInit {
  
  info = new FormControl();
  msgs: Message[] = [];
  //@Input() cabeceras: Cabecera[] = [];
  @Input() cabeceras = [];
  @Input() rowGroups: Row[];
  @Input() rowGroupsAux: Row[];
  @Input() seleccionarTodo = false;
  @Input() comboGuardiasIncompatibles;
  @Input() calendarios;
  @Input() dataToDuplicate;
  @Input() inscripciones: boolean;
  
  @Output() resultado = new EventEmitter<{}>();

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
  selectedRowValue: Cell[] = [];
  textFilter: string = "Seleccionar";
  textSelected: String = "{0} guardias seleccionadas";
  @Input() totalRegistros = 0;
  @ViewChild('table') table: ElementRef;
  comboTipo: any;
  fechaActual: Date;
  observaciones: string;
  infoParaElPadre: { fechasolicitudbajaSeleccionada: any; fechaActual: Date; observaciones: any; id_persona: any; };


  constructor(
    
    private renderer: Renderer2,
    private router: Router,
    private persistenceService: PersistenceService,
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
    console.log('AÑADIR DATA TO DUPLICATE: ', this.dataToDuplicate)
console.log('this.rowGroups: tabla ', this.rowGroups)
console.log("VALOR DE MI INPUT: ",this.inscripciones)
    let values = [];
    let labels = [];
    let arrayOfSelected = [];
      if(this.rowGroups != undefined){
         this.rowGroups.forEach((row, i) => {
          //selecteCombo = {label: ?, value: row.cells[7].value}
          values.push(row.cells[6].value);
        });
        this.totalRegistros = this.rowGroups.length;
      }
      if (this.comboGuardiasIncompatibles != undefined){
      this.comboGuardiasIncompatibles.forEach(combo => {
        values.forEach(v => {
          if (combo.value == v){
            labels.push(combo.label)
          }
        });
       });
      }
      values.forEach((v, i) => {
        let selecteCombo = {label: '', value: ''}
        selecteCombo.label = labels[i];
        selecteCombo.value = v;
        arrayOfSelected[i] = selecteCombo;
        this.multiselectValue[i] = arrayOfSelected[i];
      });
      this.multiselectLabels = labels;
    this.numCabeceras = this.cabeceras.length;
    this.numColumnas = this.numCabeceras;
    this.cabeceras.forEach(cab => {
      this.cabecerasMultiselect.push(cab.name);
    })
    console.log('this.rowGroups: ', this.rowGroups)
    console.log('this.totalRegistros: ', this.totalRegistros)
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
  selectRow(rowId, rowCells) {
 this.selectedRowValue = rowCells;
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
    console.log("entro en el método Sort con valor:"+ sort.active+","+sort.direction);
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
          console.log("a.cells["+i+"].type:"+a.cells[i].type);

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
              console.log("fecha a:"+ yearA+","+monthA+","+dayA);
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


  


  searchChange(x: any) {
    let isReturnArr = [];
    this.rowGroups = this.rowGroupsAux.filter((row) => {
      let isReturn = true;
      for(let j=0; j<this.cabeceras.length;j++){
        if (this.searchText[j] != " " &&  this.searchText[j] != undefined){
          if (row.cells[j].value){
            console.log("tipo de celda:"+row.cells[j].type);
            /*if(row.cells[j].type == 'select'){
              let labelCombo = this.getComboLabel(row.cells[j].value);
              console.log("valor de celda:"+labelCombo);
              if (!labelCombo.toLowerCase().includes(this.searchText[j].toLowerCase())){
                isReturn = false;
                break;
              }
            } else */if (!row.cells[j].value.toString().toLowerCase().includes(this.searchText[j].toLowerCase())){
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
  
  /*getComboLabel(key: string){
    for (let i = 0; i < this.comboTipo.length; i++){
      if (this.comboTipo[i].value == key){
        return this.comboTipo[i].label;
      }
    }
    return "";
  }*/


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

  descargarLOG
  duplicar2(){
    if (this.selectedRowValue.length != 0){
      console.log('this.selectedRowValue', this.selectedRowValue)
    this.enableGuardar = true;
    let row: Row = new Row();
      
      let cell1: Cell = this.selectedRowValue[0];
      let cell2: Cell = this.selectedRowValue[1];
      let cell3: Cell = this.selectedRowValue[2];
      let cell4: Cell = this.selectedRowValue[3];
      let cell5: Cell = this.selectedRowValue[4];
      let cell6: Cell = this.selectedRowValue[5];
      let cell7: Cell = this.selectedRowValue[6];
      let cell8: Cell = this.selectedRowValue[7];
      let cell9: Cell = this.selectedRowValue[8];
      let cell10: Cell = this.selectedRowValue[9];
    
    row.cells = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9, cell10];
    console.log(row)
    this.rowGroups.unshift(row);
    this.rowGroupsAux = this.rowGroups;
    this.totalRegistros = this.rowGroups.length;
    }
  }

  openTab(row) {

   /* if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }*/
    let dataToSend = {
      'duplicar': false,
      'tabla': [],
      'turno':row.cells[0].value,
      'nombre': row.cells[1].value,
      'generado': row.cells[8].value,
      'numGuardias': row.cells[9].value,
      'listaGuarias': row.cells[5].value,
      'fechaDesde': row.cells[2].value,
      'fechaHasta': row.cells[3].value,
      'fechaProgramacion': row.cells[4].value,
      'estado': row.cells[7].value,
      'observaciones': row.cells[6].value,
      'idCalendarioProgramado': row.cells[10].value,
      'idTurno': row.cells[11].value,
      'idGuardia': row.cells[12].value
    }


    //2012-01-02 00:00:00.0 to 2012-01-02
    if (!this.seleccionarTodo && this.selectedArray.length <= 1) {
      //this.progressSpinner = true;
      this.persistenceService.setDatos(dataToSend);
      //this.persistenceService.setHistorico(evento.fechabaja ? true : false);
      this.router.navigate(["/fichaProgramacion"]);

    } else {
      /*if (evento.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }*/
    }
  }

  duplicar(){
    console.log('duplicar this.selectedRowValue: ', this.selectedRowValue)
       /* if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }*/
    let dataToSend = {
      'duplicar': true,
      'tabla': this.rowGroups,
      'turno':this.selectedRowValue[0].value,
      'nombre': this.selectedRowValue[1].value,
      'generado': this.selectedRowValue[8].value,
      'numGuardias': this.selectedRowValue[9].value,
      'listaGuarias': this.selectedRowValue[5].value,
      'fechaDesde': '',
      'fechaHasta': '',
      'fechaProgramacion': this.selectedRowValue[4].value,
      'estado': this.selectedRowValue[7].value,
      'observaciones': this.selectedRowValue[6].value,
      'idCalendarioProgramado': this.selectedRowValue[10].value,
      'idTurno': this.selectedRowValue[11].value,
      'idGuardia': this.selectedRowValue[12].value
    }


    //2012-01-02 00:00:00.0 to 2012-01-02
    if (!this.seleccionarTodo && this.selectedArray.length <= 1) {
      //this.progressSpinner = true;
      this.persistenceService.setDatos(dataToSend);
      //this.persistenceService.setHistorico(evento.fechabaja ? true : false);
      this.router.navigate(["/fichaProgramacion"]);

    } else {
      /*if (evento.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }*/
    }
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


    if(this.calendarios){
      cell1.type = 'input';
      cell1.value = '';
      cell2.type = 'input';
      cell2.value = '';
      cell3.type = 'datePicker';
      cell3.value = '';
      cell4.type = 'datePicker';
      cell4.value = '';
      cell5.type = 'datePicker';
      cell5.value = '';
      cell6.type = 'input';
      cell6.value = '';
      cell7.type = 'input';
      cell7.value = '';
      cell8.type = 'input';
      cell8.value = '';
      cell9.type = 'checkbox';
      cell9.value = '';
      cell10.type = 'input';
      cell10.value = '';
      row.cells = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9, cell10];
    }else{
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
    }
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

  changeFecha(event){
    console.log(this.selectedRowValue)

    this.infoParaElPadre = {
      'fechasolicitudbajaSeleccionada': this.resultado[8].cell.value,
      'fechaActual':this.fechaActual,
      'observaciones': null,
      'id_persona': this.resultado[5].cell.value
    }
  }

  
  changeObservaciones(event){
    this.infoParaElPadre = {
      'fechasolicitudbajaSeleccionada': this.resultado[8].cell.value,
      'fechaActual': null,
      'observaciones': this.observaciones,
      'id_persona': this.resultado[5].cell.value
    }
  }

  validar(){
    this.resultado.emit(this.infoParaElPadre);
  }

  denegar(){
    console.log("He entrado en denegar")
  }

  solicitarBaja(){
    console.log("He entrado en SolicitarBaja")
  }

  cambiarFecha(){
    console.log("He entrado en CambiarFecha")
  }
}

function compareDate (fechaA:  any, fechaB:  any, isAsc: boolean){

  let dateA = null;
  let dateB = null;
  if (fechaA!=null){
    const dayA = fechaA.substr(0, 2) ;
    const monthA = fechaA.substr(3, 2);
    const yearA = fechaA.substr(6, 10);
    console.log("fecha a:"+ yearA+","+monthA+","+dayA);
    dateA = new Date(yearA, monthA, dayA);
  }

  if (fechaB!=null){
    const dayB = fechaB.substr(0, 2) ;
    const monthB = fechaB.substr(3, 2);
    const yearB = fechaB.substr(6, 10);
    console.log("fecha b:"+ yearB+","+monthB+","+dayB);
    dateB = new Date(yearB, monthB, dayB);
  }

  console.log("comparacionDate isAsc:"+ isAsc+";");

  return compare(dateA, dateB, isAsc);

}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  console.log("comparacion  a:"+ a+"; b:"+ b);

  if (typeof a === "string" && typeof b === "string") {
    console.log("comparacion  de cadenas");
    a = a.toLowerCase();
    b = b.toLowerCase();
  }

  console.log("compare isAsc:"+ isAsc+";");

  if (a==null && b!=null){
    return ( 1 ) * (isAsc ? 1 : -1);
  }
  if (a!=null && b==null){
    return ( -1 ) * (isAsc ? 1 : -1);
  }

  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

