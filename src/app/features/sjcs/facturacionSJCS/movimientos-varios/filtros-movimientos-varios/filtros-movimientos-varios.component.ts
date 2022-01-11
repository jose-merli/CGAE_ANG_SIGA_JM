import { Component, OnInit, HostListener, EventEmitter, Output, Input} from '@angular/core';
import { ComboItem } from '../../../../../models/ComboItem';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { KEY_CODE } from '../../../../../commons/login-develop/login-develop.component';
import {MovimientosVariosFacturacionItem} from '../MovimientosVariosFacturacionItem';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { MovimientosVariosService } from '../movimientos-varios.service';
import { SelectItem } from 'primeng/primeng';



@Component({
  selector: 'app-filtros-movimientos-varios',
  templateUrl: './filtros-movimientos-varios.component.html',
  styleUrls: ['./filtros-movimientos-varios.component.scss']
})
export class FiltrosMovimientosVariosComponent implements OnInit {

  //COMBOS
	aplicadoEnPago: ComboItem;
	gruposFacturacion: ComboItem;
	facturacion: ComboItem;
	concepto: ComboItem;
	tipos: ComboItem;
	partidaPresupuestaria: ComboItem;
	certificacion: ComboItem;

	msgs: any[];
	buscar: boolean = false;
	historico: boolean = false;
	showDatosGenerales: boolean = true;
  	showCriteriosAp: boolean = true;
  	showDestinatario: boolean = true;
  	progressSpinner: boolean = false;

  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  usuarioLogado;
  isLetrado : boolean = false;

  @Output() busqueda = new EventEmitter<MovimientosVariosFacturacionItem>();
  @Input() permisoEscritura;
  @Input() disabledLetradoFicha;

  filtros: MovimientosVariosFacturacionItem = new MovimientosVariosFacturacionItem();

  constructor(private router: Router,
		private sigaService: SigaServices, private sigaStorageService: SigaStorageService,
		private translateService: TranslateService,
		private persistenceService: PersistenceService,
		private commonsService: CommonsService,
		private movimientosVariosService: MovimientosVariosService) { }

  ngOnInit() {

	this.isLetrado = this.sigaStorageService.isLetrado;

	if(this.isLetrado){
		this.getDataLoggedUser();
	}

    this.progressSpinner = true;
	if(this.persistenceService.getFiltros() != undefined){
		this.filtros = this.persistenceService.getFiltros();
		this.persistenceService.clearFiltros();
		if(this.filtros.fechaApDesde != null || this.filtros.fechaApDesde != undefined){
			this.filtros.fechaApDesde = new Date(this.filtros.fechaApDesde);
		}
		if(this.filtros.fechaApHasta != null || this.filtros.fechaApHasta != undefined){
			this.filtros.fechaApHasta = new Date(this.filtros.fechaApHasta);
		}
		if(this.filtros.letrado != null && this.filtros.letrado != ""){
			this.usuarioBusquedaExpress.nombreAp = this.filtros.letrado.toString();
		}
		if(this.filtros.ncolegiado != null && this.filtros.ncolegiado != ""){
			this.usuarioBusquedaExpress.numColegiado = this.filtros.ncolegiado.toString();
		}
		this.getCombos()
	}else{

		/* this.comboAplicadoEnPago();
		this.comboFacturacionApInicial();
		this.comboGruposTurnos();
		this.comboConcepto();
    	this.comboPartidasPresupuestarias();
    	this.comboTipos();	
		this.comboCertificacion(); */	
		this.getCombos()

		if (sessionStorage.getItem("colegiadoRelleno")) {
			const { numColegiado, nombre } = JSON.parse(sessionStorage.getItem("datosColegiado"));
			this.usuarioBusquedaExpress.numColegiado = numColegiado;
			this.usuarioBusquedaExpress.nombreAp = nombre.replace(/,/g, "");
	  
			sessionStorage.removeItem("colegiadoRelleno");
			sessionStorage.removeItem("datosColegiado");
		  }
	  
		  this.restablecer();
	  
		  if (sessionStorage.getItem("buscadorColegiados")) {
	  
			let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));
	  
			this.usuarioBusquedaExpress.nombreAp = busquedaColegiado.nombre + " " + busquedaColegiado.apellidos;
	  
			this.usuarioBusquedaExpress.numColegiado = busquedaColegiado.nColegiado;
	  
			sessionStorage.removeItem("buscadorColegiados");
		  }

