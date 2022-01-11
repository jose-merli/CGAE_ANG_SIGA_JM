import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../commons/translate';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { ListaServiciosDTO } from '../../../../models/ListaServiciosDTO';
import { ListaServiciosItems } from '../../../../models/ListaServiciosItems';
import { ListaServiciosSuscripcionItem } from '../../../../models/ListaServiciosSuscripcionItem';
import { procesos_PyS } from '../../../../permisos/procesos_PyS';
import { SigaStorageService } from '../../../../siga-storage.service';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-gestion-servicios',
  templateUrl: './gestion-servicios.component.html',
  styleUrls: ['./gestion-servicios.component.scss']
})
export class GestionServiciosComponent implements OnInit, OnDestroy {
  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga
  @Output() busqueda = new EventEmitter<boolean>();

  //Variables p-table
  @ViewChild("servicesTable") servicesTable; //Referencia a la tabla de servicios del html
  colsServices: any = []; //Columnas tabla servicios
  @Input() serviceData: any[] = []; //Datos de la tabla
  @Input() serviceDataSinHistorico: any[] = [];
  @Input() serviceDataConHistorico: any[] = []
  selectedRows; //Datos de las filas seleccionadas.
  numSelectedRows: number = 0; //Se usa para mostrar visualmente el numero de filas seleccionadas
  selectMultipleRows: boolean = false; //Seleccion multiples filas de la tabla
  selectAllRows: boolean = false; //Selecciona todas las filas de la pagina actual de la tabla
  rowsPerPage: number = 10; //Define el numero de filas mostradas por pagina
  rowsPerPageSelectValues: any[] = []; //Valores del combo Mostrar X registros
  first = 0;
  buscadores = [];
  esColegiado = true;

  //Variables control
  historico: boolean = false; //Indica si se estan mostrando historicos o no para por ejemplo ocultar/mostrar los botones de historico.
  //Variables para mostrar boton reactivar o eliminar
  numSelectedAbleRegisters: number = 0;
  numSelectedDisableRegisters: number = 0;

  //Permisos
  permisoEliminarReactivarServicios: boolean;

  //Suscripciones
  subscriptionActivarDesactivarServicios: Subscription;
  permisoSuscripcion: boolean = false;

  constructor(private commonsService: CommonsService, private changeDetectorRef: ChangeDetectorRef, private persistenceService: PersistenceService, 
    private translateService: TranslateService, private confirmationService: ConfirmationService, 
    private sigaServices: SigaServices, private router: Router,
    private localStorageService: SigaStorageService,) { }

  ngOnInit() {
    this.checkPermisos();

    if(this.localStorageService.isLetrado){
      this.esColegiado = true;
    }
    else{
      this.esColegiado = false;
    }

    if (this.persistenceService.getPaginacion() != undefined) {
      let paginacion = this.persistenceService.getPaginacion();
      this.persistenceService.clearPaginacion();

      this.first = paginacion.paginacion;
      this.rowsPerPage = paginacion.selectedItem;
    }

    this.initrowsPerPageSelect();
    this.initColsServices();

  }

  checkPermisos(){
	  this.getPermisoEliminarReactivarServicios();
  }

  getPermisoEliminarReactivarServicios() {
    this.commonsService
      .checkAcceso(procesos_PyS.eliminarReactivarServicios)
        .then((respuesta) => {
          this.permisoEliminarReactivarServicios = respuesta;
    })
    .catch((error) => console.error(error));
  }

  //Necesario para liberar memoria
  ngOnDestroy() {
    if (this.subscriptionActivarDesactivarServicios)
      this.subscriptionActivarDesactivarServicios.unsubscribe();
  }

