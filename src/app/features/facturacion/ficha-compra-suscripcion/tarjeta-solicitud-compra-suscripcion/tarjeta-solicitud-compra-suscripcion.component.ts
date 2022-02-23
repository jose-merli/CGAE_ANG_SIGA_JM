import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../commons/translate';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { FilaHistoricoPeticionItem } from '../../../../models/FilaHistoricoPeticionItem';
import { procesos_PyS } from '../../../../permisos/procesos_PyS';
import { SigaStorageService } from '../../../../siga-storage.service';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';
import { Location } from '@angular/common';
import { TarjetaProductosCompraSuscripcionComponent } from '../tarjeta-productos-compra-suscripcion/tarjeta-productos-compra-suscripcion.component';
import { TarjetaServiciosCompraSuscripcionComponent } from '../tarjeta-servicios-compra-suscripcion/tarjeta-servicios-compra-suscripcion.component';
import { stringify } from 'querystring';
import { FacturacionRapidaRequestDTO } from '../../../../models/FacturacionRapidaRequestDTO';
import { saveAs } from "file-saver/FileSaver";

@Component({
  selector: 'app-tarjeta-solicitud-compra-suscripcion',
  templateUrl: './tarjeta-solicitud-compra-suscripcion.component.html',
  styleUrls: ['./tarjeta-solicitud-compra-suscripcion.component.scss']
})
export class TarjetaSolicitudCompraSuscripcionComponent implements OnInit {

  msgs : Message[];
  
  @Input("ficha") ficha : FichaCompraSuscripcionItem; 
  @Input("tarjProductos") tarjProductos : TarjetaProductosCompraSuscripcionComponent;
  @Input("tarjServicios") tarjServicios : TarjetaServiciosCompraSuscripcionComponent;
  @Input("esColegiado") esColegiado: boolean;
  
  @Output() actualizaFicha = new EventEmitter<Boolean>();
  @Output() scrollToOblig = new EventEmitter<String>();

