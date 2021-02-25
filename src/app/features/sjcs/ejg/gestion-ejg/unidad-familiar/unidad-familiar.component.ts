import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { UnidadFamiliarEJGItem } from '../../../../../models/sjcs/UnidadFamiliarEJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { fichasPosibles_unidadFamiliar } from '../../../../../utils/fichasPosibles_justiciables';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { ConfirmationService } from 'primeng/api';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-unidad-familiar',
  templateUrl: './unidad-familiar.component.html',
  styleUrls: ['./unidad-familiar.component.scss']
})
export class UnidadFamiliarComponent implements OnInit {

  [x : string]: any;

  rowsPerPage: any = [];
  selectedDatos = [];
  buscadores = [];

  nuevo: boolean;
  body: UnidadFamiliarEJGItem = new UnidadFamiliarEJGItem();
  selectAll;
  cols;
  msgs;
  datosFamiliares;
  datosFamiliaresActivos;
  
  selectionMode;
  editMode;
  progressSpinner: boolean = false;
  selectDatos;

  numSelected:number = 0;
  selectedItem: number = 10;

  selectMultiple: boolean = false;
  seleccion: boolean = false;
  openFicha: boolean = false;
  historico: boolean = false;
  resaltadoDatosGenerales: boolean = false;
  activacionTarjeta: boolean = false;

  @Input() modoEdicion;
  @Input() tarjetaUnidadFamiliar: string;
  @Input() permisoEscritura;
  @Input() openTarjetaUnidadFamiliar;

  @Output() searchHistoricalSend = new EventEmitter<boolean>();
  @Output() opened = new EventEmitter<boolean>();
  @Output() idOpened = new EventEmitter<boolean>();

  fichaPosible = {
    key: "unidadFamiliar",
    activa: false
  }

  constructor(private changeDetectorRef: ChangeDetectorRef, private confirmationService: ConfirmationService,
    private persistenceService: PersistenceService, private router: Router,
    private commonsService: CommonsService, private translateService: TranslateService,
    private sigaServices: SigaServices ) { }

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
    } else {
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
    this.progressSpinner=true;

    let data = [];
    let ejg: EJGItem;

    for(let i=0; this.selectedDatos.length>i; i++){
      ejg = this.selectedDatos[i];
      ejg.fechaEstadoNew=this.fechaEstado;
      ejg.estadoNew=this.valueComboEstado;

      data.push(ejg);
    }
    this.sigaServices.post("gestionejg_borrarFamiliar", data).subscribe(
      n => {
        this.progressSpinner=false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }
  activate() {

  }
  searchHistorical() {
    this.datosFamiliares.historico = !this.datosFamiliares.historico;
    this.historico = !this.historico;
    if (this.historico) {
      this.editMode = false;
      this.nuevo = false;
      this.selectAll = false;
      this.numSelected = 0;
      this.datosFamiliaresActivos = JSON.parse(JSON.stringify(this.datosFamiliares));
    } else {
      this.datosFamiliaresActivos = this.datosFamiliares.filter(
        (dato) =>  /*dato.fechaBaja != undefined && */dato.fechaBaja == null);
    }
    this.selectMultiple = false;
    this.selectionMode = "single";
    this.persistenceService.setHistorico(this.historico);

  }
  checkPermisosDownloadEEJ(){
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.downloadEEJ();
    }
  }
  downloadEEJ(){
    this.progressSpinner=true;

    this.sigaServices.post("gestionejg_descargarExpedientesJG", this.selectDatos).subscribe(
      n => {
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }
    );
  }
  checkPermisosSolicitarEEJ(){
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.solicitarEEJ();
    }
  }
  solicitarEEJ() {

  }
  checkPermisosComunicar(datos) {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.comunicar(datos);
    }
  }
  comunicar(datos) {

  }
  checkPermisosConfirmDelete() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.confirmDelete();
    }
  }
  checkPermisosActivate() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.activate();
    }
  }
  checkPermisosAsociar() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.asociar();
    }
  }
  asociar() {

  }
}
