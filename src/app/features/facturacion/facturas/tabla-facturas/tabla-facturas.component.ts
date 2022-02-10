import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { actionBegin } from '@syncfusion/ej2-angular-grids';
import { ConfirmationService, DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { DatosColegiadosItem } from '../../../../models/DatosColegiadosItem';
import { FacturaEstadosPagosItem } from '../../../../models/FacturaEstadosPagosItem';
import { FacturasItem } from '../../../../models/FacturasItem';
import { FicherosAdeudosItem } from '../../../../models/sjcs/FicherosAdeudosItem';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-tabla-facturas',
  templateUrl: './tabla-facturas.component.html',
  styleUrls: ['./tabla-facturas.component.scss']
})
export class TablaFacturasComponent implements OnInit {
  cols;
  msgs;

  FAC_ABONO_ESTADO_PENDIENTE_BANCO: string = "5";
  FAC_FACTURA_ESTADO_PENDIENTE_BANCO: string = "5";

  selectedDatos: FacturasItem[] = [];
  rowsPerPage = [];
  buscadores = [];

  selectedItem: number = 10;
  numSelected = 0;

  selectMultiple: boolean = false;
  selectAll: boolean = false;
  historico: boolean = false;
  permisoEscritura: boolean = false;
  progressSpinner: boolean = false;
  showModal:boolean = false;
  openFichaModal:boolean = false;
  esRenegociar:boolean = false;
  @Input() datos: FacturasItem[];
  @Input() filtro;
  itemAction:FacturaEstadosPagosItem = new FacturaEstadosPagosItem();
  @Output() busqueda = new EventEmitter<boolean>();

  @ViewChild("table") table: DataTable;

  comboSel:string;
  comentario:boolean = false;
  combo:boolean = false;
  comboAction:ComboItem [] =[];
  nombreTarjeta:String="";
  accionAux:String="";
  resaltadoDatos: boolean = false;
  resaltadoFecha: boolean = false;

  itemsParaModificar:FacturaEstadosPagosItem[]= [];
  constructor(
    private changeDetectorRef: ChangeDetectorRef, 
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private router: Router, 
    private commonsService: CommonsService,
    private persistenceService: PersistenceService) { }

  ngOnInit() {
    this.selectedDatos = [];
    this.selectAll = false;

    this.getCols();
  }

  
   // Abrir ficha de serie facturación -> tabla series facturacion
  openTab(selectedRow) {
    let facturasItem: FacturasItem = selectedRow;
    sessionStorage.setItem("facturasItem", JSON.stringify(facturasItem));
    this.router.navigate(["/gestionFacturas"]);
  }
  abreCierraFicha(){
    this.openFichaModal = !this.openFichaModal
  }

