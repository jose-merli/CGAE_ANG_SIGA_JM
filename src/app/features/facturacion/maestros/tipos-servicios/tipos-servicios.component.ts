import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { ComboObject } from '../../../../models/ComboObject';
import { TiposServiciosObject } from '../../../../models/TiposServiciosObject';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-tipos-servicios',
  templateUrl: './tipos-servicios.component.html',
  styleUrls: ['./tipos-servicios.component.scss']
})
export class TiposServiciosComponent implements OnInit, OnDestroy {
  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga

  //Variables p-table
  @ViewChild("servicesTable") servicesTable; //Referencia a la tabla de servicios del html
  colsServices: any = []; //Columnas tabla servicios
  servicesData: any[] = []; //Datos de la tabla
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
  subscriptionServicesList: Subscription;
  subscriptionEnableUnableServices: Subscription;
  subscriptionServicesTypeSelectValues: Subscription;
  subscriptionCreateAService: Subscription;
  subscriptionEditAService: Subscription;

  constructor(private changeDetectorRef: ChangeDetectorRef, private sigaServices: SigaServices, private persistenceService: PersistenceService, private translateService: TranslateService, private confirmationService: ConfirmationService) {

  }

  ngOnInit() {
    if (this.persistenceService.getPaginacion() != undefined) {
      let paginacion = this.persistenceService.getPaginacion();
      this.persistenceService.clearPaginacion();

      this.first = paginacion.paginacion;
      this.rowsPerPage = paginacion.selectedItem;
    }

    this.getListaServicios();
    this.initrowsPerPageSelect();
    this.initColsServices();
    this.getComboTiposServicios();
  }

