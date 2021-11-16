import { Component, OnInit, Output, EventEmitter, HostListener, Input } from '@angular/core';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CartasFacturacionPagosItem } from '../../../../../models/sjcs/CartasFacturacionPagosItem';
import { KEY_CODE } from '../../../../../commons/login-develop/login-develop.component';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { MultiSelect } from 'primeng/primeng';
import { SigaStorageService } from '../../../../../siga-storage.service';

@Component({
  selector: 'app-filtro-cartas-facturacion-pago',
  templateUrl: './filtro-cartas-facturacion-pago.component.html',
  styleUrls: ['./filtro-cartas-facturacion-pago.component.scss']
})
export class FiltroCartasFacturacionPagoComponent implements OnInit {

  obligatorio: boolean = false;
  showDatosGenerales: boolean = true;
  showDatosColegiado: boolean = true;
  filtros: CartasFacturacionPagosItem = new CartasFacturacionPagosItem();
  esColegiado: boolean = false;
  modoBusqueda: string = "f";
  modoBusquedaFacturacion: boolean = true;
  progressSpinner: boolean = false;

  msgs = [];
  comboFacturacion: any[];
  comboConceptos: any[];
  comboGrupoTurnos: any[];
  comboPartidaPresupuestaria: any[];
  comboPagos: any[];
  isLetrado;

  @Output() emitSearch = new EventEmitter<string>();
  @Output() changeModoBusqueda = new EventEmitter<string>();

  @Input() permisoEscritura;

  constructor(private commonsService: CommonsService, private sigaServices: SigaServices,
    private translateService: TranslateService, private sigaStorageService: SigaStorageService,) { }

