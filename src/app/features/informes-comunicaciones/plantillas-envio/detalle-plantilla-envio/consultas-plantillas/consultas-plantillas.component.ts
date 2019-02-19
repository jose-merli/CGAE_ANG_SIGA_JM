import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { DataTable } from "primeng/datatable";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { PlantillaEnvioConsultasItem } from "../../../../../models/PlantillaEnvioConsultasItem";
import { PlantillasEnvioConsultasObject } from "../../../../../models/PlantillasEnvioConsultasObject";
import { SigaServices } from "./../../../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from "../../../../../commons/translate/translation.service";

@Component({
	selector: "app-consultas-plantillas",
	templateUrl: "./consultas-plantillas.component.html",
	styleUrls: ["./consultas-plantillas.component.scss"]
})
export class ConsultasPlantillasComponent implements OnInit {
	datos: any[];
	datosInit: any[];
	cols: any[];
	first: number = 0;
	selectedItem: number;
	selectAll: boolean = false;
	selectMultiple: boolean = false;
	numSelected: number = 0;
	rowsPerPage: any = [];
	formatos: any[];
	sufijos: any[];
	textFilter: string;
	openFicha: boolean = false;
	body: PlantillaEnvioConsultasItem = new PlantillaEnvioConsultasItem();
	searchConsultasPlantillasEnvio: PlantillasEnvioConsultasObject = new PlantillasEnvioConsultasObject();
	progressSpinner: boolean = false;
	consultas: any = [];
	selectedConsulta: string;
	nuevaConsulta: boolean = false;
	eliminarArray: any[];
	msgs: Message[];
	finalidad: string;
	objetivo: string;
	institucionActual: any;
	resultadosConsultas;
	consultaBuscada;

	@ViewChild("table") table: DataTable;
	selectedDatos;

