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
import { procesos_oficio } from '../../../../../../permisos/procesos_oficio';
import { InscripcionesItems } from '../../../../../../models/sjcs/InscripcionesItems';
import { TreeNode } from 'primeng/api';
import { findIndex } from 'rxjs/operators';
import { Table } from 'primeng/table';
import { Checkbox } from 'primeng/primeng';
import { Router } from '@angular/router';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
@Component({
  selector: "app-tarjeta-inscripcion",
  templateUrl: "./tarjeta-inscripcion.component.html",
  styleUrls: ["./tarjeta-inscripcion.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TarjetaInscripcion implements OnInit {


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
  fechaActual;
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
  selectionMode: string = "single";
  pesosSeleccionadosTarjeta2;
  updateCombo;
  rowGroupMetadata;
  //Resultados de la busqueda
  @Input() datos: InscripcionesItems;
  @Input() modoEdicion;
  @Input() idPersona;
  @Output() seleccionadosSend = new EventEmitter<any>();

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
    private persistenceService: PersistenceService, private commonsService: CommonsService, private confirmationService: ConfirmationService) { }

  ngOnChanges(changes: SimpleChanges) {
    this.getCols();
    if (this.datos != undefined) {
      this.body = this.datos;
      this.getInscripciones();
      
      if(this.modoEdicion == true)this.disableAll = true;
      else this.disableAll = false;
      
      /* 
      if (this.idPersona != undefined) {
        
       
        this.getInscripciones();

        if (this.body.idpersona == undefined) {
          this.modoEdicion = false;
        } else {
          if (this.persistenceService.getDatos() != undefined) {
            this.datos = this.persistenceService.getDatos();
          }
          if (this.datos.fechabaja != undefined) {
            this.disableAll = true;
          }
          this.modoEdicion = true;
        }
      }
    } else {
      this.datos = new InscripcionesItems();
    } */
    // this.arreglaChecks();
    }
  }

  ngOnInit() {
   
    if (this.persistenceService.getPermisos() != true) {
      this.disableAll = true;
    }
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
    //this.getInscripciones();
    //Revisar
    /* if (this.idPersona != undefined) {
      this.modoEdicion = true;
      // this.getMaterias();
    } else {
      this.modoEdicion = false;
      this.mostrarVacio = true;
      this.numeroGuardias = 0;
    } */
    if(this.modoEdicion==false){
      this.mostrarVacio = true;
      this.numeroGuardias = 0;
    }
    if (this.persistenceService.getPermisos() != true) {
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
    body = this.datos;
    body.idpersona = this.idPersona;
    body.fechaActual = this.datos.fechaActual;
    body.observaciones = this.datos.observaciones;
    this.sigaServices.post("inscripciones_busquedaTarjetaInscripciones", body).subscribe(
      n => {
        // this.datos = n.turnosItem;
        this.inscripcionesItem = JSON.parse(n.body).inscripcionesItem;
        this.inscripcionesItem.forEach(element => {
          if(this.modoEdicion==true){
          element.selectedBoolean = true;
          element.selectedBooleanPadre = true;
          }
          else{
            element.selectedBoolean =false;
            element.selectedBooleanPadre = false;
          }
        });
        this.rowGroupMetadata = {};
        if (this.inscripcionesItem) {
          for (let i = 0; i < this.inscripcionesItem.length; i++) {

            let rowData = this.inscripcionesItem[i];
            let inscripcion = rowData.nombre_turno;
            if (i == 0) {
              this.rowGroupMetadata[inscripcion] = { index: 0, size: 1 };
            }
            else {
              let previousRowData = this.inscripcionesItem[i - 1];
              let previousRowGroup = previousRowData.nombre_turno;
              if (inscripcion === previousRowGroup)
                this.rowGroupMetadata[inscripcion].size++;
              else
                this.rowGroupMetadata[inscripcion] = { index: i, size: 1 };
            }
          }
        }
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
      }
    );
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
      { field: "nombre_turno", header: "justiciaGratuita.oficio.inscripciones.nombreturnoguardia" , width:'25%' },
      { field: "nombre_zona", header: "justiciaGratuita.maestros.zonasYSubzonas.grupoZona.cabecera",width:'15%' },
      { field: "nombre_subzona", header: "justiciaGratuita.maestros.zonasYSubzonas.zonas.cabecera", width:'15%' },
      { field: "nombre_area", header: "menu.justiciaGratuita.maestros.Area",width:'15%' },
      { field: "nombre_materia", header: "menu.justiciaGratuita.maestros.Materia",width:'15%' },
      { field: "descripcion_tipo_guardia", header: "dato.jgr.guardia.guardias.tipoGuardia" },
      // { field: "tipoguardias", header: "dato.jgr.guardia.guardias.tipoGuardia",width:'15%' },
      // { field: "ncolegiado", header: "censo.busquedaClientesAvanzada.literal.nColegiado" },
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
        this.router.navigate(["/gestionGuardias"]);
      }else if(turnoGuardia != null && turnoGuardia.indexOf('Turno') != -1){
        this.progressSpinner = true;
        let turnoItem = new TurnosItems();
        turnoItem.idturno = evento.idturno;
        turnoItem.nombre = evento.nombre_turno;
        this.persistenceService.setDatos(turnoItem);
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
   //this.selectedDatos = [];
    if (event == true) {
      rowData.selectedBoolean = true;
      if(rowData.tipoguardias == "Todas o ninguna"){
        this.inscripcionesItem.forEach(element => {
          if (element.idturno == rowData.idturno) {
            element.selectedBoolean = true;
            this.inscripcionesSelected.push(element);
          }
        });
      }
      else{
        this.inscripcionesSelected.push(rowData);
      }
      
    } 
    else {
      if(rowData.tipoguardias == "Todas o ninguna"){
        rowData.selectedBoolean = false;
        this.inscripcionesItem.forEach(element => {
          if (element.idturno == rowData.idturno) {
            element.selectedBoolean = false;
            /* let findDato = this.inscripcionesSelected.find(item => item.idguardia == element.idguardia);
            if (findDato != undefined) {
              this.inscripcionesSelected.splice(this.inscripcionesSelected.indexOf(findDato), 1);
            } */
          this.inscripcionesSelected.splice(this.inscripcionesSelected.indexOf(element), 1);
          }
        });
      }else{
        rowData.selectedBoolean = false;
        let findDato = this.inscripcionesSelected.find(item => item.idguardia == rowData.idguardia);
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
    //this.selectedDatos = [];
    let turno = new InscripcionesItems;
    turno.descripcion_tipo_guardia = rowData.descripcion_tipo_guardia;
    turno.idarea = rowData.idarea;
    turno.idmateria = rowData.idmateria;
    turno.idsubzona = rowData.idsubzona;
    turno.idturno = rowData.idturno;
    turno.idzona = rowData.idzona;
    turno.nombre_area = rowData.nombre_zona;
    turno.nombre_guardia = rowData.nombre_guardia;
    turno.nombre_materia = rowData.nombre_materia;
    turno.nombre_turno = rowData.nombre_turno;
    turno.nombre_zona = rowData.nombre_zona;
    turno.obligatoriedad_inscripcion = rowData.obligatoriedad_inscripcion;
    turno.tipoguardias = rowData.tipoguardias;
    if (event == true) {
      if (rowData.tipoguardias == "Obligatorias") {
        this.disabledGuardias = true;
        rowData.selectedBooleanPadre = true;
        this.inscripcionesItem.forEach(element => {
          if (element.idturno == rowData.idturno) {
            element.selectedBoolean = true;
            this.inscripcionesSelected.push(element);
          }
      });
      }
      if (rowData.tipoguardias == "Todas o ninguna") {
        this.disabledGuardias = false;
        rowData.selectedBooleanPadre = true;
        this.inscripcionesItem.forEach(element => {
          if (element.idturno == rowData.idturno) {
            element.selectedBoolean = true;
            this.inscripcionesSelected.push(element);
          }
        });
      }
      if(rowData.tipoguardias == "A elegir"){
        this.disabledGuardias = false;
        rowData.selectedBooleanPadre = true;
      }
      this.inscripcionesSelected.push(turno);
      /* this.inscripcionesSelected[this.inscripcionesSelected.length-1].idguardia=null;
      this.inscripcionesSelected[this.inscripcionesSelected.length-1].nombre_guardia=null; */
    } else {
      this.disabledGuardias = true;
      rowData.selectedBooleanPadre = false;
      this.inscripcionesItem.forEach(element => {
        if (element.idturno == rowData.idturno) {
          element.selectedBoolean = false;
          //let findDato = this.inscripcionesSelected.find(item => item.idguardia == element.idguardia);
          //if (findDato != undefined) {
          //  this.inscripcionesSelected.splice(this.inscripcionesSelected.indexOf(findDato), 1);
          //}
          let n=0;
          this.inscripcionesSelected.forEach(item => {
            if(item.idturno==element.idturno){
              delete this.inscripcionesSelected[this.inscripcionesSelected.indexOf(item)];
              n++;
            }
          })
          this.inscripcionesSelected  = this.inscripcionesSelected.filter(function () { return true });
        }
      });

    }
    let send = {
      inscripcionesSelected: this.inscripcionesSelected,
   }
    this.seleccionadosSend.emit(send);
  }
}
