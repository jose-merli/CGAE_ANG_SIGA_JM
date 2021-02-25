import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { DataTable } from 'primeng/primeng';

@Component({
  selector: 'app-resultado-buscador-colegiados',
  templateUrl: './resultado-buscador-colegiados.component.html',
  styleUrls: ['./resultado-buscador-colegiados.component.scss']
})
export class ResultadoBuscadorColegiadosComponent implements OnInit {
  progressSpinner: boolean = false;
 
  cols;

  rowsPerPage = [];
  selectedDatos = [];

  selectedItem: number = 10;

  @Input() datos;

  @ViewChild("table") table: DataTable;

  constructor(private router: Router, private location: Location, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.progressSpinner = true;
    this.selectedDatos = [];

    this.getCols();
  }

  colegiadoSelected(event) {
    console.log(event);
    // let user = {
    //   numColegiado:,
    //   nombreAp: `${this.elementos[this.rowSelected][2]}, ${this.elementos[this.rowSelected][1]}`
    // };

    // sessionStorage.setItem("usuarioBusquedaExpress", JSON.stringify(user));

    // this.location.back();
  }

  getCols(){
    this.cols = [
    { field: "nifCif", header: "administracion.usuarios.literal.NIFCIF" },
    { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre" },
    { field: "nombreApe", header: "gratuita.mantenimientoTablasMaestra.literal.apellidos" },
    { field: "idInstitucion", header: "censo.busquedaClientesAvanzada.literal.colegio" },
    { field: "nColegiado", header: "censo.resultadoDuplicados.numeroColegiado" },
    { field: "estadoColegial", header: "menu.justiciaGratuita.componentes.estadoColegial" },
    { field: "residencia", header: "censo.busquedaClientes.noResidente" }
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
    this.table.reset();
  }
}