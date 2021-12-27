import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  HostListener
} from "@angular/core";
import { DataTable } from "primeng/datatable";
import { EnviosMasivosItem } from "../../../models/EnviosMasivosItem";
import { EnviosMasivosSearchItem } from "../../../models/EnviosMasivosSearchItem";
import { EnviosMasivosObject } from "../../../models/EnviosMasivosObject";
import { ProgramarItem } from "../../../models/ProgramarItem";
import { TranslateService } from "../../../commons/translate/translation.service";
import { SigaServices } from "./../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { Router } from "@angular/router";
import { esCalendar } from "../../../utils/calendar";
import { CommonsService } from '../../../_services/commons.service';
import { DatosBancariosComponent } from '../../censo/datosPersonaJuridica/datos-bancarios/datos-bancarios.component';
import { findIndex } from "rxjs/operator/findIndex";

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-envios-masivos",
  templateUrl: "./envios-masivos.component.html",
  styleUrls: ["./envios-masivos.component.scss"],
  host: {
    "(document:keypress)": "onKeyPress($event)"
  }
})
export class EnviosMasivosComponent implements OnInit {
  body: EnviosMasivosItem = new EnviosMasivosItem();
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  showResultados: boolean = false;
  msgs: Message[];
  tiposEnvio: any[];
  estados: any[];
  clasesComunicaciones: any[];
  es: any = esCalendar;
  showProgramar: boolean = false;
  bodyProgramar: ProgramarItem = new ProgramarItem();
  progressSpinner: boolean = false;
  searchEnviosMasivos: EnviosMasivosObject = new EnviosMasivosObject();
  programarArray: any[];
  bodySearch: EnviosMasivosSearchItem = new EnviosMasivosSearchItem();
  eliminarArray: any[];
  enviosArray: any[];
  currentDate: Date = new Date();
  estado: any;
  loaderEtiquetas: boolean = false;
  fichaBusqueda: boolean = true;

  @ViewChild("table") table: DataTable;
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
    sessionStorage.removeItem("crearNuevoEnvio");
    if (sessionStorage.getItem("ComunicacionDuplicada") != null) {
      this.buscar();
      sessionStorage.removeItem("ComunicacionDuplicada");
    }
    if (
      sessionStorage.getItem("filtrosEnvioMasivo") != null &&
      sessionStorage.getItem("filtrosEnvioMasivo") != "{}"
    ) {
      this.bodySearch = JSON.parse(
        sessionStorage.getItem("filtrosEnvioMasivo")
      );

      if (this.bodySearch == null) {
        this.bodySearch = new EnviosMasivosSearchItem();
      }

      this.bodySearch.fechaCreacion = this.bodySearch.fechaCreacion
        ? new Date(this.bodySearch.fechaCreacion)
        : null;
      this.bodySearch.fechaProgramacion = this.bodySearch.fechaProgramacion
        ? new Date(this.bodySearch.fechaProgramacion)
        : null;
      this.buscar();
    }

    this.getTipoEnvios();
    this.getEstadosEnvios();

    this.selectedItem = 10;

    this.cols = [
      {
        field: "descripcion",
        header: "administracion.parametrosGenerales.literal.descripcion"
      },
      {
        field: "fechaCreacion",
        header: "informesycomunicaciones.enviosMasivos.fechaCreacion"
      },
      {
        field: "fechaProgramada",
        header: "enviosMasivos.literal.fechaProgramacion"
      },
      {
        field: "tipoEnvio",
        header: "informesycomunicaciones.enviosMasivos.formaEnvio"
      },
      { field: "estadoEnvio", header: "enviosMasivos.literal.estado" }
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
  }

