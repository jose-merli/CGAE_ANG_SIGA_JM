import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';

@Component({
  selector: 'app-unidad-familiar',
  templateUrl: './unidad-familiar.component.html',
  styleUrls: ['./unidad-familiar.component.scss']
})
export class UnidadFamiliarComponent implements OnInit {
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
  openFicha: boolean = true;
  historico: boolean = false;
  datosFamiliares;
  datosFamiliaresActivos;

  @Input() modoEdicion;
  @Output() searchHistoricalSend = new EventEmitter<boolean>();

  permisoEscritura: boolean = false;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private persistenceService: PersistenceService, ) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined)
      // this.permisoEscritura = this.persistenceService.getPermisos()
      // De momento todo disabled, funcionalidades FAC. Cuando esté todo cambiar Permisos. 
      this.permisoEscritura = false;
    if (this.modoEdicion) {
      if (this.persistenceService.getDatos()) {
        this.nuevo = false;
        this.body = this.persistenceService.getDatos();
        this.datosFamiliares = this.persistenceService.getFiltrosAux();
        let nombresol = this.body.nombreApeSolicitante;
        this.datosFamiliares.forEach(element => {
          element.nombreApeSolicitante = nombresol;
          if (element.estado == 30) {
            element.estadoDes = "Denegada";
          } else if (element.estado == 40) {
            element.estadoDes = "Suspendida";
          } else if (element.estado == 50) {
            element.estadoDes = "Aprobada";
          } else if (element.estado == 10) {
            element.estadoDes = "Pendiente documentación";
          } else if (element.estado == 20) {
            element.estadoDes = "Pendiente aprobación";
          }
          if (element.estadoDes != undefined && element.fechaSolicitud != undefined) {
            element.expedienteEconom = element.estadoDes + " * " + element.fechaSolicitud;
          } else if (element.estadoDes != undefined && element.fechaSolicitud == undefined) {
            element.expedienteEconom = element.estadoDes + " * ";
          } else if (element.estadoDes == undefined && element.fechaSolicitud != undefined) {
            element.expedienteEconom = " * " + element.fechaSolicitud;
          } else if (element.estadoDes == undefined && element.fechaSolicitud == undefined) {
            element.expedienteEconom = "  ";
          }
        });
        
      }
      this.datosFamiliaresActivos = this.datosFamiliares.filter(
        (dato) => /*dato.fechaBaja != undefined && */ dato.fechaBaja == null);
    }
    this.getCols();
  }
  ngOnChanges() {
    
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
      { field: "pjg_nif", header: "administracion.usuarios.literal.NIF", width: "10%" },
      { field: "pjg_nombrecompleto", header: "administracion.parametrosGenerales.literal.nombre.apellidos", width: "20%" },
      { field: "pjg_direccion", header: "censo.consultaDirecciones.literal.direccion", width: "15%" },
      { field: "uf_enCalidad", header: "administracion.usuarios.literal.rol", width: "10%" },
      { field: "nombreApeSolicitante", header: "justiciaGratuita.ejg.datosGenerales.RelacionadoCon", width: "20%" },
      { field: "pd_descripcion", header: "informes.solicitudAsistencia.parentesco", width: "15%" },
      { field: "expedienteEconom", header: "justiciaGratuita.ejg.datosGenerales.ExpedienteEcon", width: "20%" },
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
  activate(){

  }
  searchHistorical(){
    this.datosFamiliares.historico = !this.datosFamiliares.historico;
    this.historico = !this.historico;
    if (this.historico) {
      this.editMode = false;
      this.nuevo = false;
      this.selectAll = false;
      this.numSelected = 0;
      this.datosFamiliaresActivos = JSON.parse(JSON.stringify(this.datosFamiliares));
    }else{
      this.datosFamiliaresActivos = this.datosFamiliares.filter(
        (dato) =>  /*dato.fechaBaja != undefined && */dato.fechaBaja == null);
    }
    this.selectMultiple = false;
     this.selectionMode = "single";
    this.persistenceService.setHistorico(this.historico);
    
  }
  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }
}
