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
import { ActivatedRoute } from '@angular/router';
import { SaltoCompItem } from '../../../../../../models/guardia/SaltoCompItem';
@Component({
  selector: "app-tarjeta-colaguardias",
  templateUrl: "./tarjeta-colaguardias.component.html",
  styleUrls: ["./tarjeta-colaguardias.component.scss"]
})
export class TarjetaColaGuardias implements OnInit {


  openFicha: boolean = false;
  textSelected: String = "{label}";
  @Input() openColaGuardias;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  
  selectedItem: number = 10;
  selectedItemSaltosCompensaciones: number = 3;
  selectAll;
  selectedDatos = [];
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
  progressSpinner: boolean = false;
  msgs;
  body;
  guardias = [];
  nuevo: boolean = false;
  datosInicial = [];
  updateAreas = [];
  showTarjeta: boolean = true;
  ultimoLetrado;
  primerLetrado;
  permisosTarjeta: boolean = true;
  guardiasNombre;
  existenGuardias: boolean = false;
  nombreApellidosPrimerLetrado;
  overlayVisible: boolean = false;
  selectionMode: string = "multiple";
  pesosSeleccionadosTarjeta2;
  turnosItem2;
  @Input() turnosItem: TurnosItems;
  @Input() modoEdicion;
  @Input() idTurno;
  @Input() tarjetaColaGuardias: string;
  updateCombo: boolean = false;
  updateTurnosItem: boolean = false;
  // @Input() pesosSeleccionadosTarjeta;
  //Resultados de la busqueda
  // @Input() modoEdicion: boolean = false;

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
      key: "tablacolaguardias",
      activa: false
    },
  ];
  constructor(private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices, private translateService: TranslateService, private upperCasePipe: UpperCasePipe,
    private persistenceService: PersistenceService, private confirmationService: ConfirmationService, private commonsService: CommonsService,
    private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnChanges(changes: SimpleChanges) {
    this.getCols();

    this.sigaServices.updateCombo$.subscribe(
      fecha => {
        this.updateCombo = fecha;
        this.actualizarComboGuardias();
      });

    this.sigaServices.newIdOrdenacion$.subscribe(
      fecha => {
        this.updateTurnosItem = fecha;
        this.actualizarTurnosItems();
      });
    if (this.turnosItem != undefined) {
      if (this.turnosItem.fechabaja != undefined) {
        this.disableAll = true;
      }
      if (this.persistenceService.getDatos() != undefined) {
        this.turnosItem = this.persistenceService.getDatos();
      }
      if (this.idTurno != undefined) {
        this.turnosItem.fechaActual = new Date();
        this.body = this.turnosItem;
        this.turnosItem.idturno = this.idTurno;
        this.sigaServices
          .getParam(
            "combossjcs_comboidGuardias",
            "?idTurno=" + this.idTurno
          )
          .subscribe(
            n => {
              this.guardias = n.combooItems;
            },
            err => {

            }, () => {
              this.guardiasNombre = "";
              if (this.guardias != undefined && this.guardias.length > 0) {
                if (this.guardias.length > 5) {
                  this.existenGuardias = true;
                  this.guardiasNombre += this.guardias[0].label + "," + this.guardias[1].label + ","
                    + this.guardias[2].label + "," + this.guardias[3].label + "," + this.guardias[4].label + "..."
                } else {
                  this.existenGuardias = true;
                  this.guardias.forEach(element => {
                    this.guardiasNombre += element.label + ","
                  });
                  this.guardiasNombre = this.guardiasNombre.substring(0, this.guardiasNombre.length - 1);
                }
                if (this.guardias != undefined && this.guardias.length > 0) {
                  this.turnosItem.idcomboguardias = this.guardias[0].value;
                  this.getColaGuardias();
                }
              } else {
                this.existenGuardias = false;
              }
            }
          );
        if (this.body.idturno == undefined) {
          this.modoEdicion = false;
        } else {
          this.modoEdicion = true;
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
    if (this.openColaGuardias == true) {
      if (this.openFicha == false) {
        this.abreCierraFicha('colaGuardias')
      }
    }
  }

  ngOnInit() {
    this.commonsService.checkAcceso(procesos_oficio.colaDeGuardia)
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
      this.actualizarComboGuardias();
    } else {
      this.modoEdicion = false;
    }
    if (this.persistenceService.getPermisos() != true) {
      this.disableAll = true
    }
  }

  actualizarTurnosItems() {
    if (this.updateTurnosItem) {
      if (this.persistenceService.getDatos() != undefined) {
        this.turnosItem2 = this.persistenceService.getDatos();
        this.turnosItem.idordenacioncolas = this.turnosItem2.idordenacioncolas;
      }
    }

  }

  actualizarComboGuardias() {
    if (this.updateCombo) {
      this.sigaServices
        .getParam(
          "combossjcs_comboidGuardias",
          "?idTurno=" + this.idTurno
        )
        .subscribe(
          n => {
            this.guardias = n.combooItems;
          },
          err => {

          }, () => {
            this.guardiasNombre = "";
            if (this.guardias != undefined) {
              this.guardias.forEach(element => {
                this.guardiasNombre += element.label + ","
              });
              this.guardiasNombre = this.guardiasNombre.substring(0, this.guardiasNombre.length - 1);
            }
          }
        );
    }
  }

  cargarTabla(event) {
    this.turnosItem.idcomboguardias = event.value;

    if (this.turnosItem.idcomboguardias != undefined) {
      this.getColaGuardias();
    } else {
      this.datos = [];
      this.primerLetrado = "";
      this.nombreApellidosPrimerLetrado = "";
      this.ultimoLetrado = "";
      this.apeyNombreUltimo = "";
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
  fillFechaDesdeCalendar(event) {
    this.turnosItem.fechaActual = this.transformaFecha(event);
    this.getColaGuardias();
  }
  setItalic(dato) {
    if (dato.fechabajaguardia == null) return false;
    else return true;
  }
  searchHistorical() {
    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    this.getColaGuardias();
    this.selectAll = false
  }
  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }
  getColaGuardias() {
    this.turnosItem.historico = this.historico;
    //this.progressSpinner = true;
    this.sigaServices.post("turnos_busquedaColaGuardia", this.turnosItem).subscribe(
      n => {
        // this.datos = n.turnosItem;
        this.datos = JSON.parse(n.body).turnosItem;
        this.datos.forEach(element => {
          element.orden = +element.orden;
        });
        this.getSaltosYCompensaciones();
        // if (this.turnosItem.fechabaja != undefined || this.persistenceService.getPermisos() != true) {
        //   this.turnosItem.historico = true;
        // }
      },
      err => {
        this.progressSpinner = false;
      }, () => {
        this.datosInicial = JSON.parse(JSON.stringify(this.datos));
        this.progressSpinner = false;
        if (this.datos != undefined && this.datos.length > 0) {
          this.primerLetrado = this.datos[0].numerocolegiado;
          this.nombreApellidosPrimerLetrado = this.datos[0].alfabeticoapellidos + ", " + this.datos[0].nombreguardia;
          this.ultimoLetrado = this.datos[this.datos.length - 1].numerocolegiado;
          this.apeyNombreUltimo = this.datos[this.datos.length - 1].alfabeticoapellidos + ", " + this.datos[this.datos.length - 1].nombreguardia;
        }
      }
    );
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

        this.getColaGuardias();
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
    this.body.turnosItem.forEach(element => {
      element.idcomboguardias = this.turnosItem.idcomboguardias;
    });
    this.sigaServices.post("turnos_eliminateColaGuardia", this.body).subscribe(
      data => {

        this.nuevo = false;
        this.selectedDatos = [];
        this.getColaGuardias();
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
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  getCols() {
    this.cols = [
      { field: "orden", header: "administracion.informes.literal.orden", width: "15%" },
      { field: "numerocolegiado", header: "censo.busquedaClientesAvanzada.literal.nCol", width: "15%" },
      { field: "nombreguardia", header: "administracion.parametrosGenerales.literal.nombre.apellidos.coma", width: "30%" },
      { field: "fechavalidacion", header: "justiciaGratuita.oficio.turnos.fechavalidacion", width: "22%" },
      { field: "fechabajaguardia", header: "justiciaGratuita.oficio.turnos.fechaBaja", width: "20%" },
    ];

    this.colsCompensaciones = [
      { field: "numerocolegiado", header: "censo.busquedaClientesAvanzada.literal.nCol", width: "15%" },
      { field: "nombrepersona", header: "administracion.parametrosGenerales.literal.nombre.apellidos.coma", width: "30%" },
      { field: "fechavalidacion", header: "justiciaGratuita.oficio.turnos.fechavalidacion", width: "22%" }
    ];

    this.colsSaltos = [
      { field: "numerocolegiado", header: "censo.busquedaClientesAvanzada.literal.nCol", width: "15%" },
      { field: "nombrepersona", header: "administracion.parametrosGenerales.literal.nombre.apellidos.coma", width: "30%" },
      { field: "fechavalidacion", header: "justiciaGratuita.oficio.turnos.fechavalidacion", width: "22%" }
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

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }


  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
      if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechabajaguardia != undefined && dato.fechabajaguardia != null);
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

      if (evento.data.fechabajaguardia == undefined && this.historico) {
        this.selectedDatos.pop();
      }

    }
  }

  actualizaSeleccionados(selectedDatos) {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (selectedDatos != undefined) {
      this.numSelected = selectedDatos.length;
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
  /* abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = true;
  }

  cerrarFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = false;
  } */
  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (
      key == "colaGuardias" &&
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

  saltoCompensacion(){
    this.progressSpinner = true;
    this.persistenceService.setDatos(this.selectedDatos[0]);
    sessionStorage.setItem("fromTurnoOficio", "true")
    this.router.navigate(["/guardiasSaltosCompensaciones"], { queryParams: { idturno: this.selectedDatos[0].idturno, idguardia: this.selectedDatos[0].idguardias, 'idpersona': this.selectedDatos[0].idpersona, 'numerocolegiado': this.selectedDatos[0].numerocolegiado, 'letrado': `${this.selectedDatos[0].alfabeticoapellidos}, ${this.selectedDatos[0].nombreguardia}` } });
  } 

  openMultiSelect(dato) {
    // //console.log(this.multiSelect);
    dato.onPanelShow;
    // this.multiSelect.show();
    // dato.overlayVisible = true;
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  confirmUltimo() {
    let mess = this.translateService.instant(
      "justiciaGratuita.oficio.turnos.messageultletrado"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      key: "confirmDialogColaOficio",
      message: mess,
      icon: icon,
      accept: () => {
        this.marcarUltimo();
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

  marcarUltimo() {
    this.progressSpinner=true;

    let dato = new TurnosItems();
    dato = this.selectedDatos[0];
    dato.idguardias=this.turnosItem.idcomboguardias;

    this.sigaServices.post("turnos_updateUltimoGuardias", dato).subscribe(
      data => {

        var ultimaPosicion = this.datos[this.datos.length - 1];
        this.datos[this.datos.length - 1] = this.selectedDatos[0];
        this.selectedDatos[0] = ultimaPosicion;
        this.nuevo = false;
        this.selectedDatos = [];
        this.selectAll = false;

        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        
        this.progressSpinner = false;
        this.getColaGuardias();
      },
      err => {
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
      }
    );
  }

  goToSaltosYComp() {
    this.router.navigate(["/saltosYCompensaciones"], { queryParams: { idturno: this.idTurno } });
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
    filtros.idGuardia = this.turnosItem.idcomboguardias;
    this.sigaServices.postPaginado("saltosCompensacionesOficio_buscar", "?numPagina=1", filtros).subscribe(
      n => {
        let datosSaltosYComp: SaltoCompItem[] = JSON.parse(n.body).saltosCompItems.filter(item => item.fechaUso === null);
        this.datosSaltos = datosSaltosYComp.filter(datos => datos.saltoCompensacion === 'S');
        this.datosCompensaciones = datosSaltosYComp.filter(datos => datos.saltoCompensacion === 'C');
        let error = JSON.parse(n.body).error;
      });
  }
}
