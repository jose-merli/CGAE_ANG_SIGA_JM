import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { ComboObject } from '../../../../models/ComboObject';
import { TiposProductosObject } from '../../../../models/TiposProductosObject';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-tipos-productos',
  templateUrl: './tipos-productos.component.html',
  styleUrls: ['./tipos-productos.component.scss']
})
export class TiposProductosComponent implements OnInit, OnDestroy {
  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga

  //Variables p-table
  @ViewChild("productsTable") productsTable; //Referencia a la tabla de productos del html
  colsProducts: any = []; //Columnas tabla productos
  productData: any[] = []; //Datos de la tabla
  selectedRows; //Datos de las filas seleccionadas.
  numSelectedRows: number = 0; //Se usa para mostrar visualmente el numero de filas seleccionadas
  selectMultipleRows: boolean = false; //Seleccion multiples filas de la tabla
  selectAllRows: boolean = false; //Selecciona todas las filas de la pagina actual de la tabla
  rowsPerPage: number = 10; //Define el numero de filas mostradas por pagina
  rowsPerPageSelectValues: any[] = []; //Valores del combo Mostrar X registros
  first = 0;
  buscadores = [];

  //Variables control
  newRegisterRow: boolean = false; //Para desactivar por ejemplo el boton nuevo una vez añadida una fila impidiendo que se añada mas de una
  historico: boolean = false; //Indica si se estan mostrando historicos o no para por ejemplo ocultar/mostrar los botones de historico.
  edit: boolean = true; //Usado para ocultar/mostrar en html, etc.
  nuevo: boolean = false; //Usado para ocultar/mostrar en html, etc.
  //Variables para mostrar boton reactivar o eliminar
  numSelectedAbleRegisters: number = 0;
  numSelectedDisableRegisters: number = 0;

  //Suscripciones
  subscriptionProductsList: Subscription;
  subscriptionEnableUnableProducts: Subscription;
  subscriptionProductTypeSelectValues: Subscription;
  subscriptionCreateAProduct: Subscription;
  subscriptionEditAProduct: Subscription;

  constructor(private changeDetectorRef: ChangeDetectorRef, private sigaServices: SigaServices, private persistenceService: PersistenceService, private translateService: TranslateService, private confirmationService: ConfirmationService) {

  }

  ngOnInit() {
    if (this.persistenceService.getPaginacion() != undefined) {
      let paginacion = this.persistenceService.getPaginacion();
      this.persistenceService.clearPaginacion();

      this.first = paginacion.paginacion;
      this.rowsPerPage = paginacion.selectedItem;
    }

    this.getListaProductos();
    this.initrowsPerPageSelect();
    this.initColsProducts();
    this.getComboTiposProductos();
  }

  //Necesario para liberar memoria
  ngOnDestroy() {
    if (this.subscriptionProductsList)
      this.subscriptionProductsList.unsubscribe();
    if (this.subscriptionEnableUnableProducts)
      this.subscriptionEnableUnableProducts.unsubscribe();
    if (this.subscriptionProductTypeSelectValues)
      this.subscriptionProductTypeSelectValues.unsubscribe();
    if (this.subscriptionCreateAProduct)
      this.subscriptionCreateAProduct.unsubscribe();
    if (this.subscriptionEditAProduct)
      this.subscriptionEditAProduct.unsubscribe();
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
        field: "descripciontipo", //Campo productData (array con los datos de la tabla) que deberia ser el mismo que en la interfaz TiposProductosItem de la tabla
        header: "facturacion.maestros.tiposproductosservicios.categoria" //Titulo columna
      },
      {
        field: "descripcion",
        header: "facturacion.maestros.tiposproductosservicios.nombre"
      }
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
      this.edit = false;

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

    if (this.selectedRows.length == 1) {
      this.edit = true;
    } else if (this.selectedRows.length > 1) {
      this.edit = false;
    }

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
    if (this.selectedRows.length == 1) {
      this.edit = true;
    } else if (this.selectedRows.length > 1) {
      this.edit = false;
    }
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

  //Metodo para añadir una fila para crear un nuevo producto
  newRegister() {
    this.newRegisterRow = true;
    this.numSelectedRows = 0;
    this.selectedRows = [];
    this.selectAllRows = false;
    this.selectMultipleRows = false;
    this.edit = true;
    this.nuevo = true;

    let nuevoDato = {
      descripciontipo: "",
      descripcion: "",
      idtipoproducto: this.comboItem[0].value,
      nuevo: ""
    };

    this.productData.unshift(nuevoDato);
  }

  //Metodo para eliminar en caso de que sea necesario la fila añadida por newRegister
  removeNewRegister() {
    this.edit = false;
    this.nuevo = false;
    this.newRegisterRow = false;

    this.getListaProductos();
  }

  //Metodo que guarda la fila que esta siendo editada en un array para mandarla a posteriori al back
  productsToEditCreate = [];
  emptyDescripcion: boolean;
  changeTableField(row) {
    this.edit = true;
    if (row.descripcion == "") {
      this.emptyDescripcion = true;
    } else {
      this.emptyDescripcion = false;
    }

    if (this.productsToEditCreate.length > 0) {
      let indexRow = this.productsToEditCreate.findIndex(producto => (producto.idproducto == row.idproducto && producto.idtipoproducto == row.idtipoproducto))
      if (indexRow != -1) {
        this.productsToEditCreate[indexRow] = row;
      } else {
        this.productsToEditCreate.push(row);
      }
    } else if (this.productsToEditCreate.length == 0) {
      this.productsToEditCreate.push(row);
    }
  }