  getTipoEnvios() {
    this.sigaServices.get("enviosMasivos_tipo").subscribe(
      data => {
        this.tiposEnvio = data.combooItems;
        // this.tiposEnvio.unshift({ label: "Seleccionar", value: "" });
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
        this.tiposEnvio.map(e => {
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
      },
      err => {
        //console.log(err);
      }
    );
  }

  getEstadosEnvios() {
    this.sigaServices.get("enviosMasivos_estado").subscribe(
      data => {
        this.estados = data.combooItems;
        // this.estados.unshift({ label: "Seleccionar", value: "" });
      },
      err => {
        //console.log(err);
      }
    );
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
    this.estado = "";
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
    this.estado = "";
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
    if (this.selectedDatos.length > 0) {
      this.estado = this.selectedDatos[0].idEstado;
      for (let i in this.selectedDatos) {
        if (
          this.selectedDatos[i].idEstado == 2 ||
          this.selectedDatos[i].idEstado == 3 ||
          this.selectedDatos[i].idEstado == 6
        ) {
          this.estado = this.selectedDatos[i].idEstado;
        }
      }
    }
  }

  buscar() {
    if (this.table != undefined) {
      this.table.reset();
    }
    this.showResultados = true;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    sessionStorage.removeItem("enviosMasivosSearch");
    sessionStorage.removeItem("filtrosEnvioMasivo");
    if (sessionStorage.getItem("ComunicacionDuplicada") != null) {
      this.getResultadosComunicacionDuplicada();
      this.showSuccess(
        this.translateService.instant(
          "informesycomunicaciones.modelosdecomunicacion.correctDuplicado"
        )
      );
    } else {
      this.getResultados();
    }
  }

  getResultados() {
    this.sigaServices
      .postPaginado(
        "enviosMasivos_searchBusqueda",
        "?numPagina=1",
        this.bodySearch
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.searchEnviosMasivos = JSON.parse(data["body"]);
          this.datos = this.searchEnviosMasivos.enviosMasivosItem;
          this.datos.forEach(element => {
            if (element.fechaProgramada != null) {
              element.fechaProgramada = new Date(element.fechaProgramada);
            }
            element.fechaCreacion = new Date(element.fechaCreacion);
          });
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
          setTimeout(() => {
            this.commonsService.scrollTablaFoco('tablaFoco');
          }, 5);
        }
      );
  }
  getResultadosComunicacionDuplicada() {
    this.bodySearch = new EnviosMasivosSearchItem();
    this.bodySearch.fechaCreacion = new Date();
    this.sigaServices
      .postPaginado("enviosMasivos_search", "?numPagina=1", this.bodySearch)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.searchEnviosMasivos = JSON.parse(data["body"]);
          this.datos = this.searchEnviosMasivos.enviosMasivosItem;
          this.datos.forEach(element => {
            element.fechaProgramada = new Date(element.fechaProgramada);
            element.fechaCreacion = new Date(element.fechaCreacion);
          });
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => { }
      );
  }

  isButtonDisabled() {
    if (this.bodySearch.fechaCreacion != null) {
      return false;
    }
    return true;
  }

