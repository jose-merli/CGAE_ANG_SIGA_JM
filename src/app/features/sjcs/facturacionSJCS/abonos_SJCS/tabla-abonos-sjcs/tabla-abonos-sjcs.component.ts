import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable } from 'primeng/primeng';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Message } from 'primeng/components/common/message';
import { FacAbonoItem } from '../../../../../models/sjcs/FacAbonoItem';
import { DatePipe } from '@angular/common';
import { TranslateService } from '../../../../../commons/translate';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { DatosColegiadosItem } from '../../../../../models/DatosColegiadosItem';


@Component({
  selector: 'app-tabla-abonos-sjcs',
  templateUrl: './tabla-abonos-sjcs.component.html',
  styleUrls: ['./tabla-abonos-sjcs.component.scss'],

})
export class TablaAbonosSCJSComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  permisoEscritura: boolean = true;

  //Resultados de la busqueda
  @Input() datos: FacAbonoItem[];
  @Input() filtro;
  @Output() busqueda = new EventEmitter<boolean>();
  
  // Elementos para la tabla
  @ViewChild("table") table: DataTable;
  rowsPerPage = [];
  selectedItem: number = 10;
  selectedDatos: FacAbonoItem[] = [];
  cols = [];
  buscadores = [];
  selectAll: boolean;
  selectMultiple: boolean;
  disabledNuevo : boolean = false;
  enabledSave:boolean = false;
  editar:boolean = false;

  FAC_ABONO_ESTADO_PENDIENTE_BANCO: string = "5";


  constructor(
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private datepipe: DatePipe,
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
    console.log("CA")
  }

  // Definición de las columnas
  getCols() {
    this.cols = [
      { field: "numeroAbono", header: this.translateService.instant("facturacionSJCS.tabla.abonosSJCS.numeroAbono"), width: "10%" },
      { field: "fechaEmision", header: this.translateService.instant("facturacion.facturas.fechaEmision"), width: "10%" },
      { field: "nombrePago", header: this.translateService.instant("facturacionSJCS.tabla.abonosSJCS.pagoSJCS"), width: "20%" },
      { field: "ncolident", header: this.translateService.instant("facturacion.facturas.numeroColegiadoIdentificador"), width: "10%" },
      { field: "nombreCompleto", header: this.translateService.instant("facturacion.productos.Cliente"), width: "20%" },
      { field: "esSociedad", header: this.translateService.instant("facturacionSJCS.filtros.abonosSJCS.sociedad"), width: "10%" },
      { field: "importeTotal", header: this.translateService.instant("facturacionSJCS.facturacionesYPagos.importeTotal"), width: "10%" }, 
      { field: "importePendientePorAbonar", header: this.translateService.instant("facturacion.facturas.importePendiente"), width: "10%" },
      { field: "estadoNombre", header: this.translateService.instant("censo.fichaIntegrantes.literal.estado"), width: "10%" }, 
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
    ];
  }

  // Abrir ficha de fichero de devoluciones
  openTab(evento) {
    console.log("evento -> ", evento);

    this.progressSpinner = true;

    this.persistenceService.setDatos(evento);
    
    sessionStorage.setItem('filtrosAbonosSJCS', JSON.stringify(this.filtro));
    sessionStorage.setItem('abonosSJCSItem', JSON.stringify(evento));

    this.router.navigate(["/fichaAbonosSJCS"]);


  }

  navigateToCliente(selectedRow:FacAbonoItem) {
    
    if (selectedRow.esSociedad == "NO") {
      
      this.progressSpinner = true;

      sessionStorage.setItem("consulta", "true");
      let filtros = { idPersona: selectedRow.idPersona };

      this.sigaServices.postPaginado("busquedaColegiados_searchColegiadoFicha", "?numPagina=1", filtros).toPromise().then(
        n => {
          let results: DatosColegiadosItem[] = JSON.parse(n.body).colegiadoItem;
          
          if (results != undefined && results.length != 0) {
            let datosColegiado: DatosColegiadosItem = results[0];

            
            sessionStorage.setItem("abonosSJCSItem", JSON.stringify(selectedRow));
            sessionStorage.setItem("volverAbonoSJCS", "true");

            sessionStorage.setItem("personaBody", JSON.stringify(datosColegiado));
            sessionStorage.setItem("filtrosAbonosSJCS", JSON.stringify(this.filtro));
            sessionStorage.setItem("solicitudAprobada", "true");
          }
        },
        err => {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      ).then(() => this.progressSpinner = false).then(() => {
        if (sessionStorage.getItem("personaBody")) {
          this.router.navigate(["/fichaColegial"]);
        } 
      });
    }else{
      this.progressSpinner = true;
    
      this.sigaServices.postPaginado(
        "fichaColegialSociedades_searchSocieties",
        "?numPagina=1", selectedRow.idPersona).toPromise().then(
        n => {
          let results: any[] = JSON.parse(n.body).busquedaJuridicaItems;
          if (results != undefined && results.length != 0) {
            let sociedadItem: any = results[0];
  
            sessionStorage.setItem("abonosSJCSItem", JSON.stringify(selectedRow));
            sessionStorage.setItem("volver", "true");
  
            sessionStorage.setItem("usuarioBody", JSON.stringify(sociedadItem));
          }
        },
        err => {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      ).then(() => this.progressSpinner = false).then(() => {
        if (sessionStorage.getItem("usuarioBody")) {
          this.router.navigate(["/fichaPersonaJuridica"]);
        } 
      });
    }
    
  }

  disableNuevoFicheroTransferencias() {
    return !this.selectedDatos || this.selectedDatos.filter(d => d.estado && d.estado.toString() == this.FAC_ABONO_ESTADO_PENDIENTE_BANCO).length == 0;
  }

  // Confirmación de un nuevo fichero de transferencias
  confirmNuevoFicheroTransferencias(): void {
    let mess = this.translateService.instant("facturacionPyS.facturas.fichTransferenciasSJCS.confirmacion");
    let icon = "fa fa-plus";

    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      acceptLabel: "Sí",
      rejectLabel: "No",
      accept: () => {
        this.nuevoFicheroTransferencias();
      },
      reject: () => {
        this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
      }
    });
  }
  
  nuevoFicheroTransferencias() {
    this.progressSpinner = true;

    let abonosFichero = this.selectedDatos.filter(d => d.estado && d.estado.toString() == this.FAC_ABONO_ESTADO_PENDIENTE_BANCO).map(d => {
      return {
        idAbono: d.idAbono
      };
    });

    this.sigaServices.post("facturacionPyS_nuevoFicheroTransferenciasSjcs", abonosFichero).subscribe(
      n => {
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("facturacionPyS.facturas.fichTransferenciasSJCS.generando"));
        this.busqueda.emit();
      },
      err => {
        this.handleServerSideErrorMessage(err);
        this.progressSpinner = false;
      }
    );
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
      } else {
        this.selectedDatos = [];
        this.selectMultiple = false;
      }
  }


  // FUnciones de utilidad

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
