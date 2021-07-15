import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../../commons/translate';
import { ComboObject } from '../../../../../models/ComboObject';
import { ListaProductosItems } from '../../../../../models/ListaProductosItems';
import { ProductoDetalleItem } from '../../../../../models/ProductoDetalleItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-detalle-tarjeta-datos-generales-ficha-productos-facturacion',
  templateUrl: './detalle-tarjeta-datos-generales-ficha-productos-facturacion.component.html',
  styleUrls: ['./detalle-tarjeta-datos-generales-ficha-productos-facturacion.component.scss']
})
export class DetalleTarjetaDatosGeneralesFichaProductosFacturacionComponent implements OnInit, OnDestroy {

  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga

  //Variables tarjeta datos generales
  producto: ProductoDetalleItem = new ProductoDetalleItem(); //Guarda los valores seleccionados/escritos en los campos
  productoDelBuscador: ListaProductosItems = new ListaProductosItems(); //Producto obtenido de la fila del buscador de productos en la cual pulsamos el enlace a la ficha productos.
  productoOriginal: ProductoDetalleItem = new ProductoDetalleItem(); //En caso de que entre en modo editar este objeto sera el que contenga los datos originales conseguidos gracias al servicio detalleProducto.
  categoriasObject: ComboObject = new ComboObject(); //Modelo con la lista opciones + atributo error
  tiposObject: ComboObject = new ComboObject();
  tipoCertificadoObject: ComboObject = new ComboObject();
  checkBoxSolicitarPorInternet: boolean = false;
  checkboxSolicitarAnulacionPorInterent: boolean = false;

  //variables de control
  aGuardar: boolean; //Usada en condiciones que validan la obligatoriedad, definida al hacer click en el boton guardar

  //Suscripciones
  subscriptionCategorySelectValues: Subscription;
  subscriptionTypeSelectValues: Subscription;
  subscriptionCrearProductoInstitucion: Subscription;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService) { }

  ngOnInit() {
    if (sessionStorage.getItem('productoBuscador')) {
      this.productoDelBuscador = JSON.parse(sessionStorage.getItem('productoBuscador'));
    }
    this.getComboCategoria();
  }

  //Necesario para liberar memoria
  ngOnDestroy() {
    if (this.subscriptionCategorySelectValues)
      this.subscriptionCategorySelectValues.unsubscribe();
    if (this.subscriptionTypeSelectValues)
      this.subscriptionTypeSelectValues.unsubscribe();
    if (this.subscriptionCrearProductoInstitucion)
      this.subscriptionCrearProductoInstitucion.unsubscribe();
  }

  //INICIO METODOS TARJETA DATOS GENERALES
  //Metodo que se lanza al cambiar de valor el combo de categorias, se usa para cargar el combo tipos dependiendo el valor de categorias
  valueChangeCategoria() {
    console.log(this.producto.categoria);

    if (this.producto.categoria != null) {
      this.getComboTipo();
    } else if (this.producto.categoria == null) {
      this.producto.tipo = null;
    }
  }

  //Metodo que se lanza al marcar/desmarcar el checkbox Solicitar por internet
  onChangeSolicitudInternet() {
    if (this.checkBoxSolicitarPorInternet) {
      this.producto.solicitaralta = '1';
    } else {
      this.producto.solicitaralta = '0';
    }
    console.log(this.producto.solicitaralta);
  }

  //Metodo que se lanza al marcar/desmarcar el checkbox Solicitar anulacion por internet
  onChangesolicitudAnulacionInternet() {
    if (this.checkboxSolicitarAnulacionPorInterent) {
      this.producto.solicitarbaja = '1';
    } else {
      this.producto.solicitarbaja = '0';
    }
    console.log(this.producto.solicitarbaja);
  }

  restablecer() {
    this.producto = this.productoOriginal;
  }

  eliminar() {

  }

  guardar() {
    this.aGuardar = true;
    if (this.producto.categoria != null && this.producto.tipo != null && this.producto.descripcion != '') {
      this.guardarProducto();
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
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
  //FIN METODOS TARJETA DATOS GENERALES

  //INICIO SERVICIOS DATOS GENERALES
  //Metodo para obtener los valores del combo categoria
  getComboCategoria() {
    this.progressSpinner = true;

    this.subscriptionCategorySelectValues = this.sigaServices.get("tiposProductos_comboProducto").subscribe(
      CategorySelectValues => {
        this.progressSpinner = false;

        this.categoriasObject = CategorySelectValues;

        let error = this.categoriasObject.error;
        if (error != null && error.description != null) {
        }
      },
      err => {
        console.log(err);
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

    this.subscriptionCategorySelectValues = this.sigaServices.getParam("productosBusqueda_comboTipos", "?idCategoria=" + this.producto.categoria).subscribe(
      TipoSelectValues => {
        this.progressSpinner = false;

        this.tiposObject = TipoSelectValues;

        let error = this.tiposObject.error;
        if (error != null && error.description != null) {
        }
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  guardarProducto() {
    this.producto.idtipoproducto = Number(this.producto.categoria);
    this.producto.idproducto = Number(this.producto.tipo);
    this.progressSpinner = true;

    if (!sessionStorage.getItem('productoBuscador')) {
      this.subscriptionCrearProductoInstitucion = this.sigaServices.post("fichaProducto_crearProducto", this.producto).subscribe(
        response => {
          this.progressSpinner = false;
          console.log(response);

          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        },
        err => {
          if (err != undefined && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
          //Si se ha guardado se habilita la tarjeta forma pago
        }
      );
    } else if (sessionStorage.getItem('productoBuscador')) {
      this.progressSpinner = false;
      console.log("EDITAR PRODUCTO");
      //EDITAR
    }
  }
  //FIN SERVICIOS DATOS GENERALES
}
