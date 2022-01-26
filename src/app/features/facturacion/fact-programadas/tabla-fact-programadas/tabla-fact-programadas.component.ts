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

@Component({
  selector: 'app-tabla-fact-programadas',
  templateUrl: './tabla-fact-programadas.component.html',
  styleUrls: ['./tabla-fact-programadas.component.scss']
})
export class TablaFactProgramadasComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  permisoEscritura: boolean = false;

  //Resultados de la busqueda
  @Input() datos: FacFacturacionprogramadaItem[];
  
  @Output() busqueda = new EventEmitter<boolean>();

  datosMostrados: FacFacturacionprogramadaItem[];
  historico: boolean;

  // Elementos para la tabla
  @ViewChild("table") table: DataTable;
  rowsPerPage = [];
  selectedItem: number = 10;
  selectedDatos = [];
  cols = [];
  buscadores = [];
  selectAll: boolean;
  selectMultiple: boolean;

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
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    this.getCols();
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
        } else if(idEstado == "2" || idEstado == "3") {
          res = "success";
        } else if(idEstado == "4" || idEstado == "20" || idEstado == "21") {
          res = "danger";
        }
        break;
      case 'pdf':
        if (idEstado == "6" || idEstado == "7" || idEstado == "8") {
          res = "warning";
        } else if(idEstado == "9") {
          res = "success";
        } else if(idEstado == "10") {
          res = "danger";
        }
        break;
      case 'env':
        if (idEstado == "12" || idEstado == "13" || idEstado == "14") {
          res = "warning";
        } else if(idEstado == "15") {
          res = "success";
        } else if(idEstado == "16") {
          res = "danger";
        }
        break;
      case 'tra':
        if (idEstado == "23" || idEstado == "24" || idEstado == "25") {
          res = "warning";
        } else if(idEstado == "26") {
          res = "success";
        } else if(idEstado == "27") {
          res = "danger";
        }
      break;
      default:
        break;
    }
    return res;
  }

  // Botón de eliminar
  confirmEliminar(): void {
    let mess = this.translateService.instant("justiciaGratuita.ejg.message.eliminarDocumentacion");
    let icon = "fa fa-eraser";

    this.confirmationService.confirm({
      // key: "confirmEliminar",
      message: mess,
      icon: icon,
      accept: () => {
        this.progressSpinner = true;
        Promise.all(this.selectedDatos.map<Promise<any>>(dato => this.eliminar(dato)))
          .catch(error => {
            if (error != undefined) {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), error);
            } else {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
            }
          }).then(() => {
            this.busqueda.emit();
            this.progressSpinner = false;
          });
        
      },
      reject: () => {
        this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
      }
    });
  }

  eliminar(dato: FacFacturacionprogramadaItem): Promise<any> {
    return this.sigaServices.post("facturacionPyS_eliminarFacturacion", dato).toPromise().then(
      n => { },
      err => {
        return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  confirmDescargar(){

  }

  confirmComunicar(){

  }

  nuevoFicheroAdeudos(){
    let ficheroAdeudos = new FicherosAdeudosItem();
    sessionStorage.setItem("FicherosAdeudosItem", JSON.stringify(ficheroAdeudos));
    sessionStorage.setItem("Nuevo", "true");

    this.router.navigate(['/gestionAdeudos']);
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
    let resHead = { 'response' : null, 'header': null };
    this.progressSpinner = true;

    let downloadBody = this.selectedDatos.map(d => {
      return { idSerieFacturacion: d.idSerieFacturacion, idProgramacion: d.idProgramacion };
    });

    let descarga =  this.sigaServices.getDownloadFiles("facturacionPyS_descargarFichaFacturacion", downloadBody);
    descarga.subscribe(response => {
      this.progressSpinner = false;

      const file = new Blob([response.body], {type: response.headers.get("Content-Type")});
			let filename: string = response.headers.get("Content-Disposition");
      filename = filename.split(';')[1].split('filename')[1].split('=')[1].trim();

      saveAs(file, filename);
      this.showMessage( 'success', 'LOG descargado correctamente',  'LOG descargado correctamente' );
    },
    err => {
      this.progressSpinner = false;
      this.showMessage('error','El LOG no pudo descargarse',  'El LOG no pudo descargarse' );
    });
  }

  // Funciones de utilidad

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
