import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { KEY_CODE } from '../../../../administracion/parametros/parametros-generales/parametros-generales.component';

@Component({
  selector: 'app-filtro-justiciables',
  templateUrl: './filtro-justiciables.component.html',
  styleUrls: ['./filtro-justiciables.component.scss']
})
export class FiltroJusticiablesComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  filtros: JusticiableBusquedaItem = new JusticiableBusquedaItem();
  filtroAux: JusticiableBusquedaItem = new JusticiableBusquedaItem();
  historico: boolean = false;

  @Input() permisoEscritura;

  @Output() isOpen = new EventEmitter<boolean>();

  constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices,
    private persistenceService: PersistenceService, private commonServices: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getFiltros() != undefined) {
      this.filtroAux = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.isOpen.emit(this.historico)

    } else {
      this.filtros = new JusticiableBusquedaItem();
    }

  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  search() {

    if (this.checkFilters()) {
      this.persistenceService.setFiltros(this.filtros);
      this.persistenceService.setFiltrosAux(this.filtros);
      this.filtroAux = this.persistenceService.getFiltrosAux()
      this.isOpen.emit(false)
    }

  }


  nuevo() {
    this.persistenceService.clearDatos();
    // this.router.navigate(["/fichaEventos"]);
  }

  checkFilters() {
    // if (
    //   (this.filtros.anio == null || this.filtros.anio == "" || this.filtros.anio.trim().length < 4)) {
    //   this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
    //   return false;
    // } else {

    //   if (this.filtros.anio != undefined && this.filtros.anio != null) {
    //     this.filtros.anio = this.filtros.anio.trim();
    //   }
    //   return true;
    // }
  }

  clearFilters() {
    this.filtros = new JusticiableBusquedaItem();
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
