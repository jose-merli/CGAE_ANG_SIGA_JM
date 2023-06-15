import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { PartidasItems } from '../../../../../models/sjcs/PartidasItems';
import { KEY_CODE } from '../../../../censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { DestinatariosRetencItem } from '../../../../../models/sjcs/DestinatariosRetencItem';

@Component({
  selector: 'app-filtrosretenciones',
  templateUrl: './filtrosretenciones.component.html',
  styleUrls: ['./filtrosretenciones.component.scss']
})
export class FiltrosRetenciones implements OnInit {

  showDatosGenerales: boolean = true;
  buscar: boolean = false;
  // grupoZona:string;
  // zona:string;
  // partidoJudicial:string;
  msgs: any[] = [];
  filtros: DestinatariosRetencItem = new DestinatariosRetencItem();
  filtroAux: DestinatariosRetencItem = new DestinatariosRetencItem();
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
    this.filtros.cuentacontabletemp = undefined;
  }

  newModulo() {
    this.persistenceService.setFiltros(this.filtros);
    this.router.navigate(["/fichaGrupomodulos"]);
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  isBuscar() {
    if (this.checkFilters()) {
      this.persistenceService.setFiltros(this.filtros);
      this.persistenceService.setFiltrosAux(this.filtros);
      this.filtroAux = this.persistenceService.getFiltrosAux()
      this.busqueda.emit(false)
    }
  }
  checkFilters() {
    // if (
    //   (this.filtros.nombre == null || this.filtros.nombre.trim() == "" || this.filtros.nombre.trim().length < 3) &&
    //   (this.filtros.orden == null || this.filtros.orden.trim() == "" || this.filtros.orden.trim().length < 3) &&
    //   (this.filtros.cuentacontable == null || this.filtros.cuentacontable == "")) {
    //   this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
    //   return false;
    // } else {
    // quita espacios vacios antes de buscar
    if (this.filtros.nombre != undefined && this.filtros.nombre != null) {
      this.filtros.nombre = this.filtros.nombre.trim();
    }

    if (this.filtros.orden != undefined && this.filtros.orden != null) {
      this.filtros.orden = this.filtros.orden.trim();
    }
    if (this.filtros.cuentacontable != undefined && this.filtros.cuentacontable != null) {
      this.filtros.cuentacontable = this.filtros.cuentacontable.trim();
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
    this.filtros.nombre = "";
    this.filtros.orden = "";
    this.filtros.cuentacontable = "";
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
