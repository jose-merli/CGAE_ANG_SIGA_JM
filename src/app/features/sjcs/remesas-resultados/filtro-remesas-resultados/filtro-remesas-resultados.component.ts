import { Component, OnInit, EventEmitter, HostListener, Input, ViewChild, Output } from '@angular/core';
import { KEY_CODE } from '../../../censo/busqueda-personas-juridicas/busqueda-personas-juridicas.component';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { RemesasResultadoItem } from '../../../../models/sjcs/RemesasResultadoItem';

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
    private persistenceService: PersistenceService, private commonServices: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      // this.permisoEscritura = this.persistenceService.getPermisos();
    }

    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }

    } else {
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

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  search() {
      this.filtrosValues.emit(this.filtros);
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

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.search();
    }
  }


}