  navigateToCliente(selectedRow) {
    
    if (selectedRow.idCliente) {
      
      this.progressSpinner = true;

      sessionStorage.setItem("consulta", "true");
      let filtros = { idPersona: selectedRow.idCliente };

      this.sigaServices.postPaginado("busquedaColegiados_searchColegiadoFicha", "?numPagina=1", filtros).toPromise().then(
        n => {
          let results: DatosColegiadosItem[] = JSON.parse(n.body).colegiadoItem;
          
          if (results != undefined && results.length != 0) {
            let datosColegiado: DatosColegiadosItem = results[0];

            sessionStorage.setItem("facturaItem", JSON.stringify(selectedRow));
            sessionStorage.setItem("volver", "true");

            sessionStorage.setItem("personaBody", JSON.stringify(datosColegiado));
            sessionStorage.setItem("filtrosBusquedaColegiados", JSON.stringify(filtros));
            sessionStorage.setItem("solicitudAprobada", "true");
            sessionStorage.setItem("origin", "Cliente");
          }
        },
        err => {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      ).then(() => this.progressSpinner = false).then(() => {
        if (sessionStorage.getItem("personaBody")) {
          this.router.navigate(["/fichaColegial"]);
        } 
      });
    }
    
  }
  

getCols() {
  this.cols = [
    { field: "numeroFactura", header: "facturacion.productos.nFactura", width: "9%" }, 
    { field: "fechaEmision", header: "facturacion.facturas.fechaEmision", width: "9%" }, 
    { field: "facturacion", header: "menu.facturacion", width: "15%" }, 
    { field: "numeroColegiado", header: "facturacion.facturas.numeroColegiadoIdentificador", width: "9%" }, 
    { field: "nombre", header: "facturacion.productos.Cliente", width: "15%" }, 
    { field: "importefacturado", header: "facturacion.facturas.importeTotal", width: "9%" }, 
    { field: "importeAdeudadoPendiente", header: "facturacion.facturas.importePendiente", width: "9%" }, 
    { field: "estado", header: "censo.nuevaSolicitud.estado", width: "9%" }, 
    { field: "comunicacionesFacturas", header: "facturacion.facturas.comunicacionCorto", width: "7%" }, 
    { field: "ultimaComunicacion", header: "facturacion.facturas.ultimaComunicacion", width: "9%" }, 
  ];

  this.cols.forEach(it => this.buscadores.push(""));

  this.rowsPerPage = [
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

disableNuevoFicheroTransferencias(): boolean {
  return !this.selectedDatos || this.selectedDatos.filter(d => d.tipo != "FACTURA" && d.idEstado == this.FAC_ABONO_ESTADO_PENDIENTE_BANCO).length == 0;
}

nuevoFicheroAdeudos() {
  let facturasGeneracion = this.selectedDatos.filter(d => d.tipo == "FACTURA" && d.idEstado == this.FAC_FACTURA_ESTADO_PENDIENTE_BANCO);
  
  if (facturasGeneracion && facturasGeneracion.length != 0) {
    let ficheroAdeudos = new FicherosAdeudosItem();
    ficheroAdeudos.facturasGeneracion = facturasGeneracion.map(d => d.idFactura);
    sessionStorage.setItem("FicherosAdeudosItem", JSON.stringify(ficheroAdeudos));
    sessionStorage.setItem("Nuevo", "true");
    
    this.router.navigate(["/gestionAdeudos"]); 
  }
}

disableNuevoFicheroAdeudos(): boolean {
  return !this.selectedDatos || this.selectedDatos.filter(d => d.tipo == "FACTURA" && d.idEstado == this.FAC_FACTURA_ESTADO_PENDIENTE_BANCO).length == 0;
}

// Confirmación de un nuevo fichero de transferencias
confirmNuevoFicheroTransferencias(): void {
  let mess = this.translateService.instant("facturacionPyS.facturas.fichTransferencias.confirmacion");
  let icon = "fa fa-plus";

  this.confirmationService.confirm({
    message: mess,
    icon: icon,
    acceptLabel: "Sí",
    rejectLabel: "No",
    accept: () => {
      this.nuevoFicheroTransferencias();
    },
    reject: () => {
      this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
    }
  });
}

nuevoFicheroTransferencias() {
  this.progressSpinner = true;
  let abonosFichero = this.selectedDatos.filter(d => d.tipo != "FACTURA" && d.idEstado == this.FAC_ABONO_ESTADO_PENDIENTE_BANCO);
  
  this.sigaServices.post("facturacionPyS_nuevoFicheroTransferencias", abonosFichero).subscribe(
    n => {
      this.progressSpinner = false;
      this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("facturacionPyS.facturas.fichTransferencias.generando"));
      this.busqueda.emit();
    },
    err => {
      this.handleServerSideErrorMessage(err);
      
      this.progressSpinner = false;
    }
  );
}

handleServerSideErrorMessage(err): void {
  let error = JSON.parse(err.error);
  if (error && error.error && error.error.message) {
    let message = this.translateService.instant(error.error.message);

    if (message && message.trim().length != 0) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), message);
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), error.error.message);
    }
  } else {
    this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
  }
}

selectFila(event) {
  this.numSelected = event.length;
}

unselectFila(event) {
  this.selectAll = false;
  this.numSelected = event.length;
}

onChangeRowsPerPages(event) {
  this.selectedItem = event.value;
  this.changeDetectorRef.detectChanges();
  this.table.reset();
}

