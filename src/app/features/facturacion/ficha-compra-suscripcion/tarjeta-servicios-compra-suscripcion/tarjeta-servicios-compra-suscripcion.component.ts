import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SortEvent } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { DatosBancariosItem } from '../../../../models/DatosBancariosItem';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { FichaTarjetaPreciosItem } from '../../../../models/FichaTarjetaPreciosItem';
import { FiltrosServicios } from '../../../../models/FiltrosServicios';
import { ListaServiciosItems } from '../../../../models/ListaServiciosItems';
import { ListaServiciosSuscripcionItem } from '../../../../models/ListaServiciosSuscripcionItem';
import { PrecioServicioItem } from '../../../../models/PrecioServicioItem';
import { ServicioDetalleItem } from '../../../../models/ServicioDetalleItem';
import { procesos_PyS } from '../../../../permisos/procesos_PyS';
import { SigaStorageService } from '../../../../siga-storage.service';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-tarjeta-servicios-compra-suscripcion',
  templateUrl: './tarjeta-servicios-compra-suscripcion.component.html',
  styleUrls: ['./tarjeta-servicios-compra-suscripcion.component.scss']
})
export class TarjetaServiciosCompraSuscripcionComponent implements OnInit {

  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga
  showTarjeta: boolean = false;
  esColegiado: boolean = true;

  permisoEditarImporte: boolean = false;
  permisoActualizarServicioSuscripcion: boolean = false;
  showModal: boolean = false;

  colsServs = [
    { field: "categoria", header: "facturacion.productos.categoria" },
    { field: "tipo", header: "facturacion.productos.tipo" },
    { field: "descripcion", header: "facturacion.servicios.servicio" },
    { field: "formapago", header: "facturacion.productos.formapago" },
  ];

  serviciosTarjeta: ListaServiciosSuscripcionItem[] = [];
  comboServicios: ListaServiciosItems[] = [];
  ivaCombo: ComboItem[];
  comboComun: ComboItem[] = []; //Combo de formas de pago comunes
  comboPagos: ComboItem[];

