import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { saveAs } from "file-saver/FileSaver";

@Component({
  selector: 'app-tabla-ficheros-transferencias',
  templateUrl: './tabla-ficheros-transferencias.component.html',
  styleUrls: ['./tabla-ficheros-transferencias.component.scss']
})
export class TablaFicherosTransferenciasComponent implements OnInit {
  cols;
  msgs;

  selectedDatos = [];
  rowsPerPage = [];
  buscadores = [];

  selectedItem: number = 10;
  numSelected = 0;

  selectMultiple: boolean = false;
  selectAll: boolean = false;
  historico: boolean = false;
  permisoEscritura: boolean = true;
  progressSpinner: boolean = false;

  @Input() datos;
  @Input() filtro;

  @ViewChild("table") table: DataTable;

  constructor(
    private changeDetectorRef: ChangeDetectorRef, 
    private router: Router, 
    private persistenceService: PersistenceService,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {
    this.selectedDatos = [];
    this.selectAll = false;

    this.getCols();
  }

  navigateTo(dato){
    sessionStorage.setItem("FicherosAbonosItem", JSON.stringify(dato));
    this.persistenceService.setFiltros(this.filtro);

    this.router.navigate(['/gestionFicherosTransferencias']);
  }
  
  // Descargar LOG
  descargarLog(){
    let resHead ={ 'response' : null, 'header': null };

    if (this.selectedDatos && this.selectedDatos.length > 0) {
      this.progressSpinner = true;
      let descarga =  this.sigaServices.getDownloadFiles("facturacionPyS_descargarFicheroTransferencias", this.selectedDatos);
      descarga.subscribe(response => {
        this.progressSpinner = false;

        const file = new Blob([response.body], {type: response.headers.get("Content-Type")});
        let filename: string = response.headers.get("Content-Disposition");
        filename = filename.split(';')[1].split('filename')[1].split('=')[1].trim();

        saveAs(file, filename);
        this.showMessage('success', 'LOG descargado correctamente',  'LOG descargado correctamente' );
      },
      err => {
        this.progressSpinner = false;
        this.showMessage('error','El LOG no pudo descargarse',  'El LOG no pudo descargarse' );
      });
    } else {
      this.showMessage('error','El LOG no pudo descargarse',  'El LOG no pudo descargarse' );
    }
  }
  
  getCols() {
    this.cols = [
      { field: "idDisqueteAbono", header: "administracion.grupos.literal.id", width: "5%" },
      { field: "fechaCreacion", header: "informesycomunicaciones.comunicaciones.busqueda.fechaCreacion", width: "10%" },
      { field: "cuentaEntidad", header: "facturacion.seriesFactura.cuentaBancaria", width: "15%" },
      { field: "sufijo", header: "administracion.parametrosGenerales.literal.sufijo", width: "10%" },
      { field: "numRecibos", header: 'facturacionPyS.ficherosAdeudos.numRecibos', width: "10%" },
      { field: "importeTotal", header: "facturacionSJCS.facturacionesYPagos.importeTotal", width: "10%" },
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

  clear() {
    this.msgs = [];
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
}