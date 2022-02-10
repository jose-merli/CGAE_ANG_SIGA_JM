import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable } from 'primeng/primeng';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Message } from 'primeng/components/common/message';
import { FacAbonoItem } from '../../../../../models/sjcs/FacAbonoItem';
import { DatePipe } from '@angular/common';
import { TranslateService } from '../../../../../commons/translate';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { DatosColegiadosItem } from '../../../../../models/DatosColegiadosItem';
import { saveAs } from 'file-saver/FileSaver';
import { FacturaEstadosPagosItem } from '../../../../../models/FacturaEstadosPagosItem';
import { ComboItem } from '../../../../../models/ComboItem';
import { element } from 'protractor';

@Component({
  selector: 'app-tabla-abonos-sjcs',
  templateUrl: './tabla-abonos-sjcs.component.html',
  styleUrls: ['./tabla-abonos-sjcs.component.scss'],

})
export class TablaAbonosSCJSComponent implements OnInit {

  msgs: Message[] = [];
  msgsDescarga:Message[] = [];
  progressSpinner: boolean = false;
  permisoEscritura: boolean = true;

  //Resultados de la busqueda
  @Input() datos: FacAbonoItem[];
  @Input() filtro;
  @Output() busqueda = new EventEmitter<boolean>();
  
  // Elementos para la tabla
  @ViewChild("table") table: DataTable;
  rowsPerPage = [];
  selectedItem: number = 10;
  selectedDatos: FacAbonoItem[] = [];
  cols = [];
  buscadores = [];
  selectAll: boolean;
  selectMultiple: boolean;
  disabledNuevo : boolean = false;
  enabledSave:boolean = false;
  editar:boolean = false;

  openFichaModal:boolean = false;
  esRenegociar:boolean = false;
  showModal:boolean = false;
  itemAction:FacturaEstadosPagosItem = new FacturaEstadosPagosItem();
  comboAction:ComboItem[] = [];
  FAC_ABONO_ESTADO_PENDIENTE_BANCO: string = "5";
  comboSel:string;
  actionBtn:string;
  itemsParaModificar:FacturaEstadosPagosItem[] = [];
  ESTADO_ABONO_PAGADO: string = "1";
  ESTADO_ABONO_BANCO: string = "5";
  ESTADO_ABONO_CAJA: string = "6";

  ACCION_ABONO_COMPENSACION: string = "10";
  ACCION_ABONO_RENEGOCIACION: string = "7";
  ACCION_ABONO_NUEVO_CAJA: string = "4";
  endPoint:string;
  resaltadoDatos: boolean = false;
  resaltadoFecha: boolean = false;
  nombreTarjeta:string="";

  constructor(
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private datepipe: DatePipe,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }
    this.itemAction.fechaMin = new Date()

