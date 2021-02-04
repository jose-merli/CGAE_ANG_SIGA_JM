import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ejg2',
  templateUrl: './ejg.component.html',
  styleUrls: ['./ejg.component.scss']
})
export class EjgComponent2 implements OnInit {
  rutas = ['SJCS', 'Oficio', 'E.J.G'];
  cFormValidity = true;
  show = true;
  selectorEstados: [1,2,3,4,5,6,7,8,9,10];
 
  selectores1 = [
    {
      nombre : "Tipo EJG",
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
      nombre : "Tipo EJG Colegio",
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
      nombre : "Creado desde",
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
      nombre : "Estado EJG",
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
  datePickers1 = ["Fecha Apertura desde", "Fecha Apertura hasta", "Fecha Estado desde","Fecha Estado hasta", 
  "Fecha Límite desde", "Fecha Límite hasta"];
  
  
  selectores2 = [
    {
      nombre : "Resolución",
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
      nombre : "Fundamentos de la resolución",
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
      nombre : "Dictamen",
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
      nombre : "Fundamento de Calificación",
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
      nombre : "Impugnación",
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
  datePickers2 = ["Fecha Resolución desde", "Fecha Resolución hasta", "Fecha Dictamen desde","Fecha Dictamen hasta", 
  "Fecha Impugnación desde", "Fecha Impugnación hasta"];
  selectores = [this.selectores1, this.selectores2];
  datePickers = [this.datePickers1, this.datePickers2];
  emptyAccordions = ["Datos Defensa", "CAJG"];

cabeceras = [
    {
      id: "colegio", 
      name: "Colegio"
    },
    {
      id: "identificacion", 
      name: "Nº identificacion"
    },
    {
      id: "nombre", 
      name: "Nombre"
    },
    {
      id: "colegiado", 
      name: "Nº Colegiado"
    },
    {
      id: "situacion", 
      name: "Situación"
    },
    {
      id: "residencia", 
      name: "Residencia"
    },
    {
      id: "nacimiento", 
      name: "Fecha Nacimiento"
    },
    {
      id: "correo", 
      name: "Correo electrónico"
    },
    {
      id: "telefono", 
      name: "Teléfono"
    },
    {
      id: "movil", 
      name: "Móvil"
    },
    {
      id: "lopd", 
      name: "LOPD"
    }
];
elementos = [
    ['ALCALÁ DE HENARES', "78909876R", "ASNDADBH AHDBHAJD JUAN", "1702", "Baja Colegial", "No", "30/04/1969", "papelera@redabogacia.org", "999999999", "666666666", "No"],
    ['BALCALÁ DE HENARES', "23909876R", "ASNDADBH AHDBHAJD ANA", "1402", "Baja Colegial", "Si", "12/04/1969", "papelera@redabogacia.org", "999999999", "666666666", "No"]
  ];
  elementosAux = [
    ['ALCALÁ DE HENARES', "78909876R", "ASNDADBH AHDBHAJD JUAN", "1702", "Baja Colegial", "No", "30/04/1969", "papelera@redabogacia.org", "999999999", "666666666", "No"],
    ['BALCALÁ DE HENARES', "23909876R", "ASNDADBH AHDBHAJD ANA", "1402", "Baja Colegial", "Si", "12/04/1969", "papelera@redabogacia.org", "999999999", "666666666", "No"]
  ];
  constructor() { }

  ngOnInit(): void {
  }
  saveForm($event){
    this.cFormValidity = $event;
  }
  showResponse(){
    this.show = true;
  }
  hideResponse(){
    this.show = false;
  }
}