  //Necesario para liberar memoria
  ngOnDestroy() {
    if (this.subscriptionServicesList)
      this.subscriptionServicesList.unsubscribe();
    if (this.subscriptionEnableUnableServices)
      this.subscriptionEnableUnableServices.unsubscribe();
    if (this.subscriptionServicesTypeSelectValues)
      this.subscriptionServicesTypeSelectValues.unsubscribe();
    if (this.subscriptionCreateAService)
      this.subscriptionCreateAService.unsubscribe();
    if (this.subscriptionEditAService)
      this.subscriptionEditAService.unsubscribe();
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
        field: "descripciontipo", //Campo servicesData (array con los datos de la tabla) que deberia ser el mismo que en la interfaz TiposServiciosItem de la tabla
        header: "facturacion.maestros.tiposproductosservicios.categoria" //Titulo columna
      },
      {
        field: "descripcion",
        header: "facturacion.maestros.tiposproductosservicios.nombre"
      }
    ];

    this.colsServices.forEach(it => this.buscadores.push(""));
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
    if (!this.servicesData || this.servicesData.length == 0) return false;
    else return true;
  }

  //Metodo activado al pulsar sobre el checkbox Seleccionar todo
  onChangeSelectAllRows() {
    if (this.selectAllRows === true) {
      this.selectedRows = this.servicesData;
      this.numSelectedRows = this.servicesData.length;
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
    this.servicesTable.reset();
  }

  //Metodo para añadir una fila para crear un nuevo servicio
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
      idtiposervicios: this.comboItem[0].value,
      nuevo: ""
    };

    this.servicesData.unshift(nuevoDato);
  }

  //Metodo para eliminar en caso de que sea necesario la fila añadida por newRegister
  removeNewRegister() {
    this.edit = false;
    this.nuevo = false;
    this.newRegisterRow = false;

    this.getListaServicios();
  }

  //Metodo que guarda la fila que esta siendo editada en un array para mandarla a posteriori al back
  servicesToEditCreate = [];
  emptyDescripcion: boolean;
  changeTableField(row) {
    this.edit = true;
    if (row.descripcion == "") {
      this.emptyDescripcion = true;
    } else {
      this.emptyDescripcion = false;
    }

    if (this.servicesToEditCreate.length > 0) {
      let indexRow = this.servicesToEditCreate.findIndex(servicio => (servicio.idservicio == row.idservicio && servicio.idtiposervicios == row.idtiposervicios))
      if (indexRow != -1) {
        this.servicesToEditCreate[indexRow] = row;
      } else {
        this.servicesToEditCreate.push(row);
      }
    } else if (this.servicesToEditCreate.length == 0) {
      this.servicesToEditCreate.push(row);
    }
  }

  //Metodo que reestablece la informacion original de la tabla al haber editado algun dato.
  resetToOriginalData() {
    this.edit = false;
    this.nuevo = false;
    this.servicesToEditCreate = [];
    this.selectedRows = [];
    this.numSelectedRows = 0;
    this.getListaServicios();
  }

  guardar() {
    if (this.nuevo) {
      this.crearServicio(this.servicesToEditCreate);
    } else if (!this.nuevo) {
      this.modificarServicio(this.servicesToEditCreate);
    }
  }
  //FIN METODOS P-TABLE

  //INICIO METODOS SERVICIOS

  tiposServiciosObject: TiposServiciosObject;

  //Metodo para obtener los datos de la tabla servicios activos
  getListaServicios() {
    this.numSelectedRows = 0;
    this.selectedRows = [];
    this.progressSpinner = true;
    this.newRegisterRow = false;
    this.edit = false;
    this.servicesToEditCreate = [];
    this.historico = false;

    this.selectAllRows = false;
    this.selectMultipleRows = false;

    this.subscriptionServicesList = this.sigaServices.get("tiposServicios_searchListadoServicios").subscribe(
      tiposServiciosObject => {
        this.progressSpinner = false;

        this.tiposServiciosObject = tiposServiciosObject;
        this.servicesData = this.tiposServiciosObject.tiposServiciosItems;

        if (tiposServiciosObject.error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }

        this.servicesTable.paginator = true;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  //Metodo para obtener los datos de la tabla servicios tanto activos como no activos
  getListaServiciosHistorico() {
    this.historico = true;
    this.persistenceService.setHistorico(this.historico);
    this.selectMultipleRows = false;
    this.selectAllRows = false
    this.selectedRows = [];
    this.servicesToEditCreate = [];
    this.edit = false;
    this.numSelectedRows = 0;
    this.newRegisterRow = false;
    this.progressSpinner = true;

    this.subscriptionServicesList = this.sigaServices.get("tiposServicios_searchListadoServiciosHistorico").subscribe(
      tiposServiciosObject => {
        this.progressSpinner = false;

        this.tiposServiciosObject = tiposServiciosObject;
        this.servicesData = this.tiposServiciosObject.tiposServiciosItems;

        if (tiposServiciosObject.error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }

        this.servicesTable.paginator = true;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        let thereIsHistoricalRegister;
        this.servicesData.forEach(servicio => {
          if (servicio.fechabaja != null) {
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

  //Metodo para obtener los valores del combo de tipos de servicios (columna categoria)
  comboObject: ComboObject;
  comboItem: ComboItem[];
  getComboTiposServicios() {
    this.progressSpinner = true;

    this.subscriptionServicesTypeSelectValues = this.sigaServices.get("tiposServicios_comboServicios").subscribe(
      ServiceTypeSelectValues => {
        this.progressSpinner = false;

        this.comboObject = ServiceTypeSelectValues;
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

  //Metodo para crear un nuevo registro servicio en bd
  crearServicio(servicesToEditCreate) {
    this.progressSpinner = true;
    let tiposServiciosObject = new TiposServiciosObject();
    tiposServiciosObject.tiposServiciosItems = servicesToEditCreate;
    this.subscriptionCreateAService = this.sigaServices.post("tiposServicios_crearServicio", tiposServiciosObject).subscribe(
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
        this.servicesToEditCreate = [];
        this.nuevo = false;
        this.getListaServicios();
      }
    );
  }

  //Metodo para modificar la descripcion de uno o multiples servicios en bd
  modificarServicio(servicesToEditCreate) {
    this.progressSpinner = true;
    let tiposServiciosObject = new TiposServiciosObject();
    tiposServiciosObject.tiposServiciosItems = servicesToEditCreate;
    this.subscriptionEditAService = this.sigaServices.post("tiposServicios_modificarServicio", tiposServiciosObject).subscribe(
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
        this.servicesToEditCreate = [];
        this.nuevo = false;
        this.getListaServicios();
      }
    );
  }

  //Metodo para activar/desactivar servicios (es decir fechabaja == null esta activo lo contrario inactivo)
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
        let tiposServiciosObject = new TiposServiciosObject();
        tiposServiciosObject.tiposServiciosItems = selectedRows
        this.subscriptionEnableUnableServices = this.sigaServices.post("tiposServicios_activarDesactivarServicio", tiposServiciosObject).subscribe(
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
            this.getListaServicios();
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
