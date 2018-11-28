import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { Location } from "@angular/common";
import { Router } from '@angular/router';
import { PlantillaEnvioSearchItem } from '../../../../../models/PlantillaEnvioSearchItem';

@Component({
  selector: 'app-consultas-plantillas',
  templateUrl: './consultas-plantillas.component.html',
  styleUrls: ['./consultas-plantillas.component.scss']
})

export class ConsultasPlantillasComponent implements OnInit {

  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  formatos: any[];
  sufijos: any[];
  textFilter: string;
  openFicha: boolean = false;
  body: PlantillaEnvioSearchItem = new PlantillaEnvioSearchItem();

  @ViewChild('table') table: DataTable;
  selectedDatos


  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "consultas",
      activa: false
    },
    {
      key: "remitente",
      activa: false
    },

  ];


  constructor(private changeDetectorRef: ChangeDetectorRef, private location: Location, private router: Router) {


  }

  ngOnInit() {

    this.getDatos();

    this.textFilter = "Elegir";

    this.selectedItem = 4;

    this.cols = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'finalidad', header: 'Finalidad' },
    ];

    this.datos = [
      { id: '1', nombre: 'prueba', finalidad: 'prueba' },
      { id: '2', nombre: 'prueba', finalidad: 'prueba' }
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

    // this.body.idConsulta = this.consultas[1].value;
  }


  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }


  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
      this.numSelected = 0;
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  navigateTo(dato) {
    let id = dato[0].id;
    if (!this.selectMultiple) {
      this.router.navigate(['/fichaRegistroEnvioMasivo']);
    }
  }


  abreCierraFicha() {
    // let fichaPosible = this.getFichaPosibleByKey(key);

    // fichaPosible.activa = !fichaPosible.activa;
    this.openFicha = !this.openFicha;

  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }

  getDatos() {
    if (sessionStorage.getItem("plantillasEnvioSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("plantillasEnvioSearch"));
    }
  }



}


