import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../../commons/translate';
import { ComboObject } from '../../../../../models/ComboObject';
import { ListaProductosItems } from '../../../../../models/ListaProductosItems';
import { ProductoDetalleItem } from '../../../../../models/ProductoDetalleItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-detalle-tarjeta-formas-pagos-ficha-producto-facturacion',
  templateUrl: './detalle-tarjeta-formas-pagos-ficha-producto-facturacion.component.html',
  styleUrls: ['./detalle-tarjeta-formas-pagos-ficha-producto-facturacion.component.scss']
})
export class DetalleTarjetaFormasPagosFichaProductoFacturacionComponent implements OnInit, OnDestroy {
  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga

  //Variables tarjeta Formas de Pago
  @Input() producto: ProductoDetalleItem; //Producto obtenido de la fila del buscador de productos en la cual pulsamos el enlace a la ficha productos.
  productoOriginal: ProductoDetalleItem = new ProductoDetalleItem(); //Necesario para restablecer valores originales
  checkboxNoFacturable: boolean = false;
  ivasNoDerogablesObject: ComboObject = new ComboObject();
  internetPayMethodsObject: ComboObject = new ComboObject();
  secretaryPayMethodsObject: ComboObject = new ComboObject();
  defaultLabelCombosMultiSelect: String = this.translateService.instant("general.boton.seleccionar");

  //Variables control
  aGuardar: boolean = false; //Usada en condiciones que validan la obligatoriedad, definida al hacer click en el boton guardar
  obligatorio: boolean = true; //Usada para establecer como obligatorios o no obligatorios los campos dependiendo de si esta marcado o no el checkbox no facturable

  //Suscripciones
  subscriptionIvasNoDerogablesSelectValues: Subscription;
  subscriptionInternetPayMethodsSelectValues: Subscription;
  subscriptionSecretaryPayMethodsSelectValues: Subscription;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService) {

  }

  ngOnInit() {
    if (sessionStorage.getItem('productoBuscador')) {
      this.productoOriginal = this.producto;

      if (this.producto.nofacturable == "1") {
        this.checkboxNoFacturable = true;
      } else if (this.producto.nofacturable == "0") {
        this.checkboxNoFacturable = false;
      }
    }

    this.getComboTipoIvaNoDerogables();
    this.getComboFormasDePagoInternet();
    this.getComboFormasDePagoSecretaria();
  }

  //Necesario para liberar memoria
  ngOnDestroy() {
    if (this.subscriptionIvasNoDerogablesSelectValues)
      this.subscriptionIvasNoDerogablesSelectValues.unsubscribe();
    if (this.subscriptionInternetPayMethodsSelectValues)
      this.subscriptionInternetPayMethodsSelectValues.unsubscribe();
    if (this.subscriptionSecretaryPayMethodsSelectValues)
      this.subscriptionSecretaryPayMethodsSelectValues.unsubscribe();
  }

  //INICIO METODOS APP
  //Metodo que se lanza al marcar/desmarcar el checkbox No Facturable
  onChangeNoFacturable() {
    if (this.checkboxNoFacturable) {
      this.obligatorio = false;
      this.producto.nofacturable = '1';
      this.producto.valor = "0";
      this.producto.idtipoiva = null;
      this.producto.formasdepagointernet = null;
      this.producto.formasdepagosecretaria = null;

      //FALTAN LAS FORMAS DE PAGO
    } else {
      this.obligatorio = true;

      if (this.productoOriginal.valor != null || this.productoOriginal.valor != "")
        this.producto.valor = this.productoOriginal.valor;

      if (this.productoOriginal.idtipoiva != null || this.productoOriginal != undefined)
        this.producto.idtipoiva = this.productoOriginal.idtipoiva;

      if (this.productoOriginal.formasdepagointernet != null || this.productoOriginal.formasdepagointernet != undefined)
        this.producto.formasdepagointernet = this.productoOriginal.formasdepagointernet;

      if (this.productoOriginal.formasdepagosecretaria != null || this.productoOriginal.formasdepagosecretaria != undefined)
        this.producto.formasdepagosecretaria = this.productoOriginal.formasdepagosecretaria;

      //FALTAN LAS FORMAS DE PAGO
      this.producto.nofacturable = '0';
    }
  }
  //FIN METODOS APP

  //INICIO SERVICIOS
  //Metodo para obtener los valores del combo IVA no derogables
  getComboTipoIvaNoDerogables() {
    this.progressSpinner = true;

    this.subscriptionIvasNoDerogablesSelectValues = this.sigaServices.get("fichaProducto_comboIvaNoDerogados").subscribe(
      IvaNoDerogableTypeSelectValues => {
        this.progressSpinner = false;

        this.ivasNoDerogablesObject = IvaNoDerogableTypeSelectValues;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  //Metodo para obtener los valores del combo Formas de pago aceptadas por internet
  getComboFormasDePagoInternet() {
    this.progressSpinner = true;

    this.subscriptionInternetPayMethodsSelectValues = this.sigaServices.get("fichaProducto_comboFormasDePagoInternet").subscribe(
      InternetPayMethodsSelectValues => {
        this.progressSpinner = false;

        this.internetPayMethodsObject = InternetPayMethodsSelectValues;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  //Metodo para obtener los valores del combo Formas de pago aceptadas en secretaria
  getComboFormasDePagoSecretaria() {
    this.progressSpinner = true;

    this.subscriptionSecretaryPayMethodsSelectValues = this.sigaServices.get("fichaProducto_comboFormasDePagoSecretaria").subscribe(
      SecretaryPayMethodsSelectValues => {
        this.progressSpinner = false;

        this.secretaryPayMethodsObject = SecretaryPayMethodsSelectValues;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  guardar() {

  }
  //FIN SERVICIOS

}
