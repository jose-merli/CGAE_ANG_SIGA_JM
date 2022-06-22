import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable, Message } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { FacFacturacionprogramadaItem } from '../../../../models/FacFacturacionprogramadaItem';
import { SerieFacturacionItem } from '../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { saveAs } from "file-saver/FileSaver";
import { FicherosAdeudosItem } from '../../../../models/sjcs/FicherosAdeudosItem';
import { procesos_facturacionPyS } from '../../../../permisos/procesos_facturacionPyS';

@Component({
  selector: 'app-tabla-fact-programadas',
  templateUrl: './tabla-fact-programadas.component.html',
  styleUrls: ['./tabla-fact-programadas.component.scss']
})
export class TablaFactProgramadasComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  permisoEscritura: boolean = false;
  permisoDisqueteCargos: boolean = false;

  //Resultados de la busqueda
  @Input() datos: FacFacturacionprogramadaItem[];

  @Output() busqueda = new EventEmitter<boolean>();

  datosMostrados: FacFacturacionprogramadaItem[];
  historico: boolean;

  // Elementos para la tabla
  @ViewChild("table") table: DataTable;
  rowsPerPage = [];
  selectedItem: number = 10;
  selectedDatos: FacFacturacionprogramadaItem[] = [];
  cols = [];
  buscadores = [];
  selectAll: boolean;
  selectMultiple: boolean;

  @Input() controlEmisionFacturasSII: boolean = false;

  showModalEliminar: boolean = false;
  currentUsername: string;
  currentDataToDelete: FacFacturacionprogramadaItem[] = [];
  numDeletedItems: number = 0;

  nombreFacturacionDel: string;

  constructor(
    private commonsService: CommonsService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private persistenceService: PersistenceService,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.getPermisoEscritura(); // Comprobamos el tipo de aceso
    this.getPermisoFicheroAdeudos(); // Permiso para la acción de Nuevo Fichero Adeudos

    this.getCols();
    this.getDataLoggedUser();
  }

  // Permiso del menú Facturaciones
  getPermisoEscritura() {
    this.commonsService
      .checkAcceso(procesos_facturacionPyS.facturaciones)
      .then((respuesta) => {
        this.permisoEscritura = respuesta;
      })
      .catch((error) => console.error(error));
  }

  // Permiso del menú FIchero de Adeudos
  getPermisoFicheroAdeudos() {
    this.commonsService
      .checkAcceso(procesos_facturacionPyS.ficheroAdeudos)
      .then((respuesta) => {
        this.permisoDisqueteCargos = respuesta;
      })
      .catch((error) => console.error(error));
  }

  // Se actualiza cada vez que cambien los inputs
  ngOnChanges() {
    this.selectedDatos = [];
    this.filterDatosByHistorico();
  }

  // Definición de las columnas
  getCols() {
    this.cols = [
      { field: "nombreAbreviado", header: "facturacion.factProgramadas.serieFactu", width: "10%" },
      { field: "descripcion", header: "enviosMasivos.literal.descripcion", width: "20%" },
      { field: "compraSuscripcion", header: "menu.productosYServicios.solicitudes.alta", width: "10%" },
      { field: "fechaCompraSuscripcionDesde", header: "censo.solicitudincorporacion.fechaDesde", width: "5%" },
      { field: "fechaCompraSuscripcionHasta", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaHasta", width: "5%" },
      { field: "fechaPrevistaGeneracion", header: "facturacion.factProgramadas.fechas.prevGen", width: "5%" },
      { field: "fechaConfirmacion", header: "facturacion.factProgramadas.fechas.conf", width: "5%" },
      { field: "importe", header: "facturacionSJCS.facturacionesYPagos.importeTotal", width: "10%" },
      { field: "estado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado", width: "10%" }
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
      this.selectedDatos = this.datosMostrados;
    } else {
      this.selectedDatos = [];
      this.selectMultiple = false;
    }
  }

  // Botón de ocultar o mostrar histórico
  toggleHistorico(): void {
    this.historico = !this.historico;

    this.filterDatosByHistorico();

    this.selectedDatos = [];
    this.table.reset();
    this.selectAll = false;
    if (this.selectMultiple) {
      this.selectMultiple = false;
    }

    setTimeout(() => {
      this.commonsService.scrollTablaFoco('tablaFoco');
      this.commonsService.scrollTop();
    }, 5);
  }

  // Mostrar u ocultar histórico
  filterDatosByHistorico(): void {
    if (this.historico)
      this.datosMostrados = this.datos.filter(dato => dato.archivarFact);
    else
      this.datosMostrados = this.datos.filter(dato => !dato.archivarFact);
  }

  // Abrir ficha de serie facturación
  openTab(selectedRow) {
    let facturacionProgramadaItem: FacFacturacionprogramadaItem = selectedRow;
    sessionStorage.setItem("facturacionProgramadaItem", JSON.stringify(facturacionProgramadaItem));
    this.router.navigate(["/fichaFacturaciones"]);
  }

  // Badges para la columna 'estado'
  calcBadgeEstado(estado: string, idEstado: string): string {
    let res = "light";

    switch (estado) {
      case 'fac':
        if (idEstado == "1" || idEstado == "18" || idEstado == "19" || idEstado == "17") {
          res = "warning";
        } else if (idEstado == "2" || idEstado == "3") {
          res = "success";
        } else if (idEstado == "4" || idEstado == "20" || idEstado == "21") {
          res = "danger";
        }
        break;
      case 'pdf':
        if (idEstado == "6" || idEstado == "7" || idEstado == "8") {
          res = "warning";
        } else if (idEstado == "9") {
          res = "success";
        } else if (idEstado == "10") {
          res = "danger";
        }
        break;
      case 'env':
        if (idEstado == "12" || idEstado == "13" || idEstado == "14") {
          res = "warning";
        } else if (idEstado == "15") {
          res = "success";
        } else if (idEstado == "16") {
          res = "danger";
        }
        break;
      case 'tra':
        if (idEstado == "23" || idEstado == "24" || idEstado == "25") {
          res = "warning";
        } else if (idEstado == "26") {
          res = "success";
        } else if (idEstado == "27") {
          res = "danger";
        }
        break;
      default:
        break;
    }
    return res;
  }

  // Acción del botón de eliminar
  confirmEliminar(firstItem: boolean = true): void {
    if (this.selectedDatos && this.selectedDatos.length > 0) {
      this.confirmEliminar1();
    } else if (!firstItem && this.numDeletedItems > 0) {
      this.busqueda.emit();
    } else if (firstItem) {
      this.numDeletedItems = 0;
    }
  }

  // Primera confirmación
  confirmEliminar1(): void {
    let mess = this.translateService.instant("justiciaGratuita.ejg.message.eliminarDocumentacion");
    let icon = "fa fa-eraser";

    this.confirmationService.confirm({
      key: "first",
      message: mess,
      icon: icon,
      acceptLabel: "Sí",
      rejectLabel: "No",
      accept:async () => {

        for(let e of this.selectedDatos){
          await this.segundaConf(e)
        }

        if(this.currentDataToDelete.length == 0){
          this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
        }else{
          this.eliminar(this.currentDataToDelete)
        }        

      },
      reject: () => {
        this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
      }
    });




  }

   segundaConf(dato:FacFacturacionprogramadaItem){
    let mess = this.translateService.instant("justiciaGratuita.ejg.message.eliminarDocumentacion") + " " + dato.descripcion ;
    let icon = "fa fa-eraser";
    
    return new Promise<void> ((resolve) => {
      this.confirmationService.confirm({
        key: "second",
        message: mess,
        icon: icon,
        acceptLabel: "Sí",
        rejectLabel: "No",
        accept: () => {
          this.currentDataToDelete.push(dato)
         // this.selectedDatos.shift()
          resolve()
        },
        reject: () => {
          //this.selectedDatos.shift()
          resolve()
        }
      });

    });

      
  }

  // Segunda confirmación

  confirmEliminar2(): void {

    this.showModalEliminar = false;
    //this.eliminar(this.currentDataToDelete);
    console.log(this.currentDataToDelete)
  }

  rejectEliminar2(): void {
    this.showModalEliminar = false;
    this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
  }


  // Función de eliminar

  eliminar(datos: FacFacturacionprogramadaItem[]) {
    this.progressSpinner = true;
    this.sigaServices.post("facturacionPyS_eliminarFacturacion", datos).subscribe(
      data => {
        let dato = JSON.parse(data.body);
        let facturacionesEliminadas = dato.error.description.split("/");
        this.progressSpinner = false;
        console.log(data)
        this.showMessage("success", "Facturaciones Borradas", "Facturaciones Eliminadas : " + facturacionesEliminadas[0]);
        //this.translateService.instant("general.message.accion.cancelada")
        this.busqueda.emit();
      },
      err => {
        this.handleServerSideErrorMessage(err);
        this.progressSpinner = false;   
      }
    );
  }

  // Obtenemos el nombre del usuario actual para la confirmación
  getDataLoggedUser() {
    this.sigaServices.get("usuario_logeado").subscribe(n => {
      const usuario = n.usuarioLogeadoItem;

      if (usuario && usuario.length > 0) {
        this.currentUsername = usuario[0].nombre;
      }
    });
  }

  confirmComunicar() {

  }

  nuevoFicheroAdeudos() {
    let facturacionesGeneracion = this.selectedDatos;

    if (facturacionesGeneracion && facturacionesGeneracion.length != 0) {
      let ficheroAdeudos = new FicherosAdeudosItem();
      ficheroAdeudos.facturacionesGeneracion = facturacionesGeneracion;
      sessionStorage.setItem("FicherosAdeudosItem", JSON.stringify(ficheroAdeudos));
      sessionStorage.setItem("Nuevo", "true");

      this.router.navigate(["/gestionAdeudos"]);
    }
  }

  // Botón para archivar selección
  archivar(): void {
    this.progressSpinner = true;
    this.selectedDatos.forEach((d: FacFacturacionprogramadaItem) => d.archivarFact = true);

    this.sigaServices.post("facturacionPyS_archivarFacturacionesProgramadas", this.selectedDatos).subscribe(
      n => {
        this.busqueda.emit();
        this.progressSpinner = false;
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      }
    );
  }

  // Botón para desarchivar selección
  desarchivar(): void {
    this.progressSpinner = true;
    this.selectedDatos.forEach((d: FacFacturacionprogramadaItem) => d.archivarFact = false);

    this.sigaServices.post("facturacionPyS_archivarFacturacionesProgramadas", this.selectedDatos).subscribe(
      n => {
        this.busqueda.emit();
        this.progressSpinner = false;
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      }
    );
  }

  // Descargar LOG
  descargarLog(): void {
    let resHead = { 'response': null, 'header': null };
    this.progressSpinner = true;

    let downloadBody = this.selectedDatos.map(d => {
      return { idSerieFacturacion: d.idSerieFacturacion, idProgramacion: d.idProgramacion };
    });

    let descarga = this.sigaServices.getDownloadFiles("facturacionPyS_descargarFichaFacturacion", downloadBody);
    descarga.subscribe(response => {
      this.progressSpinner = false;

      const file = new Blob([response.body], { type: response.headers.get("Content-Type") });
      let filename: string = response.headers.get("Content-Disposition");
      filename = filename.split(';')[1].split('filename')[1].split('=')[1].trim();

      saveAs(file, filename);
      this.showMessage('success', 'LOG descargado correctamente', 'LOG descargado correctamente');
    },
      err => {
        this.progressSpinner = false;
        this.showMessage('error', 'El LOG no pudo descargarse', 'El LOG no pudo descargarse');
      });
  }

  // Funciones de utilidad

  handleServerSideErrorMessage(err): void {
    let error = JSON.parse(err.error);
    if (error && error.error && error.error.message) {
      let message = this.translateService.instant(error.error.message);

      if (message && message.trim().length != 0) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), message);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), error.error.message);
      }
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
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
