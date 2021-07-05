import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../../commons/translate';
import { CommonsService } from '../../../_services/commons.service';
import { SigaServices } from '../../../_services/siga.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga

  //Variables busqueda
  productData;
  muestraTablaProductos: boolean = false;

  constructor(public sigaServices: SigaServices, private commonsService: CommonsService, private translateService: TranslateService) { }

  ngOnInit() {
  }

  busquedaProductos(event) {
    this.progressSpinner = true;
    //let data = sessionStorage.getItem("filtrosProductos");
    let filtrosProductos = JSON.parse(sessionStorage.getItem("filtrosProductos"));

    this.sigaServices.post("productosBusqueda_busqueda", filtrosProductos).subscribe(
      n => {
        let error = null;
        this.productData = JSON.parse(n.body);

        if (this.productData[0] != null && this.productData[0] != undefined) {
          if (this.productData[0].error != null) {
            error = this.productData[0].error;
          }
        }

        this.progressSpinner = false;
        this.showTablaProductos(true);
        this.commonsService.scrollTablaFoco("tablaProductos");
        if (error != null && error.description != null) {
          this.msgs = [];
          this.msgs.push({
            severity: "info",
            summary: this.translateService.instant("general.message.informacion"),
            detail: error.description
          });
        }
      },
      err => {
        this.progressSpinner = false;
        this.commonsService.scrollTablaFoco("tablaProductos");
      }, () => {
        this.progressSpinner = false;
        this.progressSpinner = false;
        setTimeout(() => {
          this.commonsService.scrollTablaFoco('tablaProductos');
        }, 5);
      });;
  }

  showTablaProductos(mostrar) {
    this.muestraTablaProductos = mostrar;
  }

}
