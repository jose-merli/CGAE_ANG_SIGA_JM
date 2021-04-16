import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef, Output, EventEmitter} from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { Row, Cell} from './detalle-tarjeta-procurador-ficha-designaion-oficio.service';
import { Sort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-detalle-tarjeta-procurador-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-procurador-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-procurador-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaProcuradorFichaDesignacionOficioComponent implements OnInit {

  @Input() cabeceras = [];
  msgs: Message[] = [];
  @Input() rowGroups: Row[];
  @Input() rowGroupsAux: Row[];
  @Input() seleccionarTodo = false;
  @Input() totalRegistros = 0;
  numCabeceras = 0;
  numColumnas = 0;
  @ViewChild('table') table: ElementRef;
  selected = false;
  selectedArray = [];
  from = 0;
  to = 10;
  searchText = [];

  comboMotivo = [
    { label: "Vacaciones", value: "V" },
    { label: "Maternidad", value: "M" },
    { label: "Baja", value: "B" },
    { label: "Suspensión por sanción", value: "S" }
  ];
  
  @Output() modDatos = new EventEmitter<any>();
  @Output() mostrar = new EventEmitter<any>();

  constructor(
    private renderer: Renderer2,
    private pipe: DatePipe,) { 
    this.renderer.listen('window', 'click', (event: { target: HTMLInputElement; }) => {
    for (let i = 0; i < this.table.nativeElement.children.length; i++) {

      if (!event.target.classList.contains("selectedRowClass")) {
        this.selected = false;
        this.selectedArray = [];
      }
    }
  });}

  ngOnInit() {
    this.mostrarDatos();

    this.totalRegistros = this.rowGroups.length;

    this.numCabeceras = this.cabeceras.length;

    this.numColumnas = this.numCabeceras;
  }

  mostrarDatos(){
    this.mostrar.emit();
  }

  
  selectedAll(evento){
    this.seleccionarTodo = evento;
  }
  
  fromReg(event){
    this.from = Number(event) - 1;
  }
  toReg(event){
    this.to = Number(event);
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
 
  checkGuardar(){
    this.modDatos.emit(this.selectedArray);
    this.totalRegistros = this.rowGroups.length;
  }

  nuevo(){
    const now = Date.now();
    const myFormattedDate = this.pipe.transform(now, 'dd/MM/yyyy');

      let row: Row = new Row();
      let cell1: Cell = new Cell();
      let cell2: Cell = new Cell();
      let cell3: Cell = new Cell();
      let cell4: Cell = new Cell();
      let cell5: Cell = new Cell();
      let cell6: Cell = new Cell();
      let cell7: Cell = new Cell();
      let cell8: Cell = new Cell();
      let cell10: Cell = new Cell();

      cell1.type = 'datePicker';
      cell1.value = myFormattedDate;
      cell2.type = 'input';
      cell2.value = '';
      cell3.type = 'text';
      cell3.value = '';
      cell4.type = 'text';
      cell4.value = '';
      cell5.type = 'select';
      cell5.combo = this.comboMotivo;
      cell5.value = '';
      cell6.type = 'input';
      cell6.value = '';
      cell7.type = 'datePicker';
      cell7.value = '';
      cell8.type = 'text';
      cell8.value = '';
      cell10.type = 'invisible';
      cell10.value = true;
      row.cells = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell10];
      this.rowGroups.unshift(row);
      this.rowGroupsAux = this.rowGroups;
      this.totalRegistros = this.rowGroups.length;
      console.log('this.rowGroups: ', this.rowGroups);
    }
}
function compare(a: string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}