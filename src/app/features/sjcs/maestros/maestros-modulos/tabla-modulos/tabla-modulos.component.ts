import {
	Component,
	OnInit,
	ViewChild,
	ChangeDetectorRef,
	Input,
	Output,
	EventEmitter,
	SimpleChanges
} from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { ModulosItem } from '../../../../../models/sjcs/ModulosItem';
import { UpperCasePipe } from '../../../../../../../node_modules/@angular/common';
import { ModulosObject } from '../../../../../models/sjcs/ModulosObject';
import { findIndex } from 'rxjs/operators';
import { MultiSelect, ConfirmationService } from 'primeng/primeng';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SortEvent } from '../../../../../../../node_modules/primeng/api';
import { CommonsService } from '../../../../../_services/commons.service';
import { ProcedimientoObject } from '../../../../../models/sjcs/ProcedimientoObject';
import { JuzgadoItem } from '../../../../../models/sjcs/JuzgadoItem';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-tabla-modulos',
	templateUrl: './tabla-modulos.component.html',
	styleUrls: ['./tabla-modulos.component.scss']
})
export class TablaModulosComponent implements OnInit {

	rowsPerPage: any = [];
	cols;
	colsPartidoJudicial;
	msgs;
	buscadores = [];
	juzgados: any[] = [];
	selectedItem: number = 10;
	selectAll;
	selectedDatos = [];
	numSelected = 0;
	selectMultiple: boolean = false;
	seleccion: boolean = false;
	historico: boolean = false;
	hayModulosUsados = false;

	message;
	permisos: boolean = false;
	juzgadoProcedente;
	vieneDeJuzgados;

	initDatos;
	nuevo: boolean = false;
	progressSpinner: boolean = false;

	textSelected: String = '{0} opciones seleccionadas';
	textFilter: string = "Seleccionar";

	//Resultados de la busqueda
	@Input() datos;
	//Combo partidos judiciales
	@Input() comboPJ;

	@Output() searchModulos = new EventEmitter<boolean>();

	@ViewChild("tabla") tabla;

	constructor(private translateService: TranslateService,
		private changeDetectorRef: ChangeDetectorRef,
		private router: Router,
		private sigaServices: SigaServices,
		private persistenceService: PersistenceService,
		private confirmationService: ConfirmationService,
		private commonsService: CommonsService,
		private pipe: DatePipe
	) { }

	ngOnInit() {
		this.getCols();
		this.initDatos = JSON.parse(JSON.stringify((this.datos)));
		this.juzgadoProcedente = JSON.parse(sessionStorage.getItem("datos"));
		this.vieneDeJuzgados = sessionStorage.getItem("vieneDeFichaJuzgado");
		if (this.persistenceService.getPermisos()) {
			this.permisos = true;
		} else {
			this.permisos = false;
		}

		this.searchJuzgados();
	}

	ngOnChanges(changes: SimpleChanges) {
		this.datos.forEach(element => {
			element.importe = +element.importe;
		});
	}

	customSort(event: SortEvent) {
		event.data.sort((data1, data2) => {
			let value1 = data1[event.field];
			let value2 = data2[event.field];
			let result = null;

			if (value1 == null && value2 != null)
				result = -1;
			else if (value1 != null && value2 == null)
				result = 1;
			else if (value1 == null && value2 == null)
				result = 0;
			else if (typeof value1 === 'string' && typeof value2 === 'string')
				result = value1.localeCompare(value2);
			else
				result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

			return (event.order * result);
		});
	}

