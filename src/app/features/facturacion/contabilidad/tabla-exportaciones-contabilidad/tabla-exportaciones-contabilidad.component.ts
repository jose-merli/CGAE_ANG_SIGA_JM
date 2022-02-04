import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import { FacRegistroFichContaItem } from '../../../../models/FacRegistroFichContaItem';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable, Message } from 'primeng/primeng';
import { PersistenceService } from '../../../../_services/persistence.service';
import { TranslateService } from '../../../../commons/translate';
import { DatePipe } from '@angular/common';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';
import { Console } from 'console';
import { truncate } from 'fs';
import { FindValueSubscriber } from 'rxjs/operators/find';
import { procesos_facturacionPyS } from '../../../../permisos/procesos_facturacionPyS';
import { saveAs } from "file-saver/FileSaver";


@Component({
  selector: 'app-tabla-exportaciones-contabilidad',
  templateUrl: './tabla-exportaciones-contabilidad.component.html',
  styleUrls: ['./tabla-exportaciones-contabilidad.component.scss'],

})
export class TablaExportacionesContabilidadComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  permisoEscritura: boolean = true;

  //Resultados de la busqueda
  @Input() datos: FacRegistroFichContaItem[];
  @Input() filtro;
  @Input() ultimaFechaHasta;
  @Output() busqueda = new EventEmitter<boolean>();
  
  // Elementos para la tabla
  @ViewChild("table") table: DataTable;
  rowsPerPage = [];
  selectedItem: number = 10;
  selectedDatos = [];
  cols = [];
  buscadores = [];
  selectAll: boolean;
  selectMultiple: boolean;
  editar:boolean = false;
  @Input() historico: boolean; //Indica si se estan mostrando historicos o no para por ejemplo ocultar/mostrar los botones de historico.
  @Input() disabledNuevo: boolean;
  @Input() enabledSave: boolean;
  //Variables para mostrar boton reactivar o eliminar
  numSelectedAbleRegisters: number = 0;
  numSelectedDisableRegisters: number = 0;

  newRegister:FacRegistroFichContaItem = new FacRegistroFichContaItem();

  //PERMISOS
  permisoEliminarReactivarExporContabilidad: boolean = false;
  permisoGuardarExporContabilidad: boolean = false;

  constructor(
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private datepipe: DatePipe,
    private confirmationService: ConfirmationService,
    private commonsServices: CommonsService
  ) { }

  ngOnInit() {
    this.checkPermisos();

    this.getCols();
  }

  //INICIO METODOS PERMISOS

  checkPermisos() {
    this.getPermisoGuardarExporContabilidad();
    this.getPermisoReactivarExporContabilidad(); 
  }

  getPermisoGuardarExporContabilidad() {
    this.commonsService
       .checkAcceso(procesos_facturacionPyS.guardarFicheroExportacionContabilidad)
        .then((respuesta) => {
           this.permisoGuardarExporContabilidad = respuesta;
        })
    .catch((error) => console.error(error));
  }

  getPermisoReactivarExporContabilidad() {
    this.commonsService
       .checkAcceso(procesos_facturacionPyS.eliminarReactivarFicheroExportacionContabilidad)
        .then((respuesta) => {
           this.permisoEliminarReactivarExporContabilidad = respuesta;
        })
    .catch((error) => console.error(error));
  }

  //FIN METODOS SERVICIOS

  // Se actualiza cada vez que cambien los inputs
  ngOnChanges(changes: SimpleChanges) {
    this.selectedDatos = [];
   /*  if(changes.datos != undefined){
      this.historico = false;
      this.enabledSave = false;
      this.disabledNuevo = false;
    } */
  }

  // Definición de las columnas
  getCols() {
    this.cols = [
      { field: "idContabilidad", header: this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.identificador"), width: "10%" },
      { field: "fechaCreacion", header: this.translateService.instant("informesycomunicaciones.enviosMasivos.fechaCreacion"), width: "10%" },
      { field: "nombreFichero", header: this.translateService.instant("censo.cargaMasivaDatosCurriculares.literal.nombreFichero"), width: "40%" },
      { field: "fechaExportacionDesde", header: this.translateService.instant("administracion.auditoriaUsuarios.fechaDesde"), width: "10%" }, 
      { field: "fechaExportacionHasta", header: this.translateService.instant("administracion.auditoriaUsuarios.fechaHasta"), width: "10%" },
      { field: "numAsientos", header: this.translateService.instant("facturacion.contabilidad.tabla.numAsientos"), width: "10%" }, 
      { field: "nombreEstado", header: this.translateService.instant("censo.fichaIntegrantes.literal.estado"), width: "10%" }, 
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
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 30,
        value: 30
      },
    ];
  }

  // Resultados por página
  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  // Checkbox de seleccionar todo
  onChangeSelectAll(): void {
      if (this.selectAll) {
        this.selectMultiple = true;
        this.selectedDatos = this.datos;

        this.numSelectedAbleRegisters = 0;
        this.numSelectedDisableRegisters = 0;

        this.selectedDatos.forEach(rows => {
          if (rows.fechaBaja == null) {
            this.numSelectedAbleRegisters++;
          } else {
            this.numSelectedDisableRegisters++;
          }
        });

      } else {
        this.selectedDatos = [];
        this.selectMultiple = false;
        this.numSelectedAbleRegisters = 0;
        this.numSelectedDisableRegisters = 0;
      }
  }

  //Metodo para aplicar logica al seleccionar filas
  onRowSelect() {
    this.numSelectedAbleRegisters = 0;
    this.numSelectedDisableRegisters = 0;

    this.selectedDatos.forEach(rows => {
      if (rows.fechaBaja == null) {
        this.numSelectedAbleRegisters++;
      } else {
        this.numSelectedDisableRegisters++;
      }
    });
  }

  //Metodo para aplicar logica al deseleccionar filas
  onRowUnselect() {
    this.numSelectedAbleRegisters = 0;
    this.numSelectedDisableRegisters = 0;

    this.selectedDatos.forEach(rows => {
      if (rows.fechaBaja == null) {
        this.numSelectedAbleRegisters++;
      } else {
        this.numSelectedDisableRegisters++;
      }
    });
  }

  fillFechaNew(event, campo) {
     if(campo === 'exportacionDesde'){
        this.newRegister.fechaExportacionDesde = event;
        this.newRegister.fechaExportacionDesde = this.transformDate(this.newRegister.fechaExportacionDesde);
     }else if(campo === 'exportacionHasta'){
       this.newRegister.fechaExportacionHasta = event;
       this.newRegister.fechaExportacionHasta = this.transformDate(this.newRegister.fechaExportacionHasta);
    }
  }

  // FUnciones de utilidad

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

  restablecer(){
    this.disabledNuevo = false;
    this.enabledSave = false;
    this.historico = false;
    //False para buscar sin historico
    this.busqueda.emit(false);
  }

  checkNuevo(){
    let msg = null;
      msg = this.commonsService.checkPermisos(this.permisoGuardarExporContabilidad, undefined);
  
  	  if (msg != null) {
        this.msgs = msg;
      } else {
        this.getNewFacRegistroFichConta();
      }
  }

  getNewFacRegistroFichConta() {
    this.progressSpinner = true;
    this.newRegister = new FacRegistroFichContaItem();
    this.sigaServices.get("facturacionPyS_maxIdContabilidad").subscribe(
      n => {
        this.newRegister = n.facRegistroFichConta[0]
        this.new(this.newRegister);
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);
    else
      fecha = null;
    fecha = this.datepipe.transform(fecha, 'dd/MM/yyyy');
    return fecha;
  }

  nombreFichero(){
    let name = "";
    name += this.newRegister.idContabilidad.toString() + "_";
    name += this.datepipe.transform(new Date(), 'dd-MM-yyyy');
    name += ".xls"
    return name
  }
  
  new(idNew:FacRegistroFichContaItem){
    this.disabledNuevo = true;
    this.enabledSave = true;
    this.editar = true;
    idNew.fechaCreacion = this.transformDate(new Date());
    idNew.nuevo = true;
    idNew.nombreFichero = this.nombreFichero();
    //Fecha hasta por defecto al dia de hoy
    idNew.fechaExportacionHasta = new Date();
    idNew.fechaExportacionHasta = this.transformDate(idNew.fechaExportacionHasta);

    //Añadir 1 dia a la ultima fecha hasta exportada.(Si no hay ninguna exportacion anterior se establece al dia de hoy)
    if(this.datos.length > 0){
      idNew.fechaExportacionDesde = new Date();
      this.ultimaFechaHasta = new Date(this.ultimaFechaHasta);
      idNew.fechaExportacionDesde = this.ultimaFechaHasta;
      idNew.fechaExportacionDesde.setDate(idNew.fechaExportacionDesde.getDate() + 1);
      idNew.fechaExportacionDesde = this.transformDate(idNew.fechaExportacionDesde);
      
    }else{
      idNew.fechaExportacionDesde = this.transformDate(new Date());
    }

    this.datos.unshift(idNew);
   
  }

  checkCampoEsVacio(campo){
    if(campo != "" && campo != null && campo != undefined){
      return false;
    }else{
      return true;
    }
  }

  checkGuardarPermisos(){
    let msg = null;
    msg = this.commonsService.checkPermisos(this.permisoGuardarExporContabilidad, undefined);
  
  	if (msg != null) {
      this.msgs = msg;
    } else {
      this.checkObligatorios();
    }
  }

  checkObligatorios(){
    if(this.datos[0].nuevo == true && !this.checkCampoEsVacio(this.datos[0].nombreFichero) && !this.checkCampoEsVacio(this.datos[0].fechaExportacionDesde)){
      this.guardar();
    }else{
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
    }
  }

  styleObligatorio(campo){
    return this.commonsServices.styleObligatorio(campo);
  }

  convertirMascaraDDMMYYaDate(fecha){
    let fechaConvertida;

    let partesFecha = fecha.split("/");

    //El mes en Objeto Date empieza por 0 por eso le restamos 1 a la parte del mes.
    return fechaConvertida = new Date(+partesFecha[2], partesFecha[1] - 1, +partesFecha[0]); 
  }

  guardar(){
    this.disabledNuevo = false;
    this.enabledSave = false;
    this.numSelectedAbleRegisters = 0;
    this.numSelectedDisableRegisters = 0;
    this.progressSpinner = true;

    this.newRegister.fechaCreacion = this.convertirMascaraDDMMYYaDate(this.newRegister.fechaCreacion);
    this.newRegister.fechaExportacionDesde = this.convertirMascaraDDMMYYaDate(this.newRegister.fechaExportacionDesde);
    this.newRegister.fechaExportacionHasta = this.convertirMascaraDDMMYYaDate(this.newRegister.fechaExportacionHasta);

    this.sigaServices.post("facturacionPyS_guardarRegistroFichConta", this.newRegister).subscribe(
      n => {
        if(n.status == 200)
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        if(n.status == 400)
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

        this.disabledNuevo = false;
        this.enabledSave = false;
        this.historico = false;
        //false para buscar sin historico
        this.busqueda.emit(false);
        this.progressSpinner = false;

      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.busqueda.emit(false);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        setTimeout(() => {
          this.commonsService.scrollTablaFoco('tablaFoco');
          this.commonsService.scrollTop();
        }, 5);
      }
    );
    
  }

  checkActivarDesactivar(){
    let msg = null;
	  msg = this.commonsService.checkPermisos(this.permisoEliminarReactivarExporContabilidad, undefined);

	  if (msg != null) {
	    this.msgs = msg;
	  } else {
	    this.activarDesactivar();
    }
  }

  //Metodo para activar/desactivar servicios mediante borrado logico (es decir fechabaja == null esta activo lo contrario inactivo) en caso de que tenga alguna solicitud ya existente, en caso contrario se hara borrado fisico (DELETE)
  activarDesactivar() {
    let keyConfirmation = "deletePlantillaDoc";
    let mensaje;
    this.numSelectedAbleRegisters = 0;
    this.numSelectedDisableRegisters = 0;

    if (this.selectedDatos[0].fechaBaja != null) {
      mensaje = this.translateService.instant("facturacion.maestros.tiposproductosservicios.reactivarconfirm");
    } else if (this.selectedDatos[0].fechabaja == null) {
      mensaje = this.translateService.instant("messages.deleteConfirmation");
    }

    this.confirmationService.confirm({
      key: keyConfirmation,
      message: mensaje,
      icon: "fa fa-trash-alt",
      accept: () => {
        this.progressSpinner = true;

        let registros: FacRegistroFichContaItem[] = JSON.parse(JSON.stringify(this.selectedDatos));
        registros.forEach(registro => {
          registro.fechaCreacion = this.convertirMascaraDDMMYYaDate(registro.fechaCreacion);
          registro.fechaExportacionDesde = this.convertirMascaraDDMMYYaDate(registro.fechaExportacionDesde);
          registro.fechaExportacionHasta = this.convertirMascaraDDMMYYaDate(registro.fechaExportacionHasta);
          if(registro.fechaBaja != null){
            registro.fechaBaja = new Date(registro.fechaBaja);
          } 
        });

        this.sigaServices.post("facturacionPyS_desactivarReactivarRegistroFichConta", registros).subscribe(
          response => {
            if(response.status == 200)
              this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            if(response.status == 400)
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          },
          err => {
            this.progressSpinner = false;
          },
          () => {
            this.selectedDatos = [];
            this.historico = false;
            this.selectAll = false;
            this.selectMultiple = false;
            this.busqueda.emit(false);
            this.progressSpinner = false;
          }
        );
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  descargar(){
    this.progressSpinner = true;
    let registros: FacRegistroFichContaItem[] = JSON.parse(JSON.stringify(this.selectedDatos));
    
    registros.forEach(registro => {
      registro.fechaCreacion = this.convertirMascaraDDMMYYaDate(registro.fechaCreacion);
      registro.fechaExportacionDesde = this.convertirMascaraDDMMYYaDate(registro.fechaExportacionDesde);
      registro.fechaExportacionHasta = this.convertirMascaraDDMMYYaDate(registro.fechaExportacionHasta);
      if(registro.fechaBaja != null){
        registro.fechaBaja = new Date(registro.fechaBaja);
      } 
    });

    this.sigaServices.postDownloadFilesWithFileName("contabilidadExportacion_descargarFicheros", registros).subscribe(
      (response: {file: Blob, filename: string, status: number}) => {
        // Se comprueba si todos los documentos asociados no tiene ningún fichero 
        if(response.file.size > 0 && response.status == 200){
          let filename = response.filename.split(';')[1].split('filename')[1].split('=')[1].trim();
          saveAs(response.file, filename);
        }
        else if(response.status == 204){
          this.showMessage("error", this.translateService.instant("general.message.informacion"), this.translateService.instant("messages.general.error.ficheroNoExiste"));
        }
        else{
           this.showMessage("error", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.ejg.documentacion.noFich"));
        }

        this.selectedDatos = [];
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },()=>{
        this.progressSpinner = false;
      }
    );
  }

  //Metodo para obtener los datos de la tabla FAC_REGISTROFICHCONTA tanto activos como no activos
  getListaFacRegistroHistorico() {
    this.historico = true;
    this.selectMultiple = false;
    this.selectAll = false
    this.numSelectedAbleRegisters = 0;
    this.numSelectedDisableRegisters = 0;
    this.selectedDatos = [];

    //true para buscar con historico
    this.busqueda.emit(true);
  }

  getListaFacRegistroSinHistorico(){
    this.historico = false;
    this.selectMultiple = false;
    this.selectAll = false
    this.numSelectedAbleRegisters = 0;
    this.numSelectedDisableRegisters = 0;
    this.selectedDatos = [];

    //false para buscar sin historico
    this.busqueda.emit(false);
  }

}