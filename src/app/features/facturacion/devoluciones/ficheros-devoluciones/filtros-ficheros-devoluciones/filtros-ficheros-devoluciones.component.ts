import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/components/common/message';
import { ComboItem } from '../../../../../models/ComboItem';
import { FicherosDevolucionesItem } from '../../../../../models/FicherosDevolucionesItem';
import { CommonsService, KEY_CODE } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-filtros-ficheros-devoluciones',
  templateUrl: './filtros-ficheros-devoluciones.component.html',
  styleUrls: ['./filtros-ficheros-devoluciones.component.scss']
})
export class FiltrosFicherosDevolucionesComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  
  @Output() busqueda = new EventEmitter<boolean>();
  permisoEscritura: boolean;

  showDatosGenerales: boolean = true;
  showSumatorios: boolean = true;

  body: FicherosDevolucionesItem = new FicherosDevolucionesItem();
  
  comboCuentasBancarias: ComboItem[] = [];

  constructor(
    private persistenceService: PersistenceService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    // Opción para volver desde la ficha
    if (this.persistenceService.getFiltros() && sessionStorage.getItem("volver")) {
      this.body = this.persistenceService.getFiltros();
      this.persistenceService.clearFiltros();
      sessionStorage.removeItem("volver");

      this.busqueda.emit();
    }

    this.getComboCuentaBancaria().then(() => this.progressSpinner = false);
  }

  // Combo de cuentas bancarias
  getComboCuentaBancaria(): Promise<any> {
    return this.sigaServices.get("facturacionPyS_comboCuentaBancaria").toPromise()
      .then(
        n => {
          this.comboCuentasBancarias = n.combooItems;
          this.commonsService.arregloTildesCombo(this.comboCuentasBancarias);
        },
        err => {
          console.log(err);
        });
  }

  // Clear filters
  clearFilters(): void {
    this.body = new FicherosDevolucionesItem();
    this.persistenceService.clearFiltros();

    this.goTop();
  }

  // Mostrar u ocultar filtros de datos generales
  onHideDatosGenerales(): void {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  // Mostrar u ocultar filtros de sumatorios
  onHideSumatorios(): void {
    this.showSumatorios = !this.showSumatorios;
  }

  // Buscar ficheros de devoluciones
  searchFicherosDevoluciones(): void {
    console.log(this.body);
    this.persistenceService.setFiltros(this.body);
    this.busqueda.emit();
  }

  // Nuevo fichero de devolución
  nuevoFicheroDevolucion(): void {
    
  }

  fillFechaCreacionDesde(event): void {
    this.body.fechaCreacionDesde = event;
  }

  fillFechaCreacionHasta(event): void {
    this.body.fechaCreacionHasta = event;
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
      this.searchFicherosDevoluciones();
    }
  }

}
