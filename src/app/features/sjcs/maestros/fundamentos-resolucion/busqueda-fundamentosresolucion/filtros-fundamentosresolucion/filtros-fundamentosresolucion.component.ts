import { Component, OnInit, Output, EventEmitter, HostListener, Input } from '@angular/core';
import { FundamentoResolucionItem } from '../../../../../../models/sjcs/FundamentoResolucionItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { KEY_CODE } from '../../../../../administracion/parametros/parametros-generales/parametros-generales.component';
import { Router } from '@angular/router';
import { CommonsService } from '../../../../../../_services/commons.service';

@Component({
  selector: 'app-filtros-fundamentosresolucion',
  templateUrl: './filtros-fundamentosresolucion.component.html',
  styleUrls: ['./filtros-fundamentosresolucion.component.scss']
})
export class FiltrosFundamentosresolucionComponent implements OnInit {


  showDatosGenerales: boolean = true;
  msgs = [];

  filtros: FundamentoResolucionItem = new FundamentoResolucionItem();
  filtroAux: FundamentoResolucionItem = new FundamentoResolucionItem();
  historico: boolean = false;

  @Output() isOpen = new EventEmitter<boolean>();
  @Input() permisoEscritura;

  constructor(private persistenceService: PersistenceService, private translateService: TranslateService,
    private router: Router, private commonsService: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getFiltros() != undefined) {
      this.filtroAux = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.isOpen.emit(this.historico)
      this.filtros = this.filtroAux;
    } else {
      this.filtros = new FundamentoResolucionItem();
    }

  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  search() {
    this.persistenceService.setFiltros(this.filtros);
    this.isOpen.emit(false)
    this.persistenceService.clearFiltros();
  }

  checkPermisosNewFundamentoResolucion() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.newFundamentoResolucion();
    }
  }

  newFundamentoResolucion() {
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionFundamentosResolucion"]);
  }

  clearFilters() {
    this.filtros = new FundamentoResolucionItem();
  }

  checkFilters() {
    // if ((this.filtros.codigoExt == null || this.filtros.codigoExt.trim() == "" || this.filtros.codigoExt.trim().length < 3) &&
    //   (this.filtros.descripcionFundamento == null || this.filtros.descripcionFundamento.trim() == "" || this.filtros.descripcionFundamento.trim().length < 3)) {
    //   this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
    //   return false;
    // } else {
    // quita espacios vacios antes de buscar
    if (this.filtros.descripcionFundamento != undefined && this.filtros.descripcionFundamento != null) {
      this.filtros.descripcionFundamento = this.filtros.descripcionFundamento.trim();
    }

    if (this.filtros.codigoExt != undefined && this.filtros.codigoExt != null) {
      this.filtros.codigoExt = this.filtros.codigoExt.trim();
    }

    return true;
    // }
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }


  guardaBusca() {
    if (this.checkFilters()) {
      this.filtroAux.codigoExt = this.filtros.codigoExt
      this.filtroAux.descripcionFundamento = this.filtros.descripcionFundamento
      this.search()
    }
  }
  clear() {
    this.msgs = [];
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      if (this.checkFilters()) {
        this.filtroAux.codigoExt = this.filtros.codigoExt
        this.filtroAux.descripcionFundamento = this.filtros.descripcionFundamento
        this.search()
      }
    }
  }


}
