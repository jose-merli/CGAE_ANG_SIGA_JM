import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { Http, Response } from '@angular/http';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { esCalendar } from '../../../utils/calendar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-busqueda-colegiados',
  templateUrl: './busqueda-colegiados.component.html',
  styleUrls: ['./busqueda-colegiados.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BusquedaColegiadosComponent implements OnInit {


  formBusqueda: FormGroup;
  datos: any[];
  es: any = esCalendar;
  select: any[];
  selectedValue: string = 'simple';

  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = false;
  showDatosFacturacion: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router) {

    this.formBusqueda = this.formBuilder.group({
      'cif': null,
    });


  }

  ngOnInit() {

    this.select = [
      { label: '-', value: null },
      { label: 'value1', value: { name: 'Value1' } },
      { label: 'value2', value: { name: 'Value2' } },
    ];



    this.datos = [
      { nifSociedad: '12345', denominacion: 'Denominación', estado: 'Procesado \n Con incidencia', procesado: 'true', conIncidencia: 'true' },
      { nifSociedad: '42453', denominacion: 'Denominación', estado: 'Procesado', procesado: 'true' },
      { nifSociedad: '74577', denominacion: 'Denominación', estado: 'Con incidencia', conIncidencia: 'true' },
      { nifSociedad: '45354', denominacion: 'Denominación', estado: 'Procesado', procesado: 'true' },
    ];
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales
  }
  onHideDatosColegiales() {
    this.showDatosColegiales = !this.showDatosColegiales
  }
  onHideDatosFacturacion() {
    this.showDatosFacturacion = !this.showDatosFacturacion
  }



}
