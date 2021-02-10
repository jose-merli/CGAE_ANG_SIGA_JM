import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ejg2',
  templateUrl: './ejg.component.html',
  styleUrls: ['./ejg.component.scss']
})
export class EjgComponent2 implements OnInit {
  isDisabled = true;
  rutas = ['SJCS', 'E.J.G'];
  cFormValidity = true;
  show = true;
  selectorEstados: [1,2,3,4,5,6,7,8,9,10];
 
  selectores1 = [
    {
      nombre : "Tipo EJG",
      opciones: [
        { label: 'Mercantil', value: 4 },
        { label: 'Oficio Juzgado (Artículo 21)', value: 5 },
        { label: 'Ordinario', value: 1 },
        { label: 'Proced. Enjuiciamiento Rápido', value: 2 },
        { label: 'REPRODUCIDOS X ARCHIVO CAJ', value: 6 },
        { label: 'Violencia Doméstica', value: 3 }
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
        
        { label: 'Remitida apertura a Comisión', value: 0 },
        { label: 'Solicitada Documentación', value: 1 },
        { label: 'Completada solicititud y documentación', value: 2 },
        { label: 'Traslado a Tramitador', value: 3 },
        { label: 'Previsión recibir dictamen', value: 4 },
        { label: 'Solicitado ampliación documentación', value: 5 },
        { label: 'Dictaminado', value: 6 },
        { label: 'Listo remitir Comisión', value: 7 },
        { label: 'Generado en Remesa', value: 8 },
        { label: 'Remitido Comisión', value: 9 },
        { label: 'Resuelto Comisión', value: 10 },
        { label: 'Impugnado/a', value: 11 },
        { label: 'Archivado', value: 12 },
        { label: 'Resuelta Impugnación', value: 13 },
        { label: 'Incidencias', value: 14 },
        { label: 'Petición de Datos (CAJG)', value: 15 },
        { label: 'Enviado a Edicto (CAJG)', value: 16 },
        { label: 'Listo remitir comisión act. designación', value: 17 },
        { label: 'Petición Procurador', value: 18 },
        { label: 'Designado Procurador', value: 19 },
        { label: 'Remitida apertura a CAJG-Reparto Ponente', value: 20 },
        { label: 'Devuelto al colegio', value: 21 },
        { label: 'Incidencias Procurador', value: 22 },
        { label: 'Solicitud en proceso de Alta', value: 23 },
        { label: 'Impugnable', value: 24 }
        

        
      ]
    }
  ];
  datePickers1 = ["Fecha Apertura desde", "Fecha Apertura hasta", "Fecha Estado desde","Fecha Estado hasta", 
  "Fecha Límite desde", "Fecha Límite hasta"];
  
  allSelected = false;
  selectores2 = [
    {
      nombre : "Resolución",
      opciones: [
        { label: 'Confirmar y RECONOCER 100%', value: 1 },
        { label: 'Confirmar y RECONOCER 80%', value: 2 },
        { label: 'Confirmar y DENEGAR', value: 3 },
        { label: 'Pendiente CAJG - Otros', value: 4 },
        { label: 'Archivo/s', value: 5 },
        { label: 'Devuelto al Colegio', value: 6 },
        { label: 'Modificar y DENEGAR', value: 7 },
        { label: 'Modificar y RECONOCER CON NOMBRAMIENTO 100%', value: 8 },
        { label: 'Modificar y RECONOCER SIN NOMBRAMIENTO 100%', value: 9 },
        { label: 'Modificar y RECONOCER CON NOMBRAMIENTO 80%","value', value: 10 },
        { label: 'Modificar y RECONOCER SIN NOMBRAMIENTO 80%","value', value: 11 }
        
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
        { label: 'Modificar resolución y conceder', value: 1 },
        { label: 'Confirmar resolución y denegar', value: 2 },
        { label: 'Modificar resolución y denegar', value: 3 },
        { label: 'Confirmar resolución y conceder', value: 4 },
        { label: 'null05', value: 5 }
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
  selectedAll(event){
    this.allSelected = event;
    this.isDisabled = !event;
  }
  notifyAnySelected(event){
    if (this.allSelected || event){
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }
  
}
