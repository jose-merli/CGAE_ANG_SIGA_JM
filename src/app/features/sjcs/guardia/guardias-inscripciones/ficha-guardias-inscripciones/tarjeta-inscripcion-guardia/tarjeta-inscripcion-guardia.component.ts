import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { DatePipe, Location, UpperCasePipe } from "@angular/common";
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
import { TreeNode } from 'primeng/api';
import { findIndex } from 'rxjs/operators';
import { Table } from 'primeng/table';
import { Checkbox } from 'primeng/primeng';
import { Router } from '@angular/router';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
import { procesos_oficio } from '../../../../../../permisos/procesos_oficio';
import { ResultadoInscripciones } from '../../ResultadoInscripciones.model';



@Component({
  selector: 'app-tarjeta-inscripcion-guardia',
  templateUrl: './tarjeta-inscripcion-guardia.component.html',
  styleUrls: ['./tarjeta-inscripcion-guardia.component.scss']
})
export class TarjetaInscripcionGuardiaComponent implements OnInit {

  infoParaElPadre: { fechasolicitudbajaSeleccionada: any; fechaActual: any; observaciones: any; id_persona: any; idturno: any, idinstitucion: any, idguardia: any, fechasolicitud: any, fechavalidacion: any, fechabaja: any, observacionessolicitud: any, observacionesbaja: any, observacionesvalidacion: any, observacionesdenegacion: any, fechadenegacion: any, observacionesvalbaja: any, fechavaloralta: any, fechavalorbaja: any, validarinscripciones: any, estado: any }[];

  openFicha: boolean = false;
  textSelected: String = "{label}";
  isLetrado: boolean = false;
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  inscripcionesSelected = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  cols;
  rowsPerPage;
  historico: boolean = false;
  valorCheckUsuarioAutomatico: boolean = false;
  listaTabla: TurnosItems = new TurnosItems();
  fechaActual: Date = new Date();
  disableAll: boolean = false;
  comboJurisdicciones: any[] = [];
  bodyInicial: TurnosItems;
  apeyNombreUltimo;
  mostrarDatos: boolean = false;
  mostrarNumero: boolean = false;
  mostrarVacio: boolean = false;
  progressSpinner: boolean = false;
  msgs;
  permisosTarjeta: boolean = true;
  body;
  inscripcionesItem;
  nuevo: boolean = false;
  datosInicial = [];
  updateAreas = [];
  showTarjeta: boolean = true;
  nombreGuardia;
  numeroGuardias;
  duracionGuardias;
  disabledGuardias: boolean = true;
  nletradosGuardias;
  overlayVisible: boolean = false;
  selectionMode: string = "none";
  pesosSeleccionadosTarjeta2;
  updateCombo;
  rowGroupMetadata;
  buscadores = [];
  //Resultados de la busqueda
  @Input() datos: InscripcionesItems;
  @Input() modoEdicion;
  @Input() idPersona;
  @Output() seleccionadosSend = new EventEmitter<any>();
  @Output() resultado = new EventEmitter<{}>(); //mirar que creo que es input


