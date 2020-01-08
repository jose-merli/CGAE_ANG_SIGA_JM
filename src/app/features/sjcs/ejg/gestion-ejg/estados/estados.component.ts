import { Component, OnInit, Input } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { EstadoEJGItem } from '../../../../../models/sjcs/EstadoEJGItem';

@Component({
  selector: 'app-estados',
  templateUrl: './estados.component.html',
  styleUrls: ['./estados.component.scss']
})
export class EstadosComponent implements OnInit {
  @Input() modoEdicion;
  openFicha: boolean = true;
  permisoEscritura: boolean = false;
  nuevo;
  body: EJGItem;
  bodyInicial;
  [x: string]: any;
  rowsPerPage: any = [];
  cols;
  msgs;
  item: EJGItem;
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  buscadores = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;
  estados: EstadoEJGItem;
  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService, ) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined)
      this.permisoEscritura = false;
    if (this.modoEdicion) {
      if (this.persistenceService.getDatos()) {
        this.nuevo = false;
        this.body = this.persistenceService.getDatos();
        this.item = this.body;
        this.getEstados(this.item);
        this.getCols();
      }
    } else {
      this.nuevo = true;
    }
  }
  getEstados(selected) {
    this.progressSpinner = true;
    this.sigaServices.post("gestionejg_getEstados", selected).subscribe(
      n => {
        this.estados = JSON.parse(n.body).estadoEjgItems;
        // this.nExpedientes = this.expedientesEcon.length;
        // this.persistenceService.setFiltrosAux(this.expedientesEcon);
        // this.router.navigate(['/gestionEjg']);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
      }
    );
  }
  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }
  openTab(evento) {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }
    if (!this.selectAll && !this.selectMultiple) {
    } else {
      if (evento.data.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }
    }
  }
  getCols() {
    this.cols = [
      { field: "fechaInicio", header: "censo.nuevaSolicitud.fechaEstado", width: "15%" },
      { field: "fechamodificacion", header: "censo.resultadosSolicitudesModificacion.literal.fecha", width: "20%" },
      { field: "descripcion", header: "censo.fichaIntegrantes.literal.estado", width: "10%" },
      { field: "observaciones", header: "gratuita.mantenimientoLG.literal.observaciones", width: "10%" },
      { field: "automatico", header: "administracion.auditoriaUsuarios.literal.usuarioAutomatico", width: "15%" }, //cambiar
      { field: "propietario", header: "menu.justiciaGratuita.estado.propietario", width: "10%" }, //aun sin insertar
      { field: "user", header: "menu.administracion.auditoria.usuarios", width: "10%" },
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
  isSelectMultiple() {
    this.selectAll = false;
    if (this.permisoEscritura) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        this.selectAll = false;
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
  onChangeSelectAll() {
    if (this.permisoEscritura) {
      if (!this.historico) {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datosFamiliares;
          this.numSelected = this.datosFamiliares.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      } else {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datosFamiliares.filter(
            (dato) => dato.fechaBaja != undefined && dato.fechaBaja != null
          );
          this.numSelected = this.selectedDatos.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      }
    }
  }
  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
    this.seleccion = false;
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
            summary: "Cancelar",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }
  consultar() {

  }
  delete() {

  }

  newEstado() {

  }
  searchHistorical() {
    this.item.historico = !this.item.historico;
    this.historico = !this.historico;
    if (this.historico) {
      this.editElementDisabled();
      this.editMode = false;
      this.nuevo = false;
      this.selectMultiple = false;
      this.selectionMode = "single";
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    } else {
      this.selectMultiple = false;
      this.selectionMode = "single";
    }
    this.persistenceService.setHistorico(this.historico);
    this.searchHistoricalSend.emit(this.historico);
  }
  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }


}
