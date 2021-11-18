import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../../commons/translate';
import { ComboObject } from '../../../../../models/ComboObject';
import { PreciosServicioObject } from '../../../../../models/PreciosServicioObject';
import { ServicioDetalleItem } from '../../../../../models/ServicioDetalleItem';
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

  //Variables tarjeta
  @Input() servicio: ServicioDetalleItem; //Servicio obtenido de la fila del buscador de servicios en la cual pulsamos el enlace a la ficha servicios.
  periodicidadObject: ComboObject;
  condicionesSuscripcionObject: ComboObject;

  //Variables control
  aGuardar: boolean = false; //Usada en condiciones que validan la obligatoriedad, definida al hacer click en el boton guardar
  obligatoriosNoRellenos: number = 0;
  newRegisterRow: boolean = false; //Para desactivar por ejemplo el boton nuevo una vez añadida una fila impidiendo que se añada mas de una
  edit: boolean = false; //Usado para ocultar/mostrar en html, etc.
  nuevo: boolean = false; //Usado para ocultar/mostrar en html, etc.

  //Suscripciones
  subscriptionListaPrecios: Subscription;
  subscriptionPeriodicidadList: Subscription;
  subscriptionCondicionesSelect: Subscription;
  subscriptionCrearEditarPrecios: Subscription;
  subscriptionEliminarPrecios: Subscription;

  constructor(private changeDetectorRef: ChangeDetectorRef, private sigaServices: SigaServices, private persistenceService: PersistenceService, private translateService: TranslateService, private confirmationService: ConfirmationService, private router: Router) { }

  ngOnInit() {
    if (this.persistenceService.getPaginacion() != undefined) {
      let paginacion = this.persistenceService.getPaginacion();
      this.persistenceService.clearPaginacion();

      this.first = paginacion.paginacion;
      this.rowsPerPage = paginacion.selectedItem;
    }

    this.initrowsPerPageSelect();
    this.initcolsPrecios();
    this.getListaPrecios();
    this.getComboPeriodicidad();
    this.getComboCondicionSuscripcion();

    //Si hemos pulsado en el boton nueva condicion nos habra llevado a la ficha consultas en la cual habremos creado una nueva consulta y al darle a guardar tendra en cuenta que veniamos de fichaServicios
    //Y nos traera de vuelta con el combo de condiciones fijado a la recien creada consulta
    if(sessionStorage.getItem("vieneDeNuevaCondicion") == "true"){
      let maxId;
      maxId = Math.max.apply(Math, this.condicionesSuscripcionObject.combooItems.map(function(o) { return o.value; }))
      let precioDetalle = JSON.parse(sessionStorage.getItem("precioDetalle"));
      //Recorremos los precios para cambiarle el idconsulta al precio el cual seleccionamos previamente a la hora de crear nueva condicion
      this.preciosDatos.forEach(precio => {
        //Comprobamos usando la pk el precio correcto
        if(precioDetalle.idtiposervicios == precio.idtiposervicios && precioDetalle.idservicio == precio.idservicio && precioDetalle.idserviciosinstitucion == precio.idserviciosinstitucion 
          && precioDetalle.idperiodicidad == precio.idperiodicidad && precioDetalle.idpreciosservicios == precio.idpreciosservicios){
            precio.idconsulta = maxId;
          }
      });  
    }
  }

  //Necesario para liberar memoria
  ngOnDestroy() {
    if (this.subscriptionListaPrecios)
      this.subscriptionListaPrecios.unsubscribe();
    if (this.subscriptionPeriodicidadList)
      this.subscriptionCondicionesSelect.unsubscribe();
    if (this.subscriptionCondicionesSelect)
      this.subscriptionCondicionesSelect.unsubscribe();
    if (this.subscriptionCrearEditarPrecios)
      this.subscriptionCrearEditarPrecios.unsubscribe();
    if (this.subscriptionEliminarPrecios)
      this.subscriptionEliminarPrecios.unsubscribe();
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
  initcolsPrecios() {
    this.colsPrecios = [
      {
        field: "precio", //Campo preciosDatos (array con los datos de la tabla) que deberia ser el mismo que en la interfaz TiposServiciosItem de la tabla
        header: "form.busquedaCursos.literal.precio" //Titulo columna
      },
      {
        field: "descripcionperiodicidad",
        header: "facturacion.servicios.fichaservicio.periodicidadcoltablaprecios"
      },
      {
        field: "descripcionprecio",
        header: "general.description"
      },
      {
        field: "descripcionconsulta",
        header: "informesycomunicaciones.modelosdecomunicacion.fichaModeloComuncaciones.condicion"
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

    if (this.selectedRows.length == 1 && !this.nuevo) {
      this.edit = true;
    } else if (this.selectedRows.length > 1) {
      this.edit = false;
    }

  }

  //Metodo para aplicar logica al deseleccionar filas
  onRowUnselect() {

    this.numSelectedRows = this.selectedRows.length;
    if (this.nuevo) {
      this.edit = false;
    } else if (!this.nuevo) {
      if (this.selectedRows.length == 1) {
        this.edit = true;
      } else if (this.selectedRows.length > 1 || this.selectedRows.length == 0) {
        this.edit = false;
      }
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
    this.nuevo = true;
    this.edit = false;

    let nuevoDato = {
      idserviciosinstitucion: this.preciosDatos[0].idserviciosinstitucion,
      idtiposervicios: this.servicio.idtiposervicios,
      idservicio: this.servicio.idservicio,
      precio: "0",
      idperiodicidad: this.periodicidadObject.combooItems[0].value,
      descripcionprecio: "",
      idcondicion: this.condicionesSuscripcionObject.combooItems[0].value,
      descripcionperiodicidad: this.periodicidadObject.combooItems[0].label,
      descripcionconsulta: this.condicionesSuscripcionObject.combooItems[0].label,
      pordefecto: "0",
      idperiodicidadoriginal: this.periodicidadObject.combooItems[0].value,
      nuevo: "1"
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
  changeTableField(row) {
    this.edit = true;

    //Cambiar la descripcionperiodicidad de la row de esa fila para que al deseleccionarla no vuelva a la original
    //1. Obtengo la descripcion
    let descripcionperiodicidad;
    this.periodicidadObject.combooItems.forEach(periodicidad => {
      if (row.idperiodicidad == periodicidad.value) {
        descripcionperiodicidad = periodicidad.label;
      }
    });
    //2. Le cambio la descripcion a la fila
    this.preciosDatos.forEach(precioFila => {
      if (precioFila.idpreciosservicios == row.idpreciosservicios && precioFila.idperiodicidadoriginal == row.idperiodicidadoriginal && precioFila.idtiposervicios == row.idtiposervicios && precioFila.idservicio == row.idservicio && precioFila.idserviciosinstitucion == row.idserviciosinstitucion) {
        precioFila.descripcionperiodicidad = descripcionperiodicidad;
      }
    });

    //Cambiar la descripcioncondicion de la row de esa fila para que al deseleccionarla no vuelva a la original
    //1. Obtengo la descripcion
    let descripcioncondicion;
    this.condicionesSuscripcionObject.combooItems.forEach(condicion => {
      if (row.idcondicion == condicion.value) {
        descripcioncondicion = condicion.label;
      }
    });
    //2. Le cambio la descripcion a la fila
    this.preciosDatos.forEach(precioFila => {
      if (precioFila.idpreciosservicios == row.idpreciosservicios && precioFila.idperiodicidadoriginal == row.idperiodicidadoriginal && precioFila.idtiposervicios == row.idtiposervicios && precioFila.idservicio == row.idservicio && precioFila.idserviciosinstitucion == row.idserviciosinstitucion) {
        precioFila.descripcionconsulta = descripcioncondicion;
      }
    });

    //el precio no te deja escribir hasta que quitas el simbolo del euro


    if (this.preciosParaEditarCrear.length > 0) {
      let indexRow = this.preciosParaEditarCrear.findIndex(precioFila => (precioFila.idpreciosservicios == row.idpreciosservicios && precioFila.idperiodicidadoriginal == row.idperiodicidadoriginal && precioFila.idtiposervicios == row.idtiposervicios && precioFila.idservicio == row.idservicio && precioFila.idserviciosinstitucion == row.idserviciosinstitucion))
      if (indexRow != -1) {
        this.preciosParaEditarCrear[indexRow] = row;
      } else {
        this.preciosParaEditarCrear.push(row);
      }
    } else if (this.preciosParaEditarCrear.length == 0) {
      this.preciosParaEditarCrear.push(row);
    }
  }

  changeTableFieldRowNueva(row) {
    this.edit = false;

    //Cambiar la descripcionperiodicidad de la row de esa fila para que al deseleccionarla no vuelva a la original
    //1. Obtengo la descripcion
    let descripcionperiodicidad;
    this.periodicidadObject.combooItems.forEach(periodicidad => {
      if (row.idperiodicidad == periodicidad.value) {
        descripcionperiodicidad = periodicidad.label;
      }
    });
    //2. Le cambio la descripcion a la fila
    this.preciosDatos.forEach(precioFila => {
      if (precioFila.idpreciosservicios == row.idpreciosservicios && precioFila.idperiodicidadoriginal == row.idperiodicidadoriginal && precioFila.idtiposervicios == row.idtiposervicios && precioFila.idservicio == row.idservicio && precioFila.idserviciosinstitucion == row.idserviciosinstitucion) {
        precioFila.descripcionperiodicidad = descripcionperiodicidad;
      }
    });

    //Cambiar la descripcioncondicion de la row de esa fila para que al deseleccionarla no vuelva a la original
    //1. Obtengo la descripcion
    let descripcioncondicion;
    this.condicionesSuscripcionObject.combooItems.forEach(condicion => {
      if (row.idcondicion == condicion.value) {
        descripcioncondicion = condicion.label;
      }
    });
    //2. Le cambio la descripcion a la fila
    this.preciosDatos.forEach(precioFila => {
      if (precioFila.idpreciosservicios == row.idpreciosservicios && precioFila.idperiodicidadoriginal == row.idperiodicidadoriginal && precioFila.idtiposervicios == row.idtiposervicios && precioFila.idservicio == row.idservicio && precioFila.idserviciosinstitucion == row.idserviciosinstitucion) {
        precioFila.descripcionconsulta = descripcioncondicion;
      }
    });

    //el precio no te deja escribir hasta que quitas el simbolo del euro

    if (this.preciosParaEditarCrear.length > 0) {
      let indexRow = this.preciosParaEditarCrear.findIndex(precioFila => (precioFila.idpreciosservicios == row.idpreciosservicios && precioFila.idperiodicidadoriginal == row.idperiodicidadoriginal && precioFila.idtiposervicios == row.idtiposervicios && precioFila.idservicio == row.idservicio && precioFila.idserviciosinstitucion == row.idserviciosinstitucion))
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
    this.getListaPrecios();
  }

  guardar() {
    this.aGuardar = true;

    this.preciosParaEditarCrear.forEach(precios => {
      if (precios.precio == '') {
        this.obligatoriosNoRellenos++;
      }

      if (precios.idperiodicidad == null) {
        this.obligatoriosNoRellenos++;
      }

      if (precios.idcondicion == null && precios.pordefecto == "0") {
        this.obligatoriosNoRellenos++;
      }
    });

    if (this.obligatoriosNoRellenos == 0) {
      this.crearEditarPrecios(this.preciosParaEditarCrear);
    } else {
      this.obligatoriosNoRellenos = 0;
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
    }
  }
  //FIN METODOS P-TABLE


  //INICIO METODOS SERVICIOS

  preciosServicioObject: PreciosServicioObject;

  //Metodo para obtener los datos de la tabla precios del servicio
  getListaPrecios() {
    this.numSelectedRows = 0;
    this.selectedRows = [];
    this.progressSpinner = true;
    this.newRegisterRow = false;
    this.edit = false;
    this.preciosParaEditarCrear = [];

    this.selectAllRows = false;
    this.selectMultipleRows = false;

    this.subscriptionListaPrecios = this.sigaServices.post("fichaServicio_obtenerPreciosServicio", this.servicio).subscribe(
      preciosServicioObject => {
        this.progressSpinner = false;

        this.preciosServicioObject = JSON.parse(preciosServicioObject.body);
        this.preciosDatos = this.preciosServicioObject.fichaTarjetaPreciosItem;

        if (JSON.parse(preciosServicioObject.body).error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }

        this.preciosTabla.paginator = true;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  //Metodo para obtener los valores del combo periodicidad
  getComboPeriodicidad() {
    this.progressSpinner = true;

    this.subscriptionPeriodicidadList = this.sigaServices.get("fichaServicio_comboPeriodicidad").subscribe(
      periodicidadTypeSelectValues => {
        this.progressSpinner = false;

        this.periodicidadObject = periodicidadTypeSelectValues;

      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  //Metodo para obtener los valores del combo condicion de suscripcion
  getComboCondicionSuscripcion() {
    this.progressSpinner = true;

    this.subscriptionCondicionesSelect = this.sigaServices.get("fichaServicio_comboCondicionSuscripcion").subscribe(
      CondicionSuscripcionValues => {
        this.condicionesSuscripcionObject = CondicionSuscripcionValues;

        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  //Metodo para crear/editar precios en bd
  crearEditarPrecios(preciosParaEditarCrear) {
    this.progressSpinner = true;
    let preciosServicioObject = new PreciosServicioObject();
    preciosServicioObject.fichaTarjetaPreciosItem = preciosParaEditarCrear;
    this.subscriptionCrearEditarPrecios = this.sigaServices.post("fichaServicio_crearEditarPrecios", preciosServicioObject).subscribe(
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
        this.selectMultipleRows = false;
        this.selectAllRows = false;
        this.edit = false;
        this.selectedRows = []
        this.preciosParaEditarCrear = [];
        this.nuevo = false;
        this.getListaPrecios();
      }
    );
  }

  comprobacionEliminar(selectedRows) {
    let hayPrecioPorDefecto: boolean = false;
    selectedRows.forEach(precios => {
      if (precios.pordefecto == "1") {
        hayPrecioPorDefecto = true;
      }
    });

    if (!hayPrecioPorDefecto) {
      this.eliminar(selectedRows);
    } else if (hayPrecioPorDefecto) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), "El precio por defecto no puede ser eliminado, por favor deseleccionelo. ***");
    }
  }


  //Metodo para eliminar precios del servicio
  eliminar(selectedRows) {
    let keyConfirmation = "deletePrecio";
    let mensaje = this.translateService.instant("messages.deleteConfirmation");


    this.confirmationService.confirm({
      key: keyConfirmation,
      message: mensaje,
      icon: "fa fa-trash-alt",
      accept: () => {
        this.progressSpinner = true;
        let preciosServicioObject = new PreciosServicioObject();
        preciosServicioObject.fichaTarjetaPreciosItem = selectedRows;
        this.subscriptionEliminarPrecios = this.sigaServices.post("fichaServicio_eliminarPrecios", preciosServicioObject).subscribe(
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
            this.getListaPrecios();
            this.progressSpinner = false;
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

  nuevacondicion(){
    sessionStorage.setItem("servicioDetalle", JSON.stringify(this.servicio));
    sessionStorage.setItem("precioDetalle", JSON.stringify(this.selectedRows));
    this.router.navigate(["/fichaConsulta"]);
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
