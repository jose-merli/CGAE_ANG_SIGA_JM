import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { Http, Response } from '@angular/http';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/api';


@Component({
  selector: 'app-politica-cookies',
  templateUrl: './politica-cookies.component.html',
  styleUrls: ['./politica-cookies.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PoliticaCookiesComponent implements OnInit {


  formNotificaciones: FormGroup;
  datos: any[];
  colegios: any[];
  displayTable: boolean = false;


  constructor(private formBuilder: FormBuilder) {

    this.formNotificaciones = this.formBuilder.group({
      'colegio': null,
      'asunto': null,
      'destinatarios': null,
      'email': null,
    });

  }

  ngOnInit() {

    this.datos = [
      { nombre: 'Madrid', obligatorio: 'true' },
      { nombre: 'Sevilla', obligatorio: 'true' },
      { nombre: 'Madrid', obligatorio: 'false' },
      { nombre: 'Madrid', obligatorio: 'true' },
    ];

    this.colegios = [
      { label: '-', value: null },
      { label: 'Madrid', value: { name: 'Madrid' } },
      { label: 'Toledo', value: { name: 'Toledo' } },
    ];

  }

  onChangeColegio(e) {
    if (this.formNotificaciones.controls['colegio'].value === null) {
      this.displayTable = false;
    } else {
      this.displayTable = true;
    }

  }




}








