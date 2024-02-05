import { Component, OnInit, ViewChild } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { FichaCompraSuscripcionItem } from '../../../models/FichaCompraSuscripcionItem';
import { SigaServices } from '../../../_services/siga.service';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../commons/translate';
import { ListaProductosCompraItem } from '../../../models/ListaProductosCompraItem';
import { CommonsService } from '../../../_services/commons.service';
import { SigaStorageService } from '../../../siga-storage.service';
import { ComboItem } from '../../../models/ComboItem';
import { FilaHistoricoPeticionItem } from '../../../models/FilaHistoricoPeticionItem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ficha-compra-suscripcion',
  templateUrl: './ficha-compra-suscripcion.component.html',
  styleUrls: ['./ficha-compra-suscripcion.component.scss']
})
export class FichaCompraSuscripcionComponent implements OnInit {

  msgs : Message[];
  
  progressSpinner: boolean = false;

  ficha: FichaCompraSuscripcionItem = new FichaCompraSuscripcionItem;
  resaltadoDatos: boolean = false;

  comboComun: any[] = [];
  desFormaPagoSelecc: string;

  usuario: any[] = [];
  permisoAbogado:boolean = false;
  datosTarjetaResumen;
  iconoTarjetaResumen = "clipboard";
  comboPagos: ComboItem[] = [];
  pagoSeleccionado: String;
  lastFilaHistorica: FilaHistoricoPeticionItem = new FilaHistoricoPeticionItem;
  nuevaCompraSusc: boolean = false;


  @ViewChild("cliente") tarjCliente;
  @ViewChild("productos") tarjProductos;
  @ViewChild("servicios") tarjServicios;
  @ViewChild("facturas") tarjFacturas;
  @ViewChild("solicitud") tarjSolicitud;
  @ViewChild("descuentos") tarjDescuentos;
  esColegiado: boolean; // Con esta variable se determina si el usuario conectado es un colegiado o no.


  constructor(private location: Location, 
    private sigaServices: SigaServices, private translateService: TranslateService,
    private commonsService : CommonsService,
    private localStorageService: SigaStorageService,
    private datePipe: DatePipe,
    private router: Router) { }

  ngOnInit() {
    this.datosTarjetaResumen = [];
    if(this.localStorageService.isLetrado){
      this.esColegiado = true;
    }
    else{
      this.esColegiado = false;
    }
    this.compruebaAbogado();    if (sessionStorage.getItem("mensaje")) {
      let message: Message = JSON.parse(sessionStorage.getItem("mensaje"));
      if (message)
        this.showMessage(message.severity, message.summary, message.detail);
      sessionStorage.removeItem("mensaje");
      sessionStorage.removeItem("volver");
    }
    if(sessionStorage.getItem("origin") == "newProduct"){
      this.nuevaCompraSusc = true;
    }
    sessionStorage.removeItem("origin");

    if(sessionStorage.getItem("FichaCompraSuscripcion")){
      this.ficha = JSON.parse(sessionStorage.getItem("FichaCompraSuscripcion"));
      sessionStorage.removeItem("FichaCompraSuscripcion");
    }
    this.initCabecera();
  }

  compruebaAbogado(){  this.sigaServices.get("usuario_logeado").subscribe(n => {
    this.usuario = n.usuarioLogeadoItem;
    if (this.usuario[0].idPerfiles.indexOf("ABG") > -1 ) {
      this.permisoAbogado = true;
    }

  });}

  getComboFormaPago(): void {
    this.sigaServices.get("productosBusqueda_comboFormaPago").subscribe(
      comboDTO => {
        this.comboPagos = comboDTO.combooItems;
        this.progressSpinner = false;
        if(this.ficha.idFormaPagoSeleccionada){
          this.pagoSeleccionado = this.comboPagos.filter(combo => combo.value == this.ficha.idFormaPagoSeleccionada)[0].label;
          this.datosTarjetaResumen.push({label:'Forma de pago', value: this.pagoSeleccionado});
          this.getEstado();
        }
      },
      err => {
        this.progressSpinner = false;
      });
  }

