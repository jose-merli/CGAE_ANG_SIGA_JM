import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../../commons/translate';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-detalle-tarjeta-precio-ficha-servicios-facturacion',
  templateUrl: './detalle-tarjeta-precio-ficha-servicios-facturacion.component.html',
  styleUrls: ['./detalle-tarjeta-precio-ficha-servicios-facturacion.component.scss']
})
export class DetalleTarjetaPrecioFichaServiciosFacturacionComponent implements OnInit, OnDestroy {

  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga

  //Variables p-table
  @ViewChild("preciosTabla") preciosTabla; //Referencia a la tabla de precios del html
  colsPrecios: any = []; //Columnas tabla precios
  preciosDatos: any[] = []; //Datos de la tabla
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
  edit: boolean = true; //Usado para ocultar/mostrar en html, etc.
  nuevo: boolean = false; //Usado para ocultar/mostrar en html, etc.

  //Suscripciones
  //subscriptionServicesList: Subscription;

  constructor(private changeDetectorRef: ChangeDetectorRef, private sigaServices: SigaServices, private persistenceService: PersistenceService, private translateService: TranslateService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    if (this.persistenceService.getPaginacion() != undefined) {
      let paginacion = this.persistenceService.getPaginacion();
      this.persistenceService.clearPaginacion();

      this.first = paginacion.paginacion;
      this.rowsPerPage = paginacion.selectedItem;
    }

    //this.getListaServicios();
    this.initrowsPerPageSelect();
    this.initcolsPrecios();
  }

  //Necesario para liberar memoria
  ngOnDestroy() {

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

  periodicidadList = [];
  //Define las columnas
  initcolsPrecios() {
    this.colsPrecios = [
      {
        field: "precio", //Campo preciosDatos (array con los datos de la tabla) que deberia ser el mismo que en la interfaz TiposServiciosItem de la tabla
        header: "precio***" //Titulo columna
      },
      {
        field: "periodicidad",
        header: "periodicidad***"
      },
      {
        field: "descripcion",
        header: "descripcion***"
      },
      {
        field: "condicion",
        header: "condicion***"
      }
    ];

    this.colsPrecios.forEach(it => this.buscadores.push(""));
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
    if (!this.preciosDatos || this.preciosDatos.length == 0) return false;
    else return true;
  }

  //Metodo activado al pulsar sobre el checkbox Seleccionar todo
  onChangeSelectAllRows() {
    if (this.selectAllRows === true) {
      this.selectedRows = this.preciosDatos;
      this.numSelectedRows = this.preciosDatos.length;
      this.edit = false;



    } else {
      this.selectedRows = [];
      this.numSelectedRows = 0;

    }
  }

  //Metodo para aplicar logica al seleccionar filas
  onRowSelect() {

    this.numSelectedRows = this.selectedRows.length;

    if (this.selectedRows.length == 1) {
      this.edit = true;
    } else if (this.selectedRows.length > 1) {
      this.edit = false;
    }

  }

  //Metodo para aplicar logica al deseleccionar filas
  onRowUnselect() {

    this.numSelectedRows = this.selectedRows.length;
    if (this.selectedRows.length == 1) {
      this.edit = true;
    } else if (this.selectedRows.length > 1) {
      this.edit = false;
    }

  }

  //Metodo para cambiar el numero de registros mostrados por pantalla 
  onChangeRowsPerPages(event) {
    this.rowsPerPage = event.value;
    this.changeDetectorRef.detectChanges();
    this.preciosTabla.reset();
  }

  //Metodo para añadir una fila para crear un nuevo precio para el servicio
  newRegister() {
    this.newRegisterRow = true;
    this.numSelectedRows = 0;
    this.selectedRows = [];
    this.selectAllRows = false;
    this.selectMultipleRows = false;
    this.edit = true;
    this.nuevo = true;

    /* let nuevoDato = {
      precio: 0,
      periodicidad: this.comboItem[0].value,//COMBO CON OPCIONES MESES
      descripcion: "",
      condicion: this.comboItem[0].value,//COMBO CONDICIONES SUSCRIPCION
      nuevo: ""
    }; */
    let nuevoDato = {
      precio: 0,
      periodicidad: "provisional",//COMBO CON OPCIONES MESES
      descripcion: "",
      condicion: "provisional",//COMBO CONDICIONES SUSCRIPCION
      nuevo: ""
    };

    this.preciosDatos.unshift(nuevoDato);
  }

  //Metodo para eliminar en caso de que sea necesario la fila añadida por newRegister
  removeNewRegister() {
    this.edit = false;
    this.nuevo = false;
    this.newRegisterRow = false;

    //this.getListaServicios();
  }

  //Metodo que guarda la fila que esta siendo editada en un array para mandarla a posteriori al back
  preciosParaEditarCrear = [];
  emptyDescripcion: boolean;
  changeTableField(row) {
    this.edit = true;
    if (row.descripcion == "") {
      this.emptyDescripcion = true;
    } else {
      this.emptyDescripcion = false;
    }

    if (this.preciosParaEditarCrear.length > 0) {
      let indexRow = this.preciosParaEditarCrear.findIndex(servicio => (servicio.idservicio == row.idservicio && servicio.idtiposervicios == row.idtiposervicios))
      if (indexRow != -1) {
        this.preciosParaEditarCrear[indexRow] = row;
      } else {
        this.preciosParaEditarCrear.push(row);
      }
    } else if (this.preciosParaEditarCrear.length == 0) {
      this.preciosParaEditarCrear.push(row);
    }
  }

  //Metodo que reestablece la informacion original de la tabla al haber editado algun dato.
  resetToOriginalData() {
    this.edit = false;
    this.nuevo = false;
    this.preciosParaEditarCrear = [];
    this.selectedRows = [];
    this.numSelectedRows = 0;
    //this.getListaServicios();
  }

  guardar() {
    /*   if (this.nuevo) {
        this.crearServicio(this.preciosParaEditarCrear);
      } else if (!this.nuevo) {
        this.modificarServicio(this.preciosParaEditarCrear);
      } */
  }
  //FIN METODOS P-TABLE

}
