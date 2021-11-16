import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { ComboItem } from '../../../../models/ComboItem';
import { FacFacturacionprogramadaItem } from '../../../../models/FacFacturacionprogramadaItem';
import { KEY_CODE } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';

@Component({
  selector: 'app-filtros-facturaciones',
  templateUrl: './filtros-facturaciones.component.html',
  styleUrls: ['./filtros-facturaciones.component.scss']
})
export class FiltrosFacturacionesComponent implements OnInit {

  progressSpinner: boolean = false;
  msgs: Message[] = [];

  @Output() busqueda = new EventEmitter<boolean>();

  showDatosGenerales: boolean = true;
  showEstados: boolean = false;
  showFechas: boolean = false;

  body: FacFacturacionprogramadaItem = new FacFacturacionprogramadaItem();

  comboSeriesFacturacion: ComboItem[] = [];
  comboEstadosFacturacion: ComboItem[] = [];
  comboEstadosFicheros: ComboItem[] = [];
  comboEstadosEnvio: ComboItem[] = [];
  comboEstadosTraspaso: ComboItem[] = [];

  constructor(
    private persistenceService: PersistenceService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  // Buscar facturaciones
  searchFacturaciones(): void {
    console.log(this.body);
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

  // Clear filters
  clearFilters(): void {
    this.body = new FacFacturacionprogramadaItem();
    this.persistenceService.clearFiltros();

    this.showDatosGenerales = true;
    this.showEstados = false;
    this.showFechas = false;

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

}