onChangeSelectAll() {
  if (this.selectAll) {
    this.selectMultiple = false;
    this.selectedDatos = this.datos;
    this.numSelected = this.datos.length;
  } else {
    this.selectedDatos = [];
    this.numSelected = 0;
    this.selectMultiple = true;
  }
}

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }


  fillFecha(event, campo) {
    if(campo==='fechaMin')
      this.itemAction.fechaMin = event;
  }


  eliminarUltimoCobro(){
    let estadosPagosItems:FacturaEstadosPagosItem [] = new Array();
    console.log("eliminaaa")
    this.selectedDatos.forEach(element => {
      if(element.idAccion == "4"){
        let itemFacturaEstadosPagoItem:FacturaEstadosPagosItem;
        itemFacturaEstadosPagoItem.idFactura = element.idFactura;
        estadosPagosItems.push(itemFacturaEstadosPagoItem)
      }
    });

    if(estadosPagosItems.length > 0){
      this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("facturacion.facturas.mensaje.ultCobro"));
      this.progressSpinner = true;
      this.sigaServices.post("facturacionPyS_eliminarEstadosPagos", estadosPagosItems).toPromise()
        .then(
          n => { 
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          },
          err => {
            return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
        }).catch(error => {
          if (error != undefined) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), error);
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          }
        }).then(() => {
          this.progressSpinner = false;
        });
    }else{
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacion.facturas.mensaje.ultCobro"));
    }
  
    
  }

  cerrarDialog(operacionCancelada: boolean) {
    this.showModal = false;
    this.esRenegociar = false;
    this.changeDetectorRef.detectChanges();

    if (operacionCancelada) {
      this.itemAction = new FacturaEstadosPagosItem();
      this.itemAction.comentario= ""
      this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
    }
  }

  comboNegociar(){
    this.comboAction =  [
      { value: "1", label: this.translateService.instant("facturacion.facturas.tarjeta.renegociar.opcionBanco"), local: undefined },
      { value: "2", label: this.translateService.instant("facturacion.facturas.tarjeta.renegociar.opcionBancoNo"), local: undefined },
      { value: "3",  label: this.translateService.instant("facturacion.facturas.tarjeta.renegociar.opcionCaja"), local: undefined }
    ];
  }

  renegociar(){
    this.nombreTarjeta = this.translateService.instant("general.boton.renegociar")
    this.comentario = true;
    this.combo = true;
    this.showModal = true;
    this.itemAction =  new FacturaEstadosPagosItem();
    this.esRenegociar = true;
    this.accionAux = "Renegociar"
    this.comboNegociar();
  }

  nuevoCobro(){
    this.nombreTarjeta = this.translateService.instant("facturacion.facturas.estadosPagos.nuevoCobro")
    this.comentario = true;
    this.combo = false;
    this.showModal = true;
    this.itemAction =  new FacturaEstadosPagosItem();
    this.accionAux = "Nuevo Cobro"
  }

  nuevoAbono(){
    this.itemAction =  new FacturaEstadosPagosItem();
    this.nombreTarjeta =  this.translateService.instant("facturacion.facturas.estadosPagos.nuevoAbono")
    this.comentario = true;
    this.combo = false;
    this.showModal = true;
    this.itemAction =  new FacturaEstadosPagosItem();
    this.accionAux = "Nuevo Abono"
  }

  devolver(){
    this.nombreTarjeta =  this.translateService.instant("facturacion.facturas.estadosPagos.devolver")
    this.combo = true;
    this.comentario = false
    this.getComboMotivosDevolucion();
    this.showModal = true;
    this.itemAction =  new FacturaEstadosPagosItem();
    this.accionAux = "Devolver"
  }

  devolverComision(){
    this.nombreTarjeta =  this.translateService.instant("facturacion.facturas.estadosPagos.devolverConComision")
    this.combo = true;
    this.comentario = false
    this.getComboMotivosDevolucion();
    this.showModal = true;
    this.itemAction =  new FacturaEstadosPagosItem();
    this.accionAux = "Devolver Comision"
  }

  anular(){
    this.nombreTarjeta =  this.translateService.instant("general.boton.anular")
    this.comentario = true;
    this.combo = false;
    this.showModal = true;
    this.itemAction =  new FacturaEstadosPagosItem();
    this.accionAux = "Anular"
  }

  getComboMotivosDevolucion() {
    this.sigaServices.get("facturacionPyS_comboMotivosDevolucion").subscribe(
      n => {
        this.comboAction = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboAction);
      },
      err => {
        console.log(err);
      }
    );
  }

  renegociarFacturas(): void {
    this.itemsParaModificar = [];
    this.selectedDatos.forEach(element =>{
        let item:FacturaEstadosPagosItem = new FacturaEstadosPagosItem();
        if(element.tipo == "FACTURA"  && ["2", "4", "5"].includes(element.idEstado) 
        || element.tipo != "FACTURA" && element.idEstado == "1"){
          // IdFactura
          item.idFactura = element.idFactura;

          let fechaActual: Date = new Date();
          item.fechaMin = fechaActual > new Date(element.fechaModificacionUlt) ? fechaActual : new Date(element.fechaModificacionUlt);
          if(this.itemAction.fechaModificaion  > new Date(element.fechaModificacionUlt) ){
            item.fechaModificaion = this.itemAction.fechaModificaion
          }else{
            item.fechaModificaion = new Date();
          }
          item.comentario = this.itemAction.comentario;
          item.notaMaxLength = 1024;

          // Acción
          item.idAccion = "7";
          item.accion = this.translateService.instant("facturacion.facturas.estadosPagos.renegociacion");

          if(element.tipo == "FACTURA"){
            if(this.comboSel == "1" || this.comboSel == "2") element.idEstado = "5"
            if(this.comboSel == "3") element.idEstado = "2"
          }else{
            if(this.comboSel == "1" || this.comboSel == "2") element.idEstado = "5"
            if(this.comboSel == "3") element.idEstado = "6"
          }

          // El importe pendiente se recalcula
          item.impTotalPagado = "0";
          item.impTotalPorPagar = element.importePorPagarUlt;

          this.itemsParaModificar.push(item);
        }
    });

 

  }

  nuevoCobroFacturas() {
    this.itemsParaModificar = [];
    this.selectedDatos.forEach(element =>{
        let item:FacturaEstadosPagosItem = new FacturaEstadosPagosItem();
        if(element.tipo == "FACTURA"  && ["2"].includes(element.estadoUlt) && element.importePorPagarUlt != undefined){
          // IdFactura
          item.idFactura = element.idFactura;

          let fechaActual: Date = new Date();
          item.fechaMin = fechaActual > new Date(element.fechaModificacionUlt) ? fechaActual : new Date(element.fechaModificacionUlt);
          if(this.itemAction.fechaModificaion  > new Date(element.fechaModificacionUlt) ){
            item.fechaModificaion = this.itemAction.fechaModificaion
          }else{
            item.fechaModificaion = new Date();
          }
          item.comentario = this.itemAction.comentario;
          item.notaMaxLength = 256;

          item.impTotalPagado = element.importePorPagarUlt

          // Acción
          item.idAccion = "4";
          item.accion = this.translateService.instant("facturacion.facturas.estadosPagos.cobroPorCaja");

          // El importe pendiente se recalcula
          item.impTotalPagado = element.importePorPagarUlt;
          item.impTotalPorPagar = "0";

          this.itemsParaModificar.push(item);
        }
    });
  }

  nuevoAbonoFacturas() {
    this.itemsParaModificar = [];
    this.selectedDatos.forEach(element =>{
      let item:FacturaEstadosPagosItem = new FacturaEstadosPagosItem();
      if(element.tipo == "ABONO"  && ["6"].includes(element.idEstado) && 
      element.importeAdeudadoPendienteAb != undefined && parseFloat(element.importeAdeudadoPendienteAb) == 0){
    // IdFactura
        item.idFactura = element.idFactura;


        let fechaActual: Date = new Date();
        item.fechaMin = fechaActual > new Date(element.fechaModificacionUlt) ? fechaActual : new Date(element.fechaModificacionUlt);
        if(this.itemAction.fechaModificaion  > new Date(element.fechaModificacionUlt) ){
          item.fechaModificaion = this.itemAction.fechaModificaion
        }else{
          item.fechaModificaion = new Date();
        }
        item.comentario = this.itemAction.comentario;
        item.notaMaxLength = 256;
        // Acción
        item.idAccion = "4";
        item.accion = this.translateService.instant("facturacion.facturas.estadosPagos.abonoPorCaja");

        // El importe pendiente se recalcula
        item.impTotalPagado = "0";
        item.impTotalPorPagar = element.importePorPagarUlt;

        this.itemsParaModificar.push(item);
      }
    });
  }

  styleObligatorio(evento) {

    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsService.styleObligatorio(evento);
    }

  }
