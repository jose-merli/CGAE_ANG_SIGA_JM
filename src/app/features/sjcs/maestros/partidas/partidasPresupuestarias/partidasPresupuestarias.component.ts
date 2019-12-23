import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { PartidasItems } from '../../../../../models/sjcs/PartidasItems';
import { KEY_CODE } from '../../../../censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-partidasPresupuestarias',
  templateUrl: './partidasPresupuestarias.component.html',
  styleUrls: ['./partidasPresupuestarias.component.scss']
})
export class PartidasPresupuestarias implements OnInit {

  showDatosGenerales: boolean = true;
  buscar: boolean = false;
  filtroAux: PartidasItems = new PartidasItems();
  // grupoZona:string;
  // zona:string;
  // partidoJudicial:string;
  msgs: any[] = [];
  filtros: PartidasItems = new PartidasItems();
  jurisdicciones: any[] = [];
  /*Éste método es útil cuando queremos queremos informar de cambios en los datos desde el hijo,
    por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() busqueda = new EventEmitter<boolean>();

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService) { }

  ngOnInit() {
    if (this.persistenceService.getHistorico() != undefined) {
      this.filtros.historico = this.persistenceService.getHistorico();
      // this.isBuscar();
    }
    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      this.isBuscar();
    }
    this.filtros.descripciontemp = undefined;
    this.filtros.nombrepartidatemp = undefined;
  }

  newModulo() {
    this.persistenceService.setFiltros(this.filtros);
    this.router.navigate(["/fichaGrupomodulos"]);
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  checkFilters() {
    // if (
    //   (this.filtros.nombrepartida == null || this.filtros.nombrepartida.trim() == "" || this.filtros.nombrepartida.trim().length < 3) &&
    //   (this.filtros.descripcion == null || this.filtros.descripcion.trim() == "" || this.filtros.descripcion.trim().length < 3)) {
    //   this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
    //   return false;
    // } else {
    // quita espacios vacios antes de buscar
    if (this.filtros.nombrepartida != undefined && this.filtros.nombrepartida != null) {
      this.filtros.nombrepartida = this.filtros.nombrepartida.trim();
    }

    if (this.filtros.descripcion != undefined && this.filtros.descripcion != null) {
      this.filtros.descripcion = this.filtros.descripcion.trim();
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

  isBuscar() {
    if (this.checkFilters()) {
      this.persistenceService.setFiltros(this.filtros);
      this.persistenceService.setFiltrosAux(this.filtros);
      this.filtroAux = this.persistenceService.getFiltrosAux()
      this.busqueda.emit(false)
    }
  }


  showSearchIncorrect() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: this.translateService.instant(
        "cen.busqueda.error.busquedageneral"
      )
    });
  }

  clearFilters() {
    this.filtros.nombrepartida = "";
    this.filtros.descripcion = "";
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }

  clear() {
    this.msgs = [];
  }

}
