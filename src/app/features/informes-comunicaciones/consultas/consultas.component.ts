import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  HostListener
} from "@angular/core";
import { DataTable } from "primeng/datatable";
import { ConsultasItem } from "../../../models/ConsultasItem";
import { ConsultasSearchItem } from "../../../models/ConsultasSearchItem";
import { ConsultasObject } from "../../../models/ConsultasObject";
import { CampoDinamicoItem } from "../../../models/CampoDinamicoItem";
import { TranslateService } from "../../../commons/translate/translation.service";
import { SigaServices } from "./../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { Router } from "@angular/router";
import { saveAs } from "file-saver/FileSaver";
import { ControlAccesoDto } from "../../../models/ControlAccesoDto";
import { CommonsService } from '../../../_services/commons.service';

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-consultas",
  templateUrl: "./consultas.component.html",
  styleUrls: ["./consultas.component.scss"],
  host: {
    "(document:keypress)": "onKeyPress($event)"
  }
})
export class ConsultasComponent implements OnInit {
  body: ConsultasItem = new ConsultasItem();
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  showResultados: boolean = false;
  progressSpinner: boolean = false;
  msgs: Message[];
  modulos: any[];
  objetivos: any[];
  clasesComunicaciones: any[];
  searchConsultas: ConsultasObject = new ConsultasObject();
  bodySearch: ConsultasSearchItem = new ConsultasSearchItem();
  eliminarArray: any[];
  duplicarArray: any[];
  selectedInstitucion: any;
  institucionActual: any;
  eliminar: boolean = false;
  fichaBusqueda: boolean = true;
  comboGenerica: any = [];

  valores: CampoDinamicoItem[];
  operadoresTexto: any[];
  operadoresNumero: any[];
  camposDinamicos: any[] = [];
  showValores: boolean = false;
  sentencia: string;

  idClaseComunicacion: String;
  currentRoute: String = "";

  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  permisosArray: any[];
  derechoAcceso: any;
  permisos: any;
  activacionEditar: boolean;
  historico: boolean = false;
  @ViewChild("table") table: DataTable;
  selectedDatos = [];


