import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  //Suscripciones
  subscriptionProductTypeSelectValues: Subscription;
  subscriptionIvaTypeSelectValues: Subscription;
  subscriptionPayMethodTypeSelectValues: Subscription;

  constructor(private sigaServices: SigaServices) { }

  ngOnInit() {
    this.getComboCategoria();
    this.getComboTipoIva();
    this.getComboFormaPago();
  }

  //Necesario para liberar memoria
  ngOnDestroy() {
    if (this.subscriptionProductTypeSelectValues)
      this.subscriptionProductTypeSelectValues.unsubscribe();
    if (this.subscriptionIvaTypeSelectValues)
      this.subscriptionIvaTypeSelectValues.unsubscribe();
    if (this.subscriptionPayMethodTypeSelectValues)
      this.subscriptionPayMethodTypeSelectValues.unsubscribe();
  }

  //INICIO METODOS BUSCADOR
  prueba() {
    console.log(Number(this.filtrosProductos.precioHasta) < Number(this.filtrosProductos.precioDesde));
  }
  prueba2() {
    console.log(this.filtrosProductos.categoria);
  }

  limpiar() {
    this.filtrosProductos = new FiltrosProductos();
  }
  //FIN METODOS BUSCADOR

  //INICIO SERVICIOS
  //Metodo para obtener los valores del combo categoria
  getComboCategoria() {
    this.progressSpinner = true;

    this.subscriptionProductTypeSelectValues = this.sigaServices.get("tiposProductos_comboProducto").subscribe(
      ProductTypeSelectValues => {
        this.progressSpinner = false;

        this.categoriasObject = ProductTypeSelectValues;

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

  //Metodo para obtener los valores del combo IVA
  getComboTipoIva() {
    this.progressSpinner = true;

    this.subscriptionIvaTypeSelectValues = this.sigaServices.get("productosBusqueda_comboIva").subscribe(
      IvaTypeSelectValues => {
        this.progressSpinner = false;

        this.ivasObject = IvaTypeSelectValues;

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

  //Metodo para obtener los valores del combo Forma de pago
  getComboFormaPago() {
    this.progressSpinner = true;

    this.subscriptionPayMethodTypeSelectValues = this.sigaServices.get("productosBusqueda_comboFormaPago").subscribe(
      PayMethodSelectValues => {
        this.progressSpinner = false;

        this.formasPagoObject = PayMethodSelectValues;

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
  //FIN SERVICIOS

}
