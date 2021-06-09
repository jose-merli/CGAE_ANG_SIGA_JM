import { Component, OnInit, Input,Output,EventEmitter,SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { DataTable } from 'primeng/datatable';
import { CommonsService } from '../../../../../_services/commons.service';
import { Router } from '@angular/router';
import { RelacionesItem } from '../../../../../models/sjcs/RelacionesItem';

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
  relaciones: RelacionesItem[]=[];
  nRelaciones:number;
  progressSpinner: boolean;
  historico: boolean;
  resaltadoDatosGenerales: boolean = false;
  datosFamiliares: any;
  tipoRelacion:String;
  
  @ViewChild("table") table: DataTable;

  
  valueComboEstado = "";
  fechaEstado = new Date();
  
  fichaPosible = {
    key: "relaciones",
    activa: false
  }
  
  activacionTarjeta: boolean = false;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Input() openTarjetaRelaciones;

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private translateServices: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private commonsServices: CommonsService,
    private router: Router ) { }

  ngOnInit() {
      if (this.persistenceService.getDatos()) {
        this.body = this.persistenceService.getDatos();
        this.nuevo = false;
        this.modoEdicion = true;
        this.getRelaciones();
      }else {
      this.nuevo = true;       
      this.modoEdicion = true;
    }
    this.getCols();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaRelaciones == true) {
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
      key == "relaciones" &&
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

  getRelaciones() {
    this.progressSpinner = true;
    
    this.sigaServices.post("gestionejg_getRelaciones", this.body).subscribe(
      n => {
        this.relaciones = JSON.parse(n.body).relacionesItem;
        this.nRelaciones = this.relaciones.length;
        //obtiene el tipo en caso de devolver solo 1.
        if(this.relaciones.length == 1){
          this.tipoRelacion = this.relaciones[0].sjcs; 
        } 
        // this.nExpedientes = this.expedientesEcon.length;
        // this.persistenceService.setFiltrosAux(this.expedientesEcon);
        // this.router.navigate(['/gestionEjg']);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
        this.showMessage("error", this.translateServices.instant("general.message.incorrect"), this.translateServices.instant("general.mensaje.error.bbdd"));
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
      { field: "sjcs", header: "menu.justiciaGratuita", width: "5%" },
      { field: "anio" , header:"justiciaGratuita.maestros.calendarioLaboralAgenda.anio", width:"3%"},
      { field: "numero" , header:"justiciaGratuita.sjcs.designas.DatosIden.numero", width:"3%"},
      { field: "desturno", header: "justiciaGratuita.justiciables.literal.turnoGuardia", width: "10%" },
      { field: "letrado", header: "justiciaGratuita.sjcs.designas.colegiado", width: "10%" },
      { field: "interesado", header: "justiciaGratuita.justiciables.literal.interesados", width: "10%" },
      { field: "datosinteres", header: "justiciaGratuita.justiciables.literal.datosInteres", width: "10%" },
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
    let mess = this.translateServices.instant(
      "justiciaGratuita.ejg.message.eliminarRelacion"
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
            detail: this.translateServices.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }
  delete() {
    this.progressSpinner=true;

    //this.relaciones.nuevoEJG=!this.modoEdicion;
    let data = [];
    let ejg: EJGItem;

    for(let i=0; this.selectedDatos.length>i; i++){
      ejg = this.selectedDatos[i];
      ejg.fechaEstadoNew=this.fechaEstado;
      ejg.estadoNew=this.valueComboEstado;

      data.push(ejg);
    }
    this.sigaServices.post("gestionejg_borrarRelacion", data).subscribe(
      n => {
        this.progressSpinner=false;
        this.showMessage("success", this.translateServices.instant("general.message.correct"), this.translateServices.instant("general.message.accion.realizada"));
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
        this.showMessage("error", this.translateServices.instant("general.message.incorrect"), this.translateServices.instant("general.mensaje.error.bbdd"));
      }
    );
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

  checkPermisosConsultEditRelacion(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.consultEditRelacion();
    }
  }
  consultEditRelacion(){
    this.progressSpinner=true;

    //this.body.nuevoEJG=!this.modoEdicion;

    this.sigaServices.post("gestionejg_consultEditRelacion", this.body).subscribe(
      n => {
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }
    );
  }

  checkPermisosDelete(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.confirmDelete();
    }
  }

  checkPermisosCrearDesignacion(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.crearDesignacion();
    }
  }
  crearDesignacion(){
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionEjg"]);
  }

  checkPermisosAsociarDesignacion(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.asociarDesignacion();
    }
  }
  asociarDesignacion(){
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionEjg"]);
  }

  checkPermisosAsociarSOJ(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.asociarSOJ();
    }
  }
  asociarSOJ(){
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionEjg"]);
  }

  checkPermisosAsociarAsistencia(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.asociarAsistencia();
    }
  }

  asociarAsistencia(){
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionEjg"]);
  }
}