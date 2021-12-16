import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { MultiSelect } from 'primeng/primeng';
import { BusquedaRetencionesRequestDTO } from '../../../../../models/sjcs/BusquedaRetencionesRequestDTO';

@Component({
  selector: 'app-filtro-certificacion-fac',
  templateUrl: './filtro-certificacion-fac.component.html',
  styleUrls: ['./filtro-certificacion-fac.component.scss']
})
export class FiltroCertificacionFacComponent implements OnInit {

  filtros = new BusquedaRetencionesRequestDTO();
  progressSpinnerFiltro: boolean = false;
  comboEstado = [];
  comboColegios = [];
  comboConceptoServicios = [];
  comboGrupoFacturacion = [];
  comboPartidaPresupuestaria = [];
  disableComboFact: boolean;
  disableColegio: boolean;
  showDatosGenerales: boolean = true;

  @Output() busqueda = new EventEmitter<boolean>();
  @Output() nuevo = new EventEmitter<boolean>();
  @Input() permisoEscritura: boolean;
  msgs: any[];

  constructor(private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private localStorageService: SigaStorageService) { }

  ngOnInit() {

    this.getComboEstado();
    this.getComboColegios();
    this.isConsejo();
    this.getComboConceptosServicios();
    this.getComboPartidaPresupuestaria();

  }


  getComboColegios() {

    this.progressSpinnerFiltro = true;

    this.sigaServices.get("combo_comboColegios").subscribe(
      data => {
        this.comboColegios = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboColegios);
        this.progressSpinnerFiltro = false;
      },
      err => {
        this.progressSpinnerFiltro = false;
      }
    );


  }

  getComboEstado() {

    this.progressSpinnerFiltro = true;

    this.sigaServices.get("certificaciones_getComboEstadosCertificaciones").subscribe(
      data => {
        this.comboEstado = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboEstado);
        this.progressSpinnerFiltro = false;
      },
      err => {
        console.log(err);
        this.progressSpinnerFiltro = false;
      }
    );
  }

  getComboConceptosServicios() {
    this.progressSpinnerFiltro = true;

    this.sigaServices.get("combo_comboFactConceptos").subscribe(
      data => {
        this.comboConceptoServicios = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboConceptoServicios);
        this.progressSpinnerFiltro = false;
      },
      err => {
        console.log(err);
        this.progressSpinnerFiltro = false;
      }
    );

  }

  getComboGrupoFacturacion(idColegioList: string []) {

    this.progressSpinnerFiltro = true;

    this.sigaServices.post("combo_grupoFacturacionByColegios", idColegioList).subscribe(
      data => {
        this.comboGrupoFacturacion = JSON.parse(data.body).combooItems;
        this.commonsService.arregloTildesCombo(this.comboGrupoFacturacion);
        this.progressSpinnerFiltro = false;
      },
      err => {
        console.log(err);
        this.progressSpinnerFiltro = false;
      }
    );
  }

  getComboPartidaPresupuestaria() {
    this.progressSpinnerFiltro = true;

    this.sigaServices.get("combo_partidasPresupuestarias").subscribe(
      data => {
        this.comboPartidaPresupuestaria = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboPartidaPresupuestaria);
        this.progressSpinnerFiltro = false;
      },
      err => {
        console.log(err);
        this.progressSpinnerFiltro = false;
      }
    );

  }

  isConsejo() {
    let institucion = this.localStorageService.institucionActual;

    switch (institucion) {
      case "2000":
      case "3003":
      case "3004":
      case "3006":
      case "3007":
      case "3008":
      case "3009":
      case "3010":
        this.disableColegio = false;
        this.disableComboFact = true;
        break;
      default:
        this.disableColegio = true;
        this.filtros.idInstitucionList = [...this.filtros.idInstitucionList, this.localStorageService.institucionActual];
        this.getComboGrupoFacturacion([this.localStorageService.institucionActual]);
        this.disableComboFact = false;
        break;

    }
  }

  newCer() {
    this.nuevo.emit(true);
  }

  buscarCert() {
    this.busqueda.emit(true);
  }

  fillFechaHasta(event) {
    this.filtros.fechaHasta = event;
  }

  fillFechaDesde(event) {
    this.filtros.fechaDesde = event;
    if (this.filtros.fechaHasta < this.filtros.fechaDesde) {
      this.filtros.fechaHasta = undefined;
    }
  }

  restablecer() {
    this.filtros = new BusquedaRetencionesRequestDTO();
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }


  clear() {
    this.msgs = [];
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

    if (event == undefined || event.value == undefined || event.value == null || event.value.length == 0) {
      this.filtros[filtro] = [];
    }

  }

  onChangeColegio(event, filtro) {

    if (event && event.value && event.value != null && event.value.length > 0) {
      this.getComboGrupoFacturacion(this.filtros[filtro]);
      this.disableComboFact = false;
    } else {
      this.disableComboFact = true;
    }

  }
}
