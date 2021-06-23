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

  //Variables p-datatable
  @ViewChild("productsTable") productsTable; //Referencia a la tabla de productos del html
  colsProducts: any = []; //Columnas tabla productos
  productData: any[] = []; //Datos de la tabla any provisional
  selectedRows; //Datos de las filas seleccionadas.
  numSelectedRows: number = 0; //Se usa para mostrar visualmente el numero de filas seleccionadas
  selectMultipleRows: boolean = false; //Seleccion multiples filas de la tabla
  selectAllRows: boolean = false; //Selecciona todas las filas de la pagina actual de la tabla
  rowsPerPage: number = 10; //Define el numero de filas mostradas por pagina
  rowsPerPageSelectValues: any[] = []; //Valores del combo Mostar X registros
  historico: boolean = false; //Indica si se estan mostrando historicos o no para por ejemplo ocultar/mostrar los botones de historico.
  edit: boolean = true;
  numSelectedAbleRegisters: number = 0;
  numSelectedDisableRegisters: number = 0;
  newRegisterRow: boolean = false; //Para desactivar por ejemplo el boton nuevo una vez añadida una fila impidiendo que se añada mas de una
  nuevo: boolean = false;


  first = 0;
  buscadores = [];

  //Suscripciones
  subscriptionProductsList: Subscription;
  subscriptionEnableUnableProducts: Subscription;
  subscriptionProductTypeSelectValues: Subscription;
  subscriptionCreateAProduct: Subscription;

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

  //Necesario para liberar memoria
  ngOnDestroy() {
    this.subscriptionProductsList.unsubscribe();
    this.subscriptionEnableUnableProducts.unsubscribe();
    this.subscriptionProductTypeSelectValues.unsubscribe();
    this.subscriptionCreateAProduct.unsubscribe();
  }

  //INICIO METODOS P-DATABLE
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
        field: "descripciontipo", //Campo interfaz TiposProductosItem de la tabla
        header: "facturacion.maestros.tiposproductos.categoria" //Titulo columna
      },
      {
        field: "descripcion",
        header: "facturacion.maestros.tiposservicios.nombre"
      }
    ];

    this.colsProducts.forEach(it => this.buscadores.push(""));
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
    this.edit = true;
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
    this.edit = false;
    this.selectedRows.forEach(rows => {
      if (rows.fechabaja == null) {
        this.numSelectedAbleRegisters++;
      } else {
        this.numSelectedDisableRegisters++;
      }
    });
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
      nuevo: ""
    };

    //this.productData = [...this.productData, nuevoDato];
    this.productData.unshift(nuevoDato);
  }

  //Metodo que guarda la edicion del campo de la tabla editado.
  productsToEditCreate = [];
  changeTableField(row) {
    this.edit = true;

    if (this.productsToEditCreate.length > 0) {
      let indexRow = this.productsToEditCreate.findIndex(producto => (producto.idproducto == row.idproducto && producto.idtipoproducto == row.idtipoproducto))
      if (indexRow != -1) {
        this.productsToEditCreate[indexRow] = row;
      } else {
        this.productsToEditCreate[this.productsToEditCreate.length - 1] = row;
      }
    } else if (this.productsToEditCreate.length == 0) {
      this.productsToEditCreate.push(row);
    }


    console.log("Fila editandose", row);
    console.log("PRODUCTSTOEDIT", this.productsToEditCreate);
  }

  guardar() {
    if (this.nuevo) {
      this.crearProducto(this.productsToEditCreate);
    } else if (!this.nuevo) {

    }
  }

  //Metodo para eliminar en caso de que sea necesario la fila añadida por newRegister
  removeNewRegister() {
    this.edit = false;
    this.nuevo = false;
    this.newRegisterRow = false;

    this.getListaProductos();
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

  //Metodo para cambiar el numero de registros mostrados por pantalla 
  onChangeRowsPerPages(event) {
    this.rowsPerPage = event.value;
    this.changeDetectorRef.detectChanges();
    this.productsTable.reset();
  }
  //FIN METODOS P-DATABLE

  //INICIO METODOS SERVICIOS

  tiposProductosObject: TiposProductosObject;

  //Metodo para obtener los datos de la tabla productos
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

        let error = this.tiposProductosObject.error;
        if (error != null && error.description != null) {
        }

        this.productsTable.paginator = true;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

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

    this.subscriptionProductsList = this.sigaServices.get("tiposProductos_searchListadoProductosHistorico").subscribe(
      tiposProductosObject => {
        this.progressSpinner = false;

        this.tiposProductosObject = tiposProductosObject;
        this.productData = this.tiposProductosObject.tiposProductosItems;

        let error = this.tiposProductosObject.error;
        if (error != null && error.description != null) {
        }

        this.productsTable.paginator = true;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      },
      () => {
        let thereIsHistoricalRegister;
        console.log("PRODUCTDATA", this.productData);
        this.productData.forEach(product => {
          if (product.fechabaja != null) {
            thereIsHistoricalRegister = true;
          }
        });
        if (thereIsHistoricalRegister != true) {
          this.historico = false;
          //Mensaje informativo en caso de que no haya registros eliminados.
          this.showMessage("info", this.translateService.instant("general.message.informacion"), "No existen registros historicos");

        }
        this.progressSpinner = false;
      }
    );
  }

  //Metodo para obtener los valores del como de tipos de productos (columna categoria)
  comboObject: ComboObject;
  comboItem: ComboItem[];
  getComboTiposProductos() {
    this.progressSpinner = true;

    this.subscriptionProductTypeSelectValues = this.sigaServices.get("tiposProductos_comboProducto").subscribe(
      ProductTypeSelectValues => {
        this.progressSpinner = false;

        this.comboObject = ProductTypeSelectValues;
        this.comboItem = this.comboObject.combooItems;

        let error = this.comboObject.error;
        if (error != null && error.description != null) {
        }
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  crearProducto(productsToEditCreate) {
    this.progressSpinner = true;
    let tiposProductosObject = new TiposProductosObject();
    tiposProductosObject.tiposProductosItems = productsToEditCreate;
    this.subscriptionCreateAProduct = this.sigaServices.post("tiposProductos_crearProducto", tiposProductosObject).subscribe(
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


  //Metodo para activar/desactivar productos
  activarDesactivar(selectedRows) {
    let keyConfirmation = "deletePlantillaDoc";

    this.confirmationService.confirm({
      key: keyConfirmation,
      message: this.translateService.instant("messages.deleteConfirmation"),
      icon: "fa fa-trash-alt",
      accept: () => {
        this.progressSpinner = true;
        let tiposProductosObject = new TiposProductosObject();
        tiposProductosObject.tiposProductosItems = selectedRows
        this.subscriptionEnableUnableProducts = this.sigaServices.post("tiposProductos_activarDesactivarProducto", tiposProductosObject).subscribe(
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
