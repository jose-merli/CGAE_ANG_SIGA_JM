import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/message';
import { TranslateService } from '../../../../../commons/translate';
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

  @Output() busqueda = new EventEmitter<boolean>();
  
  permisoEscritura: boolean;
  showDatosGenerales: boolean = true;
  showSumatorios: boolean = true;
  progressSpinner: boolean = false;  
  
  msgs: Message[] = [];
  comboCuentasBancarias: ComboItem[] = [];

  fechaHoy = new Date();

  body: FicherosDevolucionesItem = new FicherosDevolucionesItem();
  
  constructor(
    private persistenceService: PersistenceService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getComboCuentaBancaria()

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    // Opción para volver desde la ficha
    if (this.persistenceService.getFiltros() && sessionStorage.getItem("volver")) {
      this.body = this.persistenceService.getFiltros();
      this.persistenceService.clearFiltros();
      sessionStorage.removeItem("volver");

      this.searchFicherosDevoluciones();
    }else{
      this.body.fechaCreacionDesde = new Date( new Date().setFullYear(new Date().getFullYear()-2));
    }
  }

  // Combo de cuentas bancarias
  getComboCuentaBancaria(){
    this.progressSpinner = true

    this.sigaServices.get("facturacionPyS_comboCuentaBancaria").subscribe(
      n => {
        this.comboCuentasBancarias = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboCuentasBancarias);
        this.progressSpinner = false
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        console.log(err);
        this.progressSpinner = false
      }
    );
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
    if(this.checkFilters()){
      this.busqueda.emit();
    }
  }

  // Nuevo fichero de devolución
  nuevoFicheroDevolucion(): void {
    if (sessionStorage.getItem("FicherosAdeudosItem")) {
      sessionStorage.removeItem("FicherosAdeudosItem");
    }

    this.persistenceService.clearDatos();
    sessionStorage.setItem("Nuevo", "true");
    this.router.navigate(["/fichaFicherosDevoluciones"]);
  }

  checkFilters() {
    if (this.body.facturacion != undefined)
      this.body.facturacion = this.body.facturacion.trim();

      
    if ((this.body.bancosCodigo == null) && (this.body.fechaCreacionDesde == null) &&
      (this.body.fechaCreacionHasta == null)) {
      
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
      return false;
    } else {
      return true;
    }
  }
  
  fillFecha(event, campo) {
    if(campo==='creacionDesde')
      this.body.fechaCreacionDesde = event;
    else if(campo==='creacionHasta')
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

  clear() {
    this.msgs = [];
  }
}
