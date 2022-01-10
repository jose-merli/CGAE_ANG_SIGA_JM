import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { DataTable } from 'primeng/datatable';
import { Message, ConfirmationService } from 'primeng/components/common/api';
import { Router } from '@angular/router';
import { TranslateService } from '../../../commons/translate/translation.service';
import { SigaServices } from './../../../_services/siga.service';
import { PlantillaEnvioSearchItem } from '../../../models/PlantillaEnvioSearchItem';
import { PlantillaEnvioItem } from '../../../models/PlantillaEnvioItem';
import { PlantillasEnvioObject } from '../../../models/PlantillasEnvioObject';
import { useAnimation } from '@angular/core/src/animation/dsl';
import { CommonsService } from '../../../_services/commons.service';
export enum KEY_CODE {
	ENTER = 13
}

@Component({
	selector: 'app-plantillas-envio',
	templateUrl: './plantillas-envio.component.html',
	styleUrls: ['./plantillas-envio.component.scss'],
	host: {
		"(document:keypress)": "onKeyPress($event)"
	},
})
export class PlantillasEnvioComponent implements OnInit {
	fichaBusqueda: boolean = true;
	msgs: Message[];
	tiposEnvio: any = [];
	bodySearch: PlantillaEnvioSearchItem = new PlantillaEnvioSearchItem();
	body: PlantillaEnvioItem = new PlantillaEnvioItem();
	searchPlantillasEnvio: PlantillasEnvioObject = new PlantillasEnvioObject();

	//variables tabla
	datos: any[];
	cols: any[];
	first: number = 0;
	selectedItem: number;
	selectAll: boolean = false;
	selectMultiple: boolean = false;
	numSelected: number = 0;
	rowsPerPage: any = [];
	showResultados: boolean = false;
	showHistorico: boolean = false;
	progressSpinner: boolean = false;
	loaderEtiquetas: boolean = false;
	eliminarArray: any[];
	institucionActual: any;
	noEditable: boolean = true;

	@ViewChild('table') table: DataTable;
	selectedDatos;

	constructor(
		private sigaServices: SigaServices,
		private translateService: TranslateService,
		private changeDetectorRef: ChangeDetectorRef,
		private confirmationService: ConfirmationService,
		private commonsService: CommonsService,
		private router: Router
	) { }

	ngOnInit() {
		sessionStorage.removeItem('crearNuevaPlantilla');
		sessionStorage.removeItem('soloLectura');

		this.cols = [
			{ field: 'nombre', header: 'administracion.parametrosGenerales.literal.nombre', width: '25%' },
			{ field: 'tipoEnvio', header: 'enviosMasivos.literal.tipoEnvio', width: '25%' },
			{ field: 'descripcion', header: 'enviosMasivos.literal.descripcion' }
		];

		this.configTabla();
		this.getTipoEnvios();
		this.getInstitucion();

		if (sessionStorage.getItem('filtrosPlantillas') != null) {
			this.bodySearch = JSON.parse(sessionStorage.getItem('filtrosPlantillas'));
			if (this.bodySearch != null && (this.bodySearch.nombre != undefined || this.bodySearch.idTipoEnvios)) {
				this.buscar();
			} else {
				this.bodySearch = new PlantillaEnvioSearchItem();
			}
		}
		// this.comboTipoEnvio = [{ label: '', value: '' }, { label: 'SMS', value: '1' }, { label: 'email', value: '2' }, { label: 'carta', value: '3' }]
	}

	ngAfterViewInit() {
	
	}

	getInstitucion() {
		this.sigaServices.get('institucionActual').subscribe((n) => {
			this.institucionActual = n.value;
		});
	}

	configTabla() {
		//numero de filas predeterminadas a mostrar
		this.selectedItem = 10;

		this.rowsPerPage = [
			{
				label: 10,
				value: 10
			},
			{
				label: 20,
				value: 20
			},
			{
				label: 30,
				value: 30
			},
			{
				label: 40,
				value: 40
			}
		];
	}

	getResultados() {
		//llamar al servicio de busqueda
		this.sigaServices.postPaginado('plantillasEnvio_search', '?numPagina=1', this.bodySearch).subscribe(
			(data) => {
				this.progressSpinner = false;
				this.searchPlantillasEnvio = JSON.parse(data['body']);
				this.datos = this.searchPlantillasEnvio.plantillasItem;
			},
			(err) => {
				//console.log(err);
				this.progressSpinner = false;
			},
			() => { 
				this.progressSpinner = false;
				setTimeout(()=>{
					this.commonsService.scrollTablaFoco('tablaFoco');
				  }, 5);
			}
		);
	}

	onChangeRowsPerPages(event) {
		this.selectedItem = event.value;
		this.changeDetectorRef.detectChanges();
		this.table.reset();
	}

	isSelectMultiple() {
		this.selectMultiple = !this.selectMultiple;
		if (!this.selectMultiple) {
			this.selectedDatos = [];
			this.numSelected = 0;
		} else {
			this.selectAll = false;
			this.selectedDatos = [];
			this.numSelected = 0;
		}
	}

	onChangeSelectAll() {
		if (this.selectAll === true) {
			this.selectMultiple = false;
			this.selectedDatos = this.datos;
			this.numSelected = this.datos.length;
		} else {
			this.selectedDatos = [];
			this.numSelected = 0;
		}
	}

	detallePlantilla(item) {
		let id = item[0].id;
		item[0].idPersona = '2';

		sessionStorage.setItem('crearNuevaPlantilla', 'false');
		if (!this.selectMultiple) {
			this.router.navigate(['/fichaPlantilla']);
			sessionStorage.setItem('plantillasEnvioSearch', JSON.stringify(item[0]));
			sessionStorage.setItem('filtrosPlantillas', JSON.stringify(this.bodySearch));
		} else {
			this.numSelected = item.length;
		}
	}

