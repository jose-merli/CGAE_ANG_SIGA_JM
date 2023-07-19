import { Component, OnInit, Input, EventEmitter, ViewChild, Output, HostListener } from '@angular/core';
import { ProcuradoresItem } from '../../../../../../models/sjcs/ProcuradoresItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { SigaServices } from '../../../../../../_services/siga.service';
import { KEY_CODE } from '../../../../../administracion/parametros/parametros-generales/parametros-generales.component';
import { CommonsService } from '../../../../../../_services/commons.service';

@Component({
  selector: 'app-filtros-procuradores',
  templateUrl: './filtros-procuradores.component.html',
  styleUrls: ['./filtros-procuradores.component.scss']
})
export class FiltrosProcuradoresComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  filtros: ProcuradoresItem = new ProcuradoresItem();
  filtroAux: ProcuradoresItem = new ProcuradoresItem();
  historico: boolean = false;

  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones: any;

  @Input() permisoEscritura;

  @Output() isOpen = new EventEmitter<boolean>();

  constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices,
    private persistenceService: PersistenceService, private commonsService: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }


    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.isOpen.emit(this.historico)

    } else {
      this.filtros = new ProcuradoresItem();
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
      this.persistenceService.clearFiltros();
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
    this.router.navigate(["/gestionProcuradores"]);
  }

  checkFilters() {
    if (this.filtros.nombre != undefined && this.filtros.nombre != null) {
      this.filtros.nombre = this.filtros.nombre.trim();
    }
    if (this.filtros.apellido1 != undefined && this.filtros.apellido1 != null) {
      this.filtros.apellido1 = this.filtros.apellido1.trim();
    }
    if (this.filtros.codigoExt != undefined && this.filtros.codigoExt != null) {
      this.filtros.codigoExt = this.filtros.codigoExt.trim();
    }
    // if (
    //   (this.filtros.nombre == null || this.filtros.nombre == "" || this.filtros.nombre.length < 3) &&
    //   (this.filtros.apellido1 == null || this.filtros.apellido1 == "" || this.filtros.apellido1.length < 3) &&
    //   (this.filtros.codigoExt == null || this.filtros.codigoExt == "" || this.filtros.codigoExt.length < 3)) {
    //   this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
    //   return false;
    // } else {
    return true;
    // }
  }

  clearFilters() {
    this.filtros = new ProcuradoresItem();
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
