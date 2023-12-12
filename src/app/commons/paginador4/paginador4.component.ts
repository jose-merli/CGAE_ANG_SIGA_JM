import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { Paginator } from 'primeng/primeng';

enum PaginatorType {
  TOP,
  BOTTOM
}

@Component({
  selector: 'app-paginador4',
  templateUrl: './paginador4.component.html',
  styleUrls: ['./paginador4.component.scss']
})
export class Paginador4Component implements OnInit {
  @ViewChild('pagBot') pagBot: Paginator;
  @ViewChild('pagTop') pagTop: Paginator;
  @Output() seleccionarTodo = new EventEmitter();
  @Output() perPage = new EventEmitter();
  @Output() fromReg = new EventEmitter();
  @Output() toReg = new EventEmitter();
  @Input() totalRegistros;
  from = 1;
  to = 10;
  selected = false;
  pagNumber = 0;
  selectedPerPage = 10;
  totalNumPages = 0;
  comeFrom;
  elementsInLastPage = 0;
  lastPage = 0;
  opcionesDropdown = [
    {
      label: 10,
      value: 10
    },
    {
      label: 20,
      value: 20
    },
    {
      label: 30,
      value: 30
    },
    {
      label: 40,
      value: 40
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.selectedPerPage = 10;
    this.from = this.pagNumber *this.selectedPerPage + 1;
    if (this.pagNumber + 1 == this.lastPage){
      this.to = this.totalRegistros;
     } else {
      this.to = (this.pagNumber+1)*this.selectedPerPage;

     }
    this.fromReg.emit(this.from);
    this.toReg.emit(this.to);
  }
  selectedAll(){
    this.selected = !this.selected;
    this.seleccionarTodo.emit(this.selected);
  }
  onChangeRowsPerPages(event){
    this.calculatingElementsLastPage();
    this.pagNumber = 0;
    this.perPage.emit(event.value);
    this.from = this.pagNumber*this.selectedPerPage + 1;
   if (this.pagNumber  + 1 == this.lastPage){
    this.to = this.totalRegistros;
   } else {
    this.to = (this.pagNumber+1)*this.selectedPerPage;
   }
    this.to = (this.pagNumber+1)*this.selectedPerPage;
    this.fromReg.emit(this.from);
    this.toReg.emit(this.to);
    this.comeFrom = "TO1";
    this.pagBot.changePage(1);
    this.pagTop.changePage(1);
    this.comeFrom  = "";

  }
  fn1(event){
    this.calculatingElementsLastPage();
    if (this.comeFrom != "FN2" && this.comeFrom != "TO1"){
    this.pagNumber = Math.ceil(event.first/event.rows);
    this.comeFrom = "FN1";
    this.pagBot.changePage(this.pagNumber);
    this.from = this.pagNumber *this.selectedPerPage + 1;
    if (this.pagNumber + 1 == this.lastPage){
      this.to = this.totalRegistros;
     } else {
      this.to = (this.pagNumber+1)*this.selectedPerPage;
     }
    this.fromReg.emit(this.from);
    this.toReg.emit(this.to);
    this.comeFrom = "";
    }
  }
  fn2(event){
    this.calculatingElementsLastPage();
    if (this.comeFrom != "FN1" && this.comeFrom != "TO1"){
    this.pagNumber = Math.ceil(event.first/event.rows);
    this.comeFrom = "FN2";
    this.pagTop.changePage(this.pagNumber);
    this.from = this.pagNumber *this.selectedPerPage + 1;
    if (this.pagNumber + 1 == this.lastPage){
      this.to = this.totalRegistros;
     } else {
      this.to = (this.pagNumber+1)*this.selectedPerPage;
     }
    this.fromReg.emit(this.from);
    this.toReg.emit(this.to);
    this.comeFrom = "";
    }
  }

  calculatingElementsLastPage(){
    let rounded = Math.ceil(this.totalRegistros/ this.selectedPerPage);
    let notRounded = this.totalRegistros/ this.selectedPerPage;
    let resto = this.totalRegistros % this.selectedPerPage;
    this.lastPage = rounded;
    if (rounded > notRounded){
      this.elementsInLastPage = resto;
    } else {
      this.elementsInLastPage = this.selectedPerPage;
    }
  }

  updateRowsFromDuplicate() {
    this.totalRegistros = this.totalRegistros + 1;
    this.calculatingElementsLastPage();
    if (this.pagNumber + 1 == this.lastPage){
      this.to = this.totalRegistros;
      this.toReg.emit(this.to);
     } 
  }
}
