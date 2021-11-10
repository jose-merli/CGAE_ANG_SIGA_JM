import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-tabla-busqueda-baremos',
  templateUrl: './tabla-busqueda-baremos.component.html',
  styleUrls: ['./tabla-busqueda-baremos.component.scss']
})
export class TablaBusquedaBaremosComponent implements OnInit {

  selectedDatos = [];
  datos = [
    { idTurno: 'Turno1', nDias: 'nDias1', tipoBaremo: 'tipoBaremo1', diasAplicar: 'diasAplicar1', minimo: 'minimo1', dispImporte: 'dispImporte1', naPartir1: 'naPartir11', maximo: 'maximo1', naPartir2: 'naPartir21', porDia: 'porDia1' },
    { idTurno: 'Turno2', nDias: 'nDias2', tipoBaremo: 'tipoBaremo2', diasAplicar: 'diasAplicar2', minimo: 'minimo2', dispImporte: 'dispImporte2', naPartir1: 'naPartir12', maximo: 'maximo2', naPartir2: 'naPartir22', porDia: 'porDia2' },
    { idTurno: 'Turno3', nDias: 'nDias3', tipoBaremo: 'tipoBaremo3', diasAplicar: 'diasAplicar3', minimo: 'minimo3', dispImporte: 'dispImporte3', naPartir1: 'naPartir13', maximo: 'maximo3', naPartir2: 'naPartir23', porDia: 'porDia3' }
  ];
  cols = [];
  rowsPerPage = [];
  selectedItem: number = 10;

  @ViewChild("table") tabla: Table;
  @ViewChild("tablaFoco") tablaFoco: ElementRef;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCols();
  }

  getCols() {

    this.cols = [
      { field: "idTurno", header: "facturacionSJCS.baremosDeGuardia.turnoguardia", width: '10%' },
      { field: "nDias", header: "facturacionSJCS.baremosDeGuardia.nDias", width: '10%' },
      { field: "tipoBaremo", header: "facturacionSJCS.baremosDeGuardia.tipoBaremo", width: '10%' },
      { field: "diasAplicar", header: "facturacionSJCS.baremosDeGuardia.diasAplicar", width: '10%' },
      { field: "minimo", header: "facturacionSJCS.baremosDeGuardia.minimo", width: '10%' },
      { field: "dispImporte", header: "facturacionSJCS.baremosDeGuardia.dispImporte", width: '10%' },
      { field: "naPartir1", header: "facturacionSJCS.baremosDeGuardia.naPartir", width: '10%' },
      { field: "maximo", header: "facturacionSJCS.baremosDeGuardia.maximo", width: '10%' },
      { field: "naPartir2", header: "facturacionSJCS.baremosDeGuardia.naPartir", width: '10%' },
      { field: "porDia", header: "facturacionSJCS.baremosDeGuardia.porDia", width: '10%' }
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

}
