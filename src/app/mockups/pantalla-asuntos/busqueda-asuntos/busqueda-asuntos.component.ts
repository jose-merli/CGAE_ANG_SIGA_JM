import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-busqueda-asuntos',
  templateUrl: './busqueda-asuntos.component.html',
  styleUrls: ['./busqueda-asuntos.component.scss']
})
export class BusquedaAsuntosComponent implements OnInit {

  @Output() formulario = new EventEmitter<boolean>();
  cForm = new FormGroup({
    NIF: new FormControl(''),
    Apellidos: new FormControl(''),
    Nombre: new FormControl(''),
  });
  @Input() selectorEstados = [];
  @Input() selectores = [];
  @Input() datePickers = [];
  @Input() emptyAccordions = [];
  @Input() modoBusqueda;
  titulosInputInteresados = ["NIF", "Apellidos", "Nombre"];
  titulosInputTramitacion = ["NIF", "Apellidos", "Nombre", "Número de colegiado"];
  inputsDivididos = ["Año / Número Designación", "Número Procedimiento"]
  selectores1 = [];
  selectores2 = [];
  datePickers1 = [];
  datePickers2 = [];
  selectorSOJ =
    {
      nombre: "Tipo SOJ",
      opciones: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ]
    };

  selectoresAsistencias = [
    {
      nombre: "Tipo Designación",
      opciones: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ]
    },
    {
      nombre: "Juzgado",
      opciones: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ]
    },
    {
      nombre: "Centro de Detención",
      opciones: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ]
    }
  ];
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
  }

  sendFom(value: FormGroup) {
    this.formulario.emit(value.valid)
  }
}
