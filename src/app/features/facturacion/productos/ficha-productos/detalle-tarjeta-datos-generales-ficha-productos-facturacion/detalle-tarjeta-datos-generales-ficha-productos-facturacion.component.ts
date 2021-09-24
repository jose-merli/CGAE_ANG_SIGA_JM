import { AfterContentInit, AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../../commons/translate';
import { CodigosPorInstitucionObject } from '../../../../../models/codigosPorInstitucionObject';
import { ComboObject } from '../../../../../models/ComboObject';
import { ListaProductosDTO } from '../../../../../models/ListaProductosDTO';
import { ListaProductosItems } from '../../../../../models/ListaProductosItems';
import { ProductoDetalleItem } from '../../../../../models/ProductoDetalleItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-detalle-tarjeta-datos-generales-ficha-productos-facturacion',
  templateUrl: './detalle-tarjeta-datos-generales-ficha-productos-facturacion.component.html',
  styleUrls: ['./detalle-tarjeta-datos-generales-ficha-productos-facturacion.component.scss']
})
export class DetalleTarjetaDatosGeneralesFichaProductosFacturacionComponent implements OnChanges, OnInit, OnDestroy {

  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga

  //Variables tarjeta datos generales
  @Input() producto: ProductoDetalleItem; //Guarda los valores seleccionados/escritos en los campos
  productoo: ProductoDetalleItem = new ProductoDetalleItem();
  productoOriginal: ProductoDetalleItem = new ProductoDetalleItem; //En caso de que entre en modo editar este objeto sera el que contenga los datos originales conseguidos gracias al servicio detalleProducto.
  @Input() productoDelBuscador: ListaProductosItems;
  categoriasObject: ComboObject = new ComboObject(); //Modelo con la lista opciones + atributo error
  tiposObject: ComboObject = new ComboObject();
  tiposCertificadosItems = [{
    label: this.translateService.instant("certificados.tipocertificado.literal.certificado"),
    value: "C"
  },
  {
    label: this.translateService.instant("certificados.tipocertificado.literal.comunicacion"),
    value: "M"
  },
  {
    label: this.translateService.instant("certificados.tipocertificado.literal.diligencia"),
    value: "D"
  },
  {
    label: this.translateService.instant("certificados.tipocertificado.literal.comisionbancaria"),
    value: "B"
  },
  {
    label: this.translateService.instant("certificados.tipocertificado.literal.gratuito"),
    value: "G"
  },
  ]
  checkBoxSolicitarPorInternet: boolean = false;
  checkboxSolicitarAnulacionPorInternet: boolean = false;
  @Output() mostrarTarjetaFormaPagos = new EventEmitter<boolean>();
  listaCodigosPorInstitucionObject: CodigosPorInstitucionObject;

  //variables de control
  aGuardar: boolean = false; //Usada en condiciones que validan la obligatoriedad, definida al hacer click en el boton guardar
  desactivarBotonEliminar: boolean = false; //Para activar el boton eliminar/reactivar dependiendo de si estamos en edicion o en creacion de un nuevo producto pero ya hemos guardado.

