import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { SigaServices } from "../../../../../_services/siga.service";
import { DataTable } from "primeng/datatable";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { DestinatariosEnviosMasivosItem } from '../../../../../models/DestinatariosEnviosMasivosItem';
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { PlantillasEnvioConsultasObject } from "../../../../../models/PlantillasEnvioConsultasObject";

@Component({
    selector: 'app-destinatarios-list-envio-masivo',
    templateUrl: './destinatarios-list-envio-masivo.component.html',
    styleUrls: ['./destinatarios-list-envio-masivo.component.scss']
})
export class DestinatarioListEnvioMasivoComponent implements OnInit {

    openFicha: boolean = false;
    openDestinatario: boolean;
    msgs: Message[];
    progressSpinner: boolean = false;
    noEditar: boolean = false;
    consultas: any = [];
    selectedConsulta: string;
    nuevaConsulta: boolean = false;
    finalidad: string;
    objetivo: string;
    institucionActual: any;
    body: DestinatariosEnviosMasivosItem = new DestinatariosEnviosMasivosItem();
    searchConsultasPlantillasEnvio: PlantillasEnvioConsultasObject = new PlantillasEnvioConsultasObject();
    eliminarArray: any[];
    consultaBuscada;
    resultadosConsultas;

    //tabla
    datos: any[];
    datosInit: any[];
    cols: any[];
    first: number = 0;
    selectedItem: number;
    selectAll: boolean = false;
    selectMultiple: boolean = false;
    numSelected: number = 0;
    rowsPerPage: any = [];


    @ViewChild('table') table: DataTable;
    selectedDatos

