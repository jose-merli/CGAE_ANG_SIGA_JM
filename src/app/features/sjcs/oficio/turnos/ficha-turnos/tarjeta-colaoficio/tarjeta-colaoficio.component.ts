import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { Location, UpperCasePipe } from "@angular/common";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { Subject } from "rxjs/Subject";
import { DatosGeneralesConsultaItem } from '../../../../../../models/DatosGeneralesConsultaItem';
import { DestinatariosItem } from '../../../../../../models/DestinatariosItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PrisionItem } from '../../../../../../models/sjcs/PrisionItem';
import { TurnosItems } from '../../../../../../models/sjcs/TurnosItems';
import { TurnosObject } from '../../../../../../models/sjcs/TurnosObject';
import { PartidasObject } from '../../../../../../models/sjcs/PartidasObject';
import { MultiSelect } from '../../../../../../../../node_modules/primeng/primeng';
import { procesos_oficio } from '../../../../../../permisos/procesos_oficio';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { TurnosItem } from '../../../../../../models/sjcs/TurnosItem';
import { SaltoCompItem } from '../../../../../../models/guardia/SaltoCompItem';
import { ActivatedRoute } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';
@Component({
  selector: "app-tarjeta-colaoficio",
  templateUrl: "./tarjeta-colaoficio.component.html",
  styleUrls: ["./tarjeta-colaoficio.component.scss"]
})
export class TarjetaColaOficio implements OnInit {


  openFicha: boolean = false;
  textSelected: String = "{label}";
  @Input() openColaOficio;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();

  selectedItem: number = 10;
  selectedItemSaltos: number = 5;
  selectedItemCompensaciones: number = 5;
  selectAll;
  selectedDatos: any[] = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  cols;
  colsCompensaciones;
  colsSaltos;
  rowsPerPage;
  historico: boolean = false;
  datos: any[];
  datosSaltos: any[];
  datosCompensaciones: any[];
  listaTabla: TurnosItems = new TurnosItems();
  fechaActual;
  disableAll: boolean = false;
  comboJurisdicciones: any[] = [];
  bodyInicial: TurnosItems;
  apeyNombreUltimo;
  nInscritos;
  progressSpinner: boolean = false;
  msgs;
  body;
  updateTurnosItem: boolean = false;
  turnosItem2;
  nuevo: boolean = false;
  datosInicial = [];
  updateAreas = [];
  permisosTarjeta: boolean = true;
  showTarjeta: boolean = true;
  ultimoLetrado;
  primerLetrado;
  nombreApellidosPrimerLetrado;
  overlayVisible: boolean = false;
  selectionMode: string = "multiple";
  pesosSeleccionadosTarjeta2;
  //Resultados de la busqueda
  @Input() turnosItem: TurnosItems;
  @Input() modoEdicion;
  @Input() idTurno;
  @Input() tarjetaColaOficio: string;
  // @Input() pesosSeleccionadosTarjeta;
  //Resultados de la busqueda
  // @Input() modoEdicion: boolean = false;

  idClasesComunicacionArray: string[] = [];
  idClaseComunicacion: String;
  keys: any[] = [];

