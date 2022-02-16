import { Component, EventEmitter, OnInit, Output, AfterViewInit, ViewChild, Input } from '@angular/core';
import { MultiSelect, SelectItem } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { TranslateService } from '../../../../../../commons/translate';
import { BaremosGuardiaItem } from '../../../../../../models/sjcs/BaremosGuardiaItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { Enlace } from '../ficha-baremos-de-guardia.component';

@Component({
  selector: 'app-ficha-bar-datos-generales',
  templateUrl: './ficha-bar-datos-generales.component.html',
  styleUrls: ['./ficha-bar-datos-generales.component.scss']
})
export class FichaBarDatosGeneralesComponent implements OnInit, AfterViewInit {

  showTarjeta: boolean = true;
  cols: any[] = [];
  rowsPerPage: any[] = [];
  modoSeleccion = "single";
  selectedItem: number = 10;
  selectAll: boolean = false;
  selectedDatos = [];
  numSelected: number = 0;
  filtros: BaremosGuardiaItem = new BaremosGuardiaItem();

  @Output() addEnlace = new EventEmitter<Enlace>();
  @Output() guardiasByConf = new EventEmitter<boolean>();
  @Input() datos;
  @Input() modoEdicion;
  @Input() permisoEscritura: boolean = false;

  @ViewChild("table") tabla: Table;
  progressSpinner: boolean;
  comboTurno: SelectItem[] = [];
  comboGuardia: SelectItem[] = [];
  isNuevo: boolean;

  constructor( private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService:PersistenceService) { }

  ngOnInit() {
      if(this.datos != null || this.datos != undefined){
        this.datos = JSON.parse(JSON.stringify(this.datos));
        this.getCols();
        this.getComboTurnos();
      }
 
  }

  ngAfterViewInit() {

    const enlace: Enlace = {
      id: 'facSJCSFichaBarDatosGen',
      ref: document.getElementById('facSJCSFichaBarDatosGen')
    };

    this.addEnlace.emit(enlace);
  }

  onHideTarjeta() {
    // if (this.retencionesService.modoEdicion) {
    //this.showTarjeta = !this.showTarjeta;
    // } else {
    //   this.showTarjeta = true;
    // }

    this.showTarjeta ? this.showTarjeta = false : this.showTarjeta = true;
  }

  getCols() {

    this.cols = [
      { field: "nomturno", header: "facturacionSJCS.baremosDeGuardia.turno", width: "33%" },
      { field: "nomguardia", header: 'facturacionSJCS.baremosDeGuardia.guardia', width: "33%" },
      { field: "baremo", header: 'facturacionSJCS.baremosDeGuardia.tipoBaremo', width: "33%" }
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

  actualizaSeleccionados() {
    this.numSelected = 1
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

  getComboTurnos(){
    this.sigaServices.get("baremosGuardia_getTurnoForGuardia").subscribe(
      data => {
        this.comboTurno = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTurno);
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }
  onChangeTurno(event) {

    this.comboGuardia = [];

    if (event.value != null || event.value != undefined) {
      this.getComboGuardias(event.value);
    }

  }

  getComboGuardias(idTurnos: string[]){
    this.progressSpinner = true;

    const idTurnosStr = idTurnos.toString();

    this.sigaServices.getParam("combo_guardiaPorTurno", `?idTurno=${idTurnosStr}`).subscribe(
      data => {
        this.comboGuardia = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboGuardia);
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  onChangeGuardia() {

      if(this.filtros.idGuardia != null && this.filtros.idGuardia != undefined){
        this.getGuardiasByConf();
      }
   
  }

  disabledComboGuardia(): boolean {

    if (this.filtros.idTurno == null || this.filtros.idTurno == undefined) {
      return true;
    }
    return false;
  }

  getGuardiasByConf(){
    this.guardiasByConf.emit(true);
  }

  filaTablaCombos(){

    this.isNuevo = true;
   
    let dummy = {
      nomturno: "",
      nomguardia: "",
      baremo:"",
      isCombo: true
    };

    this.datos = [dummy, ...this.datos];
  }

  restablecer() {
    this.isNuevo = false;
    this.selectedDatos = []
    this.guardiasByConf.emit(true);
  }

  focusInputField(someMultiselect: MultiSelect) {
    setTimeout(() => {
      someMultiselect.filterInputChild.nativeElement.focus();
    }, 300);
  }

}
