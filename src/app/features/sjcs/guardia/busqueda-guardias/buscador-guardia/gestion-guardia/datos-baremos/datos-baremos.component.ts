import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TreeNode } from '../../../../../../../utils/treenode';

@Component({
  selector: 'app-datos-baremos',
  templateUrl: './datos-baremos.component.html',
  styleUrls: ['./datos-baremos.component.scss']
})
export class DatosBaremosComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  colsPartidoJudicial;
  msgs;
  selectedFile
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;
  message;
  permisos: boolean = false;
  datos = [
    {
      data: {
        name: "Documents",
        size: "75kb",
        type: "Folder",
        open: false,
      },
      children: [
        {
          data: {
            name: 'Work',
            size: '55kb',
            type: 'Folder',
            open: false,
          },
          children: [
            {
              data: {
                name: 'Expenses.doc',
                size: '30kb',
                type: 'Document',
                open: false,
              }
            },
            {
              data: {
                name: 'Resume.doc',
                size: '25kb',
                type: 'Resume',
                open: false,
              }
            }
          ],
        },
        {
          data: {
            name: 'Home',
            size: '20kb',
            type: 'Folder',
            open: false,
          },
          children: [
            {
              data: {
                name: 'Invoices',
                size: '20kb',
                type: 'Text',
                open: false,
              }
            }
          ]
        }
      ]
    },
    {
      data: {
        name: 'Pictures',
        size: '150kb',
        type: 'Folder',
        open: false,
      },
      children: [
        {
          data: {
            name: 'barcelona.jpg',
            size: '90kb',
            type: 'Picture',
            open: false,
          }
        },
        {
          data: {
            name: 'primeui.png',
            size: '30kb',
            type: 'Picture',
            open: false,
          }
        },
        {
          data: {
            name: 'optimus.jpg',
            size: '30kb',
            type: 'Picture',
            open: false,
          }
        }
      ]
    }
  ];
  initDatos;
  nuevo: boolean = false;
  progressSpinner: boolean = false;

  //Resultados de la busqueda


  @ViewChild("table") tabla;


  constructor(
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCols();

  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {

    // this.cols = [
    //   { field: "fsdf", header: "justiciaGratuita.guardia.gestion.numDias" },
    //   { field: "sdf", header: "justiciaGratuita.guardia.gestion.tipoBaremo" },
    //   { field: "sdf", header: "justiciaGratuita.guardia.gestion.diasAplicar" },
    //   { field: "sdf", header: "justiciaGratuita.guardia.gestion.minimo" },
    //   { field: "sdfsf", header: "justiciaGratuita.guardia.gestion.disp" },
    //   { field: "sdfs", header: "justiciaGratuita.guardia.gestion.numPartir" },
    //   { field: "sdfsd", header: "justiciaGratuita.guardia.gestion.maximo" },
    //   { field: "sdf", header: "justiciaGratuita.guardia.gestion.porDia" },

    // ];
    this.cols = [
      { field: 'name', header: 'name' },
      { field: 'size', header: 'size' },
      { field: 'type', header: 'type' }
    ];

    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  isSelectMultiple() {
    if (this.permisos) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        // this.pressNew = false;
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    }
    // this.volver();
  }
  openTab(event) {
    if (!event.data.data.open && event.data.data.children != null && event.data.data.children.length > 0) {
      this.datos[event.index].data.open = true;
      this.datos = this.datos.slice(0, event.index + 1).concat(event.data.children).concat(this.datos.slice(event.index + 1));
    }
    else if (event.data.data.open && event.data.data.children != null && event.data.data.children.length > 0) {
      this.datos[event.index].data.open = false
      this.datos = this.datos.slice(0, event.index + 1).concat(event.data.children).concat(this.datos.slice(event.index + event.data.children.length + 1));
    }
    this.selectedDatos.pop();
  }
}
