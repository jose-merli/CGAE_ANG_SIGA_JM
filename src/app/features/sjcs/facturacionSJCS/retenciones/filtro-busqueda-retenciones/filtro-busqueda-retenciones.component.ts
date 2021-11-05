import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MultiSelect, SelectItem } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { RetencionesRequestDto } from '../../../../../models/sjcs/RetencionesRequestDTO';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { TIPOBUSQUEDA } from '../retenciones.component';
import { Router } from '@angular/router';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { RetencionesService } from '../retenciones.service';

export enum KEY_CODE {
  ENTER = 13
}

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
  comboTiposRetencion: SelectItem[] = [];
  comboDestinatarios: SelectItem[] = [];
  comboPagos: SelectItem[] = [];

  @Input() isLetrado: boolean;
  @Input() permisoEscritura: boolean;

  @Output() buscarRetencionesEvent = new EventEmitter<RetencionesRequestDto>();
  @Output() buscarRetencionesAplicadasEvent = new EventEmitter<RetencionesRequestDto>();
  @Output() modoBusquedaEvent = new EventEmitter<string>();

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private router: Router,
    private sigaStorageService: SigaStorageService,
    private retencionesService: RetencionesService) { }

  ngOnInit() {

    if (this.isLetrado) {

      this.filtros.nombreApellidoColegiado = this.sigaStorageService.nombreApe;
      this.filtros.ncolegiado = this.sigaStorageService.numColegiado;
      this.filtros.idPersona = this.sigaStorageService.idPersona;
      this.showDestinatarios = true;

    } else {

      if (sessionStorage.getItem('buscadorColegiados')) {

        if (sessionStorage.getItem("desdeNuevoFiltroRetenciones")) {
          sessionStorage.removeItem("desdeNuevoFiltroRetenciones");
          this.retencionesService.modoEdicion = false;
          this.router.navigate(['/fichaRetencionJudicial']);
        } else {

          const { nombre, apellidos, nColegiado, idPersona } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));

          this.filtros.nombreApellidoColegiado = `${apellidos}, ${nombre}`;
          this.filtros.ncolegiado = nColegiado;
          this.filtros.idPersona = idPersona;

          sessionStorage.removeItem('buscadorColegiados');
          this.showDestinatarios = true;
        }
      }

    }

    if (this.retencionesService.filtrosRetenciones != null) {
      this.filtros = JSON.parse(JSON.stringify(this.retencionesService.filtrosRetenciones));

      if (this.filtros.modoBusqueda && this.filtros.modoBusqueda != null && this.filtros.modoBusqueda.length > 0) {
        this.modoBusqueda = this.filtros.modoBusqueda;
        this.modoBusquedaEvent.emit(this.modoBusqueda);
      }

      if (this.filtros.fechaInicio && this.filtros.fechaInicio != null) {
        this.filtros.fechaInicio = new Date(this.filtros.fechaInicio);
      }

      if (this.filtros.fechaFin && this.filtros.fechaFin != null) {
        this.filtros.fechaFin = new Date(this.filtros.fechaFin);
      }

      if (this.filtros.fechaAplicacionDesde && this.filtros.fechaAplicacionDesde != null) {
        this.filtros.fechaAplicacionDesde = new Date(this.filtros.fechaAplicacionDesde);
      }

      if (this.filtros.fechaAplicacionHasta && this.filtros.fechaAplicacionHasta != null) {
        this.filtros.fechaAplicacionHasta = new Date(this.filtros.fechaAplicacionHasta);
      }

      if (this.filtros.idPersona && this.filtros.idPersona != null && this.filtros.idPersona.length > 0) {
        this.showDestinatarios = true;
      }

      this.showDatosGenerales = true;

      this.buscar();
    }

    this.getComboTiposRetencion();
    this.getComboDestinatarios();
    this.getComboPagos();
  }

  changeFilters() {
    this.filtros.modoBusqueda = this.modoBusqueda;
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
      this.filtros.nombreApellidoColegiado = event.nombreAp;
      this.filtros.ncolegiado = event.nColegiado;
    } else {
      this.filtros.nombreApellidoColegiado = undefined;
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
      this.retencionesService.filtrosRetenciones = JSON.parse(JSON.stringify(this.filtros));
      this.buscarRetencionesEvent.emit(this.filtros);
    } else if (this.modoBusqueda == TIPOBUSQUEDA.RETENCIONESAPLICADAS) {
      this.retencionesService.filtrosRetenciones = JSON.parse(JSON.stringify(this.filtros));
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
  }

  botonBuscarColegiadoExpress() {
    if (sessionStorage.getItem("desdeNuevoFiltroRetenciones")) {
      sessionStorage.removeItem("desdeNuevoFiltroRetenciones");
    }
  }

  nuevo() {
    sessionStorage.setItem("desdeNuevoFiltroRetenciones", "true");
    this.router.navigate(["/buscadorColegiados"]);
  }

}