  ngOnInit() {

    this.isLetrado = this.sigaStorageService.isLetrado;

    if (sessionStorage.getItem("datosCartasFacturacion") && !this.isLetrado) {
      this.filtros = JSON.parse(sessionStorage.getItem("datosCartasFacturacion"));
      sessionStorage.removeItem("datosCartasFacturacion")
      this.modoBusqueda = this.filtros.modoBusqueda;

      if (this.modoBusqueda == 'f') {
        this.modoBusquedaFacturacion = true;
      } else {
        this.modoBusquedaFacturacion = false;
      }

      if (this.checkFiltersInit()) {
        this.emitSearch.emit(this.modoBusqueda)
      }
    } else if (sessionStorage.getItem("datosCartasPago") && !this.isLetrado) {
      this.filtros = JSON.parse(sessionStorage.getItem("datosCartasPago"));
      sessionStorage.removeItem("datosCartasPago")
      this.modoBusqueda = this.filtros.modoBusqueda;

      if (this.modoBusqueda == 'f') {
        this.modoBusquedaFacturacion = true;
      } else {
        this.modoBusquedaFacturacion = false;
      }

      if (this.checkFiltersInit()) {
        this.emitSearch.emit(this.modoBusqueda)
      }
    } else {
      this.filtros.modoBusqueda = this.modoBusqueda;
    }

    this.getCombos();

    if (this.isLetrado) {
      this.isColegiado();
    } else {
      if (sessionStorage.getItem('buscadorColegiados')) {

        const { nombre, apellidos, nColegiado, idPersona } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));

        this.filtros.apellidosNombre = `${apellidos}, ${nombre}`;
        this.filtros.ncolegiado = nColegiado;
        this.filtros.idPersona = idPersona;

        sessionStorage.removeItem('buscadorColegiados');
      }
    }
  }

  getCombos() {
    this.getComboPartidasPresupuestarias();
    this.getComboGrupoTurnos();
    this.getComboFactConceptos();
    this.getComboFacturacion();
    this.getComboPagos();
  }

  isColegiado() {

    this.esColegiado = true;

    this.filtros.ncolegiado = this.sigaStorageService.numColegiado;
    this.filtros.idPersona = this.sigaStorageService.idPersona;
    this.filtros.apellidosNombre = this.sigaStorageService.nombreApe;

    this.showDatosColegiado = true;
  }

  search() {

    if (this.checkFilters()) {
      this.filtros.modoBusqueda = this.modoBusqueda;
      this.emitSearch.emit(this.modoBusqueda);
    }
  }

  recuperarColegiado(event) {
    if (event != undefined) {
      this.filtros.apellidosNombre = event.nombreAp;
      this.filtros.ncolegiado = event.nColegiado;
    } else {
      this.filtros.apellidosNombre = undefined;
      this.filtros.ncolegiado = undefined;
    }
  }

  recuperarIdPersona(event) {
    if (event != undefined && event != '') {
      this.filtros.idPersona = event;
    } else {
      this.filtros.idPersona = undefined;
    }
  }

  checkFilters() {
    if (!this.esColegiado && (
      (this.filtros.idPartidaPresupuestaria == null || this.filtros.idPartidaPresupuestaria == undefined) &&
      (this.filtros.idConcepto == null || this.filtros.idConcepto == undefined) &&
      (this.filtros.idTurno == null || this.filtros.idTurno == undefined))) {


      if (this.modoBusquedaFacturacion) {
        if ((this.filtros.idFacturacion == null || this.filtros.idFacturacion == undefined) && (this.filtros.idPersona == undefined || this.filtros.idPersona == null || this.filtros.idPersona.trim().length == 0)) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
          return false;

        } else {
          return true;
        }
      } else {
        if ((this.filtros.idPago == null || this.filtros.idPago == undefined) && (this.filtros.idPersona == undefined || this.filtros.idPersona == null || this.filtros.idPersona.trim().length == 0)) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
          return false;

        } else {
          return true;
        }
      }

    } else {
      return true;
    }
  }

  checkFiltersInit() {
    if (!this.esColegiado && (
      (this.filtros.idPartidaPresupuestaria == null || this.filtros.idPartidaPresupuestaria == undefined) &&
      (this.filtros.idConcepto == null || this.filtros.idConcepto == undefined) &&
      (this.filtros.idTurno == null || this.filtros.idTurno == undefined))) {


      if (this.modoBusquedaFacturacion) {
        if (this.filtros.idFacturacion == null || this.filtros.idFacturacion == undefined) {
          return false;

        } else {
          return true;
        }
      } else {
        if (this.filtros.idPago == null || this.filtros.idPago == undefined) {
          return false;

        } else {
          return true;
        }
      }

    } else {
      return true;
    }
  }

  getComboPartidasPresupuestarias() {
    this.sigaServices.get("combo_partidasPresupuestarias").subscribe(
      data => {
        this.comboPartidaPresupuestaria = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboPartidaPresupuestaria);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboGrupoTurnos() {
    this.sigaServices.get("combo_grupoFacturacion").subscribe(
      data => {
        this.comboGrupoTurnos = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboGrupoTurnos);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboFactConceptos() {
    this.sigaServices.get("combo_comboFactConceptos").subscribe(
      data => {
        this.comboConceptos = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboConceptos);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboFacturacion() {
    this.sigaServices.get("combo_comboFactColegio").subscribe(
      data => {
        this.comboFacturacion = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboFacturacion);

        if (undefined == this.filtros.idFacturacion || null == this.filtros.idFacturacion) {
          this.filtros.idFacturacion = [this.comboFacturacion[0].value];
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboPagos() {
    this.sigaServices.get("combo_comboPagosColegio").subscribe(
      data => {
        this.comboPagos = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboPagos);
      },
      err => {
        console.log(err);
      }
    );
  }

  changeFilters() {
    this.clearFilters();

    if (this.modoBusqueda == "f") {
      this.modoBusquedaFacturacion = true;
    } else if (this.modoBusqueda == "p") {
      this.modoBusquedaFacturacion = false;
    } else {
      this.modoBusquedaFacturacion = true;
      this.modoBusqueda == "f";
    }

    this.filtros.modoBusqueda = this.modoBusqueda;
    this.changeModoBusqueda.emit();
  }

  clearFilters() {

    if (this.esColegiado) {
      this.filtros.idFacturacion = undefined;
      this.filtros.idPago = undefined;
      this.filtros.idConcepto = undefined;
      this.filtros.idPartidaPresupuestaria = undefined;
      this.filtros.idTurno = undefined;

    } else {
      this.filtros = new CartasFacturacionPagosItem();
    }
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  onHideDatosColegiado() {
    this.showDatosColegiado = !this.showDatosColegiado;

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

  focusInputField(someMultiselect: MultiSelect) {
    setTimeout(() => {
      someMultiselect.filterInputChild.nativeElement.focus();
    }, 300);
  }

  onChangeMultiSelect(event, filtro) {
    if (undefined != event.value && event.value.length == 0) {
      this.filtros[filtro] = undefined;
    }
  }

}
