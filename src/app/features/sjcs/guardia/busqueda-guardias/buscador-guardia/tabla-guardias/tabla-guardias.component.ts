import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DataTable, ConfirmationService } from '../../../../../../../../node_modules/primeng/primeng';
import { TranslateService } from '../../../../../../commons/translate';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { GuardiaObject } from '../../../../../../models/guardia/GuardiaObject';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaStorageService } from '../../../../../../siga-storage.service';

@Component({
  selector: 'app-tabla-guardias',
  templateUrl: './tabla-guardias.component.html',
  styleUrls: ['./tabla-guardias.component.scss']
})
export class TablaGuardiasComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  msgs;

  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;
  isAbogado: boolean = false;
  buscadores = []
  message;

  initDatos;
  nuevo: boolean = false;
  progressSpinner: boolean = false;
  permisoEscritura: boolean = false;
  disabledActivar: boolean = true;

  //Resultados de la busqueda
  @Input() guardias: GuardiaItem[] = [];

  displayDialogEliminar: boolean;
  displayDialogActivar: boolean;
  selectedDatosToDelete: any[];
  checkNumber: number;
  checkFecha;


  datos;

  @ViewChild("table") table: DataTable;

  @Output() searchHistoricalSend = new EventEmitter<boolean>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService,
    private sigaStorageService: SigaStorageService
  ) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    this.isAbogado = this.sigaStorageService.isLetrado && this.sigaStorageService.idPersona;

    this.getCols();
    this.initDatos = this.datos;

    if (this.persistenceService.getHistorico() != undefined) {
      this.historico = this.persistenceService.getHistorico();
    }
  }

  isSelectMultiple() {
    if (this.permisoEscritura) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    }
  }


  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }


  getCols() {

    this.cols = [
      { field: "turno", header: "dato.jgr.guardia.guardias.turno" },
      { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre" },
      { field: "tipoGuardia", header: "dato.jgr.guardia.guardias.tipoGuardia" },
      { field: "obligatoriedad", header: "dato.jgr.guardia.guardias.obligatoriedad" },
      { field: "tipoDia", header: "dato.jgr.guardia.guardias.tipoDia" },
      { field: "duracion", header: "dato.jgr.guardia.guardias.duracion" },
      { field: "letradosGuardia", header: "dato.jgr.guardia.guardias.letradosGuardia" },
      { field: "validaJustificacion", header: "dato.jgr.guardia.guardias.validaJustificacion" },
      { field: "letradosIns", header: "dato.jgr.guardia.guardias.letradosInscritos" },

    ];
    this.cols.forEach(it => this.buscadores.push(""))
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

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  onChangeSelectAll() {
    if (this.permisoEscritura) {
      if (!this.historico) {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.guardias;
          this.numSelected = this.guardias.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      } else {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.guardias.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null)
          this.numSelected = this.selectedDatos.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      }
    }
  }


  searchHistorical() {

    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    this.searchHistoricalSend.emit(this.historico);
    this.selectAll = false
    if (this.selectMultiple) {
      this.selectMultiple = false;
    }

  }
  openTab(evento) {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    if (!this.selectAll && !this.selectMultiple) {
      this.progressSpinner = true;
      this.datos = new GuardiaItem();
      this.datos.idGuardia = evento.idGuardia;
      this.datos.idTurno = evento.idTurno;
      this.persistenceService.setDatos(this.datos);
      // Informar datos De Guardias.
      sessionStorage.setItem('saltos-compesacionesItem', JSON.stringify(this.datos));
      this.persistenceService.setHistorico(evento.fechabaja ? true : false);
      this.router.navigate(["/gestionGuardias"]);
    } else {
      if (evento.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }
    }
  }

  checkSelectedRow(event) {
    if (this.historico && event.data.fechabaja) {
      this.disabledActivar = false;
    } else {
      this.disabledActivar = true;
    }
  }

  delete() {
    this.displayDialogEliminar = true; // Muestra el diálogo
    this.selectedDatosToDelete = this.selectedDatos; // Guarda los datos seleccionados para eliminar
  }

  cancelDelete() {
    this.displayDialogEliminar = false;

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

  checkEliminarNumber(number: number) {
    return number == this.selectedDatosToDelete.reduce((total, obj) => total + obj.letradosIns, 0);
  }


  confirmDelete() {

    if (this.checkEliminarNumber(this.checkNumber)) {
      let guardiaDelete = new GuardiaObject();
      guardiaDelete.guardiaItems = this.selectedDatosToDelete;
      this.progressSpinner = true;
      this.displayDialogEliminar = false;

      this.sigaServices.post("busquedaGuardias_deleteGuardias", guardiaDelete).subscribe(

        data => {

          this.selectedDatos = [];
          this.searchHistoricalSend.emit(false);
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
        }
      );
    } else {
      this.msgs = [
        {
          severity: "error",
          summary: this.translateService.instant("general.message.incorrect"),
          detail: this.translateService.instant("justiciaGratuita.inscripciones.mensaje.eliminar.error")
        } // MENSAJE numero introducido no coincide con el numero total de  letrados inscritos.
      ];
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

  fillAfechaCheck(event) {
    if (event != null) {
      this.checkFecha = this.transformaFecha(event);
      // Ignora el error provocado por la estructura de datos de InscripcionesItem
      // @ts-ignore
      // this.filtros.estado = ["1","2"];
      // this.disabledestado = true;
    } else {
      this.checkFecha = undefined;
     
    }
  }

  fillFechaCheck(event) {
    this.checkFecha = this.transformaFecha(event);
  }


  activar(){
    this.displayDialogActivar = true; // Muestra el diálogo
    this.selectedDatosToDelete = this.selectedDatos; // Guarda los datos seleccionados para eliminar
  }

  confirmActive(conFecha:boolean){
    if((this.checkFecha != null && this.checkFecha != undefined && conFecha) || !conFecha ){
      this.progressSpinner = true;
      this.displayDialogActivar = false;
      let guardiaActivate = new GuardiaObject();

      if (conFecha){
        this.selectedDatosToDelete = this.selectedDatosToDelete.map(obj => {
          return { ...obj, fechabaja: this.checkFecha };
        });
      }else{
        this.selectedDatos = this.selectedDatos.map(obj => {
          return { ...obj, fechabaja: null };
        });
      }
      guardiaActivate.guardiaItems = this.selectedDatos; // Con modal --> selectedDatosToDelete

      this.sigaServices.post("busquedaGuardias_activateGuardias", guardiaActivate).subscribe(
        data => {
          JSON.parse(data.body).error.description
          //this.selectedDatosToDelete = [];
          this.selectedDatos = []
          this.searchHistoricalSend.emit(true);
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
        }
      );
    }
  }

  cancelActive(){
    this.displayDialogActivar = false; 
  
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

  activate() {
    let guardiaActivate = new GuardiaObject();
    guardiaActivate.guardiaItems = this.selectedDatos;
    this.sigaServices.post("busquedaGuardias_activateGuardias", guardiaActivate).subscribe(
      data => {

        this.selectedDatos = [];
        this.searchHistoricalSend.emit(true);
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
      }
    );
  }
  /*confirmDelete() {
    if (this.permisoEscritura) {

      let mess = 'Al dar de baja la guardia acepta dar de baja todas las inscripciones de los colegiados inscritos a dicha guardia. ¿Desea continuar?';
      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          this.delete()
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
  }*/

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
    this.seleccion = false;
    if (!this.numSelected || this.numSelected == 0) {
      this.disabledActivar = true;
    } else if (this.historico && this.selectedDatos.every(dato => dato.fechabaja)) {
      this.disabledActivar = false;
    } else if (this.historico && this.selectedDatos.every(dato => !dato.fechabaja)) {
      this.disabledActivar = true;
    }
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


}