  cols = [
    { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha"},
    { field: "estado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado"},
  ];

  filas: FilaHistoricoPeticionItem[] = [];

  permisoSolicitarCompra: boolean = false;
  permisoAprobarCompra: boolean = false;
  permisoDenegar: boolean = false;
  permisoAnularCompra: boolean = false;
  permisoFacturarCompra: boolean = false;
  permisoAnularSuscripcion: boolean = false;
  permisoSolicitarSscripcion: boolean = false;
  permisoSolicitarSuscripcion: boolean = false;
  permisoAprobarSuscripcion: boolean = false;

  progressSpinner : boolean = false;
  showTarjeta: boolean = true;

  showModalSerieFacturacion = false;
  comboSeriesFacturacion: any[] = [];
  serieFacturacionSeleccionada: string;

  constructor(
    private sigaServices: SigaServices, private translateService: TranslateService, 
    private commonsService: CommonsService, private router: Router,
    private localStorageService: SigaStorageService, private location: Location, 
    private confirmationService: ConfirmationService,) { }

  ngOnInit() {
    this.processHist();
    this.checkPermisos();

  }

  ngOnChanges(changes: SimpleChanges){
    this.processHist();
  }

  processHist(){
    this.filas = [];
    if(this.ficha.fechaPendiente!=null){
      let fila = new FilaHistoricoPeticionItem();
      fila.fecha = this.ficha.fechaPendiente;
      fila.estado = this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.pendiente");
      this.filas.push(fila);
    }
    if(this.ficha.fechaDenegada!=null){
      let fila = new FilaHistoricoPeticionItem();
      fila.fecha = this.ficha.fechaDenegada;
      fila.estado = this.translateService.instant("facturacion.productos.denegada");
      this.filas.push(fila);
    }
    if(this.ficha.fechaAceptada!=null){
      let fila = new FilaHistoricoPeticionItem();
      fila.fecha = this.ficha.fechaAceptada;
      fila.estado = this.translateService.instant("facturacion.productos.aceptada");
      this.filas.push(fila);
    }
    if(this.ficha.fechaSolicitadaAnulacion!=null){
      let fila = new FilaHistoricoPeticionItem();
      fila.fecha = this.ficha.fechaSolicitadaAnulacion;
      fila.estado = this.translateService.instant("facturacion.productos.anulacionSolicitada");
      this.filas.push(fila);
    }
    if(this.ficha.fechaAnulada!=null){
      let fila = new FilaHistoricoPeticionItem();
      fila.fecha = this.ficha.fechaAnulada;
      fila.estado = this.translateService.instant("facturacion.productos.anulada");
      this.filas.push(fila);
    }
  }

  checkPermisos(){
    this.getPermisoSolicitarCompra();
    this.getPermisoAprobarCompra();
    this.getPermisoDenegar();
    this.getPermisoAnularCompra();
    this.getPermisoSolicitarSuscripcion();
    this.getPermisoAprobarSuscripcion();
    this.getPermisoAnularSuscripcion();
    this.getPermisoFacturarCompra();
  }

  checkProductos(){
    let prods = this.tarjProductos.productosTarjeta;
    let campoVacio = false;
    prods.forEach( el => {
      if(el.cantidad == null || el.cantidad.trim() == '' ||
      el.descripcion == null || el.descripcion.trim() == '' ||
      el.precioUnitario == null || el.precioUnitario.trim() == '' ||
      el.iva == null || el.iva.trim() == '') {
        campoVacio = true;
      }
    });
    if(prods.length == 0 || campoVacio) {
      return true;
    }
    return false;
  }

  //REVISAR
  checkServicios() {
    let servs = this.tarjServicios.serviciosTarjeta;
    let campoVacio = false;
    //Comprobacion de campos obligatorios de los servicios
    this.tarjServicios.serviciosTarjeta.forEach(el => {
      if (//el.idPrecioServicio == null ||
        (el.fechaAlta == null && this.ficha.fechaAceptada!= null) ||
        (el.fechaBaja == null && this.ficha.fechaAnulada!= null)) {
          campoVacio = true;
        }
    })

    if(servs.length == 0 || campoVacio) {
      return true;
    }
    return false;
  }

  checkSolicitarCompra(){
    let msg = this.commonsService.checkPermisos(this.permisoSolicitarCompra, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    }  else if(this.ficha.idPersona == null){
      //Etiqueta
      this.showMessage("error",this.translateService.instant('general.message.camposObligatorios'),this.translateService.instant("facturacion.productos.seleccCliente"));
      this.scrollToOblig.emit("cliente");

    } else if(this.checkProductos()){
      if(this.tarjProductos.productosTarjeta.length == 0){
        this.showMessage("error",
        this.translateService.instant("general.message.camposObligatorios"), 
        this.translateService.instant("facturacion.productos.prodNecesario")
        );
      }
      else {
        this.showMessage("error", this.translateService.instant('menu.facturacion.productos'), this.translateService.instant('general.message.camposObligatorios'));
      }
      this.scrollToOblig.emit("productos");
    }  else if(this.tarjProductos.selectedPago == null){
      this.showMessage("error",this.translateService.instant('general.message.camposObligatorios'),this.translateService.instant("facturacion.productos.seleccPago"));
      this.scrollToOblig.emit("productos");
    }
    //Si ha seleccionado forma de pago "domicialiacion bancaria" pero no ha elegido cuenta.
    else if((this.tarjProductos.selectedPago == "80" || this.tarjProductos.selectedPago == "20")&& this.tarjProductos.datosTarjeta.cuentaBancSelecc == null){
      this.showMessage("error", this.translateService.instant('menu.facturacion.productos'), this.translateService.instant('general.message.camposObligatorios'));
      this.scrollToOblig.emit("productos");
    }
    else {
			this.solicitarCompra();
		}
  }

  checkSolicitarSuscripcion(){
    let msg = this.commonsService.checkPermisos(this.permisoSolicitarSuscripcion, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else if(this.ficha.idPersona == null){
      this.showMessage("error",this.translateService.instant('general.message.camposObligatorios'),this.translateService.instant("facturacion.productos.seleccCliente"));
      this.scrollToOblig.emit("cliente");
    } else if(this.checkServicios()){
      if(this.tarjServicios.serviciosTarjeta.length == 0){
        this.showMessage("error",
        this.translateService.instant("facturacion.suscripcion.noServicioAsociado"),
        this.translateService.instant("facturacion.suscripcion.servicioNecesario")
        );
      }
      else {
        this.showMessage("error", this.translateService.instant('menu.productosYServicios.categorias.servicios'), this.translateService.instant('general.message.camposObligatorios'));
      }
      this.scrollToOblig.emit("servicios");
    }  else if(this.tarjServicios.selectedPago == null){
      this.showMessage("error",this.translateService.instant('general.message.camposObligatorios'),this.translateService.instant("facturacion.productos.seleccPago"));
      this.scrollToOblig.emit("servicios");
    }
    //Si ha seleccionado forma de pago "domicialiacion bancaria" pero no ha elegido cuenta.
    else if((this.tarjServicios.selectedPago == "80" || this.tarjServicios.selectedPago == "20") && this.tarjServicios.datosTarjeta.cuentaBancSelecc == null){
      this.showMessage("error", this.translateService.instant('menu.productosYServicios.categorias.servicios'), this.translateService.instant('general.message.camposObligatorios'));
      this.scrollToOblig.emit("servicios");
    }
    else {
			this.solicitarSuscripcion();
		}
  }

  checkAprobar(){
    
    //En el caso que se trate de la aprobacion de una compra
    if(this.ficha.productos != null) {
      this.checkAprobarCompra();
    }else if(this.ficha.servicios != null) {
      this.checkAprobarSuscripcion();
    }
      
  }

  checkAprobarCompra(){
    let msg = this.commonsService.checkPermisos(this.permisoAprobarCompra, undefined);

    if (msg != null) {
      this.msgs = msg;
    } else if (this.ficha.idPersona == null) {
      this.showMessage("error", this.translateService.instant("general.message.camposObligatorios"), this.translateService.instant("facturacion.productos.seleccCliente"));
      this.scrollToOblig.emit("cliente");
    }
    //Solicitud nueva
    else if (this.ficha.fechaPendiente == null) {
      if (this.tarjProductos.selectedPago == null) {
        this.showMessage("error", this.translateService.instant("general.message.camposObligatorios"), this.translateService.instant("facturacion.productos.seleccPago"));
        this.scrollToOblig.emit("productos");
      }
      //Si ha seleccionado forma de pago "domicialiacion bancaria" pero no ha elegido cuenta.
      else if ((this.tarjProductos.selectedPago == "80" || this.tarjProductos.selectedPago == "20") && this.tarjProductos.datosTarjeta.cuentaBancSelecc == null) {
        this.showMessage("error", this.translateService.instant('menu.facturacion.productos'), this.translateService.instant('general.message.camposObligatorios'));
        this.scrollToOblig.emit("productos");
      }
      else if (this.checkProductos()) {
        if (this.tarjProductos.productosTarjeta.length == 0) {
          this.showMessage("error",
            this.translateService.instant("facturacion.productos.noBorrarProductos"),
            this.translateService.instant("facturacion.productos.prodNecesario")
          );
        }
        else {
          this.showMessage("error", this.translateService.instant("menu.facturacion.productos"), this.translateService.instant('general.message.camposObligatorios'));
        }
        this.scrollToOblig.emit("productos");
      } else {
        this.aprobarCompra();
      }
    }
    else {
      this.aprobarCompra();
    }
  }

  checkAprobarSuscripcion(){
    let msg = this.commonsService.checkPermisos(this.permisoAprobarSuscripcion, undefined);

    if (msg != null) {
      this.msgs = msg;
    } else if (this.ficha.idPersona == null) {
      this.showMessage("error", this.translateService.instant("general.message.camposObligatorios"), this.translateService.instant("facturacion.productos.seleccCliente"));
      this.scrollToOblig.emit("cliente");
    }
    //Solicitud nueva
    else if (this.ficha.fechaPendiente == null) {
      if (this.tarjServicios.selectedPago == null) {
        this.showMessage("error", this.translateService.instant("general.message.camposObligatorios"), this.translateService.instant("facturacion.productos.seleccPago"));
        this.scrollToOblig.emit("servicios");
      }
      //Si ha seleccionado forma de pago "domicialiacion bancaria" pero no ha elegido cuenta.
      else if ((this.tarjServicios.selectedPago == "80" || this.tarjServicios.selectedPago == "20" ) && this.tarjServicios.datosTarjeta.cuentaBancSelecc == null) {
        this.showMessage("error", this.translateService.instant('menu.productosYServicios.categorias.servicios'), this.translateService.instant('general.message.camposObligatorios'));
        this.scrollToOblig.emit("servicios");
      }
      else if (this.checkServicios()) {
        if (this.tarjServicios.serviciosTarjeta.length == 0) {
          this.showMessage("error",
            this.translateService.instant("facturacion.suscripcion.noServicioAsociado"),
            this.translateService.instant("facturacion.suscripcion.servicioNecesario")
          );
        }
        else {
          this.showMessage("error", this.translateService.instant("menu.productosYServicios.categorias.servicios"), this.translateService.instant('general.message.camposObligatorios'));
        }
        this.scrollToOblig.emit("servicios");
      } else {
        this.aprobarSuscripcion();
      }
    }
    else {
      this.aprobarSuscripcion();
    }
  }

  checkDenegar(){
    let msg = this.commonsService.checkPermisos(this.permisoDenegar, undefined);

    if (msg != null) {
      this.msgs = msg;
    }  else {
      this.denegar();
		}
  }

  
  checkAnular(){
    let msg = null;
    if(this.ficha.productos!= null){
      msg = this.commonsService.checkPermisos(this.permisoAnularCompra, undefined);
    }
    if(this.ficha.servicios!= null){
      msg = this.commonsService.checkPermisos(this.permisoAnularSuscripcion, undefined);
    }

    if (msg != null) {
      this.msgs = msg;
    }  
    //Se comprueba que el estado de la peticion permite anularla. Debe ser la misma condición que la de deshabilitacion del botón
    else if((this.ficha.fechaAceptada == null && this.ficha.fechaSolicitadaAnulacion == null) || this.ficha.fechaAnulada != null || (this.ficha.fechaSolicitadaAnulacion != null && this.esColegiado)){
      this.showMessage("info", this.translateService.instant("facturacion.productos.solicitudesNoAlteradas"), this.translateService.instant("facturacion.productos.solicitudesNoAlteradasDesc") + this.ficha.nSolicitud);
		} 
    //Se comprueba que todos los productos seleccionados tienen la propiedad ‘Solicitar baja por internet’ si el que lo solicita es un colegiado
    else if(this.esColegiado && this.ficha.productos != null && (this.ficha.productos.find(el => el.solicitarBaja == "0") != undefined)){
      this.showMessage("info", this.translateService.instant("facturacion.productos.solicitarBajaProd"), this.translateService.instant("facturacion.productos.solicitarBajaProdDesc"));
    }
    //Se comprueba que todos los servicios de la peticion tienen la propiedad ‘Solicitar baja por internet’ si el que lo solicita es un colegiado
    //REVISAR : Cambiar mensaje
    else if(this.esColegiado && this.ficha.servicios != null && (this.ficha.servicios.find(el => el.solicitarBaja == "0") != undefined)){
      this.showMessage("info", this.translateService.instant("facturacion.productos.solicitudesNoAlteradas"), this.translateService.instant("facturacion.productos.solicitudesNoAlteradasDesc") + this.ficha.nSolicitud);
    }
    //Se comprueba que todos los servicios de la peticion son manuales ya que los servicios automaticos no se pueden anular
    //REVISAR : Cambiar mensaje
    else if(this.esColegiado && this.ficha.servicios != null && (this.ficha.servicios.find(el => el.automatico == "1") != undefined)){
      this.showMessage("info", this.translateService.instant("facturacion.productos.solicitudesNoAlteradas"), this.translateService.instant("facturacion.productos.solicitudesNoAlteradasDesc") + this.ficha.nSolicitud);
    }
    //Se comprueba si hay alguna factura asociada cuando el personal del colegio va a anular una petición
    //REVISAR: Revisar concepto de factura anulada y no anulada y su anulación.
    //Por ahora, e comprueba si la ultima entrada de la tarjeta facturas es una anulación o una factura
    else if(!this.esColegiado && this.ficha.facturas != null && this.ficha.facturas.length > 0 && this.ficha.facturas[this.ficha.facturas.length-1].tipo == "Factura"){
      this.showMessage("info", this.translateService.instant("facturacion.productos.solicitudesNoAlteradas"), this.translateService.instant("facturacion.productos.solicitudesNoAlteradasDesc") + this.ficha.nSolicitud);
    }
    else{
      this.confirmAnular();
    }
  }

  nofuncional(){
    this.msgs = [
      {
        severity: "info",
        summary: "En proceso",
        detail: "Boton no funcional actualmente"
      }];
  }
  
  confirmAnular() {

    let mess = this.translateService.instant(
      "facturacion.productos.anulConf"
    );

    //REVISAR LOGICA FACTURAS
    if(this.ficha.facturas != null && this.ficha.facturas.length >0) {
      mess = this.translateService.instant("facturacion.productos.factNoAnuladaPet");
    }

    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      key: 'anulPeticion',
      message: mess,
      icon: icon,
      accept: () => {
        this.anularPeticion();
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

  solicitarCompra(){
    this.progressSpinner = true; 
    let peticion : FichaCompraSuscripcionItem = JSON.parse(JSON.stringify(this.ficha));
    peticion.productos = this.tarjProductos.productosTarjeta;
    peticion.idFormaPagoSeleccionada = this.tarjProductos.selectedPago;
    peticion.cuentaBancSelecc = this.tarjProductos.datosTarjeta.cuentaBancSelecc;
		this.sigaServices.post('PyS_solicitarCompra', peticion).subscribe(
			(n) => {
				if( n.status != 200) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          
          //Se actualiza la información de la ficha
          this.actualizaFicha.emit();
        }
				this.progressSpinner = false;
			},
			(err) => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
				this.progressSpinner = false;
			}
		);
  }

  solicitarSuscripcion(){
    this.progressSpinner = true; 
    let peticion : FichaCompraSuscripcionItem = JSON.parse(JSON.stringify(this.ficha));
    peticion.servicios = this.tarjServicios.serviciosTarjeta;
    peticion.idFormaPagoSeleccionada = this.tarjServicios.selectedPago;
    peticion.cuentaBancSelecc = this.tarjServicios.datosTarjeta.cuentaBancSelecc;
		this.sigaServices.post('PyS_solicitarSuscripcion', peticion).subscribe(
			(n) => {
				if( n.status != 200) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          
          //Se actualiza la información de la ficha
          this.actualizaFicha.emit();
        }
				this.progressSpinner = false;
			},
			(err) => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
				this.progressSpinner = false;
			}
		);
  }

