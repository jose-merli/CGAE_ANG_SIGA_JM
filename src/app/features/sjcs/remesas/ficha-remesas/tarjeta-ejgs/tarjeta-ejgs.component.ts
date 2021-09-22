import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ChangeDetectorRef, SimpleChanges, ViewChildren } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { ConfirmationService, Paginator } from 'primeng/primeng';
import { CommonsService } from '../../../../../_services/commons.service';
import { RemesasBusquedaObject } from '../../../../../models/sjcs/RemesasBusquedaObject';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { ComboItem } from '../../../../administracion/parametros/parametros-generales/parametros-generales.component';
import { RemesasItem } from '../../../../../models/sjcs/RemesasItem';
import { Table } from 'primeng/table';
import { ColumnasItem } from '../../../../../models/sjcs/ColumnasItem';

@Component({
  selector: 'app-tarjeta-ejgs',
  templateUrl: './tarjeta-ejgs.component.html',
  styleUrls: ['./tarjeta-ejgs.component.scss']
})

export class TarjetaEjgsComponent implements OnInit {

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
  estadoRemesa: ComboItem[] = [{ value: "con_inci", label: "Expedientes con incidencias"},{ value: "sin_inci", label:  "Expedientes sin incidencias"},{ value: "inci_env", label: "Expedientes con incidencias antes del envío"},{ value: "desp_env", label:  "Expedientes con incidencias después del envío"}, { value: "inci_no_re", label: "Expedientes con incidencias y no en nueva remesa"}];
  estadoRemesaSeleccionado;

  //Resultados de la busqueda
  @Input() datos;

  @Input() permisos;

  @Output() search = new EventEmitter<boolean>();

  @ViewChild("tabla") tabla;
  remesasDatosEntradaItem;
  @Input() remesaTabla;
  @Input() remesaItem: RemesasItem = new RemesasItem();

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private router: Router,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService
  ) { }

  ngOnInit() {
    if(this.remesaTabla != null){
      this.getEJGRemesa(this.remesaTabla[0]);
    }

    this.getCols();

    this.tabla.filterConstraints['inCollection'] = function inCollection(value: any, filter: any): boolean{
      // value = array con los datos de la fila actual
      // filter = valor del filtro por el que se va a buscar en el array value

      let incidencias = value.split("/");

      if (filter === undefined || filter === null) {
        return true;
    }

    if (incidencias === undefined || incidencias === null || incidencias.length === 0) {
        return false;
    }

    for (let i = 0; i < incidencias.length; i++) {
      switch (filter) {

        case "con_inci":
          if(incidencias[0] == "1"){
            return true;
          }
          break;

        case "sin_inci":
          if(incidencias[0] == "0"){
            return true;
          }
          break;
      
        case "inci_env":
          if(incidencias[0] == "1" && incidencias[1] == "1"){
            return true;
          }
          break;

        case "desp_env":
          if(incidencias[0] == "1" && incidencias[2] == "1"){
            return true;
          }
          break;
      
        default:
          if(incidencias[0] == "1" && incidencias[3] == "0"){
            return true;
          }
          break;
      }
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
      { field: "identificadorEJG", header: "justiciaGratuita.remesas.ficha.identificadorEJG", display: "table-cell" },
      { field: "turnoGuardiaEJG", header: "justiciaGratuita.remesas.ficha.TurnoGuardiaEJG", display: "table-cell" },
      { field: "anioEJG", header: "justiciaGratuita.oficio.justificacionExpres.anioEJG", display: "table-cell" },
      { field: "numeroEJG", header: "justiciaGratuita.oficio.justificacionExpres.numeroEJG", display: "table-cell" },
      { field: "estadoEJG", header: "justiciaGratuita.ejg.datosGenerales.EstadoEJG", display: "table-cell" },
      { field: "solicitante", header: "justiciaGratuita.justiciables.rol.solicitante", display: "table-cell" },
      { field: "nuevaRemesa", header: "justiciaGratuita.remesas.ficha.EnNuevaRemesa", display: "table-cell" },
      { field: "estadoRemesa", header: "justiciaGratuita.remesas.ficha.EstadoEJGDentroRemesa", display: "table-cell" },
      { field: "incidencias", header: "", display: "none"}
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

  getEJGRemesa(remesa){
    this.progressSpinner = true;
    this.remesasDatosEntradaItem =
    {
      'idRemesa': (remesa.idRemesa != null && remesa.idRemesa != undefined) ? remesa.idRemesa.toString() : remesa.idRemesa,
      'comboIncidencia': (this.estadoRemesaSeleccionado != null && this.estadoRemesaSeleccionado != undefined) ? this.estadoRemesaSeleccionado.toString() : this.estadoRemesaSeleccionado
    };
    this.sigaServices.post("ficharemesas_getEJGRemesa", this.remesasDatosEntradaItem).subscribe(
      n => {
        console.log("Dentro del servicio del padre que llama al getEJGRemesa");
        this.datos = JSON.parse(n.body).ejgRemesa;

        this.datos.forEach(element => {
          if(element.nuevaRemesa == 0){
            element.nuevaRemesa = "No";
          }else{
            element.nuevaRemesa = "Si";
          }
          
        });

        console.log("Contenido de la respuesta del back --> ", this.datos);
        this.progressSpinner = false;

        if (this.datos.length == 200) {
          console.log("Dentro del if del mensaje con mas de 200 resultados");
          this.showMessage('info', this.translateService.instant("general.message.informacion"), "La consulta devuelve más de 200 resultados.");
        }

      },
      err => {
        this.progressSpinner = false;
        let error = err;
        console.log(err);
      },
      () => {
        
      });
  }

  openTab(evento) {

    let paginacion = {
      paginacion: this.tabla.first,
      selectedItem: this.selectedItem
    };

    this.persistenceService.setPaginacion(paginacion);
    this.progressSpinner = true;
    this.persistenceService.setDatos(evento);
    this.router.navigate(["/fichaRemesasEnvio"]);
    localStorage.setItem('remesaItem', JSON.stringify(this.selectedDatos));
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
