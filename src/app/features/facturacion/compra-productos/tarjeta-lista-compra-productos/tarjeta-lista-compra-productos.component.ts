import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { ListaCompraProductosItem } from '../../../../models/ListaCompraProductosItem';
import { procesos_PyS } from '../../../../permisos/procesos_PyS';
import { SigaStorageService } from '../../../../siga-storage.service';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';
import { FichaCompraSuscripcionComponent } from '../../ficha-compra-suscripcion/ficha-compra-suscripcion.component';

@Component({
  selector: 'app-tarjeta-lista-compra-productos',
  templateUrl: './tarjeta-lista-compra-productos.component.html',
  styleUrls: ['./tarjeta-lista-compra-productos.component.scss']
})
export class TarjetaListaCompraProductosComponent implements OnInit {

  msgs: Message[] = [];

  estadosCompraObject: ComboItem[] = [];

  @Output() actualizarLista = new EventEmitter<Boolean>();
  @Input() listaCompraProductos: ListaCompraProductosItem[];

  cols = [
    { field: "fechaSolicitud", header: "censo.resultadosSolicitudesModificacion.literal.fecha" },
    { field: "nSolicitud", header: "facturacion.productos.nSolicitud" },
    { field: "nIdentificacion", header: "censo.consultaDatosColegiacion.literal.numIden" },
    { field: "nColegiado", header: "censo.busquedaClientesAvanzada.literal.nColegiado" },
    { field: "apellidosNombre", header: "justiciaGratuita.oficio.designas.interesados.apellidosnombre" },
    { field: "concepto", header: "facturacionSJCS.facturacionesYPagos.conceptos" },
    { field: "idFormaPago", header: "facturacion.productos.formapago" },
    { field: "importe", header: "facturacionSJCS.facturacionesYPagos.importe" },
    { field: "idEstadoSolicitud", header: "solicitudes.literal.titulo.estadosolicitud" },
    { field: "fechaEfectiva", header: "administracion.auditoriaUsuarios.literal.fechaEfectiva" },
    { field: "estadoFactura", header: "facturacion.productos.estadoFactura" },
  ];

  rowsPerPageSelectValues = [
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

  permisoSolicitarCompra;
  permisoAprobarCompra;
  permisoDenegar;

  selectedRows: ListaCompraProductosItem[] = []; //Datos de las filas seleccionadas.
  numSelectedRows: number = 0; //Se usa para mostrar visualmente el numero de filas seleccionadas
  selectMultipleRows: boolean = true; //Seleccion multiples filas de la tabla
  selectAllRows: boolean = false; //Selecciona todas las filas de la pagina actual de la tabla
  rowsPerPage: number = 10; //Define el numero de filas mostradas por pagina
  first = 0;
  buscadores = [];

  progressSpinner: boolean = false;
  esColegiado: boolean = this.localStorageService.isLetrado;

  constructor(
    private sigaServices: SigaServices, private translateService: TranslateService,
    private commonsService: CommonsService, private router: Router,
    private localStorageService: SigaStorageService,) { }

  ngOnInit() {
    this.checkPermisos();
    this.initComboEstadoCompra();
  }

  initComboEstadoCompra() {
    //PENDIENTE
    let estadoPendiente = new ComboItem();
    estadoPendiente.label = this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.pendiente");
    estadoPendiente.value = "1";
    this.estadosCompraObject.push(estadoPendiente);
    //DENEGADA
    let estadoDenegada = new ComboItem();
    estadoDenegada.label = this.translateService.instant("facturacion.productos.denegada");
    estadoDenegada.value = "2";
    this.estadosCompraObject.push(estadoDenegada);
    //ACEPTADA
    let estadoAceptada = new ComboItem();
    estadoAceptada.label = this.translateService.instant("facturacion.productos.aceptada");
    estadoAceptada.value = "3";
    this.estadosCompraObject.push(estadoAceptada);
    //ANULACIÓN SOLICITADA
    let estadoAnulacionSolicitada = new ComboItem();
    estadoAnulacionSolicitada.label = this.translateService.instant("facturacion.productos.anulacionSolicitada");
    estadoAnulacionSolicitada.value = "4";
    this.estadosCompraObject.push(estadoAnulacionSolicitada);
    //ANULADA
    let estadoAnulada = new ComboItem();
    estadoAnulada.label = this.translateService.instant("facturacion.productos.anulada");
    estadoAnulada.value = "5";
    this.estadosCompraObject.push(estadoAnulada);
  }

  checkPermisos() {
    this.getPermisoAprobarCompra();
    this.getPermisoDenegar();
  }

  checkAprobar() {
    let msg = this.commonsService.checkPermisos(this.permisoAprobarCompra, undefined);

    if (msg != null) {
      this.msgs = msg;
    } else {
      this.aprobarCompra();
    }
  }

  checkDenegar() {
    let msg = null;
    msg = this.commonsService.checkPermisos(this.permisoDenegar, undefined);

    if (msg != null) {
      this.msgs = msg;
    } else {
      this.denegar();
    }
  }

  checkAnular(){
    this.msgs = [
      {
        severity: "info",
        summary: "En proceso",
        detail: "Boton no funcional actualmente"
      }
    ];
  }

  checkFacturar(){
    this.msgs = [
      {
        severity: "info",
        summary: "En proceso",
        detail: "Boton no funcional actualmente"
      }
    ];
  }

  aprobarCompra() {

    this.progressSpinner = true;
    let peticion: FichaCompraSuscripcionItem[] = [];
    this.selectedRows.forEach(row => {
      let solicitud: FichaCompraSuscripcionItem = new FichaCompraSuscripcionItem();
      solicitud.nSolicitud = row.nSolicitud;
      solicitud.fechaAceptada = row.fechaEfectiva;
      solicitud.fechaDenegada = row.fechaDenegada;
      peticion.push(solicitud);
    });
    this.sigaServices.post('PyS_aprobarCompraMultiple', peticion).subscribe(
      (n) => {
        if (n.status != 200) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          //Se actualiza la información de la ficha
          this.actualizarLista.emit(true);
        }
        this.selectedRows = [];
        this.numSelectedRows = 0;
        this.progressSpinner = false;
      },
      (err) => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    );
  }

