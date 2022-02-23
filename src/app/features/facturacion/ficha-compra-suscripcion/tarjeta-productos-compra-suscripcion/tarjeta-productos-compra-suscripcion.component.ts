import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SortEvent } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { FiltrosCompraProductosItem } from '../../../../models/FiltrosCompraProductosItem';
import { FiltrosProductos } from '../../../../models/FiltrosProductos';
import { ListaComprasProductosItem } from '../../../../models/ListaComprasProductosItem';
import { ListaProductosCompraItem } from '../../../../models/ListaProductosCompraItem';
import { ListaProductosDTO } from '../../../../models/ListaProductosDTO';
import { ListaProductosItems } from '../../../../models/ListaProductosItems';
import { procesos_PyS } from '../../../../permisos/procesos_PyS';
import { SigaStorageService } from '../../../../siga-storage.service';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';
import { DatosBancariosItem } from '../../../../models/DatosBancariosItem';

@Component({
  selector: 'app-tarjeta-productos-compra-suscripcion',
  templateUrl: './tarjeta-productos-compra-suscripcion.component.html',
  styleUrls: ['./tarjeta-productos-compra-suscripcion.component.scss']
})
export class TarjetaProductosCompraSuscripcionComponent implements OnInit {

  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga
  showTarjeta: boolean = true;

  productoEditable: boolean = false;
  observacionesEditable: boolean = false;
  cantidadEditable: boolean = false;
  precioUnitarioEditable: boolean = false;
  ivaEditable: boolean = false;
  permisoEditarImporte: boolean = false;
  permisoActualizarProductos;
  showModal: boolean = false;

  colsProducts = [
    { field: "categoria", header: "facturacion.productos.categoria" },
    { field: "tipo", header: "facturacion.productos.tipo" },
    { field: "descripcion", header: "facturacion.productos.producto" },
    { field: "formapago", header: "facturacion.productos.formapago" },
  ];

  productosTarjeta: ListaProductosCompraItem[] = [];
  comboProductos: ListaProductosItems[] = [];
  ivaCombo: ComboItem[];
  comboComun: ComboItem[] = [];
  comboPagos: ComboItem[];

