import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { TranslateService } from '../../../../../commons/translate';
import { FundamentosCalificacionItem } from '../../../../../models/sjcs/FundamentosCalificacionItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { Router } from '../../../../../../../node_modules/@angular/router';

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
  comboAux;

  @Output() isOpen = new EventEmitter<boolean>();
  @Input() buscar: boolean

  constructor(private persistenceService: PersistenceService, private translateService: TranslateService,
    private sigaServices: SigaServices, private router: Router) { }

  ngOnInit() {

    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.isOpen.emit(this.historico)

    } else {
      this.filtros = new FundamentosCalificacionItem();
    }
    this.sigaServices.get("busquedaFundamentosCalificacion_comboDictamen").subscribe(
      n => {

        this.comboDictamen = n.combooItems;

      },
      err => {
        console.log(err);
      }
    );

  }


  newFundamento() {
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionFundamentos"]);
  }

  onChangeDictamen() {

  }

  search() {

    this.persistenceService.setFiltros(this.filtros);
    this.isOpen.emit(false)


  }

  checkFilters() {
    if (
      ((this.filtros.descripcionFundamento != null && this.filtros.descripcionFundamento.length > 2)
        || this.filtros.descripcionDictamen != undefined)) {

      // quita espacios vacios antes de buscar
      if (this.filtros.descripcionFundamento != undefined && this.filtros.descripcionFundamento != null) {
        this.filtros.descripcionFundamento = this.filtros.descripcionFundamento.trim();
      }
      return true;
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
      return false;
    }
  }



  clearFilters() {
    this.filtros = new FundamentosCalificacionItem();
  }

  guardaBusca() {
    if (this.checkFilters()) {

      this.comboAux = this.filtros.descripcionDictamen
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
}
