import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { FacturasIncluidasItem } from '../../../../../models/sjcs/FacturasIncluidasItem';
import { FicherosAdeudosItem } from '../../../../../models/sjcs/FicherosAdeudosItem';
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

  datosFicheros: FacturasIncluidasItem;


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
    private sigaServices: SigaServices
    ) { }

  async ngOnInit() {
    this.getCols();
    await this.rest();
    this.cargaInicial();
  }

  cargaInicial(){
    let idFichero;

    if (this.tipoFichero=='T') {
      idFichero = this.bodyInicial.idDisqueteAbono;
    }
    if (this.tipoFichero=='A') {
      idFichero = this.bodyInicial.idDisqueteCargos;
    } 
    if (this.tipoFichero=='D') {
      idFichero = this.bodyInicial.idDisqueteDevoluciones;
    }
    
    this.sigaServices.getParam("facturacionPyS_getFacturasIncluidas", `?idFichero=${idFichero}&tipoFichero=${this.tipoFichero}`).subscribe(
      n => {
        this.progressSpinner = false;

        
        this.datosFicheros = n.facturasIncluidasItem;
        let error = n.error;
    
        //comprobamos el mensaje de info de resultados
        if (error!=undefined && error!=null) {
        this.showMessage("info",this.translateService.instant("general.message.informacion"), this.translateService.instant(error.message));
        }
  
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        console.log(err);
      },
    );
    
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
    this.datosFicheros =  JSON.parse(JSON.stringify(this.bodyInicial));

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
    return this.fichaPosible.activa;
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
