import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Message, SortEvent } from 'primeng/api';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { ListaDescuentosPeticionItem } from '../../../../models/ListaDescuentosPeticionItem';
import { ListaFacturasPeticionItem } from '../../../../models/ListaFacturasPeticionItem';
import { procesos_PyS } from '../../../../permisos/procesos_PyS';
import { SigaStorageService } from '../../../../siga-storage.service';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-tarjeta-descuentos-anticipos-compra-suscripcion',
  templateUrl: './tarjeta-descuentos-anticipos-compra-suscripcion.component.html',
  styleUrls: ['./tarjeta-descuentos-anticipos-compra-suscripcion.component.scss']
})
export class TarjetaDescuentosAnticiposCompraSuscripcionComponent implements OnInit {

  msgs: Message[] = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga
  showTarjeta: boolean = false;
  editable: boolean = false;
  
  selectedRows: any[] = [];
  numSelectedRows: number = 0; //Se usa para mostrar visualmente el numero de filas seleccionadas
  selectMultipleRows: boolean = true; //Seleccion multiples filas de la tabla
  selectAllRows: boolean = false; //Selecciona todas las filas de la pagina actual de la tabla
  rowsPerPage: number = 10; //Define el numero de filas mostradas por pagina
  first = 0;
  buscadores = [];

  descuentosTarjeta: ListaDescuentosPeticionItem[] = [];

  
  @Input("ficha") ficha: FichaCompraSuscripcionItem;

  
  colsProd = [
    { field: "tipo", header: "facturacion.productos.tipo" },
    { field: "importe", header: "facturacionSJCS.facturacionesYPagos.importe" }
  ];

  colsServ = [
    { field: "tipo", header: "facturacion.productos.tipo" },
    { field: "descripcion", header: "administracion.parametrosGenerales.literal.descripcion" },
    { field: "importe", header: "facturacionSJCS.facturacionesYPagos.importe" }
    
  ];

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
  disableBorrar: boolean = true;
  permisoNuevoAnticipo: boolean = false;
  permisoBorrarAnticipo: boolean = false;

  constructor(public sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef,
    private localStorageService: SigaStorageService,
    private router: Router) { }

  ngOnInit() {
    this.ficha.impPagado = 0;
    if(this.ficha.fechaAceptada != null){
      this.getDescuentosPeticion();
    }
  }

  ngOnChange(changes: SimpleChanges){
    if(this.ficha.fechaAceptada != null){
      this.getDescuentosPeticion();
    }
  }

