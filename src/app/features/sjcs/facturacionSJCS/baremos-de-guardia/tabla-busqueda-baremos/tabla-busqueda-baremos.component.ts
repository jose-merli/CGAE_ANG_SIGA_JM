import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-tabla-busqueda-baremos',
  templateUrl: './tabla-busqueda-baremos.component.html',
  styleUrls: ['./tabla-busqueda-baremos.component.scss']
})
export class TablaBusquedaBaremosComponent implements OnInit {

  selectedDatos = [];
  datosDefecto = [
    {
      idTurno: 'Turno1',
      nDias: 'nDias1',
      tipoBaremo: 'tipoBaremo1',
      diasAplicar: 'diasAplicar1',
      minimo: 'minimo1',
      dispImporte: 'dispImporte1',
      naPartir1: 'naPartir11',
      maximo: 'maximo1',
      naPartir2: 'naPartir21',
      porDia: 'porDia1',
      guardias: [
        {
          idGuardia: 'idGuardia1',
          nDiasGuardia: 'nDiasGuardia1',
          tipoBaremoGuardia: 'tipoBaremoGuardia1',
          diasAplicarGuardia: 'diasAplicarGuardia1',
          minimoGuardia: 'minimoGuardia1',
          dispImporteGuardia: 'dispImporteGuardia1',
          naPartir1Guardia: 'naPartir1Guardia1',
          maximoGuardia: 'maximoGuardia1',
          naPartir2Guardia: 'naPartir2Guardia1',
          porDiaGuardia: 'porDiaGuardia1'
        },
        {
          idGuardia: 'idGuardia2',
          nDiasGuardia: 'nDiasGuardia2',
          tipoBaremoGuardia: 'tipoBaremoGuardia2',
          diasAplicarGuardia: 'diasAplicarGuardia2',
          minimoGuardia: 'minimoGuardia2',
          dispImporteGuardia: 'dispImporteGuardia2',
          naPartir1Guardia: 'naPartir1Guardia2',
          maximoGuardia: 'maximoGuardia2',
          naPartir2Guardia: 'naPartir2Guardia2',
          porDiaGuardia: 'porDiaGuardia2'
        },
      ]
    }
  ];
  cols = [];
  subCols = [];
  rowsPerPage = [];
  selectedItem: number = 10;
  first = 0;

  @Input()datos;
  @Input()permisoEscritura;


  @ViewChild("table") tabla: Table;
  @ViewChild("tablaFoco") tablaFoco: ElementRef;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCols();

    if(this.datos == null || this.datos == undefined){
      this.datos = this.datosDefecto
    }
  }

  getCols() {

    this.cols = [
      { field: "nomTurno", header: "facturacionSJCS.baremosDeGuardia.turnoguardia", width: '20%' },
      { field: "ndias", header: "facturacionSJCS.baremosDeGuardia.nDias", width: '5%' },
      { field: "baremo", header: "facturacionSJCS.baremosDeGuardia.tipoBaremo", width: '15%' },
      { field: "dias", header: "facturacionSJCS.baremosDeGuardia.diasAplicar", width: '5%' },
      { field: "numMinimoSimple", header: "facturacionSJCS.baremosDeGuardia.minimo", width: '5%' },
      { field: "simpleOImporteIndividual", header: "facturacionSJCS.baremosDeGuardia.dispImporte", width: '5%' },
      { field: "naPartir", header: "facturacionSJCS.baremosDeGuardia.naPartir", width: '5%' },
      { field: "maximo", header: "facturacionSJCS.baremosDeGuardia.maximo", width: '5%' },
      { field: "naPartir", header: "facturacionSJCS.baremosDeGuardia.naPartir", width: '5%' },
      { field: "porDia", header: "facturacionSJCS.baremosDeGuardia.porDia", width: '5%' }
    ];

    this.subCols = [
      { field: "nombre" },
      { field: "diasAplicarGuardia" },
      { field: "tipoBaremoGuardia" },
      { field: "diasGuardia" },
      { field: "minimoGuardia" },
      { field: "dispImporteGuardia" },
      { field: "naPartir1Guardia" },
      { field: "maximoGuardia" },
      { field: "naPartir2Guardia" },
      { field: "porDiaGuardia" }
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
