import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../../commons/translate';
import { ComboObject } from '../../../../../models/ComboObject';
import { ListaServiciosDTO } from '../../../../../models/ListaServiciosDTO';
import { ListaServiciosItems } from '../../../../../models/ListaServiciosItems';
import { ServicioDetalleItem } from '../../../../../models/ServicioDetalleItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-detalle-tarjeta-datos-generales-ficha-servicios-facturacion',
  templateUrl: './detalle-tarjeta-datos-generales-ficha-servicios-facturacion.component.html',
  styleUrls: ['./detalle-tarjeta-datos-generales-ficha-servicios-facturacion.component.scss']
})
export class DetalleTarjetaDatosGeneralesFichaServiciosFacturacionComponent implements OnChanges, OnInit, OnDestroy {

  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga

  //Variables tarjeta datos generales
  @Input() servicio: ServicioDetalleItem; //Guarda los valores seleccionados/escritos en los campos
  servicioOriginal: ServicioDetalleItem = new ServicioDetalleItem; //En caso de que entre en modo editar este objeto sera el que contenga los datos originales conseguidos gracias al servicio detalleServicio.
  @Input() servicioDelBuscador: ListaServiciosItems;
  categoriasObject: ComboObject = new ComboObject(); //Modelo con la lista opciones + atributo error
  tiposObject: ComboObject = new ComboObject();
  condicionesSuscripcionObject: ComboObject = new ComboObject();
  checkBoxPermitirSolicitudPorInternet: boolean = false;
  checkboxPermitirAnulacionPorInternet: boolean = false;
  checkboxAsignacionAutomatica: boolean = false;

  //variables de control
  aGuardar: boolean = false; //Usada en condiciones que validan la obligatoriedad, definida al hacer click en el boton guardar
  desactivarBotonEliminar: boolean = false; //Para activar el boton eliminar/reactivar dependiendo de si estamos en edicion o en creacion de un nuevo producto pero ya hemos guardado.