    this.getCols();
  }

  // Se actualiza cada vez que cambien los inputs
  ngOnChanges() {
    this.selectedDatos = [];
    console.log("CA")
  }

  // Definición de las columnas
  getCols() {
    this.cols = [
      { field: "numeroAbono", header: this.translateService.instant("facturacionSJCS.tabla.abonosSJCS.numeroAbono"), width: "10%" },
      { field: "fechaEmision", header: this.translateService.instant("facturacion.facturas.fechaEmision"), width: "10%" },
      { field: "nombrePago", header: this.translateService.instant("facturacionSJCS.tabla.abonosSJCS.pagoSJCS"), width: "20%" },
      { field: "ncolident", header: this.translateService.instant("facturacion.facturas.numeroColegiadoIdentificador"), width: "10%" },
      { field: "nombreCompleto", header: this.translateService.instant("facturacion.productos.Cliente"), width: "20%" },
      { field: "esSociedad", header: this.translateService.instant("facturacionSJCS.filtros.abonosSJCS.sociedad"), width: "10%" },
      { field: "importeTotal", header: this.translateService.instant("facturacionSJCS.facturacionesYPagos.importeTotal"), width: "10%" }, 
      { field: "importePendientePorAbonar", header: this.translateService.instant("facturacion.facturas.importePendiente"), width: "10%" },
      { field: "estadoNombre", header: this.translateService.instant("censo.fichaIntegrantes.literal.estado"), width: "10%" }, 
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
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 30,
        value: 30
      },
    ];
  }

  // Abrir ficha de fichero de devoluciones
  openTab(evento) {
    console.log("evento -> ", evento);

    this.progressSpinner = true;

    this.persistenceService.setDatos(evento);
    
    sessionStorage.setItem('filtrosAbonosSJCS', JSON.stringify(this.filtro));
    sessionStorage.setItem('abonosSJCSItem', JSON.stringify(evento));

    this.router.navigate(["/fichaAbonosSJCS"]);


  }
  abreCierraFicha(){
    this.openFichaModal = !this.openFichaModal
  }

  navigateToCliente(selectedRow:FacAbonoItem) {
    
    if (selectedRow.esSociedad == "NO") {
      
      this.progressSpinner = true;

      sessionStorage.setItem("consulta", "true");
      let filtros = { idPersona: selectedRow.idPersona };

      this.sigaServices.postPaginado("busquedaColegiados_searchColegiadoFicha", "?numPagina=1", filtros).toPromise().then(
        n => {
          let results: DatosColegiadosItem[] = JSON.parse(n.body).colegiadoItem;
          
          if (results != undefined && results.length != 0) {
            let datosColegiado: DatosColegiadosItem = results[0];

            
            sessionStorage.setItem("abonosSJCSItem", JSON.stringify(selectedRow));
            sessionStorage.setItem("volverAbonoSJCS", "true");

            sessionStorage.setItem("personaBody", JSON.stringify(datosColegiado));
            sessionStorage.setItem("filtrosAbonosSJCS", JSON.stringify(this.filtro));
            sessionStorage.setItem("solicitudAprobada", "true");
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
    }else{
      this.progressSpinner = true;
    
      this.sigaServices.postPaginado(
        "fichaColegialSociedades_searchSocieties",
        "?numPagina=1", selectedRow.idPersona).toPromise().then(
        n => {
          let results: any[] = JSON.parse(n.body).busquedaJuridicaItems;
          if (results != undefined && results.length != 0) {
            let sociedadItem: any = results[0];
  
            sessionStorage.setItem("abonosSJCSItem", JSON.stringify(selectedRow));
            sessionStorage.setItem("volver", "true");
  
            sessionStorage.setItem("usuarioBody", JSON.stringify(sociedadItem));
          }
        },
        err => {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      ).then(() => this.progressSpinner = false).then(() => {
        if (sessionStorage.getItem("usuarioBody")) {
          this.router.navigate(["/fichaPersonaJuridica"]);
        } 
      });
    }
    
  }

  fillFecha(event, campo) {
    if(campo==='fechaMin')
      this.itemAction.fechaMin = event;
  }


  disableNuevoFicheroTransferencias() {
    return !this.selectedDatos || this.selectedDatos.filter(d => d.estado && d.estado.toString() == this.FAC_ABONO_ESTADO_PENDIENTE_BANCO).length == 0;
  }

  // Confirmación de un nuevo fichero de transferencias
  confirmNuevoFicheroTransferencias(): void {
    let mess = this.translateService.instant("facturacionPyS.facturas.fichTransferenciasSJCS.confirmacion");
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

    let abonosFichero = this.selectedDatos.filter(d => d.estado && d.estado.toString() == this.FAC_ABONO_ESTADO_PENDIENTE_BANCO).map(d => {
      return {
        idAbono: d.idAbono
      };
    });

    this.sigaServices.post("facturacionPyS_nuevoFicheroTransferenciasSjcs", abonosFichero).subscribe(
      n => {
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("facturacionPyS.facturas.fichTransferenciasSJCS.generando"));
        this.busqueda.emit();
      },
      err => {
        this.handleServerSideErrorMessage(err);
        this.progressSpinner = false;
      }
    );
  }

  // Resultados por página
  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  // Checkbox de seleccionar todo
  onChangeSelectAll(): void {
      if (this.selectAll) {
        this.selectMultiple = true;
        this.selectedDatos = this.datos;
      } else {
        this.selectedDatos = [];
        this.selectMultiple = false;
      }
  }


  // FUnciones de utilidad

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

  generarExcel(){
    

    let descargasPendientes = JSON.parse(sessionStorage.getItem('descargasPendientes'));
  descargasPendientes = descargasPendientes + 1;
  sessionStorage.setItem('descargasPendientes', descargasPendientes);
  this.showInfoPerenne(
    this.translateService.instant("general.accion.descargaCola.inicio") + descargasPendientes
  );


  this.sigaServices
    .postDownloadFiles("facturacionPyS_generarExcelAbonos", this.filtro)
    .subscribe(data => {
      if (data == null) {
        this.showInfo(this.translateService.instant("informesYcomunicaciones.consultas.mensaje.sinResultados"));
        descargasPendientes = JSON.parse(sessionStorage.getItem('descargasPendientes')) - 1;
        sessionStorage.setItem('descargasPendientes', descargasPendientes);        
      } else {
        let nombre = this.translateService.instant("censo.nombre.fichero.generarexcel") + new Date().getTime() + ".xlsx";
        saveAs(data, nombre);
        descargasPendientes = JSON.parse(sessionStorage.getItem('descargasPendientes')) - 1;
        sessionStorage.setItem('descargasPendientes', descargasPendientes);
        this.showInfoPerenne(
          this.translateService.instant("general.accion.descargaCola.fin")  + descargasPendientes
        );
      }
    }, error => {
      descargasPendientes = JSON.parse(sessionStorage.getItem('descargasPendientes')) - 1;
      sessionStorage.setItem('descargasPendientes', descargasPendientes);

      this.showFail(this.translateService.instant("informesYcomunicaciones.consultas.mensaje.error.ejecutarConsulta"));
    }, () => {
      
    });
  }


// Mensajes
showFail(mensaje: string) {

  this.msgs = [];
  this.msgs.push({ severity: "error", summary: "", detail: mensaje });
}

showSuccess(mensaje: string) {

  this.msgs = [];
  this.msgs.push({ severity: "success", summary: "", detail: mensaje });
}

showInfo(mensaje: string) {

  this.msgs = [];
  this.msgs.push({ severity: "info", summary: "", detail: mensaje });
}

showInfoPerenne(mensaje: string) {
  this.msgsDescarga = [];
  this.msgsDescarga.push({ severity: 'info', summary: '', detail: mensaje });
}
cerrarDialog(operacionCancelada: boolean) {
  this.showModal = false;
  this.esRenegociar = false;
  this.resaltadoFecha = false;
  this.resaltadoDatos = false;
  this.changeDetectorRef.detectChanges();

  if (operacionCancelada) {
    this.itemAction = new FacturaEstadosPagosItem();
    this.itemAction.comentario= ""
    this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
  }
}

modal(action:string){
  switch (action) {
    case  'Renegociar':
      this.esRenegociar = true;  
      this.nombreTarjeta = this.translateService.instant("general.boton.renegociar")
      this.comboNegociar()
      break;
    case  'Compensar':
      this.nombreTarjeta = this.translateService.instant("facturacionSJCS.facturacionesYPagos.compensar")
      this.esRenegociar = false;  
      break;
    case  'Nuevo':
      this.esRenegociar = false;  
      this.nombreTarjeta =this.translateService.instant("facturacion.facturas.estadosPagos.nuevoAbono")
    break;

  }
  this.actionBtn = action;
  if(action == 'Renegociar'){

  } 
  this.showModal = true;
}

accion(){
  switch (this.actionBtn) {
    case "Compensar":
      this.compensar()
      break;
    case "Renegociar":
      //this.renegociar()
      break;
    case "Nuevo":
      this.compensar()
    break;
  }
}

compensar(): void {
  this.itemsParaModificar= []
  this.selectedDatos.forEach(element =>{
    if(![this.ESTADO_ABONO_PAGADO].includes(element.estado.toString())){
      let item = new FacturaEstadosPagosItem();
      item.nuevo = true;
      item.fecha = new Date();
      item.notaMaxLength = 256;
      item.idAbono = element.idAbono.toString();
      // Acción
      item.idAccion = this.ACCION_ABONO_COMPENSACION;
      item.accion = "Compensación";//this.translateService.instant("facturacion.pagosFactura.accion.compensacion");

      
      // El importe pendiente se recalcula
      item.movimiento = element.importePendientePorAbonar.toString();
      item.importePendiente = "0";

      this.itemsParaModificar.push(item)
    }
  });
  this.endPoint = "facturacionPyS_compensarAbonoVarios"
  this.guardar()
}
nuevoAbono(): void {
  this.itemsParaModificar= []
  this.selectedDatos.forEach(element =>{
    if(this.ESTADO_ABONO_CAJA == element.estado.toString()){
      let item = new FacturaEstadosPagosItem();
      item.nuevo = true;
      item.fecha = new Date();
      item.notaMaxLength = 256;
      item.idAbono = element.idAbono.toString();
      // Acción
      item.idAccion =  this.ACCION_ABONO_NUEVO_CAJA;
      item.accion = "Abono por Caja";//this.translateService.instant("facturacion.pagosFactura.accion.compensacion");
      
      // El importe pendiente se recalcula
      item.movimiento = element.importePendientePorAbonar.toString();
      item.importePendiente = "0";

      this.itemsParaModificar.push(item)
      
    }
  });
  this.endPoint = "facturacionPyS_nuevoAbonoMasivo"
  this.guardar()
  
}
comboNegociar(){
  this.comboAction =  [
    { value: "1", label: this.translateService.instant("facturacion.facturas.tarjeta.renegociar.opcionBanco"), local: undefined },
    { value: "2", label: this.translateService.instant("facturacion.facturas.tarjeta.renegociar.opcionBancoNo"), local: undefined },
    { value: "3",  label: this.translateService.instant("facturacion.facturas.tarjeta.renegociar.opcionCaja"), local: undefined }
  ];
}
styleObligatorio(evento) {

  if (this.resaltadoDatos || this.resaltadoFecha && (evento == undefined || evento == null || evento == "")) {
    return this.commonsService.styleObligatorio(evento);
  }

}
muestraCamposObligatorios() {
this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
}
isValid(){
  let isValid:boolean = true;
  if(this.esRenegociar && this.comboSel == null || this.comboSel == ""){
    isValid = false
    this.resaltadoDatos = true;
  }

  if(this.itemAction.fechaMin == null || this.itemAction.fechaMin == undefined || this.itemAction.fechaMin.toString() == ""){
    this.resaltadoFecha = true
    isValid = false;
  }
  return isValid;
}
guardar() {
    
    /*case this.ACCION_ABONO_NUEVO_CAJA:
      endpoint = "facturacionPyS_pagarPorCajaAbono";
      break;

    case this.ACCION_ABONO_RENEGOCIACION:
      endpoint = "facturacionPyS_renegociarAbono";
      break;
  */
  if(this.isValid()){
    this.progressSpinner = true;
    this.sigaServices.post(this.endPoint, this.itemsParaModificar).subscribe(
      n => {
        this.progressSpinner = false;
       //refrescar this.refreshData.emit();

        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
      },
      err => {
        this.progressSpinner = false;
        this.handleServerSideErrorMessage(err);
      }
    );
  }else{
    this.muestraCamposObligatorios()
  }
    
  } 


}