  cols = [
    { field: "orden", header: "administracion.informes.literal.orden" },
    { field: "descripcion", header: "facturacion.productos.producto" },
    { field: "observaciones", header: "censo.nuevaSolicitud.observaciones" },
    { field: "precioUnitario", header: "facturacion.productos.precioUnitario" },
    { field: "cantidad", header: "facturacionSJCS.facturacionesYPagos.cantidad" },
    { field: "impNeto", header: "facturacion.productos.importeNeto" },
    { field: "iva", header: "facturacion.productos.iva" },
    { field: "impIva", header: "facturacion.productos.importeIva" },
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
  @Input("esColegiado") esColegiado: boolean;
  @Output() actualizaFicha = new EventEmitter<Boolean>();
  @ViewChild("productsTable") tablaProductos;

  selectedRows: ListaProductosCompraItem[] = [];
  numSelectedRows: number = 0; //Se usa para mostrar visualmente el numero de filas seleccionadas
  selectMultipleRows: boolean = true; //Seleccion multiples filas de la tabla
  selectAllRows: boolean = false; //Selecciona todas las filas de la pagina actual de la tabla
  rowsPerPage: number = 10; //Define el numero de filas mostradas por pagina
  first = 0;
  buscadores = [];
  buscadoresProductos = [];


  subscriptionProductosBusqueda: Subscription;
  sidebarVisibilityChange: Subject<ListaProductosCompraItem[]> = new Subject<ListaProductosCompraItem[]>();
  cuentasBanc: ComboItem[] = [];
  selectedPago: string;
  totalUnidades: number;
  datosTarjeta: FichaCompraSuscripcionItem = new FichaCompraSuscripcionItem();
  pagoCabecera: string;

  constructor(public sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef,
    private localStorageService: SigaStorageService,
    private router: Router) {}

  ngOnInit() {
    this.getComboProductos();
    this.getComboPagos();
    this.getPermisoEditarImporte();
    this.getPermisoActualizarProductos();
    this.getComboTipoIva();
    if(this.ficha.idPersona != null){
      this.cargarDatosBancarios(); //Se buscan las cuentas bancarias asociadas al cliente
    }

    if (this.ficha.fechaPendiente != null) {
      //Se recomenda añadir un procesamiento asincrono
      //mediante promesa de los combos de productos y combopagos
      this.getProductosCompra();
    }
    else {
      this.ficha.impTotal = "0";
      this.productosTarjeta = this.ficha.productos;
    }
    this.datosTarjeta = this.ficha;
  }

  ngOnDestroy() {
    if (this.subscriptionProductosBusqueda){
      this.subscriptionProductosBusqueda.unsubscribe();
    }
  }

  //INICIO SERVICIOS
  getProductosCompra() {
    this.progressSpinner = true;

    this.subscriptionProductosBusqueda = this.sigaServices.getParam("PyS_getListaProductosCompra",
      "?idPeticion=" + this.ficha.nSolicitud).subscribe(
        listaProductosCompraDTO => {

          this.productosTarjeta = listaProductosCompraDTO.listaProductosCompraItems;

          if (listaProductosCompraDTO.error.code == 200) {
            // this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
          this.checkTotal();

          this.productosTarjeta.sort((a, b) => (a.orden > b.orden) ? 1 : -1);

          this.ficha.productos = JSON.parse(JSON.stringify(this.productosTarjeta));
          if (this.ficha.idFormaPagoSeleccionada != null){
            if(this.ficha.productos[0].noFacturable == "1"){
              let noFacturableItem = new ComboItem();
              noFacturableItem.label =this.translateService.instant("facturacion.productos.noFacturable");
              noFacturableItem.value = "-1";
              this.comboComun.push(noFacturableItem);
              this.selectedPago = "-1";
            }
            else{
              this.selectedPago = this.ficha.idFormaPagoSeleccionada.toString();
              if(this.comboPagos != undefined && this.comboPagos.length > 0 && this.comboProductos.length > 0 && this.ficha.productos.length >0){
                this.checkFormasPagoComunes(this.productosTarjeta);
              }
            }
          }
          this.newFormaPagoCabecera();

          for(let productoTarj of this.productosTarjeta){
            productoTarj.impNeto = Number(productoTarj.impNeto).toFixed(2);
            productoTarj.precioUnitario = Number(productoTarj.precioUnitario).toFixed(2);

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
    this.subscriptionProductosBusqueda = this.sigaServices.get("PyS_getListaProductosCompra").subscribe(
      permiso => {
        if (permiso == "S") this.permisoEditarImporte = true;
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
        if(this.ficha.productos.length >0 && this.comboProductos.length>0 && this.productosTarjeta.length > 0){
          this.checkFormasPagoComunes(this.productosTarjeta);
        }

      },
      err => {
        this.progressSpinner = false;
      });
  }


  getComboProductos() {
    this.progressSpinner = true;


    let filtrosProductos: FiltrosProductos = new FiltrosProductos();
    this.sigaServices.post("productosBusqueda_busqueda", filtrosProductos).subscribe(
      listaProductosDTO => {

        if (JSON.parse(listaProductosDTO.body).error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          // this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }

        //Descomentar esto y comentar el codigo de abajo asignando el valor de comboProductos
        //Si se quiere mostrar unicamente productos no derogados
        JSON.parse(listaProductosDTO.body).listaProductosItems.forEach(producto => {
          if (producto.fechabaja == null) {
            this.comboProductos.push(producto);
          }
        });

        // Codigo que muestra tambien los productos derogados
        //this.comboProductos = JSON.parse(listaProductosDTO.body).listaProductosItems

        //Apaño temporal ya que si no se hace este reset, la tabla muestra unicamente la primera paginad e productos
        this.tablaProductos.reset();

        //Se revisan las formas de pago para añadir los "no factuables" y los "No disponible"
        this.comboProductos.forEach(producto => {
          if (producto.formapago == null || producto.formapago == "") {
            if (producto.noFacturable == "1") {
              producto.formapago = this.translateService.instant("facturacion.productos.noFacturable");
            }
            else {
              producto.formapago = this.translateService.instant("facturacion.productos.pagoNoDisponible");
            }
          }
          else {
            if (producto.noFacturable == "1") {
              producto.formapago += ", "+this.translateService.instant("facturacion.productos.noFacturable");
            }
          }
        });

        if(this.ficha.fechaPendiente == null && this.ficha.productos.length > 0){
          this.initProductos();
        }

        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
      });
  }

  updateProductosPeticion() {
    this.progressSpinner = true;

    let peticion: FichaCompraSuscripcionItem = new FichaCompraSuscripcionItem();

    this.datosTarjeta.productos = this.productosTarjeta;
    this.sigaServices.post("PyS_updateProductosPeticion", this.datosTarjeta).subscribe(
      n => {

        if (n.status != 200) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          this.checkTotal();
          if(Number(this.ficha.impTotal)<Number(this.ficha.impAnti)){
            this.ficha.impAnti = Number(this.ficha.impTotal);
          }

          this.ficha.productos = JSON.parse(JSON.stringify(this.productosTarjeta));
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

    this.sigaServices.get("fichaProducto_comboIvaNoDerogados").subscribe(
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
    let msg = this.commonsService.checkPermisos(this.permisoActualizarProductos, undefined);

    if (msg != null) {
      this.msgs = msg;
    } else if (this.checkCamposObligatorios()) {
      this.showMessage("error", "Error", this.translateService.instant('general.message.camposObligatorios'));
    } else {
      this.updateProductosPeticion();
    }
  }

  checkCamposObligatorios() {
    let campoVacio = false;
    this.productosTarjeta.forEach(el => {
      if (el.cantidad == null || el.cantidad.trim() == "" ||
        el.descripcion == null || el.descripcion.trim() == "" ||
        el.precioUnitario == null || el.precioUnitario.trim() == "" ||
        el.iva == null || el.iva.trim() == "") {
          campoVacio = true;
        }
    })
    if(this.selectedPago == null || campoVacio || ((this.selectedPago =="80" || this.selectedPago == '20') && this.datosTarjeta.cuentaBancSelecc == null)){
      return true;
    }
    return false;
  }

  //En este método se calcula el total de unidades y del importe de cada producto y se actualiza el valor del importe en la compra si se esta creando nueva.
  checkTotal() {
    let totalNeto = 0;
    let totalIVA = 0;
    let impTotal = 0;
    this.totalUnidades = 0;
    this.productosTarjeta.forEach(
      el => {
        this.totalUnidades += Number(el.cantidad);
        el.total = ((Number(el.cantidad) * Number(el.precioUnitario)) * (1 + Number(el.valorIva) / 100)).toFixed(2);
        el.impIva = ((Number(el.cantidad) * Number(el.precioUnitario)) * (Number(el.valorIva) / 100)).toFixed(2);
        el.impNeto = (Number(el.cantidad) * Number(el.precioUnitario)).toFixed(2);
        impTotal += Number(el.total);
        totalNeto += Number(el.impNeto);
        totalIVA += Number(el.impIva);
      }
    );
    this.datosTarjeta.totalNeto = totalNeto.toFixed(2);
    this.datosTarjeta.totalIVA = totalIVA.toFixed(2);
    this.datosTarjeta.impTotal = impTotal.toFixed(2);
    this.ficha.impTotal = impTotal.toFixed(2);
  }

  //Se cambia la tabla a su estado editable en todas las columnas que se permitan según el estado 
  //de la ficha y permisos
  changeEditable() {
    if (this.ficha.fechaAceptada == null && this.ficha.fechaDenegada == null) {
      this.cantidadEditable = !this.cantidadEditable;
      if (this.permisoEditarImporte && !this.esColegiado) {
        this.precioUnitarioEditable = !this.precioUnitarioEditable;
        this.ivaEditable = !this.ivaEditable;
      }
    }
    this.observacionesEditable = !this.observacionesEditable;
  }

  openTab(selectedRow) {
    this.progressSpinner = true;
    let productoItem: ListaProductosItems = selectedRow;
    sessionStorage.setItem("FichaCompraSuscripcion", JSON.stringify(this.ficha));
    // sessionStorage.setItem("origin", "Compra");
    sessionStorage.setItem("productoBuscador", JSON.stringify(productoItem));
    this.router.navigate(["/fichaProductos"]);
  }

  anadirProducto(selectedProducto) {
    if (this.checkProductoSeleccionado(selectedProducto)) {
      this.showModal = false;
      let newProducto: ListaProductosCompraItem = new ListaProductosCompraItem();
      newProducto.cantidad = "1";
      newProducto.descripcion = selectedProducto.descripcion;
      newProducto.orden = (this.productosTarjeta.length + 1).toString();
      newProducto.idproducto = selectedProducto.idproducto;
      newProducto.idtipoproducto = selectedProducto.idtipoproducto;
      newProducto.idproductoinstitucion = selectedProducto.idproductoinstitucion;
      newProducto.precioUnitario = selectedProducto.valor.split(" ")[0];
      newProducto.precioUnitario = newProducto.precioUnitario.replace(",", "."); //para evitar que utilice comas que se procesan de forma erronea
      newProducto.iva = selectedProducto.iva;
      newProducto.valorIva = selectedProducto.valorIva;
      newProducto.idtipoiva = selectedProducto.idtipoiva;
      newProducto.idPeticion = this.ficha.nSolicitud;
      newProducto.noFacturable = selectedProducto.noFacturable;
      newProducto.solicitarBaja = selectedProducto.solicitarBaja;
      this.productosTarjeta.push(newProducto);
      this.checkTotal();
    }

  }

    initProductos(){
      let i = 1;
      for(let prodList of this.productosTarjeta){
        let prod = this.comboProductos.find(prod =>
          prod.idproducto == prodList.idproducto && prod.idtipoproducto == prodList.idtipoproducto && prod.idproductoinstitucion == prodList.idproductoinstitucion
        )
        prodList.cantidad = "1";
        prodList.orden = i.toString();
        prodList.idPeticion = this.ficha.nSolicitud; 
        prodList.precioUnitario = prod.valor.split(" ")[0];
        prodList.precioUnitario = prodList.precioUnitario.replace(",", "."); //para evitar que utilice comas que se procesan de forma erronea
        prodList.noFacturable = prod.noFacturable;
        i++;
      }
      this.checkTotal();

      if(this.comboPagos != undefined && this.comboPagos.length > 0 && this.comboProductos != undefined){
        this.checkFormasPagoComunes(this.productosTarjeta);
      }
    }

  checkProductoSeleccionado(selectedProducto) {
    if (selectedProducto.formapago != this.translateService.instant("facturacion.productos.pagoNoDisponible")) {
      if (selectedProducto.fechaBajaIva == null) {
        let productosLista = JSON.parse(JSON.stringify(this.productosTarjeta));

        let newProducto = new ListaProductosCompraItem();
        newProducto.idproducto = selectedProducto.idproducto;
        newProducto.idproductoinstitucion = selectedProducto.idproductoinstitucion;
        newProducto.idtipoproducto = selectedProducto.idtipoproducto;
        newProducto.noFacturable = selectedProducto.noFacturable;
        newProducto.descripcion = selectedProducto.descripcion;

        productosLista.push(newProducto);

        if (this.checkFormasPagoComunes(productosLista)) {
          let found = this.productosTarjeta.find(prod =>
            prod.idproducto == selectedProducto.idproducto && prod.idtipoproducto == selectedProducto.idtipoproducto && prod.idproductoinstitucion == selectedProducto.idproductoinstitucion
          )
          if (found == undefined) {
            return true;
          } else {
            this.showMessage("error",
              this.translateService.instant("facturacion.productos.productoPresenteLista"),
              this.translateService.instant("facturacion.productos.productoPresenteListaDesc")
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
          this.translateService.instant("facturacion.productos.productoIvaDerogado"),
          this.translateService.instant("facturacion.productos.productoIvaDerogadoDesc"));
        return false;
      }
    }
    else {
      this.showMessage("error",
      this.translateService.instant("productoSinFormaPago"),
      this.translateService.instant("productoSinFormaPago"));
      return false;
    }
  }

  checkFormasPagoComunes(productosLista: ListaProductosCompraItem[]) {
    let error: boolean = false;


    //Se extrae el atributo y se separan las distintas formas de pago.
    let formasPagoArrays: any[] = [];

    let result = [];

    this.selectedPago = null;

    let prod;
    productosLista.forEach(element => {
      prod = this.comboProductos.find(prod =>
        prod.idproducto == element.idproducto && prod.idtipoproducto == element.idtipoproducto && prod.idproductoinstitucion == element.idproductoinstitucion
      )
      let idformaspago;
      if(prod.idFormasPago != null){
        idformaspago = prod.idFormasPago.split(",");
      }
      if(prod.noFacturable == "1"){
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

    if (result.length > 0 || this.ficha.idFormaPagoSeleccionada != null) {
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
          let index = prod.idFormasPago.split(",").indexOf(idpago);
          if((this.esColegiado && prod.formasPagoInternet.split(",")[index] == "A") ||
          ((!this.esColegiado && prod.formasPagoInternet.split(",")[index] == "S")) ||
          (productosLista[0].noFacturable =="0" && prod.idFormasPago.split(",")[index] == this.ficha.idFormaPagoSeleccionada)){
            resultUsu.push(prod.idFormasPago.split(",")[index]);
          }
        }
      }

      //Se añade la forma de pago seleccionada en el caso que no añadiera anteriormente
      //Esto para mostrar formas de pago seleccionadas en el pasado o
      //Para los casos en los que los productos han cambiado sus formas de pago despues de 
      //definir su compra
      if(this.ficha.idFormaPagoSeleccionada != null && resultUsu.indexOf(this.ficha.idFormaPagoSeleccionada)  == -1){
        resultUsu.push(this.ficha.idFormaPagoSeleccionada);
      }

      if(resultUsu.length > 0){
        if(this.checkNoFacturable(productosLista)){
          for (let pagoComun of resultUsu) {
            let formaPago = this.comboPagos.find(pago => pago.value == pagoComun);
            if (formaPago != undefined) {
              this.comboComun.push(formaPago);
              if(pagoComun == this.ficha.idFormaPagoSeleccionada && this.ficha.productos[0].noFacturable == "0"){
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
          "facturacion.productos.ResFormasPagoNoCompatibles"
        ),
        this.translateService.instant(
          "facturacion.productos.FormasPagoNoCompatibles"
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

  borrarProducto() {
    if (this.selectedRows.length < this.productosTarjeta.length) {
      for (let row of this.selectedRows) {
        let index = this.productosTarjeta.indexOf(row);
        this.productosTarjeta.splice(index, 1);
      }

      //Reasignar valores de orden
      let i = 1;
      for (let prod of this.productosTarjeta) {
        prod.orden = i + "";
        i++;
      }
      this.selectedRows = [];
      this.numSelectedRows = 0;
      this.checkTotal();
      this.checkFormasPagoComunes(this.productosTarjeta);
    }
    else {
      this.showMessage("error",
        this.translateService.instant("facturacion.productos.noBorrarProductos"),
        this.translateService.instant("facturacion.productos.prodNecesario")
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
      this.selectedRows = this.productosTarjeta;
      this.numSelectedRows = this.productosTarjeta.length;

    } else {
      this.selectedRows = [];
      this.numSelectedRows = 0;
    }
  }

  onChangePago(){
    this.newFormaPagoCabecera();
    if((this.selectedPago == "80" || this.selectedPago == '20') && this.ficha.idPersona == null){
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.incorrect"));
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

  getPermisoActualizarProductos() {
    this.commonsService
    //REVISAR
      //.checkAcceso(procesos_PyS.actualizarProductos)
      .checkAcceso(procesos_PyS.fichaCompraSuscripcion)
      .then((respuesta) => {
        this.permisoActualizarProductos = respuesta;
      })
      .catch((error) => console.error(error));
  }

  //Metodo para aplicar logica al deseleccionar filas
  onRowUnselect() {
    this.numSelectedRows = this.selectedRows.length;
  }
  //Metodo para aplicar logica al seleccionar filas
  onRowSelect() {
    this.numSelectedRows = this.selectedRows.length;
  }

  checkNoFacturable(productos: ListaProductosCompraItem[]) {
    let i = 0;
    //Se comprueba si todos los productos seleccionados son no facturables facturables
    for (let prod of productos) {
      if (prod.noFacturable == "1") i++;
    }

    if (i == 0 || i == productos.length) {
      this.comboComun = [];
      //Si son todos no facturables
      if (i == productos.length) {
        let noFacturableItem = new ComboItem();
        noFacturableItem.label = this.translateService.instant("facturacion.productos.noFacturable");
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

  moveRow(direccion) {
    if (direccion == 'up' && this.selectedRows[0].orden != "1") {
      //Se intercambian los elementos del array correspondientes
      [this.productosTarjeta[Number(this.selectedRows[0].orden) - 1], this.productosTarjeta[Number(this.selectedRows[0].orden) - 2]] =
        [this.productosTarjeta[Number(this.selectedRows[0].orden) - 2], this.productosTarjeta[Number(this.selectedRows[0].orden) - 1]];
      //Se asignan los nuevos valores de la columna orden
      let orden = this.selectedRows[0].orden;
      this.productosTarjeta[Number(orden) - 2].orden = (Number(orden) - 1) + "";
      this.productosTarjeta[Number(orden) - 1].orden = (Number(orden)) + "";
    }
    else if (direccion == 'down' && this.selectedRows[0].orden != this.productosTarjeta.length + "") {
      //Se intercambian los elementos del array correspondientes
      [this.productosTarjeta[Number(this.selectedRows[0].orden) - 1], this.productosTarjeta[Number(this.selectedRows[0].orden)]] =
        [this.productosTarjeta[Number(this.selectedRows[0].orden)], this.productosTarjeta[Number(this.selectedRows[0].orden) - 1]];
      //Se asignan los nuevos valores de la columna orden
      let orden = this.selectedRows[0].orden;
      this.productosTarjeta[Number(orden)].orden = (Number(orden) + 1) + "";
      this.productosTarjeta[Number(orden) - 1].orden = (Number(orden)) + "";
    }
  }

  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  disableUp() {
    if (this.ficha.fechaAceptada != null || this.ficha.fechaDenegada != null) {
      return true;
    }
    else if (this.selectedRows != undefined && this.selectedRows.length == 1) {
      return this.selectedRows[0].orden == '1'
    }
    else {
      return true;
    }
  }

  disableDown() {
    if (this.ficha.fechaAceptada != null || this.ficha.fechaDenegada != null) {
      return true;
    }
    else if (this.selectedRows != undefined && this.selectedRows.length == 1) {
      return Number(this.selectedRows[0].orden) == this.productosTarjeta.length
    }
    else {
      return true;
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
