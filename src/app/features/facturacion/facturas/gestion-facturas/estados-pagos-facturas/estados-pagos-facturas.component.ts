import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable, Message } from 'primeng/primeng';
import { from } from 'rxjs/observable/from';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { TranslateService } from '../../../../../commons/translate';
import { ComboItem } from '../../../../../models/ComboItem';
import { FacturaEstadosPagosItem } from '../../../../../models/FacturaEstadosPagosItem';
import { FacturasItem } from '../../../../../models/FacturasItem';
import { FicherosAdeudosItem } from '../../../../../models/sjcs/FicherosAdeudosItem';
import { CommonsService } from '../../../../../_services/commons.service';
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

  grupos: { key: string, values: FacturaEstadosPagosItem[], activo: boolean }[];
  datos: FacturaEstadosPagosItem[] = [];
  datosInit: any[] = [];

  nuevoEstado: FacturaEstadosPagosItem;
  comboEstados: ComboItem[] = [];
  comboNotas: ComboItem[] = [];

  resaltadoDatos: boolean = false;
  resaltadoFecha: boolean = true;
  resaltadoEstado: boolean = false;
  resaltadoComentario: boolean = true;
  resaltadoBanco: boolean = false;

  numeroAbono: string;

  ESTADO_ABONO_PAGADO: string = "1";
  ESTADO_ABONO_BANCO: string = "5";
  ESTADO_ABONO_CAJA: string = "6";
  ESTADO_ABONO_REVISION: string = "7";

  ACCION_FACTURA_DEVOLUCION: string = "6";
  ACCION_FACTURA_ANULACION: string = "8";
  ACCION_FACTURA_NUEVO_CAJA: string = "4";

  ACCION_ABONO_COMPENSACION: string = "10";
  ACCION_ABONO_RENEGOCIACION: string = "7";
  ACCION_ABONO_NUEVO_CAJA: string = "4";

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
      this.restablecer();

      if (this.bodyInicial.idFactura)
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
      { field: "fechaModificaion", header: "facturacionSJCS.facturacionesYPagos.fecha", width: "10%" },
      { field: "accion", header: "facturacion.facturas.estadosPagos.accion", width: "20%" },
      { field: "comentario", header: "facturacion.facturas.estadosPagos.nota", width: "20%" },
      { field: "estado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado", width: "20%" },
      { field: "iban", header: "facturacion.seriesFactura.cuentaBancaria", width: "10%" },
      { field: "impTotalPagado", header: "facturacion.facturas.estadosPagos.movimiento", width: "10%" },
      { field: "impTotalPorPagar", header: "facturacionSJCS.facturacionesYPagos.importePendiente", width: "10%" }
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
    this.sigaServices.getParam("facturacionPyS_getEstadosPagos", "?idFactura=" + this.bodyInicial.idFactura).subscribe(
      n => {
        this.datos = n.estadosPagosItems;

        from(this.datos).pipe(
          groupBy(ep => ep.numeroFactura),
          mergeMap(group => group.reduce((acc, cur) => {
              acc.values.push(cur);
              return acc;
            }, { key: group.key, values: [], activo: this.bodyInicial.numeroFactura == group.key })
          ),
          toArray()
        ).subscribe(grupos => this.grupos = grupos);

        this.datosInit = JSON.parse(JSON.stringify(this.grupos));
        this.progressSpinner = false;

        console.log(this.datos)

        //Encontramos los datos del abono
        if (this.datos != undefined && this.datos.length > 0) {
          let idAbono = this.datos[this.datos.length - 1].idAbono;
          
          if (idAbono != undefined && idAbono.trim().length != 0) {
            this.numeroAbono = this.datos[this.datos.length - 1].numeroAbono;
            this.getEstadosAbonos(idAbono);
          }
            
        }
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  // Obtención de los datos del abono

  getEstadosAbonos(idAbono: string) {
    this.progressSpinner = true;
    this.sigaServices.getParam("facturacionPyS_getEstadosAbonos", "?idAbono=" + idAbono).subscribe(
      n => {
        this.grupos.push({ key: this.numeroAbono, values: n.estadosAbonosItems, activo: this.bodyInicial.numeroFactura == this.numeroAbono });
        this.progressSpinner = false;

        this.datosInit = JSON.parse(JSON.stringify(this.grupos));

        console.log(this.grupos)
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  getUltimoEstado(skip: number = 0) {
    let grupo = this.grupos[this.grupos.length - 1];
    return grupo.values[grupo.values.length - 1 - skip]
  }

  esUltimoEstadoFactura() {
    return this.grupos[this.grupos.length - 1].key != this.numeroAbono;
  }

  // Visibilidad de las acciones
  disabledRenegociar(): boolean {
    if (this.grupos == undefined || this.grupos.length == 0 || this.grupos[this.grupos.length - 1].values == undefined 
        || this.grupos[this.grupos.length - 1].values.length == 0)
      return true;
      
    let ultimaAccion: FacturaEstadosPagosItem = this.getUltimoEstado();
    return this.esUltimoEstadoFactura() && !["2", "4", "5"].includes(ultimaAccion.idEstado) 
        || !this.esUltimoEstadoFactura() && ultimaAccion.idEstado == "1";
  }

  disabledNuevoCobro(): boolean {
    if (this.grupos == undefined || this.grupos.length == 0 || this.grupos[this.grupos.length - 1].values == undefined 
      || this.grupos[this.grupos.length - 1].values.length == 0)
      return true;
      
    let ultimaAccion: FacturaEstadosPagosItem = this.getUltimoEstado();
    return !this.esUltimoEstadoFactura() || !["2"].includes(ultimaAccion.idEstado) 
    || ultimaAccion.impTotalPorPagar != undefined && parseFloat(ultimaAccion.impTotalPorPagar) == 0;
  }

  disabledNuevoAbono(): boolean {
    if (this.grupos == undefined || this.grupos.length == 0 || this.grupos[this.grupos.length - 1].values == undefined 
      || this.grupos[this.grupos.length - 1].values.length == 0)
      return true;

    let ultimaAccion: FacturaEstadosPagosItem = this.getUltimoEstado();
    return this.esUltimoEstadoFactura() || ![this.ESTADO_ABONO_REVISION, this.ESTADO_ABONO_CAJA].includes(ultimaAccion.idEstado) 
    || ultimaAccion.importePendiente != undefined && parseFloat(ultimaAccion.importePendiente) == 0;
  }

  disabledDevolver(): boolean {
    if (this.grupos == undefined || this.grupos.length == 0 || this.grupos[this.grupos.length - 1].values == undefined 
      || this.grupos[this.grupos.length - 1].values.length == 0)
      return true;

    let ultimaAccion: FacturaEstadosPagosItem = this.getUltimoEstado();
    return !this.esUltimoEstadoFactura() || !["5"].includes(ultimaAccion.idAccion);
  }

  disabledDevolverConComision(): boolean {
    return this.disabledDevolver();
  }

  disabledAnular(): boolean {
    if (this.grupos == undefined || this.grupos.length == 0 || this.grupos[this.grupos.length - 1].values == undefined 
      || this.grupos[this.grupos.length - 1].values.length == 0)
      return true;

    let ultimaAccion: FacturaEstadosPagosItem = this.getUltimoEstado();
    return !this.esUltimoEstadoFactura() || ["7", "8"].includes(ultimaAccion.idEstado);
  }

  disabledEliminar(): boolean {
    if (this.grupos == undefined || this.grupos.length == 0 || this.grupos[this.grupos.length - 1].values == undefined 
      || this.grupos[this.grupos.length - 1].values.length == 0)
      return true;

    let ultimaAccion: FacturaEstadosPagosItem = this.getUltimoEstado();
    return !["4"].includes(ultimaAccion.idAccion);
  }

  // Acciones

  renegociar(): void {
    let ultimaAccion: FacturaEstadosPagosItem = this.getUltimoEstado();

    if (this.disabledRenegociar()) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacion.facturas.estadosPagos.renegociacion.error"));
    } else {
      this.nuevoEstado = new FacturaEstadosPagosItem();
      this.resaltadoEstado = true;

      // IdFactura
      this.nuevoEstado.idFactura = ultimaAccion.idFactura;

      this.nuevoEstado.nuevo = true;
      let fechaActual: Date = new Date();
      this.nuevoEstado.fechaMin = new Date(ultimaAccion.fechaModificaion);
      this.nuevoEstado.fechaModificaion = new Date();
      this.nuevoEstado.notaMaxLength = 1024;

      // Acción
      this.nuevoEstado.idAccion = "7";
      this.nuevoEstado.accion = this.translateService.instant("facturacion.facturas.estadosPagos.renegociacion");

      // Combo de pago de pago o abono por caja y banco
      this.comboEstados = [
        { value: "caja", label: this.translateService.instant("facturacion.facturas.pendienteCobro"), local: undefined },
        { value: "otroBanco", label: this.translateService.instant("facturacion.facturas.pendienteBanco"), local: undefined }
      ];

      // Si se selecciona  por pago

      this.nuevoEstado.impTotalPagado = "0";
      this.nuevoEstado.impTotalPorPagar = ultimaAccion.impTotalPorPagar;

      this.grupos[this.grupos.length - 1].values.push(this.nuevoEstado);
    }

  }

  enabledComboCuentasBancarias(): boolean {
    if ("caja" == this.nuevoEstado.modo || this.ESTADO_ABONO_CAJA == this.nuevoEstado.idEstado 
        || this.nuevoEstado.modo == undefined && this.nuevoEstado.idEstado == undefined) {
      this.nuevoEstado.cuentaBanco = undefined;
      this.resaltadoBanco = false;
      return false;
    }

    this.resaltadoBanco = true;
    return true;
  }

  nuevoCobro() {
    let ultimaAccion: FacturaEstadosPagosItem = this.getUltimoEstado();

    console.log(this.datos)

    if (this.disabledNuevoCobro()) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacion.facturas.estadosPagos.cobroPorCaja.error"));
    } else {
      this.nuevoEstado = new FacturaEstadosPagosItem();

      // IdFactura
      this.nuevoEstado.idFactura = ultimaAccion.idFactura;

      this.nuevoEstado.nuevo = true;
      let fechaActual: Date = new Date();
      this.nuevoEstado.fechaMin = new Date(ultimaAccion.fechaModificaion);
      this.nuevoEstado.fechaModificaion = new Date();
      this.nuevoEstado.notaMaxLength = 256;

      // Acción
      this.nuevoEstado.idAccion = "4";
      this.nuevoEstado.accion = this.translateService.instant("facturacion.facturas.estadosPagos.cobroPorCaja");

      // El importe pendiente se recalcula
      this.nuevoEstado.impTotalPagado = "0";
      this.nuevoEstado.impTotalPorPagar = ultimaAccion.impTotalPorPagar;

      this.grupos[this.grupos.length - 1].values.push(this.nuevoEstado);
    }

  }

  nuevoAbono(): void {
    let ultimaAccion: FacturaEstadosPagosItem = this.getUltimoEstado();

    if (this.disabledNuevoAbono()) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacionSJCS.abonosSJCS.nuevoAbono.deshabilitado"));
    } else {
      this.nuevoEstado = new FacturaEstadosPagosItem();

      this.nuevoEstado.nuevo = true;
      this.nuevoEstado.fecha = new Date();
      this.nuevoEstado.idFactura = this.bodyInicial.idFactura;
      this.nuevoEstado.idAbono = this.bodyInicial.idAbono;
      this.nuevoEstado.notaMaxLength = 256;

      // Acción
      this.nuevoEstado.idAccion = this.ACCION_ABONO_NUEVO_CAJA;
      this.nuevoEstado.accion = this.translateService.instant("facturacion.abonosPagos.datosPagoAbono.abonoCaja");

      // El importe pendiente se recalcula
      this.nuevoEstado.movimiento = ultimaAccion.importePendiente;
      this.nuevoEstado.importePendiente = "0";

      this.grupos[this.grupos.length - 1].values.push(this.nuevoEstado);
    }
    
  }

  renegociarAbono(): void {
    let ultimaAccion: FacturaEstadosPagosItem = this.getUltimoEstado();

    if (this.disabledRenegociar()) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacionSJCS.abonosSJCS.renegociacion.deshabilitado"));
    } else {
      this.nuevoEstado = new FacturaEstadosPagosItem();

      this.nuevoEstado.nuevo = true;

      let fechaHoy = new Date();
      this.nuevoEstado.fecha = fechaHoy;
      this.nuevoEstado.fechaMin = fechaHoy;
      this.nuevoEstado.idAbono = this.bodyInicial.idAbono;
      this.resaltadoEstado = true;

      // Acción
      this.nuevoEstado.idAccion = this.ACCION_ABONO_RENEGOCIACION;
      this.nuevoEstado.accion = this.translateService.instant("facturacionSJCS.abonosSJCS.renegociacion.literal");

      this.comboEstados = [
        { value: "6", label: this.translateService.instant("facturacion.facturas.pendienteAbonoCaja"), local: undefined },
        { value: "5", label: this.translateService.instant("facturacion.facturas.pendienteAbonoBanco"), local: undefined },
      ];

      this.grupos[this.grupos.length - 1].values.push(this.nuevoEstado);
    }
  }

  onChangeImporte(event: number): void {
    let ultimaAccion: FacturaEstadosPagosItem = this.getUltimoEstado(1);

    if (!this.esUltimoEstadoFactura() && [this.ACCION_ABONO_NUEVO_CAJA].includes(this.nuevoEstado.idAccion)) {
      if (this.nuevoEstado.movimiento == undefined || this.nuevoEstado.movimiento.trim().length == 0 
          || parseFloat(this.nuevoEstado.movimiento) < 0) {
        this.nuevoEstado.movimiento = "0";
      } else if (parseFloat(this.nuevoEstado.movimiento) > parseFloat(ultimaAccion.importePendiente)) {
        this.nuevoEstado.movimiento = ultimaAccion.importePendiente;
      }

      this.nuevoEstado.movimiento = parseFloat(this.nuevoEstado.movimiento).toFixed(2);
      this.nuevoEstado.importePendiente = (+ultimaAccion.importePendiente - +this.nuevoEstado.movimiento).toFixed(2);
    }

    if (this.esUltimoEstadoFactura() && [this.ACCION_FACTURA_NUEVO_CAJA].includes(this.nuevoEstado.idAccion)) {
      if (this.nuevoEstado.impTotalPagado == undefined || this.nuevoEstado.impTotalPagado.trim().length == 0 
          || parseFloat(this.nuevoEstado.impTotalPagado) < 0) {
        this.nuevoEstado.impTotalPagado = "0";
      } else if (parseFloat(this.nuevoEstado.impTotalPagado) > parseFloat(ultimaAccion.impTotalPorPagar)) {
        this.nuevoEstado.impTotalPagado = ultimaAccion.impTotalPorPagar;
      }

      this.nuevoEstado.impTotalPagado = parseFloat(this.nuevoEstado.impTotalPagado).toFixed(2);
      this.nuevoEstado.impTotalPorPagar = (+ultimaAccion.impTotalPorPagar - +this.nuevoEstado.impTotalPagado).toFixed(2);
    }

  }

  disableAccionConImporte(): boolean {
    let ultimaAccion: FacturaEstadosPagosItem = this.getUltimoEstado();

    if (this.bodyInicial.tipo == "FACTURA") {
        return parseFloat(ultimaAccion.impTotalPorPagar) == 0;
    } else {
      return parseFloat(this.bodyInicial.importeAdeudadoPendienteAb) == 0;
    }
  }

  devolver() {
    let ultimaAccion: FacturaEstadosPagosItem = this.getUltimoEstado();

    if (this.disabledDevolver()) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacion.facturas.estadosPagos.devolucion.error"));
    } else {
      this.nuevoEstado = new FacturaEstadosPagosItem();

      // IdFactura
      this.nuevoEstado.idFactura = ultimaAccion.idFactura;

      this.nuevoEstado.nuevo = true;
      let fechaActual: Date = new Date();
      this.nuevoEstado.fechaMin = new Date(ultimaAccion.fechaModificaion);
      this.nuevoEstado.fechaModificaion = new Date();

      // Acción
      this.nuevoEstado.idAccion = "6";
      this.nuevoEstado.accion = this.translateService.instant("facturacion.facturas.estadosPagos.devolucion");

      // Cuenta a la que se le pasó el cargo
      this.nuevoEstado.cuentaBanco = ultimaAccion.cuentaBanco;

      this.nuevoEstado.impTotalPagado = "0";
      this.nuevoEstado.impTotalPorPagar = ultimaAccion.impTotalPagado;

      this.grupos[this.grupos.length - 1].values.push(this.nuevoEstado);
    }
    
  }

  devolverConComision() {
    let ultimaAccion: FacturaEstadosPagosItem = this.getUltimoEstado();

    if (this.disabledDevolverConComision()) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacion.facturas.estadosPagos.devolucion.error"));
    } else {
      this.nuevoEstado = new FacturaEstadosPagosItem();

      // IdFactura
      this.nuevoEstado.idFactura = ultimaAccion.idFactura;

      this.nuevoEstado.nuevo = true;
      let fechaActual: Date = new Date();
      this.nuevoEstado.fechaMin = new Date(ultimaAccion.fechaModificaion);
      this.nuevoEstado.fechaModificaion = new Date();

      // Acción
      this.nuevoEstado.idAccion = "6";
      this.nuevoEstado.accion = this.translateService.instant("facturacion.facturas.estadosPagos.devolucion");

      // Devolver con comisión al cliente
      this.nuevoEstado.comision = true;

      // Cuenta a la que se le pasó el cargo
      this.nuevoEstado.cuentaBanco = ultimaAccion.cuentaBanco;

      this.nuevoEstado.impTotalPagado = "0";
      this.nuevoEstado.impTotalPorPagar = ultimaAccion.impTotalPagado;

      this.grupos[this.grupos.length - 1].values.push(this.nuevoEstado);
    }
  }

  anular() {
    let ultimaAccion: FacturaEstadosPagosItem = this.getUltimoEstado();

    if (this.disabledAnular()) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacion.facturas.estadosPagos.anulacion.error"));
    } else {
      this.nuevoEstado = new FacturaEstadosPagosItem();

      // IdFactura
      this.nuevoEstado.idFactura = ultimaAccion.idFactura;

      this.nuevoEstado.nuevo = true;
      let fechaActual: Date = new Date();
      this.nuevoEstado.fechaMin = new Date(ultimaAccion.fechaModificaion);
      this.nuevoEstado.fechaModificaion = new Date();
      this.nuevoEstado.notaMaxLength = 255;

      // Acción
      this.nuevoEstado.idAccion = "8";
      this.nuevoEstado.accion = this.translateService.instant("facturacion.facturas.estadosPagos.anulacion");

      this.nuevoEstado.impTotalPagado = ultimaAccion.impTotalPorPagar;
      this.nuevoEstado.impTotalPorPagar = "0";

      this.grupos[this.grupos.length - 1].values.push(this.nuevoEstado);
    }
  }

  // Eliminar
  eliminar() {
    let ultimaAccion: FacturaEstadosPagosItem = this.getUltimoEstado();
    ultimaAccion.idFactura = this.bodyInicial.idFactura;

    if (this.disabledEliminar()) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacion.facturas.estadosPagos.eliminar.error"));
    } else {
      this.progressSpinner = true;
      this.sigaServices.post("facturacionPyS_eliminarEstadosPagos", ultimaAccion).toPromise()
      .then(
        n => { },
        err => {
          return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
      }).catch(error => {
        if (error != undefined) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), error);
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      }).then(() => {
        this.progressSpinner = false;
        this.guardadoSend.emit(this.bodyInicial);
      });
    }
  }

  // Restablecer

  restablecer() {
    this.nuevoEstado = undefined;

    this.resaltadoDatos = false;
    this.resaltadoDatos = false;
    this.resaltadoEstado = false;
    this.resaltadoBanco = false;
    
    this.grupos = JSON.parse(JSON.stringify(this.datosInit));
  }

  // Modal para guardar el nuevo estado

  isValid(): boolean {
    let valid: boolean = true;

    if (this.esUltimoEstadoFactura()) {
      if (this.nuevoEstado.idAccion == this.ACCION_ABONO_RENEGOCIACION) {
        valid = this.nuevoEstado.fechaModificaion != undefined && this.nuevoEstado.fechaModificaion != undefined && this.nuevoEstado.modo != undefined && this.nuevoEstado.modo.trim().length != 0 
          && (this.nuevoEstado.modo != "otroBanco" || this.nuevoEstado.modo == "otroBanco" && this.nuevoEstado.cuentaBanco != undefined && this.nuevoEstado.cuentaBanco.trim().length != 0);
      } else if (this.nuevoEstado.idAccion == this.ACCION_FACTURA_DEVOLUCION) {
        valid = this.nuevoEstado.fechaModificaion != undefined && this.nuevoEstado.comentario != undefined && this.nuevoEstado.comentario.trim().length != 0;
      } else if (this.nuevoEstado.idAccion == this.ACCION_FACTURA_NUEVO_CAJA) {
        valid = this.nuevoEstado.fechaModificaion != undefined && this.nuevoEstado.impTotalPagado != undefined && this.nuevoEstado.impTotalPagado.trim().length != 0;
      }
    } else {
      if (this.nuevoEstado.idAccion == this.ACCION_ABONO_RENEGOCIACION) {
        valid = this.nuevoEstado.modo != undefined && this.nuevoEstado.modo.trim().length != 0 && (this.nuevoEstado.idEstado != this.ESTADO_ABONO_BANCO || this.nuevoEstado.idEstado == this.ESTADO_ABONO_BANCO && this.nuevoEstado.idCuenta != undefined && this.nuevoEstado.idCuenta.trim().length != 0);
      } else if (this.nuevoEstado.idAccion == this.ACCION_ABONO_NUEVO_CAJA) {
        valid = this.nuevoEstado.movimiento && this.nuevoEstado.movimiento.trim().length != 0;
      }
    }

    if (!valid) {
      this.showMessage("error", "Error", this.translateService.instant('general.message.camposObligatorios'));
    }
    
    return valid;
  }

  guardar() {
    if (this.isValid()) {
      if (this.esUltimoEstadoFactura()) {
        this.progressSpinner = true;
        this.sigaServices.post("facturacionPyS_insertarEstadosPagos", this.nuevoEstado).toPromise()
          .then(
            n => {
              this.guardadoSend.emit(this.bodyInicial);
              this.progressSpinner = false;
            },
            err => {
              this.handleServerSideErrorMessage(err);
              this.progressSpinner = false;
          });
      } else if (this.nuevoEstado.idAccion == this.ACCION_ABONO_NUEVO_CAJA) {
        this.progressSpinner = true;
        this.sigaServices.post("facturacionPyS_pagarPorCajaAbono", this.nuevoEstado).toPromise()
          .then(
            n => {
              this.guardadoSend.emit(this.bodyInicial);
              this.progressSpinner = false;
            },
            err => {
              this.handleServerSideErrorMessage(err);
              this.progressSpinner = false;
          });
      } else if (this.nuevoEstado.idAccion == this.ACCION_ABONO_RENEGOCIACION) {
        this.progressSpinner = true;
        this.sigaServices.post("facturacionPyS_renegociarAbono", this.nuevoEstado).toPromise()
          .then(
            n => {
              this.guardadoSend.emit(this.bodyInicial);
              this.progressSpinner = false;
            },
            err => {
              this.handleServerSideErrorMessage(err);
              this.progressSpinner = false;
          });
      }
    } else {
      this.resaltadoDatos = true;
    }
  }
  
  // Función para comprobar si la línea tiene fichero de transferencias
  tieneFichero(dato: FacturaEstadosPagosItem): boolean {
    return dato.idEstado == this.ESTADO_ABONO_PAGADO 
      && dato.idDisqueteAbono != undefined && dato.idDisqueteAbono.trim().length > 0;
  }

  // Enlace al fichero de transferencias
  navigateToFicheroTransferencias(row: FacturaEstadosPagosItem) {
    this.progressSpinner = true;
    let filtros = { idDisqueteAbono: row.idDisqueteAbono };

    this.sigaServices.post("facturacionPyS_getFicherosTransferencias", filtros).toPromise().then(
      n => {
        let results: FicherosAdeudosItem[] = JSON.parse(n.body).ficherosAbonosItems;
        if (results != undefined && results.length != 0) {
          let ficherosAdeudosItem: FicherosAdeudosItem = results[0];

          sessionStorage.setItem("abonosSJCSItem", JSON.stringify(this.bodyInicial));
          sessionStorage.setItem("volverAbonoSJCS", "true");

          sessionStorage.setItem("FicherosAbonosItem", JSON.stringify(ficherosAdeudosItem));
        }
      },
      err => {
        console.log(err);
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    ).then(() => this.progressSpinner = false).then(() => {
      if (sessionStorage.getItem("FicherosAbonosItem")) {
        this.router.navigate(['/gestionFicherosTransferencias']);
      } 
    });
  }

  // Enlace a la factura
  navigateToFactura(row: FacturaEstadosPagosItem) {
    let factura: FacturasItem = new FacturasItem();

    if (row.comisionIdFactura) {
      factura.idFactura = row.comisionIdFactura;
    } else {
      factura.idFactura = row.idFactura;
    }

    factura.tipo = "FACTURA";

    sessionStorage.setItem("facturasItem", JSON.stringify(factura));
    sessionStorage.setItem("volver", "true");
    this.router.navigate(["/gestionFacturas"]);
  }

  // Enlace al abono
  navigateToAbono(row: FacturaEstadosPagosItem) {
    let factura: FacturasItem = new FacturasItem();
    factura.idAbono = row.idAbono;
    factura.tipo = "ABONO";

    sessionStorage.setItem("facturasItem", JSON.stringify(factura));
    sessionStorage.setItem("volver", "true");
    this.router.navigate(["/gestionFacturas"]);
  }

  navigateToSJCS(row: FacturaEstadosPagosItem) {
    let factura: FacturasItem = new FacturasItem();
    factura.idAbono = row.idAbono;
    factura.tipo = "ABONO";

    sessionStorage.setItem("facturasItem", JSON.stringify(this.bodyInicial));
    sessionStorage.setItem("abonosSJCSItem", JSON.stringify(factura));
    sessionStorage.setItem("volverAbonoSJCS", "true");
    this.router.navigate(["/gestionFacturas"]);
  }

  // Enlace al fichero de adeudos
  navigateToFicheroAdeudos(row: FacturaEstadosPagosItem) {
    this.progressSpinner = true;
    let filtros = { idDisqueteCargos: row.idCargos };

    this.sigaServices.post("facturacionPyS_getFicherosAdeudos", filtros).toPromise().then(
      n => {
        let results: FicherosAdeudosItem[] = JSON.parse(n.body).ficherosAdeudosItems;
        if (results != undefined && results.length != 0) {
          let ficherosAdeudosItem: FicherosAdeudosItem = results[0];

          sessionStorage.setItem("facturasItem", JSON.stringify(this.bodyInicial));
          sessionStorage.setItem("volver", "true");

          sessionStorage.setItem("FicherosAdeudosItem", JSON.stringify(ficherosAdeudosItem));
        }
      },
      err => {
        console.log(err);
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    ).then(() => this.progressSpinner = false).then(() => {
      if (sessionStorage.getItem("FicherosAdeudosItem")) {
        this.router.navigate(["/gestionAdeudos"]);
      } 
    });
  }

  // Controlar errores del servidor  
  handleServerSideErrorMessage(err): void {
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
  }

  // Abrir y cerrar un grupo de estados
  toggleGrupo(index: number) {
    this.grupos[index].activo = !this.grupos[index].activo;
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
        this.selectedDatos = this.grupos;
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
