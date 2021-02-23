import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef, ViewChild } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { EstadoEJGItem } from '../../../../../models/sjcs/EstadoEJGItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { ConfirmationService } from 'primeng/api';
import { DataTable } from "primeng/datatable";
import { DatosFamiliaresItem } from '../../../../../models/DatosFamiliaresItem';
import { UnidadFamiliarEJGItem } from '../../../../../models/sjcs/UnidadFamiliarEJGItem';

@Component({
  selector: 'app-estados',
  templateUrl: './estados.component.html',
  styleUrls: ['./estados.component.scss']
})
export class EstadosComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaEstados: string;

  openFicha: boolean = false;
  nuevo;
  body: EJGItem;
  bodyInicial;
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

  datosFamiliares=[];
  
  selectionMode: string = "single";
  editMode: boolean;

  progressSpinner: boolean = false;
  
  resaltadoDatosGenerales: boolean = false;
  fichaPosible = {
    key: "estados",
    activa: false
  }
  
  activacionTarjeta: boolean = false;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Input() openTarjetaEstados;

  @ViewChild("table")
  table: DataTable;

  //[x: string]: any;


  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,private commonsServices: CommonsService,
    private translateService: TranslateService, private confirmationService: ConfirmationService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
      if (this.persistenceService.getDatos()) {
        this.nuevo = false;
        this.modoEdicion = true;
        this.body = this.persistenceService.getDatos();
        this.item = this.body;
        this.getEstados(this.item);
        this.getCols();
      }else {
      this.nuevo = true;
      this.modoEdicion = false;
      this.item = new EJGItem();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaEstados == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
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
      { field: "fechaInicio", header: "censo.nuevaSolicitud.fechaEstado", width: "10%" },
      { field: "fechaModificacion", header: "censo.resultadosSolicitudesModificacion.literal.fecha", width: "10%" },
      { field: "descripcion", header: "censo.fichaIntegrantes.literal.estado", width: "15%" },
      { field: "observaciones", header: "gratuita.mantenimientoLG.literal.observaciones", width: "25%" },
      { field: "automatico", header: "administracion.auditoriaUsuarios.literal.Automatico", width: "10%" }, 
      { field: "propietario", header: "justiciaGratuita.ejg.documentacion.Propietario", width: "5%" },
      { field: "user", header: "menu.administracion.auditoria.usuarios", width: "25%" },
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
  activate() {

  }

  newEstado() {

  }
  searchHistorical() {
    this.item.historico = !this.item.historico;
    this.historico = !this.historico;
    if (this.historico) {
      this.editMode = false;
      this.nuevo = false;
      this.selectAll = false;
      this.numSelected = 0;
    }
    this.selectMultiple = false;
     this.selectionMode = "single";
    this.persistenceService.setHistorico(this.historico);
    this.getEstados(this.item);
  }

  esFichaActiva(key) {

    return this.fichaPosible.activa;
  }
  abreCierraFicha(key) {
    this.resaltadoDatosGenerales = true;
    if (
      key == "estados" &&
      !this.activacionTarjeta
    ) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }
  checkPermisosDelete() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (!this.permisoEscritura || (!this.selectMultiple && !this.selectAll) || this.selectedDatos.length == 0) {
        this.msgs = this.commonsServices.checkPermisoAccion();
      } else {
        this.confirmDelete();
      }
    }
  }
  checkPermisosActivate(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.activate();
    }
  }
  checkPermisosConsultar(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.consultar();
    }
  }
  checkPermisosNewEstado(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.newEstado();
    }
  }
}
