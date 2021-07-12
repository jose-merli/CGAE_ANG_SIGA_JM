import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListaProductosItems } from '../../../../models/ListaProductosItems';

@Component({
  selector: 'app-ficha-productos',
  templateUrl: './ficha-productos.component.html',
  styleUrls: ['./ficha-productos.component.scss']
})
export class FichaProductosComponent implements OnInit {
  //Variables generales app
  producto: ListaProductosItems;

  constructor(private dataRoute: ActivatedRoute) { }

  ngOnInit() {
    /*    this.producto = JSON.parse(this.dataRoute.snapshot.params['productoItem']);
       console.log("PRODUCTO ENVIADO DESDE GESTION PRODUCTOS", this.producto); */

    this.producto = JSON.parse(sessionStorage.getItem("productoBuscador"));
    console.log("PRODUCTO ENVIADO DESDE GESTION PRODUCTOS", this.producto);
  }

}
