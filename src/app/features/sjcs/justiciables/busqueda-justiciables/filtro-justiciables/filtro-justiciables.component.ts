import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { KEY_CODE } from '../../../../administracion/parametros/parametros-generales/parametros-generales.component';
import { DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-filtro-justiciables',
  templateUrl: './filtro-justiciables.component.html',
  styleUrls: ['./filtro-justiciables.component.scss']
})
export class FiltroJusticiablesComponent implements OnInit {

  showDatosGenerales: boolean = true;
  showDatosDirecciones: boolean = false;
  showAsuntos: boolean = false;
  msgs = [];
  checkOrigenAsuntos: boolean = false;

  filtros: JusticiableBusquedaItem = new JusticiableBusquedaItem();
  filtroAux: JusticiableBusquedaItem = new JusticiableBusquedaItem();


  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones: any;

  @Input() permisoEscritura;
  @Output() isOpen = new EventEmitter<boolean>();
  @Input() modoRepresentante;
  @Input() nuevaUniFamiliar;
  @Input() nuevoContrarioEJG;

  comboProvincias = [];
  comboPoblacion = [];
  comboRoles = [];

  fichasPosiblesNew = [
    {
      key: "generales",
      activa: true
    }

  ];

  constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices,
    private persistenceService: PersistenceService, private commonsService: CommonsService, private location: Location) { }

  ngOnInit() {
    this.getComboProvincias();
    this.getComboRoles();

    if (this.modoRepresentante) {
      if (this.persistenceService.getFiltrosAux() != undefined) {
        this.filtros = this.persistenceService.getFiltrosAux();
        //this.isOpen.emit(false)
        this.configuracionFiltros();
      } else {
        this.filtros = new JusticiableBusquedaItem();
      }
    } else {
      if (this.persistenceService.getFiltros() != undefined) {
        this.filtros = this.persistenceService.getFiltros();
        //this.isOpen.emit(false)
        this.configuracionFiltros();
      } else {
        this.filtros = new JusticiableBusquedaItem();
      }
    }

    // Comprobar botón ATRAS en caso de Asociar Justiciable con EJG. Designas..
    if (sessionStorage.getItem("contrariosEJG") || sessionStorage.getItem("asistenciaAsistido") || sessionStorage.getItem("contrarios")
      || sessionStorage.getItem("datosFamiliares") || sessionStorage.getItem("interesados")) {
      this.checkOrigenAsuntos = true;
    }
    this.clearFilters();

    // Mantenemos los filtros de la búsqueda anterior
    if (sessionStorage.getItem("vieneDeFichaJusticiable") && sessionStorage.getItem("filtrosBusquedaJusticiable")) {

      this.filtros = JSON.parse(sessionStorage.getItem("filtrosBusquedaJusticiable"));
    }

    sessionStorage.removeItem("vieneDeFichaJusticiable");
    sessionStorage.removeItem("filtrosBusquedaJusticiable");
  }

  configuracionFiltros() {
    if ((this.filtros.idProvincia != undefined && this.filtros.idProvincia != null) ||
      (this.filtros.idPoblacion != undefined && this.filtros.idPoblacion != null) ||
      (this.filtros.codigoPostal != undefined && this.filtros.codigoPostal != null)) {
      this.showDatosDirecciones = true;
    }

    if ((this.filtros.anioDesde != undefined && this.filtros.anioDesde != null) ||
      (this.filtros.anioHasta != undefined && this.filtros.anioHasta != null) ||
      (this.filtros.idRol != undefined && this.filtros.idRol != null)) {
      this.showAsuntos = true;
    }
  }

  backTo() {
    // Quitar para no poder Asociar Justiciables en caso de entrar en Uno.
    if (sessionStorage.getItem("itemEJG")) {
      sessionStorage.removeItem("itemEJG");
    }
    if (sessionStorage.getItem("itemAsistencia")) {
      sessionStorage.removeItem("itemAsistencia");
    }
    if (sessionStorage.getItem("itemDesignas")) {
      sessionStorage.removeItem("itemDesignas");
    }
    if (sessionStorage.getItem("EJGItem") && this.nuevaUniFamiliar) {
      this.persistenceService.setDatos(JSON.parse(sessionStorage.getItem("EJGItem")));
      sessionStorage.removeItem("EJGItem");
    }
    sessionStorage.removeItem("fichaJust");
    this.location.back();
  }

  getComboRoles() {
    this.sigaServices.get("busquedaJusticiables_comboRoles").subscribe(
      n => {
        this.comboRoles = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboRoles);
      },
      err => {
        //console.log(err);
      }
    );
  }

  getComboProvincias() {
    this.sigaServices.get("busquedaJuzgados_provinces").subscribe(
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
      this.getComboPoblacion("-1");
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
          this.commonsService.arregloTildesCombo(this.comboPoblacion);
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
    // Quitar para no poder Asociar Justiciables en caso de entrar en Uno.
    if (sessionStorage.getItem("itemEJG")) {
      sessionStorage.removeItem("itemEJG");
    }
    if (sessionStorage.getItem("itemAsistencia")) {
      sessionStorage.removeItem("itemAsistencia");
    }
    if (sessionStorage.getItem("itemDesignas")) {
      sessionStorage.removeItem("itemDesignas");
    }
    if (this.checkFilters()) {
      if (this.modoRepresentante) {
        this.persistenceService.setFiltrosAux(this.filtros);
        this.isOpen.emit(false)
      } else {
        this.persistenceService.setFiltros(this.filtros);
        this.isOpen.emit(false)
      }
    }

    sessionStorage.setItem("filtrosBusquedaJusticiable", JSON.stringify(this.filtros));
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
    this.modoRepresentante = true;
    sessionStorage.setItem("nuevoJusticiable", "true");
    sessionStorage.setItem("Nuevo", "true");
    sessionStorage.setItem("nuevoJusticiableTarjetas", "true");
    this.persistenceService.setFichasPosibles(this.fichasPosiblesNew);
    if (this.modoRepresentante) {
      this.router.navigate(["/gestionJusticiables"], { queryParams: { rp: "1" } });
    } else {
      this.persistenceService.clearDatos();
      this.persistenceService.clearBody();
      if (this.nuevaUniFamiliar) {
        sessionStorage.setItem("origin", "UnidadFamiliar");
        sessionStorage.setItem("Nuevo", "true");
      }
      this.router.navigate(["/gestionJusticiables"]);
    }
  }

  checkFilters() {
    if (
      (this.filtros.nombre == null || this.filtros.nombre.trim() == "" || this.filtros.nombre.length < 3) &&
      (this.filtros.apellidos == null || this.filtros.apellidos.trim() == "" || this.filtros.apellidos.length < 3) &&
      (this.filtros.codigoPostal == null || this.filtros.codigoPostal.trim() == "" || this.filtros.codigoPostal.length < 3) &&
      (this.filtros.nif == null || this.filtros.nif.trim() == "" || this.filtros.nif.length < 3) &&
      (this.filtros.anioDesde == null || this.filtros.anioDesde == undefined) &&
      (this.filtros.anioHasta == null || this.filtros.anioDesde == undefined) &&
      (this.filtros.idProvincia == null || this.filtros.idProvincia == "") &&
      (this.filtros.idPoblacion == null || this.filtros.idPoblacion == "") &&
      (this.filtros.idRol == null || this.filtros.idRol == "")) {
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

      if (this.filtros.nif != undefined && this.filtros.nif != null) {
        this.filtros.nif = this.filtros.nif.trim();
      }

      return true;
    }
  }

  editarCompleto(event, dato) {
    let NUMBER_REGEX = /^\d{1,4}$/;
    if (NUMBER_REGEX.test(dato)) {
      if (dato != null && dato != undefined && (dato < 0 || dato > 9999)) {
        event.currentTarget.value = event.currentTarget.value.substring(0, 4);
      }
    } else {
      event.currentTarget.value = event.currentTarget.value.substring(0, 4);
    }
  }

  editarCodigoPostal(event, dato) {
    let NUMBER_REGEX = /^\d{1,5}$/;
    if (NUMBER_REGEX.test(dato)) {
      if (dato != null && dato != undefined && (dato < 0 || dato > 99999)) {
        this.filtros.codigoPostal = event.currentTarget.value.slice(0, 5);
      }
    } else {

      if (dato != null && dato != undefined && (dato < 0 || dato > 99999)) {
        this.filtros.codigoPostal = event.currentTarget.value.slice(0, 5);
      } else {
        event.currentTarget.value = "";
      }

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
