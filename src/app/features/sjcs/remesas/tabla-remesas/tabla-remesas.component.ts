import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ChangeDetectorRef, SimpleChanges, ViewChildren } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { PretensionObject } from '../../../../models/sjcs/PretensionObject';
import { PretensionItem } from '../../../../models/sjcs/PretensionItem';
import { ConfirmationService, Paginator } from 'primeng/primeng';
import { CommonsService } from '../../../../_services/commons.service';
import { RemesasBusquedaObject } from '../../../../models/sjcs/RemesasBusquedaObject';
import { Router } from '../../../../../../node_modules/@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tabla-remesas',
  templateUrl: './tabla-remesas.component.html',
  styleUrls: ['./tabla-remesas.component.scss']
})
export class TablaRemesasComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  msgs;
  page: number = 0;
  datosInicial = [];
  selectedBefore;


  body;

  selectedItem: number = 10;
  selectAll: boolean = false;
  selectedDatos: any[] = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;

  message;

  initDatos;
  progressSpinner: boolean = false;
  buscadores = []
  //Resultados de la busqueda
  @Input() datos;

  @Input() permisos;

  @Output() search = new EventEmitter<boolean>();

  @ViewChild("tabla") tabla;

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private router: Router,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService
  ) { }

  ngOnInit() {
    console.log("selectMultiple -> ", this.selectMultiple);
    console.log("selectAll -> ", this.selectAll);
    this.selectedDatos = [];
    this.getCols();

    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));

    this.tabla.filterConstraints['inCollection'] = function inCollection(value: any, filter: any): boolean {
      // value = array con los datos de la fila actual
      // filter = valor del filtro por el que se va a buscar en el array value

      const pattern = 'dd/MM/yyyy';

      let datepipe = new DatePipe('en-US');

      let incidencias = datepipe.transform(value, pattern);

      if (filter === undefined || filter === null) {
        return true;
      }

      if (incidencias === undefined || incidencias === null || incidencias.length === 0) {
        return false;
      }

      if (incidencias.includes(filter)) {
        return true;
      }

      return false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.selectedDatos = [];
    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
  }

  checkPermisosDelete() {
    let msg = this.commonsService.checkPermisos(this.permisos, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (((!this.selectMultiple || !this.selectAll) && (this.selectedDatos == undefined || this.selectedDatos.length == 0)) || !this.permisos) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.confirmDelete();
      }
    }
  }

  confirmDelete() {
    let mess = this.translateService.instant(
      "messages.deleteConfirmation"
    );
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

  selectedRow(selectedDatos) {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (selectedDatos != undefined) {
      this.numSelected = selectedDatos.length;
      if (this.numSelected == 1) {
        this.selectMultiple = false;
      } else {
        this.selectMultiple = true;
      }
    }
  }

  delete() {
    let del = new RemesasBusquedaObject();
    del.resultadoBusqueda = this.selectedDatos;
    console.log("Remesa -> ", del.resultadoBusqueda);
    this.sigaServices.post("listadoremesas_borrarRemesa", del.resultadoBusqueda).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), JSON.parse(data.body).error.description);
        this.selectedDatos = [];
        this.progressSpinner = false;
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.selectMultiple = false;
        this.selectAll = false;
        this.search.emit(true);
      }
    );
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.editElementDisabled();
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
    this.selectMultiple = true;
  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {

    this.cols = [
      { field: "nRegistro", header: "formacion.fichaCursos.tarjetaPrecios.resumen.numRegistros" },
      { field: "descripcion", header: "administracion.parametrosGenerales.literal.descripcion" },
      { field: "fechaGeneracion", header: "justiciaGratuita.remesas.tabla.FechaGeneracion" },
      { field: "fechaEnvio", header: "justiciaGratuita.remesas.tabla.FechaEnvio" },
      { field: "fechaRecepcion", header: "justiciaGratuita.remesas.tabla.FechaRecepcion" },
      { field: "estado", header: "justiciaGratuita.Calendarios.Estado" },
      { field: "incidencias", header: "justiciaGratuita.remesas.tabla.Incidencias" }
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

  openTab(evento) {

    let paginacion = {
      paginacion: this.tabla.first,
      selectedItem: this.selectedItem
    };

    console.log("evento -> ", evento);

    this.persistenceService.setPaginacion(paginacion);
    this.progressSpinner = true;
    this.persistenceService.setDatos(evento);
    this.router.navigate(["/fichaRemesasEnvio"]);
    localStorage.setItem('remesaItem', JSON.stringify(evento));
    localStorage.setItem('ficha', "registro");
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

  actualizaSeleccionados(selectedDatos) {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (selectedDatos != undefined) {
      this.numSelected = selectedDatos.length;
      if (this.numSelected == 1) {
        this.selectMultiple = false;
      } else {
        this.selectMultiple = true;
      }
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
