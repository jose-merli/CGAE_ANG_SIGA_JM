import { Component, OnInit, EventEmitter, HostListener, Input, ViewChild, Output } from '@angular/core';
import { KEY_CODE } from '../../../../../censo/busqueda-personas-juridicas/busqueda-personas-juridicas.component';
import { } from '../../../../../../models/sjcs/ProcedimientoItem';
import { PretensionItem } from '../../../../../../models/sjcs/PretensionItem';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { SigaServices } from '../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';

@Component({
  selector: 'app-filtros-procedimientos',
  templateUrl: './filtros-procedimientos.component.html',
  styleUrls: ['./filtros-procedimientos.component.scss']
})
export class FiltrosProcedimientosComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  filtros: PretensionItem = new PretensionItem();
  filtroAux: PretensionItem = new PretensionItem();
  historico: boolean = false;

  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones: any;

  @Input() permisoEscritura;
  @ViewChild("prueba") prueba;

  comboProcedimientos = [];
  comboJurisdiccion = [];

  @Output() isOpen = new EventEmitter<boolean>();

  constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices,
    private persistenceService: PersistenceService, private commonServices: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }
    this.getComboJurisdiccion();
    this.getComboProcedimientos();

    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.isOpen.emit(this.historico)

    } else {
      this.filtros = new PretensionItem();
    }

  }


  getComboProcedimientos() {
    this.sigaServices
      .get("busquedaProcedimientos_procedimientos")
      .subscribe(
        n => {
          this.comboProcedimientos = n.combooItems;
        },
        error => { },
        () => { }
      );
  }

  getComboJurisdiccion() {

    this.sigaServices
      .get("busquedaProcedimientos_jurisdiccion")
      .subscribe(
        n => {
          this.comboJurisdiccion = n.combooItems;
        },
        error => { },
        () => { }
      );
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


  checkFilters() {
    if (this.filtros.descripcion != undefined) {
      this.filtros.descripcion = this.filtros.descripcion.trim();
    }
    // if (
    //   (this.filtros.descripcion == null || this.filtros.descripcion.trim() == "" || this.filtros.descripcion.trim().length < 3) &&
    //   (this.filtros.idJurisdiccion == null || this.filtros.idJurisdiccion == "") &&
    //   (this.filtros.idPretension == null || this.filtros.idPretension == "")) {
    //   this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
    //   return false;
    // } else {

    return true;
    // }
  }

  clearFilters() {
    this.filtros = new PretensionItem();
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
