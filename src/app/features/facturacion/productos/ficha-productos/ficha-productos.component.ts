import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ListaProductosItems } from '../../../../models/ListaProductosItems';
import { ProductoDetalleItem } from '../../../../models/ProductoDetalleItem';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-ficha-productos',
  templateUrl: './ficha-productos.component.html',
  styleUrls: ['./ficha-productos.component.scss']
})
export class FichaProductosComponent implements OnInit, OnDestroy {
  //Variables generales app
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga

  //Variables ficha producto
  //Array con los valores con cada tarjeta para mediante ngFor recorrerlo en el html y replicar acordeones, etc.
  listaTarjetas = [
    {
      id: 'productosDatosGenerales',
      nombre: "Datos Generales",
      imagen: "",
      icono: 'far fa-address-book',
      fixed: false,
      detalle: true,
      opened: true,
      campos: []
    },
    {
      id: 'productosFormasDePago',
      nombre: "Forma de pago",
      imagen: "",
      icono: 'far fa-credit-card',
      fixed: false,
      detalle: true,
      opened: true,
      campos: []
    }
  ];
  mostrarTarjPagos: boolean = false;
  productoDelBuscador: ListaProductosItems = new ListaProductosItems(); //Producto obtenido de la fila del buscador de productos en la cual pulsamos el enlace a la ficha productos.
  producto: ProductoDetalleItem = new ProductoDetalleItem(); //Guarda los valores traidos del servicio detalleProducto
  productoOriginal: ProductoDetalleItem = new ProductoDetalleItem();

  //Suscripciones
  subscriptionProductDetail: Subscription;
  subscriptionCategorySelectValues: Subscription;

  constructor(private router: Router, private sigaServices: SigaServices) { }

  ngOnInit() {
    if (sessionStorage.getItem('productoBuscador')) {
      this.productoDelBuscador = JSON.parse(sessionStorage.getItem('productoBuscador'));
      this.detalleProducto();
    } else {
      this.producto = new ProductoDetalleItem();
    }
  }

  ngOnDestroy() {
    if (this.subscriptionProductDetail)
      this.subscriptionProductDetail.unsubscribe();
  }

  //INICIO METODOS APP
  mostrarTarjetaFormaPagos(event) {
    this.mostrarTarjPagos = event;
  }

  backTo() {
    sessionStorage.setItem("volver", 'true');
    sessionStorage.removeItem('productoBuscador');
    this.router.navigate(['/productos']);
  }
  //FIN METODOS APP

  //INICIO SERVICIOS 
  //Metodo para que en caso de que se haya accedido a traves del enlace de la columna producto se consiga toda la informacion restante del producto seleccionado para completar los campos a editar
  detalleProducto() {
    this.progressSpinner = true;

    this.subscriptionProductDetail = this.sigaServices.getParam("fichaProducto_detalleProducto", "?idTipoProducto=" + this.productoDelBuscador.idtipoproducto +
      "&idProducto=" + this.productoDelBuscador.idproducto + "&idProductoInstitucion=" + this.productoDelBuscador.idproductoinstitucion).subscribe(
        producto => {
          this.producto = producto;
          this.producto.formasdepagointernetoriginales = Object.assign([], this.producto.formasdepagointernet);
          this.producto.formasdepagosecretariaoriginales = Object.assign([], this.producto.formasdepagosecretaria);
          this.producto.editar = true;
          this.producto.productooriginal = { ...producto };
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
  //FIN SERVICIOS
}
