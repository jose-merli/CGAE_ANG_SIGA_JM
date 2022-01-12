import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';
import { ComboItem } from '../../../../../models/ComboItem';
import { FacAbonoItem } from '../../../../../models/sjcs/FacAbonoItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';



@Component({
  selector: 'app-filtros-abonos-sjcs',
  templateUrl: './filtros-abonos-sjcs.component.html',
  styleUrls: ['./filtros-abonos-sjcs.component.scss'],

})
export class FiltrosAbonosSCJSComponent implements OnInit {

  @Output() busqueda = new EventEmitter<boolean>();
  progressSpinner: boolean = false;
  showDatosGenerales: boolean = true;
  showDatosAgrupacion: boolean = true;
  showColegiado: boolean = true;
  showSociedad:boolean = true;

  comboContabilizado:ComboItem[] = [];
  comboGrupoFacturacion:ComboItem[] = [];
  comboFormaCobroAbono:ComboItem[] = [];
  comboEstados:ComboItem[] = [];
  filtros:FacAbonoItem = new FacAbonoItem(); //Complementar atributos


  combo;

  
  msgs;


  constructor( private router: Router,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService) {
   
  }

  ngOnInit() {
    this.getComboContabilizado();
    this.getComboFormaCobroAbono();
    this.getComboGrupoFacturacion();
    this.getComboEstados();
  }

  clear(){}

  fillFecha(event, campo) {
    if(campo==='emisionDesde')
      this.filtros.fechaEmisionDesde = event;
    else if(campo==='emisionHasta')
      this.filtros.fechaEmisionHasta = event;
  }
  getComboContabilizado() {
    this.comboContabilizado.push({value: 'S', label: this.translateService.instant('messages.si') , local: undefined});
    this.comboContabilizado.push({value: 'N', label: this.translateService.instant('general.boton.no') , local: undefined});
  }
  getComboFormaCobroAbono() {
    this.comboFormaCobroAbono.push({value: 'E', label: this.translateService.instant('facturacion.facturas.efectivo') , local: undefined});
    this.comboFormaCobroAbono.push({value: 'B', label: this.translateService.instant('censo.tipoAbono.banco') , local: undefined});
    this.comboFormaCobroAbono.push({value: 'A', label: this.translateService.instant('fichaEventos.datosRepeticion.tipoDiasRepeticion.ambos') , local: undefined});
  }

  onHideDatosGenerales(){
    this.showDatosGenerales = !this.showDatosGenerales
  }
  onHideDatosAgrupacion(){
    this.showDatosAgrupacion = !this.showDatosAgrupacion;
  }

  onHideColegiado(){
    this.showColegiado = !this.showColegiado;
  }

  onHideSociedad(){
    this.showSociedad = !this.showSociedad;
  }
  searchAbonos(){
    this.busqueda.emit();
  }
  clearFilters(){}

  searchAbonosSJCS(){}

  getComboGrupoFacturacion() {
    this.sigaServices.get("combo_comboGrupoFacturacion").subscribe(
      n => {
        this.comboGrupoFacturacion = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboGrupoFacturacion);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboEstados() {
    this.sigaServices.get("combo_comboEstadosAbono").subscribe(
      n => {
        this.comboEstados = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboEstados);
      },
      err => {
        console.log(err);
      }
    );
  }

}
