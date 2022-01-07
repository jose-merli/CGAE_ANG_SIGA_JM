import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SortEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../../../commons/translate';
import { FichaMonederoItem } from '../../../../../models/FichaMonederoItem';
import { ListaMovimientosMonederoItem } from '../../../../../models/ListaMovimientosMonederoItem';
import { procesos_PyS } from '../../../../../permisos/procesos_PyS';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-movimientos-monedero',
  templateUrl: './movimientos-monedero.component.html',
  styleUrls: ['./movimientos-monedero.component.scss']
})
export class MovimientosMonederoComponent implements OnInit {

  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga
  showTarjeta: boolean = false;

  permisoActualizarMovimientos: boolean = false;

  cols = [
    { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha" },
    { field: "concepto", header: "facturacionSJCS.facturacionesYPagos.conceptos" },
    { field: "cuentaContable", header: "censo.consultaDatosGenerales.literal.cuentaContable" },
    { field: "impOp", header: "formacion.fichaCurso.tarjetaPrecios.importe" },
    { field: "impTotal", header: "facturacionSJCS.facturacionesYPagos.importeTotal" },
  ];

  movimientosTarjeta: ListaMovimientosMonederoItem[] = [];

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
  @Input("resaltadoDatos") resaltadoDatos: boolean;
  @Output() actualizaFicha = new EventEmitter<Boolean>();
  @Output() scrollToOblig = new EventEmitter<String>();
  @ViewChild("movimientosTable") tablaMovimientos;

  selectedRows: ListaMovimientosMonederoItem[] = [];
  numSelectedRows: number = 0; //Se usa para mostrar visualmente el numero de filas seleccionadas
  selectMultipleRows: boolean = true; //Seleccion multiples filas de la tabla
  rowsPerPage: number = 10; //Define el numero de filas mostradas por pagina
  first = 0;
  buscadores = [];

  subscriptionMovimientosBusqueda: Subscription;

  constructor(public sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef,
    private localStorageService: SigaStorageService,
    private router: Router) {}

  ngOnInit() {
    this.getPermisoActualizarMovimientos();

    //En el caso que la ficha no sea nueva
    if (this.ficha.idAnticipo != null ) {
      //Se llama al servicio para obtener los movimientos del monedero
      this.getMovimientosMonedero();
    }
  }

  ngOnDestroy() {
    if (this.subscriptionMovimientosBusqueda){
      this.subscriptionMovimientosBusqueda.unsubscribe();
    }
  }

  //INICIO SERVICIOS

  
  getMovimientosMonedero() {
    this.progressSpinner = true;

    this.subscriptionMovimientosBusqueda = this.sigaServices.getParam("PyS_getListaMovimientosMonedero",
      "?idAnticipo=" + this.ficha.idAnticipo+"&idPersona="+ this.ficha.idPersona).subscribe(
        movimientosMonederoDTO => {

          if (movimientosMonederoDTO.error == null) {
            // this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            this.movimientosTarjeta= movimientosMonederoDTO.listaMovimientosMonederoItem;
            this.ficha.movimientos = this.movimientosTarjeta;
            
            this.checkTotal();
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

  updateMovimientosMonedero() {
    this.selectedRows = [];

    
     this.progressSpinner = true;

     let peticion: FichaMonederoItem = new FichaMonederoItem();

    peticion = this.ficha;
    peticion.movimientos = this.movimientosTarjeta;
    this.sigaServices.post("PyS_updatesMovimientosMonedero", peticion).subscribe(
      n => {

        if (n.status == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          // this.actualizaFicha.emit();

          //se asigna el valor del anticipo (monedero) para cubrir el caso que se este creando un monedero nuevo
          this.ficha.idAnticipo = JSON.parse(n.body).error.message;

          this.ficha.movimientos = JSON.parse(JSON.stringify(this.movimientosTarjeta));

          //Una vez se guarda el movimiento, deja de ser editable.
          this.movimientosTarjeta[0].nuevo = false;

          this.getMovimientosMonedero();
        }

        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
      });
  }
  //FIN SERVICIOS

  //INICIO METODOS

  checkSave() {
    let msg = this.commonsService.checkPermisos(this.permisoActualizarMovimientos, undefined);

    if (msg != null) {
      this.msgs = msg;
    } else if (this.checkCamposObligatorios()) {
      this.showMessage("error", "Error", this.translateService.instant('general.message.camposObligatorios'));
    } 
    //REVISAR MENSAJES
    else if(this.movimientosTarjeta.length == 0){
      this.showMessage("error",
        "***"+this.translateService.instant("facturacion.productos.noBorrarProductos"),
        "***"+this.translateService.instant("facturacion.productos.prodNecesario")
      );
    }else {
      this.updateMovimientosMonedero();
    }
  }

  checkCamposObligatorios() {
    //Se comprueba que los campos del utimo movimiento introducido (generalmente uno nuevo) estan rellenados
    //REVISAR AÑADIR ERROR INDEPENDIENTE PARA cuando no hay movimientos
    if(this.movimientosTarjeta.length == 0 || this.movimientosTarjeta[this.movimientosTarjeta.length - 1].concepto == null || this.movimientosTarjeta[this.movimientosTarjeta.length - 1].concepto.trim() == "") {
      this.scrollToOblig.emit("movimientos");
      return true;
    }
    if(this.ficha.idPersona == null){
      this.scrollToOblig.emit("propietario");
      return true;
    }
    //REVISAR AÑADIR ERROR INDEPENDIENTE PARA cuando hay importes mal introducidos
    //Se revisa que se hayan asignado valores de importe en todas las filas
    for(let mov of this.movimientosTarjeta){
      if(mov.impOp == null || (mov.impOp == 0 && mov.idLinea == null)){
        this.scrollToOblig.emit("movimientos");
        return true;
      }
    }

    return false;
  }

  //En este método se calcula el importe total y se actualiza el valor del importe en todos los movimientos.
  checkTotal() {
    let impTotal = 0;

    let i = this.movimientosTarjeta.length;
    //Se calcula el importe total despues de todos los movimientos
    while(i > 0) 
    {
      impTotal += Number(this.movimientosTarjeta[i-1].impOp);
      this.movimientosTarjeta[i-1].impTotal = impTotal;
      i--;
    }
  }

  anadirMovimiento() {
    if (this.movimientosTarjeta.length > 0 && this.checkCamposObligatorios()) {
      this.showMessage("error", "Error", this.translateService.instant('general.message.camposObligatorios'));
    } 
    else{
      let newMovimiento: ListaMovimientosMonederoItem = new ListaMovimientosMonederoItem();

      newMovimiento.fecha = new Date();
      newMovimiento.impOp = 0;
      newMovimiento.concepto = "";
      newMovimiento.nuevo = true;
      
      //Nos aseguramos que el otro movimiento no sea editable
      if(this.movimientosTarjeta.length > 0){
        this.movimientosTarjeta[this.movimientosTarjeta.length-1].nuevo = false;
      }
      this.movimientosTarjeta.unshift(newMovimiento);
      this.checkTotal();
    }
  }

  borrarMovimiento() {
    for(let mov of this.selectedRows){

      //Solo se permite borrar el primero por indicacion de la prueba SPP-2070
      //Tambien se realiza con seleccion porque lo indica la prueba

      //Se comprueba que la fila seleccionada es posterior al ultimo gasto
      let indx = this.movimientosTarjeta.indexOf(mov);
      if(indx != 0){
        this.showMessage("error", "Error", "** Solo se permite borrar el primer movimiento");
      }
      else{
        //Se comprueba que alguna fila seleccionada sea un ingreso
        if(mov.impOp >= 0){

          let i = indx -1;
          while(i > 0){

            if(this.movimientosTarjeta[i].impOp < 0){
              break;
            }
            i--;
          }
          if(i == -1){
            this.movimientosTarjeta.splice(indx, 1);
          }
          else{
            this.showMessage("error", "Error", "** No se puede eliminar un movimiento de ingreso anterior a uno de cobro");
          }
        }
        else if(mov.impOp < 0){
          this.showMessage("error", "Error", "** No se puede eliminar un movimiento de cobro");
        }
      }
    }

    this.selectedRows = [];
    this.numSelectedRows = 0;
    this.checkTotal();
    this.tablaMovimientos.reset();
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

  getPermisoActualizarMovimientos() {
    this.commonsService
      .checkAcceso(procesos_PyS.actualizacionMovimientosMonedero)
      .then((respuesta) => {
        this.permisoActualizarMovimientos = respuesta;
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

  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsService.styleObligatorio(evento);
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
