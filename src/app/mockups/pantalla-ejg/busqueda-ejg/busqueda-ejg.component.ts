import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-busqueda-ejg',
  templateUrl: './busqueda-ejg.component.html',
  styleUrls: ['./busqueda-ejg.component.scss']
})
export class BusquedaEJGComponent implements OnInit {

  @Output() formulario = new EventEmitter<boolean>();
  cForm = new FormGroup({
    anio: new FormControl(''),
      numero: new FormControl(''),
    });
@Input() selectorEstados = [];
@Input() selectores = [];
@Input() datePickers = [];
@Input() emptyAccordions = [];
selectores1 = [];
selectores2 = [];
datePickers1 = [];
datePickers2 = [];
  constructor() { }

  ngOnInit(): void {
    for(let i = 0; i < this.selectores.length; i++){
      this.selectores1 = this.selectores[0];
      this.selectores2 = this.selectores[1];
    }
    for(let i = 0; i < this.datePickers.length; i++){
      this.datePickers1 = this.datePickers[0];
      this.datePickers2 = this.datePickers[1];
    }
  }

  sendFom(value: FormGroup) {
    this.formulario.emit(value.valid)
  }
}