  @ViewChild("table") table;
  @ViewChild("tableComp") tableComp;
  @ViewChild("tableSaltos") tableSaltos;
  @ViewChild("multiSelect") multiSelect: MultiSelect;
  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "configuracion",
      activa: false
    },
    {
      key: "tablacolaoficio",
      activa: false
    },
  ];
  constructor(private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices, private translateService: TranslateService, private upperCasePipe: UpperCasePipe,
    private persistenceService: PersistenceService, private commonsService: CommonsService, private confirmationService: ConfirmationService,
    private router: Router, private activatedRoute: ActivatedRoute) {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.getCols();
    this.sigaServices.newIdOrdenacion$.subscribe(
      fecha => {
        this.updateTurnosItem = fecha;
        this.actualizarTurnosItems();
      });
    if (this.turnosItem != undefined) {
      if (this.idTurno != undefined) {
        this.body = this.turnosItem;
        this.turnosItem.fechaActual = new Date();
        this.turnosItem.idturno = this.idTurno;
        if (this.body.idturno == undefined) {
          this.modoEdicion = false;
        } else {
          if (this.persistenceService.getDatos() != undefined) {
            this.turnosItem = this.persistenceService.getDatos();
          }
          // turnosItem.fechabaja tiene valor null
          if (this.turnosItem.fechabaja != undefined) {
            this.disableAll = true;
          }
          this.turnosItem.fechaActual = new Date();
          this.modoEdicion = true;
          this.getColaOficio();
        }
      } else {
        if (this.activatedRoute.snapshot.queryParamMap.get('idturno')) {
          this.idTurno = this.activatedRoute.snapshot.queryParamMap.get('idturno');
        }
      }
    } else {
      this.turnosItem = new TurnosItems();
    }
    // this.arreglaChecks();
    if (this.openColaOficio == true) {
      if (this.openFicha == false) {
        this.abreCierraFicha('colaOficio')
      }
    }
    this.sigaServices.get("institucionActual").subscribe(n => {
      if(this.body != undefined) this.body.idinstitucion = n.value;
    });
  }

  ngOnInit() {
    this.commonsService.checkAcceso(procesos_oficio.colaDeOficio)
    .then(respuesta => {
      this.permisosTarjeta = respuesta;
      this.persistenceService.setPermisos(this.permisosTarjeta);
      if (this.permisosTarjeta == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem(
          "descError",
          this.translateService.instant("generico.error.permiso.denegado")
        );
        this.router.navigate(["/errorAcceso"]);
      }else if(this.persistenceService.getPermisos() != true){
        this.disableAll = true;
      }
    }
    ).catch(error => console.error(error));
    this.getCols();
    if (this.idTurno != undefined) {
      this.modoEdicion = true;
      // this.getMaterias();
    } else {
      this.modoEdicion = false;
    }

    // let datos = this.persistenceService.getDatos();
    // if (datos != null && datos != undefined && datos.fechabaja != undefined) {
    //   this.disableAll = true;
    // }
    if (this.persistenceService.getPermisos() != true) {
      this.disableAll = true
    }
  }



  confirmUltimo(selectedDatos) {
    let mess = this.translateService.instant(
      "justiciaGratuita.oficio.turnos.messageultletrado"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      key: "confirmDialogColaOficio",
      message: mess,
      icon: icon,
      accept: () => {
        this.marcarUltimo(selectedDatos);
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

  actualizarTurnosItems() {
    if (this.updateTurnosItem) {
      if (this.persistenceService.getDatos() != undefined) {
        this.turnosItem2 = this.persistenceService.getDatos();
        this.turnosItem.idordenacioncolas = this.turnosItem2.idordenacioncolas;
      }
      this.getColaOficio();
    }
  }

  fillFechaDesdeCalendar(event) {
    this.turnosItem.fechaActual = this.transformaFecha(event);
    this.getColaOficio();
  }
  
  searchHistorical() {
    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    this.getColaOficio();
    this.selectAll = false
  }
  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }
  marcarUltimo(selectedDatos) {
    this.body = new TurnosItem();
    this.body = this.selectedDatos[0];

    this.sigaServices.post("turnos_updateUltimo", this.body).subscribe(
      data => {

        var ultimaPosicion = this.datos[this.datos.length - 1];
        this.datos[this.datos.length - 1] = this.selectedDatos[0];
        this.selectedDatos[0] = ultimaPosicion;
        this.nuevo = false;
        this.selectedDatos = [];
        // this.getColaOficio();
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {//areasmaterias.materias.ficha.materiaEnUso

        if (err != undefined && JSON.parse(err.error).error.description != "") {
          if (JSON.parse(err.error).error.description == "areasmaterias.materias.ficha.materiaEnUso") {
            this.showMessage("warn", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          }
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.sigaServices.post("turnos_busquedaFichaTurnos", this.turnosItem).subscribe(
          n => {
            this.turnosItem2 = JSON.parse(n.body).turnosItem[0];
            // if (this.turnosItem.fechabaja != undefined || this.persistenceService.getPermisos() != true) {
            // 	this.turnosItem.historico = true;
            // }
          },
          err => {
          }, () => {
            this.turnosItem.idpersonaUltimo = this.turnosItem2.idpersonaUltimo;
            this.turnosItem.idpersona_ultimo = this.turnosItem2.idpersona_ultimo;
            this.getColaOficio();
          }
        );
        this.progressSpinner = false;
        this.selectAll = false;
      }
    );
  }
  getColaOficio() {
    this.turnosItem.historico = this.historico;
    this.progressSpinner = true;
    this.sigaServices.post("turnos_busquedaColaOficio", this.turnosItem).subscribe(
      n => {
        this.datos = JSON.parse(n.body).turnosItem;
        this.datos.forEach(element => {
          element.orden = +element.orden;
        });
        this.getSaltosYCompensaciones();
      },
      err => {
        this.progressSpinner = false;
      }, () => {
        this.datosInicial = JSON.parse(JSON.stringify(this.datos));
        this.progressSpinner = false;
        if (this.datos != undefined && this.datos.length > 0) {
          this.primerLetrado = this.datos[0].numerocolegiado;
          this.nombreApellidosPrimerLetrado = this.datos[0].alfabeticoapellidos + ", " + this.datos[0].nombrepersona;
          this.ultimoLetrado = this.datos[this.datos.length - 1].numerocolegiado;
          this.apeyNombreUltimo = this.datos[this.datos.length - 1].alfabeticoapellidos + ", " + this.datos[this.datos.length - 1].nombrepersona;
          this.nInscritos = this.datos.length;
        }
      }
    );
  }

  getSaltosYCompensaciones() {
    let filtros: SaltoCompItem = new SaltoCompItem();
    if (sessionStorage.getItem("filtrosSaltosCompOficio")) {
      filtros = JSON.parse(sessionStorage.getItem("filtrosSaltosCompOficio"));
    }
    if (sessionStorage.getItem("saltos-compesacionesItem")) {
      filtros = JSON.parse(sessionStorage.getItem("saltos-compesacionesItem"));
    }
    filtros.idTurno = this.idTurno;
    filtros.idGuardia = null;
    this.sigaServices.postPaginado("saltosCompensacionesOficio_buscar", "?numPagina=1", filtros).subscribe(
      n => {
        let datosSaltosYComp: SaltoCompItem[] = JSON.parse(n.body).saltosCompItems.filter(item => item.fechaUso === null);
        let datosSaltosAux, datosCompensacionesAux;
        this.datosSaltos = [];
        this.datosCompensaciones = [];

        datosSaltosAux = datosSaltosYComp.filter(datos => datos.saltoCompensacion === 'S' && this.isActivoColaActual(datos.idPersona));
        datosCompensacionesAux = datosSaltosYComp.filter(datos => datos.saltoCompensacion === 'C' && this.isActivoColaActual(datos.idPersona));

        datosSaltosAux.forEach(element => {
          //if (this.datosSaltos.find(item => item.idPersona === element.idPersona) != undefined) {
          // this.datosSaltos.find(item => item.idPersona === element.idPersona).numeroSaltosComp= this.datosSaltos.find(item => item.idPersona === element.idPersona).numeroSaltosComp + 1;
          //} else {
            this.datosSaltos.push(element);
          //}
        });
        this.datosSaltos.sort((a , b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

        datosCompensacionesAux.forEach(element => {
          //if (this.datosCompensaciones.find(item => item.idPersona === element.idPersona) != undefined) {
          //  this.datosCompensaciones.find(item => item.idPersona === element.idPersona).numeroSaltosComp = this.datosCompensaciones.find(item => item.idPersona === element.idPersona).numeroSaltosComp + 1;
          //} else {
            this.datosCompensaciones.push(element);
          //}
        });
        this.datosCompensaciones.sort((a , b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

        let error = JSON.parse(n.body).error;
      });
  }


  validateHistorical() {
    // if (this.datos != undefined && this.datos.length > 0) {

    //   if (this.datos[0].fechabaja != null) {
    //     this.historico = true;
    //   } else {
    //     this.historico = false;
    //   }

    //   this.persistenceService.setHistorico(this.historico);

    // }
  }

  save() {
    this.progressSpinner = true;
    let url = "";

    if (this.nuevo) {
      url = "fichaAreas_createMaterias";
      this.validatenewMateria(url);

    } else {
      url = "fichaAreas_updateMaterias";
      this.body = new TurnosObject();
      this.body.areasItems = this.updateAreas;
      this.callSaveService(url);
    }

  }

  callSaveService(url) {

    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (this.nuevo) {
          this.nuevo = false;
          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
        }

        this.getColaOficio();
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.selectedDatos = [];
        this.updateAreas = [];
        this.progressSpinner = false;
      }
    );

  }

  newMateria() {
    this.nuevo = true;
    this.seleccion = false;
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
    this.tableComp.sortOrder = 0;
    this.tableComp.sortField = '';
    this.tableComp.reset();
    this.tableSaltos.sortOrder = 0;
    this.tableSaltos.sortField = '';
    this.tableSaltos.reset();
    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    let materia = {
      nombreMateria: "",
      contenido: "",
      jurisdicciones: "",
      jurisdiccion: "",
      idArea: this.idTurno,
      areaNueva: true
    };

    if (this.datos.length == 0) {
      this.datos.push(materia);
    } else {
      this.datos = [materia, ...this.datos];
    }

  }

  validateArea(e) {

    if (!this.nuevo) {
      let datoId = this.datos.findIndex(item => item.idMateria === this.selectedDatos[0].idMateria);

      let findDato = this.datos.filter(item => this.upperCasePipe.transform(item.nombreMateria) === this.upperCasePipe.transform(e.srcElement.value.trim()));

      if (findDato.length > 1) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("messages.censo.nombreExiste"));
        this.progressSpinner = false;
        this.datos[datoId].nombreMateria = this.selectedDatos[0].nombreMateria;
      } else {
        let dato = this.datos[datoId];
        // this.editarMateria(dato);
      }

      // this.seleccion = false;
    }
  }

  validatenewMateria(url) {
    let materia = this.datos[0];

    let findDato = this.datosInicial.find(item => item.idArea === materia.idArea && item.nombreMateria === materia.nombreMateria);

    let jurisdiccionesString = "";
    for (let i in materia.jurisdiccionesReal) {
      jurisdiccionesString += ";" + materia.jurisdiccionesReal[i].value;
    }

    materia.jurisdiccion = jurisdiccionesString.substring(1, jurisdiccionesString.length);
    materia.jurisdicciones = "";

    if (findDato != undefined) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("messages.censo.nombreExiste"));
      this.progressSpinner = false;
    } else {
      this.body = materia;
      this.callSaveService(url);
    }

  }

  disabledSave() {

    if (this.selectMultiple || this.selectAll) {
      return true;
    }
    if (this.nuevo) {
      if (this.datos[0].nombreMateria != undefined && this.datos[0].nombreMateria != "") {
        return false;
      } else {
        return true;
      }

    } else {

      if ((this.updateAreas != undefined && this.updateAreas.length > 0)) {
        return false;
      } else {
        return true;
      }
    }
  }

  editAreas(evento) {

    if (this.nuevo) {
      this.seleccion = false;
    } else {

      if (!this.selectAll && !this.selectMultiple) {

        this.datos.forEach(element => {
          element.editable = false;
          element.overlayVisible = false;
        });

        evento.data.editable = true;

        this.selectedDatos = [];
        this.selectedDatos.push(evento.data);

        this.seleccion = true;

      }

    }
  }

  editarMateria(dato) {

    let findDato = this.datosInicial.find(item => item.idMateria == dato.idMateria && item.idArea == dato.idArea);

    if (findDato != undefined) {
      if ((dato.nombreMateria != findDato.nombreMateria) || (dato.contenido != findDato.contenido)) {

        let findUpdate = this.updateAreas.find(item => item.idMateria == dato.idMateria && item.idArea == dato.idArea);

        if (findUpdate == undefined) {
          let dato2 = dato;
          dato2.jurisdicciones = "";
          this.updateAreas.push(dato2);
        }
      }
    }

  }

  editJurisdicciones(dato) {

    if (!this.nuevo) {

      // if (dato.jurisdicciones.length == 0) {
      //   this.showMessage("info", "Informacion", "Debe seleccionar al menos un partido judicial");
      //   let findUpdate = this.updateZonas.findIndex(item => item.idArea === dato.idArea && item.idMateria === dato.idMateria);

      //   if (findUpdate != undefined) {
      //     this.updateZonas.splice(findUpdate);
      //   }

      // } else {
      let findUpdate = this.updateAreas.find(item => item.idArea === dato.idArea && item.idMateria === dato.idMateria);

      if (findUpdate == undefined) {
        let dato2 = dato;
        let jurisdiccionesString = "";
        for (let i in dato2.jurisdiccionesReal) {
          jurisdiccionesString += ";" + dato2.jurisdiccionesReal[i].value;
        }

        dato2.jurisdiccion = jurisdiccionesString.substring(1, jurisdiccionesString.length);
        dato2.jurisdicciones = "";
        this.updateAreas.push(dato2);
      } else {
        let updateFind = this.updateAreas.findIndex(item => item.idArea === dato.idArea && item.idMateria === dato.idMateria);
        let jurisdiccionesString = "";
        for (let i in findUpdate.jurisdiccionesReal) {
          jurisdiccionesString += ";" + dato.jurisdiccionesReal[i].value;
        }
        this.updateAreas[updateFind].jurisdiccionesReal = dato.jurisdiccionesReal;
        this.updateAreas[updateFind].jurisdiccion = jurisdiccionesString.substring(1, jurisdiccionesString.length);
        this.updateAreas[updateFind].jurisdicciones = "";
      }
      // }
    } else {
      this.selectedDatos = [];
    }
  }

  delete(selectedDatos) {
    this.body = new TurnosObject();
    this.body.turnosItem = this.selectedDatos;

    this.sigaServices.post("turnos_eliminateColaOficio", this.body).subscribe(
      data => {

        this.nuevo = false;
        this.selectedDatos = [];
        this.getColaOficio();
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {//areasmaterias.materias.ficha.materiaEnUso

        if (err != undefined && JSON.parse(err.error).error.description != "") {
          if (JSON.parse(err.error).error.description == "areasmaterias.materias.ficha.materiaEnUso") {
            this.showMessage("warn", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          }
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

  rest() {
    if (this.datosInicial != undefined) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    this.selectedDatos = [];
    this.updateAreas = [];
    this.nuevo = false;
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
    this.tableComp.sortOrder = 0;
    this.tableComp.sortField = '';
    this.tableComp.reset();
    this.tableSaltos.sortOrder = 0;
    this.tableSaltos.sortField = '';
    this.tableSaltos.reset();
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  existenDatos() {
    if (this.datos != undefined) return this.datos.length > 0;
    else return false;
  }
  getCols() {

    this.cols = [
      { field: "orden", header: "administracion.informes.literal.orden", width: "15%" },
      { field: "numerocolegiado", header: "censo.busquedaClientesAvanzada.literal.nCol", width: "15%" },
      { field: "nombrepersona", header: "administracion.parametrosGenerales.literal.nombre.apellidos.coma", width: "30%" },
      { field: "fechavalidacion", header: "justiciaGratuita.oficio.turnos.fechavalidacion", width: "22%" },
      { field: "fechabajapersona", header: "justiciaGratuita.oficio.turnos.fechaBaja", width: "20%" },
    ];

    this.colsCompensaciones = [
      { field: "colegiadoGrupo", header: "censo.busquedaClientesAvanzada.literal.nCol", width: "15%" },
      { field: "letrado", header: "administracion.parametrosGenerales.literal.nombre.apellidos.coma", width: "30%" },
      { field: "fecha", header: "justiciaGratuita.oficio.turnos.fecha", width: "22%" }
    ];

    this.colsSaltos = [
      { field: "colegiadoGrupo", header: "censo.busquedaClientesAvanzada.literal.nCol", width: "15%" },
      { field: "letrado", header: "administracion.parametrosGenerales.literal.nombre.apellidos.coma", width: "30%" },
      { field: "fecha", header: "justiciaGratuita.oficio.turnos.fecha", width: "22%" }
    ];

    this.rowsPerPage = [
      {
        label: 5,
        value: 5
      },
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
  

  onChangeRowsPerPages(event,id) {
    if(id === "saltos"){
      this.selectedItemSaltos = event.value;
    }else if(id === "compensaciones"){
      this.selectedItemCompensaciones = event.value;
    }else{
      this.selectedItem = event.value;
    }
    this.changeDetectorRef.detectChanges();
    this.table.reset();
    this.tableComp.reset();
    this.tableSaltos.reset();
  }



  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
      if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechabajapersona != undefined && dato.fechabajapersona != null);
      } else {
        this.selectedDatos = this.datos;
      }
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }
  editElementDisabled() {
    this.datos.forEach(element => {
      element.editable = false
      element.overlayVisible = false;
    });
  }
  isSelectMultiple() {
    if (!this.disableAll) {
      this.selectAll = false;
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
  }
  openTab(evento) {
    if (!this.selectAll && !this.selectMultiple) {
      // this.progressSpinner = true;
      this.persistenceService.setDatos(evento.data);
      // this.router.navigate(["/gestionTurnos"], { queryParams: { idturno: evento.data.idturno } });
    } else {

      if (evento.data.fechabajapersona == undefined && this.historico) {
        this.selectedDatos.pop();
      }

    }
  }

  actualizaSeleccionados() {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (this.selectedDatos != undefined) {
      this.numSelected = this.selectedDatos.length;
    }
  }


  clear() {
    this.msgs = [];
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
  abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = true;
  }

  cerrarFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = false;
  }
  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (
      key == "colaOficio" &&
      !this.modoEdicion
    ) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.modoEdicion) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }
  openMultiSelect(dato) {
    // //console.log(this.multiSelect);
    dato.onPanelShow;
    // this.multiSelect.show();
    // dato.overlayVisible = true;
  }

  saltoCompensacion() {
    this.progressSpinner = true;
    this.persistenceService.setDatos(this.selectedDatos[0]);
    sessionStorage.setItem("fromTurnoOficio", "true")
    this.router.navigate(["/saltosYCompensaciones"],
      {
        queryParams:
        {
          idpersona: this.selectedDatos[0].idpersona,
          idturno: this.selectedDatos[0].idturno,
          nombreTurno: this.turnosItem.nombre,
          numerocolegiado: this.selectedDatos[0].numerocolegiado,
          letrado: `${this.selectedDatos[0].alfabeticoapellidos}, ${this.selectedDatos[0].nombrepersona}`
        }
      });
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  comunicar(){
    sessionStorage.setItem("rutaComunicacion", "/turnos");
    //IDMODULO de SJCS es 10
    sessionStorage.setItem("idModulo", '10');
    
    this.getDatosComunicar();
  }

  getDatosComunicar() {
    let datosSeleccionados = [];
    let rutaClaseComunicacion = "/turnos";

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
                //    this.actuacionesSeleccionadas.forEach(element => {
                let keysValues = [];
                this.keys.forEach(key => {
                if (this.body[key.nombre.toLowerCase()] != undefined) {
                  keysValues.push(this.body[key.nombre.toLowerCase()]);
                } 
                });
                datosSeleccionados.push(keysValues);

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

  goToSaltosYComp() {
    this.router.navigate(["/saltosYCompensaciones"], { queryParams: { idturno: this.idTurno } });
  }

  isActivoColaActual(idPersona: number): boolean{
    let isActive = false;
    if(this.datos){
      this.datos.forEach(element  => {
        if (element.idpersona == idPersona){
          isActive = true;
        }
      });
    }else {
      isActive= true;
    }
    return isActive;
  }
}
