import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SortEvent } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { DatosBancariosItem } from '../../../../models/DatosBancariosItem';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { FiltrosServicios } from '../../../../models/FiltrosServicios';
import { ListaServiciosItems } from '../../../../models/ListaServiciosItems';
import { ListaServiciosSuscripcionItem } from '../../../../models/ListaServiciosSuscripcionItem';
import { PrecioServicioItem } from '../../../../models/PrecioServicioItem';
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
  esColegiado  = this.localStorageService.isLetrado;

  servicioEditable: boolean = false;
  observacionesEditable: boolean = false;
  cantidadEditable: boolean = false;
  precioUnitarioEditable: boolean = false;
  ivaEditable: boolean = false;
  permisoEditarImporte: boolean = false;
  permisoActualizarServicios;
  showModal: boolean = false;

  colsServs = [
    { field: "categoria", header: "facturacion.servicios.categoria" },
    { field: "tipo", header: "facturacion.servicios.tipo" },
    { field: "descripcion", header: "facturacion.servicios.servicio" },
    { field: "formapago", header: "facturacion.servicios.formapago" },
  ];

  serviciosTarjeta: ListaServiciosSuscripcionItem[] = [];
  comboServicios: ListaServiciosItems[] = [];
  ivaCombo: ComboItem[];
  comboComun: ComboItem[] = []; //Combo de formas de pago comunes
  comboPagos: ComboItem[];

  cols = [
    { field: "orden", header: "administracion.informes.literal.orden" },
    { field: "descripcion", header: "facturacion.servicios.servicio" },
    { field: "automatico", header: "facturacion.servicios.tipo" },
    { field: "impNeto", header: "facturacion.servicios.importeNeto" }, //REVISAR FALTA CAMPO IMPORTE
    { field: "periodo", header: "facturacion.servicios.fichaservicio.periodicidadcoltablaprecios" },
    { field: "iva", header: "facturacion.servicios.iva" },
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
  @Output() actualizaFicha = new EventEmitter<Boolean>();
  @ViewChild("servicesTable") tablaServicios;

  selectedRows: ListaServiciosSuscripcionItem[] = [];
  numSelectedRows: number = 0; //Se usa para mostrar visualmente el numero de filas seleccionadas
  selectMultipleRows: boolean = true; //Seleccion multiples filas de la tabla
  selectAllRows: boolean = false; //Selecciona todas las filas de la pagina actual de la tabla
  rowsPerPage: number = 10; //Define el numero de filas mostradas por pagina
  first = 0;
  buscadores = [];
  buscadoresServicios = [];
  aFechaDe : Date;


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
    this.getPermisoEditarImporte();
    this.getPermisoActualizarServicios();
    this.getComboTipoIva();
    this.getComboPeriodicidad();
    if(this.ficha.idPersona != null){
      this.cargarDatosBancarios(); //Se buscan las cuentas bancarias asociadas al cliente
    }

    if (this.ficha.fechaPendiente != null) {
      //Se recomenda añadir un procesamiento asincrono
      //mediante promesa de los combos de servicios y combopagos
      this.getServiciosSuscripcion();
    }
    else {
      this.ficha.impTotal = "0";
      this.serviciosTarjeta = this.ficha.servicios;
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
    // if (this.subscriptionTypeSelectValues){
    //   this.subscriptionTypeSelectValues.unsubscribe();
    // }
  }

  //INICIO SERVICIOS
  getServiciosSuscripcion() {
    this.progressSpinner = true;

    this.subscriptionServiciosBusqueda = this.sigaServices.getParam("PyS_getListaServiciosSuscripcion",
      "?idPeticion=" + this.ficha.nSolicitud+ "&?afechaDe=" + this.aFechaDe).subscribe(
        listaServiciosSuscripcionDTO => {

          this.serviciosTarjeta = listaServiciosSuscripcionDTO.listaServiciosSuscripcionItems;

          if (listaServiciosSuscripcionDTO.error.code == 200) {
            // this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
          this.checkTotal();

          this.serviciosTarjeta.sort((a, b) => (a.orden > b.orden) ? 1 : -1);

          this.ficha.servicios = JSON.parse(JSON.stringify(this.serviciosTarjeta));
          if (this.ficha.idFormaPagoSeleccionada != null){
            if(this.ficha.servicios[0].noFacturable == "1"){
              let noFacturableItem = new ComboItem();
              noFacturableItem.label =this.translateService.instant("facturacion.servicios.noFacturable");
              noFacturableItem.value = "-1";
              this.comboComun.push(noFacturableItem);
              this.selectedPago = "-1";
            }
            else{
            this.selectedPago = this.ficha.idFormaPagoSeleccionada.toString();
            this.checkFormasPagoComunes(this.serviciosTarjeta);
            }
          }
          this.newFormaPagoCabecera();

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

  getPermisoEditarImporte() {
    this.subscriptionServiciosBusqueda = this.sigaServices.get("PyS_getListaServiciosSuscripcion").subscribe(
      permiso => {
        if (permiso == "S") this.permisoEditarImporte = true;
      },
      err => {
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
      });
  }



  getComboPagos() {
    this.progressSpinner = true;

    this.sigaServices.get("serviciosBusqueda_comboFormaPago").subscribe(
      comboDTO => {

        this.comboPagos = comboDTO.combooItems;
        this.progressSpinner = false;
        if(this.ficha.servicios.length >0){
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
        }

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
              servicio.formapago = this.translateService.instant("facturacion.servicios.noFacturable");
            }
            else {
              servicio.formapago = this.translateService.instant("facturacion.servicios.pagoNoDisponible");
            }
          }
          else {
            if (servicio.noFacturable == "1") {
              servicio.formapago += ", "+this.translateService.instant("facturacion.servicios.noFacturable");
            }
          }
        });

        if(this.ficha.fechaPendiente == null && this.ficha.servicios.length > 0){
          this.initServicios();
        }

        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
      });
  }

  updateServiciosPeticion() {
    this.progressSpinner = true;

    let peticion: FichaCompraSuscripcionItem = new FichaCompraSuscripcionItem();

    this.datosTarjeta.servicios = this.serviciosTarjeta;
    this.sigaServices.post("PyS_updateServiciosPeticion", this.datosTarjeta).subscribe(
      n => {

        if (n.status == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          this.checkTotal();

          this.ficha.servicios = JSON.parse(JSON.stringify(this.serviciosTarjeta));
          //this.actualizaFicha.emit();
          
          this.cantidadEditable = false;
          this.precioUnitarioEditable = false;
          this.ivaEditable = false;
          this.observacionesEditable = false;
        }

        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
      });
  }

  //Metodo para obtener los valores del combo IVA
  getComboTipoIva() {
    this.progressSpinner = true;

    this.sigaServices.get("fichaServicio_comboIvaNoDerogados").subscribe(
      IvaTypeSelectValues => {
        this.progressSpinner = false;

        this.ivaCombo = IvaTypeSelectValues.combooItems;

      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }
  //FIN SERVICIOS

  //INICIO METODOS

  checkSave() {
    let msg = this.commonsService.checkPermisos(this.permisoActualizarServicios, undefined);

    if (msg != null) {
      this.msgs = msg;
    } else if (this.checkCamposObligatorios()) {
      this.showMessage("error", "Error", this.translateService.instant('general.message.camposObligatorios'));
    } else {
      this.updateServiciosPeticion();
    }
  }

  //REVISAR
  checkCamposObligatorios() {
    let campoVacio = false;
    this.serviciosTarjeta.forEach(el => {
      if (el.cantidad == null || el.cantidad.trim() == "" ||
        el.descripcion == null || el.descripcion.trim() == "" ||
        el.idPrecioServicio == null ||
        el.iva == null || el.iva.trim() == "") {
          campoVacio = true;
        }
    })
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
    this.totalUnidades = 1;
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

  openTab(selectedRow) {
    this.progressSpinner = true;
    let servicioItem: ListaServiciosItems = selectedRow;
    sessionStorage.setItem("FichaCompraSuscripcion", JSON.stringify(this.ficha));
    sessionStorage.setItem("origin", "Suscripcion");
    sessionStorage.setItem("servicioBuscador", JSON.stringify(servicioItem));
    this.router.navigate(["/fichaServicios"]);
  }

  anadirServicio(selectedServicio) {
    if (this.checkServicioSeleccionado(selectedServicio)) {
      this.showModal = false;
      let newServicio: ListaServiciosSuscripcionItem = new ListaServiciosSuscripcionItem();
      newServicio.cantidad = "1";
      newServicio.descripcion = selectedServicio.descripcion;
      newServicio.orden = (this.serviciosTarjeta.length + 1).toString();
      newServicio.idServicio = selectedServicio.idservicio;
      newServicio.idTipoServicio = selectedServicio.idtiposervicio;
      newServicio.idServicioInstitucion = selectedServicio.idservicioinstitucion;
      newServicio.precioServicioValor = selectedServicio.precioperiodicidad.split(" ")[0];
      newServicio.precioServicioValor = newServicio.precioServicioValor.replace(",", "."); //para evitar que utilice comas que se procesan de forma erronea
      newServicio.iva = selectedServicio.iva;
      newServicio.valorIva = selectedServicio.valorIva;
      newServicio.idtipoiva = selectedServicio.idtipoiva;
      newServicio.idPeticion = this.ficha.nSolicitud;
      newServicio.noFacturable = selectedServicio.noFacturable;
      newServicio.solicitarBaja = selectedServicio.solicitarBaja;
      this.serviciosTarjeta.push(newServicio);
      this.checkTotal();
    }

  }

    initServicios(){
      let i = 1;
      for(let servList of this.serviciosTarjeta){
        let serv = this.comboServicios.find(serv =>
          serv.idservicio == servList.idServicio && serv.idtiposervicios == servList.idTipoServicio && serv.idserviciosinstitucion == servList.idServicioInstitucion
        )
        servList.cantidad = "1";
        servList.orden = i.toString();
        servList.idPeticion = this.ficha.nSolicitud; 
        servList.precioServicioValor = serv.precioperiodicidad.split(" ")[0];
        servList.precioServicioValor = servList.precioServicioValor.replace(",", "."); //para evitar que utilice comas que se procesan de forma erronea
        servList.noFacturable = serv.noFacturable;
        i++;
      }
      this.checkTotal();
      this.checkFormasPagoComunes(this.serviciosTarjeta);
    }

  checkServicioSeleccionado(selectedServicio) {
    if (selectedServicio.formapago != this.translateService.instant("facturacion.servicios.pagoNoDisponible")) {
      if (selectedServicio.fechaBajaIva == null) {
        let serviciosLista : ListaServiciosSuscripcionItem[] = JSON.parse(JSON.stringify(this.serviciosTarjeta));

        let newServicio = new ListaServiciosSuscripcionItem();
        newServicio.idServicio = selectedServicio.idservicio;
        newServicio.idServicioInstitucion = selectedServicio.idserviciosinstitucion;
        newServicio.idTipoServicio = selectedServicio.idtiposervicios;
        newServicio.noFacturable = selectedServicio.noFacturable;
        newServicio.descripcion = selectedServicio.descripcion;

        serviciosLista.push(newServicio);

        if (this.checkFormasPagoComunes(serviciosLista)) {
          let found = this.serviciosTarjeta.find(serv =>
            serv.idServicio == selectedServicio.idServicio && serv.idTipoServicio == selectedServicio.idTipoServicio && serv.idServicioInstitucion == selectedServicio.idServicioInstitucion
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
        serv.idservicio == element.idServicio && serv.idtiposervicios == element.idTipoServicio && serv.idserviciosinstitucion == element.idServicioInstitucion
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
          (serviciosLista[0].noFacturable =="0" && serv.idFormasPago.split(",")[index] == this.ficha.idFormaPagoSeleccionada)){
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
              if(pagoComun == this.ficha.idFormaPagoSeleccionada && this.ficha.servicios[0].noFacturable == "0"){
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

  openHideModal() {
    this.showModal = !this.showModal;
    this.cantidadEditable = false;
    this.precioUnitarioEditable = false;
    this.ivaEditable = false;
    this.observacionesEditable = false;
  }

  borrarServicio() {
    if (this.selectedRows.length < this.serviciosTarjeta.length) {
      for (let row of this.selectedRows) {
        let index = this.serviciosTarjeta.indexOf(row);
        this.serviciosTarjeta.splice(index, 1);
      }

      //Reasignar valores de orden
      let i = 1;
      for (let serv of this.serviciosTarjeta) {
        serv.orden = i + "";
        i++;
      }
      this.selectedRows = [];
      this.numSelectedRows = 0;
      this.disableDown = true;
      this.disableUp = true;
      this.checkTotal();
      this.checkFormasPagoComunes(this.serviciosTarjeta);
    }
    else {
      this.showMessage("error",
        this.translateService.instant("facturacion.servicios.noBorrarServicios"),
        this.translateService.instant("facturacion.servicios.servNecesario")
      );
    }
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

  getPermisoActualizarServicios() {
    this.commonsService
      //.checkAcceso(procesos_PyS.actualizarServicios)
      .checkAcceso(procesos_PyS.fichaCompraSuscripcion)
      .then((respuesta) => {
        this.permisoActualizarServicios = respuesta;
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

  //Metodo para obtener los valores del combo periodicidad
  getComboPeriodicidad() {
    this.progressSpinner = true;

    this.subscriptionPeriodicidadList = this.sigaServices.get("fichaServicio_comboPeriodicidad").subscribe(
      periodicidadTypeSelectValues => {
        this.progressSpinner = false;

        this.periodicidadCombo = periodicidadTypeSelectValues.combooItems;

      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
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
