import { Component, OnInit, Input } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { EstadoEJGItem } from '../../../../../models/sjcs/EstadoEJGItem';

@Component({
  selector: 'app-relaciones',
  templateUrl: './relaciones.component.html',
  styleUrls: ['./relaciones.component.scss']
})
export class RelacionesComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaRelaciones: string;

  openFicha: boolean = false;
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
  relaciones: EstadoEJGItem; //cambiar item
  nRelaciones;
  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService, ) { }

  ngOnInit() {
      if (this.persistenceService.getDatos()) {
        this.body = this.persistenceService.getDatos();
        this.nuevo = false;
        this.modoEdicion = true;
        this.getRelaciones(this.body);
      }else {
      this.nuevo = true;       
      this.modoEdicion = true;
    }
    this.getCols();
  }
  getRelaciones(selected) {
    //ojo esta a estados para probar a espera de back relaciones
    this.relaciones = this.persistenceService.getDatos();
    this.progressSpinner = true;
    this.sigaServices.post("gestionejg_getEstados", selected).subscribe(
      n => {
        this.relaciones = JSON.parse(n.body).estadoEjgItems;
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
      { field: "asunto", header: "justiciaGratuita.justiciables.literal.asuntos", width: "5%" },
      { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha", width: "5%" },
      { field: "turnoGuardia", header: "justiciaGratuita.justiciables.literal.turnoGuardia", width: "10%" },
      { field: "letrado", header: "justiciaGratuita.justiciables.literal.colegiado", width: "15%" },
      { field: "interesado", header: "justiciaGratuita.justiciables.literal.interesados", width: "20%" },
      { field: "datosInteres", header: "justiciaGratuita.justiciables.literal.datosInteres", width: "20%" }
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

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
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

  clear() {
    this.msgs = [];
  }
}
