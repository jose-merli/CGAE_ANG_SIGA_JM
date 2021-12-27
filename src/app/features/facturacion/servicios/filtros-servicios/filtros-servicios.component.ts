import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../commons/translate';
import { ComboObject } from '../../../../models/ComboObject';
import { FiltrosServicios } from '../../../../models/FiltrosServicios';
import { procesos_PyS } from '../../../../permisos/procesos_PyS';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-filtros-servicios',
  templateUrl: './filtros-servicios.component.html',
  styleUrls: ['./filtros-servicios.component.scss']
})
export class FiltrosServiciosComponent implements OnInit, OnDestroy {
  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga

  //Variables buscador
  filtrosServicios: FiltrosServicios = new FiltrosServicios(); //Guarda los valores seleccionados/escritos en los campos
  categoriasObject: ComboObject = new ComboObject(); //Modelo con la lista opciones + atributo error
  tiposObject: ComboObject = new ComboObject();
  ivasObject: ComboObject = new ComboObject();
  formasPagoObject: ComboObject = new ComboObject();
  tiposSuscripcionItems = [{
    label: this.translateService.instant("facturacion.servicios.automatico"),
    value: "1"
  },
  {
    label: this.translateService.instant("facturacion.servicios.manual"),
    value: "0"
  }
  ]
  @Output() busqueda = new EventEmitter<boolean>();

  //Permisos
  permisoGuardarServicios: boolean;

  //Suscripciones
  subscriptionCategorySelectValues: Subscription;
  subscriptionTypeSelectValues: Subscription;
  subscriptionIvaTypeSelectValues: Subscription;
  subscriptionPayMethodTypeSelectValues: Subscription;

  constructor(private commonsService: CommonsService, private sigaServices: SigaServices, private translateService: TranslateService, private router: Router) { }

  ngOnInit() {
    this.checkPermisos();

    //Restablece los datos de busqueda anteriormente usados si se viene desde el boton volver de la ficha de servicios.
    if (sessionStorage.getItem("volver") == 'true' && sessionStorage.getItem('filtrosServicios')) {
      this.filtrosServicios = JSON.parse(sessionStorage.getItem("filtrosServicios"));
      sessionStorage.removeItem("volver");

      this.buscar();
    } else {
      this.filtrosServicios = new FiltrosServicios();
    }

    this.getComboCategoria();
    this.getComboTipoIva();
    this.getComboFormaPago();
  }

  checkPermisos(){
    this.getPermisoGuardarServicios();
  }

  getPermisoGuardarServicios() {
    this.commonsService
      .checkAcceso(procesos_PyS.guardarServicios)
        .then((respuesta) => {
          this.permisoGuardarServicios = respuesta;
    })
    .catch((error) => console.error(error));
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
  //Metodo que se lanza al cambiar de valor el combo de categorias, se usa para cargar el combo tipos dependiendo el valor de categorias
  valueChangeCategoria() {
    if (this.filtrosServicios.categoria != null) {
      this.getComboTipo();
    } else if (this.filtrosServicios.categoria == null) {
      this.filtrosServicios.tipo = null;
    }
  }

  limpiar() {
    this.filtrosServicios = new FiltrosServicios();
  }

  buscar() {
    if ((this.filtrosServicios.precioDesde != null && this.filtrosServicios.precioDesde != undefined && this.filtrosServicios.precioDesde != "" && Number(this.filtrosServicios.precioDesde) != 0) && (this.filtrosServicios.precioHasta != null && this.filtrosServicios.precioHasta != undefined && this.filtrosServicios.precioHasta != "" && Number(this.filtrosServicios.precioHasta) != 0)) {
      if ((Number(this.filtrosServicios.precioHasta) < Number(this.filtrosServicios.precioDesde)) == false) {
        sessionStorage.setItem("filtrosServicios", JSON.stringify(this.filtrosServicios));
        this.busqueda.emit(true);
      } else {
        //Aviso en caso de que el precioHasta sea menor que el precioDesde
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacion.productos.errorpreciodesdehasta"));
      }
    } else {
      sessionStorage.setItem("filtrosServicios", JSON.stringify(this.filtrosServicios));
      this.busqueda.emit(true);
    }
  }

  nuevo() {
    let msg = null;
	  msg = this.commonsService.checkPermisos(this.permisoGuardarServicios, undefined);

	  if (msg != null) {
	    this.msgs = msg;
	  } else {
      sessionStorage.removeItem("servicioBuscador");
      this.router.navigate(["/fichaServicios"]);
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

    this.subscriptionCategorySelectValues = this.sigaServices.get("tiposServicios_comboServicios").subscribe(
      CategorySelectValues => {
        this.progressSpinner = false;

        this.categoriasObject = CategorySelectValues;
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

    this.subscriptionTypeSelectValues = this.sigaServices.getParam("serviciosBusqueda_comboTipos", "?idCategoria=" + this.filtrosServicios.categoria).subscribe(
      TipoSelectValues => {
        this.progressSpinner = false;

        this.tiposObject = TipoSelectValues;
      },
      err => {
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

      },
      err => {
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
