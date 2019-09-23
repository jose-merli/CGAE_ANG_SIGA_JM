import { Component, OnInit, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { KEY_CODE } from '../../../../administracion/parametros/parametros-generales/parametros-generales.component';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { JuzgadoItem } from '../../../../../models/sjcs/JuzgadoItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';

@Component({
  selector: 'app-filtro-juzgados',
  templateUrl: './filtro-juzgados.component.html',
  styleUrls: ['./filtro-juzgados.component.scss']
})
export class FiltroJuzgadosComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  filtros: JuzgadoItem = new JuzgadoItem();
  historico: boolean = false;

  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones: any;

  @Input() permisoEscritura;

  comboProvincias = [];
  comboPoblacion = [];

  /*Éste método es útil cuando queremos queremos informar de cambios en los datos desde el hijo,
    por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() isOpen = new EventEmitter<boolean>();

  constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices,
    private persistenceService: PersistenceService, private commonServices: CommonsService) { }

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
      this.filtros = new JuzgadoItem();
    }

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
        this.resultadosPoblaciones = "Debe introducir al menos 3 caracteres";
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

  search() {

    if (this.checkFilters()) {
      this.persistenceService.setFiltros(this.filtros);
      this.isOpen.emit(this.historico)
    }

  }

  newCourt() {
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionJuzgados"]);
  }

  checkFilters() {
    if (
      (this.filtros.nombre == null || this.filtros.nombre == "" || this.filtros.nombre.length < 3) &&
      (this.filtros.codigoExt == null || this.filtros.codigoExt == "" || this.filtros.codigoExt.length < 3) &&
      (this.filtros.idProvincia == null || this.filtros.idProvincia == "") &&
      (this.filtros.idPoblacion == null || this.filtros.idPoblacion == "")) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.filtros.nombre != undefined && this.filtros.nombre != null) {
        this.filtros.nombre = this.filtros.nombre.trim();
      }

      if (this.filtros.codigoExt != undefined && this.filtros.codigoExt != null) {
        this.filtros.codigoExt = this.filtros.codigoExt.trim();
      }

      return true;
    }
  }

  clearFilters() {
    this.filtros = new JuzgadoItem();
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
