import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-tarjeta-caracteristicas',
  templateUrl: './tarjeta-caracteristicas.component.html',
  styleUrls: ['./tarjeta-caracteristicas.component.scss']
})
export class TarjetaCaracteristicasComponent implements OnInit {
  msgs: Message[] = [];
  msgInfo: boolean = false;
  rForm = new FormGroup({
  });
  constructor() { }
  datePickers1 = [];
  questions = ["¿Se ha solicitado intervención del Ministerio Fiscal?", "¿Se ha solicitado intervención del Médico Forense?"]
  checkboxs1= [
    {
      nombre: "Violencia Doméstica",
      valor: ""
    },
    {
      nombre: "Violencia de Género",
      valor: ""
    },
    {
      nombre: "Contra la libertad sexual",
      valor: ""
    },
    {
      nombre: "Víctima menor de abuso o maltrato",
      valor: ""
    },
    {
      nombre: "Persona con discapacidad psíquica víctima de abuso o maltrato",
      valor: ""
    }];
    checkboxs2= [
      {
        nombre: "Interposición Denuncia",
        valor: ""
      },
      {
        nombre: "Solicitud Medidas Cautelares",
        valor: ""
      },
      {
        nombre: "Orden de protección",
        valor: ""
      }];
  inputs1 = [
    {
      nombre: "Nº Diligencia",
      valor: ""
    },
    {
      nombre: "Nº Procedimiento",
      valor: ""
    },
    {
      nombre: "NIG",
      valor: ""
    }];
    selector = [
      {
        nombre: "",
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
      }];
  selectores1 = [
    {
      nombre: "Delitos",
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
      nombre: "Comisaría",
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
      nombre: "Procedimientos",
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
  inputs2 = [
    {
      nombre: "Observaciones Defensa Jurídica",
      valor: ""
    },
    {
      nombre: "Delitos/Faltas",
      valor: ""
    }];

    selectores3 = [
      {
        nombre: "Procedimientos",
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
      },];

      inputs3 = [
        {
          nombre: "Nº Proc (Nº/Año)",
          valor: ""
        },
        {
          nombre: "NIG",
          valor: ""
        }];
        
  ngOnInit(): void {
  }

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

}
