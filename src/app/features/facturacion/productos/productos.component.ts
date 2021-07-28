import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../commons/translate';
import { ListaProductosDTO } from '../../../models/ListaProductosDTO';
import { ListaProductosItems } from '../../../models/ListaProductosItems';
import { CommonsService } from '../../../_services/commons.service';
import { SigaServices } from '../../../_services/siga.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit, OnDestroy, AfterViewChecked {
  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga

  //Variables busqueda
  productData: any[] = [];
  muestraTablaProductos: boolean = false;

  //Suscripciones
  subscriptionProductosBusqueda: Subscription;

  constructor(public sigaServices: SigaServices, private commonsService: CommonsService, private translateService: TranslateService, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.subscriptionProductosBusqueda)
      this.subscriptionProductosBusqueda.unsubscribe();
  }

  //INICIO SERVICIOS
  listaProductosDTO: ListaProductosDTO;
  productDataConHistorico: any[] = [];
  productDataSinHistorico: any[] = [];
  busquedaProductos(event) {
    this.progressSpinner = true;
    let filtrosProductos = JSON.parse(sessionStorage.getItem("filtrosProductos"));

    this.subscriptionProductosBusqueda = this.sigaServices.post("productosBusqueda_busqueda", filtrosProductos).subscribe(
      listaProductosDTO => {

        this.listaProductosDTO = JSON.parse(listaProductosDTO.body);

        if (JSON.parse(listaProductosDTO.body).error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }

        this.progressSpinner = false;
        this.showTablaProductos(true);
        this.productDataSinHistorico = [];
        this.commonsService.scrollTablaFoco("tablaProductos");

      },
      err => {
        this.progressSpinner = false;
        this.commonsService.scrollTablaFoco("tablaProductos");
      }, () => {
        this.productDataConHistorico = this.listaProductosDTO.listaProductosItems;

        if (this.productDataConHistorico) {
          this.productDataConHistorico.forEach(producto => {
            if (producto.fechabaja == null) {
              this.productDataSinHistorico.push(producto);
            }
          });
        }

        this.productData = this.productDataSinHistorico;

        this.progressSpinner = false;
        this.progressSpinner = false;
        setTimeout(() => {
          this.commonsService.scrollTablaFoco('tablaProductos');
        }, 5);
      });;
  }
  //FIN SERVICIOS

  //INICIO METODOS
  showTablaProductos(mostrar) {
    this.muestraTablaProductos = mostrar;
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
  //FIN METODOS

}
