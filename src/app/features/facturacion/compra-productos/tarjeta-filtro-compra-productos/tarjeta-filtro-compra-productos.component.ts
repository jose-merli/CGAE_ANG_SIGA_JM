import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SigaServices } from '../../../../_services/siga.service';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../commons/translate';
import { ComboObject } from '../../../../models/ComboObject';
import { FiltrosCompraProductosItem } from '../../../../models/FiltrosCompraProductosItem';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { procesos_PyS } from '../../../../permisos/procesos_PyS';
import { CommonsService } from '../../../../_services/commons.service';
import { ComboItem } from '../../../../models/ComboItem';
import { SigaStorageService } from '../../../../siga-storage.service';
import { PersistenceService } from '../../../../_services/persistence.service';

@Component({
  selector: 'app-tarjeta-filtro-compra-productos',
  templateUrl: './tarjeta-filtro-compra-productos.component.html',
  styleUrls: ['./tarjeta-filtro-compra-productos.component.scss']
})
export class TarjetaFiltroCompraProductosComponent implements OnInit {

  msgs: Message[] = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false;

  //Variables buscador
  filtrosCompraProductos: FiltrosCompraProductosItem = new FiltrosCompraProductosItem(); //Guarda los valores seleccionados/escritos en los campos
  categoriasObject: ComboObject = new ComboObject(); //Modelo con la lista opciones + atributo error
  tiposObject: ComboObject = new ComboObject();
  ivasObject: ComboObject = new ComboObject();
  formasPagoObject: ComboObject = new ComboObject();
  estadosFacturaObject: ComboObject = new ComboObject();
  estadosCompraObject: ComboItem[] = [];

  
  //Suscripciones
  subscriptionCategorySelectValues: Subscription;
  subscriptionTypeSelectValues: Subscription;
  subscriptionIvaTypeSelectValues: Subscription;
  subscriptionPayMethodTypeSelectValues: Subscription;

  nombreCliente: string ;
  apellidosCliente: string;
  nifCifCliente: string;

  permisoCompra;
  
  @Output() busqueda = new EventEmitter<boolean>();

  constructor(private translateService: TranslateService, private sigaServices: SigaServices,
    private router: Router, private commonsService: CommonsService, private localStorageService: SigaStorageService,
    private persistenceService: PersistenceService) { }

  ngOnInit() {

    if (sessionStorage.getItem("filtroBusqCompra")) {

      this.filtrosCompraProductos = JSON.parse(sessionStorage.getItem("filtroBusqCompra"));

      if(this.filtrosCompraProductos.fechaSolicitudHasta != undefined){
        this.filtrosCompraProductos.fechaSolicitudHasta = new Date(this.filtrosCompraProductos.fechaSolicitudHasta);
      }
      if(this.filtrosCompraProductos.fechaSolicitudDesde != undefined){
        this.filtrosCompraProductos.fechaSolicitudDesde = new Date(this.filtrosCompraProductos.fechaSolicitudDesde);
      }

      sessionStorage.removeItem("filtroBusqCompra");
      this.busqueda.emit(true);

    } else {

      //En la documentación funcional se pide que por defecto aparezca el campo 
      //con la fecha de dos años antes
      let today = new Date();
      this.filtrosCompraProductos.fechaSolicitudDesde = new Date(new Date().setFullYear(today.getFullYear() - 2));
    }

    if (sessionStorage.getItem("abogado")) {
      let data = JSON.parse(sessionStorage.getItem("abogado"))[0];
      //Si viene de una ficha de censo
      if (data == undefined) {
        let data = JSON.parse(sessionStorage.getItem("abogado"));
        this.filtrosCompraProductos.idpersona = data.idPersona;
        if (data.nombre.includes(",")) {
          this.apellidosCliente = data.nombre.split(",")[1];
        }
        this.nifCifCliente = data.nif;
        this.nombreCliente = data.soloNombre;

      }
      else {
        if (isNaN(data.nif.charAt(0))) {
          this.nombreCliente = data.denominacion;
          this.apellidosCliente = "";
        }
        if (!isNaN(data.nif.charAt(0))) {
          this.nombreCliente = data.nombre;
          this.apellidosCliente = data.apellidos;
        }

        this.filtrosCompraProductos.idpersona = data.idPersona;
        this.nifCifCliente = data.nif;
      }
      sessionStorage.removeItem("abogado");
      sessionStorage.removeItem("buscadorColegiados");

    }
    else if(this.localStorageService.isLetrado){
      this.sigaServices.post("designaciones_searchAbogadoByIdPersona", this.localStorageService.idPersona).subscribe(
        n => {
          let data = JSON.parse(n.body).colegiadoItem;
          this.nombreCliente = data.nombre;
          this.nifCifCliente = data.nif;
          this.filtrosCompraProductos.idpersona = this.localStorageService.idPersona;
        },
        err => {
          this.progressSpinner = false;
        });
    }

    this.getComboCategoria();
    this.getPermisoComprar();
    this.initComboEstadoCompra();
    this.getComboEstadosFactura();
  }

