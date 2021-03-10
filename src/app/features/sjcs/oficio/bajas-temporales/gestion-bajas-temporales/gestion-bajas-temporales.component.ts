import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import {  DatePipe } from '../../../../../../../node_modules/@angular/common';
import { PartidasObject } from '../../../../../models/sjcs/PartidasObject';
import { DataTable } from 'primeng/primeng';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { CommonsService } from '../../../../../_services/commons.service';
import { BajasTemporalesItem } from '../../../../../models/sjcs/BajasTemporalesItem';


@Component({
  selector: 'app-gestion-bajas-temporales',
  templateUrl: './gestion-bajas-temporales.component.html',
  styleUrls: ['./gestion-bajas-temporales.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TablaBajasTemporalesComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  colsPartidoJudicial;
  msgs;
  partidoJudicial;
  id;

  datosInicial = [];
  editMode: boolean = false;
  selectedBefore;
  buscadores = [];
  updatePartidasPres = [];
  disabledSolicitarBaja: boolean = false;
  disabledValidar: boolean = false;
  disabledDenegar: boolean = false;
  body;
  partidasJudiciales: any[] = [];
  updateBajasTemporales = [];
  selectedItem: number = 10;
  selectAll;
  selectedDatos: any[] = [];
  selectedDatosCopy: any[] = [];
  numSelected = 0;
  isLetrado:boolean = false;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;
  sortO: number = 1;
  message;
  public ascNumberSort = true;
  permisos: boolean = false;
  initDatos;
  fechaDeHoy;
  nuevo: boolean = false;
  progressSpinner: boolean = false;
  selectionMode: string = "single";
  first = 0;
  comboTipo = [
    { label: "Vacaciones", value: "V" },
    { label: "Maternidad", value: "M" },
    { label: "Baja", value: "B" },
    { label: "Suspensión por sanción", value: "S" }
  ];
  //Resultados de la busqueda
  @Input() datos;

  //Combo partidos judiciales
  comboPJ;

  @Output() searchPartidas = new EventEmitter<boolean>();

  @ViewChild("table") tabla: DataTable;
  rows: any;
  sort: (compareFn?: (a: any, b: any) => number) => any[];

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService
  ) { }

  ngOnInit() {
    if (
      sessionStorage.getItem("isLetrado") != null &&
      sessionStorage.getItem("isLetrado") != undefined
    ) {
      this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    }
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

        this.selectedDatos = [];
        this.selectedDatos.push(evento.data);
      
        this.datos.forEach(element => {
          element.fechadesde = new Date(element.fechadesde);
        });
        let findDato = this.datosInicial.find(item => item.tiponombre === this.selectedDatos[0].tiponombre);

        this.selectedBefore = findDato;
      } else {
        if ((evento.data.fechabaja == null || evento.data.fechabaja == undefined) && this.historico) {
          if (this.selectedDatos[0] != undefined) {
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

  anular(selectedDatos) {
    this.progressSpinner = true;
    this.body = new BajasTemporalesItem();
    this.body = selectedDatos
    this.body.forEach(element => {
      element.fechaActual = this.datos.fechaActual;
      element.observaciones = this.datos.observaciones;
    });
    this.sigaServices.post("bajasTemporales_updateAnular", this.body).subscribe(
      data => {
        this.selectedDatos = [];
        this.searchPartidas.emit(false);
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("success", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
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
  
  validar(selectedDatos) {
      this.progressSpinner = true;
      this.body = new BajasTemporalesItem();
      this.body = selectedDatos
      this.body.forEach(element => {
        element.fechaActual = this.datos.fechaActual;
        element.observaciones = this.datos.observaciones;
      });
      this.sigaServices.post("bajasTemporales_updateValidar", this.body).subscribe(
        data => {
          this.selectedDatos = [];
          this.searchPartidas.emit(false);
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.progressSpinner = false;
        },
        err => {
          if (err != undefined && JSON.parse(err.error).error.description != "") {
            this.showMessage("success", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
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
    this.body = new BajasTemporalesItem();
    this.body = selectedDatos
    this.body.forEach(element => {
      element.fechaActual = this.datos.fechaActual;
      element.observaciones = this.datos.observaciones;
    });
    this.sigaServices.post("bajasTemporales_updateDenegar", this.body).subscribe(
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
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {

    this.cols = [
      { field: "ncolegiado", header: "facturacionSJCS.facturacionesYPagos.numColegiado" },
      { field: "nombre", header: "busquedaSanciones.detalleSancion.letrado.literal" },
      { field: "tiponombre", header: "dato.jgr.guardia.guardias.turno" },
      { field: "descripcion", header: "administracion.auditoriaUsuarios.literal.motivo" },
      { field: "fechadesde", header: "facturacion.seriesFacturacion.literal.fInicio" },
      { field: "fechahasta", header: "censo.busquedaSolicitudesTextoLibre.literal.fechaHasta" },
      { field: "fechaalta", header: "formacion.busquedaInscripcion.fechaSolicitud" },
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
      this.persistenceService.setDatos(evento.data);
      this.router.navigate(["/gestionInscripciones"]);
    } else {
      let findDato = this.selectedDatos.find(item => item.estado != 1);
      if(findDato != null){
        this.disabledSolicitarBaja = true;
      }
      else{
        this.disabledSolicitarBaja = false;
      }
      let findDato2 = this.selectedDatos.find(item => item.estado != 2 && item.estado != 0);
      if(findDato2 != undefined){
        this.disabledValidar = true;
        this.disabledDenegar = true;
      }
      else{
        this.disabledValidar = false;
        this.disabledDenegar = false;
      }
      if (evento.data.fechabaja == undefined && this.historico) {
        // this.selectedDatos.pop();
      }

    }
  }

  changeDescripcion(dato) {

    let findDato = this.datosInicial.find(item => item.idpersona === dato.idpersona && item.descripcion === dato.descripcion);

    if (findDato != undefined) {
      if (dato.descripcion != findDato.descripcion) {

        let findUpdate = this.updateBajasTemporales.find(item => item.idpersona === dato.idpersona && item.descripcion === dato.descripcion);

        if (findUpdate == undefined) {
          this.updateBajasTemporales.push(dato);
        }
      }
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


  actualizaSeleccionados(event,selectedDatos) {
    this.selectedDatosCopy = [];
    if(event != undefined){
      this.selectedDatosCopy.push(event.data);
    }
    if (this.selectedDatos == undefined) {
      this.selectedDatos = [];
    }
    if (selectedDatos != undefined) {
      this.numSelected = selectedDatos.length;
    }
    
  }

  fillFechaDesdeCalendar(event) {
    if(this.selectedDatos.length > 0){
      let findDato = this.datos.find(item => item.editable === this.selectedDatos[0].editable);
      if(findDato != undefined){
        this.datos.forEach(element => {
          if(element == findDato){
            element.fechadesde = this.transformaFecha(event);
            // this.selectedDatos.push(element);
          }
        });
      }
    }else{
     let dato = this.datos.find(item => item.editable == this.selectedDatosCopy[0].editable);
     if(dato != undefined){
       this.datos.forEach(element => {
         if(element == dato){
           element.fechadesde = this.transformaFecha(event);
           this.selectedDatos.push(element);
         }
       });
     }
    }
  }

  fillFechaHastaSolicitudCalendar(event) {
    this.selectedDatos.forEach(element => {
      element.fechahasta = this.transformaFecha(event);
    });
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

  checkPermisosRest() {
    let msg = this.commonsService.checkPermisos(this.permisos, this.historico);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.rest();
    }
  }
}
