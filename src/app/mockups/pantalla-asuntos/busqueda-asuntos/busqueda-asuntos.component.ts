import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-busqueda-asuntos',
  templateUrl: './busqueda-asuntos.component.html',
  styleUrls: ['./busqueda-asuntos.component.scss']
})
export class BusquedaAsuntosComponent implements OnInit {

  expanded = true;
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
  inputsDivididosAsis = ["Año / Número Asistencia", "Número Procedimiento"]
  selectores1 = [];
  selectores2 = [];
  datePickers1 = [];
  datePickers2 = [];
  selectorSOJ =
    {
      nombre: "Tipo SOJ",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
      ]
    };

  selectorEJG =
    {
      nombre: "Tipo EJG",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
      ]
    };

  selectoresAsistencias = [
    {
      nombre: "Tipo de Asistencia",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
      ]
    },
    {
      nombre: "Juzgado",
      opciones: [
        { label: "AS5-JUZGADO DE LO SOCIAL Nº 5", value: "40" },
        { label: "AS6-JUZGADO DE LO SOCIAL Nº 6", value: "41" },
        { label: "AS7-JUZGADO DE LO SOCIAL Nº 7", value: "42" },
        { label: "AMC1-JUZGADO DE LO MERCANTIL Nº 1", value: "43" },
        { label: "AMC2-JUZGADO DE LO MERCANTIL Nº 2", value: "44" },
        { label: "AMN1-JUZGADO DE MENORES Nº 1", value: "45" },
        { label: "AMN2-JUZGADO DE MENORES Nº 2", value: "46" },
        { label: "AMN3-JUZGADO DE MENORES Nº 3", value: "47" },
        { label: "AVM1-JUZGADO DE VIOLENCIA SOBRE LA MUJER Nº 1", value: "48" },
        { label: "ACA1-JUZGADO DE LO CONTENCIOSO-ADMVO. Nº 1", value: "50" },
        { label: "ACA2-JUZGADO DE LO CONTENCIOSO-ADMVO. Nº 2", value: "51" },
        { label: "ACA3-JUZGADO DE LO CONTENCIOSO-ADMVO. Nº 3", value: "52" },
        { label: "BITA1-JUZGADO DE 1ª INSTANCIA Nº 1", value: "54" },
        { label: "BITA2-JUZGADO DE 1ª INSTANCIA Nº 2", value: "55" },
        { label: "BITA3-JUZGADO DE 1ª INSTANCIA Nº 3", value: "56" },
        { label: "BITR1-JUZGADO DE INSTRUCCIÓN Nº 1", value: "57" },
        { label: "BITR2-JUZGADO DE INSTRUCCIÓN Nº 2", value: "58" },
        { label: "BITR3-JUZGADO DE INSTRUCCIÓN Nº 3", value: "59" },
        { label: "BITR4-JUZGADO DE INSTRUCCIÓN Nº 4", value: "60" },
        { label: "BITA4-JUZGADO DE 1ª INSTANCIA Nº 4 (antiguo Instrucción 5)", value: "61" },
        { label: "BS1-JUZGADO DE LO SOCIAL Nº 1", value: "62" },
        { label: "BP1-JUZGADO DE LO PENAL Nº 1", value: "63" },
        { label: "BP2-JUZGADO DE LO PENAL Nº 2", value: "64" },
        { label: "DII1-JUZGADO DE 1ª INST. E INSTRUC. Nº 1", value: "65" },
        { label: "DII2-JUZGADO DE 1ª INST. E INSTRUC. Nº 2", value: "66" },
        { label: "DII3-JUZGADO DE 1ª INST. E INSTRUC. Nº 3", value: "67" },
        { label: "DII4-JUZGADO DE 1ª INST. E INSTRUC. Nº 4", value: "68" },
        { label: "DII5-JUZGADO DE 1ª INST. E INSTRUC. Nº 5", value: "69" },
        { label: "DII6-JUZGADO DE 1ª INST. E INSTRUC. Nº 6", value: "70" },
        { label: "DII7-JUZGADO DE 1ª INST. E INSTRUC. Nº 7", value: "71" },
        { label: "EII1-JUZGADO DE 1ª INST. E INSTRUC. Nº 1", value: "72" },
        { label: "EII2-JUZGADO DE 1ª INST. E INSTRUC. Nº 2", value: "73" },
        { label: "EII3-JUZGADO DE 1ª INST. E INSTRUC. Nº 3", value: "74" },
        { label: "EII4-JUZGADO DE 1ª INST. E INSTRUC. Nº 4", value: "75" },
        { label: "III1-JUZGADO DE 1ª INST. E INSTRUC. Nº 1", value: "76" },
      ]
    },
    {
      nombre: "Centro de Detención",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
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
