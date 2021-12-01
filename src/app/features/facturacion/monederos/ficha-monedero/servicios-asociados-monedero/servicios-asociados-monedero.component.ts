import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SortEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../../commons/translate';
import { FichaMonederoItem } from '../../../../../models/FichaMonederoItem';
import { FiltrosServicios } from '../../../../../models/FiltrosServicios';
import { ListaServiciosItems } from '../../../../../models/ListaServiciosItems';
import { procesos_PyS } from '../../../../../permisos/procesos_PyS';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-servicios-asociados-monedero',
  templateUrl: './servicios-asociados-monedero.component.html',
  styleUrls: ['./servicios-asociados-monedero.component.scss']
})
export class ServiciosAsociadosMonederoComponent implements OnInit {

  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga
  showTarjeta: boolean = false;

  permisoActualizarServiciosMonedero: boolean = false;
  showModal: boolean = false;

  colsServs = [
    { field: "categoria", header: "facturacion.productos.categoria" },
    { field: "tipo", header: "facturacion.productos.tipo" },
    { field: "descripcion", header: "facturacion.servicios.servicio" },
    { field: "formapago", header: "facturacion.productos.formapago" }
  ];

  serviciosTarjeta: any[] = []; //ListaServiciosMonederoItem
  comboServicios: ListaServiciosItems[] = [];

