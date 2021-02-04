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
  @Input() permisoEscritura;
  @Input() tarjetaExpedientesEconomicos: string;

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
  item: EJGItem;
  nExpedientes;
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService, ) { }

  ngOnInit() {
      if (this.persistenceService.getDatos()) {
        this.nuevo = false;
        this.modoEdicion = true;
        this.body = this.persistenceService.getDatos();
        this.item = this.body;
        this.getExpedientesEconomicos(this.item);
        this.getCols();
      }else {
      this.nuevo = true;
      this.modoEdicion = false;
      this.body = new EJGItem();
    }
  }
  getExpedientesEconomicos(selected) {
    this.progressSpinner = true;
    this.sigaServices.post("gestionejg_getExpedientesEconomicos", selected).subscribe(
      n => {
        this.expedientesEcon = JSON.parse(n.body).expEconItems;
        if(n.body)
          this.expedientesEcon.forEach(element => {
            element.justiciable = JSON.parse(JSON.stringify(selected.nombreApeSolicitante));
          });
        this.nExpedientes = this.expedientesEcon.length;
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
      { field: "justiciable", header: "menu.justiciaGratuita.justiciable", width: "30%" },
      { field: "solicitadoPor", header: "justiciaGratuita.ejg.datosGenerales.SolicitadoPor", width: "30%" },
      { field: "f_solicitud", header: "formacion.busquedaInscripcion.fechaSolicitud", width: "10%" },
      { field: "f_recepcion", header: "justiciaGratuita.ejg.datosGenerales.FechaRecepcion", width: "10%" },
      { field: "estado", header: "censo.busquedaSolicitudesModificacion.literal.estado", width: "20%" },
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
  checkPermisosDownloadEEJ(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.downloadEEJ();
    }
  }
  downloadEEJ(){

  }
  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }
}