muestraCamposObligatorios() {
  this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
}
  devolverFacturas() {

    this.itemsParaModificar= [];
    this.selectedDatos.forEach(element =>{
      
      if(element.tipo == "FACTURA"  && ["5"].includes(element.idAccionUlt) ){
        let item:FacturaEstadosPagosItem = new FacturaEstadosPagosItem();

      // IdFactura
      item.idFactura = element.idFactura;

      let fechaActual: Date = new Date();
      item.fechaMin = fechaActual > new Date(element.fechaModificacionUlt) ? fechaActual : new Date(element.fechaModificacionUlt);
      if(this.itemAction.fechaModificaion  > new Date(element.fechaModificacionUlt) ){
        item.fechaModificaion = this.itemAction.fechaModificaion
      }else{
        item.fechaModificaion = new Date();
      }
      //AÑADIR MOTIVO
      item.comentario = this.comboSel

      // Acción
      item.idAccion = "6";
      item.accion = this.translateService.instant("facturacion.facturas.estadosPagos.devolucion");

      // Cuenta a la que se le pasó el cargo - ver si es el combo
      //item.cuentaBanco = ultimaAccion.cuentaBanco;

      item.impTotalPagado = "0";
      item.impTotalPorPagar = element.impTotalPagadoUlt;

      this.itemsParaModificar.push(item);
      }
    });
  }

  devolverComisionFacturas() {
    this.itemsParaModificar=[]
    this.selectedDatos.forEach(element =>{
      if(element.tipo =="FACTURA" && ["5"].includes(element.idAccionUlt)){
        let item = new FacturaEstadosPagosItem();

        // IdFactura
        item.idFactura = element.idFactura;
  
        let fechaActual: Date = new Date();
        item.fechaMin = fechaActual > new Date(element.fechaModificacionUlt) ? fechaActual : new Date(element.fechaModificacionUlt);
        if(this.itemAction.fechaModificaion  > new Date(element.fechaModificacionUlt) ){
          item.fechaModificaion = this.itemAction.fechaModificaion
        }else{
          item.fechaModificaion = new Date();
        }
        //AÑADIR MOTIVO
        item.comentario = this.comboSel

  
        // Acción
        item.idAccion = "6";
        item.accion = this.translateService.instant("facturacion.facturas.estadosPagos.devolucion");
  
        // Devolver con comisión al cliente
        item.comision = true;
  
        // Cuenta a la que se le pasó el cargo -- MIRARLO, CUENTA BANCO SIEMPRE NULL
        //item.cuentaBanco = ultimaAccion.cuentaBanco;
  
        item.impTotalPagado = "0";
        item.impTotalPorPagar = element.impTotalPagadoUlt;

        this.itemsParaModificar.push(item)
      }

    });
  }

  anularFacturas() {
    this.itemsParaModificar= [];
    this.selectedDatos.forEach(element =>{
      if(element.tipo =="FACTURA" && !["7", "8"].includes(element.idEstado)){
        let item= new FacturaEstadosPagosItem();

        // IdFactura
        item.idFactura = element.idFactura;
  
        let fechaActual: Date = new Date();
        item.fechaMin = fechaActual > new Date(element.fechaModificacionUlt) ? fechaActual : new Date(element.fechaModificacionUlt);
        if(this.itemAction.fechaModificaion  > new Date(element.fechaModificacionUlt)) {
          item.fechaModificaion = this.itemAction.fechaModificaion
        }else{
          item.fechaModificaion = new Date();
        }
        item.comentario = this.itemAction.comentario;

        item.notaMaxLength = 255;
  
        // Acción
        item.idAccion = "8";
        item.accion = this.translateService.instant("facturacion.facturas.estadosPagos.anulacion");
  
        item.impTotalPagado = element.importePorPagarUlt;
        item.impTotalPorPagar = "0";

        this.itemsParaModificar.push(item)
      }

    });

  }
  accion(accionAux:string){
    switch(accionAux) { 
      case "Renegociar": { 
        this.renegociarFacturas();
        break; 
     } 
      case "Nuevo Cobro": { 
         this.nuevoCobroFacturas();
         break; 
      } 
      case "Nuevo Abono": { 
         this.nuevoAbonoFacturas();
         break; 
      } 
      case "Devolver": { 
        this.devolverFacturas();
        break; 
     } 
     case "Devolver Comision": { 
      this.devolverComisionFacturas();
      break; 
     } 
     case "Anular": { 
      this.anularFacturas(); 
      break; 
     } 

   } 
   this.guardarDefi();
  }
isValid(){
  let isValid:boolean = true;
  if(this.esRenegociar && this.comboSel == null || this.comboSel == ""){
    isValid = false
    this.resaltadoDatos = true;
  }
  if(!this.esRenegociar && this.combo || this.comboSel == null || this.comboSel == ""){
    isValid = false
    this.resaltadoDatos = true;
  } 
  if(this.itemAction.fechaMin == null || this.itemAction.fechaMin == undefined || this.itemAction.fechaMin.toString() == ""){
    this.resaltadoFecha = true
    isValid = false;
  }
  return isValid;
}
  guardarDefi() {
    if(this.isValid()){
      this.progressSpinner = true;
      this.sigaServices.post("facturacionPyS_insertarEstadosPagos", this.itemsParaModificar).toPromise()
        .then(
          n => {
           // this.guardadoSend.emit(this.bodyInicial);
           this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
           },
          err => {
            return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
        }).catch(error => {
          if (error != undefined) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), error);
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          }
        }).then(() => {
          this.progressSpinner = false;
          this.cerrarDialog(false);
        });
    
    }else{
      this.muestraCamposObligatorios()
    }
     
  }


}
