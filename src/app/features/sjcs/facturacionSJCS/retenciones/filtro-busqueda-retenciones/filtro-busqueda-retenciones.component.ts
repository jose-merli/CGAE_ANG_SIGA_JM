import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { MultiSelect, SelectItem } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { RetencionesRequestDto } from '../../../../../models/sjcs/RetencionesRequestDTO';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

export enum KEY_CODE {
  ENTER = 13
}

export const FILTROS_RETENCIONES = "filtrosBusquedaRetenciones";

@Component({
  selector: 'app-filtro-busqueda-retenciones',
  templateUrl: './filtro-busqueda-retenciones.component.html',
  styleUrls: ['./filtro-busqueda-retenciones.component.scss']
})
export class FiltroBusquedaRetencionesComponent implements OnInit {

  modoBusqueda: string = "r";
  filtros: RetencionesRequestDto = new RetencionesRequestDto();
  showDestinatarios: boolean = false;
  showDatosGenerales: boolean = false;
  obligatorio: boolean = false;
  msgs = [];
  progressSpinner: boolean = false;
  nombreApellidoColegiado: string = undefined;
  comboTiposRetencion: SelectItem[] = [];
  comboDestinatarios: SelectItem[] = [];
  comboPagos: SelectItem[] = [];

  @Output() buscarEvent = new EventEmitter<RetencionesRequestDto>();

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService) { }

  ngOnInit() {

    if (sessionStorage.getItem('buscadorColegiados')) {

      const { nombre, apellidos, nColegiado } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));

      this.nombreApellidoColegiado = `${apellidos}, ${nombre}`;
      this.filtros.ncolegiado = nColegiado;

      sessionStorage.removeItem('buscadorColegiados');

      this.showDestinatarios = true;
    }

    if (sessionStorage.getItem(FILTROS_RETENCIONES)) {
      this.filtros = JSON.parse(sessionStorage.getItem(FILTROS_RETENCIONES));
      this.showDatosGenerales = true;
      sessionStorage.removeItem(FILTROS_RETENCIONES);
    }

    this.getComboTiposRetencion();
    this.getComboDestinatarios();
    this.getComboPagos();
  }

  changeFilters() {

  }

  onHideDestinatarios() {
    this.showDestinatarios = !this.showDestinatarios;
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
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
  recuperarColegiado(event) {
    if (event != undefined) {
      this.nombreApellidoColegiado = event.nombreAp;
      this.filtros.ncolegiado = event.nColegiado;
    } else {
      this.nombreApellidoColegiado = undefined;
      this.filtros.ncolegiado = undefined;
    }
  }

  getComboTiposRetencion() {
    this.comboTiposRetencion = [
      {
        label: this.translateService.instant("facturacionSJCS.retenciones.porcentual"),
        value: 'P'
      },
      {
        label: this.translateService.instant("facturacionSJCS.retenciones.importeFijo"),
        value: 'F'
      },
      {
        label: this.translateService.instant("facturacionSJCS.retenciones.tramosLEC"),
        value: 'L'
      }
    ];
  }

  getComboDestinatarios() {

    this.progressSpinner = true;

    this.sigaServices.get("retenciones_comboDestinatarios").subscribe(
      data => {
        if (data.error != null && data.error.description != null) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(data.error.description.toString()));
        } else {
          this.comboDestinatarios = data.combooItems;
          this.commonsService.arregloTildesCombo(this.comboDestinatarios);
        }
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );

  }

  getComboPagos() {

    this.progressSpinner = true;

    this.sigaServices.get("retenciones_comboPagos").subscribe(
      data => {
        if (data.error != null && data.error.description != null) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(data.error.description.toString()));
        } else {
          this.comboPagos = data.combooItems;
          this.commonsService.arregloTildesCombo(this.comboPagos);
        }
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );

  }

  fillFechaDede(event, fecha) {

    this.filtros[fecha] = event;

    if (fecha === 'fechaInicio' && this.filtros.fechaFin < this.filtros.fechaInicio) {
      this.filtros.fechaFin = undefined;
    } else if (fecha === 'fechaAplicacionDesde' && this.filtros.fechaAplicacionHasta < this.filtros.fechaAplicacionDesde) {
      this.filtros.fechaAplicacionHasta = undefined;
    }
  }

  fillFechaHasta(event, fecha) {
    this.filtros[fecha] = event;
  }

  buscar() {
    sessionStorage.setItem(FILTROS_RETENCIONES, JSON.stringify(this.filtros));
    this.buscarEvent.emit(this.filtros);
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.buscar();
    }
  }

  limpiar() {
    this.filtros = new RetencionesRequestDto();
    this.nombreApellidoColegiado = '';
  }
}
