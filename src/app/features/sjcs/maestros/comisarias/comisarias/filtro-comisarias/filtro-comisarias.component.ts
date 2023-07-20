import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { PrisionItem } from '../../../../../../models/sjcs/PrisionItem';
import { TranslateService } from '../../../../../../commons/translate';
import { Router } from '@angular/router';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { KEY_CODE } from '../../../../../administracion/parametros/parametros-generales/parametros-generales.component';
import { ComisariaItem } from '../../../../../../models/sjcs/ComisariaItem';

@Component({
  selector: 'app-filtro-comisarias',
  templateUrl: './filtro-comisarias.component.html',
  styleUrls: ['./filtro-comisarias.component.scss']
})
export class FiltroComisariasComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  filtros: ComisariaItem = new ComisariaItem();
  filtroAux: ComisariaItem = new ComisariaItem();
  historico: boolean = false;

  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones: any;

  @Input() permisoEscritura;
  @ViewChild("prueba") prueba;

  comboProvincias = [];
  comboPoblacion = [];

  @Output() isOpen = new EventEmitter<boolean>();

  constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices,
    private persistenceService: PersistenceService, private commonsService: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    this.getComboProvincias();

    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.isOpen.emit(this.historico)

    } else {
      this.filtros = new ComisariaItem();
    }
    // if(this.permisoEscritura != )

  }

  getComboProvincias() {
    this.sigaServices.get("busquedaPrisiones_provinces").subscribe(
      n => {
        this.comboProvincias = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboProvincias);
      },
      err => {
        //console.log(err);
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
        "busquedaPrisiones_population",
        "?idProvincia=" + this.filtros.idProvincia + "&dataFilter=" + dataFilter
      )
      .subscribe(
        n => {
          this.isDisabledPoblacion = false;
          this.comboPoblacion = n.combooItems;
          this.commonsService.arregloTildesCombo(this.comboPoblacion);

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
    this.router.navigate(["/gestionComisarias"]);
  }

  checkFilters() {
    // if (
    //   (this.filtros.nombre == null || this.filtros.nombre.trim() == "" || this.filtros.nombre.trim().length < 3) &&
    //   (this.filtros.codigoExt == null || this.filtros.codigoExt.trim() == "" || this.filtros.codigoExt.trim().length < 3) &&
    //   (this.filtros.idProvincia == null || this.filtros.idProvincia == "") &&
    //   (this.filtros.idPoblacion == null || this.filtros.idPoblacion == "")) {
    //   this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
    //   return false;
    // } else {
    // quita espacios vacios antes de buscar
    if (this.filtros.nombre != undefined && this.filtros.nombre != null) {
      this.filtros.nombre = this.filtros.nombre.trim();
    }

    if (this.filtros.codigoExt != undefined && this.filtros.codigoExt != null) {
      this.filtros.codigoExt = this.filtros.codigoExt.trim();
    }

    return true;
    // }
  }

  clearFilters() {
    this.filtros = new ComisariaItem();
    this.persistenceService.clearFiltros();
    this.isDisabledPoblacion = true;
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
