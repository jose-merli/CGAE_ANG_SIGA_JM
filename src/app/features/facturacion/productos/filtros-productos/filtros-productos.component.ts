import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { ComboObject } from '../../../../models/ComboObject';
import { FiltrosProductos } from '../../../../models/FiltrosProductos';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-filtros-productos',
  templateUrl: './filtros-productos.component.html',
  styleUrls: ['./filtros-productos.component.scss']
})
export class FiltrosProductosComponent implements OnInit {
  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga

  //Variables buscador
  filtrosProductos: FiltrosProductos = new FiltrosProductos(); //Guarda los valores seleccionados/escritos en los campos
  categoriasObject: ComboObject = new ComboObject(); //Modelo con la lista opciones + atributo error
  tiposObject: ComboObject = new ComboObject();
  ivasObject: ComboObject = new ComboObject();
  formasPagoObject: ComboObject = new ComboObject();
  @Output() busqueda = new EventEmitter<boolean>();

  //Suscripciones
  subscriptionCategorySelectValues: Subscription;
  subscriptionTypeSelectValues: Subscription;
  subscriptionIvaTypeSelectValues: Subscription;
  subscriptionPayMethodTypeSelectValues: Subscription;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService) { }

  ngOnInit() {
    this.getComboCategoria();
    this.getComboTipoIva();
    this.getComboFormaPago();
  }

  //Necesario para liberar memoria
  ngOnDestroy() {
    if (this.subscriptionCategorySelectValues)
      this.subscriptionCategorySelectValues.unsubscribe();
    if (this.subscriptionTypeSelectValues)
      this.subscriptionTypeSelectValues.unsubscribe();
    if (this.subscriptionIvaTypeSelectValues)
      this.subscriptionIvaTypeSelectValues.unsubscribe();
    if (this.subscriptionPayMethodTypeSelectValues)
      this.subscriptionPayMethodTypeSelectValues.unsubscribe();
  }

  //INICIO METODOS BUSCADOR
  prueba() {
    console.log(Number(this.filtrosProductos.precioHasta) < Number(this.filtrosProductos.precioDesde));
  }

  //Metodo que se lanza al cambiar de valir el combo de categorias, se usa para cargar el combo tipos dependiendo el valor de categorias
  valueChangeCategoria() {
    if (this.filtrosProductos.categoria != null) {
      this.getComboTipo();
    } else if (this.filtrosProductos.categoria == null) {
      this.filtrosProductos.tipo = null;
    }
  }

  limpiar() {
    this.filtrosProductos = new FiltrosProductos();
  }

  buscar() {
    if ((Number(this.filtrosProductos.precioHasta) < Number(this.filtrosProductos.precioDesde)) == false) {
      sessionStorage.setItem("filtrosProductos", JSON.stringify(this.filtrosProductos));
      this.busqueda.emit(true);
    } else {
      console.log("ERROR PRECIO HASTA MENOR QUE PRECIO DESDE");
      //Aviso en caso de que el precioHasta sea menos que el precioDesde
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacion.productos.errorpreciodesdehasta"));
    }
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
  //FIN METODOS BUSCADOR

  //INICIO SERVICIOS
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

    this.subscriptionCategorySelectValues = this.sigaServices.getParam("productosBusqueda_comboTipos", "?idCategoria=" + this.filtrosProductos.categoria).subscribe(
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

  //Metodo para obtener los valores del combo IVA
  getComboTipoIva() {
    this.progressSpinner = true;

    this.subscriptionIvaTypeSelectValues = this.sigaServices.get("productosBusqueda_comboIva").subscribe(
      IvaTypeSelectValues => {
        this.progressSpinner = false;

        this.ivasObject = IvaTypeSelectValues;

        let error = this.ivasObject.error;
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

  //Metodo para obtener los valores del combo Forma de pago
  getComboFormaPago() {
    this.progressSpinner = true;

    this.subscriptionPayMethodTypeSelectValues = this.sigaServices.get("productosBusqueda_comboFormaPago").subscribe(
      PayMethodSelectValues => {
        this.progressSpinner = false;

        this.formasPagoObject = PayMethodSelectValues;

        let error = this.formasPagoObject.error;
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
  //FIN SERVICIOS

}