  initComboEstadoCompra(){
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

  searchPersona(){
			sessionStorage.setItem("origin", "newCliente");
			this.router.navigate(['/busquedaGeneral']);
  }

  //Metodo que se lanza al cambiar de valor el combo de categorias, se usa para cargar el combo tipos dependiendo el valor de categorias
  valueChangeCategoria() {
    if (this.filtrosCompraProductos.idCategoria != null) {
      this.getComboTipo();
    } else if (this.filtrosCompraProductos.idCategoria == null) {
      this.filtrosCompraProductos.idTipoProducto = null;
    }
  }

  //Metodo para obtener los valores del combo estadosFactura
  getComboEstadosFactura() {
    this.progressSpinner = true;

    this.subscriptionTypeSelectValues = this.sigaServices.get("PyS_comboEstadosFactura").subscribe(
      TipoSelectValues => {
        this.progressSpinner = false;

        this.estadosFacturaObject = TipoSelectValues.combooItems;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  //Metodo para obtener los valores del combo categoria
  getComboCategoria() {
    this.progressSpinner = true;

    this.subscriptionCategorySelectValues = this.sigaServices.get("tiposProductos_comboProducto").subscribe(
      CategorySelectValues => {
        this.progressSpinner = false;

        this.categoriasObject = CategorySelectValues;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  //Metodo para obtener los valores del combo Tipo segun el combo Categoria
  getComboTipo() {
    this.progressSpinner = true;

    this.subscriptionTypeSelectValues = this.sigaServices.getParam("productosBusqueda_comboTiposMultiple", "?idCategoria=" + this.filtrosCompraProductos.idCategoria).subscribe(
      TipoSelectValues => {
        this.progressSpinner = false;

        this.tiposObject = TipoSelectValues;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }
  


  // Control de fechas
  getFechaHastaCalendar(fechaInputDesde, fechainputHasta) {
    if (
      fechaInputDesde != undefined &&
      fechainputHasta != undefined
    ) {
      let one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      let fechaDesde = new Date(fechaInputDesde).getTime();
      let fechaHasta = new Date(fechainputHasta).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechainputHasta = undefined;
    }
    return fechainputHasta;
  }

  getFechaDesdeCalendar(fechaInputesde, fechaInputHasta) {
    if (
      fechaInputesde != undefined &&
      fechaInputHasta != undefined
    ) {
      let one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      let fechaDesde = new Date(fechaInputesde).getTime();
      let fechaHasta = new Date(fechaInputHasta).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechaInputesde = undefined;
    }
    return fechaInputesde;
  }

  fillFechaSolicitudDesde(event) {
    this.filtrosCompraProductos.fechaSolicitudDesde = event;
  }

  fillFechaSolicitudHasta(event) {
    this.filtrosCompraProductos.fechaSolicitudHasta = event;
  }

  limpiar() {
    this.filtrosCompraProductos = new FiltrosCompraProductosItem();
    if(!this.localStorageService.isLetrado){
      this.nombreCliente = null;
      this.nifCifCliente = null;
      this.filtrosCompraProductos.idpersona = null;
    }
  }

  limpiarCliente(){
    this.nombreCliente = null;
    this.nifCifCliente = null;
    this.filtrosCompraProductos.idpersona = null;
  }

  checkBuscar(){
    if(!this.checkFilters())this.showMessage("error",  this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
    else this.buscar();
  }

  buscar() {
    this.busqueda.emit(true);
  }

  checkFilters(){
    
    if(this.filtrosCompraProductos.idpersona!=null)return true;
    if(this.filtrosCompraProductos.fechaSolicitudDesde != null) return true;
    if(this.filtrosCompraProductos.fechaSolicitudHasta != null) return true;
    if(this.filtrosCompraProductos.nSolicitud != null && this.filtrosCompraProductos.nSolicitud.trim() != "") return true;
    if(this.filtrosCompraProductos.idCategoria != null) return true;
    if(this.filtrosCompraProductos.idTipoProducto != null) return true;
    if(this.filtrosCompraProductos.descProd != null && this.filtrosCompraProductos.descProd.trim() != "") return true;
    if(this.filtrosCompraProductos.idEstadoSolicitud != null) return true;
    if(this.filtrosCompraProductos.idEstadoFactura != null) return true;
    return false;
  }

  checkNuevaCompra(){
    let msg = this.commonsService.checkPermisos(this.permisoCompra, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else this.nuevaCompra();
  }

  nuevaCompra() {
    
    this.progressSpinner = true;

    sessionStorage.removeItem("FichaCompraSuscripcion");
    let nuevaCompra = new FichaCompraSuscripcionItem();
    nuevaCompra.productos = [];
    //Se asigna la persona seleccionada si la hubiera
    if(this.filtrosCompraProductos.idpersona != null){
      nuevaCompra.idPersona = this.filtrosCompraProductos.idpersona;
    }
    this.sigaServices.post('PyS_getFichaCompraSuscripcion', nuevaCompra).subscribe(
      (n) => {
        this.progressSpinner = false;
        sessionStorage.setItem("FichaCompraSuscripcion", n.body);
        this.router.navigate(["/fichaCompraSuscripcion"]);
      },
      (err) => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    );
  }

  getPermisoComprar(){
    this.commonsService
			.checkAcceso(procesos_PyS.fichaCompraSuscripcion)
			.then((respuesta) => {
				this.permisoCompra = respuesta;
			})
			.catch((error) => console.error(error));
  }

  //Inicializa las propiedades necesarias para el dialogo de confirmacion
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

}
