import { Component, OnInit, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { TranslateService } from '../../../../../commons/translate';
import { FundamentosCalificacionItem } from '../../../../../models/sjcs/FundamentosCalificacionItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { CommonsService } from '../../../../../_services/commons.service';
export enum KEY_CODE {
  ENTER = 13
}
@Component({
  selector: 'app-filtro-fundamentos-calificacion',
  templateUrl: './filtro-fundamentos-calificacion.component.html',
  styleUrls: ['./filtro-fundamentos-calificacion.component.scss']
})
export class FiltroFundamentosCalificacionComponent implements OnInit {

  msgs = [];
  showDatosGenerales: boolean = true;
  filtros: FundamentosCalificacionItem = new FundamentosCalificacionItem();
  historico: boolean = false
  comboDictamen = [];
  filtroAux: FundamentosCalificacionItem = new FundamentosCalificacionItem();

  @Output() isOpen = new EventEmitter<boolean>();
  @Input() permisoEscritura

  constructor(private persistenceService: PersistenceService, private translateService: TranslateService,
    private sigaServices: SigaServices, private router: Router, private commonServices: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();

      if (this.persistenceService.getFiltrosAux() != undefined) {
        this.filtroAux = this.persistenceService.getFiltrosAux();
      }
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.isOpen.emit(this.historico)
    } else {
      this.filtros = new FundamentosCalificacionItem()
      this.filtroAux = new FundamentosCalificacionItem()
    }
    this.getComboDictamen()


  }

  getComboDictamen() {
    this.sigaServices.get("busquedaFundamentosCalificacion_comboDictamen").subscribe(
      n => {
        this.comboDictamen = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboDictamen);
      },
      err => {
        //console.log(err);
      }
    );
  }

  checkPermisosNewFundamento() {
    let msg = this.commonServices.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.newFundamento();
    }
  }

  newFundamento() {
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionFundamentos"]);
  }

  search() {

    this.filtroAux = this.persistenceService.getFiltrosAux()

    this.isOpen.emit(false)
    this.persistenceService.clearFiltros();


  }

  checkFilters() {
    if (this.filtros.descripcionFundamento != undefined && this.filtros.descripcionFundamento != null) {
      this.filtros.descripcionFundamento = this.filtros.descripcionFundamento.trim();
    }
    return true;
  }



  clearFilters() {
    this.filtros = new FundamentosCalificacionItem();
  }

  guardaBusca() {
    if (this.checkFilters()) {
      this.persistenceService.setFiltros(this.filtros);
      this.persistenceService.setFiltrosAux(this.filtros);
      this.search()
    }
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {



      this.guardaBusca();

    }
  }
}
