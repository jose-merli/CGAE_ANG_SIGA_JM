import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DataTable, ConfirmationService } from '../../../../../../node_modules/primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { Router } from '../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../_services/siga.service';
import { PersistenceService } from '../../../../_services/persistence.service';

@Component({
  selector: 'app-tabla-ejg',
  templateUrl: './tabla-ejg.component.html',
  styleUrls: ['./tabla-ejg.component.scss']
})
export class TablaEjgComponent implements OnInit {
  [x: string]: any;
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
  permisoEscritura: boolean = false;
  buscadores = [];
  message;
  initDatos;
  nuevo: boolean = false;
  progressSpinner: boolean = false;


  //Resultados de la busqueda
  @Input() datos;


  @ViewChild("table") table: DataTable;
  @Output() searchHistoricalSend = new EventEmitter<boolean>();
  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));

    if (this.persistenceService.getHistorico() != undefined) {
      this.historico = this.persistenceService.getHistorico();
    }
  }
  confirmDelete() {
    let mess = this.translateService.instant('messages.deleteConfirmation');
    let icon = 'fa fa-edit';
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.delete();
      },
      reject: () => {
        this.msgs = [
          {
            severity: 'info',
            summary: 'Cancel',
            detail: this.translateService.instant('general.message.accion.cancelada')
          }
        ];
      }
    });
  }
  openTab(evento) {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }
    if (!this.selectAll && !this.selectMultiple) {
      this.progressSpinner = true;
      this.persistenceService.setDatos(evento.data);
      this.router.navigate(['/gestionEJG(POR HACER)']);
    } else {
      if (evento.data.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }
    }
  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }
  delete() {

  }
  //igual puedo ahorrarmelo y todo a delete? (o solo se ahce en el back)
  activate() {

  }
  getCols() {
    // LITERALES DE CABECERAS OK
    this.cols = [
      { field: "colegio", header: "censo.busquedaClientesAvanzada.literal.colegio" },
      { field: "numero", header: "censo.consultaDatosColegiacion.literal.numIden" }, //es este??
      { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre" },
      { field: "numColegiado", header: "censo.resultadosSolicitudesModificacion.literal.nColegiado" },
      { field: "estadoEJG", header: "censo.fichaCliente.situacion.cabecera" }, //es este??
      { field: "residencia", header: "censo.busquedaClientes.noResidente" }, //este no esta en el item!! q hago?
      { field: "fechaNac", header: "censo.consultaDatosColegiacion.literal.fechaNac" }, //este no esta en el item!! q hago?
      { field: "email", header: "censo.datosDireccion.literal.correo" }, //este no esta en el item!! q hago?
      { field: "telefono", header: "censo.ws.literal.telefono" }, //este no esta en el item!! q hago?
      { field: "movil", header: "censo.datosDireccion.literal.movil" }, //este no esta en el item!! q hago?
      { field: "lopd", header: "censo.busquedaColegial.lopd" }, //este no esta en el item!! q hago?
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

  searchHistorical() {
    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    this.searchHistoricalSend.emit(this.historico);
    this.selectAll = false;
    if (this.selectMultiple) {
      this.selectMultiple = false;
    }
  }
  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();//tabla o table??
  }
  onChangeSelectAll() {
    if (this.permisoEscritura) {
      if (!this.historico) {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datos;
          this.numSelected = this.datos.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      } else {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datos.filter(
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
