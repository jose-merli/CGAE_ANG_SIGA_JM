import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { DataTable } from 'primeng/primeng';
import { ColegiadosSJCSItem } from '../../../models/ColegiadosSJCSItem';

@Component({
  selector: 'app-tabla-buscador-colegiados',
  templateUrl: './tabla-buscador-colegiados.component.html',
  styleUrls: ['./tabla-buscador-colegiados.component.scss']
})
export class TablaBuscadorColegiadosComponent implements OnInit {
  progressSpinner: boolean = false;
  selectMultiple: boolean = false;
 
  cols;

  rowsPerPage = [];
  selectedDatos = [];
  buscadores = [];

  selectedItem: number = 10;

  @Input() datos;

  @Output() colegiado = new EventEmitter<ColegiadosSJCSItem>();

  @ViewChild("table") table: DataTable;

  constructor(private router: Router, private location: Location, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.progressSpinner = true;
    this.selectedDatos = [];

    this.getCols();

    this.progressSpinner = false;

  }

  colegiadoSelected(event) {
    this.colegiado.emit(event.data);
  }

  getCols(){
    this.cols = [
      { field: "nif", header: "administracion.usuarios.literal.NIFCIF" },
      { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre" },
      { field: "apellidos", header: "gratuita.mantenimientoTablasMaestra.literal.apellidos" },
      { field: "abreviatura", header: "censo.busquedaClientesAvanzada.literal.colegio" },
      { field: "nColegiado", header: "censo.busquedaClientesAvanzada.literal.nColegiado" },
      { field: "tieneTurno", header: "gratuita.busquedaSJCS.tipoFiltro.inscritosTurno.abreviado" },
      { field: "tieneGuardia", header: "gratuita.busquedaSJCS.tipoFiltro.inscritosGuardia.abreviado" },
      { field: "guardiasPendientes", header: "gratuita.busquedaSJCS.literal.guardiasPendientes.abreviado" }
    ];

    this.cols.forEach(it => this.buscadores.push(""));

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