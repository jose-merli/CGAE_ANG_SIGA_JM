import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataTable, Message } from 'primeng/primeng';
import { FacturasItem } from '../../../../../models/FacturasItem';

@Component({
  selector: 'app-lineas-facturas',
  templateUrl: './lineas-facturas.component.html',
  styleUrls: ['./lineas-facturas.component.scss']
})
export class LineasFacturasComponent implements OnInit {

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
  datos: any[] = [];

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getCols();
  }

  // Definición de las columnas
  getCols() {
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
