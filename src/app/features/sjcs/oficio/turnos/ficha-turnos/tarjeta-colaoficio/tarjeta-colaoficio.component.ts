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
@Component({
  selector: "app-tarjeta-colaoficio",
  templateUrl: "./tarjeta-colaoficio.component.html",
  styleUrls: ["./tarjeta-colaoficio.component.scss"]
})
export class TarjetaColaOficio implements OnInit {


  openFicha: boolean = false;
  textSelected: String = "{label}";

  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  cols;
  rowsPerPage;
  historico: boolean = false;
  datos: any[];
  listaTabla: TurnosItems = new TurnosItems();
  fechaActual;
  disableAll: boolean = false;
  comboJurisdicciones: any[] = [];
  bodyInicial: TurnosItems;

  progressSpinner: boolean = false;
  msgs;
  body;
  nuevo: boolean = false;
  datosInicial = [];
  updateAreas = [];
  showTarjeta: boolean = true;
  // selectedBefore;
  overlayVisible: boolean = false;
  selectionMode: string = "single";
  pesosSeleccionadosTarjeta2;
  //Resultados de la busqueda
  @Input() turnosItem: TurnosItems;
  @Input() modoEdicion;
  @Input() idTurno;
  // @Input() pesosSeleccionadosTarjeta;
  //Resultados de la busqueda
  // @Input() modoEdicion: boolean = false;

  @ViewChild("table") table;
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
    private persistenceService: PersistenceService, private confirmationService: ConfirmationService) { }

  ngOnChanges(changes: SimpleChanges) {
    this.getCols();
    if (this.turnosItem != undefined) {
      if (this.idTurno != undefined) {
        this.turnosItem.fechaActual = new Date();
        this.body = this.turnosItem;
        this.turnosItem.idturno = this.idTurno;
        this.getMaterias();
        this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
        if (this.body.idturno == undefined) {
          this.modoEdicion = false;
        } else {
          this.modoEdicion = true;
        }
      }
    } else {
      this.turnosItem = new TurnosItems();
    }
    // this.arreglaChecks();
  }

  ngOnInit() {
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
    // if (this.persistenceService.getPermisos() != true) {
    //   this.disableAll = true;
    // }
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
    this.getMaterias();
  }
  setItalic(dato) {
    if (dato.fechabajapersona == null) return false;
    else return true;
  }
  searchHistorical() {
    this.historico = this.turnosItem.historico;
    this.historico = !this.historico;
    this.turnosItem.historico = !this.turnosItem.historico;
    this.persistenceService.setHistorico(this.turnosItem.historico);
    this.getMaterias();
    this.selectAll = false
  }
  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }
  getMaterias() {
    this.progressSpinner = true;
    this.sigaServices.post("turnos_busquedaColaOficio", this.turnosItem).subscribe(
      n => {
        // this.datos = n.turnosItem;
        this.datos = JSON.parse(n.body).turnosItem;
        if (this.turnosItem.fechabaja != undefined || this.persistenceService.getPermisos() != true) {
          this.turnosItem.historico = true;
        }
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
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

        this.getMaterias();
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
        this.getMaterias();
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
      { field: "orden", header: "administracion.informes.literal.orden" },
      { field: "numerocolegiado", header: "censo.busquedaClientesAvanzada.literal.nColegiado" },
      { field: "nombrepersona", header: "administracion.parametrosGenerales.literal.nombre" },
      // { field: "alfabeticoapellidos", header: "administracion.parametrosGenerales.literal.nombre" },
      { field: "fechavalidacion", header: "justiciaGratuita.oficio.turnos.fechavalidacion" },
      { field: "saltos", header: "justiciaGratuita.oficio.turnos.saltos" },
      { field: "compensaciones", header: "justiciaGratuita.oficio.turnos.compensaciones" }
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
    if (this.selectAll) {
      this.selectMultiple = true;

      if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechabajapersona != undefined && dato.fechabajapersona != null);
        this.selectMultiple = true;
        this.selectionMode = "single";
      } else {
        this.selectedDatos = this.datos;
        this.selectMultiple = false;
        this.selectionMode = "single";
      }

      if (this.selectedDatos != undefined && this.selectedDatos.length > 0) {
        this.selectMultiple = true;
        this.numSelected = this.selectedDatos.length;
      }
      this.numSelected = this.datos.length;
      this.selectionMode = "multiple";
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      if (this.historico)
        this.selectMultiple = true;
      this.selectionMode = "multiple";
    }
  }
  editElementDisabled() {
    this.datos.forEach(element => {
      element.editable = false
      element.overlayVisible = false;
    });
  }
  isSelectMultiple() {
    this.editElementDisabled();
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

  actualizaSeleccionados(selectedDatos) {
    if (selectedDatos != undefined)
      this.numSelected = selectedDatos.length;
    // this.seleccion = false;
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
  abreCierraFicha() {
    if (this.modoEdicion) {
      this.openFicha = !this.openFicha;
    } else {
      this.openFicha = false;
    }
  }
  openMultiSelect(dato) {
    // console.log(this.multiSelect);
    dato.onPanelShow;
    // this.multiSelect.show();
    // dato.overlayVisible = true;
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }
}
