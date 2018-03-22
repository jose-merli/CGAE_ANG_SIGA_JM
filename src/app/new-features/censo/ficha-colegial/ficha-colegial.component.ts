import { Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { Http, Response } from '@angular/http';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { esCalendar } from '../../../utils/calendar';
import { Router } from '@angular/router';
import { DatosGeneralesComponent } from './datos-generales/datos-generales.component';
import { Message } from 'primeng/components/common/api';



@Component({
  selector: 'app-ficha-colegial',
  templateUrl: './ficha-colegial.component.html',
  styleUrls: ['./ficha-colegial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FichaColegialComponent implements OnInit {

  uploadedFiles: any[] = [];
  formBusqueda: FormGroup;
  cols: any = [];
  datosDirecciones: any[];
  select: any[];
  es: any = esCalendar;
  msgs: Message[];

  fichasActivas: Array<any> = [];
  todo: boolean = false;

  selectedDatos: any = []

  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = false;
  showDatosFacturacion: boolean = false;
  rowsPerPage: any = [];
  showAll: boolean = false;

  selectedItem: number = 4;
  selectedDoc: string = 'NIF'
  newDireccion: boolean = false;

  editar: boolean = false

  @ViewChild(DatosGeneralesComponent) datosGeneralesComponent: DatosGeneralesComponent

  @ViewChild('table')
  table

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "direcciones",
      activa: false
    },
    {
      key: "colegiales",
      activa: false
    },
    {
      key: "bancarios",
      activa: false
    },
    {
      key: "cv",
      activa: false
    }
  ]


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
        id: 0,
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

  onAbrirTodoClick() {
    this.showAll = !this.showAll
    this.fichasPosibles.forEach((ficha: any) => {
      ficha.activa = this.showAll;
    })
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

  addDireccion() {
    this.datosDirecciones = [...this.datosDirecciones, {
      tipoDireccion: '',
      direccion: '',
      new: true,
      cp: '',
      poblacion: '',
      telefono: '',
      fax: '',
      movil: '',
      email: '',
      preferente: ''
    }];
    this.newDireccion = true;

  }


  isEditar() {
    this.editar = true;
  }

  // onUpload(event) {
  //   for (let file of event.files) {
  //     this.uploadedFiles.push(file);
  //   }

  //   this.msgs = [];
  //   this.msgs.push({ severity: 'info', summary: 'File Uploaded', detail: '' });
  // }





}
