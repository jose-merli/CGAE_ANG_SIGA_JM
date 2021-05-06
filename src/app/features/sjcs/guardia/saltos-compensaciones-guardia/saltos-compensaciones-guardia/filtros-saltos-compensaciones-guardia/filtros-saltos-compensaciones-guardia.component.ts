import { Component, OnInit, Input, EventEmitter, Output, HostListener } from '@angular/core';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { SigaServices } from '../../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { KEY_CODE } from '../../../../maestros/fundamentos-calificacion/fundamentos-calificacion.component';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
import { SaltoCompItem } from '../../../../../../models/guardia/SaltoCompItem';

@Component({
  selector: 'app-filtros-saltos-compensaciones-guardia',
  templateUrl: './filtros-saltos-compensaciones-guardia.component.html',
  styleUrls: ['./filtros-saltos-compensaciones-guardia.component.scss']
})
export class FiltrosSaltosCompensacionesGuardiaComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  filtros: SaltoCompItem = new SaltoCompItem();
  filtroAux: SaltoCompItem = new SaltoCompItem();
  historico: boolean = false;

  isDisabledGuardia: boolean = true;

  @Input() permisoEscritura;

  comboGuardias = [];
  comboTurnos = [];

  @Output() isOpen = new EventEmitter<boolean>();

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }
    this.getComboTurno();
    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.isOpen.emit(this.historico)

    } else {
      // this.filtros = new RetencionIrpfItem();
    }

  }

  getComboTurno() {

    this.sigaServices.get("busquedaGuardia_turno").subscribe(
      n => {
        this.comboTurnos = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTurnos);
      },
      err => {
        console.log(err);
      }
    );
  }

  onChangeTurno() {
    this.filtros.idGuardia = "";
    this.comboGuardias = [];

    if (this.filtros.idTurno) {
      this.getComboGuardia();
    } else {
      this.isDisabledGuardia = true;
    }
  }

  getComboGuardia() {
    this.sigaServices.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + this.filtros.idTurno).subscribe(
        data => {
          this.isDisabledGuardia = false;
          this.comboGuardias = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboGuardias);
        },
        err => {
          console.log(err);
        }
      );
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  search() {
    this.persistenceService.setFiltros(this.filtros);
    this.persistenceService.setFiltrosAux(this.filtros);
    this.filtroAux = this.persistenceService.getFiltrosAux()
    this.isOpen.emit(false);

  }

  fillFechaDesde(event) {
    this.filtros.fechaDesde = event;
  }
  fillFechaHasta(event) {
    this.filtros.fechaHasta = event;
  }

  getFechaHasta(fechaInputDesde, fechainputHasta) {
    if (
      fechaInputDesde != undefined &&
      fechainputHasta != undefined
    ) {
      let one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      let fechaDesde = new Date(fechaInputDesde).getTime();
      let fechaHasta = new Date(fechainputHasta).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechainputHasta = undefined;
    }
    return fechainputHasta;
  }
  getFechaDesde(fechaInputesde, fechaInputHasta) {
    if (
      fechaInputesde != undefined &&
      fechaInputHasta != undefined
    ) {
      // convertir fechas en milisegundos
      let fechaDesde = new Date(fechaInputesde).getTime();
      let fechaHasta = new Date(fechaInputHasta).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechaInputesde = undefined;
    }
    return fechaInputesde;
  }

  clearFilters() {
    this.filtros = new SaltoCompItem();
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
