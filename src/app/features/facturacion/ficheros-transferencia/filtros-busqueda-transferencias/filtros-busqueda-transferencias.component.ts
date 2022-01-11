import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { FicherosAbonosItem } from '../../../../models/sjcs/FicherosAbonosItem';
import { CommonsService, KEY_CODE } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-filtros-busqueda-transferencias',
  templateUrl: './filtros-busqueda-transferencias.component.html',
  styleUrls: ['./filtros-busqueda-transferencias.component.scss']
})
export class FiltrosBusquedaTransferenciasComponent implements OnInit {

  progressSpinner: boolean = false;
  showDatosGenerales: boolean = true;
  showSumatorio: boolean = true;

  comboSufijo: ComboItem[] = [];
  comboCuentasBancarias: ComboItem[] = [];
  comboOrigen: ComboItem[] = [];
  comboSeriesFacturacion: ComboItem[] = [];

  msgs: any[] = [];

  fechaHoy = new Date();

  body: FicherosAbonosItem = new FicherosAbonosItem();

 @Input() permisos;
 @Input() permisoEscritura;

 @Output() buscarFicheros = new EventEmitter<boolean>();

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private _elementRef: ElementRef,
    private commonServices: CommonsService) { }

  ngOnInit() {
    this.cargaCombos();

    if(this.persistenceService.getFiltros() && sessionStorage.getItem("volver")){
      this.body = this.persistenceService.getFiltros();
      this.persistenceService.clearFiltros();

      sessionStorage.removeItem("volver");

      this.body.fechaCreacionDesde = this.transformDate(this.body.fechaCreacionDesde);
      this.body.fechaCreacionHasta = this.transformDate(this.body.fechaCreacionHasta);

      this.buscar();
    }else{
      this.body.fechaCreacionDesde = new Date( new Date().setFullYear(new Date().getFullYear()-2));
    }
  }
  
  cargaCombos(){
    this.getComboCuentaBancaria();
    this.getComboSufijo();
    this.getComboOrigen();
  }

  getComboOrigen(){
    this.comboOrigen.push({value: '0', label: this.translateService.instant('facturacion.ficherosAdeudos.facturacionDeSerie'), local: undefined});
    this.comboOrigen.push({value: '1', label: this.translateService.instant('facturacion.ficherosAdeudos.facturasSueltas'), local: undefined});
  }

  getComboSufijo() {
    this.progressSpinner=true;

    this.sigaServices.get("facturacionPyS_comboSufijo").subscribe(
      n => {
        this.comboSufijo = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboSufijo);
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner=false;
      }
    );
  }

  getComboCuentaBancaria() {
    this.progressSpinner=true;

    this.sigaServices.get("facturacionPyS_comboCuentaBancaria").subscribe(
      n => {
        this.progressSpinner=false;

        this.comboCuentasBancarias = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboCuentasBancarias);
      },
      err => {
        this.progressSpinner=false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        console.log(err);
      }
    );
  }

  checkFilters() {     
    if ((this.body.bancosCodigo == null) &&(this.body.idSufijo == null) && (this.body.fechaCreacionDesde == null) &&
      (this.body.fechaCreacionHasta == null) && (this.body.importeTotalDesde == null) && (this.body.importeTotalHasta == null) && (this.body.numRecibosDesde == null) && (this.body.numRecibosHasta == null)) {
      
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
      return false;
    } else {
      return true;
    }
  }

  nuevo(){
    if (sessionStorage.getItem("FicherosAbonosItem")) {
      sessionStorage.removeItem("FicherosAbonosItem");
    }

    this.persistenceService.clearDatos();
    sessionStorage.setItem("Nuevo", "true");
    this.router.navigate(["/gestionFicherosTransferencias"]);
  }

  buscar() {
    if(this.checkFilters()){
      this.buscarFicheros.emit(false);
    }
  }

  fillFecha(event, campo) {
    if(campo==='creacionDesde')
      this.body.fechaCreacionDesde = event;
    else if(campo==='creacionHasta')
      this.body.fechaCreacionHasta = event;
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

  clearFilters() {
    this.body = new FicherosAbonosItem();
    this.persistenceService.clearFiltros();

    this.showDatosGenerales = true;
    this.showSumatorio= true;

    this.goTop();
  }

  goTop() {
    document.children[document.children.length - 1]
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }

  }

  onHideDatosGenerales(){
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  
  onHideSumatorio(){
    this.showSumatorio = !this.showSumatorio;
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.buscar();
    }
  }

  transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);

    return fecha;
  }
}
