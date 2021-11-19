import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
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

  @Input() bodyInicial: FicherosAdeudosItem;
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

  datosFicheros: FicherosAdeudosItem;

  

  msgs;
  cols;

  rowsPerPage = [];
  buscadores = [];
  selectedItem: number = 10;

  fichaPosible = {
    key: "facturas",
    activa: false
  }
  
  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  async ngOnInit() {
    await this.rest();

    this.getCols();

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
      { field: "numFacturas", header: 'menu.facturacion.facturas', width: "10%" },
      { field: "total", header: 'facturacionSJCS.facturacionesYPagos.buscarFacturacion.total', width: "20%" },
      { field: "totalPendiente", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.pendiente", width: "20%" },
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
