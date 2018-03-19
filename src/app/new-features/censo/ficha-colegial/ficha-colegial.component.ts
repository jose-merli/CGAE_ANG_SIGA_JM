import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { Http, Response } from '@angular/http';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { esCalendar } from '../../../utils/calendar';
import { Router } from '@angular/router';



@Component({
  selector: 'app-ficha-colegial',
  templateUrl: './ficha-colegial.component.html',
  styleUrls: ['./ficha-colegial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FichaColegialComponent implements OnInit {


  formBusqueda: FormGroup;
  cols: any = [];
  datosDirecciones: any[];
  select: any[];
  es: any = esCalendar;

  fichasActivas: Array<any> = [];
  todo: boolean = false;

  // selectedDatos: any = []

  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = false;
  showDatosFacturacion: boolean = false;
  rowsPerPage: any = [];

  selectedItem: number = 4;
  selectedDoc: string = 'NIF'
  @ViewChild('table')
  table


  constructor(private formBuilder: FormBuilder, private router: Router, private changeDetectorRef: ChangeDetectorRef) {

    this.formBusqueda = this.formBuilder.group({
      'cif': null,
    });


  }

  ngOnInit() {





    this.cols = [
      { field: 'tipoDireccion', header: 'Tipo dirección' },
      { field: 'direccion', header: 'Dirección' },
      { field: 'cp', header: 'Código postal' },
      { field: 'poblacion', header: 'Población' },
      { field: 'telefono', header: 'Teléfono' },
      { field: 'fax', header: 'Fax' },
      { field: 'movil', header: 'Movil' },
      { field: 'email', header: 'Email' },
      { field: 'preferente', header: 'Preferente' },

    ];

    this.select = [
      { label: '-seleccionar-', value: null },
      { label: 'NIF', value: 'nif' },
      { label: 'Pasaporte', value: 'pasaporte' },
      { label: 'NIE', value: 'nie' },
    ];



    this.datosDirecciones = [
      {
        tipoDireccion: 'CensoWeb, Despacho, Facturación, Guardia, Guía Judicial, Pública, Revista, Traspaso a organos judiciales',
        direccion: 'C/ CARDENAL CISNEROS 42-1º',
        cp: '03660',
        poblacion: 'Novelda',
        telefono: '99999',
        fax: '2434344',
        movil: '88888',
        email: 'email@redabogacia.org',
        preferente: 'correo,Mail,Fax,SMS'
      },




    ];

    this.rowsPerPage = [
      {
        label: 4, value: 4
      },
      {
        label: 6, value: 6
      },
      {
        label: 'Todo', value: this.datosDirecciones.length
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


  abrirFicha(ref) {
    this.fichasActivas.push(ref)
    /*this.mostrarPanel = ref;*/
    console.log(ref)
  }

  cerrarFicha(ref) {
    let indexBorrar;
    for (let i = 0; i < this.fichasActivas.length; i++) {
      if (this.fichasActivas[i] === ref) {
        indexBorrar = i;
        break
      }
    }

    if (indexBorrar >= 0) {
      this.fichasActivas.splice(indexBorrar, 1);
    }

    /*this.mostrarPanel = null;*/
  }

  esFichaActiva(ref) {

    for (let ficha of this.fichasActivas) {
      if (ficha === ref) {
        return true;
      }
    }
    return false;

    /*return mostrarPanel === ref*/
  }



}
