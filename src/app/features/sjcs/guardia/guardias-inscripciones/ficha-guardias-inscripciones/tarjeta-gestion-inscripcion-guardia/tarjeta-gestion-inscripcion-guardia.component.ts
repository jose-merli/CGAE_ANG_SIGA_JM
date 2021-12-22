import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
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
import { GuardiaObject } from '../../../../../../models/sjcs/GuardiaObject';
import { PartidasObject } from '../../../../../../models/sjcs/PartidasObject';
import { MultiSelect } from '../../../../../../../../node_modules/primeng/primeng';
import { procesos_guardia } from '../../../../../../permisos/procesos_guarida';
import { InscripcionesItems } from '../../../../../../models/sjcs/InscripcionesItems';
import { TarjetaGestionInscripcionItem } from '../../../../../../models/sjcs/TarjetaGestionInscripcionItem';
import { TreeNode } from 'primeng/api';
import { findIndex } from 'rxjs/operators';
import { Table } from 'primeng/table';
import { Checkbox } from 'primeng/primeng';
import { procesos_oficio } from '../../../../../../permisos/procesos_oficio';
import { DatePipe } from '@angular/common';
import { ResultadoInscripciones } from '../../ResultadoInscripciones.model';


@Component({
  selector: 'app-tarjeta-gestion-inscripcion-guardia',
  templateUrl: './tarjeta-gestion-inscripcion-guardia.component.html',
  styleUrls: ['./tarjeta-gestion-inscripcion-guardia.component.scss']
})
export class TarjetaGestionInscripcionGuardiaComponent implements OnInit {


  openFicha: boolean = false;
  textSelected: String = "{label}";
  isLetrado: boolean = false;
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  cols;
  rowsPerPage;
  historico: boolean = false;
  valorCheckUsuarioAutomatico: boolean = false;
  listaTabla: TurnosItems = new TurnosItems();
  fechaActual;
  disableAll: boolean = false;
  comboJurisdicciones: any[] = [];
  bodyInicial: InscripcionesItems;
  apeyNombreUltimo;
  mostrarDatos: boolean = false;
  mostrarNumero: boolean = false;
  mostrarVacio: boolean = false;
  progressSpinner: boolean = false;
  msgs;
  permisosTarjeta: boolean = true;
  body;
  filas: TarjetaGestionInscripcionItem[] = [];
  inscripcionesItem;
  nuevo: boolean = false;
  datosInicial = [];
  updateAreas = [];
  showTarjeta: boolean = true;
  nombreGuardia;
  numeroGuardias;
  duracionGuardias;
  datos2;
  disabledGuardias: boolean = true;
  nletradosGuardias;
  overlayVisible: boolean = false;
  selectionMode: string = "single";
  pesosSeleccionadosTarjeta2;
  updateCombo;
  rowGroupMetadata;
  //Resultados de la busqueda
  @Input() datos: InscripcionesItems;
  @Input() modoEdicion;
  @Input() idPersona;
  // @Input() pesosSeleccionadosTarjeta;
  //Resultados de la busqueda
  // @Input() modoEdicion: boolean = false;

  @ViewChild("table") table: Table;
  @ViewChild("checkPadre") checkPadre: Checkbox;
  @ViewChild("multiSelect") multiSelect: MultiSelect;
  inscripcionesDatosEntradaItem; //: ResultadoInscripciones = new ResultadoInscripciones("");
  
  constructor(    private datepipe: DatePipe,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices, private translateService: TranslateService, private upperCasePipe: UpperCasePipe,
    private persistenceService: PersistenceService, private commonsService: CommonsService, private confirmationService: ConfirmationService) { }

  ngOnChanges(changes: SimpleChanges) {
    this.getCols();
    if (this.datos != undefined) {

      // this.getInscripciones();
      if (this.persistenceService.getDatos() != undefined) {
        this.datos = this.persistenceService.getDatos();
        this.body = this.datos;
      }
      //this.busqueda();
      this.modoEdicion = true;

    } else {
      this.datos = new InscripcionesItems();
    }
    // this.arreglaChecks();
  }

