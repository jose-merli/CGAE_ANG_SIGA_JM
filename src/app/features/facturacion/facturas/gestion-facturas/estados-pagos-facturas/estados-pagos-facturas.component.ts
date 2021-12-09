import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable, Message } from 'primeng/primeng';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import { groupBy, map, mergeMap, reduce, toArray, zip } from 'rxjs/operators';
import { TranslateService } from '../../../../../commons/translate';
import { ComboItem } from '../../../../../models/ComboItem';
import { FacturaEstadosPagosItem } from '../../../../../models/FacturaEstadosPagosItem';
import { FacturasItem } from '../../../../../models/FacturasItem';
import { FicherosAdeudosItem } from '../../../../../models/sjcs/FicherosAdeudosItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-estados-pagos-facturas',
  templateUrl: './estados-pagos-facturas.component.html',
  styleUrls: ['./estados-pagos-facturas.component.scss']
})
export class EstadosPagosFacturasComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  @Input() openTarjetaEstadosPagos;
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

  grupos: any[];
  datos: FacturaEstadosPagosItem[] = [];
  datosInit: FacturaEstadosPagosItem[] = [];

  nuevoEstado: FacturaEstadosPagosItem;
  comoEstados: ComboItem[] = [];
  comboCuentasBancarias: ComboItem[] = [];

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial != undefined) {
      this.getCols();
      this.getEstadosPagos();
    }
  }

  // Definición de las columnas
  getCols() {
    this.cols = [
      { field: "fechaModificaion", header: "Fecha", width: "10%" },
      { field: "accion", header: "Acción Realizada", width: "20%" },
      { field: "nota", header: "Nota de Acción", width: "20%" },
      { field: "estado", header: "Estado", width: "20%" },
      { field: "iban", header: "Cuenta Bancaria", width: "10%" },
      { field: "impTotalPagado", header: "Movimiento", width: "10%" },
      { field: "impTotalPorPagar", header: "Importe Pendiente", width: "10%" }
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

  getEstadosPagos() {
    this.sigaServices.getParam("facturacionPyS_getEstadosPagos", "?idFactura=" + this.bodyInicial.idFactura).subscribe(
      n => {
        console.log(n);
        this.datos = n.estadosPagosItems;

        from(this.datos).pipe(
          groupBy(ep => ep.numeroFactura),
          mergeMap(group => group.reduce((acc, cur) => {
              acc.values.push(cur);
              return acc;
            }, { key: group.key, values: [], activo: true })
          ),
          toArray()
        ).subscribe(grupos => this.grupos = grupos);

        this.datosInit = JSON.parse(JSON.stringify(this.datos));
      },
      err => {
        console.log(err);
      }
    );
  }

  // Acciones

  renegociar() {
    let ultimaAccion: FacturaEstadosPagosItem = this.datos[this.datos.length - 1];

    this.nuevoEstado = new FacturaEstadosPagosItem();
    this.nuevoEstado.fechaModificaion = new Date();
    this.nuevoEstado.accion = "RENEGOCIACIÓN";

    // Si se selecciona  por pago por banco

    this.nuevoEstado.impTotalPagado = "0";
    this.nuevoEstado.impTotalPorPagar = ultimaAccion.impTotalPorPagar;
  }

  nuevoCobro() {
    let ultimaAccion: FacturaEstadosPagosItem = this.datos[this.datos.length - 1];

    this.nuevoEstado = new FacturaEstadosPagosItem();
    this.nuevoEstado.fechaModificaion = new Date();
    this.nuevoEstado.accion = "COBRO POR CAJA";

    // Si se selecciona  por pago por banco
    
    this.nuevoEstado.impTotalPagado = "0";
    
    // El importe pendiente se recalcula
    //this.nuevoEstado.impTotalPorPagar = +ultimaAccion.impTotalPorPagar - +this.nuevo;
  }

  nuevoAbono() {
    let ultimaAccion: FacturaEstadosPagosItem = this.datos[this.datos.length - 1];

    this.nuevoEstado = new FacturaEstadosPagosItem();
    this.nuevoEstado.fechaModificaion = new Date();
    this.nuevoEstado.accion = "ABONO POR CAJA";
    this.nuevoEstado.impTotalPagado = ultimaAccion.impTotalPorPagar;
    this.nuevoEstado.impTotalPorPagar = "0";
  }

  devolver() {
    let ultimaAccion: FacturaEstadosPagosItem = this.datos[this.datos.length - 1];

    this.nuevoEstado = new FacturaEstadosPagosItem();
    this.nuevoEstado.fechaModificaion = new Date();
    this.nuevoEstado.accion = "DEVOLUCIÓN";
    this.nuevoEstado.impTotalPagado = "0";
    this.nuevoEstado.impTotalPorPagar = ultimaAccion.impTotalPagado;
  }

  devolverConComision() {

  }

  anular() {
    let ultimaAccion: FacturaEstadosPagosItem = this.datos[this.datos.length - 1];

    this.nuevoEstado = new FacturaEstadosPagosItem();
    this.nuevoEstado.fechaModificaion = new Date();
    this.nuevoEstado.accion = "ANULACIÓN";
    this.nuevoEstado.impTotalPagado = ultimaAccion.impTotalPorPagar;
    this.nuevoEstado.impTotalPorPagar = "0";
  }

  // Restablecer

  restablecer() {
    this.datos = JSON.parse(JSON.stringify(this.datosInit));
    from(this.datos).pipe(
      groupBy(ep => ep.numeroFactura),
      mergeMap(group => group.reduce((acc, cur) => {
          acc.values.push(cur);
          return acc;
        }, { key: group.key, values: [], activo: true })
      ),
      toArray()
    ).subscribe(grupos => this.grupos = grupos);

    this.nuevoEstado = undefined;
  }

  // Enlace a la factura
  navigateToFactura(row: FacturaEstadosPagosItem) {
    let factura: FacturasItem = new FacturasItem();
    factura.idFactura = row.idFactura;
    factura.tipo = "FACTURA";
    this.guardadoSend.emit(factura);
  }

  // Enlace al abono
  navigateToAbono(row: FacturaEstadosPagosItem) {
    let factura: FacturasItem = new FacturasItem();
    factura.idFactura = row.idFactura;
    factura.tipo = "ABONO";
    this.guardadoSend.emit(factura);
  }

  // Enlace al fichero de adeudos
  navigateToFicheroAdeudos(row: FacturaEstadosPagosItem) {
    this.progressSpinner = true;
    let filtros = { idDisqueteCargos: row.idCargos };

    this.sigaServices.post("facturacionPyS_getFacturacionesProgramadas", filtros).toPromise().then(
      n => {
        let results: FicherosAdeudosItem[] = JSON.parse(n.body).ficherosAdeudosItems;
        if (results != undefined && results.length != 0) {
          let ficherosAdeudosItem: FicherosAdeudosItem = results[0];

          sessionStorage.setItem("facturaItem", JSON.stringify(this.bodyInicial));
          sessionStorage.setItem("volver", "true");

          sessionStorage.setItem("FicherosAdeudosItem", JSON.stringify(ficherosAdeudosItem));
        }
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    ).then(() => this.progressSpinner = false).then(() => {
      if (sessionStorage.getItem("FicherosAdeudosItem")) {
        this.router.navigate(["/gestionAdeudos"]);
      } 
    });
  }

  // Abrir y cerrar un grupo de estados
  toggleGrupo(index: number) {
    this.grupos[index].activo = !this.grupos[index].activo;
  }

  fillFecha(event: Date) {
    this.nuevoEstado.fechaModificaion = event;
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
    return this.openTarjetaEstadosPagos;
  }

  abreCierraFicha(key): void {
    this.openTarjetaEstadosPagos = !this.openTarjetaEstadosPagos;
    this.opened.emit(this.openTarjetaEstadosPagos);
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