  //INICIO METODOS P-TABLE
  //Inicializa los valores del combo Mostar X registros
  initrowsPerPageSelect() {
    this.rowsPerPageSelectValues = [
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
  }

  //Define las columnas
  initColsServices() {
    this.colsServices = [
      {
        field: "categoria", //Campo serviceData (array con los datos de la tabla)
        header: "facturacion.productos.categoria" //Titulo columna
      },
      {
        field: "tipo",
        header: "facturacion.productos.tipo"
      },
      {
        field: "descripcion",
        header: "facturacion.servicios.servicio"
      },
      {
        field: "precioperiodicidad",
        header: "facturacion.servicios.precioivames"
      },
      {
        field: "formapago",
        header: "facturacion.productos.formapago"
      },
      {
        field: "automatico",
        header: "facturacion.servicios.tiposuscripcion"
      }
    ];

    this.colsServices.forEach(it => this.buscadores.push(""));
  }

  checkServ(){
    let msg = this.commonsService.checkPermisos(this.permisoSuscripcion, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    }
    else if(this.selectedRows.length != 1){
      this.showMessage("error",
      this.translateService.instant("Limite de servicios por suscripcion"),
      this.translateService.instant("facturacion.suscripcion.unServicioSuscripcion")
            );
    }
    else if (this.checkServicioSeleccionado(this.selectedRows[0])) {
      this.nuevaSuscripcion();
      // let newServicio: ListaServiciosSuscripcionItem = new ListaServiciosSuscripcionItem();
      // newServicio.cantidad = "1";
      // newServicio.descripcion = selectedServicio.descripcion;
      // newServicio.orden = (this.serviciosTarjeta.length + 1).toString();
      // newServicio.idServicio = selectedServicio.idservicio;
      // newServicio.idTipoServicios = selectedServicio.idtiposervicios;
      // newServicio.idServiciosInstitucion = selectedServicio.idserviciosinstitucion;
      // // newServicio.precioServicioValor = selectedServicio.precioperiodicidad.split(" ")[0];
      // // newServicio.precioServicioValor = newServicio.precioServicioValor.replace(",", "."); //para evitar que utilice comas que se procesan de forma erronea
      // newServicio.iva = selectedServicio.iva;
      // newServicio.valorIva = selectedServicio.valorIva;
      // newServicio.idtipoiva = selectedServicio.idtipoiva;
      // newServicio.idPeticion = this.ficha.nSolicitud;
      // newServicio.automatico = selectedServicio.automatico;
      // newServicio.noFacturable = selectedServicio.noFacturable;
      // newServicio.solicitarBaja = selectedServicio.solicitarBaja;
      // this.serviciosTarjeta.push(newServicio);
      // this.checkTotal();
      // this.getComboPrecios();
    }
  }

  nuevaSuscripcion() {
    this.progressSpinner = true;

    sessionStorage.removeItem("FichaCompraSuscripcion");
    let nuevaSuscripcion = new FichaCompraSuscripcionItem();

    nuevaSuscripcion.servicios = [];

    let newServicio: ListaServiciosSuscripcionItem = new ListaServiciosSuscripcionItem();



    newServicio.idServicio = this.selectedRows[0].idservicio;
    newServicio.idTipoServicios = this.selectedRows[0].idtiposervicios;
    newServicio.idServiciosInstitucion = this.selectedRows[0].idserviciosinstitucion;
    newServicio.cantidad = "1";
    newServicio.descripcion = this.selectedRows[0].descripcion;
    newServicio.orden = "1";
    newServicio.iva = this.selectedRows[0].iva;
    newServicio.valorIva = this.selectedRows[0].valorIva;
    newServicio.idtipoiva = this.selectedRows[0].idtipoiva;
    //PRECAUCION: SI SE CAMBIA LA OBTENCION DE LA CARACTERISTICA DE AUTOMATICO,
    //SE DEBERA REVISAR ESTOS CONDICIONALES
    if(this.selectedRows[0].automatico == "Manual"){
      newServicio.automatico = "0";
    }
    else{
      newServicio.automatico = "1";
    }
    newServicio.noFacturable = this.selectedRows[0].noFacturable;
    newServicio.solicitarBaja = this.selectedRows[0].solicitarBaja;

    nuevaSuscripcion.servicios.push(newServicio);

    this.sigaServices.post('PyS_getFichaCompraSuscripcion', nuevaSuscripcion).subscribe(
      (n) => {
        this.progressSpinner = false;

        if (n.status == 200) {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          sessionStorage.setItem("FichaCompraSuscripcion", n.body);
          this.router.navigate(["/fichaCompraSuscripcion"]);
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
      (err) => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    );
  }

  checkServicioSeleccionado(selectedServicio : ListaServiciosItems) {
    if (selectedServicio.formapago != this.translateService.instant("facturacion.productos.pagoNoDisponible")) {
      
      if (selectedServicio.fechaBajaIva == null) {

        //Comprueba si el servicio es automatico
        if (selectedServicio.automatico == "Manual") {
          let serviciosLista : ListaServiciosSuscripcionItem[] = [];

          let newServicio = new ListaServiciosSuscripcionItem();
          newServicio.idServicio = selectedServicio.idservicio;
          newServicio.idServiciosInstitucion = selectedServicio.idserviciosinstitucion;
          newServicio.idTipoServicios = selectedServicio.idtiposervicios;
          newServicio.noFacturable = selectedServicio.noFacturable;
          newServicio.descripcion = selectedServicio.descripcion;

          serviciosLista.push(newServicio);

          if (this.checkFormasPagoComunes(serviciosLista)) {
            return true;
          }
          else{
            return false;
          }
        }
        else {
          this.showMessage("error",
            "**Servicio no valido",
            "**No se puede realizar la suscripción a servicios automaticos");
          return false;
        }
      }
      else {
        this.showMessage("error",
          this.translateService.instant("facturacion.productos.productoIvaDerogado"),
          this.translateService.instant("facturacion.productos.productoIvaDerogadoDesc"));
        return false;
      }
    }
    else {
      this.showMessage("error",
      this.translateService.instant("productoSinFormaPago"),
      this.translateService.instant("productoSinFormaPago"));
      return false;
    }
  }

  checkFormasPagoComunes(serviciosLista: ListaServiciosSuscripcionItem[]) {
    let error: boolean = false;


    //Se extrae el atributo y se separan las distintas formas de pago.
    let formasPagoArrays: any[] = [];

    let result = [];

    let serv;
    serviciosLista.forEach(element => {
      serv = this.serviceData.find(serv =>
        serv.idservicio == element.idServicio && serv.idtiposervicios == element.idTipoServicios && serv.idserviciosinstitucion == element.idServiciosInstitucion
      )
      let idformaspago;
      if(serv.idFormasPago != null){
        idformaspago = serv.idFormasPago.split(",");
      }
      if(serv.noFacturable == "1"){
        if(idformaspago != undefined){
          idformaspago.push("-1");
        }
        else{
          idformaspago = ["-1"];
        }
      }
      formasPagoArrays.push(idformaspago);
    });

    //Se comprueba si todas las filas seleccionadas comparten alguna forma de pago.
    result = formasPagoArrays.shift().filter(function (v) {
      return formasPagoArrays.every(function (a) {
        return a.indexOf(v) !== -1;
      });
    });

    if (result.length > 0) {
      //Comprobamos si las formas de pago comunes se corresponden con 
      //las formas de pago permitidas al usuario ( por internet o por secretaria)
      // Personal del colegio = pago por secretaria ("S"), colegiado = formas de pago por internet ("A").
      //Se hace una excepción con la forma de pago seleccionada anteriormente si es una solicitud pendiente.
      let resultUsu = [];
      for(let idpago of result){
        //"No factuable" se acepta siempre
        if(idpago == "-1"){
          resultUsu.push("-1");
        }
        else{
          let index = serv.idFormasPago.split(",").indexOf(idpago);
          if((this.esColegiado && serv.formasPagoInternet.split(",")[index] == "A") ||
          ((!this.esColegiado && serv.formasPagoInternet.split(",")[index] == "S"))){
            resultUsu.push(serv.idFormasPago.split(",")[index]);
          }
        }
      }

      if(resultUsu.length > 0){
        if(this.checkNoFacturable(serviciosLista)){
          return true;
        }
        else {
          this.msgs = [
            {
              severity: "error",
              summary: this.translateService.instant("facturacion.productos.facturableNoComp"),
              detail: this.translateService.instant("facturacion.productos.facturableNoComp")
            }
          ];
          return false;
        }
      }
      else {
        this.showMessage("error",
          this.translateService.instant("menu.facturacion.noCompatiblePorUsuario"),
          this.translateService.instant("menu.facturacion.noCompatiblePorUsuarioDesc")
        );
        return false;
      }
    }
    else {
      this.showMessage("error",
        this.translateService.instant(
          "facturacion.servicios.ResFormasPagoNoCompatibles"
        ),
        this.translateService.instant(
          "facturacion.servicios.FormasPagoNoCompatibles"
        )
      );
      return false;
    }
  }

  checkNoFacturable(servicios: ListaServiciosSuscripcionItem[]) { 
    let i = 0;
    //Se comprueba si todos los servicios seleccionados son no facturables facturables
    for (let serv of servicios) {
      if (serv.noFacturable == "1") i++;
    }

    if (i == 0 || i == servicios.length) {
      return true;
    }
    else {
      return false;
    }
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

  //Activa/Desactiva la paginacion dependiendo de si el array viene vacio o no.
  enablePagination() {
    if (!this.serviceData || this.serviceData.length == 0) return false;
    else return true;
  }

  //Metodo activado al pulsar sobre el checkbox Seleccionar todo
  onChangeSelectAllRows() {
    if (this.selectAllRows === true) {
      this.selectedRows = this.serviceData;
      this.numSelectedRows = this.serviceData.length;

      this.numSelectedAbleRegisters = 0;
      this.numSelectedDisableRegisters = 0;

      this.selectedRows.forEach(rows => {
        if (rows.fechabaja == null) {
          this.numSelectedAbleRegisters++;
        } else {
          this.numSelectedDisableRegisters++;
        }
      });

    } else {
      this.selectedRows = [];
      this.numSelectedRows = 0;
      this.numSelectedAbleRegisters = 0;
      this.numSelectedDisableRegisters = 0;
    }
  }

  //Metodo para aplicar logica al seleccionar filas
  onRowSelect() {
    this.numSelectedAbleRegisters = 0;
    this.numSelectedDisableRegisters = 0;
    this.numSelectedRows = this.selectedRows.length;

    this.selectedRows.forEach(rows => {
      if (rows.fechabaja == null) {
        this.numSelectedAbleRegisters++;
      } else {
        this.numSelectedDisableRegisters++;
      }
    });
  }

  //Metodo para aplicar logica al deseleccionar filas
  onRowUnselect() {
    this.numSelectedAbleRegisters = 0;
    this.numSelectedDisableRegisters = 0;
    this.numSelectedRows = this.selectedRows.length;

    this.selectedRows.forEach(rows => {
      if (rows.fechabaja == null) {
        this.numSelectedAbleRegisters++;
      } else {
        this.numSelectedDisableRegisters++;
      }
    });
  }

  //Metodo para cambiar el numero de registros mostrados por pantalla 
  onChangeRowsPerPages(event) {
    this.rowsPerPage = event.value;
    this.changeDetectorRef.detectChanges();
    this.servicesTable.reset();
  }

  //FIN METODOS P-TABLE

  //INICIO METODOS COMPONENTE
  //Metodo para obtener los datos de la tabla servicios activos
  getListaServicios() {
    this.numSelectedRows = 0;
    this.selectedRows = [];
    this.historico = false;

    this.selectAllRows = false;
    this.selectMultipleRows = false;

    this.serviceData = this.serviceDataSinHistorico;
  }


  //Metodo para obtener los datos de la tabla servicios tanto activos como no activos
  getListaServiciosHistorico() {
    this.historico = true;
    this.persistenceService.setHistorico(this.historico);
    this.selectMultipleRows = false;
    this.selectAllRows = false
    this.selectedRows = [];
    this.numSelectedRows = 0;

    this.serviceData = this.serviceDataConHistorico;

    let thereIsHistoricalRegister;
    this.serviceData.forEach(service => {
      if (service.fechabaja != null) {
        thereIsHistoricalRegister = true;
      }
    });

    if (thereIsHistoricalRegister != true) {
      this.historico = false;
      //Mensaje informativo en caso de que no haya registros eliminados.
      this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("facturacion.maestros.tiposproductosservicios.nohistorico"));

    }
  }

  openTab(selectedRow) {
    this.progressSpinner = true;
    let servicioItem: ListaServiciosItems = selectedRow;
    sessionStorage.setItem("servicioBuscador", JSON.stringify(servicioItem));
    this.router.navigate(["/fichaServicios"]);
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
  //FIN METODOS COMPONENTE

  //INICIO SERVICIOS
  checkActivarDesactivar(selectedRows){
    let msg = null;
	  msg = this.commonsService.checkPermisos(this.permisoEliminarReactivarServicios, undefined);

	  if (msg != null) {
	    this.msgs = msg;
	  } else {
	    this.activarDesactivar(selectedRows);
    }
  }

  //Metodo para activar/desactivar servicios mediante borrado logico (es decir fechabaja == null esta activo lo contrario inactivo) en caso de que tenga alguna solicitud ya existente, en caso contrario se hara borrado fisico (DELETE)
  activarDesactivar(selectedRows) {
    let keyConfirmation = "deletePlantillaDoc";
    let mensaje;
    if (selectedRows[0].fechabaja != null) {
      mensaje = this.translateService.instant("facturacion.maestros.tiposproductosservicios.reactivarconfirm");
    } else if (selectedRows[0].fechabaja == null) {
      mensaje = this.translateService.instant("messages.deleteConfirmation");
    }

    this.confirmationService.confirm({
      key: keyConfirmation,
      message: mensaje,
      icon: "fa fa-trash-alt",
      accept: () => {
        this.progressSpinner = true;
        let listaServiciosDTO = new ListaServiciosDTO();
        listaServiciosDTO.listaServiciosItems = selectedRows;
        this.subscriptionActivarDesactivarServicios = this.sigaServices.post("serviciosBusqueda_activarDesactivar", listaServiciosDTO).subscribe(
          response => {
            if (response.status == 200) {
              this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            } else {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
            }
          },
          err => {
            this.progressSpinner = false;
          },
          () => {
            this.selectedRows = [];
            this.progressSpinner = false;
            this.historico = false;
            this.selectMultipleRows = false;
            this.selectAllRows = false;
            this.busqueda.emit(true);
          }
        );
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  getPermisoSuscribir(){
    this.commonsService
			.checkAcceso(procesos_PyS.fichaCompraSuscripcion)
			.then((respuesta) => {
				this.permisoSuscripcion = respuesta;
			})
			.catch((error) => console.error(error));
  }

  //FIN SERVICIOS

}
