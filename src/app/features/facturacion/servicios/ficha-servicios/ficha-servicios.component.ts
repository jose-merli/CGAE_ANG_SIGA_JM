import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ListaServiciosItems } from '../../../../models/ListaServiciosItems';
import { ServicioDetalleItem } from '../../../../models/ServicioDetalleItem';
import { SigaServices } from '../../../../_services/siga.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ficha-servicios',
  templateUrl: './ficha-servicios.component.html',
  styleUrls: ['./ficha-servicios.component.scss']
})
export class FichaServiciosComponent implements OnInit, OnDestroy {
  //Variables generales app
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga

  //Variables ficha servicio
  //Array con los valores con cada tarjeta para mediante ngFor recorrerlo en el html y replicar acordeones, etc.
  listaTarjetas = [
    {
      id: 'serviciosDatosGenerales',
      nombre: "Datos Generales",
      imagen: "",
      icono: 'far fa-address-book',
      fixed: false,
      detalle: true,
      opened: true,
      campos: []
    },
    {
      id: 'serviciosFormasDePago',
      nombre: "Forma de pago",
      imagen: "",
      icono: 'far fa-credit-card',
      fixed: false,
      detalle: true,
      opened: true,
      campos: []
    },
    {
      id: 'serviciosPrecios',
      nombre: "Precios",
      imagen: "",
      icono: 'fa fa-eur',
      fixed: false,
      detalle: true,
      opened: true,
      campos: []
    }
  ];

  mostrarTarjPagos: boolean = false;
  mostrarTarjPrecios: boolean = false;
  servicioDelBuscador: ListaServiciosItems = new ListaServiciosItems(); //Servicio obtenido de la fila del buscador de servicios en la cual pulsamos el enlace a la ficha servicios.
  servicio: ServicioDetalleItem = new ServicioDetalleItem(); //Guarda los valores traidos del servicio detalleServicio
  servicioOriginal: ServicioDetalleItem = new ServicioDetalleItem();

  //Suscripciones
  subscriptionServiceDetail: Subscription;
  subscriptionCategorySelectValues: Subscription;

  constructor(private location: Location, private router: Router, private sigaServices: SigaServices) { }

  ngOnInit() {
    if (sessionStorage.getItem('servicioBuscador')) {
      this.servicioDelBuscador = JSON.parse(sessionStorage.getItem('servicioBuscador'));
      this.detalleServicio();
    } else {
      this.servicio = new ServicioDetalleItem();
    }
  }

  ngOnDestroy() {
    if (this.subscriptionServiceDetail)
      this.subscriptionServiceDetail.unsubscribe();
  }

  //INICIO METODOS APP
  mostrarTarjetaFormaPagos(event) {
    this.mostrarTarjPagos = event;
  }

  mostrarTarjetaPrecios(event) {
    this.mostrarTarjPrecios = event;
  }

  backTo() {
    sessionStorage.setItem("volver", 'true');
    sessionStorage.removeItem('servicioBuscador');
    // this.router.navigate(['/servicios']);
    this.location.back();
  }
  //FIN METODOS APP

  //INICIO SERVICIOS 
  //Metodo para que en caso de que se haya accedido a traves del enlace de la columna servicio se consiga toda la informacion restante del servicio seleccionado para completar los campos a editar
  detalleServicio() {
    this.progressSpinner = true;

    this.subscriptionServiceDetail = this.sigaServices.getParam("fichaServicio_detalleServicio", "?idTipoServicio=" + this.servicioDelBuscador.idtiposervicios +
      "&idServicio=" + this.servicioDelBuscador.idservicio + "&idServiciosInstitucion=" + this.servicioDelBuscador.idserviciosinstitucion).subscribe(
        servicio => {
          this.servicio = servicio;
          this.servicio.formasdepagointernetoriginales = Object.assign([], this.servicio.formasdepagointernet);
          this.servicio.formasdepagosecretariaoriginales = Object.assign([], this.servicio.formasdepagosecretaria);
          this.servicio.editar = true;
          this.servicio.serviciooriginal = { ...servicio };
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
