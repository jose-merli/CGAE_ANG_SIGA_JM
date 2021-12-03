import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DataTable, Message } from 'primeng/primeng';
import { ComboItem } from '../../../../../models/ComboItem';
import { FacturaLineaItem } from '../../../../../models/FacturaLineaItem';
import { FacturasItem } from '../../../../../models/FacturasItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-lineas-facturas',
  templateUrl: './lineas-facturas.component.html',
  styleUrls: ['./lineas-facturas.component.scss']
})
export class LineasFacturasComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  @Input() openTarjetaLineas;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<FacturasItem>();

  @Input() bodyInicial: FacturasItem;

  // Elementos para la tabla
  @ViewChild("table") table: DataTable;
  rowsPerPage = [];
  selectedItem: number = 10;
  selectedDatos = [];
  cols = [];
  buscadores = [];
  selectAll: boolean;
  selectMultiple: boolean;
  datos: FacturaLineaItem[] = [];
  datosInit: FacturaLineaItem[] = [];

  comboTiposIVA: ComboItem[];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial != undefined) {
      this.getCols(this.bodyInicial.tipo);

      if (this.bodyInicial.tipo == "FACTURA") {
        this.getLineasFactura();
      } else {
        this.getLineasAbono();
      }
    }
      
  }

  // Definición de las columnas
  getCols(tipo: string) {
    if (tipo == "FACTURA") {
      this.getColsFactura();
    } else {
      this.getColsAbono();
    }

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

  getColsFactura() {
    this.cols = [
      { field: "descripcion", header: "general.description", width: "30%", editable: true },
      { field: "precioUnitario", header: "Precio Unitario", width: "10%", editable: true },
      { field: "cantidad", header: "Cantidad", width: "10%", editable: false },
      { field: "importeNeto", header: "Importe Neto", width: "10%", editable: false }, 
      { field: "tipoIVA", header: "Tipo IVA", width: "10%", editable: true },
      { field: "importeIVA", header: "Importe IVA", width: "10%", editable: false },
      { field: "importeTotal", header: "Importe Total", width: "10%", editable: false },
      { field: "importeAnticipado", header: "Importe Anticip.", width: "10%", editable: false },
    ];
  }

  getColsAbono() {
    this.cols = [
      { field: "descripcion", header: "general.description", width: "30%" },
      { field: "precioUnitario", header: "Precio Unitario", width: "10%" },
      { field: "cantidad", header: "Cantidad", width: "10%" },
      { field: "importeNeto", header: "Importe Neto", width: "10%" }, 
      { field: "tipoIVA", header: "Tipo IVA", width: "10%" },
      { field: "importeIVA", header: "Importe IVA", width: "10%" },
      { field: "importeTotal", header: "Importe Total", width: "10%" },
      { field: "importeAnticipado", header: "Importe Anticip.", width: "10%" },
    ];
  }

  // Obtención de los datos

  getLineasFactura() {
    this.sigaServices.getParam("facturacionPyS_getLineasFactura", "?idFactura=" + this.bodyInicial.idFactura).subscribe(
      n => {
        console.log(n);
        this.datos = n.facturasLineasItems;
        this.datos.forEach(d => d.modoEdicion = false);

        this.datosInit = JSON.parse(JSON.stringify(this.datos));
      },
      err => {
        console.log(err);
      }
    );
  }

  getLineasAbono() {
    this.sigaServices.getParam("facturacionPyS_getLineasAbono", "?idAbono=" + this.bodyInicial.idFactura).subscribe(
      n => {
        console.log(n);
        this.datos = n.facturasLineasItems;
        this.datos.forEach(d => d.modoEdicion = false);

        this.datosInit = JSON.parse(JSON.stringify(this.datos));
      },
      err => {
        console.log(err);
      }
    );
  }

  // Seleccionar fila

  onRowSelect(row: FacturaLineaItem) {
    for (let dato of this.datos) {
      if (dato === row) {
        dato.modoEdicion = true;
      } else {
        dato.modoEdicion = false;
      }
    }
  }

  // Calcular propiedades derivadas

  onChangeImportes(row: FacturaLineaItem, index: number) {
    if (row !== this.datos[index] 
      && row.precioUnitario != undefined && row.precioUnitario.trim() != ""
      && row.cantidad != undefined && row.cantidad.trim() != ""
      && row.idTipoIVA != undefined && row.idTipoIVA.trim() != "") {
      this.datos[index].importeNeto = (parseFloat(this.datos[index].precioUnitario) * parseFloat(this.datos[index].cantidad)).toString();
      this.datos[index].importeIVA = (parseFloat(this.datos[index].importeNeto) * 0.1).toString();
      this.datos[index].importeTotal = (parseFloat(this.datos[index].importeNeto) * parseFloat(this.datos[index].importeIVA)).toString();
    }
  }

  // Restablecer

  restablecer(): void {
    this.datos =  JSON.parse(JSON.stringify(this.datosInit));
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

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaLineas;
  }

  abreCierraFicha(key): void {
    this.openTarjetaLineas = !this.openTarjetaLineas;
    this.opened.emit(this.openTarjetaLineas);
    this.idOpened.emit(key);
  }

  // Mensajes en pantalla

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
