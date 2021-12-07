import { Component, OnInit, EventEmitter, HostListener, Input, ViewChild, Output } from '@angular/core';
import { KEY_CODE } from '../../../censo/busqueda-personas-juridicas/busqueda-personas-juridicas.component';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { RemesasResultadoItem } from '../../../../models/sjcs/RemesasResultadoItem';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-filtro-remesas-resultados',
  templateUrl: './filtro-remesas-resultados.component.html',
  styleUrls: ['./filtro-remesas-resultados.component.scss']
})
export class FiltroRemesasResultadosComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  filtros: RemesasResultadoItem = new RemesasResultadoItem(
    {
    'idRemesaResultado': null,
    'numRemesaPrefijo': '',
    'numRemesaNumero': '',
    'numRemesaSufijo': '',
    'numRegistroPrefijo': '',
    'numRegistroNumero': '',
    'numRegistroSufijo': '',
    'nombreFichero': '',
    'fechaRemesaDesde': '',
    'fechaRemesaHasta': '',
    'fechaCargaDesde': '',
    'fechaCargaHasta': '',
    'observacionesRemesaResultado': '',
    'fechaCargaRemesaResultado': '',
    'fechaResolucionRemesaResultado': '',
    'idRemesa': null,
    'numeroRemesa': '',
    'prefijoRemesa': '',
    'sufijoRemesa': '',
    'descripcionRemesa': '',
    'numRegistroRemesaCompleto': '',
    'numRemesaCompleto': ''
    }
  );
  filtroAux: RemesasResultadoItem = new RemesasResultadoItem(
    {
      'idRemesaResultado': null,
      'numRemesaPrefijo': '',
      'numRemesaNumero': '',
      'numRemesaSufijo': '',
      'numRegistroPrefijo': '',
      'numRegistroNumero': '',
      'numRegistroSufijo': '',
      'nombreFichero': '',
      'fechaRemesaDesde': '',
      'fechaRemesaHasta': '',
      'fechaCargaDesde': '',
      'fechaCargaHasta': '',
      'observacionesRemesaResultado': '',
      'fechaCargaRemesaResultado': '',
      'fechaResolucionRemesaResultado': '',
      'idRemesa': null,
      'numeroRemesa': '',
      'prefijoRemesa': '',
      'sufijoRemesa': '',
      'descripcionRemesa': '',
      'numRegistroRemesaCompleto': '',
      'numRemesaCompleto': ''
      }
  );
  historico: boolean = false;


  //@Input() permisoEscritura;
  @Output() filtrosValues = new EventEmitter<RemesasResultadoItem>();
  constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices,
    private persistenceService: PersistenceService,  private datepipe: DatePipe, private commonServices: CommonsService) { }

  ngOnInit() {
    if(localStorage.getItem("filtrosRemesaResultado")){

      this.filtros = JSON.parse(localStorage.getItem("filtrosRemesaResultado"));

      localStorage.removeItem("filtrosRemesaResultado");

      this.filtros.fechaCargaDesde = this.transformDate(this.filtros.fechaCargaDesde)
      this.filtros.fechaCargaHasta = this.transformDate(this.filtros.fechaCargaHasta)
      this.filtros.fechaRemesaDesde = this.transformDate(this.filtros.fechaRemesaDesde)
      this.filtros.fechaRemesaHasta = this.transformDate(this.filtros.fechaRemesaHasta)
      
      this.filtrosValues.emit(this.filtros);
    }

  }

  fillFechaRemesaDesde(event) {
    if (event != null) {
      this.filtros.fechaRemesaDesde = event;
    }
  }

  fillFechaRemesaHasta(event) {
    if (event != null) {
      this.filtros.fechaRemesaHasta = event;
    }
  }

  fillFechaCargaDesde(event) {
    if (event != null) {
      this.filtros.fechaCargaDesde = event;
    }
  }

  fillFechaCardaHasta(event) {
    if (event != null) {
      this.filtros.fechaCargaHasta = event;
    }
  }
  transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);
    return fecha;
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }


  clearFilters() {
    this.filtros = new RemesasResultadoItem(
      {
        'idRemesaResultado': null,
        'numRemesaPrefijo': '',
        'numRemesaNumero': '',
        'numRemesaSufijo': '',
        'numRegistroPrefijo': '',
        'numRegistroNumero': '',
        'numRegistroSufijo': '',
        'nombreFichero': '',
        'fechaRemesaDesde': '',
        'fechaRemesaHasta': '',
        'fechaCargaDesde': '',
        'fechaCargaHasta': '',
        'observacionesRemesaResultado': '',
        'fechaCargaRemesaResultado': '',
        'fechaResolucionRemesaResultado': '',
        'idRemesa': null,
        'numeroRemesa': '',
        'prefijoRemesa': '',
        'sufijoRemesa': '',
        'descripcionRemesa': '',
        'numRegistroRemesaCompleto': '',
        'numRemesaCompleto': ''
        }
    );
  }

  clear() {
    this.msgs = [];
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
  isBuscar(){
    this.filtrosValues.emit(this.filtros);
  }

  new(){
    localStorage.setItem('fichaRemesaResultado', "nuevo");
    this.router.navigate(["/remesasResultadoFicha"]);
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.filtrosValues.emit(this.filtros);
    }
  }

  
}
