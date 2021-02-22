import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-tarjeta-defensa-juridica',
  templateUrl: './tarjeta-defensa-juridica.component.html',
  styleUrls: ['./tarjeta-defensa-juridica.component.scss']
})
export class TarjetaDefensaJuridicaComponent implements OnInit {
  msgs: Message[] = [];
  msgInfo: boolean = false;
  rForm = new FormGroup({
  });
  constructor() { }
  datePickers1 = [];
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