    fichasPosibles = [
        {
            key: "configuracion",
            activa: false
        },
        {
            key: "programacion",
            activa: false
        },
        {
            key: "destinatarios",
            activa: false
        },
        {
            key: "destinatariosIndv",
            activa: false
        },
        {
            key: "destinatariosList",
            activa: false
        },
        {
            key: "documentos",
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

        this.selectedItem = 10;
        this.selectedDatos = [];

        this.cols = [
            {
                field: "nombre",
                header: "administracion.parametrosGenerales.literal.nombre"
            },
            {
                field: 'objetivo',
                header: 'administracion.parametrosGenerales.literal.objetivo'
            }
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
        this.getDatos();

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

    abreCierraFicha() {
        if (sessionStorage.getItem("crearNuevoEnvio") == null) {
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

    onOpenDestinatario(d) {
        d.open = !d.open;
    }

    getInstitucion() {
        this.sigaServices.get("institucionActual").subscribe(n => {
            this.institucionActual = n.value;
        });
    }

    navigateTo() {
        if (!this.selectMultiple && !this.nuevaConsulta) {
            if (
                this.institucionActual == 2000 )
            {
                sessionStorage.setItem("consultaEditable", "S");
            } else {
                sessionStorage.setItem("consultaEditable", "N");
            }
            this.router.navigate(["/fichaConsulta"]);
        }
        this.numSelected = this.selectedDatos.length;
    }
    
    actualizaSeleccionados(selectedDatos) {
        if (this.selectedDatos != undefined) {
          
          this.numSelected = this.selectedDatos.length;
        }
      }

    getDatos() {
        if (sessionStorage.getItem("enviosMasivosSearch") != null) {
            this.getConsultas();
            this.body = JSON.parse(sessionStorage.getItem("enviosMasivosSearch"));
            this.getResultados();
            if (this.body.idEstado != '1' && this.body.idEstado != '4') {
                this.noEditar = true;
            }
        }
    }

    getResultados() {

        //llamar al servicio de busqueda
        this.sigaServices.post("enviosMasivos_consultasDestAsociadas", this.body.idEnvio).subscribe(
            data => {
                this.searchConsultasPlantillasEnvio = JSON.parse(data["body"]);
                this.datos = this.searchConsultasPlantillasEnvio.consultaItem;
                this.datos.map(e => {
                    let id = e.idConsulta;
                    this.getFinalidad(id);
                    return (e.finalidad = ""), (e.asociada = true);
                });

                this.datosInit = JSON.parse(JSON.stringify(this.datos));
                this.progressSpinner = false;

                // this.consultas = [];
            },
            err => {
                //console.log(err);
                this.progressSpinner = false;
            },
            () => { }
        );

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
                //console.log(this.datos);
            },
            err => {
                //console.log(err);
                this.progressSpinner = false;
            },
            () => { }
        );
    }
    getConsultas() {
        this.sigaServices.get("enviosMasivos_consultasDestinatarios").subscribe(
            data => {
                this.consultas = data.consultas;
                /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
						para poder filtrar el dato con o sin estos caracteres*/
						this.consultas.map(e => {
							let accents =
							"ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
							let accentsOut =
							"AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
							let i;
							let x;
							for (i = 0; i < e.label.length; i++) {
							if ((x = accents.indexOf(e.label[i])) != -1) {
								e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
								return e.labelSinTilde;
							}
							}
						});
                //console.log("consultas combo", this.consultas);
            },
            err => {
                //console.log(err);
                this.progressSpinner = false;
            },
            () => { }
        );
    }

    addConsulta() {
        this.numSelected = 0;
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

    asociar() {
        if (sessionStorage.getItem("enviosMasivosSearch") != null) {
            this.body = JSON.parse(sessionStorage.getItem("enviosMasivosSearch"));
        }
        let consulta = {
            idEnvio: this.body.idEnvio,
            idConsulta: this.datos[this.datos.length - 1].idConsulta,
            idInstitucion: this.datos[this.datos.length - 1].idInstitucion
        }

        this.sigaServices.post("enviosMasivos_asociarConsulta", consulta).subscribe(result => {
            this.nuevaConsulta = false;
            this.showSuccess(this.translateService.instant("informesycomunicaciones.plantillasenvio.ficha.correctAsociar"));
            this.getResultados();
            this.nuevaConsulta = false;
        }, error => {
            //console.log(error);
            this.progressSpinner = false;
            let errorResponse = JSON.parse(error.error);
            if (errorResponse.code == 400) {
                this.showInfo(this.translateService.instant("informesycomunicaciones.plantillasenvio.ficha.errorListaDestinatarios"));
            } else {
                this.showFail(this.translateService.instant("informesycomunicaciones.plantillasenvio.ficha.errorAsociar"));
                //console.log(error);
            }

        });
        this.getConsultas();
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
                idEnvio: this.body.idEnvio,
                idInstitucion: element.idInstitucion
            };
            this.eliminarArray.push(objEliminar);
        });
        this.sigaServices
            .post("enviosMasivos_desAsociarConsulta", this.eliminarArray)
            .subscribe(
                data => {
                    this.showSuccess(this.translateService.instant("informesYcomunicaciones.enviosMasivos.destinatarioListEnv.mensaje.borrar.consulta.ok"));
                    this.selectedDatos = [];
                },
                err => {
                    this.showFail(
                        this.translateService.instant("informesycomunicaciones.consultas.errorEliminarConsulta"));
                    //console.log(err);
                },
                () => {
                    this.getResultados();
                }
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

    onChangeConsultas(e) {
        let id = e.value;
        this.getFinalidad(id);
        this.getConsultaInstitucion(id);
        //console.log(id);
    }

    getConsultaInstitucion(id) {
        let comboConsultas = this.consultas;
        for (let dato of this.datos) {
            if (dato.idConsulta && dato.idConsulta != "" && dato.idConsulta == id) {
                dato.idConsulta = id;
                let continua = true;
                comboConsultas.forEach(element => {
                    if (continua && element.value == id) {
                        dato.idInstitucion = element.idInstitucion;
                        continua = false;
                    }
                });
            }
        }
        this.datos = [...this.datos];
    }

    getConsultasFiltro(filtro) {
        this.consultaBuscada = this.getLabelbyFilter(filtro);

        this.sigaServices
            .getParam("enviosMasivos_consultasDestDisp", "?filtro=" + filtro)
            .subscribe(
                data => {
                    this.consultas = data.consultas;

                    if (this.consultas != undefined || this.consultas.length == 0) {
                        this.resultadosConsultas = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
                    }
                    /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
						para poder filtrar el dato con o sin estos caracteres*/
						this.consultas.map(e => {
							let accents =
							"ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
							let accentsOut =
							"AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
							let i;
							let x;
							for (i = 0; i < e.label.length; i++) {
							if ((x = accents.indexOf(e.label[i])) != -1) {
								e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
								return e.labelSinTilde;
							}
							}
						});
                    // //console.log(this.consultas);
                },
                err => {
                    //console.log(err);
                    this.progressSpinner = false;
                },
                () => { }
            );
    }

    onChangeRowsPerPages(event) {
        this.selectedItem = event.value;
        this.changeDetectorRef.detectChanges();
        this.table.reset();
    }

    isSelectMultiple(selectedDatos) {
    
        if (this.selectedDatos != undefined) {
          if(this.selectedDatos.length == 1){
            // this.activacionEditar = true;
          }
          this.numSelected = this.selectedDatos.length;
        } else {
          this.selectedDatos = [];
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


    buscarConsultas(e) {
        if (e.target.value && e.target.value !== null) {
            if (e.target.value.length >= 3) {
                this.getConsultasFiltro(e.target.value);
            } else {
                this.consultas = [];
                this.resultadosConsultas = this.translateService.instant("formacion.busquedaCursos.controlFiltros.minimoCaracteres");
            }
        } else {
            this.consultas = [];
            this.resultadosConsultas = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
        }
    }
}