  denegar() {
    this.progressSpinner = true;
    let peticion: FichaCompraSuscripcionItem[] = [];
    this.selectedRows.forEach(row => {
      let solicitud: FichaCompraSuscripcionItem = new FichaCompraSuscripcionItem();
      solicitud.nSolicitud = row.nSolicitud;
      solicitud.fechaAceptada = row.fechaEfectiva;
      solicitud.fechaDenegada = row.fechaDenegada;
      peticion.push(solicitud);
    });
    this.sigaServices.post('PyS_denegarPeticionMultiple', peticion).subscribe(
      (n) => {
        if (n.status != 200) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          //Se actualiza la información de la ficha
          this.actualizarLista.emit(true);
        }
        this.selectedRows = [];
        this.numSelectedRows = 0;
        this.progressSpinner = false;
      },
      (err) => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }

    );
  }

  openTab(rowData) {
    this.progressSpinner = true;
    let compra = new FichaCompraSuscripcionItem();
    compra.nSolicitud = rowData.nSolicitud;
    compra.productos = [];
    compra.fechaAceptada = rowData.fechaEfectiva;
    this.sigaServices.post('PyS_getFichaCompraSuscripcion', compra).subscribe(
      (n) => {
        this.progressSpinner = false;
        sessionStorage.setItem("FichaCompraSuscripcion", n.body);
        this.router.navigate(["/fichaCompraSuscripcion"]);
      }
    );
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  getPermisoAprobarCompra() {
    this.commonsService
      .checkAcceso(procesos_PyS.aprobarCompra)
      .then((respuesta) => {
        this.permisoAprobarCompra = respuesta;
      })
      .catch((error) => console.error(error));
  }

  getPermisoDenegar() {
    //Según la documentación funcional de Productos y Servicios, cualquier usuario que tenga acceso total puede realizar esta acción
    this.commonsService
      .checkAcceso(procesos_PyS.fichaCompraSuscripcion)
      .then((respuesta) => {
        this.permisoDenegar = respuesta;
      })
      .catch((error) => console.error(error));
  }

  //Metodo activado al pulsar sobre el checkbox Seleccionar todo
  onChangeSelectAllRows() {
    if (this.selectAllRows === true) {
      this.selectedRows = this.listaCompraProductos;
      this.numSelectedRows = this.listaCompraProductos.length;

    } else {
      this.selectedRows = [];
      this.numSelectedRows = 0;
    }
  }

  //Metodo para aplicar logica al deseleccionar filas
  onRowUnselect() {
    this.numSelectedRows = this.selectedRows.length;
  }
  //Metodo para aplicar logica al seleccionar filas
  onRowSelect() {
    this.numSelectedRows = this.selectedRows.length;
  }
}
