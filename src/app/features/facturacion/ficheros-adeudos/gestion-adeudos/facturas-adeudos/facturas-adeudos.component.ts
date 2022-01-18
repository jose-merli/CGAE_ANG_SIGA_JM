import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { FacturasIncluidasItem } from '../../../../../models/sjcs/FacturasIncluidasItem';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-facturas-adeudos',
  templateUrl: './facturas-adeudos.component.html',
  styleUrls: ['./facturas-adeudos.component.scss']
})
export class FacturasAdeudosComponent implements OnInit {

  @Input() bodyInicial: any;
  @Input() tipoFichero: string;
  @Input() modoEdicion;
  @Input() openTarjetaFacturas;
  @Input() permisoEscritura;
  @Input() tarjetaFacturas: string;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();

  @ViewChild("table") table: DataTable;

  openFicha: boolean = true;
  progressSpinner: boolean = false;
  activacionTarjeta: boolean = true;

  datosFicheros: FacturasIncluidasItem[];
  totalFacturas: string;
  totalImporte: string;
  totalPendiente: string;

  idFichero;
  msgs;
  cols;

  rowsPerPage = [];
  buscadores = [];
  selectedItem: number = 10;

  fichaPosible = {
    key: "facturas",
    activa: false
  }
  
  constructor(
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private router: Router
    ) { }

  async ngOnInit() {
    this.getCols();
    this.setIdFichero();
    await this.rest();
    this.cargaInicial();
  }

  // set idFichero para llamada al servicio en cargaInicial() 
  setIdFichero() {
    if (this.tipoFichero=='T') {
      this.idFichero = this.bodyInicial.idDisqueteAbono;
      //sessionStorage.setItem("identificadorTransferencia", this.idFichero);
    }
    if (this.tipoFichero=='A') {
      this.idFichero = this.bodyInicial.idDisqueteCargos;
      //sessionStorage.setItem("identificadorAdeudos", this.idFichero);
    } 
    if (this.tipoFichero=='D') {
      this.idFichero = this.bodyInicial.idDisqueteDevoluciones;
      //sessionStorage.setItem("identificadorDevolucion", this.idFichero);
    }
  }

  cargaInicial(){   
    this.progressSpinner=true;
    
    this.sigaServices.getParam("facturacionPyS_getFacturasIncluidas", `?idFichero=${this.idFichero}&tipoFichero=${this.tipoFichero}`).subscribe(
      n => {
        this.progressSpinner = false;
        
        this.datosFicheros = n.facturasIncluidasItem;
        this.totalFacturas = this.datosFicheros.map(d => d.numeroFacturas ? parseInt(d.numeroFacturas): 0).reduce((d1, d2) => d1 + d2, 0).toFixed(0);
        this.totalImporte = this.datosFicheros.map(d => d.importeTotal ? parseFloat(d.importeTotal) : 0).reduce((d1, d2) => d1 + d2, 0).toFixed(2);
        this.totalPendiente = this.datosFicheros.map(d => d.pendienteTotal ? parseFloat(d.pendienteTotal) : 0).reduce((d1, d2) => d1 + d2, 0).toFixed(2);
  
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        console.log(err);
      },
    );
    
  }

  ir(){

    //this.progressSpinner=true;
    sessionStorage.setItem("tipoFichero", this.tipoFichero);
    sessionStorage.setItem("idFichero", this.idFichero);

    this.router.navigate(["/facturas"]);
  
  }
  
  
  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaFacturas == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
  }

  rest(){
    // this.datosFicheros =  JSON.parse(JSON.stringify(this.bodyInicial));

    // this.arreglaFechas();
  }

  getCols() {
    this.cols = [
      { field: "estado", header: "censo.fichaIntegrantes.literal.estado", width: "20%" },
      { field: "formaPago", header: "facturacion.productos.formapago", width: "20%" },
      { field: "numeroFacturas", header: 'menu.facturacion.facturas', width: "10%" },
      { field: "importeTotal", header: 'facturacionSJCS.facturacionesYPagos.buscarFacturacion.total', width: "20%" },
      { field: "pendienteTotal", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.pendiente", width: "20%" },
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

  esFichaActiva(key) {
    return this.openFicha;
  }

  abreCierraFicha(key) {
    if (key == "facturas" && !this.activacionTarjeta) {
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
}
