import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
  HostListener
} from "@angular/core";
import {
  Message,
  SelectItem,
  ConfirmationService
} from "primeng/components/common/api";
import { esCalendar } from "../../../utils/calendar";
import { SigaServices } from "../../../_services/siga.service";
import { SolicitudesModificacionItem } from "../../../models/SolicitudesModificacionItem";
import { TranslateService } from "../../../commons/translate/translation.service";
import { Router } from "@angular/router";
import { SolicitudesModificacionObject } from "../../../models/SolicitudesModificacionObject";
import { ComboItem } from "../../../models/ComboItem";
import { StringObject } from "../../../models/StringObject";
import { CommonsService } from '../../../_services/commons.service';
import { ControlAccesoDto } from '../../../models/ControlAccesoDto';

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-solicitudes-modificacion",
  templateUrl: "./solicitudes-modificacion.component.html",
  styleUrls: ["./solicitudes-modificacion.component.scss"]
})
export class SolicitudesModificacionComponent implements OnInit {
  showCard: boolean = true;
  isLetrado: boolean;
  isSearch: boolean = false;
  displayGeneralRequest: boolean = false;
  disableButton: boolean = false;
  disableNew: boolean = true;
  isNew: boolean = false;
  progressSpinner: boolean = false;
  selectMultiple: boolean = false;
  selectAll: boolean = false;
  showSelectAll: boolean = false;
  numSelected: number = 0;
  desactivaProcesarMultiple: boolean = false;
  desactivarNuevo: boolean = false;
  tipo: SelectItem[];
  tipoSolGeneral: SelectItem[];
  estado: SelectItem[];

  msgs: any;
  es: any = esCalendar;

  tipoModificacionSolGeneral: String;
  motivoSolGeneral: String;
  resultado: String;
  tarjeta: String;
  bodySearch: SolicitudesModificacionObject = new SolicitudesModificacionObject();
  bodyMultiple: any = [];
  bodyMultipleEspecifica: any = [];
  bodyMultipleGeneral: any = [];
  body: SolicitudesModificacionItem = new SolicitudesModificacionItem();

  nifCif: StringObject = new StringObject();

  @ViewChild("table")
  table;
  selectedDatos = [];
  cols: any = [];
  rowsPerPage: any = [];
  data: any[] = [];
  index = 0;
  selectedItem: number = 10;
  especificasCorrectas: boolean = false;
  mostrarAuditoria: boolean = false;
  showGuardarAuditoria: boolean = false;
  displayAuditoria: boolean = false;

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    // Comprobamos si es colegiado o no
    this.getLetrado();
    this.checkAcceso();