  //Metodo que reestablece la informacion original de la tabla al haber editado algun dato.
  resetToOriginalData() {
    this.edit = false;
    this.nuevo = false;
    this.productsToEditCreate = [];
    this.selectedRows = [];
    this.numSelectedRows = 0;
    this.getListaProductos();
  }

  guardar() {
    if (this.nuevo) {
      this.crearProducto(this.productsToEditCreate);
    } else if (!this.nuevo) {
      this.modificarProducto(this.productsToEditCreate);
    }
  }
  //FIN METODOS P-TABLE

  //INICIO METODOS SERVICIOS

  tiposProductosObject: TiposProductosObject;

  //Metodo para obtener los datos de la tabla productos activos
  getListaProductos() {
    this.numSelectedRows = 0;
    this.selectedRows = [];
    this.progressSpinner = true;
    this.newRegisterRow = false;
    this.edit = false;
    this.productsToEditCreate = [];
    this.historico = false;

    this.selectAllRows = false;
    this.selectMultipleRows = false;

    this.subscriptionProductsList = this.sigaServices.get("tiposProductos_searchListadoProductos").subscribe(
      tiposProductosObject => {
        this.progressSpinner = false;

        this.tiposProductosObject = tiposProductosObject;
        this.productData = this.tiposProductosObject.tiposProductosItems;

        if (tiposProductosObject.error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }

        this.productsTable.paginator = true;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  //Metodo para obtener los datos de la tabla productos tanto activos como no activos
  getListaProductosHistorico() {
    this.historico = true;
    this.persistenceService.setHistorico(this.historico);
    this.selectMultipleRows = false;
    this.selectAllRows = false
    this.selectedRows = [];
    this.productsToEditCreate = [];
    this.edit = false;
    this.numSelectedRows = 0;
    this.newRegisterRow = false;
    this.progressSpinner = true;

    this.subscriptionProductsList = this.sigaServices.get("tiposProductos_searchListadoProductosHistorico").subscribe(
      tiposProductosObject => {
        this.progressSpinner = false;

        this.tiposProductosObject = tiposProductosObject;
        this.productData = this.tiposProductosObject.tiposProductosItems;

        if (tiposProductosObject.error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }

        this.productsTable.paginator = true;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
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
        this.progressSpinner = false;
      }
    );
  }

  //Metodo para obtener los valores del combo de tipos de productos (columna categoria)
  comboObject: ComboObject;
  comboItem: ComboItem[];
  getComboTiposProductos() {
    this.progressSpinner = true;

    this.subscriptionProductTypeSelectValues = this.sigaServices.get("tiposProductos_comboProducto").subscribe(
      ProductTypeSelectValues => {
        this.progressSpinner = false;

        this.comboObject = ProductTypeSelectValues;
        this.comboItem = this.comboObject.combooItems;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  //Metodo para crear un nuevo registro producto en bd
  crearProducto(productsToEditCreate) {
    this.progressSpinner = true;
    let tiposProductosObject = new TiposProductosObject();
    tiposProductosObject.tiposProductosItems = productsToEditCreate;
    this.subscriptionCreateAProduct = this.sigaServices.post("tiposProductos_crearProducto", tiposProductosObject).subscribe(
      response => {
        if (JSON.parse(response.body).error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }
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
        this.progressSpinner = false;
        this.historico = false;
        this.selectMultipleRows = false;
        this.selectAllRows = false;
        this.edit = false;
        this.selectedRows = []
        this.productsToEditCreate = [];
        this.nuevo = false;
        this.getListaProductos();
      }
    );
  }

  //Metodo para modificar la descripcion de uno o multiples productos en bd
  modificarProducto(productsToEditCreate) {
    this.progressSpinner = true;
    let tiposProductosObject = new TiposProductosObject();
    tiposProductosObject.tiposProductosItems = productsToEditCreate;
    this.subscriptionEditAProduct = this.sigaServices.post("tiposProductos_modificarProducto", tiposProductosObject).subscribe(
      response => {
        if (JSON.parse(response.body).error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }
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
        this.progressSpinner = false;
        this.historico = false;
        this.selectMultipleRows = false;
        this.selectAllRows = false;
        this.edit = false;
        this.selectedRows = []
        this.productsToEditCreate = [];
        this.nuevo = false;
        this.getListaProductos();
      }
    );
  }


  //Metodo para activar/desactivar productos (es decir fechabaja == null esta activo lo contrario inactivo)
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
        let tiposProductosObject = new TiposProductosObject();
        tiposProductosObject.tiposProductosItems = selectedRows
        this.subscriptionEnableUnableProducts = this.sigaServices.post("tiposProductos_activarDesactivarProducto", tiposProductosObject).subscribe(
          response => {
            if (JSON.parse(response.body).error.code == 500) {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
            } else {
              this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            }
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
            this.getListaProductos();
            this.progressSpinner = false;
            this.historico = false;
            this.selectMultipleRows = false;
            this.selectAllRows = false;
            this.edit = false;
            this.nuevo = false;
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
  //FIN METODOS SERVICIOS

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
}