	seleccionaFila(evento) {
		if(this.vieneDeJuzgados){
			this.juzgados[0] = this.juzgadoProcedente.idJuzgado;
			this.guardarDialogAsociarModulosAJuzgados();
		}
		else{
			if (!this.selectAll && !this.selectMultiple) {

				this.persistenceService.setHistorico(this.historico);
				this.persistenceService.setDatos(this.selectedDatos[0]);
				this.router.navigate(["/gestionModulos"], { queryParams: { idProcedimiento: this.selectedDatos[0].idProcedimiento } });
			} else {
				/* if (evento.data.fechabaja == undefined && this.historico == true) {
					this.selectedDatos.pop();
				} */
			}
		}
		if(this.vieneDeJuzgados){
			this.volverFichaJuzgado();
		}
	}

	checkPermisosDelete() {
		let msg = this.commonsService.checkPermisos(this.permisos, undefined);

		if (msg != undefined) {
			this.msgs = msg;
		} else {
			if (!this.permisos || (!this.selectMultiple || !this.selectAll) && this.selectedDatos.length == 0) {
				this.msgs = this.commonsService.checkPermisoAccion();
			} else {

				this.checkModuloUsado();
			}
		}
	}

	checkModuloUsado() {

		this.modulosDelete.modulosItem = this.selectedDatos;
		this.hayModulosUsados = false;

		this.sigaServices.post("modulosybasesdecompensacion_checkModulos", this.modulosDelete).subscribe(
			data => {
				this.showModalBajaLogicaFisica = false;
				this.progressSpinner = false;
				this.selectedDatos = JSON.parse(data.body).modulosItem;

				this.selectedDatos.forEach(element => {
					if (element.usado) {
						this.hayModulosUsados = true;
					}
				});

				if (!this.hayModulosUsados) {
					this.dialogBajaLogicaFisica();
				} else {
					this.modulosDelete.baja = "bajalogica";
					this.delete();
				}
			},
			err => {
				if (err != undefined && JSON.parse(err.error).error.description != "") {
					this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
				} else {
					this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
				}
				this.progressSpinner = false;
			},
			() => {
				this.progressSpinner = false;
				this.selectAll = false;
			}
		);
	}

	showModalBajaLogicaFisica: boolean = false;
	bajaLogicaFisicaModuloRadioButton: String = 'bajalogica'
	dialogBajaLogicaFisica(){
		this.showModalBajaLogicaFisica = true;
	}

	cancelarDialogBajaLogicaFisica() {
		this.showModalBajaLogicaFisica = false;
		this.selectedDatos = [];
	}

	fechaBajaLogica: Date;
	fillFechaBajaLogica(event) {
		this.fechaBajaLogica = this.transformaFecha(event);
	}

	transformaFecha(fecha) {
		if (fecha != null) {
		  let jsonDate = JSON.stringify(fecha);
		  let rawDate = jsonDate.slice(1, -1);
		  if (rawDate.length < 14) {
			let splitDate = rawDate.split("/");
			let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
			fecha = new Date((arrayDate += "T00:00:00.001Z"));
		  } else {
			fecha = new Date(fecha);
		  }
		} else {
		  fecha = undefined;
		}
	
		return fecha;
	  }


	checkPermisosActivate() {
		let msg = this.commonsService.checkPermisos(this.permisos, undefined);

		if (msg != undefined) {
			this.msgs = msg;
		} else {
			if (!this.permisos || this.selectedDatos.length == 0 || this.selectedDatos == undefined) {
				this.msgs = this.commonsService.checkPermisoAccion();
			} else {
				this.delete();
			}
		}
	}