  // @Input() pesosSeleccionadosTarjeta;
  //Resultados de la busqueda
  // @Input() modoEdicion: boolean = false;
  @ViewChild("table") table: Table;
  @ViewChild("checkPadre") checkPadre: Checkbox;
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
      key: "tarjetainscripciones",
      activa: true
    },
  ];
  constructor(private changeDetectorRef: ChangeDetectorRef, private router: Router,
    private sigaServices: SigaServices, private translateService: TranslateService, private upperCasePipe: UpperCasePipe,
    private persistenceService: PersistenceService, private commonsService: CommonsService, private confirmationService: ConfirmationService, private datepipe: DatePipe) { }

  /*  ngOnChanges(changes: SimpleChanges) {
     this.getCols();
     if (this.datos != undefined) {
       this.body = this.datos;
       this.getInscripciones();
       
       if(this.modoEdicion == true)
          this.disableAll = true;  
        else 
          this.disableAll = false;
 
     }
   } */

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_oficio.tarjetaInscripcion)
      .then(respuesta => {
        this.permisosTarjeta = respuesta;
        if (this.permisosTarjeta != true) {
          this.permisosTarjeta = false;
        } else {
          this.permisosTarjeta = true;
        }
      }).catch(error => console.error(error));
    this.getCols();
    this.getInscripciones();
    //Revisar
    /* if (this.idPersona != undefined) {
      this.modoEdicion = true;
      // this.getMaterias();
    } else {
      this.modoEdicion = false;
      this.mostrarVacio = true;
      this.numeroGuardias = 0;
    } */
    if (this.modoEdicion == false) {
      this.mostrarVacio = true;
      this.numeroGuardias = 0;
    }
    if (this.permisosTarjeta != true) {
      this.disableAll = true
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

  changeDateFormat(date1) {
    let date1C = date1;
    // date1 dd/MM/yyyy
    if (!isNaN(Number(date1))) {
      date1C = date1.split("/").reverse().join("-");
    }

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
      'fechavalidacion': (obj['fechavalidacion'] != null && obj['fechavalidacion'] != undefined) ? new Date(this.formatDateSol(obj['fechavalidacion'])) : obj['fechavalidacion'],
      'observacionesvalidacion': obj.observacionesvalidacion,
      'fechasolicitudbaja': (obj['fechasolicitudbaja'] != null && obj['fechasolicitudbaja'] != undefined) ? new Date(this.formatDateSol(obj['fechasolicitudbaja'])) : obj['fechasolicitudbaja'],
      'observacionesbaja': obj.observacionesbaja,
      'fechabaja': (obj['fechabaja'] != null && obj['fechabaja'] != undefined) ? new Date(this.formatDateSol(obj['fechabaja'])) : obj['fechabaja'],
      'observacionesvalbaja': obj.observacionesvalbaja,
      'fechadenegacion': (obj['fechadenegacion'] != null && obj['fechadenegacion'] != undefined) ? new Date(this.formatDateSol(obj['fechadenegacion'])) : obj['fechadenegacion'],
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
    if (date != undefined && isNaN(Number(date))) {
      if (!date.includes('/')) {
        return this.datepipe.transform(date, pattern);
      }
    }


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
  getInscripciones() {
    this.datos.historico = this.historico;
    this.progressSpinner = true;
    let body = new InscripcionesItems();
    let nombreTurnoAux;
    body = this.datos;
    body.idpersona = this.idPersona;
    // body.fechaActual = this.datos.fechaActual;
    // body.observaciones = this.datos.observaciones;
    //this.progressSpinner = false;

    let objVal: ResultadoInscripciones = this.rellenarObjetoBack(this.datos);

    if (this.modoEdicion == true) {
      this.sigaServices.post("guardiasInscripciones_inscripcionPorguardia", objVal).subscribe(
        n => {

          this.inscripcionesItem = JSON.parse(n.body).accion;
          if (this.inscripcionesItem != null || this.inscripcionesItem != undefined) {
            this.inscripcionesItem.forEach(element => {
              if (this.modoEdicion == true) {
                element.selectedBoolean = true;
                element.selectedBooleanPadre = true;
              } else {
                element.selectedBoolean = false;
                element.selectedBooleanPadre = false;
              }
            });
          }
          
          this.inscripcionesItem.forEach(item => {
            if (nombreTurnoAux != item.nombreTurno) {
              item.turnoPrincipal = true;
            } else {
              item.turnoPrincipal = false;
            }
            nombreTurnoAux = item.nombreTurno;
          });

          this.rowGroupMetadata = {};
          if (this.inscripcionesItem) {
            for (let i = 0; i < this.inscripcionesItem.length; i++) {

              let rowData = this.inscripcionesItem[i];
              let inscripcion = rowData.nombreTurno;
              if (i == 0) {
                this.rowGroupMetadata[inscripcion] = { index: 0, size: 1 };
              }
              else {
                let previousRowData = this.inscripcionesItem[i - 1];
                let previousRowGroup = previousRowData.nombreTurno;
                if (inscripcion === previousRowGroup)
                  this.rowGroupMetadata[inscripcion].size++;
                else
                  this.rowGroupMetadata[inscripcion] = { index: i, size: 1 };
              }
            }
          }
          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        }, () => {
          this.progressSpinner = false;
        }
      );
    } else {
      this.sigaServices.post("guardiasInscripciones_inscripcionesDisponibles", objVal).subscribe(
        n => {

          this.inscripcionesItem = JSON.parse(n.body).accion;
          if (this.inscripcionesItem != null || this.inscripcionesItem != undefined) {
            this.inscripcionesItem.forEach(element => {
              if (this.modoEdicion == true) {
                element.selectedBoolean = true;
                element.selectedBooleanPadre = true;
              } else {
                element.selectedBoolean = false;
                element.selectedBooleanPadre = false;
              }
	      if(element.idTurno == null || element.idTurno == undefined){
                element.idTurno = element.idturno;
              }
              if(element.idturno == null || element.idturno == undefined){
                element.idturno = element.idTurno;
              }
            });
          }
          
          this.inscripcionesItem.forEach(item => {
            if (nombreTurnoAux != item.nombreTurno) {
              item.turnoPrincipal = true;
            } else {
              item.turnoPrincipal = false;
            }
            nombreTurnoAux = item.nombreTurno;
          });

          this.rowGroupMetadata = {};
          if (this.inscripcionesItem) {
            for (let i = 0; i < this.inscripcionesItem.length; i++) {
              let rowData = this.inscripcionesItem[i];
              let inscripcion = rowData.nombreTurno;
              if (i == 0) {
                this.rowGroupMetadata[inscripcion] = { index: 0, guardias: [rowData] };
              }
              else {
                let previousRowData = this.inscripcionesItem[i - 1];
                let previousRowGroup = previousRowData.nombreTurno;
                if (inscripcion === previousRowGroup)
                  this.rowGroupMetadata[inscripcion].guardias.push(rowData);
                else
                  this.rowGroupMetadata[inscripcion] = { index: i, guardias: [rowData] };
              }
            }
          }


          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        }, () => {
          this.progressSpinner = false;
        }
      );

    }

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

  // onRowSelect(event) {
  //   if (event != null) {     
  //     let send = {
  //        prueba: this.selectedDatos,
  //     }
  //    this.seleccionadosSend.emit(send);
  //   }
  // }

  getCols() {

    this.cols = [
      { field: "nombreTurno", header: "justiciaGratuita.oficio.inscripciones.nombreturnoguardia", width: '25%' },
      { field: "nombreZona", header: "justiciaGratuita.maestros.zonasYSubzonas.grupoZona.cabecera", width: '15%' },
      { field: "nombreSubzona", header: "justiciaGratuita.maestros.zonasYSubzonas.zonas.cabecera", width: '15%' },
      { field: "nombreArea", header: "menu.justiciaGratuita.maestros.Area", width: '15%' },
      { field: "nombreMateria", header: "menu.justiciaGratuita.maestros.Materia", width: '15%' },
      // { field: "descripcion_tipo_guardia", header: "dato.jgr.guardia.guardias.tipoGuardia" },
      { field: "descripcionObligatoriedad", header: "dato.jgr.guardia.guardias.tipoGuardia", width: '15%' },
      //{ field: "colegiadoGrupo", header: "dato.jgr.guardia.saltcomp.ncolegiadoGrupo", width: '15%' },
    ];

    this.cols.forEach(it => this.buscadores.push(""));

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
      this.selectedDatos = this.inscripcionesItem;
      this.numSelected = this.inscripcionesItem.length;
      /*  if (this.historico) {
          this.selectedDatos = this.body.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null);
        } else {
          this.selectedDatos = this.body;
        }*/
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
  openTab(evento, turnoGuardia: String) {
    if (!this.selectAll && !this.selectMultiple) {
      sessionStorage.setItem("Inscripciones",  JSON.stringify(this.datos));
      if(turnoGuardia != null && turnoGuardia.indexOf('Guardia') != -1 ){
        this.progressSpinner = true;
        let guardiaItem = new GuardiaItem();
        guardiaItem.idGuardia = evento.idGuardia;
        guardiaItem.idTurno = evento.idTurno;
        this.persistenceService.setDatos(guardiaItem);
        this.persistenceService.setHistorico(evento.fechabaja ? true : false);
        this.progressSpinner = false;
        this.router.navigate(["/gestionGuardias"]);
      }else if(turnoGuardia != null && turnoGuardia.indexOf('Turno') != -1){
        this.progressSpinner = true;
        let turnoItem = new TurnosItems();
        turnoItem.idturno = evento.idTurno;
        turnoItem.nombre = evento.nombreTurno;
        this.persistenceService.setDatos(turnoItem);
        this.progressSpinner = false;
        this.router.navigate(["/gestionTurnos"], { queryParams: { idturno: evento.idturno } });
      }
      
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
      this.openFicha = !this.openFicha;
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
  seleccionarFila(rowData, event) {

    /* comprobar el estado que viene y cambiarlo.
             si viene a false:
                - se debe de eliminar del selected datos, por lo que hay que buscarlo en este y eliminarlo del array
            si viene a true: 
                - se debe de añadir a selecteddatos.
    */
    if (event == true) {
      rowData.selectedBoolean = true;
      //Guardias Todas o ninguna y Obligatorias, si se marca una se marcan todas
      if(rowData.obligatoriedadInscripcion == 1 || rowData.obligatoriedadInscripcion == 0){
        this.inscripcionesItem.forEach(element => {
          let findDato = this.inscripcionesSelected.find(item => item.idGuardia == element.idGuardia);
          if (element.idTurno == rowData.idTurno && (findDato == null || findDato == undefined)) {
            element.selectedBoolean = true;
              this.inscripcionesSelected.push(element);
          }
        });
      }
      else{//Guardias a elegir, se selecciona sólo la que se ha marcado
        this.inscripcionesSelected.push(rowData);
      }
      
    } 
    else {
      //Guardias todas o ninguna y obligatorias: se desmarcan todas
      if(rowData.obligatoriedadInscripcion == 1 || rowData.obligatoriedadInscripcion == 0){
        rowData.selectedBoolean = false;
        this.inscripcionesItem.forEach(element => {
          if (element.idTurno == rowData.idTurno) {
            element.selectedBoolean = false;
            
          this.inscripcionesSelected.splice(this.inscripcionesSelected.indexOf(element), 1);
          }
        });
      }else{//Guardias a elegir, se desmarca sólo la desmarcada
        rowData.selectedBoolean = false;
        let findDato = this.inscripcionesSelected.find(item => item.idGuardia == rowData.idGuardia);
        if (findDato != undefined) {
          this.inscripcionesSelected.splice(this.inscripcionesSelected.indexOf(findDato), 1);
        }
      }
    }
    let send = {
      inscripcionesSelected: this.inscripcionesSelected,
    }
    this.seleccionadosSend.emit(send);
  }

  seleccionarPadre(rowData, event) {
    let turno = new InscripcionesItems;
    turno.descripcion_tipo_guardia = rowData.descripcion_tipo_guardia;
    turno.idarea = rowData.idArea;
    turno.idmateria = rowData.idMateria;
    turno.idsubzona = rowData.idSubzona;
    turno.idturno = rowData.idturno;
    turno.idzona = rowData.idZona;
    turno.nombre_area = rowData.nombreZona;
    turno.nombre_guardia = rowData.nombreGuardia;
    turno.nombre_materia = rowData.nombreMateria;
    turno.nombre_turno = rowData.nombreTurno;
    turno.nombre_zona = rowData.nombreZona;
    turno.obligatoriedad_inscripcion = rowData.obligatoriedadInscripcion;
    turno.tipoguardias = rowData.descripcionbligatoriedad;
    //turno.idguardia = rowData.idGuardia;
    turno.fechasolicitud = rowData.fechasolicitud;
    if (event == true) {
      //Guardias Todas o ninguna y obligatorias
      if(rowData.obligatoriedadInscripcion == 1 || rowData.obligatoriedadInscripcion == 0){ 
        rowData.selectedBooleanPadre = true;
        //Guardias obligatorias: Se marcan todas las guardias
        if(rowData.obligatoriedadInscripcion == 0){
          this.disabledGuardias = true;
          this.inscripcionesItem.forEach(element => {
            if (element.idTurno == rowData.idTurno){
              let findDato = this.inscripcionesSelected.find(item => item.idGuardia  == element.idGuardia);
              if(findDato == null || findDato == undefined) {
                element.selectedBoolean = true;
                  this.inscripcionesSelected.push(element);
              }
            }
          });
        }else{ //Guardias todas o ninguna: se dejan como seleccionables para que se seleccionen manualmente
          this.disabledGuardias = false;
        }
      }

      //Guardias a elegir
      if (rowData.obligatoriedadInscripcion == 2) {
        this.disabledGuardias = false;
        rowData.selectedBooleanPadre = true;
      }
      //Se añade el turno a los elementos seleccionados
      this.inscripcionesSelected.push(turno);
    } else {
      //Si se desmarca el turno hay que quitar todas sus guardias de los elementos seleccionados
      this.disabledGuardias = true;
      rowData.selectedBooleanPadre = false;
      this.inscripcionesItem.forEach(element => {
        if (element.idTurno == rowData.idTurno){
          let findDato = this.inscripcionesSelected.find(item => item.idGuardia == element.idGuardia);
          if (findDato != undefined) {
            element.selectedBoolean = false;
            this.inscripcionesSelected.splice(this.inscripcionesSelected.indexOf(findDato), 1);
          }
        }
      });

      //quitamos el turno de los elementos seleccionados ya que se ha desmarcado el turno
      let findDato = this.inscripcionesSelected.find(item => item.idguardia == turno.idguardia);
      if (findDato != undefined) {
        this.inscripcionesSelected.splice(this.inscripcionesSelected.indexOf(findDato), 1);
      }
    }
    let send = {
      inscripcionesSelected: this.inscripcionesSelected,
   }
    this.seleccionadosSend.emit(send);
  }
  
}