  cancelar(dato) {
    this.confirmationService.confirm({
      // message: this.translateService.instant("messages.deleteConfirmation"),
      message:
        this.translateService.instant(
          "informesycomunicaciones.consultas.mensajeSeguroCancelar"
        ) +
        " " +
        dato.length +
        " " +
        this.translateService.instant(
          "informesycomunicaciones.consultas.enviosSeleccionados"
        ),
      icon: "fa fa-trash-alt",
      accept: () => {
        this.confirmarCancelar(dato);
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

  obtenerDestinatarios(dato){
    this.progressSpinner = true;

    let envios = new EnviosMasivosObject();
    envios.enviosMasivosItem = dato;
    this.sigaServices.post("enviosMasivos_obtenerDestinatarios", envios).subscribe(
      data => {

        let datos = JSON.parse(data["body"]).enviosMasivosItem;

        datos.forEach(element => {
          
          let datoId = dato.findIndex(item => item.idEnvio === element.idEnvio);

          if( datoId != undefined && datoId > -1){
            dato[datoId].numDestinatarios = element.numDestinatarios;
          }
  
        });

        this.enviar(dato);
      },
      err => {
        this.progressSpinner = false;
        this.showFail("Error al comprobar los destinatarios");
      }
      );
  }

  enviar(dato) {
    this.progressSpinner = true;
    this.enviosArray = [];
    let estadoInvalido = false;
    let tieneDestiantarios = true;
    dato.forEach(element => {
      let objEnviar = {
        idEnvio: element.idEnvio
      };
      if (element.idEstado == 3 || element.idEstado == 6) {
        estadoInvalido = true;
      }
      if (element.numDestinatarios == 0) {
        tieneDestiantarios = false;
      }
      this.enviosArray.push(objEnviar);
    });

    if (!tieneDestiantarios) {
      this.showInfo(
        this.translateService.instant(
          "informesycomunicaciones.enviosMasivos.sinDestinatarios"
        )
      );
      this.progressSpinner = false;

    } else if (!estadoInvalido) {
      this.sigaServices
        .post("enviosMasivos_enviar", this.enviosArray)
        .subscribe(
          data => {
            this.showSuccess(
              this.translateService.instant(
                "informesycomunicaciones.enviosMasivos.envioRealizado"
              )
            );
            this.selectedDatos = [];
            this.buscar();
            this.table.reset();
          },
          err => {
            this.showFail(
              this.translateService.instant(
                "informesycomunicaciones.enviosMasivos.errorProcesar"
              )
            );
            //console.log(err);
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
          }
        );

    } else {
      this.showInfo(
        this.translateService.instant(
          "informesycomunicaciones.enviosMasivos.estadoIncorrecto"
        )
      );
      this.progressSpinner = false;
    }
  }

  confirmarCancelar(dato) {
    this.eliminarArray = [];
    let estadoInvalido = false;
    dato.forEach(element => {
      let objEliminar = {
        idEstado: element.idEstado,
        idEnvio: element.idEnvio,
        fechaProgramacion: new Date(element.fechaProgramada)
      };
      if (element.idEstado != 4 && element.idEstado != 1) {
        estadoInvalido = true;
      }
      this.eliminarArray.push(objEliminar);
    });

    if (!estadoInvalido) {
      this.sigaServices
        .post("enviosMasivos_cancelar", this.eliminarArray)
        .subscribe(
          data => {
            this.showSuccess(
              this.translateService.instant(
                "informesycomunicaciones.enviosMasivos.cancelCorrect"
              )
            );
          },
          err => {
            this.showFail(
              this.translateService.instant(
                "informesycomunicaciones.comunicaciones.mensaje.errorCancelarEnvio"
              )
            );
            //console.log(err);
          },
          () => {
            this.buscar();
            this.table.reset();
          }
        );
    } else {
      this.showInfo(
        this.translateService.instant(
          "informesycomunicaciones.enviosMasivos.estadoIncorrecto"
        )
      );
    }
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (
      event.keyCode === KEY_CODE.ENTER &&
      this.bodySearch.fechaCreacion != null
    ) {
      this.buscar();
    }
  }

  showButtons(datos) {
    if (this.estado == "") {
      this.estado = datos[0].idEstado;
    } else {
      this.estado = 1;
      for (let i in datos) {
        if (
          datos[i].idEstado == 2 ||
          datos[i].idEstado == 3 ||
          datos[i].idEstado == 6
        ) {
          this.estado = datos[i].idEstado;
        }
      }
    }
  }

  navigateTo(dato) {
    this.showButtons(dato);
    if (!this.selectMultiple && this.estado != 5) {
      // this.body.estado = dato[0].estado;
      this.progressSpinner = true;
      this.bodySearch.idEnvio = dato[0].idEnvio;
      this.sigaServices
        .postPaginado("enviosMasivos_search", "?numPagina=1", this.bodySearch)
        .subscribe(
          data => {
            this.progressSpinner = false;
            this.searchEnviosMasivos = JSON.parse(data["body"]);
            let datos = this.searchEnviosMasivos.enviosMasivosItem;
            sessionStorage.setItem(
              "enviosMasivosSearch",
              JSON.stringify(datos[0])
            );
            this.bodySearch.idEnvio = "";
            sessionStorage.setItem(
              "filtrosEnvioMasivo",
              JSON.stringify(this.bodySearch)
            );
            this.router.navigate(["/fichaRegistroEnvioMasivo"]);
          },
          err => {
            //console.log(err);
            this.progressSpinner = false;
          },
          () => { }
        );
    } else if (!this.selectMultiple && this.estado == 5) {
      this.progressSpinner = false;
      this.showInfo(
        this.translateService.instant(
          "informesycomunicaciones.enviosMasivos.envioProcess"
        )
      );
      this.selectedDatos = [];
    }
  }

  onShowProgamar(dato) {
    this.showProgramar = true;

    if (!this.selectMultiple) {
      this.bodyProgramar.fechaProgramada = dato[0].fechaProgramacion;
    }
  }

  programar(dato) {
    this.showProgramar = false;
    let estadoInvalido = false;
    dato.forEach(element => {
      if (element.idEstado == 4 || element.idEstado == 5) {
        estadoInvalido = true;
      }
    });
    if (!estadoInvalido) {
      dato.forEach(element => {
        element.fechaProgramada = new Date(this.bodyProgramar.fechaProgramada);
      });
      this.sigaServices.post("enviosMasivos_programar", dato).subscribe(
        data => {
          this.showSuccess(
            this.translateService.instant(
              "informesycomunicaciones.enviosMasivos.programCorrect"
            )
          );
        },
        err => {
          this.showFail(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.errorEnvio"
            )
          );
          //console.log(err);
        },
        () => {
          this.buscar();
          this.table.reset();
        }
      );
    } else {
      this.showInfo(
        this.translateService.instant(
          "informesycomunicaciones.modelosdecomunicacion.errorEstado"
        )
      );
    }
  }

  addEnvio() {
    sessionStorage.removeItem("enviosMasivosSearch");
    sessionStorage.setItem("crearNuevoEnvio", JSON.stringify("true"));
    sessionStorage.setItem(
      "filtrosEnvioMasivo",
      JSON.stringify(this.bodySearch)
    );
    this.router.navigate(["/fichaRegistroEnvioMasivo"]);
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
    this.bodySearch = new EnviosMasivosSearchItem();
    this.datos = [];
  }

  abreCierraFicha() {
    this.fichaBusqueda = !this.fichaBusqueda;
  }

  duplicar(dato) {
    let datoDuplicar = {
      idEnvio: dato[0].idEnvio,
      idTipoEnvios: dato[0].idTipoEnvios,
      idPlantillaEnvios: dato[0].idPlantillaEnvios
    };

    this.sigaServices.post("enviosMasivos_duplicar", datoDuplicar).subscribe(
      data => {
        this.showSuccess(
          this.translateService.instant(
            "informesycomunicaciones.modelosdecomunicacion.correctDuplicado"
          )
        );

        let datoDuplicado = JSON.parse(data["body"]).enviosMasivosItem;
        datoDuplicado.forEach(element => {
          if (element.fechaProgramada != null) {
            element.fechaProgramada = new Date(element.fechaProgramada);
          }
          element.fechaCreacion = new Date(element.fechaCreacion);
        });

        this.router.navigate(["/fichaRegistroEnvioMasivo"]);
        sessionStorage.setItem(
          "enviosMasivosSearch",
          JSON.stringify(datoDuplicado[0])
        );
        sessionStorage.setItem(
          "filtrosEnvioMasivo",
          JSON.stringify(this.bodySearch)
        );
      },
      err => {
        this.showFail(
          this.translateService.instant(
            "informesycomunicaciones.comunicaciones.mensaje.errorDuplicarEnvio"
          )
        );
        //console.log(err);
      }
    );
  }
  fillFechaCreacion(event) {
    this.bodySearch.fechaCreacion = event;
  }

  fillFechaProgramacion(event) {
    this.bodySearch.fechaProgramacion = event;
  }

  fillFechaProgramada(event) {
    this.bodyProgramar.fechaProgramada = event;
  }
}