  //Suscripciones
  subscriptionCategorySelectValues: Subscription;
  subscriptionTypeSelectValues: Subscription;
  subscriptionCrearProductoInstitucion: Subscription;
  subscriptionEditarProductoInstitucion: Subscription;
  subscriptionActivarDesactivarProductos: Subscription;
  subscriptionCodesByInstitution: Subscription;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService, private confirmationService: ConfirmationService, private router: Router) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.producto.editar) {
      this.getComboTipo();
      this.productoOriginal = { ...this.producto };

      this.desactivarBotonEliminar = false;
      this.mostrarTarjetaFormaPagos.emit(true);

    } else {
      this.mostrarTarjetaFormaPagos.emit(false);
      this.desactivarBotonEliminar = true;
    }

    if (this.producto.solicitaralta == "1") {
      this.checkBoxSolicitarPorInternet = true;
    } else if (this.producto.solicitaralta == "0") {
      this.checkBoxSolicitarPorInternet = false;
    }

    if (this.producto.solicitarbaja == "1") {
      this.checkboxSolicitarAnulacionPorInternet = true;
    } else if (this.producto.solicitarbaja == "0") {
      this.checkboxSolicitarAnulacionPorInternet = false;
    }
  }

  ngOnInit() {
    this.getComboCategoria();
    this.obtenerCodigosPorColegio();
  }

  //Necesario para liberar memoria
  ngOnDestroy() {
    if (this.subscriptionCategorySelectValues)
      this.subscriptionCategorySelectValues.unsubscribe();
    if (this.subscriptionTypeSelectValues)
      this.subscriptionTypeSelectValues.unsubscribe();
    if (this.subscriptionCrearProductoInstitucion)
      this.subscriptionCrearProductoInstitucion.unsubscribe();
    if (this.subscriptionEditarProductoInstitucion)
      this.subscriptionEditarProductoInstitucion.unsubscribe();
    if (this.subscriptionActivarDesactivarProductos)
      this.subscriptionActivarDesactivarProductos.unsubscribe;
    if (this.subscriptionCodesByInstitution)
      this.subscriptionCodesByInstitution.unsubscribe;
  }

  //INICIO METODOS TARJETA DATOS GENERALES
  //Metodo que se lanza al cambiar de valor el combo de categorias, se usa para cargar el combo tipos dependiendo el valor de categorias IDTIPOPRODUCTO = CATEGORIA, IDPRODUCTO = TIPO, IDPRODUCTOINSTITUCION = PRODUCTO.
  valueChangeCategoria() {
    if (this.producto.idtipoproducto != null) {
      this.getComboTipo();
    } else if (this.producto.idtipoproducto == null) {
      this.producto.idproducto = null;
    }
  }

  //Metodo que se lanza al marcar/desmarcar el checkbox Solicitar por internet
  onChangeSolicitudInternet() {
    if (this.checkBoxSolicitarPorInternet) {
      this.producto.solicitaralta = '1';
    } else {
      this.producto.solicitaralta = '0';
    }
  }

  //Metodo que se lanza al marcar/desmarcar el checkbox Solicitar anulacion por internet
  onChangeSolicitudAnulacionInternet() {
    if (this.checkboxSolicitarAnulacionPorInternet) {
      this.producto.solicitarbaja = '1';
    } else {
      this.producto.solicitarbaja = '0';
    }
  }

  restablecer() {
    this.producto = { ...this.productoOriginal };

    if (this.producto.solicitaralta == "1") {
      this.checkBoxSolicitarPorInternet = true;
    } else if (this.producto.solicitaralta == "0") {
      this.checkBoxSolicitarPorInternet = false;
    }

    if (this.producto.solicitarbaja == "1") {
      this.checkboxSolicitarAnulacionPorInternet = true;
    } else if (this.producto.solicitarbaja == "0") {
      this.checkboxSolicitarAnulacionPorInternet = false;
    }
  }

  guardar() {
    this.aGuardar = true;
    if (this.producto.idtipoproducto != null && this.producto.idproducto != null && this.producto.descripcion != '' && this.producto.descripcion != undefined) {
      if (this.producto.codigoext != "" && this.producto.codigoext != null) {
        if (this.listaCodigosPorInstitucionObject.listaCodigosPorColegio.includes(this.producto.codigoext)) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacion.fichaproductos.datosgenerales.mensajeerrorcodigo"))
        } else {
          this.guardarProducto();
        }
      } else {
        this.guardarProducto();
      }
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
        this.categoriasObject = CategorySelectValues;

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

    this.subscriptionCategorySelectValues = this.sigaServices.getParam("productosBusqueda_comboTipos", "?idCategoria=" + this.producto.idtipoproducto).subscribe(
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

  //Metodo para obtener todos los codigos PYS_PRODUCTOINSTITUCION en la institucion actual
  obtenerCodigosPorColegio() {
    this.progressSpinner = true;

    this.subscriptionCodesByInstitution = this.sigaServices.get("fichaProducto_obtenerCodigosPorColegio").subscribe(
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

  guardarProducto() {
    this.progressSpinner = true;

    if (!this.producto.editar) {
      this.subscriptionCrearProductoInstitucion = this.sigaServices.post("fichaProducto_crearProducto", this.producto).subscribe(
        response => {

          if (JSON.parse(response.body).error.code == 500) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          } else {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            this.desactivarBotonEliminar = false;
            this.mostrarTarjetaFormaPagos.emit(true);
          }

          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.obtenerCodigosPorColegio();
          this.progressSpinner = false;
        }
      );
    } else if (this.producto.editar) {
      this.subscriptionEditarProductoInstitucion = this.sigaServices.post("fichaProducto_editarProducto", this.producto).subscribe(
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

  //Metodo para activar/desactivar productos mediante borrado logico (es decir fechabaja == null esta activo lo contrario inactivo) en caso de que tengan una transaccion pendiente de compra o compras ya existentes, en caso contrario se hara borrado fisico (DELETE)
  eliminarReactivar() {
    let keyConfirmation = "deletePlantillaDoc";
    let mensaje;
    if (this.producto.fechabaja != null) {
      mensaje = this.translateService.instant("facturacion.maestros.tiposproductosservicios.reactivarconfirm");
    } else if (this.producto.fechabaja == null) {
      mensaje = this.translateService.instant("messages.deleteConfirmation");
    }

    this.confirmationService.confirm({
      key: keyConfirmation,
      message: mensaje,
      icon: "fa fa-trash-alt",
      accept: () => {
        this.progressSpinner = true;

        let listaProductosDTO = new ListaProductosDTO();
        listaProductosDTO.listaProductosItems.push(this.productoDelBuscador);

        this.subscriptionActivarDesactivarProductos = this.sigaServices.post("productosBusqueda_activarDesactivar", listaProductosDTO).subscribe(
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
            sessionStorage.removeItem('productoBuscador');
            this.router.navigate(['/productos']);
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
  //FIN SERVICIOS DATOS GENERALES
}
