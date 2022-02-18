import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { BaremosGuardiaItem } from '../../../../../models/sjcs/BaremosGuardiaItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-tabla-busqueda-baremos',
  templateUrl: './tabla-busqueda-baremos.component.html',
  styleUrls: ['./tabla-busqueda-baremos.component.scss']
})
export class TablaBusquedaBaremosComponent implements OnInit {
  progressSpinner: boolean = false;
  selectedDatos = [];
  cols = [];
  subCols = [];
  rowsPerPage = [];
  selectedItem: number = 10;
  first = 0;
  selectionMode: String = "single";
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  selectAll: boolean = false;
  historico: boolean = false;

  @Input() datos;
  @Input() permisoEscritura;
  @Output() isHistorico = new EventEmitter<boolean>();
  @Input() desactivarHistorico: boolean = false;


  @ViewChild("table") tabla: Table;
  @ViewChild("tablaFoco") tablaFoco: ElementRef;
  msgs: any[];

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private persistenceService: PersistenceService,
    private router: Router,
    private location: Location) { }

  ngOnInit() {
    this.getCols();
    if (this.persistenceService.getHistorico() != undefined) {
      //this.historico = this.persistenceService.getHistorico();
      this.persistenceService.clearHistorico();
    } else {
      //this.historico = false;
    }
    this.historico= false;
    if (this.datos == null || this.datos == undefined) {
      this.datos = [];
    }
  }

  getCols() {

    this.cols = [
      { field: "nombre", header: "facturacionSJCS.baremosDeGuardia.turnoguardia", width: '20%' },
      { field: "nDias", header: "facturacionSJCS.baremosDeGuardia.nDias", width: '5%' },
      { field: "baremo", header: "facturacionSJCS.baremosDeGuardia.tipoBaremo", width: '15%' },
      { field: "diasGuardia", header: "facturacionSJCS.baremosDeGuardia.diasAplicar", width: '5%' },
      { field: "numMinimoSimple", header: "facturacionSJCS.baremosDeGuardia.minimo", width: '5%' },
      { field: "simpleOImporteIndividual", header: "facturacionSJCS.baremosDeGuardia.dispImporte", width: '5%' },
      { field: "naPartir", header: "facturacionSJCS.baremosDeGuardia.naPartir", width: '5%' },
      { field: "maximo", header: "facturacionSJCS.baremosDeGuardia.maximo", width: '5%' },
      { field: "naPartir", header: "facturacionSJCS.baremosDeGuardia.naPartir", width: '5%' },
      { field: "porDia", header: "facturacionSJCS.baremosDeGuardia.porDia", width: '5%' }
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

  showHistorico() {
    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    if (this.historico) {

      this.selectAll = false;
      this.numSelected = 0;
    }
    this.selectMultiple = false;
    this.selectionMode = "single";
    this.isHistorico.emit(this.historico);
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  selectDesSelectFila() {
    this.numSelected = this.selectedDatos.length;
  }


  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

  setItalic(dato) {
    if (dato.fechabaja == null) {
      return false;
    } else {
      return true;
    }
  }

  openFichaBaremos(rowData, historicoFicha) {
    if(rowData.fechabaja != null){
      let baremoGuar = new BaremosGuardiaItem();
      baremoGuar.idGuardia = rowData.idGuardia;
      baremoGuar.idTurno = rowData.idTurno;
      baremoGuar.nomguardia = rowData.guardias;
      baremoGuar.nomturno = rowData.nomTurno;
      baremoGuar.baremo = rowData.baremo;
      baremoGuar.idhitoconfiguracion = rowData.idhitoconfiguracion;

      sessionStorage.setItem('modoEdicionBaremo', "false");
      sessionStorage.setItem('dataBaremoMod', JSON.stringify(baremoGuar));
      this.router.navigate(['/fichaBaremosDeGuardia']);
    }else if (!this.desactivarHistorico) {
      let baremoGuar = new BaremosGuardiaItem();
      baremoGuar.idGuardia = rowData.idGuardia;
      baremoGuar.idTurno = rowData.idTurno;
      baremoGuar.nomguardia = rowData.guardias;
      baremoGuar.nomturno = rowData.nomTurno;
      baremoGuar.baremo = rowData.baremo;
      baremoGuar.idhitoconfiguracion = rowData.idhitoconfiguracion;

      sessionStorage.setItem('modoEdicionBaremo', "true");
      sessionStorage.setItem('dataBaremoMod', JSON.stringify(baremoGuar));
      this.router.navigate(['/fichaBaremosDeGuardia']);
    }
  }

}
