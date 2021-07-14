import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../../commons/translate';
import { ComboObject } from '../../../../../models/ComboObject';
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
  productoOriginal: ProductoDetalleItem; //En caso de que entre en modo editar este objeto sera el que contenga los datos originales conseguidos gracias al servicio detalleProducto.
  categoriasObject: ComboObject = new ComboObject(); //Modelo con la lista opciones + atributo error
  tiposObject: ComboObject = new ComboObject();
  tipoCertificadoObject: ComboObject = new ComboObject();

  //variables de control
  aGuardar: boolean; //Usada en condiciones que validan la obligatoriedad, definida al hacer click en el boton guardar

  //Suscripciones
  subscriptionCategorySelectValues: Subscription;
  subscriptionTypeSelectValues: Subscription;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService) { }

  ngOnInit() {
    this.getComboCategoria();
  }

  //Necesario para liberar memoria
  ngOnDestroy() {
    if (this.subscriptionCategorySelectValues)
      this.subscriptionCategorySelectValues.unsubscribe();
    if (this.subscriptionTypeSelectValues)
      this.subscriptionTypeSelectValues.unsubscribe();
  }

  //INICIO METODOS TARJETA DATOS GENERALES
  //Metodo que se lanza al cambiar de valor el combo de categorias, se usa para cargar el combo tipos dependiendo el valor de categorias
  valueChangeCategoria() {
    /*  console.log(this.producto.categoria);
 
     if (this.producto.categoria != null) {
       this.getComboTipo();
     } else if (this.producto.categoria == null) {
       this.producto.tipo = null;
     } */
  }

  onChangeSolicitudInternet() {

  }

  onChangesolicitudAnulacionInternet() {

  }

  restablecer() {
    this.producto = this.productoOriginal;
  }

  eliminar() {

  }

  guardar() {
    this.aGuardar = true;
    /* if (this.producto.categoria != null && this.producto.tipo != null && this.producto.descripcion != '') {
      console.log("GUARDAR PRODUCTO")
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
    } */
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
  /*  getComboTipo() {
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
   } */
  //FIN SERVICIOS DATOS GENERALES
}