  aprobarCompra(){
    this.progressSpinner = true; 
    let peticion = JSON.parse(JSON.stringify(this.ficha));
    if(this.ficha.fechaPendiente == null){
      peticion.productos = this.tarjProductos.productosTarjeta;
      peticion.idFormaPagoSeleccionada = this.tarjProductos.selectedPago;
      peticion.cuentaBancSelecc = this.tarjProductos.datosTarjeta.cuentaBancSelecc;
    }
		this.sigaServices.post('PyS_aprobarCompra', peticion).subscribe(
			(n) => {
				if( n.status != 200) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          //Se actualiza la información de la ficha y se obtiene su historico actualizado
          this.actualizaFicha.emit();
        }
				this.progressSpinner = false;
			},
			(err) => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
				this.progressSpinner = false;
			}
		);
  }

  aprobarSuscripcion(){
    this.progressSpinner = true; 
    let peticion = JSON.parse(JSON.stringify(this.ficha));
    if(this.ficha.fechaPendiente == null){
      peticion.servicios = this.tarjServicios.serviciosTarjeta;
      peticion.idFormaPagoSeleccionada = this.tarjServicios.selectedPago;
      peticion.cuentaBancSelecc = this.tarjServicios.datosTarjeta.cuentaBancSelecc;
    }
		this.sigaServices.post('PyS_aprobarSuscripcion', peticion).subscribe(
			(n) => {
				if( n.status != 200) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          //Se actualiza la información de la ficha y se obtiene su historico actualizado
          this.actualizaFicha.emit();
        }
				this.progressSpinner = false;
			},
			(err) => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
				this.progressSpinner = false;
			}
		);
  }

  denegar(){
    if(this.ficha.fechaPendiente != undefined || this.ficha.fechaPendiente != null){
      this.progressSpinner = true;
      this.sigaServices.post('PyS_denegarPeticion', this.ficha.nSolicitud).subscribe(
        (n) => {
          if( n.status != 200) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          } else {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            
            if(this.esColegiado) this.location.back();
            //Se actualiza la información de la ficha
            else this.actualizaFicha.emit();
          }
          this.progressSpinner = false;
        },
        (err) => {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          this.progressSpinner = false;
        }
      );
    }
    else this.location.back();
  }

  anularPeticion(){
    this.sigaServices.post('PyS_anularPeticion', this.ficha.nSolicitud).subscribe(
      (n) => {
        if( n.status != 200) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          
          //Se actualiza la información de la ficha
          this.actualizaFicha.emit();
        }
        this.progressSpinner = false;
      },
      (err) => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    );
  }

  onHideTarjeta(){
    this.showTarjeta = ! this.showTarjeta;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
  
  getPermisoSolicitarCompra(){
    this.commonsService
			.checkAcceso(procesos_PyS.solicitarCompra)
			.then((respuesta) => {
				this.permisoSolicitarCompra = respuesta;
			})
			.catch((error) => console.error(error));
  }

  getPermisoSolicitarSuscripcion(){
    this.commonsService
			.checkAcceso(procesos_PyS.solicitarSuscripcion)
			.then((respuesta) => {
				this.permisoSolicitarSuscripcion = respuesta;
			})
			.catch((error) => console.error(error));
  }

  getPermisoAprobarCompra(){
    this.commonsService
			.checkAcceso(procesos_PyS.aprobarCompra)
			.then((respuesta) => {
				this.permisoAprobarCompra = respuesta;
			})
			.catch((error) => console.error(error));
  }

  getPermisoAprobarSuscripcion(){
    this.commonsService
			.checkAcceso(procesos_PyS.aprobarSuscripcion)
			.then((respuesta) => {
				this.permisoAprobarSuscripcion = respuesta;
			})
			.catch((error) => console.error(error));
  }

  getPermisoDenegar(){
    //Según la documentación funcional de Productos y Servicios, cualquier usuario que tenga acceso total puede realizar esta acción
    this.commonsService
			.checkAcceso(procesos_PyS.fichaCompraSuscripcion)
			.then((respuesta) => {
				this.permisoDenegar = respuesta;
			})
			.catch((error) => console.error(error));
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

  getPermisoAnularSuscripcion(){
    //En la documentación no parece distinguir que se requiera una permiso especifico para esta acción
    this.commonsService
			.checkAcceso(procesos_PyS.anularSuscripcion)
			.then((respuesta) => {
				this.permisoAnularSuscripcion = respuesta;
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

  async checkFacturar() {

    let msg = this.commonsService.checkPermisos(this.permisoSolicitarCompra, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.progressSpinner = true;
      this.serieFacturacionSeleccionada = undefined;
      await this.getSeleccionSerieFacturacion().then(data => {
        this.comboSeriesFacturacion = data.combooItems;

        if (this.comboSeriesFacturacion == null) {
          //this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("factPyS.mensaje.compraFacturada"));
          this.facturarCompra(false);
        } else {
          this.showModalSerieFacturacion = true;
        }

        this.progressSpinner = false;
      }).catch(err => {
        this.progressSpinner = false;
      });
    }
  }

  facturarCompra(aplicaSerie: boolean) {

    this.progressSpinner = true;

    const compra = new FacturacionRapidaRequestDTO();
    compra.idInstitucion = this.ficha.idInstitucion;
    compra.idPeticion = this.ficha.nSolicitud;

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
          this.progressSpinner = false;
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          //Se actualiza la información de la ficha incluyendo las facturas asociadas
          this.actualizaFicha.emit();
        }

      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    );
  }

  checkModalSerieFacturacion() {

    if (!this.serieFacturacionSeleccionada || this.serieFacturacionSeleccionada == null || this.serieFacturacionSeleccionada.length == 0) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("factPyS.mensaje.seleccionar.elemento"));
    } else {
      this.cerrarModalSerieFacturacion();
      this.facturarCompra(true);
    }
  }

  cerrarModalSerieFacturacion() {
    this.showModalSerieFacturacion = false;
  }

  getSeleccionSerieFacturacion() {
    return this.sigaServices.getParam("PyS_getSeleccionSerieFacturacion", `?idInstitucion=${this.ficha.idInstitucion}&idPeticion=${this.ficha.nSolicitud}`).toPromise();
  }

  marcarObligatorio(valor) {
    let resp = false;

    if (valor == undefined || valor == null || valor.trim().length == 0) {
      resp = true;
    }

    return resp;
  }

  //Borra el mensaje de notificacion p-growl mostrado en la esquina superior derecha cuando pasas el puntero del raton sobre el
  clear() {
    this.msgs = [];
  }
}
