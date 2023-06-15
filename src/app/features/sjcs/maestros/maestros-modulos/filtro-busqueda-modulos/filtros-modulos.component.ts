import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
// import { TablaBusquedaModulosComponent } from '../tabla-busqueda-modulos/tabla-busqueda-modulos.component';
import { TranslateService } from '../../../../../commons/translate';
import { ModulosItem } from '../../../../../models/sjcs/ModulosItem';
import { KEY_CODE } from '../../../../censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../_services/commons.service';

@Component({
  selector: 'app-filtros-modulos',
  templateUrl: './filtros-modulos.component.html',
  styleUrls: ['./filtros-modulos.component.scss']
})
export class FiltrosModulosComponent implements OnInit {

  showDatosGenerales: boolean = true;
  buscar: boolean = false;
  // grupoZona:string;
  // zona:string;
  // partidoJudicial:string;
  msgs: any[] = [];
  filtros: ModulosItem = new ModulosItem();
  filtroAux: ModulosItem = new ModulosItem();
  jurisdicciones: any[] = [];
  @Input() permisos;
  vieneDeFichaJuzgado;
  /*Éste método es útil cuando queremos queremos informar de cambios en los datos desde el hijo,
    por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() busqueda = new EventEmitter<boolean>();
  

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService) { }

  ngOnInit() {

    if (sessionStorage.getItem("vieneDeFichaJuzgado")) {
      this.vieneDeFichaJuzgado = true;
      // this.isBuscar();
    }

    if (this.persistenceService.getHistorico() != undefined) {
      this.filtros.historico = this.persistenceService.getHistorico();
      // this.isBuscar();
    }
    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      this.isBuscar();
    }

  }

  checkPermisosNewModulo() {
    let msg = this.commonsService.checkPermisos(this.permisos, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.newModulo();
    }
  }

  newModulo() {
    this.persistenceService.setFiltros(this.filtros);
    this.router.navigate(["/gestionModulos"]);
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  checkFilters() {
    // if (
    //   (this.filtros.nombre == null || this.filtros.nombre.trim() == "" || this.filtros.nombre.trim().length < 3) &&
    //   (this.filtros.codigo == null || this.filtros.codigo.trim() == "" || this.filtros.codigo.trim().length < 3)) {
    //   this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
    //   return false;
    // } else {
    // quita espacios vacios antes de buscar
    if (this.filtros.nombre != undefined && this.filtros.nombre != null) {
      this.filtros.nombre = this.filtros.nombre.trim();
    }

    if (this.filtros.codigo != undefined && this.filtros.codigo != null) {
      this.filtros.codigo = this.filtros.codigo.trim();
    }

    return true;
    // }
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
    this.filtros = new ModulosItem();
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
