import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../commons/translate';
import { ListaProductosDTO } from '../../../../models/ListaProductosDTO';
import { ListaProductosItems } from '../../../../models/ListaProductosItems';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { procesos_facturacion } from '../../../../permisos/procesos_facturacion';


@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.scss']
})
export class GestionProductosComponent implements OnInit, OnDestroy {
  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga
  @Output() busqueda = new EventEmitter<boolean>();

  //Variables p-table
  @ViewChild("productsTable") productsTable; //Referencia a la tabla de productos del html
  colsProducts: any = []; //Columnas tabla productos
  @Input() productData: any[] = []; //Datos de la tabla
  @Input() productDataSinHistorico: any[] = [];
  @Input() productDataConHistorico: any[] = []
  selectedRows; //Datos de las filas seleccionadas.
  numSelectedRows: number = 0; //Se usa para mostrar visualmente el numero de filas seleccionadas
  selectMultipleRows: boolean = false; //Seleccion multiples filas de la tabla
  selectAllRows: boolean = false; //Selecciona todas las filas de la pagina actual de la tabla
  rowsPerPage: number = 10; //Define el numero de filas mostradas por pagina
  rowsPerPageSelectValues: any[] = []; //Valores del combo Mostrar X registros
  first = 0;
  buscadores = [];

  //Variables control
  historico: boolean = false; //Indica si se estan mostrando historicos o no para por ejemplo ocultar/mostrar los botones de historico.
  //Variables para mostrar boton reactivar o eliminar
  numSelectedAbleRegisters: number = 0;
  numSelectedDisableRegisters: number = 0;

  //Permiso para acceder a la ficha de compra/suscripcion
  permisoCompra;

  //Suscripciones
  subscriptionActivarDesactivarProductos: Subscription;

  constructor(private changeDetectorRef: ChangeDetectorRef, private persistenceService: PersistenceService, 
    private translateService: TranslateService, private confirmationService: ConfirmationService, 
    private sigaServices: SigaServices, private router: Router,
    private commonsService: CommonsService) { }

  ngOnInit() {
    if (this.persistenceService.getPaginacion() != undefined) {
      let paginacion = this.persistenceService.getPaginacion();
      this.persistenceService.clearPaginacion();

      this.first = paginacion.paginacion;
      this.rowsPerPage = paginacion.selectedItem;
    }

    this.initrowsPerPageSelect();
    this.initColsProducts();
    this.getPermisoComprar();
  }

  //Necesario para liberar memoria
  ngOnDestroy() {
    if (this.subscriptionActivarDesactivarProductos)
      this.subscriptionActivarDesactivarProductos.unsubscribe();
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
  initColsProducts() {
    this.colsProducts = [
      {
        field: "categoria", //Campo productData (array con los datos de la tabla)
        header: "facturacion.productos.categoria" //Titulo columna
      },
      {
        field: "tipo",
        header: "facturacion.productos.tipo"
      },
      {
        field: "descripcion",
        header: "facturacion.productos.producto"
      },
      {
        field: "valor",
        header: "form.busquedaCursos.literal.precio"
      },
      {
        field: "iva",
        header: "facturacion.productos.iva"
      },
      {
        field: "precioiva",
        header: "facturacion.productos.precioiva"
      },
      {
        field: "formapago",
        header: "facturacion.productos.formapago"
      },
    ];

    this.colsProducts.forEach(it => this.buscadores.push(""));
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
    if (!this.productData || this.productData.length == 0) return false;
    else return true;
  }

  //Metodo activado al pulsar sobre el checkbox Seleccionar todo
  onChangeSelectAllRows() {
    if (this.selectAllRows === true) {
      this.selectedRows = this.productData;
      this.numSelectedRows = this.productData.length;

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
    this.productsTable.reset();
  }
  //FIN METODOS P-TABLE


  //INICIO METODOS COMPONENTE
  //Metodo para obtener los datos de la tabla productos activos
  getListaProductos() {
    this.numSelectedRows = 0;
    this.selectedRows = [];
    this.historico = false;

    this.selectAllRows = false;
    this.selectMultipleRows = false;

    this.productData = this.productDataSinHistorico;
  }


  //Metodo para obtener los datos de la tabla productos tanto activos como no activos
  getListaProductosHistorico() {
    this.historico = true;
    this.persistenceService.setHistorico(this.historico);
    this.selectMultipleRows = false;
    this.selectAllRows = false
    this.selectedRows = [];
    this.numSelectedRows = 0;

    this.productData = this.productDataConHistorico;

    let thereIsHistoricalRegister;
    this.productData.forEach(product => {
      if (product.fechabaja != null) {
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
    let productoItem: ListaProductosItems = selectedRow;
    sessionStorage.setItem("productoBuscador", JSON.stringify(productoItem));
    this.router.navigate(["/fichaProductos"]);
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
  //Metodo para activar/desactivar productos mediante borrado logico (es decir fechabaja == null esta activo lo contrario inactivo) en caso de que tengan una transaccion pendiente de compra o compras ya existentes, en caso contrario se hara borrado fisico (DELETE)
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
        let listaProductosDTO = new ListaProductosDTO();
        listaProductosDTO.listaProductosItems = selectedRows
        this.subscriptionActivarDesactivarProductos = this.sigaServices.post("productosBusqueda_activarDesactivar", listaProductosDTO).subscribe(
          data => {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          },
          err => {
            if (err != undefined && JSON.parse(err.error).error.description != "") {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
            } else {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
            }
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

  getPermisoComprar(){
    this.commonsService
			.checkAcceso(procesos_facturacion.fichaCompraSuscripcion)
			.then((respuesta) => {
				this.permisoCompra = respuesta;
			})
			.catch((error) => console.error(error));
  }

  checkPermisoComprar(){
    let msg = this.commonsService.checkPermisos(this.permisoCompra, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.checkFormasPago()) {
        sessionStorage.removeItem("Cliente");
        this.router.navigate(["/fichaCompraSuscripcion"]);
      } else {
        this.msgs = [
          {
            severity: "error",
            summary: this.translateService.instant(
              "facturacion.productos.ResFormasPagoNoCompatibles"
            ),
            detail: this.translateService.instant(
              "facturacion.productos.FormasPagoNoCompatibles"
            )
          }
        ];
      }
    }
  }

  checkFormasPago(){
    
    //Se extrae el atributo y se separan las distintas formas de pago.
    let formasPagoArrays: any[]= [];
    this.selectedRows.forEach(element => {
      formasPagoArrays.push(element.formapago.split(", "));
    });
    
    //Se comprueba si todas las filas seleccionadas comparten alguna forma de pago.
    let result = formasPagoArrays.shift().filter(function(v) {
      return formasPagoArrays.every(function(a) {
          return a.indexOf(v) !== -1;
      });
    });

    return result.length>0;
  }

  //FIN SERVICIOS
}
