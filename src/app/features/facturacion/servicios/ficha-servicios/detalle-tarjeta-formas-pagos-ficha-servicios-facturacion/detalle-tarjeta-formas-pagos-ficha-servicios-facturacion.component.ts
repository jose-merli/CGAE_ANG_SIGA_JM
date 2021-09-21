import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../../commons/translate';
import { ComboObject } from '../../../../../models/ComboObject';
import { ServicioDetalleItem } from '../../../../../models/ServicioDetalleItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-detalle-tarjeta-formas-pagos-ficha-servicios-facturacion',
  templateUrl: './detalle-tarjeta-formas-pagos-ficha-servicios-facturacion.component.html',
  styleUrls: ['./detalle-tarjeta-formas-pagos-ficha-servicios-facturacion.component.scss']
})
export class DetalleTarjetaFormasPagosFichaServiciosFacturacionComponent implements OnInit, OnDestroy {
  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga

  //Variables tarjeta Formas de Pago
  @Input() servicio: ServicioDetalleItem; //Servicio obtenido de la fila del buscador de servicios en la cual pulsamos el enlace a la ficha servicios.
  servicioOriginal: ServicioDetalleItem = new ServicioDetalleItem(); //Necesario para restablecer valores originales
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

  constructor(private sigaServices: SigaServices, private translateService: TranslateService) { }

  ngOnInit() {
    if (sessionStorage.getItem('esColegiado'))
      this.esColegiado = JSON.parse(sessionStorage.getItem('esColegiado'));

    if (this.servicio.editar) {
      this.servicioOriginal = { ...this.servicio };

      if (this.servicio.nofacturable == "1") {
        this.checkboxNoFacturable = true;
        this.obligatorio = false;
      } else if (this.servicio.nofacturable == "0") {
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
  }

  //INICIO METODOS APP
  //Metodo que se lanza al marcar/desmarcar el checkbox No Facturable
  onChangeNoFacturable() {
    if (this.checkboxNoFacturable) {
      this.obligatorio = false;
      this.servicio.nofacturable = '1';

      this.servicio.idtipoiva = 3;
      this.servicio.formasdepagointernet = null;
      this.servicio.formasdepagosecretaria = null;

    } else {
      this.obligatorio = true;
      this.servicio.nofacturable = '0';

      this.servicio.idtipoiva = this.servicioOriginal.idtipoiva;
      this.servicio.formasdepagointernet = this.servicioOriginal.formasdepagointernet;
      this.servicio.formasdepagosecretaria = this.servicioOriginal.formasdepagosecretaria;

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
  //FIN SERVICIOS
}
