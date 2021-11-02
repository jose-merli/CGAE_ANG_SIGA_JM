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

@Component({
  selector: 'app-tarjeta-solicitud-compra-suscripcion',
  templateUrl: './tarjeta-solicitud-compra-suscripcion.component.html',
  styleUrls: ['./tarjeta-solicitud-compra-suscripcion.component.scss']
})
export class TarjetaSolicitudCompraSuscripcionComponent implements OnInit {

  msgs : Message[];
  
  @Input("ficha") ficha : FichaCompraSuscripcionItem; 
  @Input("tarjProductos") tarjProductos : TarjetaProductosCompraSuscripcionComponent;
  
  @Output() actualizaFicha = new EventEmitter<Boolean>();

  cols = [
    { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha"},
    { field: "estado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado"},
  ];

  filas: FilaHistoricoPeticionItem[] = [];

  permisoSolicitarCompra: boolean = false;
  permisoAprobarCompra: boolean = false;
  permisoDenegar: boolean = false;
  permisoAnularPeticion: boolean = false;

  progressSpinner : boolean = false;
  showTarjeta: boolean = false;
  esColegiado: boolean = this.localStorageService.isLetrado;

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
    this.getPermisoAnularPeticion();
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

  checkSolicitarCompra(){
    let msg = this.commonsService.checkPermisos(this.permisoSolicitarCompra, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    }  else if(this.ficha.idPersona == null){
      //Etiqueta
      this.showMessage("error",this.translateService.instant('general.message.camposObligatorios'),this.translateService.instant("facturacion.productos.seleccCliente"));
    } else if(this.checkProductos()){
      if(this.tarjProductos.productosTarjeta.length == 0){
        this.showMessage("error",
        this.translateService.instant("facturacion.productos.noBorrarProductos"),
        this.translateService.instant("facturacion.productos.prodNecesario")
        );
      }
      else {
        this.showMessage("error", this.translateService.instant('menu.facturacion.productos'), this.translateService.instant('general.message.camposObligatorios'));
      }
    }  else if(this.tarjProductos.selectedPago == null){
      //Etiqueta
      this.showMessage("error",this.translateService.instant('general.message.camposObligatorios'),this.translateService.instant("facturacion.productos.seleccPago"));
    }
    //Si ha seleccionado forma de pago "domicialiacion bancaria" pero no ha elegido cuenta.
    else if(this.tarjProductos.selectedPago == "80" && this.tarjProductos.datosTarjeta.cuentaBancSelecc == null){
      this.showMessage("error", this.translateService.instant('menu.facturacion.productos'), this.translateService.instant('general.message.camposObligatorios'));
    }
    else {
			this.solicitarCompra();
		}
  }

  checkAprobar(){
    let msg = null;
    //En el caso que se trate de la aprobacion de una compra
    if(this.ficha.productos != null) {
      msg = this.commonsService.checkPermisos(this.permisoAprobarCompra, undefined);

      if (msg != null) {
        this.msgs = msg;
      }  else if(this.ficha.idPersona == null){
        this.showMessage("error",this.translateService.instant("general.message.camposObligatorios"),this.translateService.instant("facturacion.productos.seleccCliente"));
      }
      //Solicitud nueva
      else if(this.ficha.fechaPendiente == null){
        if(this.tarjProductos.selectedPago == null){
          this.showMessage("error",this.translateService.instant("general.message.camposObligatorios"),this.translateService.instant("facturacion.productos.seleccPago"));
        }
        //Si ha seleccionado forma de pago "domicialiacion bancaria" pero no ha elegido cuenta.
        else if(this.tarjProductos.selectedPago == "80" && this.tarjProductos.datosTarjeta.cuentaBancSelecc == null){
          this.showMessage("error", this.translateService.instant('menu.facturacion.productos'), this.translateService.instant('general.message.camposObligatorios'));
        }
        else if(this.checkProductos()){
          if(this.tarjProductos.productosTarjeta.length == 0){
            this.showMessage("error",
            this.translateService.instant("facturacion.productos.noBorrarProductos"),
            this.translateService.instant("facturacion.productos.prodNecesario")
            );
          }
          else {
            this.showMessage("error", this.translateService.instant("menu.facturacion.productos"), this.translateService.instant('general.message.camposObligatorios'));
          }
        }else {
          this.aprobarCompra();
        }
      }
      else{
        this.aprobarCompra();
      }
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

  // REVISAR: Añadir comprobación de facturación
  checkAnular(){
    let msg = null;
    if(this.ficha.productos!= null) msg = this.commonsService.checkPermisos(this.permisoAnularPeticion, undefined);

    if (msg != null) {
      this.msgs = msg;
    }  
    //Se comprueba que el estado de la peticion permite anularla. Debe ser la misma condición que la de deshabilitacion del botón
    else if((this.ficha.fechaAceptada == null && this.ficha.fechaSolicitadaAnulacion == null) || this.ficha.fechaAnulada != null || (this.ficha.fechaSolicitadaAnulacion != null && this.esColegiado)){
      this.showMessage("info", this.translateService.instant("facturacion.productos.solicitudesNoAlteradas"), this.translateService.instant("facturacion.productos.solicitudesNoAlteradasDesc") + this.ficha.nSolicitud);
		} 
    //Se comprueba que todos los productos seleccionados tienen la propiedad ‘Solicitar baja por internet’ si el que lo solicita es un colegiado
    //REVISAR: Cambiar mensaje
    else if(this.esColegiado && this.ficha.productos != null && (this.ficha.productos.find(el => el.solicitarBaja == "0") != undefined)){
      this.showMessage("info", this.translateService.instant("facturacion.productos.solicitarBajaProd"), this.translateService.instant("facturacion.productos.solicitarBajaProdDesc"));
		}
    //Se comprueba que todos los servicios de la peticion tienen la propiedad ‘Solicitar baja por internet’ si el que lo solicita es un colegiado
    //REVISAR : Cambiar productos por servicios y cambiar mensaje
    else if(this.esColegiado && this.ficha.productos == null && (this.ficha.productos.find(el => el.solicitarBaja == "0") != undefined)){
      this.showMessage("info", this.translateService.instant("facturacion.productos.solicitudesNoAlteradas"), this.translateService.instant("facturacion.productos.solicitudesNoAlteradasDesc") + this.ficha.nSolicitud);
		}
    //Se comprueba si hay alguna factura asociada cuando el personal del colegio va a anular una petición
    //REVISAR: Revisar concepto de factura anulada y no anulada y su anulación.
    else if(!this.esColegiado && this.ficha.facturas.length > 0){
      this.showMessage("info", this.translateService.instant("facturacion.productos.solicitudesNoAlteradas"), this.translateService.instant("facturacion.productos.solicitudesNoAlteradasDesc") + this.ficha.nSolicitud);
		}
    else{
      this.confirmAnular();
    }
  }

  confirmAnular() {

    //REVISAR MENSAJE
    let mess = this.translateService.instant(
      "facturacion.productos.anulConf"
    );

    //REVISAR LOGICA FACTURAS
    if(this.ficha.facturas.length >0) {
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
		this.sigaServices.post('PyS_solicitarCompra', this.ficha).subscribe(
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

  getPermisoAprobarCompra(){
    this.commonsService
			.checkAcceso(procesos_PyS.aprobarCompra)
			.then((respuesta) => {
				this.permisoAprobarCompra = respuesta;
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

  getPermisoAnularPeticion(){
    //En la documentación no parece distinguir que se requiera una permiso especifico para esta acción
    this.commonsService
			.checkAcceso(procesos_PyS.fichaCompraSuscripcion)
			.then((respuesta) => {
				this.permisoAnularPeticion = respuesta;
			})
			.catch((error) => console.error(error));
  }

}
