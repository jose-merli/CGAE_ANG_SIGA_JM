import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { ComboObject } from '../../../../models/ComboObject';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { FiltrosSuscripcionesItem } from '../../../../models/FiltrosSuscripcionesItem';
import { procesos_PyS } from '../../../../permisos/procesos_PyS';
import { SigaStorageService } from '../../../../siga-storage.service';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-tarjeta-filtro-cuotas-suscripciones',
  templateUrl: './tarjeta-filtro-cuotas-suscripciones.component.html',
  styleUrls: ['./tarjeta-filtro-cuotas-suscripciones.component.scss']
})
export class TarjetaFiltroCuotasSuscripcionesComponent implements OnInit {

  msgs: Message[] = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false;

  //Variables buscador
  filtrosSuscripciones: FiltrosSuscripcionesItem = new FiltrosSuscripcionesItem(); //Guarda los valores seleccionados/escritos en los campos
  categoriasObject: ComboObject = new ComboObject(); //Modelo con la lista opciones + atributo error
  tiposObject: ComboObject = new ComboObject();
  ivasObject: ComboObject = new ComboObject();
  formasPagoObject: ComboObject = new ComboObject();
  estadosFacturaObject: ComboObject = new ComboObject();
  estadosSuscripcionObject: ComboItem[] = [];

  
  //Suscripciones
  subscriptionCategorySelectValues: Subscription;
  subscriptionTypeSelectValues: Subscription;
  subscriptionIvaTypeSelectValues: Subscription;
  subscriptionPayMethodTypeSelectValues: Subscription;

  nombreCliente: string ;
  apellidosCliente: string;
  nifCifCliente: string;

  permisoSuscripcion: boolean = false;
  
  @Output() busqueda = new EventEmitter<boolean>();

  constructor(private translateService: TranslateService, private sigaServices: SigaServices,
    private router: Router, private commonsService: CommonsService, private localStorageService: SigaStorageService,
    private persistenceService: PersistenceService) { }

  ngOnInit() {

     //En la documentación funcional se pide que por defecto aparezca el campo 
    //con la fecha de dos años antes
    let today = new Date();
    this.filtrosSuscripciones.fechaSolicitudDesde = new Date(new Date().setFullYear(today.getFullYear() - 2));

    if (sessionStorage.getItem("filtroBusqSuscripcion")) {

      this.filtrosSuscripciones = JSON.parse(sessionStorage.getItem("filtroBusqSuscripcion"));

      if(this.filtrosSuscripciones.fechaSolicitudHasta != undefined){
        this.filtrosSuscripciones.fechaSolicitudHasta = new Date(this.filtrosSuscripciones.fechaSolicitudHasta);
      }
      if(this.filtrosSuscripciones.fechaSolicitudDesde != undefined){
        this.filtrosSuscripciones.fechaSolicitudDesde = new Date(this.filtrosSuscripciones.fechaSolicitudDesde);
      }
      if(this.filtrosSuscripciones.aFechaDe != undefined){
        this.filtrosSuscripciones.aFechaDe = new Date(this.filtrosSuscripciones.aFechaDe);
      }

      sessionStorage.removeItem("filtroBusqSuscripcion");
      this.busqueda.emit(true);

    } 

    if(sessionStorage.getItem("abogado")){
      let data = JSON.parse(sessionStorage.getItem("abogado"))[0];
			sessionStorage.removeItem("abogado");

      if (isNaN(data.nif.charAt(0))) {
        this.nombreCliente = data.denominacion;
        this.apellidosCliente = "";
      }
       if (!isNaN(data.nif.charAt(0))) {
        this.nombreCliente = data.nombre;
        this.apellidosCliente = data.apellidos;
      }
	
			this.filtrosSuscripciones.idpersona = data.idPersona;
			this.nifCifCliente = data.nif;
    }
    else if(this.localStorageService.isLetrado){
      this.sigaServices.post("designaciones_searchAbogadoByIdPersona", this.localStorageService.idPersona).subscribe(
				n => {
					let data = JSON.parse(n.body).colegiadoItem;
					this.nombreCliente = data.nombre;
					this.nifCifCliente = data.nif;
          this.filtrosSuscripciones.idpersona = this.localStorageService.idPersona;
				},
				err => {
					this.progressSpinner = false;
				});
    }

    this.getComboCategoria();
    this.getPermisoSuscribir();
    this.initComboEstadoSuscripcion();
    this.getComboEstadosFactura();
  }

  initComboEstadoSuscripcion(){
    //PENDIENTE
    let estadoPendiente = new ComboItem();
    estadoPendiente.label = this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.pendiente");
    estadoPendiente.value = "1";
    this.estadosSuscripcionObject.push(estadoPendiente);
    //DENEGADA
    let estadoDenegada = new ComboItem();
    estadoDenegada.label = this.translateService.instant("facturacion.productos.denegada");
    estadoDenegada.value = "2";
    this.estadosSuscripcionObject.push(estadoDenegada);
    //ACEPTADA
    let estadoAceptada = new ComboItem();
    estadoAceptada.label = this.translateService.instant("facturacion.productos.aceptada");
    estadoAceptada.value = "3";
    this.estadosSuscripcionObject.push(estadoAceptada);
    //ANULACIÓN SOLICITADA
    let estadoAnulacionSolicitada = new ComboItem();
    estadoAnulacionSolicitada.label = this.translateService.instant("facturacion.productos.anulacionSolicitada");
    estadoAnulacionSolicitada.value = "4";
    this.estadosSuscripcionObject.push(estadoAnulacionSolicitada);
    //ANULADA
    let estadoAnulada = new ComboItem();
    estadoAnulada.label = this.translateService.instant("facturacion.productos.anulada");
    estadoAnulada.value = "5";
    this.estadosSuscripcionObject.push(estadoAnulada);
  }