		  if(this.usuarioBusquedaExpress.numColegiado != null && this.usuarioBusquedaExpress.numColegiado != undefined && this.usuarioBusquedaExpress.numColegiado != ""){
			this.filtros.ncolegiado =this.usuarioBusquedaExpress.numColegiado;
			this.filtros.letrado = this.usuarioBusquedaExpress.nombreAp;
		  }

		}
		
		  this.progressSpinner = false;

		  
}
	  
	getDataLoggedUser() {
		  this.progressSpinner = true;
	  
		  this.sigaService.get("usuario_logeado").subscribe(n => {
	  
			const usuario = n.usuarioLogeadoItem;
			const colegiadoItem = new ColegiadoItem();
			colegiadoItem.nif = usuario[0].dni;
	  
			this.sigaService.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(
			  usr => {
				const { numColegiado, nombre } = JSON.parse(usr.body).colegiadoItem[0];
				this.usuarioBusquedaExpress.numColegiado = numColegiado;
				this.usuarioBusquedaExpress.nombreAp = nombre.replace(/,/g, "");
				this.filtros.ncolegiado = numColegiado;
				this.filtros.letrado = nombre.replace(/,/g, "");

				this.usuarioLogado = JSON.parse(usr.body).colegiadoItem[0];
				this.isBuscar();
				this.progressSpinner = false;
			  }, err => {
				this.progressSpinner = false;
			  },
			  () => {
				this.progressSpinner = false;
				setTimeout(() => {
				  //this.isBuscar();
				}, 5);
			  });
		  });

		  this.progressSpinner = false;
	}

	
  fillFechaDesde(event) {

			this.filtros.fechaApDesde = event;
			if (this.filtros.fechaApHasta < this.filtros.fechaApDesde) {
				this.filtros.fechaApHasta = undefined;
			}
	
	}

	fillFechaHasta(event) {
			this.filtros.fechaApHasta = event;	
	}

  restablecer() {
		this.filtros=new MovimientosVariosFacturacionItem();
		if (sessionStorage.getItem("isLetrado") == "false") {
			this.usuarioBusquedaExpress = {
			  numColegiado: "",
			  nombreAp: ""
			};
		  }
	}

	changeColegiado(event) {
		this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
		this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
		this.filtros.ncolegiado = event.nColegiado;
		this.filtros.letrado = event.nombreAp; 
	  }

  onHideDatosGenerales() {
		this.showDatosGenerales = !this.showDatosGenerales;
	}

  onHideCriteriosAplicacion(){
    this.showCriteriosAp = !this.showCriteriosAp;
  }

  onHideDestinatario(){
    this.showDestinatario = !this.showDestinatario;
  }

  comboPartidasPresupuestarias() {
		this.progressSpinner = true;

		this.sigaService.get("combo_partidasPresupuestarias").subscribe(
			data => {
				this.partidaPresupuestaria = data.combooItems;
				this.commonsService.arregloTildesCombo(this.partidaPresupuestaria);
				this.progressSpinner = false;
			},
			err => {
				console.log(err);
				this.progressSpinner = false;
			}
		);
    this.progressSpinner = false;
	}

	comboCertificacion() {
		this.progressSpinner = true;

		this.sigaService.get("combo_certificacionSJCS").subscribe(
			data => {
				this.certificacion = data.combooItems;
				this.commonsService.arregloTildesCombo(this.certificacion);
				this.progressSpinner = false;
			},
			err => {
				console.log(err);
				this.progressSpinner = false;
			}
		);
    this.progressSpinner = false;
	}

  comboAplicadoEnPago(){

    this.progressSpinner = true;

		this.sigaService.get("combo_AplicadoEnPago").subscribe(
			data => {
				this.aplicadoEnPago = data.combooItems;
				this.commonsService.arregloTildesCombo(this.aplicadoEnPago);
				this.progressSpinner = false;
			},
			err => {
				console.log(err);
				this.progressSpinner = false;
			}
		);

    this.progressSpinner = false;
  }

  comboFacturacionApInicial(){

    this.progressSpinner = true;

		this.sigaService.get("combo_comboFactMovimientos").subscribe(
			data => {
				this.facturacion = data.combooItems;
				this.commonsService.arregloTildesCombo(this.facturacion);
				this.progressSpinner = false;
			},
			err => {
				console.log(err);
				this.progressSpinner = false;
			}
		);

    this.progressSpinner = false;
  }

  comboGruposTurnos(){

    this.progressSpinner = true;

		this.sigaService.get("combo_comboAgrupacionEnTurnos").subscribe(
			data => {
				this.gruposFacturacion = data.combooItems;
				this.commonsService.arregloTildesCombo(this.gruposFacturacion);
				this.progressSpinner = false;
			},
			err => {
				console.log(err);
				this.progressSpinner = false;
			}
		);

    this.progressSpinner = false;
  }

  comboConcepto(){

    this.progressSpinner = true;

		this.sigaService.get("combo_comboFactConceptos").subscribe(
			data => {
				this.concepto = data.combooItems;
				this.commonsService.arregloTildesCombo(this.concepto);
				this.progressSpinner = false;
			},
			err => {
				console.log(err);
				this.progressSpinner = false;
			}
		);
    this.progressSpinner = false;
  }

  comboTipos(){

    this.progressSpinner = true;

		this.sigaService.get("combo_comboTiposMovVarios").subscribe(
			data => {
				this.tipos = data.combooItems;
				this.commonsService.arregloTildesCombo(this.tipos);
				this.progressSpinner = false;
			},
			err => {
				console.log(err);
				this.progressSpinner = false;
			}
		);
    this.progressSpinner = false;
  }

  isBuscar() {
	  
		//if (this.checkFilters()) {
			this.progressSpinner=true;
		
		    this.historico=false;
			this.filtros.historico=false;
			//this.filtros.ncolegiado = this.usuarioBusquedaExpress.nColegiado;
			this.filtros.letrado = this.usuarioBusquedaExpress.nombreAp;
			this.persistenceService.setFiltros(this.filtros);

			this.busqueda.emit(this.filtros);
			this.progressSpinner = false;
		/* }else{
			this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("oficio.busqueda.error.busquedageneral"));
		} */

	
	}

	checkFilters() {
	
		if ((this.filtros.descripcion != null && this.filtros.descripcion != undefined && this.filtros.descripcion != "") ||
			(this.filtros.tipo != null && this.filtros.tipo != undefined && this.filtros.tipo != "") ||
			(this.filtros.certificacion != null && this.filtros.certificacion != undefined && this.filtros.certificacion != "") ||
			(this.filtros.idAplicadoEnPago != null && this.filtros.idAplicadoEnPago != undefined && this.filtros.idAplicadoEnPago != "") ||
			(this.filtros.fechaApDesde != null && this.filtros.fechaApDesde != undefined) ||
			(this.filtros.fechaApHasta != null && this.filtros.fechaApHasta != undefined) ||
			(this.filtros.idFacturacion != null && this.filtros.idFacturacion != undefined && this.filtros.idFacturacion != "") ||
			(this.filtros.idGrupoFacturacion != null && this.filtros.idGrupoFacturacion != undefined && this.filtros.idGrupoFacturacion != "") ||
			(this.filtros.idConcepto != null && this.filtros.idConcepto != undefined && this.filtros.idConcepto != "") ||
			(this.filtros.idPartidaPresupuestaria != null && this.filtros.idPartidaPresupuestaria != undefined && this.filtros.idPartidaPresupuestaria != "") || 
			(this.filtros.ncolegiado != null &&this.filtros.ncolegiado != undefined && this.filtros.ncolegiado != "") ||
			(this.filtros.letrado != null && this.filtros.letrado != undefined && this.filtros.letrado != "") || 
			(this.usuarioBusquedaExpress.numColegiado != null && this.usuarioBusquedaExpress.numColegiado != undefined && this.usuarioBusquedaExpress.numColegiado != "") ||
			(this.usuarioBusquedaExpress.nombreAp != null && this.usuarioBusquedaExpress.nombreAp != undefined && this.usuarioBusquedaExpress.nombreAp != "")){ 

				if ((this.filtros.fechaApDesde != undefined) && (this.filtros.fechaApHasta != undefined)) {
					if (this.filtros.fechaApDesde <= this.filtros.fechaApHasta) {
						return true;
					} else {
						return false;
					}
				} else {
					return true;
				}
		} else {

			return false;
			
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

	clear() {
		this.msgs = [];
	}

	//búsqueda con enter
	@HostListener("document:keypress", ["$event"])
	onKeyPress(event: KeyboardEvent) {
		if (event.keyCode === KEY_CODE.ENTER) {
			this.isBuscar();
		}
	}

	
	new() {
	
	this.movimientosVariosService.modoEdicion = false;
	 //BUSQUEDA GENERAL
	 sessionStorage.setItem("nuevoMovimientoVarios", "true");
	 this.router.navigate(["/buscadorColegiados"]);
	}

	getCombos(){
		this.comboAplicadoEnPago();
		this.comboFacturacionApInicial();
		this.comboGruposTurnos();
		this.comboConcepto();
    	this.comboPartidasPresupuestarias();
    	this.comboTipos();	
		this.comboCertificacion();
	}
	
	 onChangeMultiSelectFact(event, filtro) {
	 	if (undefined != event.value && event.value.length == 0) {
	 		this.filtros[filtro] = undefined;
	 	}
	 }
}
