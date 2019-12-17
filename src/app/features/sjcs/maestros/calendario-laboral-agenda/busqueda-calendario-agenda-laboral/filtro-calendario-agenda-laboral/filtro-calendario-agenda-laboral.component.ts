import { Component, OnInit, Input, ViewChild, Output, EventEmitter, HostListener } from '@angular/core';
import { EventoItem } from '../../../../../../models/EventoItem';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { SigaServices } from '../../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { KEY_CODE } from '../../../../../administracion/parametros/parametros-generales/parametros-generales.component';

@Component({
  selector: 'app-filtro-calendario-agenda-laboral',
  templateUrl: './filtro-calendario-agenda-laboral.component.html',
  styleUrls: ['./filtro-calendario-agenda-laboral.component.scss']
})
export class FiltroCalendarioAgendaLaboralComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  filtros: EventoItem = new EventoItem();
  filtroAux: EventoItem = new EventoItem();
  historico: boolean = false;

  @Input() permisoEscritura;

  @Output() isOpen = new EventEmitter<boolean>();

  constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices,
    private persistenceService: PersistenceService, private commonsService: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.isOpen.emit(this.historico)

    } else {
      this.filtros = new EventoItem();
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    else {
      return false;

    }
  }

  checkPermisosNuevo() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.nuevo();
    }
  }

  nuevo() {
    this.persistenceService.clearDatos();
    sessionStorage.setItem("calendarioLaboralAgenda", "true");
    this.router.navigate(["/fichaEventos"]);
  }

  checkFilters() {
    // if (
    //   (this.filtros.anio == null || this.filtros.anio == "" || this.filtros.anio.trim().length < 4)) {
    //   this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
    //   return false;
    // } else {

    if (this.filtros.anio != undefined && this.filtros.anio != null) {
      this.filtros.anio = this.filtros.anio.trim();
    }
    return true;
    // }
  }

  clearFilters() {
    this.filtros = new EventoItem();
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
