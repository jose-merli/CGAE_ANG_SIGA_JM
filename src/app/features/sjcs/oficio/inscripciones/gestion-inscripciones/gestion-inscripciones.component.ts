import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { ModulosItem } from '../../../../../models/sjcs/ModulosItem';
import { UpperCasePipe, DatePipe } from '../../../../../../../node_modules/@angular/common';
import { PartidasObject } from '../../../../../models/sjcs/PartidasObject';
import { findIndex } from 'rxjs/operators';
import { MultiSelect, SortEvent, DataTable } from 'primeng/primeng';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { TurnosObject } from '../../../../../models/sjcs/TurnosObject';
import { DatosDireccionesObject } from '../../../../../models/DatosDireccionesObject';
import { DatosDireccionesItem } from '../../../../../models/DatosDireccionesItem';
import { InscripcionesObject } from '../../../../../models/sjcs/InscripcionesObject';
import { InscripcionesItems } from '../../../../../models/sjcs/InscripcionesItems';
import { CommonsService } from '../../../../../_services/commons.service';
import { ConfirmationService } from '../../../../../../../node_modules/primeng/primeng';
import { TurnosItems } from '../../../../../models/sjcs/TurnosItems';
import { SigaStorageService } from '../../../../../siga-storage.service';


@Component({
  selector: 'app-gestion-inscripciones',
  templateUrl: './gestion-inscripciones.component.html',
  styleUrls: ['./gestion-inscripciones.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TablaInscripcionesComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  colsPartidoJudicial;
  msgs;
  partidoJudicial;
  id;
  bodyDirecciones: DatosDireccionesItem;
  datosInicial = [];
  editMode: boolean = false;
  selectedBefore;
  buscadores = [];
  updatePartidasPres = [];
  disabledSolicitarBaja: boolean = false;
  disabledValidar: boolean = false;
  disabledDenegar: boolean = false;
  disabledCambiarFecha: boolean = false;
  body;
  partidasJudiciales: any[] = [];
  selectedItem: number = 10;
  selectAll;
  selectedDatos: any[] = [];
  numSelected = 0;
  isLetrado: boolean = false;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;
  sortO: number = 1;
  message;
  public ascNumberSort = true;
  permisos: boolean = false;
  initDatos;
  nuevo: boolean = false;
  progressSpinner: boolean = false;
  selectionMode: string = "single";
  first = 0;
  datosContacto: any;
  //Resultados de la busqueda
  @Input() datos;

  //Combo partidos judiciales
  comboPJ;

  @Output() searchPartidas = new EventEmitter<boolean>();
  datosDirecciones: DatosDireccionesItem[] = [];
  @ViewChild("table") tabla: DataTable;
  rows: any;
  sort: (compareFn?: (a: any, b: any) => number) => any[];
  searchDireccionIdPersona = new DatosDireccionesObject();
  checkValidarInscripciones: boolean = false;
  currentRoute: String;
  idClasesComunicacionArray: string[] = [];
  idClaseComunicacion: String;
  keys: any[] = [];

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private confirmationService: ConfirmationService,
    private localStorageService: SigaStorageService,
    private datepipe: DatePipe,
  ) { }

  ngOnInit() {
    this.currentRoute = this.router.url;
    this.isLetrado = this.localStorageService.isLetrado;
    this.selectedDatos = [];
    this.datos.fechaActual = new Date();
    this.getCols();
    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
    if (this.persistenceService.getPaginacion() != undefined) {
      let paginacion = this.persistenceService.getPaginacion();
      this.first = paginacion.paginacion;
      this.selectedItem = paginacion.selectedItem;
    }
    setTimeout(() => {
      this.commonsService.scrollTablaFoco('tablaFoco');
    }, 5);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.historico == false) {
      this.selectMultiple = false;
      this.selectionMode = "single"
    }
    this.datos.fechaActual = new Date();
    this.selectedDatos = [];
    this.updatePartidasPres = [];
    this.nuevo = false;
    if (this.persistenceService.getPermisos()) {
      this.permisos = true;
    } else {
      this.permisos = false;
    }
    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode >= 44 && charCode <= 57) {
      return true;
    }
    else {
      return false;
    }

  }

  edit(evento) {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = [];
    }
    if (!this.nuevo && this.permisos) {

      if (!this.selectAll && !this.selectMultiple && !this.historico) {

        this.datos.forEach(element => {
          element.editable = false;
          element.overlayVisible = false;
        });

        evento.data.editable = true;
        this.editMode = true;

        if (evento.data.estado != 0 || evento.data.estado != 2) this.disabledDenegar = true;

        this.selectedDatos = [];
        this.selectedDatos.push(evento.data);

        let findDato = this.datosInicial.find(item => item.nombrepartida === this.selectedDatos[0].nombrepartida && item.descripcion === this.selectedDatos[0].descripcion && item.importepartida === this.selectedDatos[0].importepartida);

        this.selectedBefore = findDato;
      } else {
        if ((evento.data.fechabaja == null || evento.data.fechabaja == undefined) && this.historico) {
          if (this.selectedDatos[0] != undefined) {
            this.selectedDatos.pop();
          } else {
            this.selectedDatos = [];
          }
        }

      }

    }
  }

  mySort(event: any, field: string) {
    if (event.order === 1) {
      this.rows.sort((a, b) => {
        if (typeof a[field] === 'string') {
          const sortDesc = a[field] < b[field] ? -1 : 0;
          return a[field] > b[field] ? 1 : sortDesc;
        }
        return a[field] - b[field];
      });
    } else {
      this.rows.sort((a, b) => {
        if (typeof a[field] === 'string') {
          const sortDesc = a[field] < b[field] ? 1 : 0;
          return a[field] > b[field] ? -1 : sortDesc;
        }
        return b[field] - a[field];
      });
    }
    this.rows = [...this.rows];
  }

  getId() {
    let seleccionados = [];
    seleccionados.push(this.selectedDatos);
    this.id = this.datos.findIndex(item => item.idpartidapresupuestaria === seleccionados[0].idpartidapresupuestaria);
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

  fillFechaCalendar(event) {
    this.datos.fechaActual = this.transformaFecha(event);
    this.actualizaBotones(this.selectedDatos);
  }

  callSaveService(url) {
    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (this.nuevo) {
          this.nuevo = false;
        }

        this.datosInicial = JSON.parse(JSON.stringify(this.datos));
        this.searchPartidas.emit(false);
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

        this.progressSpinner = false;
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
        this.selectedDatos = [];
        this.updatePartidasPres = [];
        this.progressSpinner = false;
      }
    );

  }


  save() {
    this.progressSpinner = true;
    let url = "";

    if (this.nuevo) {
      url = "gestionPartidasPres_createPartidasPres";
      let partidaPresupuestaria = this.datos[0];
      this.body = partidaPresupuestaria;
      this.body.importepartida = this.body.valorNum;
      this.body.importepartida = this.body.importepartida.replace(",", ".");
      this.body.importepartidaReal = +this.body.importepartida;
      if (this.body.importepartida == ".") {
        this.body.importepartida = 0;
      }
      this.callSaveService(url);

    } else {
      url = "gestionPartidasPres_updatePartidasPres";
      this.editMode = false;
      if (this.validateUpdate()) {
        this.body = new PartidasObject();
        this.body.partidasItem = this.updatePartidasPres;
        this.body.partidasItem.forEach(element => {
          element.importepartida = element.importepartida.replace(",", ".");
          element.importepartidaReal = +element.importepartida;
          if (element.importepartida == ".") {
            element.importepartida = 0;
          }
        });
        this.callSaveService(url);
      } else {
        err => {

          if (err.error != undefined && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          }
          this.progressSpinner = false;
        }
      }
    }

  }
  rest() {
    if (this.datosInicial != undefined) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }
    this.editElementDisabled();
    this.selectedDatos = [];
    this.updatePartidasPres = [];
    this.nuevo = false;
    this.editMode = false;
    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();
  }

  // rest() {
  //   if (this.editMode) {
  //     if (this.datosInicial != undefined) this.datos = JSON.parse(JSON.stringify(this.datosInicial));
  //   } else {
  //     this.partidasItem = new PartidasItem();
  //   }
  // }

  newPartidaPresupuestaria() {
    this.nuevo = true;
    this.editMode = false;
    this.selectionMode = "single";
    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();
    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    let partidaPresupuestaria = {
      nombrepartida: undefined,
      descripcion: undefined,
      importepartida: "0",
      importepartidaReal: 0,
      idpartidapresupuestaria: undefined,
      editable: true
    };
    if (this.datos.length == 0) {
      this.datos.push(partidaPresupuestaria);
    } else {
      this.datos = [partidaPresupuestaria, ...this.datos];
    }
    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();
  }

  disabledSave() {
    if (this.nuevo) {
      if (this.datos[0].nombrepartida != "" && this.datos[0].descripcion != "" && this.datos[0].nombrepartida != undefined && this.datos[0].descripcion != undefined
        && this.datos[0].valorNum != undefined) {
        return false;
      } else {
        return true;
      }

    } else {
      if (!this.historico && (this.updatePartidasPres != undefined && this.updatePartidasPres.length > 0) && this.permisos) {
        return false;
      } else {
        return true;
      }
    }
  }


  validateUpdate() {

    let check = true;

    this.updatePartidasPres.forEach(dato => {

      let findDatos = this.datos.filter(item => item.nombrepartida === dato.nombrepartida && item.descripcion === dato.descripcion && item.importepartida === dato.importepartida);

      if (findDatos != undefined && findDatos.length > 1) {
        check = false;
      }

    });

    return check;
  }

  searchHistorical() {

    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    this.searchPartidas.emit(this.historico);
    this.selectAll = false
    // if (this.historico) {
    //   this.selectMultiple = true;
    //   this.selectionMode = "multiple";
    // }
  }
  checkTrabajosSJCS(selectedDatos, access) {
    this.sigaServices.post("inscripciones_checkTrabajosSJCS", selectedDatos).subscribe(
      n => {
        let keyConfirmation = "deletePlantillaDoc";
        if (n.body == true) {
          this.progressSpinner = false;
          this.confirmationService.confirm({
            key: keyConfirmation,
            message: this.translateService.instant("justiciaGratuita.oficio.inscripciones.mensajeSJCS"),
            icon: "fa fa-trash-alt",
            accept: () => {
              if (access == 0) this.validar(selectedDatos.inscripcionesItem, 1);
              else if (access == 2) this.solicitarBaja(selectedDatos.inscripcionesItem, 3);
            },
            reject: () => {
              this.msgs = [
                {
                  severity: "info",
                  summary: "Cancel",
                  detail: this.translateService.instant(
                    "general.message.accion.cancelada"
                  )
                }
              ];
            }
          });
        }
        if (access == 0) this.validar(selectedDatos.inscripcionesItem, 1);
        else if (access == 2) this.solicitarBaja(selectedDatos.inscripcionesItem, 3);
      });
    this.progressSpinner = false;
  }

  validar(selectedDatos, access = 0) {
    let vb = 0;
    this.progressSpinner = true;
    this.body = new InscripcionesObject();
    this.body.inscripcionesItem = selectedDatos
    this.body.inscripcionesItem.forEach(element => {
      element.fechaActual = this.datos.fechaActual;
      element.observaciones = this.datos.observaciones;
      if (element.estado == "2") vb++;
    });
    if (vb > 0 && access == 0) this.checkTrabajosSJCS(this.body, access);
    else {
      if (vb > 0) {
        this.sigaServices.post("inscripciones_checkSaltos", this.body).subscribe(
          n => {
            let keyConfirmation = "deletePlantillaDoc";
            let ins = new InscripcionesObject();
            ins.inscripcionesItem = JSON.parse(n.body).inscripcionesItem;
            if (ins.inscripcionesItem.length > 0) {
              this.progressSpinner = false;
              this.confirmationService.confirm({
                key: keyConfirmation,
                message: this.translateService.instant("justiciaGratuita.oficio.inscripciones.mensajeSaltos"),
                icon: "fa fa-trash-alt",
                accept: () => {
                  ins.inscripcionesItem.forEach(element => {
                    element.fechaActual = this.datos.fechaActual;
                  }
                  )
                  this.sigaServices.post("inscripciones_updateBorrarSaltos", ins).subscribe();
                }
              })
            }
          }
        )
      }
      this.sigaServices.post("inscripciones_updateValidar", this.body).subscribe(
        data => {
          this.selectedDatos = [];
          this.searchPartidas.emit(false);
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.progressSpinner = false;
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
          this.historico = false;
          this.selectMultiple = false;
          this.selectAll = false;
          this.editMode = false;
          this.nuevo = false;
        }
      );
    }
  }

  cambiarFecha(selectedDatos) {
    this.progressSpinner = true;
    this.body = new InscripcionesObject();
    this.body.inscripcionesItem = selectedDatos
    this.body.inscripcionesItem.forEach(element => {
      element.fechaActual = this.datos.fechaActual;
      element.observaciones = this.datos.observaciones;
    });
    this.sigaServices.post("inscripciones_updateCambiarFecha", this.body).subscribe(
      data => {
        this.selectedDatos = [];
        this.searchPartidas.emit(false);
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
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
        this.historico = false;
        this.selectMultiple = false;
        this.selectAll = false;
        this.editMode = false;
        this.nuevo = false;
      }
    );
  }

  denegar(selectedDatos) {
    this.progressSpinner = true;
    this.body = new InscripcionesObject();
    this.body.inscripcionesItem = selectedDatos
    this.body.inscripcionesItem.forEach(element => {
      element.fechaActual = this.datos.fechaActual;
      element.observaciones = this.datos.observaciones;
    });
    this.sigaServices.post("inscripciones_updateDenegar", this.body).subscribe(
      data => {
        this.selectedDatos = [];
        this.searchPartidas.emit(false);
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
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
        this.historico = false;
        this.selectMultiple = false;
        this.selectAll = false;
        this.editMode = false;
        this.nuevo = false;
      }
    );
  }

  solicitarBaja(selectedDatos, access = 2) {
    this.progressSpinner = true;
    let fechaDeHoy = new Date();
    let fechaHoy = this.datepipe.transform(fechaDeHoy, 'dd/MM/yyyy');
    let fechaActual2 = this.datepipe.transform(this.datos.fechaActual, 'dd/MM/yyyy')
    if (fechaActual2 != fechaHoy) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.inscripciones.mensajesolicitarbaja"));
      this.progressSpinner = false;
    } else {
      let vb = 0;
      this.body = new InscripcionesObject();
      this.body.inscripcionesItem = selectedDatos
      this.body.inscripcionesItem.forEach(element => {
        element.fechaActual = this.datos.fechaActual;
        element.observaciones = this.datos.observaciones;
        if (element.estado == "2") vb++;
      });
      if (vb > 0 && access == 2) this.checkTrabajosSJCS(this.body, access);
      else {
        this.sigaServices.post("inscripciones_updateSolicitarBaja", this.body).subscribe(
          data => {
            this.selectedDatos = [];
            this.searchPartidas.emit(false);
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            this.progressSpinner = false;
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
            this.historico = false;
            this.selectMultiple = false;
            this.selectAll = false;
            this.editMode = false;
            this.nuevo = false;
          }
        );
      }
    }
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      if (this.nuevo) this.datos.shift();
      this.nuevo = false;
      this.editMode = false;
      this.selectMultiple = false;
      this.editElementDisabled();

      if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null);
        this.selectMultiple = true;
        this.selectionMode = "single";
      } else {
        this.selectedDatos = this.datos;
        this.selectMultiple = false;
        this.selectionMode = "single";
      }
      this.selectionMode = "multiple";
      this.numSelected = this.datos.length;
      this.actualizaBotones(this.selectedDatos)
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      if (this.historico)
        this.selectMultiple = true;
      this.selectionMode = "multiple";
    }
  }

  searchPartida() {
    this.historico = !this.historico;
    if (this.historico) {

      this.editElementDisabled();
      this.editMode = false;
      this.nuevo = false;
      this.selectMultiple = true;

      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectionMode = "multiple";
    }
    else {
      this.selectMultiple = false;
      this.selectionMode = "single";
    }
    this.searchPartidas.emit(this.historico);
    this.selectAll = false;
  }


  setItalic(dato) {
    // if (dato.fechabaja == null) return false;
    // else return true;
  }

  getCols() {
    // Para cambiar la presentacion de las columnas en la tabala se debe 
    // cambiar de orden aqui.
    this.cols = [
      { field: "ncolegiado", header: "facturacionSJCS.facturacionesYPagos.numColegiado" },
      { field: "apellidosnombre", header: "administracion.parametrosGenerales.literal.nombre.apellidos" },
      { field: "abreviatura", header: "justiciaGratuita.sjcs.designas.DatosIden.turno" },
      { field: "fechasolicitud", header: "oficio.busquedaInscripcion.fechaSolicitudAlta" },
      { field: "fechavalidacion", header: "oficio.busquedaInscripcion.fechaEfectivaAlta" },
      { field: "fechasolicitudbaja", header: "oficio.busquedaInscripcion.fechaSolicitudBaja" },
      { field: "fechabaja", header: "oficio.busquedaInscripcion.fechaEfectivaBaja" },
      { field: "estadonombre", header: "censo.fichaIntegrantes.literal.estado" }
    ];
    this.cols.forEach(element => {
      this.buscadores.push("");
    });

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

  openTab(evento) {

    let paginacion = {
      paginacion: this.tabla.first,
      selectedItem: this.selectedItem
    };

    this.persistenceService.setPaginacion(paginacion);
    if (!this.selectAll && !this.selectMultiple) {
      this.progressSpinner = true;
      this.persistenceService.setDatos(evento);
      //sessionStorage.setItem("turno", JSON.stringify(evento));
      this.router.navigate(["/gestionInscripciones"]);
    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  editElementDisabled() {
    this.datos.forEach(element => {
      element.editable = false
      element.overlayVisible = false;
    });
  }



  isSelectMultiple() {
    if (this.permisos && !this.historico) {
      if (this.nuevo) this.datos.shift();
      this.editElementDisabled();
      this.editMode = false;
      this.nuevo = false;
      this.selectMultiple = !this.selectMultiple;

      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectionMode = "single";
      } else {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectionMode = "multiple";

      }
    }
    // this.volver();
  }

  formatDateSinHora(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);
  }

  actualizaBotones(selectedDatos) {

    this.selectedDatos = selectedDatos;
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }

    if (selectedDatos != null && selectedDatos.length != 0) {
      this.numSelected = selectedDatos.length;
      let findDato = this.selectedDatos.find(item => item.estado != "1");
      let currentDate = new Date();
      let currentDateString = this.formatDateSinHora(currentDate);
      let selectedDate = this.datos.fechaActual
      let selectedDateString = this.formatDateSinHora(selectedDate);
      if (findDato != null) {
        this.disabledSolicitarBaja = true;
      }
      else {
        if (currentDateString != selectedDateString) {
          this.disabledSolicitarBaja = true;
        } else {
          this.disabledSolicitarBaja = false;
        }

      }
      let findDato2 = this.selectedDatos.filter(this.esPendienteAltaOpendienteBaja);
      if (findDato2.length == 0) {
        this.disabledValidar = true;
        this.disabledDenegar = true;
        this.selectAll = false;
        this.selectMultiple = false;
      } else {
        this.disabledValidar = false;
        this.disabledDenegar = false;
        this.selectAll = true;
        this.selectMultiple = true;
        //this.validarDirecciones(selectedDatos[0].idpersona, findDato2);
      }
      /*
      if (findDato2 != null) {
        this.disabledDenegar = true;
      }
      else {
        this.disabledDenegar = false;
      }*/
      let findDato3 = this.selectedDatos.find(item => item.estado != "1" && item.estado != 2 && item.estado != "3");
      if (findDato3 != null) {
        this.disabledCambiarFecha = true;
      }
      else {
        this.disabledCambiarFecha = false;
      }
    }

    if (this.selectedDatos && this.selectedDatos != null) {
      this.checkValidarInscripciones = false;
      this.selectedDatos.forEach(el => {
        if (this.isLetrado && el.validarinscripciones && el.validarinscripciones != null && el.validarinscripciones.toUpperCase() == 'N') {
          this.checkValidarInscripciones = true;
        }
      });
    }

  }

  desactBotones(selectedDatos) {
    if (selectedDatos.length == 0) {
      this.selectMultiple = false;
      this.selectAll = false;
      this.disabledValidar = true;
      this.checkValidarInscripciones = true;
      this.disabledCambiarFecha = true;
      this.disabledDenegar = true;
    }

  }

  esPendienteAltaOpendienteBaja(item) {

    return item.estado == "0" || item.estado == "2";

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
  obtenerPartidos(dato) {
    return dato.nombrepartidosjudiciales;
  }

  validarDirecciones(idPersona, estado) {
    this.bodyDirecciones = new DatosDireccionesItem();
    this.bodyDirecciones.idPersona = idPersona;
    this.bodyDirecciones.historico = false;
    if (this.bodyDirecciones.idPersona != undefined && this.bodyDirecciones.idPersona != null) {
      this.sigaServices
        .postPaginado(
          "fichaDatosDirecciones_datosDireccionesSearch",
          "?numPagina=1",
          this.bodyDirecciones
        )
        .subscribe(
          data => {
            this.searchDireccionIdPersona = JSON.parse(data["body"]);
            this.datosDirecciones = this.searchDireccionIdPersona.datosDireccionesItem;
            let contador = 0;
            this.datosDirecciones.forEach(element => {

              if (element.tipoDireccion != undefined) {
                var index = element.tipoDireccion.indexOf("Guardia");
                if (index != -1) {
                  this.datosContacto = element.movil;
                  if (this.datosContacto.length != 9) {
                    this.disabledValidar = true;
                  }
                  else {
                    this.disabledValidar = false;
                  }
                }
              }
            });
            sessionStorage.setItem("numDespacho", JSON.stringify(contador));
          },
          err => {
            //console.log(err);
            this.progressSpinner = false;
          },
        );
    }
  }
  navigateComunicar(dato) {
    sessionStorage.setItem("rutaComunicacion", this.currentRoute.toString());
    //IDMODULO de SJCS es 10
    sessionStorage.setItem("idModulo", '10');

    this.getDatosComunicar();
  }

  getKeysClaseComunicacion() {
    this.sigaServices.post("dialogo_keys", this.idClaseComunicacion).subscribe(
      data => {
        this.keys = JSON.parse(data["body"]);
      },
      err => {
        //console.log(err);
      }
    );
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 != null && value2 != null) {
        if (isNaN(parseInt(value1))) { //Checked for numeric
          const dayA = value1.substr(0, 2);
          const monthA = value1.substr(3, 2);
          const yearA = value1.substr(6, 10);
          //console.log("fecha a:"+ yearA+","+monthA+","+dayA);
          var dt = new Date(yearA, monthA, dayA);
          if (!isNaN(dt.getTime())) { //Checked for date
            result = this.compareDate(value1, value2);
            return (event.order * result);
          }
        }
      }

      if (value1 == null && value2 != null) {
        result = -1;
      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else if (typeof value1 === 'string' && typeof value2 === 'string') {
        result = value1.localeCompare(value2);
      } else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }
      return (event.order * result);
    });
  }

  compareDate(fechaA: any, fechaB: any) {

    let dateA = null;
    let dateB = null;
    if (fechaA != null) {
      const dayA = fechaA.substr(0, 2);
      const monthA = fechaA.substr(3, 2);
      const yearA = fechaA.substr(6, 10);
      //console.log("fecha a:"+ yearA+","+monthA+","+dayA);
      dateA = new Date(yearA, monthA, dayA);
    }

    if (fechaB != null) {
      const dayB = fechaB.substr(0, 2);
      const monthB = fechaB.substr(3, 2);
      const yearB = fechaB.substr(6, 10);
      //console.log("fecha b:"+ yearB+","+monthB+","+dayB);
      dateB = new Date(yearB, monthB, dayB);
    }


    return (dateA < dateB ? -1 : 1);


  }


  getDatosComunicar() {
    let datosSeleccionados = [];
    let rutaClaseComunicacion = this.currentRoute.toString();

    this.sigaServices
      .post("dialogo_claseComunicacion", rutaClaseComunicacion)
      .subscribe(
        data => {
          this.idClaseComunicacion = JSON.parse(
            data["body"]
          ).clasesComunicaciones[0].idClaseComunicacion;
          this.sigaServices
            .post("dialogo_keys", this.idClaseComunicacion)
            .subscribe(
              data => {
                this.keys = JSON.parse(data["body"]).keysItem;
                this.selectedDatos.forEach(element => {
                  let keysValues = [];
                  this.keys.forEach(key => {
                    if (element[key.nombre.toLowerCase()] != undefined) {
                      keysValues.push(element[key.nombre.toLowerCase()]);
                    }
                  });
                  datosSeleccionados.push(keysValues);
                });

                sessionStorage.setItem(
                  "datosComunicar",
                  JSON.stringify(datosSeleccionados)
                );
                this.router.navigate(["/dialogoComunicaciones"]);
              },
              err => {
                //console.log(err);
              }
            );
        },
        err => {
          //console.log(err);
        }
      );
  }
}
