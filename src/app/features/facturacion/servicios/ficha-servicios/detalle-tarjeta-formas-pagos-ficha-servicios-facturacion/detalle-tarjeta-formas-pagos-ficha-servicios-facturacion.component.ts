import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  checkboxFacturacionProporcionalDiasInscripcion: boolean = false;
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

  constructor(private sigaServices: SigaServices, private translateService: TranslateService, private router: Router) { }

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

      if (this.servicio.facturacionponderada == "1") {
        this.checkboxFacturacionProporcionalDiasInscripcion = true;
      } else if (this.servicio.facturacionponderada == "0") {
        this.checkboxFacturacionProporcionalDiasInscripcion = false;
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

  onChangeFacturacionProporcionalDiasInscripcion() {
    if (this.checkboxFacturacionProporcionalDiasInscripcion) {
      this.servicio.facturacionponderada = '1';
    } else {
      this.servicio.facturacionponderada = "0";
    }
  }

  onChangeAplicacionPrecioRadioButtons(event) {

  }

  restablecer() {
    this.servicio = { ...this.servicioOriginal };

    if (this.servicioOriginal.nofacturable = "1") {
      this.checkboxNoFacturable = true;
      this.onChangeNoFacturable();
    } else if (this.servicioOriginal.nofacturable = "0") {
      this.checkboxNoFacturable = false;
      this.onChangeNoFacturable;
    }

    if (this.servicioOriginal.facturacionponderada = "1") {
      this.checkboxFacturacionProporcionalDiasInscripcion = true;
    } else if (this.servicioOriginal.facturacionponderada = "0") {
      this.checkboxFacturacionProporcionalDiasInscripcion = false;
    }
  }

  guardar() {
    this.aGuardar = true;
    if (this.obligatorio && this.servicio.permitiralta == '0') {
      if (this.servicio.idtipoiva != null && this.servicio.idtipoiva != undefined && this.servicio.formasdepagosecretaria != null && this.servicio.formasdepagosecretaria.length > 0) {
        this.guardarFormaPago();
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
      }
    } else if (this.obligatorio && this.servicio.permitiralta == '1') {
      if (this.servicio.idtipoiva != null && this.servicio.idtipoiva != undefined && this.servicio.formasdepagosecretaria != null && this.servicio.formasdepagosecretaria.length > 0 && this.servicio.formasdepagointernet != null && this.servicio.formasdepagointernet.length > 0) {
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
    if (this.servicio.formasdepagointernet == null || this.servicio.formasdepagointernet == undefined)
      this.servicio.formasdepagointernet = [];
    if (this.servicio.formasdepagosecretaria == null || this.servicio.formasdepagosecretaria == undefined)
      this.servicio.formasdepagosecretaria = [];

    this.subscriptionCrearFormasDePago = this.sigaServices.post("fichaServicio_crearFormaDePago", this.servicio).subscribe(
      response => {
        this.progressSpinner = false;

        if (JSON.parse(response.body).error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        sessionStorage.setItem("volver", 'true');
        sessionStorage.removeItem('servicioBuscador');
        this.router.navigate(['/servicios']);
        this.progressSpinner = false;
      }
    );

  }
  //FIN SERVICIOS
}
