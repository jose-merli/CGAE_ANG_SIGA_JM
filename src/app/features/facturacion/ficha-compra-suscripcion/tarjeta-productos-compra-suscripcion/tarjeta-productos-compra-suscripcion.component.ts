import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../commons/translate';
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

@Component({
  selector: 'app-tarjeta-productos-compra-suscripcion',
  templateUrl: './tarjeta-productos-compra-suscripcion.component.html',
  styleUrls: ['./tarjeta-productos-compra-suscripcion.component.scss']
})
export class TarjetaProductosCompraSuscripcionComponent implements OnInit {

  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga
  showTarjeta: boolean = false;
  esColegiado: boolean = this.localStorageService.isLetrado;

  productoEditable: boolean = false;
  observacionesEditable: boolean = false;
  cantidadEditable: boolean = false;
  precioUnitarioEditable: boolean = false;
  ivaEditable: boolean = false;
  permisoEditarImporte: boolean = false;
  permisoActualizarProductos;
  showModal: boolean = false;
  @Input("comboComun") comboComun: any[];

  colsProducts = [
    { field: "categoria", header: "facturacion.productos.categoria" },
    { field: "tipo", header: "facturacion.productos.tipo" },
    { field: "descripcion", header: "facturacion.productos.producto" },
    { field: "formapago", header: "facturacion.productos.formapago" },
  ];

  listaProductosCompraFicha: ListaProductosCompraItem[] = [];
  comboProductos : ListaProductosItems[] = [];
  newComboComun = [];

