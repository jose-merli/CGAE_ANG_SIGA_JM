import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message, SortEvent } from 'primeng/components/common/api';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { FacturacionRapidaRequestDTO } from '../../../../models/FacturacionRapidaRequestDTO';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { ListaComprasProductosItem } from '../../../../models/ListaComprasProductosItem';
import { procesos_PyS } from '../../../../permisos/procesos_PyS';
import { SigaStorageService } from '../../../../siga-storage.service';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';
import { TarjetaHisFichaActComponent } from '../../../sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-actuaciones-designa/ficha-actuacion/tarjeta-his-ficha-act/tarjeta-his-ficha-act.component';
import { FichaCompraSuscripcionComponent } from '../../ficha-compra-suscripcion/ficha-compra-suscripcion.component';
import { saveAs } from "file-saver/FileSaver";

@Component({
  selector: 'app-tarjeta-lista-compra-productos',
  templateUrl: './tarjeta-lista-compra-productos.component.html',
  styleUrls: ['./tarjeta-lista-compra-productos.component.scss']
})
export class TarjetaListaCompraProductosComponent implements OnInit {

  msgs: Message[] = [];

  estadosCompraObject: ComboItem[] = [];

  @Output() actualizarLista = new EventEmitter<Boolean>();
  @Input() listaCompraProductos: ListaComprasProductosItem[];
  @ViewChild("productsTable") productsTable: DataTable;