  actualizarFicha(event: boolean = true){
    this.progressSpinner = true;

    this.sigaServices.post('PyS_getFichaCompraSuscripcion', this.ficha).subscribe(
      (n) => {

        if( n.status != 200) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          if (event) {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          }

          let newF:FichaCompraSuscripcionItem = JSON.parse(n.body);
          //newF.facturas= this.ficha.facturas;
          //Se comprueban las facturas asociadas nuevamente unicamente en caso de que se trate una compra
          //ya que unicamente podrian cambiar al pulsarse el botón facturar que actualmente solo esta disponible para las compras
          if(this.ficha.productos != null){
            this.tarjFacturas.getFacturasPeticion();
          }

          this.ficha = newF;
          this.datosTarjetaResumen = [];
          this.initCabecera();
          this.getEstado();
          if(this.ficha.servicios != null){
            this.tarjServicios.getServiciosSuscripcion();
          }

          if(this.ficha.impTotal != null){
            this.tarjDescuentos.actualizaImporte();
          }
        }

        this.progressSpinner = false;
          
      },
      (err) => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    );
  }

  scrollToOblig(element : string){
    this.resaltadoDatos = true;
    this.commonsService.scrollTablaFoco(element);
    if(element == "cliente"){
      this.tarjCliente.showTarjeta = true;
    }
    if(element == "productos"){
      this.tarjProductos.showTarjeta = true;
    }
    if(element == "servicios"){
      this.tarjServicios.showTarjeta = true;
    }
    if(element == "solicitud"){
      this.getEstado();
      this.tarjSolicitud.showTarjeta = true;
      this.tarjServicios.showTarjeta = false;
      this.tarjProductos.showTarjeta = false;
    }
  }

  initCabecera(): void {
    this.datosTarjetaResumen.push({label:'Nº solicitud', value: this.ficha.nSolicitud});
    this.datosTarjetaResumen.push({label:'Fecha solicitud', value: this.datePipe.transform(this.ficha.fechaPendiente, 'dd/MM/yyyy')});
    if (this.ficha.productos && this.ficha.productos.length > 0) {
      this.datosTarjetaResumen.push({label:'Productos', value: this.ficha.productos[0].descripcion});
      this.datosTarjetaResumen.push({label:'Total productos', value: this.ficha.productos.length})
    } else if (this.ficha.servicios && this.ficha.servicios.length > 0){
      this.datosTarjetaResumen.push({label:'Servicios', value: this.ficha.servicios[0].descripcion});
      this.datosTarjetaResumen.push({label:'Total servicios', value: this.ficha.servicios.length})
    }
    this.datosTarjetaResumen.push({label:'Importe total', value: this.ficha.impTotal ? this.ficha.impTotal + "€" : "0,00€"});
    if (this.ficha && this.comboPagos.length === 0) {
      this.getComboFormaPago();
    }
  }

  getEstado(): void {
    let filas = [];
    if(this.ficha.fechaPendiente!=null){
      let fila = new FilaHistoricoPeticionItem();
      fila.fecha = this.ficha.fechaPendiente;
      fila.estado = this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.pendiente");
      filas.push(fila);
    }
    if(this.ficha.fechaDenegada!=null){
      let fila = new FilaHistoricoPeticionItem();
      fila.fecha = this.ficha.fechaDenegada;
      fila.estado = this.translateService.instant("facturacion.productos.denegada");
      filas.push(fila);
    }
    if(this.ficha.fechaAceptada!=null){
      let fila = new FilaHistoricoPeticionItem();
      fila.fecha = this.ficha.fechaAceptada;
      fila.estado = this.translateService.instant("facturacion.productos.aceptada");
      filas.push(fila);
    }
    if(this.ficha.fechaSolicitadaAnulacion!=null){
      let fila = new FilaHistoricoPeticionItem();
      fila.fecha = this.ficha.fechaSolicitadaAnulacion;
      fila.estado = this.translateService.instant("facturacion.productos.anulacionSolicitada");
      filas.push(fila);
    }
    if(this.ficha.fechaAnulada!=null){
      let fila = new FilaHistoricoPeticionItem();
      fila.fecha = this.ficha.fechaAnulada;
      fila.estado = this.translateService.instant("facturacion.productos.anulada");
      filas.push(fila);
    }
    let lastfecha = Math.max(...filas.map(fila => new Date(fila.fecha).getTime()));
    let filasFiltradas = filas.filter(fila => fila.fecha === lastfecha);
    this.lastFilaHistorica = filasFiltradas[filasFiltradas.length-1];
    let indexEstado = this.datosTarjetaResumen.findIndex(dato => dato.label === 'Estado');
    indexEstado === -1 ? this.datosTarjetaResumen.push({label:'Estado', value: this.lastFilaHistorica.estado}) : 
        this.datosTarjetaResumen[indexEstado].value = this.lastFilaHistorica.estado;
  }

  backTo(){
    this.nuevaCompraSusc ? this.router.navigate(["/compraProductos"]): this.location.back();
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
}