  cols = [
    { field: "orden", header: "administracion.informes.literal.orden" },
    { field: "descripcion", header: "facturacion.productos.producto" },
    { field: "observaciones", header: "censo.nuevaSolicitud.observaciones" },
    { field: "cantidad", header: "facturacionSJCS.facturacionesYPagos.cantidad" },
    { field: "precioUnitario", header: "facturacion.productos.precioUnitario" },
    { field: "iva", header: "facturacion.productos.iva" },
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

  selectedRows: ListaProductosCompraItem[] = [];
  numSelectedRows: number = 0; //Se usa para mostrar visualmente el numero de filas seleccionadas
  selectMultipleRows: boolean = true; //Seleccion multiples filas de la tabla
  selectAllRows: boolean = false; //Selecciona todas las filas de la pagina actual de la tabla
  rowsPerPage: number = 10; //Define el numero de filas mostradas por pagina
  first = 0;
  buscadores = [];

  //Suscripciones
  subscriptionProductosBusqueda: Subscription;

  constructor(public sigaServices: SigaServices, 
    private commonsService: CommonsService, 
    private translateService: TranslateService, 
    private cdRef: ChangeDetectorRef,
    private localStorageService: SigaStorageService,
    private router : Router) { }

  ngOnInit() {
    this.getProductosCompra();
    this.getPermisoEditarImporte();
    this.getComboProductos();
    this.getPermisoActualizarProductos();
  }

  ngOnDestroy() {
    if (this.subscriptionProductosBusqueda)
      this.subscriptionProductosBusqueda.unsubscribe();
  }

  checkSave(){
    let msg = this.commonsService.checkPermisos(this.permisoActualizarProductos, undefined);

    if (msg != null) {
      this.msgs = msg;
    }  else {
      this.updateProductosPeticion();
		}
  }

  //INICIO SERVICIOS
  getProductosCompra() {
    this.progressSpinner = true;

    this.subscriptionProductosBusqueda = this.sigaServices.getParam("PyS_getListaProductosCompra",
    "?idPeticion=" + this.ficha.nSolicitud).subscribe(
      listaProductosCompraDTO => {

        this.listaProductosCompraFicha = listaProductosCompraDTO.listaProductosCompraItems;

        if (listaProductosCompraDTO.error.code == 200) {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.checkTotal();

        this.listaProductosCompraFicha.sort((a, b) => (a.orden > b.orden) ? 1 : -1);

        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
      });;
  }

  getPermisoEditarImporte(){
    this.subscriptionProductosBusqueda = this.sigaServices.get("PyS_getListaProductosCompra").subscribe(
      permiso => {
        if(permiso=="S") this.permisoEditarImporte = true;
      },
      err => {
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
      });;
  }

  getComboProductos(){
    this.progressSpinner = true;


    let filtrosProductos: FiltrosProductos = new FiltrosProductos();
    this.sigaServices.post("productosBusqueda_busqueda", filtrosProductos).subscribe(
      listaProductosDTO => {

        if (JSON.parse(listaProductosDTO.body).error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }

        JSON.parse(listaProductosDTO.body).listaProductosItems.forEach(producto => {
          if (producto.fechabaja == null) {
            this.comboProductos.push(producto);
          }
        });

        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
      });
  }

  updateProductosPeticion(){
    this.progressSpinner = true;

    let peticion: FichaCompraSuscripcionItem = new FichaCompraSuscripcionItem();

    peticion = this.ficha;
    peticion.productos = this.listaProductosCompraFicha;
    this.sigaServices.post("PyS_updateProductosPeticion", peticion).subscribe(
      n => {

        if (n.status == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }

        this.actualizaFicha.emit();
        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
      });
  }
  //FIN SERVICIOS

  //INICIO METODOS
  checkTotal(){
    this.listaProductosCompraFicha.forEach(
      el =>{
        el.total = ((Number(el.cantidad)*Number(el.precioUnitario))*(1 + Number(el.iva)/100)).toString()
      }
    );
  }

  changeEditable(){
    if(this.ficha.fechaAceptada == null && this.ficha.fechaDenegada == null){
      this.productoEditable = !this.productoEditable;
      this.cantidadEditable = !this.cantidadEditable;
      if(this.permisoEditarImporte){
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
    sessionStorage.setItem("origin", "Cliente"); 
    sessionStorage.setItem("productoBuscador", JSON.stringify(productoItem));
    this.router.navigate(["/fichaProductos"]);
  }

  anadirProducto(selectedProducto){
    let found = this.listaProductosCompraFicha.find( prod => 
      prod.idproducto == selectedProducto.idproducto && prod.idtipoproducto == selectedProducto.idtipoproducto && prod.idproductoinstitucion == selectedProducto.idproductoinstitucion
    ) 
    if(found == null){
      this.showModal = false;
      let newProducto: ListaProductosCompraItem = new ListaProductosCompraItem();
      newProducto.cantidad = "1";
      newProducto.descripcion = selectedProducto.descripcion;
      newProducto.orden = (this.listaProductosCompraFicha.length+1).toString();
      newProducto.idproducto = selectedProducto.idproducto;
      newProducto.idtipoproducto = selectedProducto.idtipoproducto;
      newProducto.idproductoinstitucion = selectedProducto.idproductoinstitucion;
      newProducto.precioUnitario = selectedProducto.valor.split(" ")[0];
      newProducto.precioUnitario = newProducto.precioUnitario.replace(",", "."); //para evitar que utilice comas que se procesan de forma erronea
      newProducto.iva = selectedProducto.iva.split("%")[0];
      newProducto.idPeticion = this.ficha.nSolicitud;
      newProducto.noFacturable = selectedProducto.noFacturable;
      this.listaProductosCompraFicha.push(newProducto);
      this.checkTotal();
    }
    else{
      this.msgs = [
        {
          severity: "error",
          summary: "****Producto ya presente en la lista",
          detail: "***El producto seleccionado ya está presente en la solicitud"
        }
      ];
    }
  }

  checkFormasPagoComunes(selectedProducto){
    let error: boolean = false;

    let productosLista = JSON.parse(JSON.stringify(this.listaProductosCompraFicha));

    let newProducto = new ListaProductosCompraItem();
    newProducto.idproducto = selectedProducto.idproducto;
    newProducto.idproductoinstitucion = selectedProducto.idproductoinstitucion;
    newProducto.idtipoproducto = selectedProducto.idtipoproducto;
    newProducto.noFacturable = selectedProducto.noFacturable;

    productosLista.push(newProducto);

    //Se extrae el atributo y se separan las distintas formas de pago.
    let formasPagoArrays: any[]= [];
    
    productosLista.forEach(element => {
      let prod = this.comboProductos.find( prod => 
        prod.idproducto == element.idproducto && prod.idtipoproducto == element.idtipoproducto && prod.idproductoinstitucion == element.idproductoinstitucion
      ) 
      if(prod.formapago!="" && prod.formapago != null){ 
        if(element.noFacturable=="1") formasPagoArrays.push(prod.formapago.split(", ").push("No facturable"));
        else formasPagoArrays.push(prod.formapago.split(", "));
      }
      else if(element.noFacturable=="1")formasPagoArrays.push("No facturable");
      else{
        this.msgs = [
          {
            severity: "error",
            summary: "Producto con forma de pago no definida",
            detail: "El producto '"+element.descripcion+"' no tiene forma de pago definida y no tiene la propieda de 'No facturable' por lo que no se puede realizar su compra"
          }
        ];
        error = true;
      }
    });

    let result = [];
    
    if(!error){
      //Se comprueba si todas las filas seleccionadas comparten alguna forma de pago.
      result = formasPagoArrays.shift().filter(function(v) {
        return formasPagoArrays.every(function(a) {
            return a.indexOf(v) !== -1;
        });
      });
    }
    if(result.length>0){
      this.newComboComun = result;
      this.anadirProducto(selectedProducto);
    }
    else {
      this.msgs = [
        {
          severity: "error",
          summary: this.translateService.instant(
            "facturacion.productos.ResFormasPagoNoCompatibles"
          ),
          detail: this.translateService.instant(
            "facturacion.productos.FormasPagoNoCompatibles"
          )
        }
      ];
    }
  }

  openHideModal(){
    this.showModal = !this.showModal;
  }

  borrarProducto(){
    if(this.selectedRows.length<this.listaProductosCompraFicha.length){
      for(let row of this.selectedRows){
        let index = this.listaProductosCompraFicha.indexOf(row);
        this.listaProductosCompraFicha.splice(index, 1);
      }

    //Reasignar valores de orden
    let i = 1;
      for(let prod of this.listaProductosCompraFicha){
        prod.orden = i+"";
        i++;
      }
    }
    else{
      this.msgs = [
        {
          severity: "error",
          summary: "***No puede borrar todos los productos",
          detail: "****Debe haber por lo menos un productos en la solicitud de compra"
        }
      ];
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

  onHideTarjeta(){
    this.showTarjeta = !this.showTarjeta;
  }

  cerrarDialog() {
    this.showModal = false;
  }

  //Metodo activado al pulsar sobre el checkbox Seleccionar todo
  onChangeSelectAllRows() {
    if (this.selectAllRows === true) {
      this.selectedRows = this.listaProductosCompraFicha;
      this.numSelectedRows = this.listaProductosCompraFicha.length;

    } else {
      this.selectedRows = [];
      this.numSelectedRows = 0;
    }
  }

  getPermisoActualizarProductos(){
    this.commonsService
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
  //FIN METODOS
}