  constructor(
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.checkAcceso();
    this.currentRoute = this.router.url;

    sessionStorage.removeItem("esDuplicar");
    sessionStorage.removeItem("consultasSearch");
    sessionStorage.removeItem("idInstitucion");
    sessionStorage.removeItem("esPorDefecto");
    sessionStorage.removeItem("soloLectura");
    sessionStorage.removeItem("permisoModoLectura");

    this.getInstitucion();

    sessionStorage.removeItem("crearNuevaConsulta");

    this.getComboGenerica();
    this.getCombos();

    setTimeout(() => {
      this.recuperarBusqueda();
    }, 1);

    this.selectedItem = 10;

    this.cols = [
      {
        field: "modulo",
        header: "administracion.parametrosGenerales.literal.modulo"
      },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "objetivo",
        header: "informesycomunicaciones.consultas.objetivo"
      },
      {
        field: "claseComunicacion",
        header: "comunicaciones.literal.claseComunicaciones"
      },
      {
        field: "generica",
        header: "informesycomunicaciones.consultas.generica"
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

    this.valores = [];

    this.operadoresTexto = [
      {
        label: "=",
        value: "="
      },
      {
        label: "!=",
        value: "!="
      },
      {
        label: "IS NULL",
        value: "IS NULL"
      },
      {
        label: "LIKE",
        value: "LIKE"
      }
    ];

    this.operadoresNumero = [
      {
        label: "=",
        value: "="
      },
      {
        label: "!=",
        value: "!="
      },
      {
        label: ">",
        value: ">"
      },
      {
        label: ">=",
        value: ">="
      },
      {
        label: "<",
        value: "<"
      },
      {
        label: "<=",
        value: "<="
      },
      {
        label: "IS NULL",
        value: "IS NULL"
      }
    ];
  }

  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "30C";
    this.sigaServices.post("acces_control", this.controlAcceso).subscribe(
      data => {
        this.permisos = JSON.parse(data.body);
        this.permisosArray = this.permisos.permisoItems;
        this.derechoAcceso = this.permisosArray[0].derechoacceso;
      },
      err => {
        //console.log(err);
      },
      () => {
        if (this.derechoAcceso == 3) {
          this.activacionEditar = true;
        } else if (this.derechoAcceso == 2) {
          this.activacionEditar = false;
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
    );
  }

  recuperarBusqueda() {
    if (sessionStorage.getItem("filtrosConsulta") != null) {
      this.bodySearch = JSON.parse(sessionStorage.getItem("filtrosConsulta"));

      if (this.bodySearch == null) {
        this.bodySearch = new ConsultasSearchItem();
      } else {
        this.buscar(false);
      }
    } else {
      this.bodySearch.generica = "N";
      this.bodySearch.idClaseComunicacion = "5";
      this.bodySearch.permisoejecucion = true;
    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
    });
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

  getCombos() {
    this.sigaServices.get("consultas_claseComunicaciones").subscribe(
      data => {
        this.clasesComunicaciones = data.combooItems;
        // this.clasesComunicaciones.unshift({ label: "", value: "" });
      },
      err => {
        //console.log(err);
      }
    );
    this.sigaServices.get("consultas_comboObjetivos").subscribe(
      data => {
        this.objetivos = data.combooItems;
        // this.objetivos.unshift({ label: "", value: "" });
      },
      err => {
        //console.log(err);
      }
    ),
      this.sigaServices.get("consultas_comboModulos").subscribe(
        data => {
          this.modulos = data.combooItems;
          // this.modulos.unshift({ label: "", value: "" });
          /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
          this.modulos.map(e => {
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

            if (
              this.bodySearch.idModulo != undefined &&
              this.bodySearch.idModulo != ""
            ) {
            } else {
              // this.clasesComunicaciones = [];
              // this.clasesComunicaciones.unshift({ label: "", value: "" });
            }
          });
        },
        err => {
          //console.log(err);
        }
      );
  }

  RowsPerPages(event) {
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

  SelectAll() {
    if (this.selectAll === true) {
      //this.eliminar = true;
      this.selectMultiple = false;
      this.controlBtnEliminar(this.datos);

      if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechaBaja != undefined && dato.fechaBaja != null)
        this.numSelected = this.selectedDatos.length;
      } else {
        this.selectedDatos = this.datos;
        this.numSelected = this.datos.length;
      }

    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  controlBtnEliminar(array) {
    if (!this.activacionEditar) {
      this.eliminar = false;
    } else {
      if (this.institucionActual == 2000) {
        this.eliminar = true;
      } else {
        var keepGoing = true;

        array.forEach(element => {
          if (keepGoing) {
            if (element.generica == "No") {
              this.eliminar = true;
            } else {
              keepGoing = false;
            }
          }
        });

        if (!keepGoing) {
          this.eliminar = false;
        }
      }
    }
  }

  buscar(historico) {
    if (this.checkFilters()) {
      this.showResultados = true;
      this.selectMultiple = false;
      this.selectedDatos = [];
      this.progressSpinner = true;
      this.selectAll = false;
      sessionStorage.removeItem("consultasSearch");
      sessionStorage.removeItem("filtrosConsulta");
      this.getResultados(historico);
    }
  }

  checkFilters() {
    if (
      (this.bodySearch.idModulo == null || this.bodySearch.idModulo == "") &&
      (this.bodySearch.nombre == null || this.bodySearch.nombre == "") &&
      (this.bodySearch.descripcion == null ||
        this.bodySearch.descripcion == "") &&
      (this.bodySearch.idObjetivo == null ||
        this.bodySearch.idObjetivo == "") &&
      (this.bodySearch.idClaseComunicacion == null ||
        this.bodySearch.idClaseComunicacion == "")
    ) {
      this.showSearchIncorrect();
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.bodySearch.nombre != undefined) {
        this.bodySearch.nombre = this.bodySearch.nombre.trim();
      }
      if (this.bodySearch.descripcion != undefined) {
        this.bodySearch.descripcion = this.bodySearch.descripcion.trim();
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

  getResultados(historico) {
    this.historico = historico;
    this.bodySearch.historico = historico;
    this.sigaServices
      .postPaginado("consultas_search", "?numPagina=1", this.bodySearch)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.searchConsultas = JSON.parse(data["body"]);
          this.datos = this.searchConsultas.consultaItem;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.table.reset();
          setTimeout(() => {
            this.commonsService.scrollTablaFoco('tablaFoco');
          }, 5);
        }
      );
  }

  duplicar(dato) {
    sessionStorage.setItem("soloLectura", "false");
    sessionStorage.setItem("permisoModoLectura", "false");
    this.progressSpinner = true;
    this.sigaServices.post("consultas_duplicar", dato[0]).subscribe(
      data => {
        this.showSuccess(
          this.translateService.instant(
            "informesycomunicaciones.modelosdecomunicacion.correctDuplicado"
          )
        );
        sessionStorage.setItem(
          "consultasSearch",
          JSON.stringify(JSON.parse(data["body"]).consultaItem)
        );
        sessionStorage.setItem(
          "filtrosConsulta",
          JSON.stringify(this.bodySearch)
        );
        sessionStorage.setItem("esDuplicar", "true");
        this.progressSpinner = false;
        this.router.navigate(["/fichaConsulta"]);
      },
      err => {
        this.progressSpinner = false;
        this.showFail(
          this.translateService.instant(
            "informesycomunicaciones.consultas.errorDuplicado"
          )
        );
        //console.log(err);
      }
    );
  }

  borrar(dato) {
    this.confirmationService.confirm({
      // message: this.translateService.instant("messages.deleteConfirmation"),
      message:
        this.translateService.instant("messages.deleteConfirmation.much") +
        dato.length +
        " " +
        this.translateService.instant(
          "menu.informesYcomunicaciones.consultas"
        ) +
        "?",
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

  confirmarCancelar(dato) {
    this.progressSpinner = true;
    this.eliminarArray = [];
    dato.forEach(element => {
      let objEliminar = {
        idConsulta: element.idConsulta,
        idInstitucion: element.idInstitucion
      };
      this.eliminarArray.push(objEliminar);
    });
    this.sigaServices.post("consultas_borrar", this.eliminarArray).subscribe(
      data => {
        let noBorrar = JSON.parse(data["body"]).message;
        if (noBorrar == "noBorrar") {
          this.showInfo(
            this.translateService.instant(
              "informesycomunicaciones.consultas.noEliminaConsulta"
            )
          );
        } else {
          if (this.historico) {
            this.showSuccess(
              this.translateService.instant(
                "messages.activate.selected.success"
              )
            );
          } else {
            this.showSuccess(
              this.translateService.instant(
                "informesycomunicaciones.modelosdecomunicacion.ficha.correctConsultaEliminado"
              )
            );
          }
        }
      },
      err => {
        this.showFail(
          this.translateService.instant(
            "informesycomunicaciones.consultas.errorEliminarConsulta"
          )
        );
        //console.log(err);
      },
      () => {
        this.selectAll = false;
        this.progressSpinner = false;
        this.table.reset();
        this.buscar(this.historico);
      }
    );
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.buscar(false);
    }
  }

  navigateTo(dato) {
    sessionStorage.removeItem("servicioDetalle");
    if (
      dato[dato.length - 1].fechaBaja == null &&
      this.historico &&
      this.selectMultiple
    ) {
      dato.pop();
      // this.selectedDatos = [];
      this.table.reset();
      // this.table.re
      this.numSelected = 0;
    }
    if (!this.selectMultiple) {
       
      this.selectedInstitucion = dato[0].idInstitucion;
      if (
        (this.selectedInstitucion == this.institucionActual &&
          dato[0].generica == "No") ||
        (this.institucionActual == 2000 && dato[0].generica == "Si")
      ) {
        sessionStorage.setItem("consultasSearch", JSON.stringify(dato[0]));

        sessionStorage.setItem(
          "filtrosConsulta",
          JSON.stringify(this.bodySearch)
        );
        this.router.navigate(["/fichaConsulta"]);
      } else {
        this.router.navigate(["/fichaConsulta"]);
        sessionStorage.setItem("consultasSearch", JSON.stringify(dato[0]));
        sessionStorage.setItem(
          "filtrosConsulta",
          JSON.stringify(this.bodySearch)
        );
      }
    } else {
      this.controlBtnEliminar(dato);

      // if (
      //   (this.selectedInstitucion == this.institucionActual &&
      //     dato[0].generica == "No") ||
      //   (this.institucionActual == 2000 && dato[0].generica == "Si")
      // ) {
      //   this.eliminar = true;
      // } else {
      //   this.eliminar = false;
      // }
    }
    if (dato.length > 0) {
      if (
        (this.institucionActual != 2000 && dato[0].idInstitucion == "2000" && dato[0].generica == "Si") || !this.activacionEditar || dato[0].fechaBaja != undefined
      ) {
        sessionStorage.setItem("soloLectura", "true");
        sessionStorage.setItem("permisoModoLectura", "true");
      } else {
        sessionStorage.setItem("soloLectura", "false");
        sessionStorage.setItem("permisoModoLectura", "false");
      }
    }
    if (dato[0].fechaBaja) {
      sessionStorage.setItem("soloLectura", "true");
    }
  }

  addConsulta() {
    this.router.navigate(["/fichaConsulta"]);
    sessionStorage.removeItem("consultasSearch");
    sessionStorage.removeItem("servicioDetalle");
    sessionStorage.setItem("crearNuevaConsulta", JSON.stringify("true"));
  }

  limpiar() {
    this.bodySearch = new ConsultasSearchItem();
    //Por defecto a estos valores
    this.bodySearch.generica = "N";
    this.bodySearch.idClaseComunicacion = "5";
    this.bodySearch.permisoejecucion = true;
  }

  // comboClaseCom() {
  //   this.sigaServices.get("consultas_claseComunicacion").subscribe(
  //     data => {
  //       this.objetivos = data.combooItems;
  //       this.objetivos.unshift({ label: "", value: "" });
  //     },
  //     err => {
  //       //console.log(err);
  //     }
  //   ),
  // }

  // cargaComboClaseCom(event) {
  //   if (event != null) {
  //     this.bodySearch.idModulo = event.value;
  //   }
  //   this.sigaServices
  //     .getParam(
  //       "consultas_claseComunicacionesByModulo",
  //       "?idModulo=" + this.bodySearch.idModulo
  //     )
  //     .subscribe(
  //         data => {
  //           this.clasesComunicaciones = data.combooItems;
  //           this.clasesComunicaciones.unshift({ label: "", value: "" });
  //           /*creamos un labelSinTilde que guarde los labels sin caracteres especiales,
  // para poder filtrar el dato con o sin estos caracteres*/
  //           this.clasesComunicaciones.map(e => {
  //             let accents =
  //               "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
  //             let accentsOut =
  //               "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
  //             let i;
  //             let x;
  //             for (i = 0; i < e.label.length; i++) {
  //               if ((x = accents.indexOf(e.label[i])) != -1) {
  //                 e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
  //                 return e.labelSinTilde;
  //               }
  //             }
  //           });
  //         },
  //         err => {
  //           //console.log(err);
  //         }
  //       );
  //   }

  getComboGenerica() {
    this.comboGenerica = [
      { label: "No", value: "N" },
      { label: "Sí", value: "S" }
    ];
  }

  abreCierraFicha() {
    this.fichaBusqueda = !this.fichaBusqueda;
  }

  obtenerParametros(dato) {
    let consultaEjecutar = dato[0];
    this.sentencia = consultaEjecutar.sentencia;
    let consulta = {
      idClaseComunicacion: consultaEjecutar.idClaseComunicacion,
      sentencia: this.sentencia
    };

    this.sigaServices
      .post("consultas_obtenerCamposDinamicos", consulta)
      .subscribe(
        data => {
           
          this.valores = JSON.parse(data.body).camposDinamicos;
          if (
            this.valores != undefined &&
            this.valores != null &&
            this.valores.length > 0
          ) {
            this.valores.forEach(element => {
              if (
                element.valorDefecto != undefined &&
                element.valorDefecto != null
              ) {
                element.valor = element.valorDefecto;
              }
              if (element.valores != undefined && element.valores != null) {
                let empty = {
                  ID: 0,
                  DESCRIPCION: "Seleccione una opción..."
                };
                element.valores.unshift(empty);
              }
              if (element.operacion == "OPERADOR") {
                element.operacion = this.operadoresNumero[0].value;
              }
            });
            this.showValores = true;
          } else {
            this.ejecutar();
          }
        },
        error => {
          this.showFail(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.consulta.errorParametros"
            )
          );
        }
      );
  }

  ejecutar() {
    this.progressSpinner = true;

    this.camposDinamicos = JSON.parse(JSON.stringify(this.valores));

    if (
      this.camposDinamicos != null &&
      typeof this.camposDinamicos != "undefined"
    ) {
      this.camposDinamicos.forEach(element => {
        if (element.valor != undefined && typeof element.valor == "object") {
          element.valor = element.valor.ID;
        }
        if (element.ayuda == null || element.ayuda == "undefined") {
          element.ayuda = "-1";
        }
      });
    }

    let consultaEjecutar = {
      sentencia: this.sentencia,
      camposDinamicos: this.camposDinamicos
    };

    this.sigaServices
      .postDownloadFiles("consultas_ejecutarConsulta", consultaEjecutar)
      .subscribe(
        data => {
          this.showValores = false;
          if (data == null) {
            this.showInfo(
              this.translateService.instant(
                "informesYcomunicaciones.consultas.mensaje.sinResultados"
              )
            );
          } else {
            saveAs(data, "ResultadoConsulta.xlsx");
          }
        },
        error => {
          //console.log(error);
          this.progressSpinner = false;
          this.showFail(
            this.translateService.instant(
              "informesYcomunicaciones.consultas.mensaje.error.ejecutarConsulta"
            )
          );
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  validarCamposDinamicos() {
    let valido = true;
    this.valores.forEach(element => {
      if (valido) {
        if (!element.valorNulo) {
          if (
            element.valor != undefined &&
            element.valor != null &&
            element.valor != ""
          ) {
            valido = true;
          } else {
            valido = false;
          }
        } else {
          valido = true;
        }
      }
    });
    return valido;
  }

  navigateComunicar(selectedDatos) {
    sessionStorage.setItem("filtrosConsulta", JSON.stringify(this.bodySearch));
    sessionStorage.setItem("rutaComunicacion", this.currentRoute.toString());
    //IDMODULO de adminsitracion es 4
    sessionStorage.setItem("idModulo", "4");
    this.getDatosComunicar(selectedDatos);
  }

  getDatosComunicar(selectedDatos) {
    let dato = selectedDatos[0];
    sessionStorage.setItem("idInstitucion", dato.idInstitucion);
    let rutaClaseComunicacion = this.currentRoute.toString();
    sessionStorage.removeItem("datosComunicar");
    sessionStorage.setItem("idConsulta", dato.idConsulta);
    sessionStorage.setItem("idInstitucion", dato.idInstitucion);
    this.sigaServices
      .post("dialogo_claseComunicacion", rutaClaseComunicacion)
      .subscribe(
        data => {
          this.idClaseComunicacion = JSON.parse(
            data["body"]
          ).clasesComunicaciones[0].idClaseComunicacion;
          this.router.navigate(["/dialogoComunicaciones"]);
        },
        err => {
          //console.log(err);
        }
      );
  }

  setItalic(dato) {
    if (dato.fechaBaja == null) return false;
    else return true;
  }
  clickFila(event) {
    if (event.data && !event.data.fechaBaja && this.historico) {
      this.selectedDatos.pop();
    }
  }
}