  cols = [
    { field: "fechaSolicitud", header: "formacion.busquedaInscripcion.fechaSolicitud" },
    { field: "nSolicitud", header: "facturacion.productos.nSolicitud" },
    { field: "nIdentificacion", header: "censo.consultaDatosColegiacion.literal.numIden" },
    { field: "nColegiado", header: "censo.busquedaClientesAvanzada.literal.nColegiado" },
    { field: "apellidosNombreAux", header: "justiciaGratuita.oficio.designas.interesados.apellidosnombre" },
    { field: "concepto", header: "facturacionSJCS.facturacionesYPagos.conceptos" },
    { field: "desFormaPago", header: "facturacion.productos.formapago" },
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
  
  permisoAprobarCompra: boolean = false;
  permisoDenegar: boolean = false;
  permisoAnularCompra: boolean = false;

  selectedRows: ListaComprasProductosItem[] = []; //Datos de las filas seleccionadas.
  numSelectedRows: number = 0; //Se usa para mostrar visualmente el numero de filas seleccionadas
  selectMultipleRows: boolean = true; //Seleccion multiples filas de la tabla
  selectAllRows: boolean = false; //Selecciona todas las filas de la pagina actual de la tabla
  rowsPerPage: number = 10; //Define el numero de filas mostradas por pagina
  first = 0;
  buscadores = [];

  progressSpinner: boolean = false;
  esColegiado: boolean = true;
  permisoSolicitarCompra: boolean = false;
  permisoFacturarCompra: boolean = false;

  showModalSerieFacturacion = false;
  comboSeriesFacturacion: any[] = [];
  serieFacturacionSeleccionada: string;
  nSolicitudFacturar: string;

  constructor(
    private sigaServices: SigaServices, private translateService: TranslateService,
    private commonsService: CommonsService, private router: Router,
    private localStorageService: SigaStorageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    if(this.localStorageService.isLetrado){
      this.esColegiado = true;
    }
    else{
      this.esColegiado = false;
    }
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
    this.getPermisoAnularCompra();
    this.getPermisoFacturarCompra();
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

  // REVISAR: Añadir comprobación de facturación
  checkAnularCompra(){
    let msg = this.commonsService.checkPermisos(this.permisoAnularCompra, undefined);

    
    if (msg != null) {
      this.msgs = msg;
    }  
    else {

      let compShow : ListaComprasProductosItem[] = [];

      //Se comprueban los estados de las solicitudes
      if(this.selectedRows.filter(el => !((el.fechaEfectiva != null && el.fechaSolicitadaAnulacion != null) && el.fechaAnulada == null)) != undefined){
        compShow.concat(this.selectedRows.filter(el => !((el.fechaEfectiva != null && el.fechaSolicitadaAnulacion != null) && el.fechaAnulada == null)));
        this.selectedRows = this.selectedRows.filter( ( el ) => !compShow.includes( el ) );
      } 
      //Se comprueba que todos los servicios de la peticion tienen la propiedad ‘Solicitar baja por internet’ si el que lo solicita es un colegiado
      //Este parametro "solicitarBaja" de este objeto tiene una logica distinta a la de los servicios
      if(this.esColegiado && (this.selectedRows.filter(el => el.solicitarBaja != "0") != undefined)){
        compShow.concat(this.selectedRows.filter(el => el.solicitarBaja != "0"));
        this.selectedRows = this.selectedRows.filter( ( el ) => !compShow.includes( el ) );
      }
      this.confirmAnular(compShow);
    }
  }

  confirmAnular(compShow) {

    let mess = this.translateService.instant(
      "facturacion.productos.anulConf"
    );

    //REVISAR LOGICA FACTURAS
    //Se comprueba si alguna solicitud tiene alguna factura asociada
    if(this.selectedRows.find(el => el.facturas != "0") != undefined) {
      mess = this.translateService.instant("facturacion.productos.factNoAnuladaPet");
    }

    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      key: 'anulPeticion',
      message: mess,
      icon: icon,
      accept: () => {
        this.anularPeticion(compShow);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: this.translateService.instant("general.boton.cancel"),
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  anularPeticion(compShow: ListaComprasProductosItem[]){
    if(this.selectedRows.length > 0){
      this.progressSpinner = true;
      let peticion: FichaCompraSuscripcionItem[] = [];
      this.selectedRows.forEach(row => {
        let solicitud: FichaCompraSuscripcionItem = new FichaCompraSuscripcionItem();
        solicitud.nSolicitud = row.nSolicitud;
        solicitud.fechaAceptada = row.fechaEfectiva;
        solicitud.fechaDenegada = row.fechaDenegada;
        solicitud.fechaAnulada = row.fechaAnulada;
        solicitud.fechaSolicitadaAnulacion = row.fechaSolicitadaAnulacion;
        peticion.push(solicitud);
      });
      this.sigaServices.post('PyS_anularCompraMultiple', peticion).subscribe(
        (n) => {
          if (n.status != 200) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          } else if(JSON.parse(n.body).error.description!="" || compShow.length > 0){
            let mess = "";
            for(let sus of compShow){
              mess += sus.nSolicitud + ", ";
            }
            mess = mess.substr(1,mess.length-3);
            this.showMessage("info", this.translateService.instant("facturacion.productos.solicitudesNoAlteradas"), this.translateService.instant("facturacion.productos.solicitudesNoAlteradasDesc") +JSON.parse(n.body).error.description+", "+mess);
          }else {
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
    else{
      let mess = "";
      for(let sus of compShow){
        mess += sus.nSolicitud + ", ";
      }
      mess = mess.substr(1,mess.length-3);

      this.showMessage("info", this.translateService.instant("facturacion.productos.solicitudesNoAlteradas"), this.translateService.instant("facturacion.productos.solicitudesNoAlteradasDesc") + mess);
          
    }
  }

  async checkFacturar() {

    let msg = this.commonsService.checkPermisos(this.permisoFacturarCompra, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {

      if (this.selectedRows.length > 1) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("factPyS.mensaje.nElementos.seleccionados"));
      } else {

        //Se comprueban los estados de la solicitud. Se acepta unicamente con estado "Aceptada".
        if (this.selectedRows[0].fechaEfectiva != null && this.selectedRows[0].fechaSolicitadaAnulacion == null && this.selectedRows[0].fechaAnulada == null) {

          this.progressSpinner = true;
          this.serieFacturacionSeleccionada = undefined;
          this.nSolicitudFacturar = undefined;
          await this.getSeleccionSerieFacturacion(this.localStorageService.institucionActual, this.selectedRows[0].nSolicitud)
            .then(data => {
              this.comboSeriesFacturacion = data.combooItems;

              if (this.comboSeriesFacturacion == null) {
                // this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("factPyS.mensaje.compraFacturada"));
                this.nSolicitudFacturar = this.selectedRows[0].nSolicitud;
                this.facturarCompra(false);
              } else {
                this.showModalSerieFacturacion = true;
                this.nSolicitudFacturar = this.selectedRows[0].nSolicitud;
              }

              this.progressSpinner = false;
            }).catch(err => {
              this.progressSpinner = false;
            });

        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("factPyS.mensaje.estado.noPermitido"));
        }
      }

    }

  }

  aprobarCompra() {

    this.progressSpinner = true;
    let peticion: FichaCompraSuscripcionItem[] = [];
    this.selectedRows.forEach(row => {
      let solicitud: FichaCompraSuscripcionItem = new FichaCompraSuscripcionItem();
      solicitud.nSolicitud = row.nSolicitud;
      solicitud.fechaAceptada = row.fechaEfectiva;
      solicitud.fechaDenegada = row.fechaDenegada;
      solicitud.idFormaPagoSeleccionada = row.idFormaPago;
      peticion.push(solicitud);
    });
    this.sigaServices.post('PyS_aprobarCompraMultiple', peticion).subscribe(
      (n) => {
        if (n.status != 200) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else if(JSON.parse(n.body).error.description!=""){
          this.showMessage("info", this.translateService.instant("facturacion.productos.solicitudesNoAlteradas"), this.translateService.instant("facturacion.productos.solicitudesNoAlteradasDesc") +JSON.parse(n.body).error.description);
          //Se actualiza la información de la ficha
          this.actualizarLista.emit(true);
        }else {
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

  nofuncional(){
    this.msgs = [
      {
        severity: "info",
        summary: "En proceso",
        detail: "Boton no funcional actualmente"
      }];
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
        } else if(JSON.parse(n.body).error.description!=""){
          this.showMessage("info", this.translateService.instant("facturacion.productos.solicitudesNoAlteradas"), this.translateService.instant("facturacion.productos.solicitudesNoAlteradasDesc") +JSON.parse(n.body).error.description);
        }else {
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

  //Borra el mensaje de notificacion p-growl mostrado en la esquina superior derecha cuando pasas el puntero del raton sobre el
  clear() {
    this.msgs = [];
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

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order * result);
    });
  }

  onChangeRowsPerPages(event) {
    this.rowsPerPage = event.value;
    this.productsTable.reset();
  }

  getPermisoAnularCompra(){
    //En la documentación no parece distinguir que se requiera una permiso especifico para esta acción
    this.commonsService
			.checkAcceso(procesos_PyS.anularCompra)
			.then((respuesta) => {
				this.permisoAnularCompra = respuesta;
			})
			.catch((error) => console.error(error));
  }

  getPermisoFacturarCompra() {
    //En la documentación no parece distinguir que se requiera una permiso especifico para esta acción
    this.commonsService
      .checkAcceso(procesos_PyS.facturarCompra)
      .then((respuesta) => {
        this.permisoFacturarCompra = respuesta;
      })
      .catch((error) => console.error(error));
  }


  getSeleccionSerieFacturacion(idInstitucion: string, nSolicitud: string) {
    return this.sigaServices.getParam("PyS_getSeleccionSerieFacturacion", `?idInstitucion=${idInstitucion}&idPeticion=${nSolicitud}`).toPromise();
  }

  marcarObligatorio(valor) {
    let resp = false;

    if (valor == undefined || valor == null || valor.trim().length == 0) {
      resp = true;
    }

    return resp;
  }

  cerrarModalSerieFacturacion() {
    this.showModalSerieFacturacion = false;
  }

  checkModalSerieFacturacion() {

    if (!this.serieFacturacionSeleccionada || this.serieFacturacionSeleccionada == null || this.serieFacturacionSeleccionada.length == 0) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("factPyS.mensaje.seleccionar.elemento"));
    } else {
      this.cerrarModalSerieFacturacion();
      this.facturarCompra(true);
    }
  }


  facturarCompra(aplicaSerie: boolean) {

    this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("factPyS.mensaje.ini.fac"));

    const compra = new FacturacionRapidaRequestDTO();
    compra.idInstitucion = this.localStorageService.institucionActual;
    compra.idPeticion = this.nSolicitudFacturar;

    if(aplicaSerie) {
      compra.idSerieFacturacion = this.serieFacturacionSeleccionada;
    } else{
      compra.idSerieFacturacion = "NA"; //Mandamos esta cadena para que no se vuelva a facturar y se genere solo el PDF
    }

    this.sigaServices.postDownloadFilesWithFileName2('PyS_facturarCompra', compra).subscribe(
      (data: { file: Blob, filename: string, status: number }) => {

        if (data.status != 200) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {

          let filename = data.filename.split('=')[1];
          saveAs(data.file, filename);
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          //Se actualiza la información de la ficha
          this.actualizarLista.emit(true);
        }

        this.selectedRows = [];
        this.numSelectedRows = 0;

      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.selectedRows = [];
        this.numSelectedRows = 0;
      }
    );
  }

}
