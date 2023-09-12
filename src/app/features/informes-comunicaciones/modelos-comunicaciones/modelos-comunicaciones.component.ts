import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService, Message } from "primeng/components/common/api";
import { DataTable } from "primeng/datatable";
import { TranslateService } from "../../../commons/translate/translation.service";
import { ModelosComunicacionesItem } from "../../../models/ModelosComunicacionesItem";
import { SigaServices } from "../../../_services/siga.service";
import { CommonsService } from '../../../_services/commons.service';
export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-modelos-comunicaciones",
  templateUrl: "./modelos-comunicaciones.component.html",
  styleUrls: ["./modelos-comunicaciones.component.scss"],
  host: {
    "(document:keypress)": "onKeyPress($event)"
  }
})
export class ModelosComunicacionesComponent implements OnInit {
  permisoEscrituraFichaModelo;
  body: ModelosComunicacionesItem = new ModelosComunicacionesItem();
  bodySearch: ModelosComunicacionesItem = new ModelosComunicacionesItem();
  colegios: any[];
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
  msgs: Message[];
  clasesComunicaciones: any[];
  progressSpinner: boolean = false;
  institucionActual: string;
  preseleccionar: any = [];
  visible: any = [];
  fichaBusqueda: boolean = true;
  labelColegio: any; // = this.translateService.instant("informesYcomunicaciones.plantillasEnvios.modelos.porDefecto");
  isReload: boolean = false;
  anotherPage: boolean = false;

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
    this.commonsService.checkAcceso('30F').then( respuesta => {
      this.permisoEscrituraFichaModelo = respuesta;
    }).catch( error => console.log(error));
    sessionStorage.removeItem("esPorDefecto");
    this.bodySearch.visible = 1;
    // this.bodySearch.preseleccionar = "";
    sessionStorage.removeItem("crearNuevoModelo");
    sessionStorage.removeItem("soloLectura");

    this.selectedItem = 10;


    if (sessionStorage.getItem("esMenu")) {
      this.labelColegio = this.translateService.instant('informesYcomunicaciones.plantillasEnvios.modelos.porDefecto');
      localStorage.setItem("recoverLabel", JSON.stringify(this.labelColegio));
      this.getInstitucion();
    } else {
      let recoverLabel = localStorage.getItem("recoverLabel");
      this.labelColegio = JSON.parse(recoverLabel);
      this.getInstitucion();
    }

    this.getComboClases();
    // this.body.visible = true;

    this.preseleccionar = [
      { label: "No", value: "NO" },
      { label: "Sí", value: "SI" }
    ];

    this.visible = [
      { label: "No", value: 0 },
      { label: "Sí", value: 1 }

    ];

    this.cols = [
      {
        field: "claseComunicacion",
        header:
          "informesycomunicaciones.modelosdecomunicacion.clasecomunicaciones"
      },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "institucion",
        header: "censo.busquedaClientesAvanzada.literal.colegio"
      },
      { field: "orden", header: "administracion.informes.literal.orden" },
      {
        field: "preseleccionar",
        header: "administracion.informes.literal.preseleccionado",
        width: "ng e20%"
      },

