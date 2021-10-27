import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MultiSelect, SelectItem } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { RetencionesRequestDto } from '../../../../../models/sjcs/RetencionesRequestDTO';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { TIPOBUSQUEDA } from '../retenciones.component';

export enum KEY_CODE {
  ENTER = 13
}

export const FILTROS_RETENCIONES = "filtrosBusquedaRetenciones";
export const FILTROS_RETENCIONES_APLICADAS = "filtrosBusquedaRetencionesAplicadas";
@Component({
  selector: 'app-filtro-busqueda-retenciones',
  templateUrl: './filtro-busqueda-retenciones.component.html',
  styleUrls: ['./filtro-busqueda-retenciones.component.scss']
})
export class FiltroBusquedaRetencionesComponent implements OnInit {

  modoBusqueda: string = TIPOBUSQUEDA.RETENCIONES;
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

  @Input() permisoEscritura: boolean;

  @Output() buscarRetencionesEvent = new EventEmitter<RetencionesRequestDto>();
  @Output() buscarRetencionesAplicadasEvent = new EventEmitter<RetencionesRequestDto>();
  @Output() modoBusquedaEvent = new EventEmitter<string>();

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService) { }

  ngOnInit() {

    if (sessionStorage.getItem('buscadorColegiados')) {

      const { nombre, apellidos, nColegiado, idPersona } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));

      this.nombreApellidoColegiado = `${apellidos}, ${nombre}`;
      this.filtros.ncolegiado = nColegiado;
      this.filtros.idPersona = idPersona;

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
    this.modoBusquedaEvent.emit(this.modoBusqueda);
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

  recuperarIdPersona(event) {
    if (event != undefined && event != '') {
      this.filtros.idPersona = event;
    } else {
      this.filtros.idPersona = undefined;
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

    if (this.modoBusqueda == TIPOBUSQUEDA.RETENCIONES) {
      sessionStorage.setItem(FILTROS_RETENCIONES, JSON.stringify(this.filtros));
      this.buscarRetencionesEvent.emit(this.filtros);
    } else if (this.modoBusqueda == TIPOBUSQUEDA.RETENCIONESAPLICADAS) {
      sessionStorage.setItem(FILTROS_RETENCIONES_APLICADAS, JSON.stringify(this.filtros));
      this.buscarRetencionesAplicadasEvent.emit(this.filtros);
    }
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
