import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

enum PaginatorType {
  TOP,
  BOTTOM
}

@Component({
  selector: 'app-paginador',
  templateUrl: './paginador.component.html',
  styleUrls: ['./paginador.component.scss']
})
export class PaginadorComponent implements OnInit {
  @Output() seleccionarTodo = new EventEmitter();
  @Input() type: PaginatorType;
  selected = false;
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
  }
  selectedAll(){
    this.selected = !this.selected;
    console.log('PAGINADOR EMIT: ', this.selected)
    this.seleccionarTodo.emit(this.selected);
  }
}
