import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
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
  cols: any = [];
  datos: any[];
  select: any[];
  es: any = esCalendar;
  selectedValue: string = 'simple';

  // selectedDatos: any = []

  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = false;
  showDatosFacturacion: boolean = false;
  rowsPerPage: any = [];
  selectMultiple: boolean = false;

  buscar: boolean = false;
  selectAll: boolean = false;

  selectedItem: number = 10;
  @ViewChild('table')
  table
  selectedDatos

  masFiltros: boolean = false;
  labelFiltros: string;
  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "colegiales",
      activa: false
    },
    {
      key: "facturacion",
      activa: false
    }
  ]


  constructor(private formBuilder: FormBuilder, private router: Router, private changeDetectorRef: ChangeDetectorRef) {

    this.formBusqueda = this.formBuilder.group({
      'cif': null,
      'fechaNacimiento': new FormControl(null, Validators.required),
      'fechaIncorporacion': new FormControl(null),
      'fechaFacturacion': new FormControl(null),
    });


  }

  ngOnInit() {

    this.cols = [
      { field: 'nif', header: 'NIF/CIF' },
      { field: 'numColegiado', header: 'Nº colegiado' },
      { field: 'apellidos', header: 'Apellidos' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'fechaIngreso', header: 'Fecha de ingreso' },
      { field: 'estadoColegial', header: 'Estado colegial' },
      { field: 'residente', header: 'Residente' },
      { field: 'telefono', header: 'Teléfono' },

    ];

    this.select = [
      { label: '-', value: null },
      { label: 'value1', value: { name: 'Value1' } },
      { label: 'value2', value: { name: 'Value2' } },
    ];



    this.datos = [
      { nif: '239123', numColegiado: '6578', apellidos: 'Andrés Maestre', nombre: 'Ana', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '12122', numColegiado: '6578', apellidos: 'Abellan sirvent', nombre: 'Javier', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '213223', numColegiado: '6578', apellidos: 'Andrés Maestre', nombre: 'Ana', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '53434', numColegiado: '6578', apellidos: 'Abellan sirvent', nombre: 'Javier', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '54534', numColegiado: '6578', apellidos: 'Andrés Maestre', nombre: 'Ana', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '554331', numColegiado: '6578', apellidos: 'Abellan sirvent', nombre: 'Javier', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '222', numColegiado: '6578', apellidos: 'Andrés Maestre', nombre: 'Ana', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '333', numColegiado: '6578', apellidos: 'Abellan sirvent', nombre: 'Javier', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '444', numColegiado: '6578', apellidos: 'Andrés Maestre', nombre: 'Ana', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '4445', numColegiado: '6578', apellidos: 'Abellan sirvent', nombre: 'Javier', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '12345', numColegiado: '6578', apellidos: 'Andrés Maestre', nombre: 'Ana', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '5656', numColegiado: '6578', apellidos: 'Abellan sirvent', nombre: 'Javier', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '6566', numColegiado: '6578', apellidos: 'Andrés Maestre', nombre: 'Ana', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '12655', numColegiado: '6578', apellidos: 'Abellan sirvent', nombre: 'Javier', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '7878', numColegiado: '6578', apellidos: 'Andrés Maestre', nombre: 'Ana', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '8777', numColegiado: '6578', apellidos: 'Abellan sirvent', nombre: 'Javier', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },



    ];

    this.rowsPerPage = [
      {
        label: 10, value: 10
      },
      {
        label: 20, value: 20
      },
      {
        label: 'Todo', value: this.datos.length
      },

    ]
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


  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }


  isBuscar() {
    this.buscar = true;
  }


  irFichaColegial(id) {
    if (!this.selectMultiple && !this.selectAll) {
      var ir = null;
      if (id && id.length > 0) {
        ir = id[0].numColegiado
      }
      this.router.navigate(['/fichaColegial', ir]);
    }

  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = []
    } else {
      this.selectAll = false
      this.selectedDatos = []
    }
  }

  verMasFiltros() {
    this.masFiltros = !this.masFiltros;
  }

  abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = true;
  }

  cerrarFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = false;
  }

  esFichaActiva(key) {

    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter((elto) => {
      return elto.key === key;
    })
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {}
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
    } else {
      this.selectedDatos = [];
    }
  }


}
