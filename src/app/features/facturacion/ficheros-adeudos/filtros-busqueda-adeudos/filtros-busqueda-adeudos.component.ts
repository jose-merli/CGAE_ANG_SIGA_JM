import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { FicherosAdeudosItem } from '../../../../models/sjcs/FicherosAdeudosItem';
import { CommonsService, KEY_CODE } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-filtros-busqueda-adeudos',
  templateUrl: './filtros-busqueda-adeudos.component.html',
  styleUrls: ['./filtros-busqueda-adeudos.component.scss']
})
export class FiltrosBusquedaAdeudosComponent implements OnInit {

  buscarFicherosAdeudos

  progressSpinner: boolean = false;
  showDatosGenerales: boolean = true;
  showSumatorio: boolean = true;

  comboSufijo: ComboItem[] = [];
  comboCuentasBancarias: ComboItem[] = [];
  comboOrigen: ComboItem[] = [];
  comboSeriesFacturacion: ComboItem[] = [];

  msgs: any[] = [];

  fechaHoy = new Date();

  body: FicherosAdeudosItem = new FicherosAdeudosItem();

 @Input() permisos;
 @Input() permisoEscritura;

 @Output() busqueda = new EventEmitter<boolean>();

  constructor(private router: Router,
    private datepipe: DatePipe,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private _elementRef: ElementRef,
    private commonServices: CommonsService) { }

  async ngOnInit() {
    this.progressSpinner=true;
    
    await this.cargaCombos();

    this.progressSpinner=false;
  }

  cargaCombos(){
    this.getComboCuentaBancaria();
    this.getComboSufijo();
    this.getComboOrigen();
    this.getComboSeriesFacturacion();
  }

  getComboSeriesFacturacion(){

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
        console.log(err);
      }
    );
  }

  buscar() {
    this.busqueda.emit(false);
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
    this.body = new FicherosAdeudosItem();
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