	modulosDelete = new ModulosObject();
	esReactivar: boolean = false;
	delete() {
		if(this.esReactivar){
			this.modulosDelete.baja = 'reactivar';
		}else if(this.bajaLogicaFisicaModuloRadioButton == 'bajalogica'){
			this.selectedDatos.forEach( modulo => {
					modulo.fechahastavigor = this.fechaBajaLogica;
				}
			)

			this.modulosDelete.baja = "bajalogica";
		}else{
			this.modulosDelete.baja = "bajafisica";
		}

		this.modulosDelete.modulosItem = this.selectedDatos;

		this.modulosDelete.modulosItem.forEach( modulo => {
			if (modulo.fechadesdevigor != null && !(typeof(modulo.fechadesdevigor) == 'number')) {
				modulo.fechadesdevigor = this.formatDate(modulo.fechadesdevigor).getTime();
			  }
		  
			  if (modulo.fechahastavigor != null && !(typeof(modulo.fechahastavigor) == 'number')) {
				modulo.fechahastavigor = this.formatDate(modulo.fechahastavigor).getTime();
			  }
		});

		this.sigaServices.post("modulosybasesdecompensacion_deleteModulos", this.modulosDelete).subscribe(
			data => {
				this.selectedDatos = [];
				if (this.historico) {
					this.searchModulos.emit(true);
				} else {
					this.searchModulos.emit(false);
				}
				this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
				this.showModalBajaLogicaFisica = false;
				this.progressSpinner = false;
			},
			err => {
				if (err != undefined && JSON.parse(err.error).error.description != "") {
					this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
				} else {
					this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
				}
				this.showModalBajaLogicaFisica = false;
				this.progressSpinner = false;
			},
			() => {
				this.showModalBajaLogicaFisica = false;
				this.progressSpinner = false;
				this.historico = false;
				this.selectAll = false;
			}
		);

		this.selectedDatos.forEach( modulo => {
			const pattern = 'dd/MM/yyyy';

			if (modulo.fechadesdevigor != null && typeof(modulo.fechadesdevigor) == 'number') {
				modulo.fechadesdevigor = this.formatDate(modulo.fechadesdevigor);
				modulo.fechadesdevigor = this.pipe.transform(modulo.fechadesdevigor, pattern);
			}
		
			if (modulo.fechahastavigor != null && typeof(modulo.fechahastavigor) == 'number') {
				modulo.fechahastavigor = this.formatDate(modulo.fechahastavigor);
				modulo.fechahastavigor = this.pipe.transform(modulo.fechahastavigor, pattern);
			}

		});
	}

