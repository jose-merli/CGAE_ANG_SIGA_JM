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
    if (this.ficha.idLinea != null ) {
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
      "?idLinea=" + this.ficha.idLinea+"&idPersona="+ this.ficha.idPersona).subscribe(
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

  // getComboProductos() {
  //   this.progressSpinner = true;


  //   let filtrosProductos: FiltrosProductos = new FiltrosProductos();
  //   this.sigaServices.post("productosBusqueda_busqueda", filtrosProductos).subscribe(
  //     listaProductosDTO => {

  //       if (JSON.parse(listaProductosDTO.body).error.code == 500) {
  //         this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
  //       } else {
  //         // this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
  //       }

  //       //Descomentar esto y comentar el codigo de abajo asignando el valor de comboProductos
  //       //Si se quiere mostrar unicamente productos no derogados
  //       // JSON.parse(listaProductosDTO.body).listaProductosItems.forEach(producto => {
  //       //   if (producto.fechabaja == null) {
  //       //     this.comboProductos.push(producto);
  //       //   }
  //       // });

  //       this.comboProductos = JSON.parse(listaProductosDTO.body).listaProductosItems

  //       //Apaño temporal ya que si no se hace este reset, la tabla muestra unicamente la primera paginad e productos
  //       this.tablaProductos.reset();

  //       //Se revisan las formas de pago para añadir los "no factuables" y los "No disponible"
  //       this.comboProductos.forEach(producto => {
  //         if (producto.formapago == null || producto.formapago == "") {
  //           if (producto.noFacturable == "1") {
  //             producto.formapago = this.translateService.instant("facturacion.productos.noFacturable");
  //           }
  //           else {
  //             producto.formapago = this.translateService.instant("facturacion.productos.pagoNoDisponible");
  //           }
  //         }
  //         else {
  //           if (producto.noFacturable == "1") {
  //             producto.formapago += ", "+this.translateService.instant("facturacion.productos.noFacturable");
  //           }
  //         }
  //       });

  //       if(this.ficha.fechaPendiente == null && this.ficha.productos.length > 0){
  //         this.initProductos();
  //       }

  //       this.progressSpinner = false;

  //     },
  //     err => {
  //       this.progressSpinner = false;
  //     });
  // }

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

          this.ficha.movimientos = JSON.parse(JSON.stringify(this.movimientosTarjeta));

          //Una vez se guarda el movimiento, deja de ser editable.
          this.movimientosTarjeta[0].nuevo = false;
        }

        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
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
    //REVISAR AÑADIR ERROR INDEPENDIENTE PARA CUANDO SE INTRODUCE UN IMPORTE NEGATIVO y  cuando no hay movimientos
    if(this.movimientosTarjeta.length == 0 || this.movimientosTarjeta[0].concepto == null || this.movimientosTarjeta[0].concepto.trim() == "" ||
    this.movimientosTarjeta[0].impOp == null || (this.movimientosTarjeta[0].nuevo == true && this.movimientosTarjeta[0].impOp <= 0)) {
      this.scrollToOblig.emit("movimientos");
      return true;
    }

    if(this.ficha.idPersona == null){
      this.scrollToOblig.emit("propietario");
      return true;
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
    if(this.movimientosTarjeta.length > 0 && this.checkCamposObligatorios()){
      this.showMessage("error", "Error", this.translateService.instant('general.message.camposObligatorios'));
    }
    else{
      let newMovimiento: ListaMovimientosMonederoItem = new ListaMovimientosMonederoItem();

      newMovimiento.fecha = new Date();
      newMovimiento.impOp = 0;
      newMovimiento.concepto = "";
      newMovimiento.nuevo = true;
      newMovimiento.liquidacion = "0";
      newMovimiento.contabilizado = "0";
      
      //Nos aseguramos que el otro movimiento no sea editable
      if(this.movimientosTarjeta.length > 0){
        this.movimientosTarjeta[this.movimientosTarjeta.length-1].nuevo = false;
      }
      this.movimientosTarjeta.unshift(newMovimiento);
      this.checkTotal();
    }
  }

  borrarMovimiento() {
    if(this.movimientosTarjeta[0].impOp > 0 || this.movimientosTarjeta[0].nuevo){
      this.movimientosTarjeta.splice(0, 1);
    
      this.selectedRows = [];
      this.numSelectedRows = 0;
      this.checkTotal();
      this.tablaMovimientos.reset();
    }
    else if(this.movimientosTarjeta[0].impOp < 0){
      this.showMessage("error", "Error", "** No se puede eliminar un movimiento de cobro");
    }
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
      //REVISAR
      .checkAcceso(procesos_PyS.fichaMonedero)
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
