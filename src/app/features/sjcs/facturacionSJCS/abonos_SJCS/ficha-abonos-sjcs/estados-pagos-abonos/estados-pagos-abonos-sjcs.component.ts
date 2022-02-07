import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable, Message } from 'primeng/primeng';
import { from } from 'rxjs/observable/from';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { TranslateService } from '../../../../../../commons/translate';
import { ComboItem } from '../../../../../../models/ComboItem';
import { FacturaEstadosPagosItem } from '../../../../../../models/FacturaEstadosPagosItem';
import { FacturasItem } from '../../../../../../models/FacturasItem';
import { FicherosAdeudosItem } from '../../../../../../models/sjcs/FicherosAdeudosItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-estados-pagos-abonos-sjcs',
  templateUrl: './estados-pagos-abonos-sjcs.component.html',
  styleUrls: ['./estados-pagos-abonos-sjcs.component.scss']
})
export class EstadosPagosAbonosSJCSComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

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

  datos: FacturaEstadosPagosItem[] = [];
  datosInit: FacturaEstadosPagosItem[] = [];

  nuevoEstado: FacturaEstadosPagosItem;
  comboEstados: ComboItem[] = [];
  comboNotas: ComboItem[] = [];

  resaltadoDatos: boolean = false;
  resaltadoFecha: boolean = true;
  resaltadoEstado: boolean = false;
  resaltadoComentario: boolean = true;
  resaltadoBanco: boolean = false;
  showModalNuevoEstado: boolean = false;

  openFicha: boolean = true;
  constructor(
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial != undefined && changes.bodyInicial.currentValue != undefined) {
      this.getCols();
      this.getComboMotivosDevolucion();
      this.getEstadosPagos();
    }
  }

  // Combo de motivos de devolución
  getComboMotivosDevolucion() {
    this.sigaServices.get("facturacionPyS_comboMotivosDevolucion").subscribe(
      n => {
        this.comboNotas = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboNotas);
      },
      err => {
        console.log(err);
      }
    );
  }

  // Definición de las columnas
  getCols() {
    this.cols = [
      { field: "fecha", header: "facturacionSJCS.facturacionesYPagos.fecha", width: "10%" },
      { field: "accion", header: "facturacion.facturas.estadosPagos.accion", width: "20%" },
      { field: "comentario", header: "facturacion.facturas.estadosPagos.nota", width: "20%" },
      { field: "estado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado", width: "20%" },
      { field: "cuentaBancaria", header: "facturacion.seriesFactura.cuentaBancaria", width: "10%" },
      { field: "movimiento", header: "facturacion.facturas.estadosPagos.movimiento", width: "10%" },
      { field: "importePendiente", header: "facturacionSJCS.facturacionesYPagos.importePendiente", width: "10%" }
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
    this.progressSpinner = true;
    this.sigaServices.getParam("facturacionPyS_getEstadosAbonosSJCS", "?idAbono=" + this.bodyInicial.idAbono).subscribe(
      n => {
        this.datos = n.estadosAbonosItems;
        this.datosInit = JSON.parse(JSON.stringify(this.datos));
        this.progressSpinner = false;

        console.log(this.datos);
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  // Función para comprobar si la línea tiene fichero de transferencias
  tieneFichero(dato: FacturaEstadosPagosItem): boolean {
    let pagado = this.translateService.instant("general.literal.pagado");
    let pagadoBanco = this.translateService.instant("facturacion.abonosPagos.datosPagoAbono.abonoBanco");

    console.log(pagado, pagadoBanco)

    return dato.accion == pagadoBanco && dato.estado == pagado;
  }

  // Acciones

  compensar(): void {
    let ultimaAccion: FacturaEstadosPagosItem = this.datos[this.datos.length - 1];

    if (![""].includes(this.bodyInicial.estado)) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), "");

    }
  }

  renegociar(): void {
    

  }

  enabledComboCuentasBancarias(): boolean {
    if (this.nuevoEstado.idEstado != "5") {
      this.nuevoEstado.cuentaBanco = undefined;
      this.resaltadoBanco = false;
      return false;
    }

    this.resaltadoBanco = true;
    return true;
  }

  
  
  nuevoAbono() {
    let ultimaAccion: FacturaEstadosPagosItem = this.datos[this.datos.length - 1];

    if (this.bodyInicial.tipo != "ABONO" || !["6"].includes(this.bodyInicial.estado)) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacion.facturas.estadosPagos.abonoPorCaja.error"));
    } else {
      this.nuevoEstado = new FacturaEstadosPagosItem();

      // IdFactura
      this.nuevoEstado.idFactura = this.bodyInicial.idFactura;

      let fechaActual: Date = new Date();
      this.nuevoEstado.fechaMin = fechaActual > new Date(ultimaAccion.fechaModificaion) ? fechaActual : new Date(ultimaAccion.fechaModificaion);
      this.nuevoEstado.fechaModificaion = new Date();
      this.nuevoEstado.notaMaxLength = 256;

      // Acción
      this.nuevoEstado.idAccion = "4";
      this.nuevoEstado.accion = this.translateService.instant("facturacion.facturas.estadosPagos.abonoPorCaja");

      // El importe pendiente se recalcula
      this.nuevoEstado.impTotalPagado = "0";
      this.nuevoEstado.impTotalPorPagar = ultimaAccion.impTotalPorPagar;

      this.showModalNuevoEstado = true;
    }

  }

  onChangeImporte(event: number): void {
    let ultimaAccion: FacturaEstadosPagosItem = this.datos[this.datos.length - 1];

    if (this.nuevoEstado.idAccion == "4") {
      this.nuevoEstado.impTotalPorPagar = (+ultimaAccion.impTotalPorPagar - +this.nuevoEstado.impTotalPorPagar).toString();

      if (parseFloat(this.nuevoEstado.impTotalPagado) < 0) {
        this.nuevoEstado.impTotalPagado = "0";
      } else if (parseFloat(this.nuevoEstado.impTotalPagado) > parseFloat(ultimaAccion.impTotalPorPagar)) {
        this.nuevoEstado.impTotalPagado = ultimaAccion.impTotalPorPagar;
      }
    }

  }


  anular() {
    let ultimaAccion: FacturaEstadosPagosItem = this.datos[this.datos.length - 1];

    if (this.bodyInicial.tipo != "FACTURA" || ["7", "8"].includes(ultimaAccion.idEstado)) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacion.facturas.estadosPagos.anulacion.error"));
    } else {
      this.nuevoEstado = new FacturaEstadosPagosItem();

      // IdFactura
      this.nuevoEstado.idFactura = this.bodyInicial.idFactura;

      let fechaActual: Date = new Date();
      this.nuevoEstado.fechaMin = fechaActual > new Date(ultimaAccion.fechaModificaion) ? fechaActual : new Date(ultimaAccion.fechaModificaion);
      this.nuevoEstado.fechaModificaion = new Date();
      this.nuevoEstado.notaMaxLength = 255;

      // Acción
      this.nuevoEstado.idAccion = "8";
      this.nuevoEstado.accion = this.translateService.instant("facturacion.facturas.estadosPagos.anulacion");

      this.nuevoEstado.impTotalPagado = ultimaAccion.impTotalPorPagar;
      this.nuevoEstado.impTotalPorPagar = "0";

      this.showModalNuevoEstado = true;
    }
  }

  // Eliminar
  eliminar() {

  }

  // Restablecer

  restablecer() {
    this.datos = JSON.parse(JSON.stringify(this.datosInit));

    this.nuevoEstado = undefined;

    this.resaltadoDatos = false;
    this.resaltadoDatos = false;
    this.resaltadoEstado = false;
    this.resaltadoBanco = false;
  }

  // Modal para guardar el nuevo estado

  isValid(): boolean {
    let valid: boolean = true;

    if (this.nuevoEstado.idAccion == "7") {
      valid = this.nuevoEstado.fechaModificaion != undefined && this.nuevoEstado.impTotalPagado != undefined && this.nuevoEstado.impTotalPagado.trim().length != 0 && this.nuevoEstado.impTotalPorPagar && this.nuevoEstado.impTotalPorPagar.trim().length != 0
        && this.nuevoEstado.idEstado != undefined && this.nuevoEstado.idEstado.trim().length != 0 && (this.nuevoEstado.idEstado != "5" || this.nuevoEstado.idEstado == "5" && this.nuevoEstado.cuentaBanco != undefined && this.nuevoEstado.cuentaBanco.trim().length != 0);
    } else {
      valid = this.nuevoEstado && this.nuevoEstado.fechaModificaion != undefined && this.nuevoEstado.impTotalPagado != undefined && this.nuevoEstado.impTotalPagado.trim().length != 0 && this.nuevoEstado.impTotalPorPagar && this.nuevoEstado.impTotalPorPagar.trim().length != 0;
    }

    valid = valid && this.nuevoEstado.comentario != undefined && this.nuevoEstado.comentario.trim().length != 0;
    
    if (!valid) {
      this.showMessage("error", "Error", this.translateService.instant('general.message.camposObligatorios'));
    }
    
    return valid;
  }

  guardar() {

  }

  cerrarDialog(operacionCancelada: boolean) {
    this.showModalNuevoEstado = false;
    this.resaltadoDatos = false;
    this.resaltadoEstado = false;
    this.resaltadoBanco = false;
    this.nuevoEstado = undefined;

    this.changeDetectorRef.detectChanges();

    if (operacionCancelada) {
      this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
    }
  }

  // Enlace a la factura
  navigateToFactura(row: FacturaEstadosPagosItem) {
    let factura: FacturasItem = new FacturasItem();
    factura.idFactura = row.idFactura;
    factura.tipo = "FACTURA";

    sessionStorage.setItem("abonosSJCSItem", JSON.stringify(factura));
    sessionStorage.setItem("volverAbonoSJCS", "true");
    this.router.navigate(["/gestionFacturas"]);
  }

  // Enlace al abono
  navigateToAbono(row: FacturaEstadosPagosItem) {
    let factura: FacturasItem = new FacturasItem();
    factura.idAbono = row.idAbono;
    factura.tipo = "ABONO";

    sessionStorage.setItem("abonosSJCSItem", JSON.stringify(factura));
    sessionStorage.setItem("volverAbonoSJCS", "true");
    this.router.navigate(["/gestionFacturas"]);
  }

  navigateToSJCS(){}

  // Enlace al fichero de transferencias
  navigateToFicheroTransferencias(row: FacturaEstadosPagosItem) {
    this.progressSpinner = true;
    let filtros = { idDisqueteAbonos: row.identificador };

    this.sigaServices.post("facturacionPyS_getFicherosTransferencias", filtros).toPromise().then(
      n => {
        let results: FicherosAdeudosItem[] = JSON.parse(n.body).ficherosTransferenciasItems;
        if (results != undefined && results.length != 0) {
          let ficherosAdeudosItem: FicherosAdeudosItem = results[0];

          sessionStorage.setItem("abonosSJCSItem", JSON.stringify(this.bodyInicial));
          sessionStorage.setItem("volverAbonoSJCS", "true");

          sessionStorage.setItem("FicherosTransferenciasItem", JSON.stringify(ficherosAdeudosItem));
        }
      },
      err => {
        console.log(err);
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    ).then(() => this.progressSpinner = false).then(() => {
      if (sessionStorage.getItem("FicherosTransferenciasItem")) {
        this.router.navigate(["/gestionTransferencias"]);
      } 
    });
  }

  // Fecha
  fillFecha(event: Date) {
    this.nuevoEstado.fechaModificaion = event;
  }

  // Estilos obligatorios
  styleObligatorio(obligatorio: boolean, evento: string) {
    if (this.resaltadoDatos && obligatorio && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  styleFechaObligatorio(obligatorio: boolean, evento: Date) {
    if (this.resaltadoDatos && obligatorio && (evento == undefined || evento == null)) {
      return this.commonsService.styleObligatorio(evento);
    }
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
  abreCierraFicha() {
    this.openFicha = !this.openFicha;
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
