import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TiposProductosObject } from '../../../../models/TiposProductosObject';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-tipos-productos',
  templateUrl: './tipos-productos.component.html',
  styleUrls: ['./tipos-productos.component.scss']
})
export class TiposProductosComponent implements OnInit {
  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl
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
  rowsPerPageSelectValues; //Valores del combo Mostar X registros
  edit: boolean = true; //?

  constructor(private changeDetectorRef: ChangeDetectorRef, private sigaServices: SigaServices) {
    this.getListaProductos();
  }

  ngOnInit() {
    this.initColsProducts();
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
        field: "descripciontipo",//Campo interfaz TiposProductosItem
        header: "facturacion.maestros.tiposproductos.categoria" //Titulo columna
      },
      {
        field: "descripcion",
        //value: "idInstitucion",//??
        header: "facturacion.maestros.tiposservicios.nombre"
      }
    ];
  }

  //Activa/Desactiva la paginacion dependiendo de si el array viene vacio o no.
  enablePagination() {
    if (!this.productData || this.productData.length == 0) return false;
    else return true;
  }

  //Metodo para aplicar logica al seleccionar filas
  onRowSelect(selectedRows) { //Dudas sobre este metodo
    if (this.selectMultipleRows && !this.selectAllRows) {

      if (selectedRows[this.selectedRows.length - 1].idInstitucion == "2000") { //Para que es esto?
        this.selectedRows.splice(this.selectedRows.length - 1, 1);
      }

      if (this.selectMultipleRows) {
        this.selectedRows = this.selectedRows.length;
      } else {
        this.edit = false;
        this.selectedRows = this.selectedRows.length;
      }
    } else if (!this.selectMultipleRows && this.selectAllRows) {
      this.selectedRows = [];
      this.productData.forEach(element => {
        if (element.idInstitucion != "2000") {
          this.selectedRows.push(element);
        }
      });
      this.numSelectedRows = this.selectedRows.length;
    }
  }

  //Metodo para aplicar logica al deseleccionar filas
  onRowUnselect(selectedDatos) {
    this.numSelectedRows = selectedDatos.length;
  }


  /* onRowSelectTipos(selectedDatos) {

    this.datos.forEach(element => {
      element.isMod = false;
    });

    let id = this.datos.findIndex(x => x.idTipoCV == selectedDatos[0].idTipoCV && x.idTipoCvSubtipo1 ==
      selectedDatos[0].idTipoCvSubtipo1 && x.idInstitucion == selectedDatos[0].idInstitucion);
    this.datos[id].isMod = true;

    this.numSelected = this.selectedDatos.length;

    if(this.selectedDatos.length > 1){
      this.datos.forEach(element => {
        element.isMod = false;
      });
     
    }
    else{
      this.editable = true;
    }
  } */

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

  onChangeSelectAllRows() {
    this.selectedRows = [];
    if (this.selectAllRows) {
      this.selectMultipleRows = false;
      this.productData.forEach(producto => {
        this.selectedRows.push(producto);
      });
      this.numSelectedRows = this.selectedRows.length;
    } else {
      //this.selectedRows = [];
      this.numSelectedRows = 0;
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

    this.sigaServices.get("tiposProductos_searchListadoProductos").subscribe(
      tiposProductosObject => {
        this.progressSpinner = false;
        //this.tiposProductosObject = tiposProductosObject;
        this.tiposProductosObject = JSON.parse(tiposProductosObject["body"]);
        this.productData = this.tiposProductosObject.tiposProductosItems;


        /*  if (error != null && error.description != null) {​​​}​​​
      */
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
  //FIN METODOS SERVICIOS

  //Borra el mensaje de notificacion p-growl mostrado en la esquina superior derecha cuando pasas el puntero del raton sobre el
  clear() {
    this.msgs = [];
  }
}
