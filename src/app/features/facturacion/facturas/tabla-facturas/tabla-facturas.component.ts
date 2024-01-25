import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { actionBegin } from '@syncfusion/ej2-angular-grids';
import { ConfirmationService, DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { DatosColegiadosItem } from '../../../../models/DatosColegiadosItem';
import { FacturaEstadosPagosItem } from '../../../../models/FacturaEstadosPagosItem';
import { FacturasItem } from '../../../../models/FacturasItem';
import { FicherosAdeudosItem } from '../../../../models/sjcs/FicherosAdeudosItem';
import { SigaStorageService } from '../../../../siga-storage.service';
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
  ACCION_ABONO_NUEVO_CAJA: string = "4";
  ESTADO_ABONO_CAJA: string = "6";

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
  nombreTarjeta:string="";
  accionAux:string="";
  resaltadoDatos: boolean = false;
  resaltadoFecha: boolean = false;
  esColegiado: boolean = false;

  itemsParaModificar:FacturaEstadosPagosItem[]= [];
  itemsParaModificarAbonos:FacturaEstadosPagosItem[]= [];
  constructor(
    private changeDetectorRef: ChangeDetectorRef, 
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private router: Router, 
    private commonsService: CommonsService,
		private localStorageService: SigaStorageService,
    private persistenceService: PersistenceService) { }

  ngOnInit() {
    this.selectedDatos = [];
    this.selectAll = false;
    if(this.localStorageService.isLetrado){
      this.esColegiado = true;
      }else{
      this.esColegiado = false;
      }

    this.getCols();
  }

  
   // Abrir ficha de serie facturación -> tabla series facturacion
  openTab(selectedRow) {
    let facturasItem: FacturasItem = selectedRow;
    sessionStorage.setItem("facturasItem", JSON.stringify(facturasItem));
    sessionStorage.setItem('filtrosFacturas', JSON.stringify(this.filtro));

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

      this.sigaServices.post("busquedaColegiados_tipoPersona",filtros).subscribe(
        n => {
          let results = JSON.parse(n.body).colegiadoItem;
          if(results[0].tipo == "Es colegiado"){
            this.esUnColegiado(filtros, selectedRow);
          }else if(results[0].tipo == "No es colegiado"){
            this.noEsColegiado(filtros, selectedRow);
          }else{
            this.esUnaSociedad(filtros,selectedRow);
          }
          this.progressSpinner = false;
        },
        err => {
          this.handleServerSideErrorMessage(err);
          
          this.progressSpinner = false;
        }
      );
    }
    
  }

  esUnaSociedad(filtros,selectedRow){
    this.sigaServices.postPaginado("busquedaPerJuridica_datosGeneralesSearch", "?numPagina=1", filtros).toPromise().then(
      n => {
        let results = JSON.parse(n.body);
        console.log(results)
        sessionStorage.setItem("usuarioBody", JSON.stringify(results.personaJuridicaItems));
        sessionStorage.setItem("facturaItem", JSON.stringify(selectedRow));
        sessionStorage.setItem(
          "privilegios",
          JSON.stringify(true)
        );
          sessionStorage.setItem("esColegiado", "false");
          sessionStorage.setItem("first", JSON.stringify(this.table.first));
        },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    ).then(() => this.progressSpinner = false).then(() => {
      if (sessionStorage.getItem("usuarioBody")) {
        sessionStorage.setItem("vieneDeFactura","true")
        this.router.navigate(["/fichaPersonaJuridica"]);
      } 
    });
  }



  noEsColegiado(filtros,selectedRow){
    this.sigaServices.postPaginado("busquedaNoColegiados_searchNoColegiado", "?numPagina=1", filtros).toPromise().then(
      n => {
        let results = JSON.parse(n.body);
        console.log(results.noColegiadoItem)
        if (results != undefined && results.noColegiadoItem.length != 0) {
           let datosColegiado = results.noColegiadoItem[0];

           sessionStorage.setItem("facturaItem", JSON.stringify(selectedRow));
           sessionStorage.setItem("volver", "true");
            sessionStorage.setItem("esColegiado", "false");
           sessionStorage.setItem("personaBody", JSON.stringify(datosColegiado));
           sessionStorage.setItem("solicitudAprobada", "true");
           sessionStorage.setItem("origin", "Cliente");
         }else{

        }
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    ).then(() => this.progressSpinner = false).then(() => {
      if (sessionStorage.getItem("personaBody")) {
        sessionStorage.setItem("vieneDeFactura","true")
        this.router.navigate(["/fichaColegial"]);
      } 
    });
  }

  esUnColegiado(filtros,selectedRow){
    this.sigaServices.postPaginado("busquedaColegiados_searchColegiadoFicha", "?numPagina=1", filtros).toPromise().then(
      n => {
        let results: DatosColegiadosItem[] = JSON.parse(n.body).colegiadoItem;
        
        if (results != undefined && results.length != 0) {
          let datosColegiado: DatosColegiadosItem = results[0];

          sessionStorage.setItem("facturaItem", JSON.stringify(selectedRow));
          sessionStorage.setItem("volver", "true");
          sessionStorage.setItem("esColegiado", "true");
          sessionStorage.setItem("personaBody", JSON.stringify(datosColegiado));
          sessionStorage.setItem("solicitudAprobada", "true");
          sessionStorage.setItem("origin", "Cliente");
        }else{

        }
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    ).then(() => this.progressSpinner = false).then(() => {
      if (sessionStorage.getItem("personaBody")) {
        sessionStorage.setItem("vieneDeFactura","true")
        this.router.navigate(["/fichaColegial"]);
      } 
    });
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
    //console.log("eliminaaa")
    this.selectedDatos.forEach(element => {
      if(element.idAccionUlt == "4"  ){ //
        let itemFacturaEstadosPagoItem:FacturaEstadosPagosItem = new FacturaEstadosPagosItem()
        itemFacturaEstadosPagoItem.idFactura = element.idFactura,
        itemFacturaEstadosPagoItem.idAccion = element.idAccionUlt,
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

  comboRenegociar(){
    this.comboAction =  [
      { value: "cuentaFactura_activa", label: "1. "+this.translateService.instant("facturacion.facturas.tarjeta.renegociar.opcionBanco"), local: undefined },
      { value: "cuentaFactura_activa_masClientes", label: "2. "+this.translateService.instant("facturacion.facturas.tarjeta.renegociar.opcionBancoNo"), local: undefined },
      { value: "caja",  label: "3. "+this.translateService.instant("facturacion.facturas.tarjeta.renegociar.opcionCaja"), local: undefined }
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
    this.comboRenegociar();
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
    this.itemsParaModificarAbonos = [];
    this.selectedDatos.forEach(element =>{
        let item:FacturaEstadosPagosItem = new FacturaEstadosPagosItem();
        if(element.tipo == "FACTURA"  && ["2", "4", "5"].includes(element.idEstado) ){
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

          item.modo = this.comboSel;

          // Acción
          item.idAccion = "7";
          item.accion = this.translateService.instant("facturacion.facturas.estadosPagos.renegociacion");

          item.modo = this.comboSel;

          // El importe pendiente se recalcula
          item.impTotalPagado = 0;
          item.impTotalPorPagar = parseFloat(element.importePorPagarUlt);

          this.itemsParaModificar.push(item);
        }
    });

    this.selectedDatos.forEach(element =>{
      let item:FacturaEstadosPagosItem = new FacturaEstadosPagosItem();
      if( element.tipo == "ABONO" && element.idEstado != "1"){
        // IdFactura
        item.idAbono = element.idAbono;
        item.nuevo = true;
        let fechaActual: Date = new Date();
        item.fechaMin = fechaActual > new Date(element.fechaModificacionUlt) ? fechaActual : new Date(element.fechaModificacionUlt);
        if(this.itemAction.fechaModificaion  > new Date(element.fechaModificacionUlt) ){
          item.fechaModificaion = this.itemAction.fechaModificaion
        }else{
          item.fechaModificaion = new Date();
        }
        item.comentario = this.itemAction.comentario;
        item.notaMaxLength = 1024;

        item.modo = this.comboSel;

        // Acción
        item.idAccion = "7";
        item.accion = this.translateService.instant("facturacion.facturas.estadosPagos.renegociacion");

        item.modo = this.comboSel;

        // El importe pendiente se recalcula
        item.impTotalPagado = 0;
        item.impTotalPorPagar =  parseFloat(element.importePorPagarUlt);

        this.itemsParaModificarAbonos.push(item);
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

          item.impTotalPagado =  parseFloat(element.importePorPagarUlt);

          // Acción
          item.idAccion = "4";
          item.accion = this.translateService.instant("facturacion.facturas.estadosPagos.cobroPorCaja");

          // El importe pendiente se recalcula
          item.impTotalPagado = parseFloat(element.importePorPagarUlt);
          item.impTotalPorPagar = 0;

          this.itemsParaModificar.push(item);
        }
    });
  }

  nuevoAbonoSJCS(): void {
    this.itemsParaModificar = [];
    this.selectedDatos.forEach(element =>{
      if (this.ESTADO_ABONO_CAJA == element.idEstado && element.tipo =="ABONO")  {
        let item:FacturaEstadosPagosItem = new FacturaEstadosPagosItem();
          item.nuevo = true;
          let fechaActual: Date = new Date();
          item.fechaMin = fechaActual > new Date(element.fechaModificacionUlt) ? fechaActual : new Date(element.fechaModificacionUlt);
          if(this.itemAction.fechaModificaion  > new Date(element.fechaModificacionUlt) ){
            item.fechaModificaion = this.itemAction.fechaModificaion
          }else{
            item.fechaModificaion = new Date();
          }
          item.idAbono = element.idAbono
          item.notaMaxLength = 256;
          // Acción
          item.idAccion = this.ACCION_ABONO_NUEVO_CAJA;
          item.accion = this.translateService.instant("facturacion.abonosPagos.datosPagoAbono.abonoCaja");

          // El importe pendiente se recalcula
          item.movimiento = element.importeAdeudadoPendiente.toString();
          item.importePendiente = "0";

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

      item.impTotalPagado = 0;
      item.impTotalPorPagar =  parseFloat(element.importePorPagarUlt);

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
  
        item.impTotalPagado = 0;
        item.impTotalPorPagar =  parseFloat(element.importePorPagarUlt);

        this.itemsParaModificar.push(item)
      }

    });
  }

  anularFacturas() {
    this.itemsParaModificar= [];
    this.selectedDatos.forEach(element =>{
      if(element.tipo =="FACTURA" && !["7", "8"].includes(element.estadoUlt)){
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
  
        item.impTotalPagado =  parseFloat(element.importePorPagarUlt);
        item.impTotalPorPagar = 0;

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
         this.nuevoAbonoSJCS();
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
   if(accionAux == "Nuevo Abono"){
     this.guardarAbono();
   }else if(accionAux == "Renegociar"){
    this.guardarDefi();
    this.guardarRenegociar();
   } else{
    this.guardarDefi();
   }
   
  }
  
isValid(){
  let isValid:boolean = true;
  if(this.esRenegociar && this.comboSel == null || this.comboSel == ""){
    isValid = false
    this.resaltadoDatos = true;
  }
  if(!this.esRenegociar && this.combo && this.comboSel == null || this.comboSel == ""){
    isValid = false
    this.resaltadoDatos = true;
  } 
  if(this.itemAction.fechaMin == null || this.itemAction.fechaMin == undefined || this.itemAction.fechaMin.toString() == ""){
    this.resaltadoFecha = true
    isValid = false;
  }
  
  if(!isValid) this.muestraCamposObligatorios()

  return isValid;
}
requisitos(){
  let cumpleTodo:boolean = true;
  if(this.itemsParaModificar.length == 0){
    //Las facturas seleccionadas no cumplen con los requisitos para la accion.
   this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacion.facturas.cargaMasiva.error"));
   return false;
  }
  return true;
}
mensajeCargaMasiva(registrosProcesados,totalRegistros){
  if(registrosProcesados != "0"){
    this.showMessage("success", this.translateService.instant("general.message.informacion"), 
    this.translateService.instant("facturacion.facturas.cargaMasiva.procesamiento") + " "+ registrosProcesados+ "/"+totalRegistros
    +  this.translateService.instant("consultas.consultaslistas.literal.registros")
    );
  }else{
    this.showMessage("error", this.translateService.instant("general.message.informacion"), 
    this.translateService.instant("facturacion.facturas.cargaMasiva.procesamiento.error") 
    );
  }

}

  guardarDefi() {
    if(this.isValid() && this.requisitos()){
      
      this.progressSpinner = true;
      this.sigaServices.post("facturacionPyS_insertarEstadosPagosVarios", this.itemsParaModificar).toPromise()
        .then(
          n => {
            this.mensajeCargaMasiva(JSON.parse(n.body).id,this.itemsParaModificar.length)
           // this.guardadoSend.emit(this.bodyInicial);
           this.busqueda.emit();
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
    
    }
     
  }

  guardarAbono() {
    
    if(this.isValid() &&  this.requisitos()){
      this.progressSpinner = true;
      this.sigaServices.post("facturacionPyS_nuevoAbonoMasivo", this.itemsParaModificar).subscribe(
        n => {
          this.progressSpinner = false;
          this.mensajeCargaMasiva(JSON.parse(n.body).id,this.itemsParaModificar.length)     
         this.cerrarDialog(false);
         this.busqueda.emit();
        },
        err => {
          this.progressSpinner = false;
          this.handleServerSideErrorMessage(err);
        }
      );}
     } 

  guardarRenegociar() {
    if(this.isValid() && this.itemsParaModificarAbonos.length > 0){
      this.progressSpinner = true;
      this.sigaServices.post('facturacionPyS_renegociarAbonoVarios', this.itemsParaModificarAbonos).subscribe(
        n => {
          this.progressSpinner = false;
          this.mensajeCargaMasiva(JSON.parse(n.body).id,this.itemsParaModificarAbonos.length)
          this.busqueda.emit();
        },
        err => {
          this.progressSpinner = false;
          this.handleServerSideErrorMessage(err);
        }
      );
    }
  }

  disabledAnular(){
    let deshabilitar = true;
    this.selectedDatos.forEach(element => {
      if(element.tipo == 'FACTURA' && ["2", "4", "5"].includes(element.idEstado)) {
        deshabilitar = false;
      }
    });
    return deshabilitar;
  }

  disabledRenegociar(){
    let deshabilitar = true;
    this.selectedDatos.forEach(element => {
     if(["4", "5"].includes(element.idEstado)) {
      deshabilitar = false;
     }
    });
    return deshabilitar;
  }

  disabledNuevoCobro(){
    let deshabilitar = true;
    this.selectedDatos.forEach(element => {
    if(element.tipo == 'FACTURA' && ["2"].includes(element.idEstado)) {
      deshabilitar = false;
    }
    });
    return deshabilitar;
    // ultimaAccion.impTotalPorPagar == 0;
  }

  disabledNuevoAbono(): boolean {
    let deshabilitar = true;
    this.selectedDatos.forEach(element => {
    if(element.tipo == 'ABONO' && ["6"].includes(element.idEstado)) {
      deshabilitar = false;
    }
    });
    return deshabilitar;
  }

  disabledDevolver(): boolean {
    let deshabilitar = true;
    this.selectedDatos.forEach(element => {
     if(element.tipo == 'FACTURA' && ["1"].includes(element.idEstado)) {
      deshabilitar = false;
     } 
    });
    return deshabilitar;
  }

  disabledEliminar(): boolean {
    let deshabilitar = true;
    this.selectedDatos.forEach(element => {
     if(element.tipo == 'FACTURA' && ["1"].includes(element.idEstado)) {
      deshabilitar = false;
     }
    });
    return deshabilitar;
  }

  disabledGenerarInforme(): boolean {
    return this.selectedDatos.length < 1;
  }

  disabledComunicar(): boolean {
    return this.selectedDatos.length < 1;
  }
}
