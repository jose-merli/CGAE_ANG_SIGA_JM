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
    this.persistenceService.setFiltros(this.filtros);
    if ((this.filtros.nombre == undefined || this.filtros.nombre == "" ||
      this.filtros.nombre.trim().length < 3) && (this.filtros.orden == undefined || this.filtros.orden == ""
        || this.filtros.orden.trim().length < 3) && (this.filtros.cuentacontable == undefined || this.filtros.cuentacontable == ""
          || this.filtros.cuentacontable.trim().length < 3)) {
      this.showSearchIncorrect();
    } else {
      this.buscar = true;
      this.filtros.historico = false;
      this.filtros.nombrepartidatemp = this.filtros.nombre;
      this.filtros.descripciontemp = this.filtros.orden;
      this.filtros.cuentacontabletemp = this.filtros.cuentacontable;
      if (this.filtros.nombrepartidatemp != this.filtros.nombre) {
        this.filtros.nombrepartidatemp = this.filtros.nombre;
      }
      if (this.filtros.descripciontemp != this.filtros.orden) {
        this.filtros.descripciontemp = this.filtros.orden;
      }
      if (this.filtros.cuentacontabletemp != this.filtros.cuentacontable) {
        this.filtros.cuentacontabletemp = this.filtros.cuentacontable;
      }

      if (this.filtros.nombrepartidatemp != undefined && this.filtros.nombrepartidatemp != null) {
        this.filtros.nombrepartidatemp = this.filtros.nombrepartidatemp.trim();
        // this.filtros.nombrepartida = this.filtros.nombrepartida.trim();
      }

      if (this.filtros.descripciontemp != undefined && this.filtros.descripciontemp != null) {
        this.filtros.descripciontemp = this.filtros.descripciontemp.trim();
        // this.filtros.descripcion = this.filtros.descripcion.trim();
      }
      if (this.filtros.cuentacontabletemp != undefined && this.filtros.cuentacontabletemp != null) {
        this.filtros.cuentacontabletemp = this.filtros.cuentacontabletemp.trim();
        // this.filtros.descripcion = this.filtros.descripcion.trim();
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