      {
        field: "porDefecto",
        header: "informesycomunicaciones.modelosdecomunicacion.ficha.porDefecto"
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

  getComboColegios() {
    this.sigaServices.get("modelos_colegio").subscribe(
      n => {
        this.colegios = n.combooItems;
        if (this.institucionActual != "2000") {
          for (let e of this.colegios) {
            if (e.value == "2000") {
              e.value = "0";
              e.label = this.labelColegio;
            }
          }
        } else {
          this.colegios.unshift({ label: this.labelColegio, value: "0" });
        }

        // this.colegios.unshift({ label: "", value: "" });
        sessionStorage.removeItem("esMenu");
      },
      err => {
        //console.log(err);
      }
    );
  }

  getComboClases() {
    this.sigaServices.get("comunicaciones_claseComunicaciones").subscribe(
      n => {
        this.clasesComunicaciones = n.combooItems;
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
        this.clasesComunicaciones.map(e => {
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

      if(this.showHistorico){
        this.selectedDatos = this.datos.filter(dato => dato.fechaBaja != undefined && dato.fechaBaja != null)
        this.numSelected = this.selectedDatos.length;
      }else{
        this.selectedDatos = this.datos;
        this.numSelected = this.datos.length;
      }
      
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }


  buscar() {
    if (this.checkFilters()) {
      if (this.bodySearch.nombre != undefined) this.bodySearch.nombre = this.bodySearch.nombre.trim();
      this.showResultados = true;
      this.selectMultiple = false;
      this.selectedDatos = "";
      this.progressSpinner = true;
      
      sessionStorage.removeItem("modelosSearch");
      sessionStorage.removeItem("filtrosModelos");
      this.getResultados();
    }
  }

  checkFilters() {
    if (
      (this.bodySearch.idClaseComunicacion == undefined || this.bodySearch.idClaseComunicacion == "") &&
      (this.bodySearch.nombre == undefined || this.bodySearch.nombre == "") &&
      (this.bodySearch.idInstitucion == undefined || this.bodySearch.idInstitucion == "") &&
      (this.bodySearch.preseleccionar == undefined || this.bodySearch.preseleccionar == "") &&
      (this.bodySearch.visible == undefined || (this.bodySearch.visible != 1 && this.bodySearch.visible != 0))) {
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

  getResultados() {
    this.selectAll = false;
    let service = "modelos_search";
    if (this.showHistorico) {
      service = "modelos_search_historico";
    }
    this.progressSpinner = true;
    this.sigaServices
      .postPaginado(service, "?numPagina=1", this.bodySearch)
      .subscribe(
        data => {
          this.progressSpinner = false;
          let object = JSON.parse(data["body"]);
          this.datos = object.modelosComunicacionItem;
        },
        err => {
          this.showFail(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.errorResultados"
            )
          );
          //console.log(err);
        },
        () => {
          this.progressSpinner = false;
          this.table.reset();
          setTimeout(() => {
            this.commonsService.scrollTablaFoco('tablaFoco');
          }, 5);
        }
      );
  }

  getResultadosHistorico() {
    this.selectAll = false;
    this.progressSpinner = true;
    this.sigaServices
      .postPaginado("modelos_search_historico", "?numPagina=1", this.bodySearch)
      .subscribe(
        data => {
          this.progressSpinner = false;
          let object = JSON.parse(data["body"]);
          this.datos = object.modelosComunicacionItem;
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
          this.progressSpinner = false;
          this.table.reset();
        }
      );
  }

  isButtonDisabled() {
    if (this.body.nombre != "" && this.body.nombre != null) {
      return false;
    }
    return true;
  }

  getHistorico(key) {
    if (key == "visible") {
      this.showHistorico = true;
    } else if (key == "hidden") {
      this.showHistorico = false;
    }
    this.selectedDatos = [];
    this.getResultados();
  }

  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
      if (sessionStorage.getItem("filtrosModelos") == null) {
        this.bodySearch.idInstitucion = this.institucionActual;
      } else if (sessionStorage.getItem("filtrosModelos") != null) {
        this.bodySearch = JSON.parse(sessionStorage.getItem("filtrosModelos"));
        if (this.bodySearch == null) {
          this.bodySearch = new ModelosComunicacionesItem();
        } else {
          this.buscar();
        }
      }
      this.getComboColegios();
    });
  }

  onDuplicar(dato) {
    this.anotherPage = true;
    this.progressSpinner = true;

    let modelo = {
      idModeloComunicacion: this.selectedDatos[0].idModeloComunicacion,
      idInstitucion: this.selectedDatos[0].idInstitucion
    };

    this.sigaServices.post("modelos_duplicar", modelo).subscribe(
      data => {
        let idDuplicado = data.body;

        if (idDuplicado != null && idDuplicado != undefined) {
          this.sigaServices.post("modelos_searchModelo", idDuplicado).subscribe(
            data => {
              let modeloComunicacion: ModelosComunicacionesItem = new ModelosComunicacionesItem();
              modeloComunicacion = JSON.parse(data["body"]);

              this.progressSpinner = false;
              sessionStorage.setItem(
                "modelosSearch",
                JSON.stringify(modeloComunicacion)
              );
              sessionStorage.setItem(
                "filtrosModelos",
                JSON.stringify(this.bodySearch)
              );
              this.router.navigate(["/fichaModeloComunicaciones"]);
            },
            err => {
              this.showFail(
                this.translateService.instant(
                  "informesycomunicaciones.modelosdecomunicacion.errorDuplicado"
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
          this.showFail(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.errorDuplicado"
            )
          );
        }
        this.progressSpinner = false;
      },
      err => {
        this.showFail(
          this.translateService.instant(
            "informesycomunicaciones.modelosdecomunicacion.errorDuplicado"
          )
        );
        //console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.getResultados();
        this.progressSpinner = false;
      }
    );
  }

  onBorrar(dato) {
    this.confirmationService.confirm({
      message: this.translateService.instant("messages.deleteConfirmation"),
      icon: "fa fa-trash-alt",
      accept: () => {
        this.onConfirmarBorrar(dato);
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

  onConfirmarBorrar(dato) {
    if (!this.selectAll) {
      this.progressSpinner = true;
      this.sigaServices.post("modelos_borrar", dato).subscribe(
        data => {
          this.progressSpinner = false;

          this.showSuccess(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.correctBorrado"
            )
          );
        },
        err => {
          this.progressSpinner = false;
          let error = JSON.parse(err.error).description;
          if (error == "ultimo")
            this.showFail(
              this.translateService.instant(
                "censo.modelosComunicaciones.gestion.errorUltimoModelo"
              )
            );
          else {
            this.showFail(
              this.translateService.instant(
                "informesycomunicaciones.modelosdecomunicacion.errorBorrado"
              )
            );
            //console.log(err);
          }
        },
        () => {
          this.selectedDatos = [];
          this.getResultados();
        }
      );

      //let x = this.datos.indexOf(dato);
      //this.datos.splice(x, 1);
      // this.selectedDatos = [];
      // this.selectMultiple = false;
      // this.showSuccess(
      //   this.translateService.instant(
      //     "informesycomunicaciones.modelosdecomunicacion.correctBorrado"
      //   )
      // );
    } else {
      this.selectedDatos = [];
      this.showSuccess(
        this.translateService.instant(
          "informesycomunicaciones.modelosdecomunicacion.correctEliminadoDestinatarios"
        )
      );
    }
  }

  rehabilitar(dato) {
    this.confirmationService.confirm({
      message: this.translateService.instant(
        "general.message.confirmar.rehabilitacion"
      ),
      icon: "fa fa-check",
      accept: () => {
        this.confirmarRehabilitar(dato);
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

  confirmarRehabilitar(dato) {
    this.progressSpinner = true;
    this.sigaServices.post("modelos_rehabilitar", dato).subscribe(
      data => {
        this.progressSpinner = false;
        this.showSuccess(
          this.translateService.instant("general.message.rehabilitado")
        );
      },
      err => {
        this.showFail(
          this.translateService.instant("general.message.error.rehabilitado")
        );
        //console.log(err);
      },
      () => {
        this.getResultados();
        this.progressSpinner = false;
      }
    );

    //let x = this.datos.indexOf(dato);
    //this.datos.splice(x, 1);
    this.selectedDatos = [];
    this.selectMultiple = false;
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.buscar();
    }
  }

  navigateTo(dato) {
    this.anotherPage = true;
    let id = dato[0].id;
    this.body = dato[0];
    if (!this.selectMultiple) {
      sessionStorage.setItem("PermisoEscrituraFichaModelo", this.permisoEscrituraFichaModelo);

      if (dato[0].fechaBaja || !this.permisoEscrituraFichaModelo) {
        sessionStorage.setItem("soloLectura", "true");
      }

      if (
        dato[0].porDefecto == "SI") {
        sessionStorage.setItem("esPorDefecto", "SI");
      } else{
        sessionStorage.setItem("esPorDefecto", "NO");
      }

      if(this.permisoEscrituraFichaModelo != undefined){
        this.router.navigate(["/fichaModeloComunicaciones"]);
      sessionStorage.setItem("modelosSearch", JSON.stringify(this.body));
      sessionStorage.setItem("filtrosModelos", JSON.stringify(this.bodySearch));
      }
    }
  }

  addModelo() {
    this.anotherPage = true;
    this.router.navigate(["/fichaModeloComunicaciones"]);
    sessionStorage.removeItem("modelosSearch");
    sessionStorage.setItem("crearNuevoModelo", JSON.stringify("true"));
  }

  limpiar() {
    this.bodySearch = new ModelosComunicacionesItem();
    this.datos = [];
  }

  abreCierraFicha() {
    this.fichaBusqueda = !this.fichaBusqueda;
  }

  ngOnDestroy() {
    if (!this.anotherPage) {
      localStorage.removeItem("recoverLabel");
    }
  }
  clickRow(event) {
    if (event.data && !event.data.fechaBaja && this.showHistorico) {
      this.selectedDatos.pop();
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }
}
