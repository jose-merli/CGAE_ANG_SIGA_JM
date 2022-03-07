import { AfterViewChecked, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../../commons/translate';
import { BorrarSuscripcionItem } from '../../../../../models/BorrarSuscripcionBajaItem';
import { CodigosPorInstitucionObject } from '../../../../../models/codigosPorInstitucionObject';
import { ComboObject } from '../../../../../models/ComboObject';
import { ListaServiciosDTO } from '../../../../../models/ListaServiciosDTO';
import { ListaServiciosItems } from '../../../../../models/ListaServiciosItems';
import { ServicioDetalleItem } from '../../../../../models/ServicioDetalleItem';
import { procesos_PyS } from '../../../../../permisos/procesos_PyS';
import { CommonsService } from '../../../../../_services/commons.service';
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
  checkboxDialogServicioAutomaticoAManual: boolean = false;
  listaCodigosPorInstitucionObject: CodigosPorInstitucionObject;
  @Output() mostrarTarjetaFormaPagos = new EventEmitter<boolean>();
  @Output() mostrarTarjetaPrecios = new EventEmitter<boolean>();
  @Output() getInfo = new EventEmitter<any>();
  //Variables Dialog Borrar Suscripciones y bajas
  borrarSuscripcionBajaItem: BorrarSuscripcionItem = new BorrarSuscripcionItem;
  showModalSuscripcionesBajas = false; //Muestra o no muestra el dialogo de suscripciones o bajas
  showModalServicioAutomaticoAManual: boolean = false;
  checkboxIncluirSolBajasManuales: boolean = false;

  //variables de control
  aGuardar: boolean = false; //Usada en condiciones que validan la obligatoriedad, definida al hacer click en el boton guardar
  desactivarBotonEliminar: boolean = false; //Para activar el boton eliminar/reactivar dependiendo de si estamos en edicion o en creacion de un nuevo producto pero ya hemos guardado.

  //Permisos
  permisoGuardarServicios: boolean;
  permisoEliminarReactivarServicios: boolean;
  permisoNuevaCondicion: boolean;
  permisoEliminarSuscripcionBaja: boolean;

  //Suscripciones
  subscriptionCategorySelectValues: Subscription;
  subscriptionTypeSelectValues: Subscription;
  subscriptionCrearServicioInstitucion: Subscription;
  subscriptionEditarServicioInstitucion: Subscription;
  subscriptionActivarDesactivarServicios: Subscription;
  subscriptionCodesByInstitution: Subscription;
  subscriptionBorrarSuscripcionesBajas: Subscription;
  subscriptionCondicionesSelect: Subscription;

  constructor(private commonsService: CommonsService, private sigaServices: SigaServices, private translateService: TranslateService, private confirmationService: ConfirmationService, private router: Router) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.servicio.editar) {
      this.getComboTipo();
   
      this.servicioOriginal = { ...this.servicio };

      this.desactivarBotonEliminar = false;
      this.mostrarTarjetaFormaPagos.emit(true);

    } else {
  
      this.mostrarTarjetaFormaPagos.emit(false);
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

    if (this.servicio.automatico == "1") {
      this.checkboxAsignacionAutomatica = true;
    } else if (this.servicio.automatico == "0") {
      this.checkboxAsignacionAutomatica = false;
    }
  }

  ngOnInit() {
    this.checkPermisos();

    this.getComboCategoria();
    this.getComboCondicionSuscripcion();
    this.obtenerCodigosPorColegio();

    sessionStorage.removeItem("servicioDetalle");
  }

  checkPermisos(){
    this.getPermisoGuardarServicios();
    this.getPermisoEliminarReactivarServicios();
    this.getPermisoNuevaCondicion();
    this.getPermisosEliminarSuscripcionBaja();
  }

  getPermisoGuardarServicios() {
    this.commonsService
      .checkAcceso(procesos_PyS.guardarServicios)
        .then((respuesta) => {
          this.permisoGuardarServicios = respuesta;
    })
    .catch((error) => console.error(error));
  }

  getPermisoEliminarReactivarServicios() {
    this.commonsService
      .checkAcceso(procesos_PyS.eliminarReactivarServicios)
        .then((respuesta) => {
          this.permisoEliminarReactivarServicios = respuesta;
    })
    .catch((error) => console.error(error));
  }

  getPermisosEliminarSuscripcionBaja() {
    this.commonsService
      .checkAcceso(procesos_PyS.eliminarSuscripcionesBajas)
        .then((respuesta) => {
          this.permisoEliminarSuscripcionBaja = respuesta;
    })
    .catch((error) => console.error(error));
  }

  getPermisoNuevaCondicion() {
    this.commonsService
      .checkAcceso(procesos_PyS.nuevaCondicion)
        .then((respuesta) => {
          this.permisoNuevaCondicion = respuesta;
    })
    .catch((error) => console.error(error));
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
      this.subscriptionActivarDesactivarServicios.unsubscribe();
    if (this.subscriptionCodesByInstitution)
      this.subscriptionCodesByInstitution.unsubscribe();
    if (this.subscriptionBorrarSuscripcionesBajas)
      this.subscriptionBorrarSuscripcionesBajas.unsubscribe();
    if (this.subscriptionCondicionesSelect)
      this.subscriptionCondicionesSelect.unsubscribe();
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

  //Metodo que se lanza al cambiar de valor el combo de Condicion de Suscripcion, se usa para desmarcar el checkbox Asignacion Automatica en caso de que no haya ninguna condicion seleccionada.
  valueChangeCondicion() {
    if (this.servicio.idconsulta == null) {
      this.checkboxAsignacionAutomatica = false;
      this.onChangeAsignacionAutomatica();
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
  onChangePermitirAnulacionInternet() {
    if (this.checkboxPermitirAnulacionPorInternet) {
      this.servicio.permitirbaja = '1';
    } else {
      this.servicio.permitirbaja = '0';
    }
  }

  //Metodo que se lanza al marcar/desmarcar el checkbox Asignacion automatica
  onChangeAsignacionAutomatica() {
    if (this.checkboxAsignacionAutomatica) {
      this.servicio.automatico = '1';
      this.checkBoxPermitirSolicitudPorInternet = false;
      this.servicio.permitiralta = '0';
      this.checkboxPermitirAnulacionPorInternet = false;
      this.servicio.permitirbaja = '0';
    } else {
      this.servicio.automatico = '0';
      /*if(this.servicioOriginal.automatico == '1'){
        this.modalServicioAutomaticoAManual();
      }*/
    }
  }

  //Metodo que se lanza al marcar/desmarcar el checkbox Incluir solicitudes de baja manuales en el dialogo abierto al pulsar el boton Borrar Suscripciones/Bajas 
  onChangeIncluirSolBajasManuales() {
    if (this.checkboxIncluirSolBajasManuales) {
      this.borrarSuscripcionBajaItem.incluirbajasmanuales = '1';
    } else {
      this.borrarSuscripcionBajaItem.incluirbajasmanuales = '0';
    }
  }

  //Metodo que se lanza al marcar una de las dos opciones radio buttons disponibles en el dialogo borrar suscripciones o bajas 
  onChangeRadioButtonsOpcionAltasBajas(event) {
    if (event == "0") {
      this.checkboxIncluirSolBajasManuales = false;
      this.onChangeIncluirSolBajasManuales();
    }
  }

  onChangeDialogServicioAutomaticoAManual(){
    if(this.checkboxDialogServicioAutomaticoAManual){
      this.borrarSuscripcionBajaItem.opcionaltasbajas = "1";
    }else{
      this.borrarSuscripcionBajaItem.opcionaltasbajas = "0"
    }
  }

  fillFechaEliminacionAltas(event) {
    this.borrarSuscripcionBajaItem.fechaeliminacionaltas = event;
    //this.borrarSuscripcionBajaItem.fechaeliminacionaltas = `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
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

    if (this.servicio.automatico == "1") {
      this.checkboxAsignacionAutomatica = true;
    } else if (this.servicio.automatico == "0") {
      this.checkboxAsignacionAutomatica = false;
    }

  }

  checkGuardar(){
    let msg = null;
	  msg = this.commonsService.checkPermisos(this.permisoGuardarServicios, undefined);

	  if (msg != null) {
	    this.msgs = msg;
	  } else {
	    this.comprobacionPreGuardar();
	  }
  }

  //Si se ha activado el check de Asignación automática, o bien se ha cambiado la condición de suscripción (estando marcado “Asignación automática”):
  comprobacionPreGuardar() {
    if ((this.checkboxAsignacionAutomatica && this.servicioOriginal.automatico == '0') || (this.checkboxAsignacionAutomatica && this.servicio.idconsulta != this.servicioOriginal.idconsulta)) {
      //Antes de nada, se comprobará si la única forma de pago configurada para ese servicio es “domiciliación bancaria”. Si es así, se dará un mensaje de aviso avisando de este hecho y 
      //advirtiendo que no se suscribirá a aquellos censados que no tengan especificada una cuenta bancaria marcada como “cuenta de cargo”.
      let comprobacionUnicaFormaPagoInternet: boolean = true;
      let comprobacionUnicaFormaPagoSecretaria: boolean = true;

      //ID Domiciliacion Bancaria en formas de pago internet = 20
      if (this.servicio.formasdepagointernet.length > 0) {
        this.servicio.formasdepagointernet.forEach(formadepagointernet => {
          if (formadepagointernet != 20) {
            comprobacionUnicaFormaPagoInternet = false;
          }
        });
      }

      if (this.servicio.formasdepagosecretaria.length > 0) {
        //ID Domiciliacion Bancaria en formas de pago secretaria = 80
        this.servicio.formasdepagosecretaria.forEach(formasdepagosecretaria => {
          if (formasdepagosecretaria != 80) {
            comprobacionUnicaFormaPagoSecretaria = false;
          }
        });
      } else

        if (this.servicio.formasdepagointernet.length == 0 && this.servicio.formasdepagosecretaria.length == 0) {
          comprobacionUnicaFormaPagoInternet = false;
          comprobacionUnicaFormaPagoSecretaria = false;
        }


      if (comprobacionUnicaFormaPagoInternet == true && comprobacionUnicaFormaPagoSecretaria == true && this.servicio.editar) {

        let keyConfirmation = "avisoDomiciliacionBancariaUnicaFormaPago";
        let mensaje = this.translateService.instant("facturacion.servicios.fichaservicio.unicaformapagodomiciliacionbancariaconfirm");

        this.confirmationService.confirm({
          key: keyConfirmation,
          message: mensaje,
          icon: "fas fa-question",
          accept: () => {
            this.avisoSuscripcionAutomatica();
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

      } else {
        this.avisoSuscripcionAutomatica();
      }
    } else {
        if(this.checkboxAsignacionAutomatica)
          this.guardar()
        else  
          this.modalServicioAutomaticoAManual();
      //this.guardar();
    }
  }

  avisoSuscripcionAutomatica() {
    let keyConfirmation = "avisoSuscripcionAutomatica";
    let mensaje = this.translateService.instant("facturacion.servicios.fichaservicio.avisosuscripcionautomatica");

    this.confirmationService.confirm({
      key: keyConfirmation,
      message: mensaje,
      icon: "fas fa-question",
      accept: () => {
        this.progressSpinner = true;
        this.guardar();
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

  guardar() {
    this.aGuardar = true;
    if (this.servicio.idtiposervicios != null && this.servicio.idservicio != null && this.servicio.descripcion != '' && this.servicio.descripcion != undefined) {
      if (this.servicio.codigoext != "" && this.servicio.codigoext != null) {
        if (this.listaCodigosPorInstitucionObject.listaCodigosPorColegio.includes(this.servicio.codigoext) && this.servicio.codigoext != this.servicioOriginal.codigoext) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacion.fichaproductos.datosgenerales.mensajeerrorcodigo"))
        } else {
          this.guardarServicio();
        }
      } else {
        this.guardarServicio();
      }
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
    }
  }

  checkGuardarDialogBorrarSuscripcionesBajas(){
    if(this.checkboxDialogServicioAutomaticoAManual == true){
      this.guardarDialogBorrarSuscripcionesBajas();
    }else{
      this.guardar();
      this.showModalServicioAutomaticoAManual = false;
    }

    
  }

  guardarDialogBorrarSuscripcionesBajas() {
    this.progressSpinner = true;

    this.borrarSuscripcionBajaItem.idtiposervicios = this.servicio.idtiposervicios;
    this.borrarSuscripcionBajaItem.idservicio = this.servicio.idservicio;
    this.borrarSuscripcionBajaItem.idserviciosinstitucion = this.servicio.idserviciosinstitucion;

    this.subscriptionBorrarSuscripcionesBajas = this.sigaServices.post("fichaServicio_borrarSuscripcionesBajas", this.borrarSuscripcionBajaItem).subscribe(
      respuesta => {
        if (JSON.parse(respuesta.body).error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.showModalSuscripcionesBajas = false;
          this.showModalServicioAutomaticoAManual = false;
        }


        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        if(this.checkboxDialogServicioAutomaticoAManual == true){
          this.guardar();
        }
        this.progressSpinner = false;
      }
    );
  }

  borrarSuscripcionesBajas() {
    let msg = this.commonsService.checkPermisos(this.permisoEliminarSuscripcionBaja, undefined);
	    if (msg != null) {
	      this.msgs = msg;
	    } else {
        this.showModalSuscripcionesBajas = true;
	    }
  }

  cancelarDialogBorrarSuscripcionesBajas() {
    this.showModalSuscripcionesBajas = false;
  }

  modalServicioAutomaticoAManual(){
    let msg = this.commonsService.checkPermisos(this.permisoEliminarSuscripcionBaja, undefined);
	    if (msg != null) {
	      this.msgs = msg;
	    } else {
        this.showModalServicioAutomaticoAManual = true;
	    }
  }

  cancelarDialogServicioAutomaticoAManual() {
    this.checkboxDialogServicioAutomaticoAManual = false;
    this.showModalServicioAutomaticoAManual = false;
  }

  nuevacondicion(){
    let msg = null;
	  msg = this.commonsService.checkPermisos(this.permisoNuevaCondicion, undefined);

	  if (msg != null) {
	    this.msgs = msg;
	  } else {
      sessionStorage.setItem("servicioDetalle", JSON.stringify(this.servicio));
      this.router.navigate(["/fichaConsulta"]);
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

  //Metodo para obtener los valores del combo condicion de suscripcion
  getComboCondicionSuscripcion() {
    this.progressSpinner = true;

    this.subscriptionCondicionesSelect = this.sigaServices.get("fichaServicio_comboCondicionSuscripcion").subscribe(
      CondicionSuscripcionValues => {
        this.condicionesSuscripcionObject = CondicionSuscripcionValues;

        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        //Si hemos pulsado en el boton nueva condicion nos habra llevado a la ficha consultas en la cual habremos creado una nueva consulta y al darle a guardar tendra en cuenta que veniamos de fichaServicios
        //Y nos traera de vuelta con el combo de condiciones fijado a la recien creada consulta
        if(sessionStorage.getItem("vieneDeNuevaCondicion") == "true"){
          let maxId;
          maxId = Math.max.apply(Math, this.condicionesSuscripcionObject.combooItems.map(function(o) { return o.value; }))
          this.servicio.idconsulta = maxId;
        }
        this.progressSpinner = false;
      }
    );
  }

  //Metodo para obtener todos los codigos PYS_SERVICIOSINSTITUCION en la institucion actual
  obtenerCodigosPorColegio() {
    this.progressSpinner = true;

    this.subscriptionCodesByInstitution = this.sigaServices.get("fichaServicio_obtenerCodigosPorColegio").subscribe(
      codesByInstitutionValues => {

        this.listaCodigosPorInstitucionObject = codesByInstitutionValues;

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
          let res = JSON.parse(response.body);
          if (response.status == 200) {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            this.desactivarBotonEliminar = false;
            this.servicio.editar = true;
            this.servicio.idserviciosinstitucion = res.id;
            this.getInfo.emit(this.servicio);
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }

          this.progressSpinner = false;
        },
        err => {
          this.handleServerSideErrorMessage(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
          this.obtenerCodigosPorColegio();
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
          this.handleServerSideErrorMessage(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
    }
  }

  handleServerSideErrorMessage(err): void {
    let error = JSON.parse(err.error);
    if (error && error.error && error.error.message) {
      let message = this.translateService.instant(error.error.message);
  
      if (message && message.trim().length != 0) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), message);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), error.error.message);
      }
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
    }
  }

  checkEliminarReactivar(){
    let msg = null;
	  msg = this.commonsService.checkPermisos(this.permisoEliminarReactivarServicios, undefined);

	  if (msg != null) {
	    this.msgs = msg;
	  } else {
	    this.eliminarReactivar();
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
            if (response.status == 200) {
              this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              this.desactivarBotonEliminar = false;
            } else {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
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
