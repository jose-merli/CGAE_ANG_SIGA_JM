import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { KEY_CODE } from '../../../../administracion/parametros/parametros-generales/parametros-generales.component';

@Component({
  selector: 'app-filtro-justiciables',
  templateUrl: './filtro-justiciables.component.html',
  styleUrls: ['./filtro-justiciables.component.scss']
})
export class FiltroJusticiablesComponent implements OnInit {

  showDatosGenerales: boolean = true;
  showDatosDirecciones: boolean = true;
  showAsuntos: boolean = true;
  msgs = [];

  filtros: JusticiableBusquedaItem = new JusticiableBusquedaItem();
  filtroAux: JusticiableBusquedaItem = new JusticiableBusquedaItem();
  historico: boolean = false;


  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones: any;

  @Input() permisoEscritura;
  @Output() isOpen = new EventEmitter<boolean>();

  comboProvincias = [];
  comboPoblacion = [];
  comboRoles = [];

  constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices,
    private persistenceService: PersistenceService, private commonServices: CommonsService) { }

  ngOnInit() {

    this.getComboProvincias();
    this.getComboRoles();

    if (this.persistenceService.getFiltros() != undefined) {
      this.filtroAux = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.isOpen.emit(this.historico)

    } else {
      this.filtros = new JusticiableBusquedaItem();
    }

  }

  getComboRoles() {
    this.sigaServices.get("busquedaJusticiables_comboRoles").subscribe(
      n => {
        this.comboRoles = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboRoles);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboProvincias() {
    this.sigaServices.get("busquedaJuzgados_provinces").subscribe(
      n => {
        this.comboProvincias = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboProvincias);
      },
      err => {
        console.log(err);
      }
    );
  }

  onChangeProvincia() {

    this.filtros.idPoblacion = "";
    this.comboPoblacion = [];

    if (this.filtros.idProvincia != undefined && this.filtros.idProvincia != "") {
      this.isDisabledPoblacion = false;
    } else {
      this.isDisabledPoblacion = true;
    }

  }

  buscarPoblacion(e) {
    if (e.target.value && e.target.value !== null && e.target.value !== "") {
      if (e.target.value.length >= 3) {
        this.getComboPoblacion(e.target.value);
        this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
      } else {
        this.comboPoblacion = [];
        this.resultadosPoblaciones = this.translateService.instant("formacion.busquedaCursos.controlFiltros.minimoCaracteres");
      }
    } else {
      this.comboPoblacion = [];
      this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
    }
  }

  getComboPoblacion(dataFilter) {
    this.sigaServices
      .getParam(
        "busquedaJuzgados_population",
        "?idProvincia=" + this.filtros.idProvincia + "&dataFilter=" + dataFilter
      )
      .subscribe(
        n => {
          this.isDisabledPoblacion = false;
          this.comboPoblacion = n.combooItems;
        },
        error => { },
        () => { }
      );
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  onHideDatosDirecciones() {
    this.showDatosDirecciones = !this.showDatosDirecciones;
  }

  onHideAsuntos() {
    this.showAsuntos = !this.showAsuntos;
  }

  search() {

    if (this.checkFilters()) {
      this.persistenceService.setFiltros(this.filtros);
      this.persistenceService.setFiltrosAux(this.filtros);
      this.filtroAux = this.persistenceService.getFiltrosAux()
      this.isOpen.emit(false)
    }

  }


  nuevo() {
    this.persistenceService.clearDatos();
    // this.router.navigate(["/fichaEventos"]);
  }

  checkFilters() {
    if (
      (this.filtros.nombre == null || this.filtros.nombre.trim() == "" || this.filtros.nombre.length < 3) &&
      (this.filtros.codigoPostal == null || this.filtros.codigoPostal.trim() == "" || this.filtros.codigoPostal.length < 3) &&
      (this.filtros.anio == null || this.filtros.anio.trim() == "" || this.filtros.anio.length < 3) &&
      (this.filtros.idProvincia == null || this.filtros.idProvincia == "") &&
      (this.filtros.idPoblacion == null || this.filtros.idPoblacion == "")) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.filtros.nombre != undefined && this.filtros.nombre != null) {
        this.filtros.nombre = this.filtros.nombre.trim();
      }

      if (this.filtros.codigoPostal != undefined && this.filtros.codigoPostal != null) {
        this.filtros.codigoPostal = this.filtros.codigoPostal.trim();
      }

      if (this.filtros.anio != undefined && this.filtros.anio != null) {
        this.filtros.anio = this.filtros.anio.trim();
      }

      return true;
    }
  }

  clearFilters() {
    this.filtros = new JusticiableBusquedaItem();
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
