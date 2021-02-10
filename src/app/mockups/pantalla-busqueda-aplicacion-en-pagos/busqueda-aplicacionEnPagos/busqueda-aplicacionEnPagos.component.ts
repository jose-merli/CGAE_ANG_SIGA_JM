import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-busqueda-aplicacionEnPagos',
  templateUrl: './busqueda-aplicacionEnPagos.component.html',
  styleUrls: ['./busqueda-aplicacionEnPagos.component.scss']
})
export class BusquedaAplicacionEnPagosComponent implements OnInit {

  @Output() formulario = new EventEmitter<boolean>();
  cForm = new FormGroup({
    NIF: new FormControl(''),
    Apellidos: new FormControl(''),
    Nombre: new FormControl(''),
  });
  @Input() selectorEstados = [];
  @Input() selectores = [];
  @Input() datePickers = [];
  @Input() inputs = [];
  @Input() emptyAccordions = [];
  @Input() modoBusqueda;
  titulosInputInteresados = ["NIF", "Apellidos", "Nombre"];
  titulosInputTramitacion = ["NIF", "Apellidos", "Nombre", "Número de colegiado"];
  inputsDivididos = ["Año / Número Designación", "Número Procedimiento"]
  selectores1 = [];
  selectores2 = [];
  datePickers1 = [];
  datePickers2 = [];
  inputs1 = [];
  inputs2 = [];
  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i < this.selectores.length; i++) {
      this.selectores1 = this.selectores[0];
      this.selectores2 = this.selectores[1];
    }
    for (let i = 0; i < this.datePickers.length; i++) {
      this.datePickers1 = this.datePickers[0];
      this.datePickers2 = this.datePickers[1];
    }
    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs1 = this.inputs[0];
      this.inputs2 = this.inputs[1];
    }
  }

  sendFom(value: FormGroup) {
    this.formulario.emit(value.valid)
  }
}