    // Llamada al rest de tipo modificación
    this.sigaServices.get("solicitudModificacion_tipoModificacion").subscribe(
      n => {
        this.tipo = n.combooItems;
        this.tipoSolGeneral = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );
    // Llamada al rest de estado
    this.sigaServices.get("solicitudModificacion_estado").subscribe(
      n => {
        this.estado = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );

    this.getDataTable();

    if (sessionStorage.getItem("saveFilters") != null) {
      this.body = JSON.parse(sessionStorage.getItem("saveFilters"));

      if (this.body.fechaDesde != null) {
        this.body.fechaDesde = new Date(this.body.fechaDesde);
      }

      if (this.body.fechaHasta != null) {
        this.body.fechaHasta = new Date(this.body.fechaHasta);
      }

      if (sessionStorage.getItem("processingPerformed") == "true") {
        this.body = JSON.parse(sessionStorage.getItem("saveFilters"));
        this.isSearch = true;

        if (this.body.fechaDesde != null) {
          this.body.fechaDesde = new Date(this.body.fechaDesde);
        }

        if (this.body.fechaHasta != null) {
          this.body.fechaHasta = new Date(this.body.fechaHasta);
        }

        sessionStorage.removeItem("processingPerformed");
      } else {
        if (sessionStorage.getItem("search") != null) {
          this.isSearch = true;
          this.data = JSON.parse(sessionStorage.getItem("search"));
          sessionStorage.removeItem("search");
        }
      }
      sessionStorage.removeItem("saveFilters");
      this.search();

    } else {
      if (sessionStorage.getItem("search") != null) {
        this.isSearch = true;
        this.data = JSON.parse(sessionStorage.getItem("search"));
        sessionStorage.removeItem("search");
        sessionStorage.removeItem("saveFilters");
      }
    }

    this.obtenerMostrarAuditoria();
  }

  onHideCard() {
    this.showCard = !this.showCard;
  }

  getDataTable() {
    this.cols = [
      {
        field: "estado",
        header: "censo.busquedaSolicitudesModificacion.literal.estado",
        width: "10%"
      },
      {
        field: "numIdSolicitud",
        header: "censo.resultadosSolicitudesModificacion.literal.idSolicitud",
        width: "10%"
      },
      {
        field: "tipoModificacion",
        header: "censo.resultadosSolicitudesTextoLibre.literal.tipoModificacion",
        width: "10%"
      },
      {
        field: "numColegiado",
        header: "censo.resultadosSolicitudesModificacion.literal.nColegiado",
        width: "10%"
      },
      {
        field: "nombre",
        header: "censo.resultadosSolicitudesModificacion.literal.Nombre",
        width: "10%"
      },
      {
        field: "fechaAlta",
        header: "censo.resultadosSolicitudesModificacion.literal.fecha",
        width: "10%"
      },
      {
        field: "motivo",
        header: "censo.resultadosSolicitudesModificacion.literal.descripcion",
        width: "40%"
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

  // Métodos botones del filtro
  checkIfUserExitsAsAMember(nifCif) {
    this.progressSpinner = true;

    this.sigaServices
      .post("solicitudModificacion_verifyPerson", nifCif)
      .subscribe(
        data => {
          this.resultado = data.valor;

          if (this.resultado == "existe") {
            this.desactivarNuevo = false;
          } else {
            this.desactivarNuevo = true;
          }

          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
        }
      );
  }

  newElement() {
    this.selectedDatos = [];
    this.sigaServices.get("solicitudModificacion_tipoModificacion").subscribe(
      n => {
        this.tipoSolGeneral = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );
    this.tipoModificacionSolGeneral = null;
    this.motivoSolGeneral = null;
    this.displayGeneralRequest = true;
    this.isNew = true;
    this.disableNew = false;
  }

  // SEARCH
  search() {

    if (this.checkFilters()) {
      // Vamos a guardar los filtros para cuando vuelva
      if (this.body.estado == "10") {
        this.showSelectAll = true;
        this.selectAll = false;
      } else {
        this.showSelectAll = false;
        this.selectAll = false;
      }
      if (
        (this.body.tipoModificacion == null &&
          this.body.tipoModificacion == undefined) ||
        this.body.tipoModificacion == ""
      ) {
        this.searchRequest("solicitudModificacion_searchModificationRequest");
      } else if (this.body.tipoModificacion == "10") {
        this.searchRequest("solicitudModificacion_searchSolModifDatosGenerales");
      } else if (this.body.tipoModificacion == "20") {
        this.searchRequest("solicitudModificacion_searchSolModif");
      } else if (this.body.tipoModificacion == "30") {
        this.searchRequest("solicitudModificacion_searchSolModifDatosDirecciones");
      } else if (this.body.tipoModificacion == "35") {
        this.searchRequest("solicitudModificacion_searchSolModifDatosUseFoto");
      } else if (this.body.tipoModificacion == "60") {
        this.searchRequest("solicitudModificacion_searchSolModifDatosCambiarFoto");
      } else if (this.body.tipoModificacion == "40") {
        this.searchRequest("solicitudModificacion_searchSolModifDatosBancarios");
      } else if (this.body.tipoModificacion == "50") {
        this.searchRequest(
          "solicitudModificacion_searchSolModifDatosCurriculares"
        );
      } else if (this.body.tipoModificacion == "70") {
        this.searchRequest(
          "solicitudModificacion_searchSolModifDatosFacturacion"
        );
      } else if (this.body.tipoModificacion == "80") {
        this.searchRequest("solicitudModificacion_searchSolModif");
      } else if (this.body.tipoModificacion == "90") {
        this.searchRequest(
          "solicitudModificacion_searchSolModifDatosExpedientes"
        );
      } else if (this.body.tipoModificacion == "99") {
        this.searchRequest("solicitudModificacion_searchSolModif");
      }
    }

  }

  getLetrado() {
    if (JSON.parse(sessionStorage.getItem("isLetrado")) == true) {
      this.isLetrado = true;
      // Comprobamos si existe en la tabla cen_colegiado
      this.nifCif.valor = "";
      this.checkIfUserExitsAsAMember(this.nifCif);
    } else {
      this.isLetrado = false;
    }
  }

  searchRequest(path: string) {
    this.progressSpinner = true;
    this.isSearch = true;

    this.sigaServices.postPaginado(path, "?numPagina=1", this.body).subscribe(
      data => {
        this.bodySearch = JSON.parse(data["body"]);
        this.data = this.bodySearch.solModificacionItems;
        this.progressSpinner = false;
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

  // PROCESS REQUEST AND DENY REQUEST
  processMultipleRequest() {
    this.bodyMultiple = this.selectedDatos;

    this.updateRequestState(
      "solicitudModificacion_processGeneralModificationRequest"
    );
  }

  denyMultipleRequest(selectedDatos) {
    this.bodyMultiple = selectedDatos;
    this.updateRequestState(
      "solicitudModificacion_denyGeneralModificationRequest"
    );
  }
  separatetypeBodys() {
    this.bodyMultipleEspecifica = [];
    this.bodyMultipleGeneral = [];
    this.bodyMultiple.forEach(element => {
      if (element.especifica == "1") {
        this.bodyMultipleEspecifica.push(element);
      } else {
        this.bodyMultipleGeneral.push(element);
      }
    });
  }
  updateRequestState(path: string) {
    this.progressSpinner = true;
    this.isSearch = true;
    this.separatetypeBodys();
    if (this.bodyMultipleGeneral.length > 0) {
      this.sigaServices.post(path, this.bodyMultipleGeneral).subscribe(
        data => {
          if (this.mostrarAuditoria) {
            this.selectedDatos.forEach(element => {
              let motivoBackup = element.motivo;
              element.motivo = this.body.motivo;

              this.sigaServices
                .post("solicitudModificacion_insertAuditoria", element)
                .subscribe(
                  data => {
                    this.progressSpinner = false;
                    this.search();

                    this.showSuccess();
                    this.search();
                  },
                  err => {
                    this.progressSpinner = false;
                    this.showFail();
                  },
                  () => {
                    this.cerrarAuditoria();
                  }
                );

              this.body.motivo = motivoBackup;
            });
            this.cerrarAuditoria();
          }
        },
        err => {
          this.progressSpinner = false;
          this.showFail();
        },
        () => {
          this.progressSpinner = false;
          this.selectMultiple = false;
          this.closeDialog();
        }
      );
    }
    if (this.bodyMultipleEspecifica.length > 0) {
      this.index = 1;
      if (path == "solicitudModificacion_denyGeneralModificationRequest") {
        this.bodyMultipleEspecifica.forEach(element => {
          let pathSpecifica;
          if (element.idTipoModificacion == "10") {
            pathSpecifica = "solicitudModificacion_denySolModifDatosGenerales";
          } else if (element.idTipoModificacion == "30") {
            pathSpecifica =
              "solicitudModificacion_denySolModifDatosDirecciones";
          } else if (element.idTipoModificacion == "35") {
            pathSpecifica = "solicitudModificacion_denySolModifDatosUseFoto";
          } else if (element.idTipoModificacion == "40") {
            pathSpecifica = "solicitudModificacion_denySolModifDatosBancarios";
          } else if (element.idTipoModificacion == "50") {
            pathSpecifica =
              "solicitudModificacion_denySolModifDatosCurriculares";
          } else if (element.idTipoModificacion == "60") {
            pathSpecifica =
              "solicitudModificacion_denySolModifDatosCambiarFoto";
          }

          this.especificasCorrectas = false;
          this.sigaServices.post(pathSpecifica, element).subscribe(
            data => {
              if (this.index == this.bodyMultipleEspecifica.length) {
                if (this.mostrarAuditoria) {
                  let motivoBackup = element.motivo;
                  element.motivo = this.body.motivo;

                  this.sigaServices
                    .post("solicitudModificacion_insertAuditoria", element)
                    .subscribe(
                      data => {
                        this.progressSpinner = false;
                        this.search();

                        this.showSuccess();
                        this.search();
                      },
                      err => {
                        this.progressSpinner = false;
                        this.showFail();
                      },
                      () => {
                        this.cerrarAuditoria();
                      }
                    );

                  this.body.motivo = motivoBackup;

                  this.cerrarAuditoria();
                }
              } else {
                this.index++;
              }
            },
            err => {
              if (this.index != this.bodyMultipleEspecifica.length) {
                this.index++;
              }
            },
            () => {
              if (this.index == this.bodyMultipleEspecifica.length) {
                this.progressSpinner = false;
                this.selectMultiple = false;
                this.closeDialog();
                this.search();
              }
            }
          );
        });
      } else {
        this.index = 1;
        this.bodyMultipleEspecifica.forEach(element => {
          let pathSpecifica;
          if (element.idTipoModificacion == "10") {
            pathSpecifica =
              "solicitudModificacion_processSolModifDatosGenerales";
          } else if (element.idTipoModificacion == "30") {
            pathSpecifica =
              "solicitudModificacion_processSolModifDatosDirecciones";
          } else if (element.idTipoModificacion == "35") {
            pathSpecifica = "solicitudModificacion_processSolModifDatosUseFoto";
          } else if (element.idTipoModificacion == "40") {
            pathSpecifica =
              "solicitudModificacion_processSolModifDatosBancarios";
          } else if (element.idTipoModificacion == "50") {
            pathSpecifica =
              "solicitudModificacion_processSolModifDatosCurriculares";
          } else if (element.idTipoModificacion == "60") {
            pathSpecifica =
              "solicitudModificacion_processSolModifDatosCambiarFoto";
          }
          this.especificasCorrectas = false;
          this.sigaServices.post(pathSpecifica, element).subscribe(
            data => {
              if (this.index == this.bodyMultipleEspecifica.length) {
                if (this.mostrarAuditoria) {
                  let motivoBackup = element.motivo;
                  element.motivo = this.body.motivo;

                  this.sigaServices
                    .post("solicitudModificacion_insertAuditoria", element)
                    .subscribe(
                      data => {
                        this.progressSpinner = false;
                        this.search();

                        this.showSuccess();
                        this.search();
                      },
                      err => {
                        this.progressSpinner = false;
                        this.showFail();
                      },
                      () => {
                        this.cerrarAuditoria();
                      }
                    );

                  this.body.motivo = motivoBackup;
                  this.cerrarAuditoria();
                }
              } else {
                this.index++;
              }
            },
            err => {
              if (this.index != this.bodyMultipleEspecifica.length) {
                this.index++;
              }
            },
            () => {
              if (this.index == this.bodyMultipleEspecifica.length) {
                this.progressSpinner = false;
                this.selectMultiple = false;
                this.closeDialog();
                this.search();
              }
            }
          );
        });
      }
    }
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.data;
      this.numSelected = this.data.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
    }
  }

  restore() {
    this.body.tipoModificacion = "";
    this.body.estado = "";
    this.body.fechaDesde = null;
    this.body.fechaHasta = null;
    sessionStorage.removeItem("saveFilters");
  }

  // Métodos gestionar tabla
  enablePagination() {
    if (!this.data || this.data.length == 0) return false;
    else return true;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onSelectRow(selectedDatos) {
    if (selectedDatos[0].especifica == "1") {
      sessionStorage.setItem("saveFilters", JSON.stringify(this.body));
      sessionStorage.setItem("search", JSON.stringify(this.data));
      sessionStorage.setItem("rowData", JSON.stringify(selectedDatos[0]));
      sessionStorage.setItem("isLetrado", JSON.stringify(this.isLetrado));
      this.router.navigate(["/nuevaSolicitudesModificacion"]);
    } else {
      // abrir popup MODO CONSULTA
      this.displayGeneralRequest = true;
      this.isNew = false;
      this.disableNew = true;

      // Rellenamos los datos
      this.tipoModificacionSolGeneral = selectedDatos[0].tipoModificacion;
      this.tipoSolGeneral = [
        {
          label: selectedDatos[0].tipoModificacion,
          value: selectedDatos[0].idTipoModificacion
        }
      ];

      this.motivoSolGeneral = selectedDatos[0].motivo;

      if (selectedDatos[0].estado == "PENDIENTE" && !this.isLetrado) {
        this.disableButton = false;
      } else {
        this.disableButton = true;
      }
    }
  }

  procesar(selectedDatos) {
    if (
      // selectedDatos[selectedDatos.length - 1].especifica == "1" ||
      selectedDatos[selectedDatos.length - 1].estado != "PENDIENTE"
    ) {
      this.selectedDatos.splice(selectedDatos.length - 1, 1);
    }
  }

  // POPUP
  closeDialog() {
    this.displayGeneralRequest = false;

    if (this.isNew) {
      this.tipoModificacionSolGeneral = null;
      this.motivoSolGeneral = null;
    }
  }

  validateButton() {
    if (
      this.tipoModificacionSolGeneral != null &&
      this.tipoModificacionSolGeneral != undefined &&
      this.motivoSolGeneral != null &&
      this.motivoSolGeneral != undefined
    ) {
      return false;
    } else {
      return true;
    }
  }

  saveData() {
    this.progressSpinner = true;

    this.body.idTipoModificacion = this.tipoModificacionSolGeneral;
    this.body.motivo = this.motivoSolGeneral;
    this.sigaServices
      .post("solicitudModificacion_insertGeneralModificationRequest", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.body.tipoModificacion = this.body.idTipoModificacion;
          this.search();
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.closeDialog();
          this.isNew = false;
        }
      );
  }

  // Control de fechas
  getFechaHastaCalendar() {
    let fechaReturn: Date;
    if (
      this.body.fechaHasta != undefined &&
      this.body.fechaHasta != undefined
    ) {
      let one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      let fechaDesde = new Date(this.body.fechaHasta).getTime();
      let fechaHasta = new Date(this.body.fechaHasta).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechaReturn = undefined;
      else fechaReturn = new Date(this.body.fechaHasta);
    }

    return fechaReturn;
  }

  getFechaDesdeCalendar() {
    let fechaReturn: Date;

    if (
      this.body.fechaDesde != undefined &&
      this.body.fechaDesde != null
    ) {
      let one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      let fechaDesde = new Date(this.body.fechaDesde).getTime();
      let fechaHasta = new Date(this.body.fechaDesde).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechaReturn = undefined;
      else fechaReturn = new Date(this.body.fechaDesde);
      // this.body.fechaDesde.setDate(this.body.fechaDesde.getDate() + 1);
      // this.body.fechaDesde = new Date(this.body.fechaDesde.toString());
    }

    return fechaReturn;
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  clear() {
    this.msgs = [];
  }
  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "01";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjeta = permisosArray[0].derechoacceso;
      },
      err => {
        //console.log(err);
      },
      () => {
        // if (this.tarjeta == "3" || this.tarjeta == "2") {
        //   let permisos = "registrales";
        //   this.permisosEnlace.emit(permisos);
        // }
      }
    );
  }
  obtenerMostrarAuditoria() {
    let parametro = {
      valor: "OCULTAR_MOTIVO_MODIFICACION"
    };

    this.sigaServices
      .post("busquedaPerJuridica_parametroColegio", parametro)
      .subscribe(
        data => {
          let parametroOcultarMotivo = JSON.parse(data.body);
          if (parametroOcultarMotivo.parametro == "S" || parametroOcultarMotivo.parametro == "s") {
            this.mostrarAuditoria = false;
          } else if (parametroOcultarMotivo.parametro == "N" || parametroOcultarMotivo.parametro == "n") {
            this.mostrarAuditoria = true;
          } else {
            this.mostrarAuditoria = undefined;
          }
        },
        err => {
          //console.log(err);
        }
      );
  }

  comprobarAuditoria() {
    // mostrar la auditoria depende de un parámetro que varía según la institución
    this.body.motivo = undefined;

    if (!this.mostrarAuditoria) {
      this.processMultipleRequest();
    } else {
      this.displayAuditoria = true;
      this.showGuardarAuditoria = false;
    }
  }

  cerrarAuditoria() {
    this.displayAuditoria = false;
  }

  comprobarCampoMotivo() {
    if (
      this.body.motivo != undefined &&
      this.body.motivo != "" &&
      this.body.motivo.trim() != ""
    ) {
      this.showGuardarAuditoria = true;
    } else {
      this.showGuardarAuditoria = false;
    }
  }

  fillFechaDesde(event) {
    this.body.fechaDesde = event;
  }

  fillFechaHasta(event) {
    this.body.fechaHasta = event;
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.search();
    }
  }

  checkFilters() {
    if (
      !this.body.tipoModificacion &&
      !this.body.estado &&
      !this.body.fechaDesde &&
      !this.body.fechaHasta
    ) {
      this.showSearchIncorrect();
      this.progressSpinner = false;
      return false;
    } else {
      return true;
    }
  }


  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
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

}
