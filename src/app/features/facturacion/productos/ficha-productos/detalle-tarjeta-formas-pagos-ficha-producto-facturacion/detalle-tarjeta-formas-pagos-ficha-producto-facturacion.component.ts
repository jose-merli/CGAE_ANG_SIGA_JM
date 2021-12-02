import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../../commons/translate';
import { ComboObject } from '../../../../../models/ComboObject';
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
  defaultLabelCombosMultiSelect: String = "Seleccionar";
  esColegiado: boolean;

  //Variables control
  aGuardar: boolean = false; //Usada en condiciones que validan la obligatoriedad, definida al hacer click en el boton guardar
  obligatorio: boolean = true; //Usada para establecer como obligatorios o no obligatorios los campos dependiendo de si esta marcado o no el checkbox no facturable

  //Suscripciones
  subscriptionIvasNoDerogablesSelectValues: Subscription;
  subscriptionInternetPayMethodsSelectValues: Subscription;
  subscriptionSecretaryPayMethodsSelectValues: Subscription;
  subscriptionCrearFormasDePago: Subscription;


  constructor(private sigaServices: SigaServices, private translateService: TranslateService, private router: Router) {

  }

  ngOnInit() {
    if (sessionStorage.getItem('esColegiado'))
      this.esColegiado = JSON.parse(sessionStorage.getItem('esColegiado'));

    if (this.producto.editar) {
      this.productoOriginal = { ...this.producto };

      if (this.producto.nofacturable == "1") {
        this.checkboxNoFacturable = true;
        this.obligatorio = false;
      } else if (this.producto.nofacturable == "0") {
        this.checkboxNoFacturable = false;
        this.obligatorio = true;
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
    if (this.subscriptionCrearFormasDePago)
      this.subscriptionCrearFormasDePago.unsubscribe();
  }

  //INICIO METODOS APP
  //Metodo que se lanza al marcar/desmarcar el checkbox No Facturable
  onChangeNoFacturable() {
    if (this.checkboxNoFacturable) {
      this.obligatorio = false;
      this.producto.nofacturable = '1';

      this.producto.valor = "0";
      this.producto.idtipoiva = 3;
      this.producto.formasdepagointernet = null;
      this.producto.formasdepagosecretaria = null;

    } else {
      this.obligatorio = true;
      this.producto.nofacturable = '0';

      this.producto.valor = this.productoOriginal.valor;
      this.producto.idtipoiva = this.productoOriginal.idtipoiva;
      this.producto.formasdepagointernet = this.productoOriginal.formasdepagointernet;
      this.producto.formasdepagosecretaria = this.productoOriginal.formasdepagosecretaria;

    }
  }

  guardar() {
    this.aGuardar = true;
    if (this.obligatorio && this.producto.solicitaralta == '0') {
      if (this.producto.valor != "" && this.producto.idtipoiva != null && this.producto.idtipoiva != undefined && this.producto.formasdepagosecretaria != null && this.producto.formasdepagosecretaria.length > 0) {
        this.guardarFormaPago();
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
      }
    } else if (this.obligatorio && this.producto.solicitaralta == '1') {
      if (this.producto.valor != "" && this.producto.idtipoiva != null && this.producto.idtipoiva != undefined && this.producto.formasdepagosecretaria != null && this.producto.formasdepagosecretaria.length > 0 && this.producto.formasdepagointernet != null && this.producto.formasdepagointernet.length > 0) {
        this.guardarFormaPago();
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
      }
    } else {
      this.guardarFormaPago();
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

  guardarFormaPago() {
    this.progressSpinner = true;
    if (this.producto.formasdepagointernet == null || this.producto.formasdepagointernet == undefined)
      this.producto.formasdepagointernet = [];
    if (this.producto.formasdepagosecretaria == null || this.producto.formasdepagosecretaria == undefined)
      this.producto.formasdepagosecretaria = [];

    this.subscriptionCrearFormasDePago = this.sigaServices.post("fichaProducto_crearFormaDePago", this.producto).subscribe(
      response => {
        this.progressSpinner = false;

        if (response.status == 200) {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        sessionStorage.setItem("volver", 'true');
        sessionStorage.removeItem('productoBuscador');
        this.router.navigate(['/productos']);
        this.progressSpinner = false;
      }
    );

  }
  //FIN SERVICIOS

}
