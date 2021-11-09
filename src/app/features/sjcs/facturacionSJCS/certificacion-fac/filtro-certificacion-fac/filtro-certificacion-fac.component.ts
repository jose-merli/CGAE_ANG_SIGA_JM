import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MultiSelect } from 'primeng/multiselect';
import { CertificacionFacItem } from '../../../../../models/sjcs/CertificacionFacItem';

@Component({
  selector: 'app-filtro-certificacion-fac',
  templateUrl: './filtro-certificacion-fac.component.html',
  styleUrls: ['./filtro-certificacion-fac.component.scss']
})
export class FiltroCertificacionFacComponent implements OnInit {

  filtros = new CertificacionFacItem;
  progressSpinnerFiltro: boolean = false;
  comboEstado=[];
  comboColegios = [];
  comboConceptoServicios = [];
  comboGrupoFacturacion=[];
  comboPartidaPresupuestaria=[];

  disableComboFacturacion;
  showDatosJustificacion: boolean = true;


  @Output() busqueda = new EventEmitter<boolean>();
  @Output() nuevo = new EventEmitter<boolean>();
  @Input() permisoEscritura;
  msgs: any[];

  constructor() { }

  ngOnInit() {

    this.progressSpinnerFiltro = true;

    this.getComboEstado();
    this.getComboColegios();
    this.getComboConceptosServicios();
    this.getComboPartidaPresupuestaria();

    this.progressSpinnerFiltro = false;
    
  }


  getComboColegios(){

    if(this.comboColegios!= null || this.comboColegios != undefined){
      this.disableComboFacturacion = false;
      this.getComboGrupoFacturacion();
    }else{
      this.disableComboFacturacion = true;
    }
  }

  getComboEstado(){

  }

  getComboConceptosServicios(){


  }

  getComboGrupoFacturacion(){


  }

  getComboPartidaPresupuestaria(){


  }

  newCer(){
    this.nuevo.emit(true);
  }

  buscarCert(){
    this.busqueda.emit(true);
  }

  fillFechaHasta(event){
    this.filtros.fechaHasta = event;
  }

  fillFechaDesde(event){
    this.filtros.fechaDesde = event;
			if (this.filtros.fechaHasta < this.filtros.fechaDesde) {
				this.filtros.fechaHasta = undefined;
			}
  }

  restablecer(){
    this.filtros = new CertificacionFacItem;
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

  onHideDatosJustificacion() {
		this.showDatosJustificacion = !this.showDatosJustificacion;
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
}
