import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { TablaGestionZonasComponent } from '../tabla-gestion-zonas/tabla-gestion-zonas.component';
import { GestionZonasComponent } from '../gestion-zonas.component';
import { TranslateService } from '../../../../../commons/translate';
import { ZonasItem } from '../../../../../models/sjcs/ZonasItem';
import { KEY_CODE } from '../../../../censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
import { Router } from '@angular/router';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-filtro-gestion-zonas',
  templateUrl: './filtro-gestion-zonas.component.html',
  styleUrls: ['./filtro-gestion-zonas.component.scss']
})
export class FiltroGestionZonasComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  // grupoZona:string;
  // zona:string;
  // partidoJudicial:string;

  filtros: ZonasItem = new ZonasItem();
  filtroAux: ZonasItem = new ZonasItem();
  historico: boolean = false;
  @Input() permisoEscritura;

  /*Éste método es útil cuando queremos queremos informar de cambios en los datos desde el hijo,
    por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() isOpen = new EventEmitter<boolean>();

  constructor(private router: Router, private translateService: TranslateService, private persistenceService: PersistenceService) { }

  ngOnInit() {

    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.isOpen.emit(this.historico)

    } else {
      this.filtros = new ZonasItem();
    }

  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  isBuscar() {

    if (this.checkFilters()) {
      this.persistenceService.setFiltros(this.filtros);
      this.persistenceService.setFiltrosAux(this.filtros);
      this.filtroAux = this.persistenceService.getFiltrosAux()
      this.isOpen.emit(false)
    }

  }

  newZoneGroup() {
    this.router.navigate(["/fichaGrupoZonas"]);

  }

  checkFilters() {
    if (
      (this.filtros.descripcionzona == null || this.filtros.descripcionzona == "" || this.filtros.descripcionzona.length < 3) &&
      (this.filtros.descripcionsubzona == null || this.filtros.descripcionsubzona == "" || this.filtros.descripcionsubzona.length < 3) &&
      (this.filtros.descripcionpartido == null || this.filtros.descripcionpartido == "" || this.filtros.descripcionpartido.length < 3)) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.filtros.descripcionzona != undefined && this.filtros.descripcionzona != null) {
        this.filtros.descripcionzona = this.filtros.descripcionzona.trim();
      }

      if (this.filtros.descripcionsubzona != undefined && this.filtros.descripcionsubzona != null) {
        this.filtros.descripcionsubzona = this.filtros.descripcionsubzona.trim();
      }

      if (this.filtros.descripcionpartido != undefined && this.filtros.descripcionpartido != null) {
        this.filtros.descripcionpartido = this.filtros.descripcionpartido.trim();
      }
      return true;
    }
  }

  clearFilters() {
    this.filtros = new ZonasItem();
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
      this.isBuscar();
    }
  }



}
