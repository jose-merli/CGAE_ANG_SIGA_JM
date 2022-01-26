import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { DatosColegiadosItem } from '../../../../models/DatosColegiadosItem';
import { FacturasItem } from '../../../../models/FacturasItem';
import { FicherosAdeudosItem } from '../../../../models/sjcs/FicherosAdeudosItem';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-tabla-facturas',
  templateUrl: './tabla-facturas.component.html',
  styleUrls: ['./tabla-facturas.component.scss']
})
export class TablaFacturasComponent implements OnInit {
  cols;
  msgs;

  FAC_ABONO_ESTADO_PENDIENTE_BANCO: string = "5";

  selectedDatos: FacturasItem[] = [];
  rowsPerPage = [];
  buscadores = [];

  selectedItem: number = 10;
  numSelected = 0;

  selectMultiple: boolean = false;
  selectAll: boolean = false;
  historico: boolean = false;
  permisoEscritura: boolean = false;
  progressSpinner: boolean = false;

  @Input() datos: FacturasItem[];
  @Input() filtro;

  @Output() busqueda = new EventEmitter<boolean>();

  @ViewChild("table") table: DataTable;

  constructor(
    private changeDetectorRef: ChangeDetectorRef, 
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private router: Router, 
    private persistenceService: PersistenceService) { }

  ngOnInit() {
    this.selectedDatos = [];
    this.selectAll = false;

    this.getCols();
  }

  
   // Abrir ficha de serie facturación -> tabla series facturacion
  openTab(selectedRow) {
    let facturasItem: FacturasItem = selectedRow;
    sessionStorage.setItem("facturasItem", JSON.stringify(facturasItem));
    this.router.navigate(["/gestionFacturas"]);
  }

  navigateToCliente(selectedRow) {
    
    if (selectedRow.idCliente) {
      
      this.progressSpinner = true;

      sessionStorage.setItem("consulta", "true");
      let filtros = { idPersona: selectedRow.idCliente };

      this.sigaServices.postPaginado("busquedaColegiados_searchColegiadoFicha", "?numPagina=1", filtros).toPromise().then(
        n => {
          let results: DatosColegiadosItem[] = JSON.parse(n.body).colegiadoItem;
          
          if (results != undefined && results.length != 0) {
            let datosColegiado: DatosColegiadosItem = results[0];

            sessionStorage.setItem("facturaItem", JSON.stringify(selectedRow));
            sessionStorage.setItem("volver", "true");

            sessionStorage.setItem("personaBody", JSON.stringify(datosColegiado));
            sessionStorage.setItem("filtrosBusquedaColegiados", JSON.stringify(filtros));
            sessionStorage.setItem("solicitudAprobada", "true");
            sessionStorage.setItem("origin", "Cliente");
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
    }
    
  }
  

getCols() {
  this.cols = [
    { field: "numeroFactura", header: "facturacion.productos.nFactura", width: "9%" }, 
    { field: "fechaEmision", header: "facturacion.facturas.fechaEmision", width: "9%" }, 
    { field: "facturacion", header: "menu.facturacion", width: "15%" }, 
    { field: "numeroColegiado", header: "facturacion.facturas.numeroColegiadoIdentificador", width: "9%" }, 
    { field: "nombre", header: "facturacion.productos.Cliente", width: "15%" }, 
    { field: "importefacturado", header: "facturacion.facturas.importeTotal", width: "9%" }, 
    { field: "importeAdeudadoPendiente", header: "facturacion.facturas.importePendiente", width: "9%" }, 
    { field: "estado", header: "censo.nuevaSolicitud.estado", width: "9%" }, 
    { field: "comunicacionesFacturas", header: "facturacion.facturas.comunicacionCorto", width: "7%" }, 
    { field: "ultimaComunicacion", header: "facturacion.facturas.ultimaComunicacion", width: "9%" }, 
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

disableNuevoFicheroTransferencias() {
  return !this.selectedDatos || this.selectedDatos.filter(d => d.tipo != "FACTURA" && d.idEstado == this.FAC_ABONO_ESTADO_PENDIENTE_BANCO).length == 0;
}

nuevoFicheroAdeudos() {
  let ficheroAdeudos = new FicherosAdeudosItem();
  sessionStorage.setItem("FicherosAdeudosItem", JSON.stringify(ficheroAdeudos));
  sessionStorage.setItem("Nuevo", "true");
  
  this.router.navigate(["/gestionAdeudos"]);
}

nuevoFicheroTransferencias() {
  this.progressSpinner = true;
  let abonosFichero = this.selectedDatos.filter(d => d.tipo != "FACTURA" && d.idEstado == this.FAC_ABONO_ESTADO_PENDIENTE_BANCO);
  
  this.sigaServices.post("facturacionPyS_nuevoFicheroTransferencias", abonosFichero).subscribe(
    n => {
      this.progressSpinner = false;
      this.showMessage("success", this.translateService.instant("general.message.correct"), "Se han generado correctamente los ficheros de transferencias");
      this.busqueda.emit();
    },
    err => {
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
      
      this.progressSpinner = false;
    }
  );
}

selectFila(event) {
  this.numSelected = event.length;
}

unselectFila(event) {
  this.selectAll = false;
  this.numSelected = event.length;
}

onChangeRowsPerPages(event) {
  this.selectedItem = event.value;
  this.changeDetectorRef.detectChanges();
  this.table.reset();
}

onChangeSelectAll() {
  if (this.selectAll) {
    this.selectMultiple = false;
    this.selectedDatos = this.datos;
    this.numSelected = this.datos.length;
  } else {
    this.selectedDatos = [];
    this.numSelected = 0;
    this.selectMultiple = true;
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
