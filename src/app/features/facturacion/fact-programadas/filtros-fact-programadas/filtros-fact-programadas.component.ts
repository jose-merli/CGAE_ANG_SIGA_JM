import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { FacFacturacionprogramadaItem } from '../../../../models/FacFacturacionprogramadaItem';
import { CommonsService, KEY_CODE } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-filtros-fact-programadas',
  templateUrl: './filtros-fact-programadas.component.html',
  styleUrls: ['./filtros-fact-programadas.component.scss']
})
export class FiltrosFactProgramadasComponent implements OnInit {

  progressSpinner: boolean = false;
  msgs: Message[] = [];
  permisoEscritura: boolean = false;

  @Output() busqueda = new EventEmitter<boolean>();

  showDatosGenerales: boolean = true;
  showEstados: boolean = true;
  showFechas: boolean = true;

  body: FacFacturacionprogramadaItem = new FacFacturacionprogramadaItem();

  comboCompraSuscripcion: ComboItem[] = [];
  comboSeriesFacturacion: ComboItem[] = [];
  comboEstadosFacturacion: ComboItem[] = [];
  comboEstadosFicheros: ComboItem[] = [];
  comboEstadosEnvio: ComboItem[] = [];
  comboEstadosTraspaso: ComboItem[] = [];

  constructor(
    private persistenceService: PersistenceService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    // Opción para volver desde la ficha
    if (sessionStorage.getItem("mensaje") && sessionStorage.getItem("volver")) {
      let message: Message = JSON.parse(sessionStorage.getItem("mensaje"));
      if (message)
        this.showMessage(message.severity, message.summary, message.detail);
      sessionStorage.removeItem("mensaje");
      sessionStorage.removeItem("volver");
    } else if (this.persistenceService.getFiltros() && sessionStorage.getItem("volver")) {
      this.body = this.persistenceService.getFiltros();
      this.persistenceService.clearFiltros();
      sessionStorage.removeItem("volver");

      this.body.fechaCompraSuscripcionDesde = this.transformDate(this.body.fechaCompraSuscripcionDesde);
      this.body.fechaCompraSuscripcionHasta = this.transformDate(this.body.fechaCompraSuscripcionHasta);
      this.body.fechaPrevistaGeneracionDesde = this.transformDate(this.body.fechaPrevistaGeneracionDesde);
      this.body.fechaPrevistaGeneracionHasta = this.transformDate(this.body.fechaPrevistaGeneracionHasta);
      this.body.fechaPrevistaConfirmDesde = this.transformDate(this.body.fechaPrevistaConfirmDesde);
      this.body.fechaPrevistaConfirmHasta = this.transformDate(this.body.fechaPrevistaConfirmHasta);
      this.body.fechaRealGeneracionDesde = this.transformDate(this.body.fechaRealGeneracionDesde);
      this.body.fechaRealGeneracionHasta = this.transformDate(this.body.fechaRealGeneracionHasta);
      this.body.fechaConfirmacionDesde = this.transformDate(this.body.fechaConfirmacionDesde);
      this.body.fechaConfirmacionHasta = this.transformDate(this.body.fechaConfirmacionHasta);

      this.busqueda.emit();
    }

    this.getCombos();
  }

  // Buscar facturaciones
  searchFacturaciones(): void {
    this.persistenceService.setFiltros(this.body);
    this.busqueda.emit();
  }

  // Crear una nueva facturación
  nuevaFacturacion(): void {
    if (sessionStorage.getItem("facturacionProgramandaItem")) {
      sessionStorage.removeItem("facturacionProgramandaItem");
    }

    this.persistenceService.clearDatos();
    sessionStorage.setItem("Nuevo", "true");
    this.router.navigate(["/fichaFacturaciones"]);
  }

  // Combos
  getCombos() {
    this.getComboSerieFacturacion();
    this.getComboCompraSuscripcion();
    this.getComboEstadosFacturacion();
    this.getComboEstadosFicheros();
    this.getComboEstadosEnvios();
    this.getComboEstadosTraspasos();
  }

  getComboSerieFacturacion() {
    this.sigaServices.get("facturacionPyS_comboSeriesFacturacion").subscribe(
      n => {
        this.comboSeriesFacturacion = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboSeriesFacturacion);
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  getComboCompraSuscripcion() {
    this.comboCompraSuscripcion = [
      { value: "0", label: "Compras y Suscripciones", local: undefined },
      { value: "1", label: "Sólo Compras", local: undefined },
      { value: "2", label: "Sólo Suscripciones", local: undefined }
    ];
    this.commonsService.arregloTildesCombo(this.comboCompraSuscripcion);
  }

  getComboEstadosFacturacion() {
    this.sigaServices.get("facturacionPyS_comboEstadosFacturacion").subscribe(
      n => {
        this.comboEstadosFacturacion = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboEstadosFacturacion);
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  getComboEstadosFicheros() {
    this.sigaServices.get("facturacionPyS_comboEstadosFicheros").subscribe(
      n => {
        this.comboEstadosFicheros = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboEstadosFicheros);
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  getComboEstadosEnvios() {
    this.sigaServices.get("facturacionPyS_comboEstadosEnvios").subscribe(
      n => {
        this.comboEstadosEnvio = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboEstadosEnvio);
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  getComboEstadosTraspasos() {
    this.sigaServices.get("facturacionPyS_comboEstadosTraspasos").subscribe(
      n => {
        this.comboEstadosTraspaso = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboEstadosTraspaso);
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  // Clear filters
  clearFilters(): void {
    this.body = new FacFacturacionprogramadaItem();
    this.persistenceService.clearFiltros();

    this.goTop();
  }

  // Cambios en fechas
  fillFechaCompraSuscripcionDesde(event) {
    this.body.fechaCompraSuscripcionDesde = event;
  }

  fillFechaCompraSuscripcionHasta(event) {
    this.body.fechaCompraSuscripcionHasta = event;
  }
  
  fillFechaPrevistaGeneracionDesde(event) {
    this.body.fechaPrevistaGeneracionDesde = event;
  }
  
  fillFechaPrevistaGeneracionHasta(event) {
    this.body.fechaPrevistaGeneracionHasta = event;
  }
  
  fillFechaPrevistaConfirmDesde(event) {
    this.body.fechaPrevistaConfirmDesde = event;
  }
  
  fillFechaPrevistaConfirmHasta(event) {
    this.body.fechaPrevistaConfirmHasta = event;
  }
  
  fillFechaRealGeneracionDesde(event) {
    this.body.fechaRealGeneracionDesde = event;
  }
  
  fillFechaRealGeneracionHasta(event) {
    this.body.fechaRealGeneracionHasta = event;
  }
  
  fillFechaConfirmacionDesde(event) {
    this.body.fechaConfirmacionDesde = event;
  }
  
  fillFechaConfirmacionHasta(event) {
    this.body.fechaConfirmacionHasta = event;
  }
  

  // Mostrar u ocultar filtros de datos generales
  onHideDatosGenerales(): void {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  // Mostrar u ocultar filtros de estados
  onHideEstados(): void {
    this.showEstados = !this.showEstados;
  }

  // Mostrar u ocultar filtros de fechas
  onHideFechas(): void {
    this.showFechas = !this.showFechas;
  }

  // Transformar fecha
  transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);
    else
      fecha = null;
    // fecha = this.datepipe.transform(fecha, 'dd/MM/yyyy');
    return fecha;
  }

  // Funciones de utilidad

  goTop() {
    document.children[document.children.length - 1]
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
  
  // Búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.searchFacturaciones();
    }
  }

  clear() {
    this.msgs = [];
  }

}
