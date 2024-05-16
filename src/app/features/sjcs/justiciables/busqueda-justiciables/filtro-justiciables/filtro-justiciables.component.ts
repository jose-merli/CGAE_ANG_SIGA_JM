import { Location } from "@angular/common";
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CommonsService } from "../../../../../_services/commons.service";
import { NotificationService } from "../../../../../_services/notification.service";
import { PersistenceService } from "../../../../../_services/persistence.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate";
import { JusticiableBusquedaItem } from "../../../../../models/sjcs/JusticiableBusquedaItem";
import { KEY_CODE } from "../../../../administracion/parametros/parametros-generales/parametros-generales.component";

@Component({
  selector: "app-filtro-justiciables",
  templateUrl: "./filtro-justiciables.component.html",
  styleUrls: ["./filtro-justiciables.component.scss"],
})
export class FiltroJusticiablesComponent implements OnInit {
  showDatosGenerales: boolean = true;
  showDatosDirecciones: boolean = false;
  showAsuntos: boolean = false;
  checkOrigenAsuntos: boolean = false;

  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones: any;

  @Input() permisoEscritura;
  @Input() origen: string = "";
  @Input() justiciable: any;
  @Input() filtros: JusticiableBusquedaItem = new JusticiableBusquedaItem();
  @Output() findJusticiable = new EventEmitter<JusticiableBusquedaItem>();

  comboProvincias = [];
  comboPoblacion = [];
  comboRoles = [];

  constructor(private router: Router, private notificationService: NotificationService, private translateService: TranslateService, private sigaServices: SigaServices, private persistenceService: PersistenceService, private commonsService: CommonsService, private location: Location) {}

  ngOnInit() {
    this.getComboProvincias();
    this.getComboRoles();
    this.getFiltros();

    // Comprobar botón ATRAS en caso de Asociar Justiciable con EJG. Designas..
    if (this.origen != "") {
      this.checkOrigenAsuntos = true;
    }
  }

  private getFiltros() {
    if ((this.filtros.idProvincia != undefined && this.filtros.idProvincia != null) || (this.filtros.idPoblacion != undefined && this.filtros.idPoblacion != null) || (this.filtros.codigoPostal != undefined && this.filtros.codigoPostal != null)) {
      this.showDatosDirecciones = true;
      this.onChangeProvincia();
    }
    if ((this.filtros.anioDesde != undefined && this.filtros.anioDesde != null) || (this.filtros.anioHasta != undefined && this.filtros.anioHasta != null) || (this.filtros.idRol != undefined && this.filtros.idRol != null)) {
      this.showAsuntos = true;
    }
  }

  backTo() {
    if (this.origen == "newInteresado" || this.origen == "newContrario") {
      this.router.navigate(["fichaDesignaciones"]);
    } else if (this.origen == "newAsistido" || this.origen == "newContrarioAsistencia") {
      this.router.navigate(["/fichaAsistencia"]);
    } else if (this.origen == "newUnidadFamiliar" || this.origen == "newContrarioEJG") {
      this.router.navigate(["/gestionEjg"]);
    } else if (this.origen == "newSoj") {
      this.router.navigate(["/detalle-soj"]);
    } else if (this.origen == "newRepresentante") {
      this.persistenceService.clearFiltrosAux();
      this.persistenceService.setDatos(this.justiciable);
      sessionStorage.setItem("origin", this.origen);
      sessionStorage.setItem("abrirTarjetaJusticiable", "tarjetaRepresentante");
      this.router.navigate(["/gestionJusticiables"]);
    } else {
      this.location.back();
    }
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
    this.sigaServices.getParam("busquedaJuzgados_population", "?idProvincia=" + this.filtros.idProvincia + "&dataFilter=" + dataFilter).subscribe((n) => {
      this.isDisabledPoblacion = false;
      this.comboPoblacion = n.combooItems;
      this.commonsService.arregloTildesCombo(this.comboPoblacion);
    });
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
      if (this.origen == "newRepresentante") {
        this.persistenceService.setFiltrosAux(this.filtros);
      } else {
        this.persistenceService.setFiltros(this.filtros);
      }
      this.findJusticiable.emit(this.filtros);
    }
  }

  nuevo() {
    if (!this.permisoEscritura) {
      this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      sessionStorage.setItem("origin", this.origen);
      if (this.origen != "newRepresentante") {
        this.persistenceService.clearDatos();
        this.persistenceService.clearBody();
      } else {
        sessionStorage.setItem("justiciable", JSON.stringify(this.justiciable));
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
      (this.filtros.anioHasta == null || this.filtros.anioHasta == undefined) &&
      (this.filtros.idProvincia == null || this.filtros.idProvincia == "") &&
      (this.filtros.idPoblacion == null || this.filtros.idPoblacion == "") &&
      (this.filtros.idRol == null || this.filtros.idRol == "")
    ) {
      this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
      return false;
    } else if (this.filtros != null && this.filtros.codigoPostal != null && this.filtros.codigoPostal.trim() != "" && this.filtros.codigoPostal.length != 5) {
      this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.cp"));
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
    this.comboPoblacion = [];
    this.isDisabledPoblacion = true;
    if (this.origen == "newRepresentante") {
      this.persistenceService.clearFiltrosAux();
    } else {
      this.persistenceService.clearFiltros();
    }
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.search();
    }
  }

  private getComboRoles() {
    this.sigaServices.get("busquedaJusticiables_comboRoles").subscribe((n) => {
      this.comboRoles = n.combooItems;
      this.commonsService.arregloTildesCombo(this.comboRoles);
    });
  }

  private getComboProvincias() {
    this.sigaServices.get("busquedaJuzgados_provinces").subscribe((n) => {
      this.comboProvincias = n.combooItems;
      this.commonsService.arregloTildesCombo(this.comboProvincias);
    });
  }
}