	fichasPosibles = [
		{
			key: "generales",
			activa: false
		},
		{
			key: "consultas",
			activa: false
		},
		{
			key: "remitente",
			activa: false
		}
	];

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private location: Location,
		private router: Router,
		private sigaServices: SigaServices,
		private confirmationService: ConfirmationService,
		private translateService: TranslateService
	) { }

	ngOnInit() {
		// this.getDatos();
		//sessionStorage.removeItem('consultasSearch');
		this.textFilter = "Elegir";

		this.selectedItem = 10;
		this.selectedDatos = [];

		this.cols = [
			{
				field: "nombre",
				header: "administracion.parametrosGenerales.literal.nombre"
			},
			{
				field: 'objetivo',
				header: 'administracion.parametrosGenerales.literal.nombre.objetivo'
			}
			// {
			// 	field: "finalidad",
			// 	header: "informesycomunicaciones.plantillasenvio.ficha.finalidad"
			// }
		];

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

		// this.body.idConsulta = this.consultas[1].value;
	}

	// Mensajes
	showFail(mensaje: string) {
		this.msgs = [];
		this.msgs.push({ severity: "error", summary: "", detail: mensaje });
	}

	showSuccess(mensaje: string) {
		this.msgs = [];
		this.msgs.push({ severity: "success", summary: "", detail: mensaje });
	}

	showInfo(mensaje: string) {
		this.msgs = [];
		this.msgs.push({ severity: "info", summary: "", detail: mensaje });
	}

	clear() {
		this.msgs = [];
	}

	onChangeRowsPerPages(event) {
		this.selectedItem = event.value;
		this.changeDetectorRef.detectChanges();
		this.table.reset();
	}

	isSelectMultiple() {
		this.selectMultiple = !this.selectMultiple;
		this.nuevaConsulta = false;
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

	getInstitucion() {
		this.sigaServices.get("institucionActual").subscribe(n => {
			this.institucionActual = n.value;
		});
	}

	navigateTo(dato) {
		let idConsulta = dato[0].idConsulta;
		console.log(dato);
		if (!this.selectMultiple && idConsulta && !this.nuevaConsulta) {
			if (
				dato[0].generica == "No" ||
				(this.institucionActual == 2000 && dato[0].generica == "Si")
			) {
				sessionStorage.setItem("consultaEditable", "S");
			} else {
				sessionStorage.setItem("consultaEditable", "N");
			}
			sessionStorage.setItem("consultasSearch", JSON.stringify(dato[0]));
			this.router.navigate(["/fichaConsulta"]);
		}
		this.numSelected = this.selectedDatos.length;
	}
	actualizaSeleccionados(selectedDatos) {
		this.numSelected = selectedDatos.length;
	}
	abreCierraFicha() {
		if (
			sessionStorage.getItem("crearNuevaPlantilla") == null ||
			sessionStorage.getItem("crearNuevaPlantilla") == undefined ||
			sessionStorage.getItem("crearNuevaPlantilla") == "false"
		) {
			this.openFicha = !this.openFicha;
			if (this.openFicha) {
				this.getDatos();
			}
		}
	}

	esFichaActiva(key) {
		let fichaPosible = this.getFichaPosibleByKey(key);
		return fichaPosible.activa;
	}

	getFichaPosibleByKey(key): any {
		let fichaPosible = this.fichasPosibles.filter(elto => {
			return elto.key === key;
		});
		if (fichaPosible && fichaPosible.length) {
			return fichaPosible[0];
		}
		return {};
	}

	addConsulta() {
		let objNewConsulta = {
			idConsulta: "",
			nombre: "",
			finalidad: "",
			asociada: false
		};

		this.nuevaConsulta = true;

		if (this.datos == undefined) {
			this.datos = [];
		}

		this.datos.push(objNewConsulta);
		this.datos = [...this.datos];
		this.selectedDatos = [];
	}

	getDatos() {
		if (sessionStorage.getItem("plantillasEnvioSearch") != null) {
			this.body = JSON.parse(sessionStorage.getItem("plantillasEnvioSearch"));
			this.progressSpinner = true;
			this.getResultados();
		}
	}

	getResultados() {
		//llamar al servicio de busqueda
		this.sigaServices.post("plantillasEnvio_consultas", this.body).subscribe(
			data => {
				this.searchConsultasPlantillasEnvio = JSON.parse(data["body"]);
				this.datos = this.searchConsultasPlantillasEnvio.consultaItem;

				//this.getConsultas();
				this.datos.map(e => {
					let id = e.idConsulta;
					this.getFinalidad(id);
					return (e.finalidad = ""), (e.asociada = true);
				});

				this.datosInit = JSON.parse(JSON.stringify(this.datos));
				this.consultas = [];
			},
			err => {
				console.log(err);
				this.progressSpinner = false;
			},
			() => { }
		);
	}

	getConsultas() {
		this.sigaServices.get("plantillasEnvio_comboConsultas").subscribe(
			data => {
				this.consultas = data.combooItems;
				console.log(this.consultas);
			},
			err => {
				console.log(err);
				this.progressSpinner = false;
			},
			() => { }
		);
	}

	getConsultasFiltro(filtro) {
		this.consultaBuscada = this.getLabelbyFilter(filtro);

		this.sigaServices
			.getParam("plantillasEnvio_comboConsultas", "?filtro=" + filtro)
			.subscribe(
				data => {
					this.consultas = data.combooItems;

					if (this.consultas != undefined || this.consultas.length == 0) {
						this.resultadosConsultas = "No hay resultados";
					}
					console.log(this.consultas);
				},
				err => {
					console.log(err);
					this.progressSpinner = false;
				},
				() => { }
			);
	}

	buscarConsultas(e) {
		if (e.target.value && e.target.value !== null) {
			if (e.target.value.length >= 3) {
				this.getConsultasFiltro(e.target.value);
			} else {
				this.consultas = [];
				this.resultadosConsultas = "Debe introducir al menos 3 caracteres";
			}
		} else {
			this.consultas = [];
			this.resultadosConsultas = "No hay resultados";
		}
	}

	onChangeConsultas(e) {
		let id = e.value;
		this.getFinalidad(id);
		console.log(id);
	}

	asociar() {
		let objAsociar = {
			idConsulta: this.datos[this.datos.length - 1].idConsulta,
			idTipoEnvios: this.body.idTipoEnvios,
			idPlantillaEnvios: this.body.idPlantillaEnvios
		};

		this.sigaServices
			.post("plantillasEnvio_asociarConsulta", objAsociar)
			.subscribe(
				data => {
					this.nuevaConsulta = false;
					this.showSuccess(
						this.translateService.instant(
							"informesycomunicaciones.plantillasenvio.ficha.correctAsociar"
						)
					);
				},
				err => {
					console.log(err);
					this.progressSpinner = false;
					this.showFail(
						this.translateService.instant(
							"informesycomunicaciones.plantillasenvio.ficha.errorAsociar"
						)
					);
				},
				() => {
					this.getResultados();
				}
			);
	}

	desasociar(dato) {
		this.confirmationService.confirm({
			// message: this.translateService.instant("messages.deleteConfirmation"),
			message: this.translateService.instant(
				"informesycomunicaciones.plantillasenvio.ficha.mensajeDesasociar"
			),
			icon: "fa fa-trash-alt",
			accept: () => {
				this.confirmarDesasociar(dato);
			},
			reject: () => {
				this.msgs = [
					{
						severity: "info",
						summary: "info",
						detail: this.translateService.instant(
							"general.message.accion.cancelada"
						)
					}
				];
			}
		});
	}

	confirmarDesasociar(dato) {
		this.eliminarArray = [];
		dato.forEach(element => {
			let objEliminar = {
				idConsulta: element.idConsulta,
				idTipoEnvios: this.body.idTipoEnvios,
				idPlantillaEnvios: this.body.idPlantillaEnvios
			};
			this.eliminarArray.push(objEliminar);
		});
		this.sigaServices
			.post("plantillasEnvio_desaociarConsulta", this.eliminarArray)
			.subscribe(
				data => {
					this.showSuccess(
						this.translateService.instant(
							"informesycomunicaciones.plantillasenvio.ficha.correctDesasociar"
						)
					);
				},
				err => {
					this.showFail(
						this.translateService.instant(
							"informesycomunicaciones.plantillasenvio.ficha.errorDesasociar"
						)
					);
					console.log(err);
				},
				() => {
					this.getResultados();
				}
			);
	}

	goNuevaConsulta() {
		this.router.navigate(["/fichaConsulta"]);
		sessionStorage.removeItem("consultasSearch");
		sessionStorage.setItem("crearNuevaConsulta", JSON.stringify("true"));
		// sessionStorage.setItem(
		// "nuevaConsultaPlantillaEnvios",
		// JSON.stringify(this.body)
		// );
	}

	getFinalidad(id) {
		this.sigaServices.post("plantillasEnvio_finalidadConsulta", id).subscribe(
			data => {
				this.progressSpinner = false;
				this.finalidad = JSON.parse(data["body"]).finalidad;
				this.objetivo = JSON.parse(data['body']).objetivo;
				for (let dato of this.datos) {
					if (!dato.idConsulta && dato.idConsulta == id) {
						dato.idConsulta = id;
						dato.finalidad = this.finalidad;
						dato.objetivo = this.objetivo;
					} else if (dato.idConsulta && dato.idConsulta == id) {
						dato.finalidad = this.finalidad;
						dato.objetivo = this.objetivo;
					}
				}
				this.datos = [...this.datos];
				console.log(this.datos);
			},
			err => {
				console.log(err);
				this.progressSpinner = false;
			},
			() => { }
		);
	}

	restablecer() {
		this.nuevaConsulta = false;
		this.datos = JSON.parse(JSON.stringify(this.datosInit));
		this.datos.map(e => {
			let id = e.idConsulta;
			this.getFinalidad(id);
			return (e.finalidad = ""), (e.asociada = true);
		});
	}

	getLabelbyFilter(string): string {
		/*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
	para poder filtrar el dato con o sin estos caracteres*/
		let labelSinTilde = string;
		let accents =
			"ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
		let accentsOut =
			"AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
		let i;
		let x;
		for (i = 0; i < string.length; i++) {
			if ((x = accents.indexOf(string.charAt(i))) != -1) {
				labelSinTilde = string.replace(string.charAt(i), accentsOut[x]);
				return labelSinTilde;
			}
		}

		return labelSinTilde;
	}
}
