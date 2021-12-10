import { Component, OnInit, EventEmitter, HostListener, Input, ViewChild, Output } from '@angular/core';
import { KEY_CODE } from '../../../censo/busqueda-personas-juridicas/busqueda-personas-juridicas.component';
import { } from '../../../../models/sjcs/ProcedimientoItem';
import { Router } from '../../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { ActasItem } from '../../../../models/sjcs/ActasItem';

@Component({
  selector: 'app-filtro-actas',
  templateUrl: './filtro-actas.component.html',
  styleUrls: ['./filtro-actas.component.scss']
})
export class FiltroActasComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  valueResolucion: Date;
  valueReunion: Date;
  valueAnio: String;
  valueNumero: String;
  valuePresidente: String;
  valueSecretario: String;
  progressSpinner: boolean = false;




  @Input() permisoEscritura;

  datosFiltro: ActasItem = new ActasItem();  
  comboPresidente = [];
  comboSecretario = [];

  @Output() searchEmitter = new EventEmitter<ActasItem>();

  constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices,
    private persistenceService: PersistenceService, private commonServices: CommonsService) { }

  ngOnInit() {
    this.getComboPresidente();
    this.getComboSecretario();
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    if(sessionStorage.getItem("filtrosActa")){
      this.datosFiltro = JSON.parse(sessionStorage.getItem("filtrosActa"));

      this.datosFiltro.fecharesolucion = this.transformDate(this.datosFiltro.fecharesolucion);
      this.datosFiltro.fechareunion = this.transformDate(this.datosFiltro.fechareunion);
     
      
      sessionStorage.removeItem("filtrosActa");
      this.searchEmitter.emit(this.datosFiltro);

    }

  }

  getComboPresidente() {
    this.sigaServices
      .get("filtrosejgcomision_comboPresidente")
      .subscribe(
        n => {
          this.comboPresidente = n.combooItems;
          this.commonServices.arregloTildesCombo(this.comboPresidente);
        },
        err => {
          console.log(err);
        }
      );
  }

  nuevo() {

    this.progressSpinner = true;

    sessionStorage.removeItem("actasItem");

    this.router.navigate(["/fichaGestionActas"]);
  }


  getComboSecretario() {
    this.sigaServices
      .get("filtrosejgcomision_comboSecretario")
      .subscribe(
        n => {
          this.comboSecretario = n.combooItems;
          this.commonServices.arregloTildesCombo(this.comboSecretario);
        },
        err => {
          console.log(err);
        }
      );
  }


  transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);
    return fecha;
  }


  fillFechaResolucion(event) {
      this.datosFiltro.fecharesolucion = this.transformDate(event);
    
  }

  fillFechaReunion(event) {
      this.datosFiltro.fechareunion = this.transformDate(event);
     
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  search() {
console.log(this.datosFiltro)
    this.limpiezaFiltro(this.datosFiltro);
    if (this.checkFilters()) {
      this.persistenceService.setFiltros(this.datosFiltro);
      this.searchEmitter.emit(this.datosFiltro);
    }

  }
  limpiezaFiltro(actaItem){
    if(actaItem.anioacta != undefined){
      actaItem.anioacta.replace(/ /g, "")
      if( actaItem.anioacta.length == 0 ){
        actaItem.anioacta = null;
      }
    }
    if(actaItem.numeroacta != undefined){
      actaItem.numeroacta.replace(/ /g, "")
      if(actaItem.numeroacta.length == 0){
        actaItem.numeroacta = null;
      }
    }

  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    else {
      return false;

    }
  }

  checkFilters() {
    return true;
  }

  clearFilters() {
    this.datosFiltro = new ActasItem();
  }

  clear() {
    this.msgs = [];
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.search();
    }
  }

}
