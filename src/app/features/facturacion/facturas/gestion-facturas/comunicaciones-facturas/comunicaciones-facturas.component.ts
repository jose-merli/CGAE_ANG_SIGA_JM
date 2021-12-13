import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataTable, Message } from 'primeng/primeng';
import { FacturasItem } from '../../../../../models/FacturasItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-comunicaciones-facturas',
  templateUrl: './comunicaciones-facturas.component.html',
  styleUrls: ['./comunicaciones-facturas.component.scss']
})
export class ComunicacionesFacturasComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  @Input() openTarjetaComunicaciones;
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
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {
    this.getCols();
    this.getComunicacionesCobro();
  }

  // Definición de las columnas
  getCols() {
    this.cols = [
      { field: "orden", header: "administracion.informes.literal.orden", width: "10%" },
      { field: "fechaEnvio", header: "facturacionSJCS.facturacionesYPagos.fecha", width: "10%" },
      { field: "documento", header: "justiciaGratuita.ejg.documentacion.Documento", width: "80%" }
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

  // Obtención de los datos

  getComunicacionesCobro() {
    this.sigaServices.getParam("facturacionPyS_getComunicacionCobro", "?idFactura=" + this.bodyInicial.idFactura).subscribe(
      n => {
        console.log(n);
        this.datos = n.comunicacionCobroItems;
      },
      err => {
        console.log(err);
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

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaComunicaciones;
  }

  abreCierraFicha(key): void {
    this.openTarjetaComunicaciones = !this.openTarjetaComunicaciones;
    this.opened.emit(this.openTarjetaComunicaciones);
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