  //Suscripciones
  subscriptionCategorySelectValues: Subscription;
  subscriptionTypeSelectValues: Subscription;
  subscriptionCrearServicioInstitucion: Subscription;
  subscriptionEditarServicioInstitucion: Subscription;
  subscriptionActivarDesactivarServicios: Subscription;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService, private confirmationService: ConfirmationService, private router: Router) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.servicio.editar) {
      this.getComboTipo();
      this.servicioOriginal = { ...this.servicio };

      this.desactivarBotonEliminar = false;
      //this.mostrarTarjetaFormaPagos.emit(true);

    } else {
      //this.mostrarTarjetaFormaPagos.emit(false);
      this.desactivarBotonEliminar = true;
    }

    if (this.servicio.permitiralta == "1") {
      this.checkBoxPermitirSolicitudPorInternet = true;
    } else if (this.servicio.permitiralta == "0") {
      this.checkBoxPermitirSolicitudPorInternet = false;
    }

    if (this.servicio.permitirbaja == "1") {
      this.checkboxPermitirAnulacionPorInternet = true;
    } else if (this.servicio.permitirbaja == "0") {
      this.checkboxPermitirAnulacionPorInternet = false;
    }
  }

  ngOnInit() {
    this.getComboCategoria();
  }

  //Necesario para liberar memoria
  ngOnDestroy() {
    if (this.subscriptionCategorySelectValues)
      this.subscriptionCategorySelectValues.unsubscribe();
    if (this.subscriptionTypeSelectValues)
      this.subscriptionTypeSelectValues.unsubscribe();
    if (this.subscriptionCrearServicioInstitucion)
      this.subscriptionCrearServicioInstitucion.unsubscribe();
    if (this.subscriptionEditarServicioInstitucion)
      this.subscriptionEditarServicioInstitucion.unsubscribe();

    if (this.subscriptionActivarDesactivarServicios)
      this.subscriptionActivarDesactivarServicios.unsubscribe;
  }

  //INICIO METODOS TARJETA DATOS GENERALES
  //Metodo que se lanza al cambiar de valor el combo de categorias, se usa para cargar el combo tipos dependiendo el valor de categorias IDTIPOSERVICIO = CATEGORIA, IDPSERVICIO= TIPO, IDSERVICIOINSTITUCION = SERVICIO.
  valueChangeCategoria() {
    if (this.servicio.idtiposervicios != null) {
      this.getComboTipo();
    } else if (this.servicio.idtiposervicios == null) {
      this.servicio.idservicio = null;
    }
  }

  //Metodo que se lanza al marcar/desmarcar el checkbox permitir solicitud por internet
  onChangePermitirSolicitudInternet() {
    if (this.checkBoxPermitirSolicitudPorInternet) {
      this.servicio.permitiralta = '1';
    } else {
      this.servicio.permitiralta = '0';
    }
  }

  //Metodo que se lanza al marcar/desmarcar el checkbox permitir anulacion por internet
  onChangePermitirdAnulacionInternet() {
    if (this.checkboxPermitirAnulacionPorInternet) {
      this.servicio.permitirbaja = '1';
    } else {
      this.servicio.permitirbaja = '0';
    }
  }

  //Metodo que se lanza al marcar/desmarcar el checkbox Asignacion automatica
  onChangeAsignacionAutomatica() {

  }

  restablecer() {
    this.servicio = { ...this.servicioOriginal };

    if (this.servicio.permitiralta == "1") {
      this.checkBoxPermitirSolicitudPorInternet = true;
    } else if (this.servicio.permitiralta == "0") {
      this.checkBoxPermitirSolicitudPorInternet = false;
    }

    if (this.servicio.permitirbaja == "1") {
      this.checkboxPermitirAnulacionPorInternet = true;
    } else if (this.servicio.permitirbaja == "0") {
      this.checkboxPermitirAnulacionPorInternet = false;
    }
  }

  guardar() {
    this.aGuardar = true;
    if (this.servicio.idtiposervicios != null && this.servicio.idservicio != null && this.servicio.descripcion != '') {
      this.guardarServicio();
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

  //INICIO SERVICIOS TARJETA DATOS GENERALES
  //INICIO SERVICIOS DATOS GENERALES
  //Metodo para obtener los valores del combo categoria
  getComboCategoria() {
    this.progressSpinner = true;

    this.subscriptionCategorySelectValues = this.sigaServices.get("tiposServicios_comboServicios").subscribe(
      CategorySelectValues => {
        this.categoriasObject = CategorySelectValues;

        //Segun funcional la categoria formacion no se podra usar para crear registros nuevos pero si se podran editar.
        if (!this.servicio.editar) {
          for (var i = 0; i < this.categoriasObject.combooItems.length; i++) {

            if (this.categoriasObject.combooItems[i].value == "5") {

              this.categoriasObject.combooItems.splice(i, 1);
            }
          }

        }

        this.progressSpinner = false;
      },
      err => {
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

    this.subscriptionTypeSelectValues = this.sigaServices.getParam("serviciosBusqueda_comboTipos", "?idCategoria=" + this.servicio.idtiposervicios).subscribe(
      TipoSelectValues => {
        this.tiposObject = TipoSelectValues;

        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  guardarServicio() {
    this.progressSpinner = true;

    if (!this.servicio.editar) {
      this.subscriptionCrearServicioInstitucion = this.sigaServices.post("fichaServicio_crearServicio", this.servicio).subscribe(
        response => {

          if (JSON.parse(response.body).error.code == 500) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          } else {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            this.desactivarBotonEliminar = false;
            //this.mostrarTarjetaFormaPagos.emit(true);
          }

          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
    } else if (this.servicio.editar) {
      this.subscriptionEditarServicioInstitucion = this.sigaServices.post("fichaServicio_editarServicio", this.servicio).subscribe(
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
          this.progressSpinner = false;
        }
      );
    }
  }

  //Metodo para activar/desactivar servicios mediante borrado logico (es decir fechabaja == null esta activo lo contrario inactivo) en caso de que tenga alguna solicitud ya existente, en caso contrario se hara borrado fisico (DELETE)
  eliminarReactivar() {
    let keyConfirmation = "deletePlantillaDoc";
    let mensaje;
    if (this.servicio.fechabaja != null) {
      mensaje = this.translateService.instant("facturacion.maestros.tiposproductosservicios.reactivarconfirm");
    } else if (this.servicio.fechabaja == null) {
      mensaje = this.translateService.instant("messages.deleteConfirmation");
    }

    this.confirmationService.confirm({
      key: keyConfirmation,
      message: mensaje,
      icon: "fa fa-trash-alt",
      accept: () => {
        this.progressSpinner = true;

        let listaServiciosDTO = new ListaServiciosDTO();
        listaServiciosDTO.listaServiciosItems.push(this.servicioDelBuscador);

        this.subscriptionActivarDesactivarServicios = this.sigaServices.post("serviciosBusqueda_activarDesactivar", listaServiciosDTO).subscribe(
          response => {
            if (JSON.parse(response.body).error.code == 500) {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
            } else {
              this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              this.desactivarBotonEliminar = false;
            }
          },
          err => {
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
            sessionStorage.setItem("volver", 'true');
            sessionStorage.removeItem('servicioBuscador');
            this.router.navigate(['/servicios']);
          }
        );
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }
  //FIN SERVICIOS TARJETA DATOS GENERALES

}
