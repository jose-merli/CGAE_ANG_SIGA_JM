import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListaProductosItems } from '../../../../models/ListaProductosItems';

@Component({
  selector: 'app-ficha-productos',
  templateUrl: './ficha-productos.component.html',
  styleUrls: ['./ficha-productos.component.scss']
})
export class FichaProductosComponent implements OnInit {
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
      fixed: false,
      detalle: true,
      opened: true,
      campos: []
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {

  }

  backTo() {
    sessionStorage.setItem("volver", 'true');
    sessionStorage.removeItem('productoBuscador');
    this.router.navigate(['/productos']);
  }

}