  cols = [
    { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre" },
    { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha" },
    { field: "precioPerio", header: "facturacion.servicios.precioivames" }
  ];

  rowsPerPageSelectValues = [
    {
      label: 10,
      value: 10
    },
    {
      label: 20,
      value: 20
    },
    {
      label: 30,
      value: 30
    },
    {
      label: 40,
      value: 40
    }
  ];

  @Input("ficha") ficha: FichaMonederoItem;
  @ViewChild("servicesTable") tablaServicios;
  @ViewChild("servicesMonederoTable") tablaServiciosSuscripcion;

  selectedRows: any[] = []; //ListaServiciosMonederoItem
  numSelectedRows: number = 0; //Se usa para mostrar visualmente el numero de filas seleccionadas
  selectMultipleRows: boolean = true; //Seleccion multiples filas de la tabla
  selectAllRows: boolean = false; //Selecciona todas las filas de la pagina actual de la tabla
  rowsPerPage: number = 10; //Define el numero de filas mostradas por pagina
  first = 0;
  buscadores = [];
  buscadoresServicios = [];


  subscriptionServiciosBusqueda: Subscription;
 
  constructor(public sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private localStorageService: SigaStorageService,
    private router: Router) {}

  ngOnInit() {
    this.getPermisoActualizarServiciosMonedero();
    this.getComboServicios();
   
    if (this.ficha.idLinea != null) {
      this.getServiciosMonedero();
    }
  }

  ngOnDestroy() {
    if (this.subscriptionServiciosBusqueda){
      this.subscriptionServiciosBusqueda.unsubscribe();
    }
  }

  //INICIO SERVICIOS
  getServiciosMonedero() {
    this.progressSpinner = true;

    this.subscriptionServiciosBusqueda = this.sigaServices.getParam("PyS_getListaServiciosMonedero",
      "?idLinea=" + this.ficha.idLinea+ "&?idPersona=" + this.ficha.idPersona).subscribe(
        listaServiciosMonederoDTO => {

          this.serviciosTarjeta = listaServiciosMonederoDTO.listaServiciosMonederoItems;

          if (listaServiciosMonederoDTO.error == null) {
            // this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }

          this.progressSpinner = false;

        },
        err => {
          this.progressSpinner = false;
        }, () => {
          this.progressSpinner = false;
        });;
  }



  getComboServicios() {
    this.progressSpinner = true;


    let filtrosServicios: FiltrosServicios = new FiltrosServicios();
    this.sigaServices.post("serviciosBusqueda_busqueda", filtrosServicios).subscribe(
      listaServiciosDTO => {

        if (JSON.parse(listaServiciosDTO.body).error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          // this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        

          //Descomentar esto y comentar el codigo de abajo asignando el valor de comboServicios
          //Si se quiere mostrar unicamente servicios no derogados
          JSON.parse(listaServiciosDTO.body).listaServiciosItems.forEach(servicio => {
            if (servicio.fechabaja == null) {
              this.comboServicios.push(servicio);
            }
          });

          // this.comboServicios = JSON.parse(listaServiciosDTO.body).listaServiciosItems

          //Apaño temporal ya que si no se hace este reset, la tabla muestra unicamente la primera paginad e servicios
          this.tablaServicios.reset();

          //Se revisan las formas de pago para añadir los "no factuables" y los "No disponible"
          this.comboServicios.forEach(servicio => {
            if (servicio.formapago == null || servicio.formapago == "") {
              if (servicio.noFacturable == "1") {
                servicio.formapago = this.translateService.instant("facturacion.productos.noFacturable");
              }
              else {
                servicio.formapago = this.translateService.instant("facturacion.productos.pagoNoDisponible");
              }
            }
            else {
              if (servicio.noFacturable == "1") {
                servicio.formapago += ", "+this.translateService.instant("facturacion.productos.noFacturable");
              }
            }
          });

        }

        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
      });
  }

  updateServiciosMonedero() {
    this.progressSpinner = true;

    
    //REVISAR
    this.sigaServices.post("PyS_updateServiciosPeticion", this.serviciosTarjeta).subscribe(
      n => {

        if (n.status == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }

        this.progressSpinner = false;

      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      });
  }
  //FIN SERVICIOS

  //INICIO METODOS

  checkSave() {
    let msg = this.commonsService.checkPermisos(this.permisoActualizarServiciosMonedero, undefined);

    if (msg != null) {
      this.msgs = msg;
    } else {
      this.updateServiciosMonedero();
    }
  }

  anadirServicio(selectedServicio) {
    this.showModal = false;
    let newServicio: any; //ListaServiciosMonederoItem
    newServicio.cantidad = "1";
    newServicio.descripcion = selectedServicio.descripcion;
    newServicio.orden = (this.serviciosTarjeta.length + 1).toString();
    newServicio.idServicio = selectedServicio.idservicio;
    newServicio.idTipoServicios = selectedServicio.idtiposervicios;
    newServicio.idServiciosInstitucion = selectedServicio.idserviciosinstitucion;
    newServicio.iva = selectedServicio.iva;
    newServicio.valorIva = selectedServicio.valorIva;
    newServicio.idtipoiva = selectedServicio.idtipoiva;
    newServicio.idLinea = this.ficha.idLinea;
    newServicio.automatico = selectedServicio.automatico;
    newServicio.noFacturable = selectedServicio.noFacturable;
    newServicio.solicitarBaja = selectedServicio.solicitarBaja;
    this.serviciosTarjeta.push(newServicio);

  }
  
  openHideModal() {
    this.showModal = !this.showModal;
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

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  cerrarDialog() {
    this.showModal = false;
  }

  //Metodo activado al pulsar sobre el checkbox Seleccionar todo
  onChangeSelectAllRows() {
    if (this.selectAllRows === true) {
      this.selectedRows = this.serviciosTarjeta;
      this.numSelectedRows = this.serviciosTarjeta.length;

    } else {
      this.selectedRows = [];
      this.numSelectedRows = 0;
    }
  }

  getPermisoActualizarServiciosMonedero() {
    this.commonsService
    //REVISAR
      .checkAcceso(procesos_PyS.fichaMonedero)
      .then((respuesta) => {
        this.permisoActualizarServiciosMonedero = respuesta;
      })
      .catch((error) => console.error(error));
  }

  //Metodo para aplicar logica al deseleccionar filas
  onRowUnselect() {
    this.numSelectedRows = this.selectedRows.length;
  }
  //Metodo para aplicar logica al seleccionar filas
  onRowSelect() {
    this.numSelectedRows = this.selectedRows.length;
  }


  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order * result);
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode >= 44 && charCode <= 57) {
      return true;
    }
    else {
      return false;
    }

  }

  //FIN METODOS

}
