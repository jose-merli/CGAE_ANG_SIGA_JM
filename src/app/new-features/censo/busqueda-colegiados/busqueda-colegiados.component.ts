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

  buscar: boolean = false;

  selectedItem: number = 4;
  @ViewChild('table')
  table


  constructor(private formBuilder: FormBuilder, private router: Router, private changeDetectorRef: ChangeDetectorRef) {

    this.formBusqueda = this.formBuilder.group({
      'cif': null,
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
      { nif: '239123', numColegiado: '6578', apellidos: 'Andrés MAaestre', nombre: 'Ana', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '12122', numColegiado: '6578', apellidos: 'Abellan sirvent', nombre: 'Javier', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '213223', numColegiado: '6578', apellidos: 'Andrés MAaestre', nombre: 'Ana', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '53434', numColegiado: '6578', apellidos: 'Abellan sirvent', nombre: 'Javier', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '54534', numColegiado: '6578', apellidos: 'Andrés MAaestre', nombre: 'Ana', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '554331', numColegiado: '6578', apellidos: 'Abellan sirvent', nombre: 'Javier', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '222', numColegiado: '6578', apellidos: 'Andrés MAaestre', nombre: 'Ana', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '333', numColegiado: '6578', apellidos: 'Abellan sirvent', nombre: 'Javier', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '444', numColegiado: '6578', apellidos: 'Andrés MAaestre', nombre: 'Ana', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '4445', numColegiado: '6578', apellidos: 'Abellan sirvent', nombre: 'Javier', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '12345', numColegiado: '6578', apellidos: 'Andrés MAaestre', nombre: 'Ana', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '5656', numColegiado: '6578', apellidos: 'Abellan sirvent', nombre: 'Javier', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '6566', numColegiado: '6578', apellidos: 'Andrés MAaestre', nombre: 'Ana', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '12655', numColegiado: '6578', apellidos: 'Abellan sirvent', nombre: 'Javier', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '7878', numColegiado: '6578', apellidos: 'Andrés MAaestre', nombre: 'Ana', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },
      { nif: '8777', numColegiado: '6578', apellidos: 'Abellan sirvent', nombre: 'Javier', fechaIngreso: '22/02/2000', estadoColegial: 'No ejerciente', residente: 'si', telefono: '99999999' },



    ];

    this.rowsPerPage = [
      {
        label: 4, value: 4
      },
      {
        label: 6, value: 6
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
    console.log(event);
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset()


  }

  // confirmarBorrar(index) {
  //   this.confirmationService.confirm({
  //     message: '¿Está seguro de eliminar los datos?',
  //     icon: 'far fa-trash-alt',
  //     accept: () => {
  //       this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' }];
  //       this.socios.splice(index, 1);
  //       this.socios = [...this.socios];
  //     },
  //     reject: () => {
  //       this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
  //     }
  //   });
  // }


  isBuscar() {
    this.buscar = true;
  }


  irFichaColegial(id) {
    var ir = null;
    if (id && id.length > 0) {
      ir = id[0].numColegiado
    }
    this.router.navigate(['/fichaColegial', ir]);
  }


}