	actualizaSeleccionados(selectedDatos) {
		this.numSelected = selectedDatos.length;
	}

	// buscar() {
	// 	this.progressSpinner = true;
	// 	this.showResultados = true;
	// 	sessionStorage.removeItem('plantillasEnvioSearch');
	// 	sessionStorage.removeItem('filtrosPlantillas');
	// 	sessionStorage.removeItem('remitente');
	// 	this.getResultados();
	// }


	buscar() {
		if (this.checkFilters()) {
			this.progressSpinner = true;
			this.showResultados = true;
			sessionStorage.removeItem('plantillasEnvioSearch');
			sessionStorage.removeItem('filtrosPlantillas');
			sessionStorage.removeItem('remitente');
			this.getResultados();
		}
	}

	checkFilters() {
		if (
			(this.bodySearch.nombre == undefined || this.bodySearch.nombre == "" || this.bodySearch.nombre.trim().length < 3) &&
			(this.bodySearch.idTipoEnvios == undefined || this.bodySearch.idTipoEnvios == "")) {
			this.showSearchIncorrect();
			return false;
		} else {
			// quita espacios vacios antes de buscar
			if (this.bodySearch.nombre != undefined) {
				this.bodySearch.nombre = this.bodySearch.nombre.trim();
			}
			return true;
		}
	}
	showSearchIncorrect() {
		this.msgs = [];
		this.msgs.push({
			severity: "error",
			summary: this.translateService.instant("general.message.incorrect"),
			detail: this.translateService.instant(
				"cen.busqueda.error.busquedageneral"
			)
		});
	}


	// Mensajes
	showFail(mensaje: string) {
		this.msgs = [];
		this.msgs.push({ severity: 'error', summary: '', detail: mensaje });
	}

	showSuccess(mensaje: string) {
		this.msgs = [];
		this.msgs.push({ severity: 'success', summary: '', detail: mensaje });
	}

	showInfo(mensaje: string) {
		this.msgs = [];
		this.msgs.push({ severity: 'info', summary: '', detail: mensaje });
	}

	clear() {
		this.msgs = [];
	}

	abreCierraFicha() {
		this.fichaBusqueda = !this.fichaBusqueda;
	}

	addPlantilla() {
		sessionStorage.setItem('filtrosPlantillas', JSON.stringify(this.bodySearch));
		sessionStorage.removeItem('plantillasEnvioSearch');
		sessionStorage.removeItem('remitente');
		sessionStorage.setItem('crearNuevaPlantilla', 'true');
		this.router.navigate(['/fichaPlantilla']);
	}

	getTipoEnvios() {
		this.sigaServices.get('enviosMasivos_tipo').subscribe(
			(n) => {
				this.tiposEnvio = n.combooItems;
				// this.tiposEnvio.unshift({ label: '', value: '' })

				/*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
      para poder filtrar el dato con o sin estos caracteres*/
				this.tiposEnvio.map((e) => {
					let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
					let accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
					let i;
					let x;
					for (i = 0; i < e.label.length; i++) {
						if ((x = accents.indexOf(e.label[i])) != -1) {
							e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
							return e.labelSinTilde;
						}
					}
				});
			},
			(err) => {
				//console.log(err);
			}
		);
	}

	/*
función para que no cargue primero las etiquetas de los idiomas*/

	isCargado(key) {
		if (key != this.translateService.instant(key)) {
			this.loaderEtiquetas = false;
			return key;
		} else {
			this.loaderEtiquetas = true;
		}
	}
	limpiar() {
		this.bodySearch = new PlantillaEnvioSearchItem();
		this.datos = [];
	}
	eliminar(dato) {
		this.confirmationService.confirm({
			// message: this.translateService.instant("messages.deleteConfirmation"),
			message: this.translateService.instant('informesycomunicaciones.plantillasenvio.eliminarMensaje'),
			icon: 'fa fa-trash-alt',
			accept: () => {
				this.confirmarEliminar(dato);
			},
			reject: () => {
				this.msgs = [
					{
						severity: 'info',
						summary: 'info',
						detail: this.translateService.instant('general.message.accion.cancelada')
					}
				];
			}
		});
	}

	confirmarEliminar(dato) {
		this.eliminarArray = [];
		dato.forEach((element) => {
			let objEliminar = {
				idInstitucion: element.idInstitucion,
				idPlantillaEnvios: element.idPlantillaEnvios,
				idTipoEnvios: element.idTipoEnvios
			};
			this.eliminarArray.push(objEliminar);
		});
		this.sigaServices.post('plantillasEnvio_borrar', this.eliminarArray).subscribe(
			(data) => {
				this.showSuccess(this.translateService.instant('informesycomunicaciones.modelosdecomunicacion.ficha.correctPlantillaEliminado'));
			},
			(err) => {
				let errorResponse = JSON.parse(err.error);
				if (errorResponse.code == 400) {
					this.showInfo(this.translateService.instant('informesycomunicaciones.modelosdecomunicacion.ficha.plantillaNoBorrar'));
				} else {
					this.showFail(this.translateService.instant('informesycomunicaciones.modelosdecomunicacion.ficha.errorPlantillaEliminado'));
				}
				//console.log(err);
			},
			() => {
				this.buscar();
				this.table.reset();
			}
		);
	}

	//búsqueda con enter
	@HostListener('document:keypress', ['$event'])
	onKeyPress(event: KeyboardEvent) {
		if (event.keyCode === KEY_CODE.ENTER) {
			this.buscar();
		}
	}
}