  searchPersona(){
			sessionStorage.setItem("origin", "newCliente");
			this.router.navigate(['/busquedaGeneral']);
  }

  //Metodo que se lanza al cambiar de valor el combo de categorias, se usa para cargar el combo tipos dependiendo el valor de categorias
  valueChangeCategoria() {
    if (this.filtrosSuscripciones.idCategoria != null) {
      this.getComboTipo();
    } else if (this.filtrosSuscripciones.idCategoria == null) {
      this.filtrosSuscripciones.idTipoServicio = null;
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

    this.subscriptionCategorySelectValues = this.sigaServices.get("tiposServicios_comboServicios").subscribe(
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

    this.subscriptionTypeSelectValues = this.sigaServices.getParam("serviciosBusqueda_comboTiposMultiple", "?idCategoria=" + this.filtrosSuscripciones.idCategoria.toString()).subscribe(
      TipoSelectValues => {
        this.progressSpinner = false;

        this.tiposObject = TipoSelectValues;
        this.filtrosSuscripciones.idTipoServicio = [];
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
    this.filtrosSuscripciones.fechaSolicitudDesde = event;
  }

  fillFechaSolicitudHasta(event) {
    this.filtrosSuscripciones.fechaSolicitudHasta = event;
  }

  fillAfechaDeCalendar(event) {
    if (event != null) {
      this.filtrosSuscripciones.aFechaDe = event;
      this.filtrosSuscripciones.idEstadoSolicitud = null;
      // Ignora el error provocado por la estructura de datos de InscripcionesItem
      // @ts-ignore
      // this.filtros.estado = ["1","2"];
      // this.disabledestado = true;
    } else {
      this.filtrosSuscripciones.aFechaDe = null;
    }
  }

  limpiar() {
    this.filtrosSuscripciones = new FiltrosSuscripcionesItem();
    this.limpiarCliente();
  }

  limpiarCliente(){
    this.nombreCliente = null;
    this.nifCifCliente = null;
    this.filtrosSuscripciones.idpersona = null;
  }

  checkBuscar(){
    if(!this.checkFilters()){
      this.showMessage("error",  this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
    }
    else {
      this.buscar();
    }
  }

  buscar() {
    this.busqueda.emit(true);
  }

  checkFilters(){
    
    if(this.filtrosSuscripciones.idpersona!=null)return true;
    if(this.filtrosSuscripciones.fechaSolicitudDesde != null) return true;
    if(this.filtrosSuscripciones.fechaSolicitudHasta != null) return true;
    if(this.filtrosSuscripciones.aFechaDe != null) return true;
    if(this.filtrosSuscripciones.nSolicitud != null && this.filtrosSuscripciones.nSolicitud.trim() != "") return true;
    if(this.filtrosSuscripciones.idCategoria != null) return true;
    if(this.filtrosSuscripciones.idTipoServicio != null) return true;
    if(this.filtrosSuscripciones.descServ != null && this.filtrosSuscripciones.descServ.trim() != "") return true;
    if(this.filtrosSuscripciones.idEstadoSolicitud != null) return true;
    if(this.filtrosSuscripciones.idEstadoFactura != null) return true;
    return false;
  }

  checkNuevaSuscripcion(){
    let msg = this.commonsService.checkPermisos(this.permisoSuscripcion, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } 
    else{
      this.nuevaSuscripcion();
    }
  }

  nuevaSuscripcion() {
    
    this.progressSpinner = true;

    sessionStorage.removeItem("FichaCompraSuscripcion");
    let nuevaSuscripcion = new FichaCompraSuscripcionItem();
    nuevaSuscripcion.servicios = [];
    //Se asigna la persona seleccionada si la hubiera
    if(this.filtrosSuscripciones.idpersona != null){
      nuevaSuscripcion.idPersona = this.filtrosSuscripciones.idpersona;
    }
    this.sigaServices.post('PyS_getFichaCompraSuscripcion', nuevaSuscripcion).subscribe(
      n => {
        this.progressSpinner = false;
        let fichaSuscripcion = JSON.parse(n.body);
        fichaSuscripcion.aFechaDeServicio = this.filtrosSuscripciones.aFechaDe;
        sessionStorage.setItem("FichaCompraSuscripcion", JSON.stringify(fichaSuscripcion));
        this.router.navigate(["/fichaCompraSuscripcion"]);
      },
      error => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        
      }
    );
  }

  getPermisoSuscribir(){
    this.commonsService
			.checkAcceso(procesos_PyS.fichaCompraSuscripcion)
			.then((respuesta) => {
				this.permisoSuscripcion = respuesta;
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

  //Borra el mensaje de notificacion p-growl mostrado en la esquina superior derecha cuando pasas el puntero del raton sobre el
  clear() {
    this.msgs = [];
  }

}
