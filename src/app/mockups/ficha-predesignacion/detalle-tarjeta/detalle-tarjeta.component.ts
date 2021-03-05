import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Message } from 'primeng/components/common/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-tarjeta',
  templateUrl: './detalle-tarjeta.component.html',
  styleUrls: ['./detalle-tarjeta.component.scss']
})
export class DetalleTarjetaComponent implements OnInit {

  msgs: Message[] = [];
  @Input() title = "";
  @Input() datosProcurador;
  imagen = "assets/user.PNG";

  notarioForm = new FormGroup({
    id: new FormControl(''),
    tipo: new FormControl(''),
    nombre: new FormControl(''),
    ap1: new FormControl(''),
    ap2: new FormControl(''),
    numDesig: new FormControl('')
  });

  fechaDesig = null;

  campos = [
    {
      id: "id",
      nombre: "Identificación (*)",
      tipo: "text"
    },
    {
      id: "nombre",
      nombre: "Nombre",
      tipo: "text"
    },
    {
      id: "ap1",
      nombre: "Primer apellido",
      tipo: "text"
    },
    {
      id: "ap2",
      nombre: "Segundo apellido",
      tipo: "text"
    },
    {
      id: "numDesig",
      nombre: "Número de designación",
      tipo: "text"
    }
  ];

  selectores = [
    {
      nombre: "Tipo (*)",
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

  datepickers = ['Fecha Designación'];

  constructor(private router: Router) { }

  ngOnInit(): void {

    if (Object.keys(this.datosProcurador).length !== 0) {
      this.notarioForm.get('id').setValue(this.datosProcurador.identificacion);
      this.notarioForm.get('nombre').setValue(this.datosProcurador.nombre);
      this.notarioForm.get('ap1').setValue(this.datosProcurador.ap1);
      this.notarioForm.get('ap2').setValue(this.datosProcurador.ap2);
      this.notarioForm.get('numDesig').setValue('2019/234567');
      this.fechaDesig = new Date('02/04/2019');
    }

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

  search() {
    this.router.navigate(['/pantallaBuscadorProcurador']);
  }

}
