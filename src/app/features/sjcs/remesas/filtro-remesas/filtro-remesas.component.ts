import { Component, OnInit, EventEmitter, HostListener, Input, ViewChild, Output } from '@angular/core';
import { KEY_CODE } from '../../../censo/busqueda-personas-juridicas/busqueda-personas-juridicas.component';
import { Router } from '../../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { RemesasBusquedaItem } from '../../../../models/sjcs/RemesasBusquedaItem';

@Component({
  selector: 'app-filtro-remesas',
  templateUrl: './filtro-remesas.component.html',
  styleUrls: ['./filtro-remesas.component.scss']
})
export class FiltroRemesasComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  filtros: RemesasBusquedaItem = new RemesasBusquedaItem();
  filtroAux: RemesasBusquedaItem = new RemesasBusquedaItem();
  historico: boolean = false;

  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones: any;

  @Input() permisoEscritura;
  @ViewChild("prueba") prueba;

  comboEstados = [];

  @Output() filtrosValues = new EventEmitter<RemesasBusquedaItem>();

  constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices,
    private persistenceService: PersistenceService, private commonServices: CommonsService) { }

  ngOnInit() {

    this.getComboEstados();

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }

    } else {
      this.filtros = new RemesasBusquedaItem();
    }

  }

  getComboEstados() {
    console.log("Dentro del comboEstado");
    this.sigaServices
      .get("filtrosremesas_comboEstadoRemesa")
      .subscribe(
        n => {
          console.log("Dentro de la respuesta");
          this.comboEstados = n.combooItems;
        },
        error => { },
        () => { }
      );
  }

  fillFechaGeneracionDesde(event) {
    if (event != null) {
      this.filtros.fechaGeneracionDesde = event;
    }
  }

  fillFechaGeneracionHasta(event) {
    if (event != null) {
      this.filtros.fechaGeneracionHasta = event;
    }
  }

  fillFechaEnvioDesde(event) {
    if (event != null) {
      this.filtros.fechaEnvioDesde = event;
    }
  }

  fillFechaEnvioHasta(event) {
    if (event != null) {
      this.filtros.fechaEnvioHasta = event;
    }
  }

  fillFechaRecepcionDesde(event) {
    if (event != null) {
      this.filtros.fechaRecepcionDesde = event;
    }
  }

  fillFechaRecepcionHasta(event) {
    if (event != null) {
      this.filtros.fechaRecepcionHasta = event;
    }
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  search() {
     /*  this.persistenceService.setFiltros(this.filtros);
      this.persistenceService.setFiltrosAux(this.filtros);
      this.filtroAux = this.persistenceService.getFiltrosAux() */
      this.filtrosValues.emit(this.filtros);
  }

  clearFilters() {
    this.filtros = new RemesasBusquedaItem();
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
