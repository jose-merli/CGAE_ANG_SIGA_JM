import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output,SimpleChanges } from '@angular/core';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { fichasPosibles_unidadFamiliar } from '../../../../../utils/fichasPosibles_justiciables';

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
  openFicha: boolean = false;
  historico: boolean = false;
  datosFamiliares;
  datosFamiliaresActivos;

  @Input() modoEdicion;
  @Input() tarjetaUnidadFamiliar: string;

  @Input() permisoEscritura;
  @Output() searchHistoricalSend = new EventEmitter<boolean>();

  resaltadoDatosGenerales: boolean = false;
  
  fichaPosible = {
    key: "unidadFamiliar",
    activa: false
  }
  
  activacionTarjeta: boolean = false;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Input() openTarjetaUnidadFamiliar;



  constructor(private changeDetectorRef: ChangeDetectorRef,
    private persistenceService: PersistenceService, private router: Router ) { }

  ngOnInit() {
      if (this.persistenceService.getDatos()) {
        this.nuevo = false;
        this.modoEdicion = true;
        this.body = this.persistenceService.getDatos();
        this.datosFamiliares = this.persistenceService.getBodyAux();
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
        
      }else{
        this.nuevo = true;
        this.modoEdicion = false;
      // this.body = new EJGItem();
      }
      this.datosFamiliaresActivos = this.datosFamiliares.filter(
        (dato) => /*dato.fechaBaja != undefined && */ dato.fechaBaja == null);
    this.getCols();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaUnidadFamiliar == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
  }

  esFichaActiva(key) {

    return this.fichaPosible.activa;
  }
  abreCierraFicha(key) {
    this.resaltadoDatosGenerales = true;
    if (
      key == "unidadFamiliar" &&
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

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }
  openTab(evento) {
    
    this.persistenceService.setBody(evento);
    this.persistenceService.setFichasPosibles(fichasPosibles_unidadFamiliar);
    this.router.navigate(["/gestionJusticiables"], { queryParams: { fr: "u" } });

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
  checkPermisosSolicitarEEJ(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.solicitarEEJ();
    }
  }
    solicitarEEJ(){

    }
    checkPermisosComunicar(datos){
      let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
      if (msg != undefined) {
        this.msgs = msg;
      } else {
        this.comunicar(datos);
      }
    }
    comunicar(datos){

    }
    checkPermisosConfirmDelete(){
      let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
      if (msg != undefined) {
        this.msgs = msg;
      } else {
        this.confirmDelete();
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
    checkPermisosAsociar(){
      let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
      if (msg != undefined) {
        this.msgs = msg;
      } else {
        this.asociar();
      }
    }
    asociar(){
      
    }
}
