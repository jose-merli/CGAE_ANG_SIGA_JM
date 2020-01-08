import { Component, OnInit, Input } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-expedientes-economicos',
  templateUrl: './expedientes-economicos.component.html',
  styleUrls: ['./expedientes-economicos.component.scss']
})
export class ExpedientesEconomicosComponent implements OnInit {
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
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  buscadores = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  item: EJGItem;
  nExpedientes;
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService, ) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined)
      this.permisoEscritura = false;
    if (this.modoEdicion) {
      if (this.persistenceService.getDatos()) {
        this.nuevo = false;
        this.body = this.persistenceService.getDatos();
        this.item = this.body;
        this.getExpedientesEconomicos(this.item);
        this.getCols();
      }
    } else {
      this.nuevo = true;
    }
  }
  getExpedientesEconomicos(selected) {
    this.progressSpinner = true;
    this.sigaServices.post("gestionejg_getExpedientesEconomicos", selected).subscribe(
      n => {
        this.expedientesEcon = JSON.parse(n.body).expEconItems;
        this.nExpedientes = this.expedientesEcon.length;
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
      // this.progressSpinner = true;
      // this.datosEJG();

    } else {
      if (evento.data.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }
    }
  }
  getCols() {
    this.cols = [
      { field: "justiciable", header: "menu.justiciaGratuita.justiciable", width: "15%" },
      { field: "solicitadoPor", header: "justiciaGratuita.ejg.datosGenerales.SolicitadoPor", width: "20%" },//falta apellidos
      { field: "f_solicitud", header: "formacion.busquedaInscripcion.fechaSolicitud", width: "10%" },
      { field: "f_recepcion", header: "justiciaGratuita.ejg.datosGenerales.FechaRecepcion", width: "10%" },
      { field: "estado", header: "censo.busquedaSolicitudesModificacion.literal.estado", width: "15%" },
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
  delete() {

  }
  mostrarHistorico() {

  }
  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }

}
