import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../commons/translate';
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
  productData: any[]; //Datos de la tabla any provisional
  selectedRows; //Datos de las filas seleccionadas.
  numSelectedRows: number = 0; //Se usa para mostrar visualmente el numero de filas seleccionadas
  selectMultipleRows: boolean = false; //Seleccion multiples filas de la tabla
  selectAllRows: boolean = false; //Selecciona todas las filas de la pagina actual de la tabla
  rowsPerPage: number = 10; //Define el numero de filas mostradas por pagina
  rowsPerPageSelectValues: any[]; //Valores del combo Mostar X registros
  edit: boolean = true; //?


  first = 0;
  buscadores = [];

  //Suscripciones
  subscriptionProductsList: Subscription;

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
    } else {
      this.selectedRows = [];
      this.numSelectedRows = 0;
    }
  }

  //Metodo para aplicar logica al seleccionar filas
  onRowSelect() {
    this.numSelectedRows = this.selectedRows.length;
  }

  //Metodo para aplicar logica al deseleccionar filas
  onRowUnselect() {
    this.numSelectedRows = this.selectedRows.length;
  }

  //Metodo que guarda la edicion del campo de la tabla editado.
  productsToEdit = [];
  originalProducts; //Productos traidos de la busqueda/carga inicial
  //MODIFICAR CONDICIONES
  changeTableField(row) {
    this.edit = true;

    let id = this.productData.findIndex(x => x.idTipoCV == row.idTipoCV && x.idTipoCvSubtipo1 ==
      row.idTipoCvSubtipo1 && x.idInstitucion == row.idInstitucion);
    this.productData[id].editar = true;

    if (row.idInstitucion != '2000' && (row.codigoExterno != this.originalProducts[id].codigoExterno) ||
      (row.descripcion != this.originalProducts[id].descripcion)) {

      let idEdit = this.productsToEdit.findIndex(x => x.idTipoCV == row.idTipoCV && x.idTipoCvSubtipo1 ==
        row.idTipoCvSubtipo1 && x.idInstitucion == row.idInstitucion);

      if (idEdit == -1) {
        this.productsToEdit.push(this.productData[id]);
      } else {
        this.productsToEdit[idEdit] = this.productData[id];
      }
    }
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
    //this.nuevo = false;
    this.edit = false;
    //this.historico = false;

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

  //Metodo para activar/desactivar productos
  activarDesactivar(selectedRows) {
    let keyConfirmation = "deletePlantillaDoc";

    this.confirmationService.confirm({
      key: keyConfirmation,
      message: this.translateService.instant("messages.deleteConfirmation"),
      //message: this.translateService.instant('sjcs.oficio.turnos.eliminar.mensajeConfirmacion'),
      icon: "fa fa-trash-alt",
      accept: () => {
        this.progressSpinner = true;
        let tiposProductosObject = new TiposProductosObject();
        tiposProductosObject.tiposProductosItems = this.selectedRows
        this.sigaServices.post("tiposProductos_activarDesactivarProducto", tiposProductosObject).subscribe(
          data => {
            this.selectedRows = [];
            this.getListaProductos();
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
            //this.historico = false;
            this.selectMultipleRows = false;
            this.selectAllRows = false;
            this.edit = false;
            //this.nuevo = false;
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