	onChangeSelectAll() {
		if (this.permisos) {
			if (this.selectAll === true) {
				this.selectMultiple = false;
				this.selectedDatos = this.datos;
				this.numSelected = this.datos.length;
				if (this.historico) {
					this.selectedDatos = this.datos.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null);
				} else {
					this.selectedDatos = this.datos;
				}
			} else {
				this.selectedDatos = [];
				this.numSelected = 0;
			}

		}
	}

	searchModulo() {
		this.historico = !this.historico;
		this.searchModulos.emit(this.historico);

	}

	setItalic(dato) {
		if (this.formatDate(dato.fechadesdevigor) <= new Date() && (dato.fechahastavigor == null || this.formatDate(dato.fechahastavigor) > new Date()) &&
		dato.fechabaja == null) return false;
		else return true;
	}

	formatDate(date) {

		if (date instanceof Date) {
			return date; 
		} else if (typeof(date) == 'number'){
			return new Date(date.valueOf());
		} else {
			var parts = date.split("/");
			var formattedDate = new Date(parts[1] + "/" + parts[0] + "/" + parts[2]);
			return formattedDate;
		}
	}

	getCols() {

		this.cols = [
			{ field: "codigo", header: "general.boton.code", width: "12%" },
			{ field: "nombre", header: "administracion.parametrosGenerales.literal.nombre", width: "42%" },
			{ field: "fechadesdevigor", header: "facturacion.seriesFacturacion.literal.fInicio", width: "11%" },
			{ field: "fechahastavigor", header: "censo.consultaDatos.literal.fechaFin", width: "11%" },
			{ field: "importe", header: "formacion.fichaCurso.tarjetaPrecios.importe", width: "8%" },
			{ field: "jurisdiccionDes", header: "menu.justiciaGratuita.maestros.Jurisdiccion", width: "16%" },

		];
		this.cols.forEach(it => this.buscadores.push(""));

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

	onChangeRowsPerPages(event) {
		this.selectedItem = event.value;
		this.changeDetectorRef.detectChanges();
		this.tabla.reset();
	}

	isSelectMultiple() {
		if (this.permisos) {
			this.selectAll = false;
			this.selectMultiple = !this.selectMultiple;
			if (!this.selectMultiple) {
				this.selectedDatos = [];
				this.numSelected = 0;
			} else {
				// this.pressNew = false;
				this.selectAll = false;
				this.selectedDatos = [];
				this.numSelected = 0;
			}
		}
		// this.volver();
	}


	actualizaSeleccionados(selectedDatos) {
		this.numSelected = selectedDatos.length;
		this.seleccion = false;
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

	showModalAsociarModulosAJuzgados: boolean = false;
	asociarModulosAJuzgados(){
		this.showModalAsociarModulosAJuzgados = true;
	}

	cancelarDialogAsociarModulosAJuzgados() {
		this.showModalAsociarModulosAJuzgados = false;
	}
	

	filtros: JuzgadoItem = new JuzgadoItem();
	juzgadosList: any[] = [];
	searchJuzgados() {
		this.progressSpinner = true;
		this.sigaServices.post("busquedaJuzgados_searchCourt", this.filtros).subscribe(
		  n => {

			JSON.parse(n.body).juzgadoItems.forEach(juzgados => {
				this.juzgadosList.push({label: juzgados.nombre + " (" + juzgados.codigoExt2 + ")", value: juzgados.idJuzgado})
			});
			
			this.progressSpinner = false;

		  },
		  err => {
			this.progressSpinner = false;
		  });
	  }

	guardarDialogAsociarModulosAJuzgados(){
		this.progressSpinner = true;
		this.juzgados.forEach(juzgado => {
			let procedimientoDTO = new ProcedimientoObject();
		
			this.selectedDatos.forEach( modulo => {
				if (modulo.fechadesdevigor != null && !(typeof(modulo.fechadesdevigor) == 'number')) {
					modulo.fechadesdevigor = this.formatDate(modulo.fechadesdevigor).getTime();
				  }
			  
				  if (modulo.fechahastavigor != null && !(typeof(modulo.fechahastavigor) == 'number')) {
					modulo.fechahastavigor = this.formatDate(modulo.fechahastavigor).getTime();
				  }
			});

			procedimientoDTO.procedimientosItems = this.selectedDatos;
			procedimientoDTO.idJuzgado = juzgado;


			this.sigaServices.post("gestionJuzgados_asociarModulosAJuzgados", procedimientoDTO).subscribe(
				data => {
					this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
					this.progressSpinner = false;
					this.showModalAsociarModulosAJuzgados = false;
				},
				err => {
		
					if (err.error != undefined && JSON.parse(err.error).error.description != "") {
						this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
					} else {
						this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
					}
					this.showModalAsociarModulosAJuzgados = false;
					this.progressSpinner = false;
					},
				() => {
					this.showModalAsociarModulosAJuzgados = false;
					this.progressSpinner = false;
				}
			);
		
			this.selectedDatos.forEach( modulo => {
				const pattern = 'dd/MM/yyyy';

				if (modulo.fechadesdevigor != null && typeof(modulo.fechadesdevigor) == 'number') {
					modulo.fechadesdevigor = this.formatDate(modulo.fechadesdevigor);
					modulo.fechadesdevigor = this.pipe.transform(modulo.fechadesdevigor, pattern);
				}
			
				if (modulo.fechahastavigor != null && typeof(modulo.fechahastavigor) == 'number') {
					modulo.fechahastavigor = this.formatDate(modulo.fechahastavigor);
					modulo.fechahastavigor = this.pipe.transform(modulo.fechahastavigor, pattern);
				}

			});
		});
	}

	volverFichaJuzgado(){
    	this.router.navigate(['gestionJuzgados']);
	  }
}