import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DatosRemitentePlantillaItem } from '../../../../../models/DatosRemitentePlantillaItem';
import { Location } from "@angular/common";
import { DataTable } from "primeng/datatable";

@Component({
  selector: 'app-remitente-plantilla',
  templateUrl: './remitente-plantilla.component.html',
  styleUrls: ['./remitente-plantilla.component.scss']
})
export class RemitentePlantillaComponent implements OnInit {
  openFicha: boolean = false;
  activacionEditar: boolean = true;
  body: DatosRemitentePlantillaItem = new DatosRemitentePlantillaItem();
  tiposEnvio: any[];
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];

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


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private location: Location,
    // private sigaServices: SigaServices
  ) {



  }

  ngOnInit() {

    this.getDatos();

    this.selectedItem = 5;

    this.cols = [
      { field: 'tipo', header: 'Tipo' },
      { field: 'valor', header: 'Valor' }
    ]

    this.datos = [
      { id: '1', tipo: 'Tipo', valor: '' },
    ]

    this.tiposEnvio = [
      {
        label: 'seleccione..', value: null
      },
      {
        label: 'Email', value: '1'
      },
      {
        label: 'SMS', value: '2'
      }
    ]

    // this.body.idTipoEnvio = this.tiposEnvio[1].value;
  }

  abreCierraFicha() {
    // let fichaPosible = this.getFichaPosibleByKey(key);
    if (this.activacionEditar == true) {
      // fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
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


  getDatos() {
    if (sessionStorage.getItem("plantillasEnvioSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("plantillasEnvioSearch"));
    }
  }


}
