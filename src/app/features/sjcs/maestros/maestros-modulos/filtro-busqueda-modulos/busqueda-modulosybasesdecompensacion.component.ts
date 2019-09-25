import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
// import { TablaBusquedaModulosComponent } from '../tabla-busqueda-modulos/tabla-busqueda-modulos.component';
import { MaestrosModulosComponent } from '../maestros-modulos.component';
import { TranslateService } from '../../../../../commons/translate';
import { ModulosItem } from '../../../../../models/sjcs/ModulosItem';
import { KEY_CODE } from '../../../../censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-busqueda-modulosybasesdecompensacion',
  templateUrl: './busqueda-modulosybasesdecompensacion.component.html',
  styleUrls: ['./busqueda-modulosybasesdecompensacion.component.scss']
})
export class BusquedaModulosYBasesDeCompensacion implements OnInit {

  showDatosGenerales: boolean = true;
  buscar: boolean = false;
  // grupoZona:string;
  // zona:string;
  // partidoJudicial:string;
  msgs: any[] = [];
  filtros: ModulosItem = new ModulosItem();
  jurisdicciones: any[] = [];
  permisos: boolean = false;
  /*Éste método es útil cuando queremos queremos informar de cambios en los datos desde el hijo,
    por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() busqueda = new EventEmitter<boolean>();

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos()) {
      this.permisos = true;
    } else {
      this.permisos = false;
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

  newModulo() {
    this.persistenceService.setFiltros(this.filtros);
    this.router.navigate(["/fichaGrupomodulos"]);
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  isBuscar() {
    this.persistenceService.setFiltros(this.filtros);
    if ((this.filtros.nombre == undefined || this.filtros.nombre == "" ||
      this.filtros.nombre.trim().length < 3) && (this.filtros.codigo == undefined || this.filtros.codigo == ""
        || this.filtros.codigo.trim().length < 3)) {
      this.showSearchIncorrect();
    } else {
      this.buscar = true;
      this.filtros.historico = false;
      if (this.filtros.nombre != undefined && this.filtros.nombre != null) {
        this.filtros.nombre = this.filtros.nombre.trim();
      }

      if (this.filtros.codigo != undefined && this.filtros.codigo != null) {
        this.filtros.codigo = this.filtros.codigo.trim();
      }

      this.busqueda.emit(false);
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
