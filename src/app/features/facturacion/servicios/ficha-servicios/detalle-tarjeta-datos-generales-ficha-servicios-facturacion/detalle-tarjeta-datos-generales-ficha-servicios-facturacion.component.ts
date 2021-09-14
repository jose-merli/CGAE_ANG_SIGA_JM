import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../../commons/translate';
import { ComboObject } from '../../../../../models/ComboObject';
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

  //Suscripciones
  subscriptionCategorySelectValues: Subscription;
  subscriptionTypeSelectValues: Subscription;
  subscriptionCrearProductoInstitucion: Subscription;
  subscriptionEditarProductoInstitucion: Subscription;
  subscriptionActivarDesactivarProductos: Subscription;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService, private confirmationService: ConfirmationService, private router: Router) { }

  ngOnChanges(changes: SimpleChanges) {
    /*  if (this.servicio.editar) {
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
     } */
  }

  ngOnInit() {
    this.getComboCategoria();
  }

  //Necesario para liberar memoria
  ngOnDestroy() {
    if (this.subscriptionCategorySelectValues)
      this.subscriptionCategorySelectValues.unsubscribe();
    /*if (this.subscriptionTypeSelectValues)
      this.subscriptionTypeSelectValues.unsubscribe();
    if (this.subscriptionCrearProductoInstitucion)
      this.subscriptionCrearProductoInstitucion.unsubscribe();
    if (this.subscriptionEditarProductoInstitucion)
      this.subscriptionEditarProductoInstitucion.unsubscribe();
    if (this.subscriptionActivarDesactivarProductos)
      this.subscriptionActivarDesactivarProductos.unsubscribe; */
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
  //FIN METODOS TARJETA DATOS GENERALES

  //INICIO SERVICIOS TARJETA DATOS GENERALES
  //INICIO SERVICIOS DATOS GENERALES
  //Metodo para obtener los valores del combo categoria
  getComboCategoria() {
    this.progressSpinner = true;

    this.subscriptionCategorySelectValues = this.sigaServices.get("tiposServicios_comboServicios").subscribe(
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

    this.subscriptionCategorySelectValues = this.sigaServices.getParam("serviciosBusqueda_comboTipos", "?idCategoria=" + this.servicio.idtiposervicios).subscribe(
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
  //FIN SERVICIOS TARJETA DATOS GENERALES

}