  getDescuentosPeticion(){
    this.sigaServices.getParam("PyS_getDescuentosPeticion","?idPeticion="+this.ficha.nSolicitud).subscribe(
      listaDescuentosPeticionDTO => {

        if (listaDescuentosPeticionDTO.error != null) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          // this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.descuentosTarjeta = listaDescuentosPeticionDTO.listaDescuentosPeticionItem;
          for(let descuento of this.descuentosTarjeta){
            if(descuento.tipo == "1"){
              descuento.desTipo = this.translateService.instant("facturacion.productos.anticipoTipo");
            
            }
          }

          this.checkTotal();
        }
        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
      });
  }

  //REVISAR AÑADIR COMPROBACION DEL ESTADO DE LA COMPRA Y SU FACTURACION
  checkNuevoAnticipo(){
    let msg = this.commonsService.checkPermisos(this.permisoNuevoAnticipo, undefined);

    if (msg != null) {
      this.msgs = msg;
    }  else {
      this.nuevoAnticipo();
		}
  }

  nuevoAnticipo(){

    this.msgs = [
      {
        severity: "info",
        summary: "En proceso",
        detail: "Ficha no implementada actualmente"
      }
    ];
    
    //REVISAR
    // this.progressSpinner = true;
    // sessionStorage.setItem("FichaCompraSuscripcion", JSON.stringify(this.ficha));
    // sessionStorage.setItem("origin", "Compra");
    //this.router.navigate(["/fichaAnticipo"]); //Cambiar direccion a la ficha de anticipos y añadir item con informacion necesaria para inicializar la ficha
  }


  // saveNuevoAnticipo(){
  //   this.progressSpinner = true;

  //   this.sigaServices.post("PyS_saveAnticipoPeticion",this.selectedRows).subscribe(
  //     insertResponseDTO => {

  //       if (insertResponseDTO.status != "OK") {
  //         this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
  //       } else {
  //         this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
  //       }
  //       this.progressSpinner = false;

  //     },
  //     err => {
  //       this.progressSpinner = false;
  //     });
  // }

  checkTotal(){
    let pagado = 0;

    for(let desc of this.descuentosTarjeta){
      pagado += desc.importe;
    }

    this.ficha.impPagado = pagado;
  }

  
  //REVISAR QUE SOLO SE HAN SELECCIONADO ANTICIPOS Y QUE NO SE HAYA FACTURADO
  checkBorrarAnticipo(){
    let msg = this.commonsService.checkPermisos(this.permisoBorrarAnticipo, undefined);

    if (msg != null) {
      this.msgs = msg;
    }  else {
      this.borrarAnticipo();
		}
  }

  //REVISAR CAMBIAR EL SERVICIO POR EL SERVICIO QUE SE IMPLEMENTE
  borrarAnticipo(){
    this.progressSpinner = false;

    this.sigaServices.post("PyS_saveAnticipoPeticion",this.selectedRows).subscribe(
      insertResponseDTO => {

        if (insertResponseDTO.status != "OK") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }
        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
      });

    for (let row of this.selectedRows) {
      if(row.tipo == 1){
        let index = this.descuentosTarjeta.indexOf(row);
        this.descuentosTarjeta.splice(index, 1);
      }
      else{
        this.msgs = [
          {
            severity: "error",
            summary: "Error",
            detail: "Solo se pueden eliminar anticipos"
          }
        ];
      }
    }

    this.selectedRows = [];
    this.numSelectedRows = 0;
  }

  //Se cambia la tabla a su estado editable en todas las columnas 
  changeEditable() {  
    this.editable = !this.editable;
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

  //Metodo activado al pulsar sobre el checkbox Seleccionar todo
  onChangeSelectAllRows() {
    if (this.selectAllRows === true) {
      this.selectedRows = this.descuentosTarjeta;
      this.numSelectedRows = this.descuentosTarjeta.length;

    } else {
      this.selectedRows = [];
      this.numSelectedRows = 0;
    }
  }
  
  onRowSelect(selectedDatos){
    this.numSelectedRows = selectedDatos.length;
    let noAnt = this.selectedRows.find(
      item => item.tipo != "1"
    );
    if (noAnt != undefined){
      this.disableBorrar = true;
    }
    else this.disableBorrar = false;
  }
  
  onHideTarjeta(){
    this.showTarjeta = ! this.showTarjeta;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
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

  getPermisoNuevoAnticipo(){
    //REVISAR: ACTUALIZAR EL PERMISO CUANDO SE CREE LA FICHA DE ANTICIPO (FACTUTACION DE PYS)
    this.commonsService
			.checkAcceso(procesos_PyS.fichaCompraSuscripcion)
			.then((respuesta) => {
				this.permisoNuevoAnticipo = respuesta;
			})
			.catch((error) => console.error(error));
  }

  getPermisoBorrarAnticipo(){
    //REVISAR: ACTUALIZAR EL PERMISO CUANDO SE CREE LA FICHA DE ANTICIPO (FACTUTACION DE PYS)
    this.commonsService
			.checkAcceso(procesos_PyS.fichaCompraSuscripcion)
			.then((respuesta) => {
				this.permisoBorrarAnticipo = respuesta;
			})
			.catch((error) => console.error(error));
  }
}