  cols = [
    { field: "orden", header: "administracion.informes.literal.orden" },
    { field: "descripcion", header: "facturacion.servicios.servicio" },
    { field: "automatico", header: "facturacion.productos.tipo" },
    { field: "precioServicioDesc", header: "form.busquedaCursos.literal.precio" },
    { field: "precioServicioValor", header: "facturacion.productos.importeNeto" }, 
    { field: "periodicidadDesc", header: "facturacion.servicios.fichaservicio.periodicidadcoltablaprecios" },
    { field: "iva", header: "facturacion.productos.iva" },
    { field: "fechaAlta", header: "administracion.usuarios.literal.fechaAlta" },
    { field: "fechaBaja", header: "dato.jgr.guardia.inscripciones.fechaBaja" },
    { field: "total", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.total" },
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

  @Input("ficha") ficha: FichaCompraSuscripcionItem;
  @Input("resaltadoDatos") resaltadoDatos: boolean;
  @Output() actualizaFicha = new EventEmitter<Boolean>();
  @ViewChild("servicesTable") tablaServicios;
  @ViewChild("servicesSuscripcionTable") tablaServiciosSuscripcion;

  selectedRows: ListaServiciosSuscripcionItem[] = [];
  numSelectedRows: number = 0; //Se usa para mostrar visualmente el numero de filas seleccionadas
  selectMultipleRows: boolean = true; //Seleccion multiples filas de la tabla
  selectAllRows: boolean = false; //Selecciona todas las filas de la pagina actual de la tabla
  rowsPerPage: number = 10; //Define el numero de filas mostradas por pagina
  first = 0;
  buscadores = [];
  buscadoresServicios = [];


  subscriptionServiciosBusqueda: Subscription;
  sidebarVisibilityChange: Subject<ListaServiciosSuscripcionItem[]> = new Subject<ListaServiciosSuscripcionItem[]>();
  cuentasBanc: ComboItem[] = [];
  selectedPago: string;
  totalUnidades: number;
  datosTarjeta: FichaCompraSuscripcionItem = new FichaCompraSuscripcionItem();
  pagoCabecera: string;
  subscriptionPeriodicidadList: Subscription;
  periodicidadCombo: ComboItem[];
  precioCombo : PrecioServicioItem[];
  disableDown: boolean = true;
  disableUp: boolean = true;
  subscriptionListaPrecios: Subscription;
  comboPrecios: ComboItem[];
  arrayPrecios: FichaTarjetaPreciosItem[];
  // tiposObject: ComboItem[];
  // subscriptionTypeSelectValues: Subscription;

  constructor(public sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef,
    private localStorageService: SigaStorageService,
    private router: Router) {}

  ngOnInit() {
    this.getComboServicios();
    this.getComboPagos();
    this.getPermisoActualizarServicio();
    if(this.ficha.idPersona != null){
      this.cargarDatosBancarios(); //Se buscan las cuentas bancarias asociadas al cliente
    }
    if(this.localStorageService.isLetrado){
      this.esColegiado = true;
    }
    else{
      this.esColegiado = false;
    }
    

    if (this.ficha.fechaPendiente != null) {
      //Se recomenda añadir un procesamiento asincrono
      //mediante promesa de los combos de servicios y combopagos
      this.getServiciosSuscripcion();
    }
    else {
      this.ficha.impTotal = "0";
      this.serviciosTarjeta = this.ficha.servicios;
      if(this.serviciosTarjeta.length>0){
        this.getComboPrecios();
      }
    }
    this.datosTarjeta = this.ficha;
  }

  ngOnDestroy() {
    if (this.subscriptionServiciosBusqueda){
      this.subscriptionServiciosBusqueda.unsubscribe();
    }
    if (this.subscriptionPeriodicidadList){
      this.subscriptionPeriodicidadList.unsubscribe();
    }
    if (this.subscriptionListaPrecios){
      this.subscriptionListaPrecios.unsubscribe();
    }
    // if (this.subscriptionTypeSelectValues){
    //   this.subscriptionTypeSelectValues.unsubscribe();
    // }
  }

  //INICIO SERVICIOS
  getServiciosSuscripcion() {
    this.progressSpinner = true;

    this.subscriptionServiciosBusqueda = this.sigaServices.getParam("PyS_getListaServiciosSuscripcion",
      "?idPeticion=" + this.ficha.nSolicitud+ "&?afechaDe=" + this.ficha.aFechaDeServicio).subscribe(
        listaServiciosSuscripcionDTO => {

          this.serviciosTarjeta = listaServiciosSuscripcionDTO.listaServiciosSuscripcionItems;

          if (listaServiciosSuscripcionDTO.error.code == 200) {
            // this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }

          this.serviciosTarjeta.sort((a, b) => (a.orden > b.orden) ? 1 : -1);

          this.ficha.servicios = JSON.parse(JSON.stringify(this.serviciosTarjeta));
          if (this.ficha.idFormaPagoSeleccionada != null){
            if(this.ficha.servicios[0].noFacturable == "1"){
              let noFacturableItem = new ComboItem();
              noFacturableItem.label =this.translateService.instant("facturacion.productos.noFacturable");
              noFacturableItem.value = "-1";
              this.comboComun.push(noFacturableItem);
              this.selectedPago = "-1";
            }
            else{
              this.selectedPago = this.ficha.idFormaPagoSeleccionada.toString();
              if(this.comboPagos != undefined && this.comboPagos.length > 0 && this.comboServicios.length > 0 && this.ficha.servicios.length >0){
                this.checkFormasPagoComunes(this.serviciosTarjeta);
              }
            }
          }

          for(let servicio of this.serviciosTarjeta){
            //Para incializar los calendarios
            if(servicio.fechaAlta != null){
              servicio.fechaAlta = new Date(servicio.fechaAlta);
            }
            if(servicio.fechaBaja != null){
              servicio.fechaBaja = new Date(servicio.fechaBaja);
            }
          }
          this.newFormaPagoCabecera();
          this.getComboPrecios();

          for(let servicioTarj of this.serviciosTarjeta){
            servicioTarj.impNeto = Number(servicioTarj.impNeto).toFixed(2);
            servicioTarj.precioServicioValor = Number(servicioTarj.precioServicioValor).toFixed(2);
          }

          this.datosTarjeta = this.ficha;

          this.progressSpinner = false;

        },
        err => {
          this.progressSpinner = false;
        }, () => {
          this.progressSpinner = false;
        });;
  }




  getComboPagos() {
    this.progressSpinner = true;

    this.sigaServices.get("productosBusqueda_comboFormaPago").subscribe(
      comboDTO => {

        this.comboPagos = comboDTO.combooItems;
        this.progressSpinner = false;
        if(this.ficha.servicios.length >0 && this.comboServicios.length>0){
          this.checkFormasPagoComunes(this.serviciosTarjeta);
        }

      },
      err => {
        this.progressSpinner = false;
      });
  }


  getComboServicios() {
    this.progressSpinner = true;


    let filtrosServicios: FiltrosServicios = new FiltrosServicios();
    this.sigaServices.post("serviciosBusqueda_busqueda", filtrosServicios).subscribe(
      listaServiciosDTO => {

        if (JSON.parse(listaServiciosDTO.body).error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          // this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        

          //Descomentar esto y comentar el codigo de abajo asignando el valor de comboServicios
          //Si se quiere mostrar unicamente servicios no derogados
          // JSON.parse(listaServiciosDTO.body).listaServiciosItems.forEach(servicio => {
          //   if (servicio.fechabaja == null) {
          //     this.comboServicios.push(servicio);
          //   }
          // });

          this.comboServicios = JSON.parse(listaServiciosDTO.body).listaServiciosItems

          //Apaño temporal ya que si no se hace este reset, la tabla muestra unicamente la primera paginad e servicios
          this.tablaServicios.reset();

          //Se revisan las formas de pago para añadir los "no factuables" y los "No disponible"
          this.comboServicios.forEach(servicio => {
            if (servicio.formapago == null || servicio.formapago == "") {
              if (servicio.noFacturable == "1") {
                servicio.formapago = this.translateService.instant("facturacion.productos.noFacturable");
              }
              else {
                servicio.formapago = this.translateService.instant("facturacion.productos.pagoNoDisponible");
              }
            }
            else {
              if (servicio.noFacturable == "1") {
                servicio.formapago += ", "+this.translateService.instant("facturacion.productos.noFacturable");
              }
            }
          });

          if(this.ficha.fechaPendiente == null && this.ficha.servicios.length > 0){
            this.initServicios();
          }

          if(this.comboPagos != undefined && this.comboPagos.length > 0 && this.serviciosTarjeta.length > 0){
            this.checkFormasPagoComunes(this.serviciosTarjeta);
          }
        }

        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
      });
  }

  updateServiciosPeticion() {
    this.progressSpinner = true;

    let peticion = JSON.parse(JSON.stringify(this.datosTarjeta));
    peticion.servicios = this.serviciosTarjeta;

    this.sigaServices.post("PyS_updateServiciosPeticion", peticion).subscribe(
      n => {

        if (n.status == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          this.ficha.servicios = JSON.parse(JSON.stringify(this.serviciosTarjeta));
          this.actualizaFicha.emit();
        }

        this.progressSpinner = false;

      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      });
  }
  //FIN SERVICIOS

  //INICIO METODOS

  checkSave() {
    let msg = this.commonsService.checkPermisos(this.permisoActualizarServicioSuscripcion, undefined);

    if (msg != null) {
      this.msgs = msg;
    } else if (this.checkCamposObligatorios()) {
      this.showMessage("error", "Error", this.translateService.instant('general.message.camposObligatorios'));
      this.resaltadoDatos = true;
    } else {
      this.updateServiciosPeticion();
    }
  }

  //REVISAR
  checkCamposObligatorios() {
    let campoVacio = false;
    //Comprobacion de campos obligatorios de los servicios
    this.serviciosTarjeta.forEach(el => {
      if (el.idPrecioServicio == null || 
        (el.fechaAlta == null && this.ficha.fechaAceptada!= null) ||
        (el.fechaBaja == null && this.ficha.fechaAnulada!= null)) {
          campoVacio = true;
        }
    })
    //Revision de los campos de forma de pago
    if(this.selectedPago == null || campoVacio || (this.selectedPago =="80" && this.datosTarjeta.cuentaBancSelecc == null)){
      return true;
    }
    return false;
  }

  //En este método se calcula el total de unidades y del importe de cada servicio y se actualiza el valor del importe en la compra si se esta creando nueva.
  checkTotal() {
    let totalNeto = 0;
    let totalIVA = 0;
    let impTotal = 0;
    this.totalUnidades = this.serviciosTarjeta.length;
    this.serviciosTarjeta.forEach(
      el => {
        el.total = ((Number(el.precioServicioValor) * Number(el.periodicidadValor)) * (1 + Number(el.valorIva) / 100)).toFixed(2);
        el.impIva = ((Number(el.precioServicioValor) * Number(el.periodicidadValor)) * (Number(el.valorIva) / 100)).toFixed(2);
        el.impNeto = (Number(el.precioServicioValor) * Number(el.periodicidadValor)).toFixed(2);
        impTotal += Number(el.total);
        totalNeto += Number(el.impNeto);
        totalIVA += Number(el.impIva);
      }
    );
    this.datosTarjeta.totalNeto = totalNeto.toFixed(2);
    this.datosTarjeta.totalIVA = totalIVA.toFixed(2);
    this.datosTarjeta.impTotal = impTotal.toFixed(2);
  }

  openTab(selectedRow: ListaServiciosSuscripcionItem) {
    this.progressSpinner = true;
    let servicioItem: ListaServiciosItems = new ListaServiciosItems();
    servicioItem.idtiposervicios = selectedRow.idTipoServicios;
    servicioItem.idservicio = selectedRow.idServicio;
    servicioItem.idserviciosinstitucion = selectedRow.idServiciosInstitucion;
    sessionStorage.setItem("FichaCompraSuscripcion", JSON.stringify(this.ficha));
    sessionStorage.setItem("origin", "Suscripcion");
    sessionStorage.setItem("servicioBuscador", JSON.stringify(servicioItem));
    this.router.navigate(["/fichaServicios"]);
  }

  anadirServicio(selectedServicio) {
    if(this.serviciosTarjeta.length==1){
      this.showMessage("error",
              "** Limite de servicios por suscripcion",
              "** Solo se admite un servicio por suscripcion"
            );
    }
    else if (this.checkServicioSeleccionado(selectedServicio)) {
      this.showModal = false;
      let newServicio: ListaServiciosSuscripcionItem = new ListaServiciosSuscripcionItem();
      newServicio.cantidad = "1";
      newServicio.descripcion = selectedServicio.descripcion;
      newServicio.orden = (this.serviciosTarjeta.length + 1).toString();
      newServicio.idServicio = selectedServicio.idservicio;
      newServicio.idTipoServicios = selectedServicio.idtiposervicios;
      newServicio.idServiciosInstitucion = selectedServicio.idserviciosinstitucion;
      // newServicio.precioServicioValor = selectedServicio.precioperiodicidad.split(" ")[0];
      // newServicio.precioServicioValor = newServicio.precioServicioValor.replace(",", "."); //para evitar que utilice comas que se procesan de forma erronea
      newServicio.iva = selectedServicio.iva;
      newServicio.valorIva = selectedServicio.valorIva;
      newServicio.idtipoiva = selectedServicio.idtipoiva;
      newServicio.idPeticion = this.ficha.nSolicitud;
      newServicio.automatico = selectedServicio.automatico;
      newServicio.noFacturable = selectedServicio.noFacturable;
      newServicio.solicitarBaja = selectedServicio.solicitarBaja;
      this.serviciosTarjeta.push(newServicio);
      this.checkTotal();
      this.getComboPrecios();
    }

  }

  //para gestionar servicios seleccionados
    initServicios(){
      let i = 1;
      for(let servList of this.serviciosTarjeta){
        let serv = this.comboServicios.find(serv =>
          serv.idservicio == servList.idServicio && serv.idtiposervicios == servList.idTipoServicios && serv.idserviciosinstitucion == servList.idServiciosInstitucion
        )
        servList.cantidad = "1";
        servList.orden = i.toString();
        servList.idPeticion = this.ficha.nSolicitud; 
        
        servList.idServicio = serv.idservicio;
        servList.idTipoServicios = serv.idtiposervicios;
        servList.idServiciosInstitucion = serv.idserviciosinstitucion;
        
        servList.noFacturable = serv.noFacturable;
        i++;
      }
      this.checkTotal();
      this.checkFormasPagoComunes(this.serviciosTarjeta);
      this.getComboPrecios();
    }

  checkServicioSeleccionado(selectedServicio : ListaServiciosItems) {
    if (selectedServicio.formapago != this.translateService.instant("facturacion.servicios.pagoNoDisponible")) {
      
      if (selectedServicio.fechaBajaIva == null) {
        let serviciosLista : ListaServiciosSuscripcionItem[] = JSON.parse(JSON.stringify(this.serviciosTarjeta));

        let newServicio = new ListaServiciosSuscripcionItem();
        newServicio.idServicio = selectedServicio.idservicio;
        newServicio.idServiciosInstitucion = selectedServicio.idserviciosinstitucion;
        newServicio.idTipoServicios = selectedServicio.idtiposervicios;
        newServicio.noFacturable = selectedServicio.noFacturable;
        newServicio.descripcion = selectedServicio.descripcion;

        serviciosLista.push(newServicio);

        if (this.checkFormasPagoComunes(serviciosLista)) {
          let found = this.serviciosTarjeta.find(serv =>
            serv.idServicio == selectedServicio.idservicio && serv.idTipoServicios == selectedServicio.idtiposervicios && serv.idServiciosInstitucion == selectedServicio.idserviciosinstitucion
          )
          if (found == undefined) {
            return true;
          } else {
            this.showMessage("error",
              this.translateService.instant("facturacion.servicios.servicioPresenteLista"),
              this.translateService.instant("facturacion.servicios.servicioPresenteListaDesc")
            );
            return false;
          }
        }
        else{
          return false;
        }
      }
      else {
        this.showMessage("error",
          this.translateService.instant("facturacion.servicios.servicioIvaDerogado"),
          this.translateService.instant("facturacion.servicios.servicioIvaDerogadoDesc"));
        return false;
      }
    }
    else {
      this.showMessage("error",
      this.translateService.instant("servicioSinFormaPago"),
      this.translateService.instant("servicioSinFormaPago"));
      return false;
    }
  }
  
  checkFormasPagoComunes(serviciosLista: ListaServiciosSuscripcionItem[]) {
    let error: boolean = false;


    //Se extrae el atributo y se separan las distintas formas de pago.
    let formasPagoArrays: any[] = [];

    let result = [];

    this.selectedPago = null;

    let serv;
    serviciosLista.forEach(element => {
      serv = this.comboServicios.find(serv =>
        serv.idservicio == element.idServicio && serv.idtiposervicios == element.idTipoServicios && serv.idserviciosinstitucion == element.idServiciosInstitucion
      )
      let idformaspago;
      if(serv.idFormasPago != null){
        idformaspago = serv.idFormasPago.split(",");
      }
      if(serv.noFacturable == "1"){
        if(idformaspago != undefined){
          idformaspago.push("-1");
        }
        else{
          idformaspago = ["-1"];
        }
      }
      formasPagoArrays.push(idformaspago);
    });

    //Se comprueba si todas las filas seleccionadas comparten alguna forma de pago.
    result = formasPagoArrays.shift().filter(function (v) {
      return formasPagoArrays.every(function (a) {
        return a.indexOf(v) !== -1;
      });
    });

    if (result.length > 0) {
      //Comprobamos si las formas de pago comunes se corresponden con 
      //las formas de pago permitidas al usuario ( por internet o por secretaria)
      // Personal del colegio = pago por secretaria ("S"), colegiado = formas de pago por internet ("A").
      //Se hace una excepción con la forma de pago seleccionada anteriormente si es una solicitud pendiente.
      let resultUsu = [];
      for(let idpago of result){
        //"No factuable" se acepta siempre
        if(idpago == "-1"){
          resultUsu.push("-1");
        }
        else{
          let index = serv.idFormasPago.split(",").indexOf(idpago);
          if((this.esColegiado && serv.formasPagoInternet.split(",")[index] == "A") ||
          ((!this.esColegiado && serv.formasPagoInternet.split(",")[index] == "S")) ||
          (serviciosLista[0].noFacturable !="1" && serv.idFormasPago.split(",")[index] == this.ficha.idFormaPagoSeleccionada)){
            resultUsu.push(serv.idFormasPago.split(",")[index]);
          }
        }
      }

      if(resultUsu.length > 0){
        if(this.checkNoFacturable(serviciosLista)){
          for (let pagoComun of resultUsu) {
            let formaPago = this.comboPagos.find(pago => pago.value == pagoComun);
            if (formaPago != undefined) {
              this.comboComun.push(formaPago);
              if(pagoComun == this.ficha.idFormaPagoSeleccionada && this.ficha.servicios[0].noFacturable != "1"){
                this.selectedPago = this.ficha.idFormaPagoSeleccionada;
                this.newFormaPagoCabecera();
              }
            }
          }
          return true;
        }
        else {
          this.msgs = [
            {
              severity: "error",
              summary: this.translateService.instant("facturacion.productos.facturableNoComp"),
              detail: this.translateService.instant("facturacion.productos.facturableNoComp")
            }
          ];
          return false;
        }
      }
      else {
        this.showMessage("error",
          this.translateService.instant("menu.facturacion.noCompatiblePorUsuario"),
          this.translateService.instant("menu.facturacion.noCompatiblePorUsuarioDesc")
        );
        return false;
      }
    }
    else {
      this.showMessage("error",
        this.translateService.instant(
          "facturacion.servicios.ResFormasPagoNoCompatibles"
        ),
        this.translateService.instant(
          "facturacion.servicios.FormasPagoNoCompatibles"
        )
      );
      return false;
    }
  }

  fillFechaBaja(event) {
    if (event != null) {
      this.serviciosTarjeta[0].fechaBaja = event;
      // Ignora el error provocado por la estructura de datos de InscripcionesItem
      // @ts-ignore
      // this.filtros.estado = ["1","2"];
      // this.disabledestado = true;
    } else {
      this.serviciosTarjeta[0].fechaBaja = null;
    }
  }

  fillFechaAlta(event) {
    if (event != null) {
      this.serviciosTarjeta[0].fechaAlta = event;
      // Ignora el error provocado por la estructura de datos de InscripcionesItem
      // @ts-ignore
      // this.filtros.estado = ["1","2"];
      // this.disabledestado = true;
    } else {
      this.serviciosTarjeta[0].fechaAlta = null;
    }
  }

  openHideModal() {
    this.showModal = !this.showModal;
  }

  //Borra el mensaje de notificacion p-growl mostrado en la esquina superior derecha cuando pasas el puntero del raton sobre el
  clear() {
    this.msgs = [];
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

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  cerrarDialog() {
    this.showModal = false;
  }

  //Metodo activado al pulsar sobre el checkbox Seleccionar todo
  onChangeSelectAllRows() {
    if (this.selectAllRows === true) {
      this.selectedRows = this.serviciosTarjeta;
      this.numSelectedRows = this.serviciosTarjeta.length;

      this.checkDisableDown();
      this.checkDisableUp();

    } else {
      this.selectedRows = [];
      this.numSelectedRows = 0;
      this.disableUp = true;
      this.disableDown = true;
    }
  }

  onChangePago(){
    this.newFormaPagoCabecera();
    if(this.selectedPago == "80" && this.ficha.idPersona == null){
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), "** Debe tener un cliente seleccionado para mostrar las cuentas bancarias asociadas");
    }
  }
  newFormaPagoCabecera(){
    if(this.selectedPago != null){
      let pago  = this.comboComun.find( el => el.value==this.selectedPago);
      if(pago != undefined){
        this.pagoCabecera = pago.label.toString();
      }
      else{
        this.pagoCabecera = this.translateService.instant("menu.facturacion.noFacturable");
      }
    }
  }

  getPermisoActualizarServicio() {
    this.commonsService
      .checkAcceso(procesos_PyS.actualizarServicioSuscripcion)
      .then((respuesta) => {
        this.permisoActualizarServicioSuscripcion = respuesta;
      })
      .catch((error) => console.error(error));
  }

  //Metodo para aplicar logica al deseleccionar filas
  onRowUnselect() {
    this.numSelectedRows = this.selectedRows.length;
    this.checkDisableDown();
    this.checkDisableUp();
  }
  //Metodo para aplicar logica al seleccionar filas
  onRowSelect() {
    this.numSelectedRows = this.selectedRows.length;
    this.checkDisableDown();
    this.checkDisableUp();
  }

  checkNoFacturable(servicios: ListaServiciosSuscripcionItem[]) { 
    let i = 0;
    //Se comprueba si todos los servicios seleccionados son no facturables facturables
    for (let serv of servicios) {
      if (serv.noFacturable == "1") i++;
    }

    if (i == 0 || i == servicios.length) {
      this.comboComun = [];
      //Si son todos no facturables
      if (i == servicios.length) {
        let noFacturableItem = new ComboItem();
        noFacturableItem.label = this.translateService.instant("facturacion.servicios.noFacturable");
        noFacturableItem.value = "-1";
        this.comboComun.push(noFacturableItem);
        this.selectedPago = "-1";
      }

      return true;
    }
    else {
      return false;
    }
  }

  getFechaUltFact(){
    //Se quiere obtener la fecha de la ultima factura para determinar la fecha minima para la fecha de baja del servicio
    if(this.ficha.facturas != null && this.ficha.facturas.length > 0){
      let facturaMax = this.ficha.facturas.reduce((prev, current) => (prev.fechaFactura > current.fechaFactura) ? prev : current);

      if(this.ficha.fechaAceptada < new Date(facturaMax.fechaFactura)){
        return new Date(facturaMax.fechaFactura);
      }
      else{
        return new Date(this.ficha.fechaAceptada);
      }
      // return Math.max.apply(Math, this.ficha.facturas.map(function(o) { return o.fechaFactura; }));
    }
    else{
      return new Date(this.ficha.fechaAceptada);
    }
  }

  //Metodo para obtener los valores del combo Tipo segun el combo Categoria
  // getComboTipo() {
  //   this.progressSpinner = true;

  //   this.subscriptionTypeSelectValues = this.sigaServices.get("tiposServicios_comboServicios").subscribe(
  //     TipoSelectValues => {
  //       this.progressSpinner = false;

  //       this.tiposObject = TipoSelectValues;
  //     },
  //     err => {
  //       this.progressSpinner = false;
  //     },
  //     () => {
  //       this.progressSpinner = false;
  //     }
  //   );
  // }

  getComboPrecios(){
    let servicio = new ServicioDetalleItem(); 
    servicio.idservicio = this.serviciosTarjeta[0].idServicio;
    servicio.idtiposervicios = this.serviciosTarjeta[0].idTipoServicios;
    servicio.idserviciosinstitucion = this.serviciosTarjeta[0].idServiciosInstitucion;
    this.subscriptionListaPrecios = this.sigaServices.post("fichaServicio_obtenerPreciosServicio", servicio).subscribe(
      response => {
        this.progressSpinner = false;

        let preciosServicioObject = JSON.parse(response.body);
        this.arrayPrecios = preciosServicioObject.fichaTarjetaPreciosItem;

        if (preciosServicioObject.error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        else{
          this.serviciosTarjeta.forEach(serv => {
            if(serv.automatico == "1"){
              let precioDef = this.arrayPrecios.find(el => 
                el.pordefecto == "1"
              )
              if(precioDef != undefined){
                serv.idPrecioServicio = precioDef.idpreciosservicios.toString();
                serv.precioServicioDesc = precioDef.descripcionprecio;
                serv.precioServicioValor = precioDef.precio;
                serv.periodicidadValor = precioDef.periodicidadValor.toString();//REVISAR
                serv.periodicidadDesc = precioDef.descripcionperiodicidad;
                serv.idPeriodicidad = precioDef.idperiodicidad.toString();
              }
            }
            else{
              this.comboPrecios = [];
              let i = 0;
              serv.idComboPrecio = "0";
              let total = 0;
              this.arrayPrecios.forEach(el =>{
                //Comprobamos la mejor tarifa para la seleccion por defecto
                if(total > ((Number(el.precio) * Number(el.periodicidadValor)) * (1 + Number(serv.valorIva) / 100))){
                  total = ((Number(el.precio) * Number(el.periodicidadValor)) * (1 + Number(serv.valorIva) / 100));
                  serv.idComboPrecio = i.toString();
                }
                let comb = new ComboItem();
                comb.label = el.descripcionprecio;
                comb.value = i.toString();
                this.comboPrecios.push(comb);
                i++;
              })
            }
          })
          this.checkTotal();
        }
        
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  onChangePrecio(rowData : ListaServiciosSuscripcionItem){
    rowData.idPrecioServicio = this.arrayPrecios[rowData.idComboPrecio].idpreciosservicios.toString();
    rowData.precioServicioValor = this.arrayPrecios[rowData.idComboPrecio].precio;
    rowData.periodicidadValor = this.arrayPrecios[rowData.idComboPrecio].periodicidadValor.toString();//REVISAR
    rowData.periodicidadDesc = this.arrayPrecios[rowData.idComboPrecio].descripcionperiodicidad;
    rowData.idPeriodicidad = this.arrayPrecios[rowData.idComboPrecio].idperiodicidad.toString();
    this.checkTotal();
    this.tablaServiciosSuscripcion.reset();
  }

  moveRow(direccion) {
    if (direccion == 'up' && this.selectedRows[0].orden != "1") {
      //Se intercambian los elementos del array correspondientes
      [this.serviciosTarjeta[Number(this.selectedRows[0].orden) - 1], this.serviciosTarjeta[Number(this.selectedRows[0].orden) - 2]] =
        [this.serviciosTarjeta[Number(this.selectedRows[0].orden) - 2], this.serviciosTarjeta[Number(this.selectedRows[0].orden) - 1]];
      //Se asignan los nuevos valores de la columna orden
      let orden = this.selectedRows[0].orden;
      this.serviciosTarjeta[Number(orden) - 2].orden = (Number(orden) - 1) + "";
      this.serviciosTarjeta[Number(orden) - 1].orden = (Number(orden)) + "";
    }
    else if (direccion == 'down' && this.selectedRows[0].orden != this.serviciosTarjeta.length + "") {
      //Se intercambian los elementos del array correspondientes
      [this.serviciosTarjeta[Number(this.selectedRows[0].orden) - 1], this.serviciosTarjeta[Number(this.selectedRows[0].orden)]] =
        [this.serviciosTarjeta[Number(this.selectedRows[0].orden)], this.serviciosTarjeta[Number(this.selectedRows[0].orden) - 1]];
      //Se asignan los nuevos valores de la columna orden
      let orden = this.selectedRows[0].orden;
      this.serviciosTarjeta[Number(orden)].orden = (Number(orden) + 1) + "";
      this.serviciosTarjeta[Number(orden) - 1].orden = (Number(orden)) + "";
    }
  }

  checkDisableUp() {
    if (this.ficha.fechaAceptada != null || this.ficha.fechaDenegada != null) {
      this.disableUp = true;
    }
    else if (this.selectedRows != undefined && this.selectedRows.length == 1) {
      this.disableUp = (this.selectedRows[0].orden == '1');
    }
    else {
      this.disableUp = true;
    }
  }

  checkDisableDown() {
    if (this.ficha.fechaAceptada != null || this.ficha.fechaDenegada != null) {
      this.disableDown = true;
    }
    else if (this.selectedRows != undefined && this.selectedRows.length == 1) {
      this.disableDown =  (Number(this.selectedRows[0].orden) == this.serviciosTarjeta.length);
    }
    else {
      this.disableDown = true;
    }
  }

  cargarDatosBancarios() {

    let peticionBanc = new DatosBancariosItem();

    this.progressSpinner = true;

    peticionBanc.historico = false;
    peticionBanc.idPersona = this.ficha.idPersona;
    peticionBanc.nifTitular = this.ficha.nif;
    this.sigaServices
      .postPaginado("datosBancarios_search", "?numPagina=1", peticionBanc)
      .subscribe(
        data => {
          this.progressSpinner = false;
          for(let cuenta of JSON.parse(data["body"]).datosBancariosItem){
            let newEl = new ComboItem();
            newEl.label = cuenta.ibanFormateado;
            newEl.value = cuenta.idCuenta;
            this.cuentasBanc.push(newEl);
          }
          this.datosTarjeta.cuentaBancSelecc = this.ficha.cuentaBancSelecc;
        },
        error => {
          this.msgs.push({ severity: "error", summary: "", detail: JSON.stringify(JSON.parse(error["error"]).error.description) });
          this.progressSpinner = false;
        }
      );
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode >= 44 && charCode <= 57) {
      return true;
    }
    else {
      return false;
    }

  }

  //FIN METODOS

}