  ngOnInit() {

    if (this.persistenceService.getDatos() != undefined) {
      this.datos = this.persistenceService.getDatos();
    }

    if (this.persistenceService.getPermisos() != true) {
      this.disableAll = true;
    }
    this.commonsService.checkAcceso(procesos_oficio.tarjetaGestionInscripcion)
      .then(respuesta => {
        this.permisosTarjeta = respuesta;
        if (this.permisosTarjeta != true) {
          this.permisosTarjeta = false;
        } else {
          this.permisosTarjeta = true;
        }
      }).catch(error => console.error(error));
    this.getCols();
    if (this.persistenceService.getPermisos() != true) {
      this.disableAll = true
    }

    //this.persistenceService.getDatos();
    this.busqueda();


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

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);

  }

  changeDateFormat(date1){
    // date1 dd/MM/yyyy
    let date1C = date1.split("/").reverse().join("-")
    return date1C;
  }

  rellenarObjetoBack(obj) {
    let objeto =
    {
      'idturno': obj.idturno,
      'estado': obj.estado,
      'abreviatura': obj.abreviatura,
      'validarinscripciones': obj.validarinscripciones,
      'validarjustificaciones': null,
      'nombreGuardia': null,
      'descripcionGuardia': null,
      'idguardia': obj.idguardia,
      'apellidosnombre': obj.apellidosnombre,
      'ncolegiado': obj.ncolegiado,
      'nombre': null,
      'apellidos': obj.apellidos,
      'apellidos2': obj.apellidos2,
      'idinstitucion': obj.idinstitucion,
      'idpersona': obj.idpersona,
      'fechasolicitud': (obj['fechasolicitud'] != null && obj['fechasolicitud'] != undefined) ? new Date(this.formatDateSol(obj['fechasolicitud'])) : obj['fechasolicitud'],
      'observacionessolicitud': obj.observacionessolicitud,
      'fechavalidacion':  (obj['fechavalidacion'] != null && obj['fechavalidacion'] != undefined) ? new Date(this.changeDateFormat(obj['fechavalidacion'])) : obj['fechavalidacion'],
      'observacionesvalidacion': obj.observacionesvalidacion,
      'fechasolicitudbaja': (obj['fechasolicitudbaja'] != null) ? new Date(this.changeDateFormat(obj['fechasolicitudbaja'])) : obj['fechasolicitudbaja'],
      'observacionesbaja': obj.observacionesbaja,
      'fechabaja': (obj['fechabaja'] != null && obj['fechabaja'] != undefined) ? new Date(this.changeDateFormat(obj['fechabaja'])) : obj['fechabaja'],
      'observacionesvalbaja': obj.observacionesvalbaja,
      'fechadenegacion': (obj['fechadenegacion'] != null && obj['fechadenegacion'] != undefined) ? new Date(this.changeDateFormat(obj['fechadenegacion'])) : obj['fechadenegacion'],
      'observacionesdenegacion': obj.observacionesdenegacion,
      'fechavaloralta': obj.fechavaloralta, // (obj['fechavaloralta'] != null && obj['fechavaloralta'] != undefined) ? this.formatDate(obj['fechavaloralta']).toString() : this.formatDate(obj['fechavaloralta']),
      'fechavalorbaja': obj.fechavalorbaja, //(obj['fechavalorbaja'] != null && obj['fechavalorbaja'] != undefined) ? this.formatDate(obj['fechavalorbaja']).toString() : this.formatDate(obj['fechavalorbaja']),
      'code': null,
      'message': null,
      'description': null,
      'infoURL': null,
      'errorDetail': null
    };

    return new ResultadoInscripciones(objeto);
  }
	formatDateSol(date) {
		const pattern = 'dd/MM/yyyy hh:mm:ss';
		return this.datepipe.transform(date, pattern);
	
	  }
  busqueda() { //MIRAR DONDE SE LLAMA
    this.progressSpinner = true;
    let objVal: ResultadoInscripciones = this.rellenarObjetoBack(this.datos);

    if(this.datos.idturno != null ||
      this.datos.idturno != undefined){
      this.sigaServices.post("guardiasInscripciones_TarjetaGestionInscripciones", objVal).subscribe(
        n => {
          //CREAR UN DTO IGUAL QUE LO QUE ME MANDA EL BACK Y RECOGERLO AQUÍ?
          this.datos2 = JSON.parse(n.body).inscripcionesTarjetaItem; //mirar en el html que pone dato.---- (¿poner datos2?)
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
          //console.log(err);
        }, () => {
          this.progressSpinner = false;
        }
      );
    }
    this.progressSpinner = false;
  }
  fillFechaDesdeCalendar(event) {
    this.datos.fechaActual = this.transformaFecha(event);
    // this.getColaOficio();
  }
  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }
  searchHistorical() {
    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    this.selectAll = false
  }
  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  /*save() {
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

  }*/

  callSaveService(url) {

    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (this.nuevo) {
          this.nuevo = false;
          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
        }

        // this.getColaOficio();
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

    this.progressSpinner = false;
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
    this.body = new GuardiaObject();
    this.body.guardiaItems = this.selectedDatos;

    this.sigaServices.post("turnos_eliminateGuardia", this.body).subscribe(
      data => {

        this.nuevo = false;
        this.selectedDatos = [];
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
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
      },
      () => {
        let send = {
          buscar: true,
        }
        this.sigaServices.notifyupdateCombo(send);
        this.progressSpinner = false;
        this.selectAll = false;
      }
    );
  }

  rest() {
    if (this.datosInicial != undefined) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      // this.datos = [];
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

  onRowSelect(event) {
    if (event != null) {

    }
  }

  getCols() {

    this.cols = [
      { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha"},
      { field: "accion", header: "justiciaGratuita.oficio.inscripciones.accion"},
      { field: "observacion", header: "gratuita.mantenimientoLG.literal.observaciones"},
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
      this.selectedDatos = this.body;
      this.numSelected = this.body.length;
      if (this.historico) {
        this.selectedDatos = this.body.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null);
      } else {
        this.selectedDatos = this.body;
      }
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }
  editElementDisabled() {
    this.body.forEach(element => {
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

      if (evento.data.fechabaja == undefined && this.historico) {
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
    // let fichaPosible = this.fichasPosibles.filter(elto => {
    //   return elto.key === key;
    // });
    // if (fichaPosible && fichaPosible.length) {
    //   return fichaPosible[0];
    // }
    // return {};
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
    // //console.log(this.multiSelect);
    dato.onPanelShow;
    // this.multiSelect.show();
    // dato.overlayVisible = true;
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }
}