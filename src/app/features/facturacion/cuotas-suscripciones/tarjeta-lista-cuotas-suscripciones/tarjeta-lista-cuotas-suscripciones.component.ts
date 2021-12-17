import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message, SortEvent } from 'primeng/api';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { ListaSuscripcionesItem } from '../../../../models/ListaSuscripcionesItem';
import { procesos_PyS } from '../../../../permisos/procesos_PyS';
import { SigaStorageService } from '../../../../siga-storage.service';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-tarjeta-lista-cuotas-suscripciones',
  templateUrl: './tarjeta-lista-cuotas-suscripciones.component.html',
  styleUrls: ['./tarjeta-lista-cuotas-suscripciones.component.scss']
})
export class TarjetaListaCuotasSuscripcionesComponent implements OnInit {

  msgs: Message[] = [];

  estadosSuscripcionObject: ComboItem[] = [];

  @Output() actualizarLista = new EventEmitter<Boolean>();
  @Input() listaSuscripciones: ListaSuscripcionesItem[];
  @ViewChild("suscripcionesTable") suscripcionesTable: DataTable;

  cols = [
    { field: "fechaSolicitud", header: "formacion.busquedaInscripcion.fechaSolicitud" },
    { field: "nSolicitud", header: "facturacion.productos.nSolicitud" },
    { field: "nIdentificacion", header: "censo.consultaDatosColegiacion.literal.numIden" },
    { field: "nColegiado", header: "censo.busquedaClientesAvanzada.literal.nColegiado" },
    { field: "apellidosNombre", header: "justiciaGratuita.oficio.designas.interesados.apellidosnombre" },
    { field: "concepto", header: "facturacionSJCS.facturacionesYPagos.conceptos" },
    { field: "desFormaPago", header: "facturacion.productos.formapago" },
    { field: "precioPerio", header: "facturacionSJCS.facturacionesYPagos.importe" },
    { field: "idEstadoSolicitud", header: "solicitudes.literal.titulo.estadosolicitud" },
    { field: "fechaEfectiva", header: "facturacion.suscripciones.fechaAltaBaja" },
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

  permisoSolicitarSuscripcion: boolean = false;
  permisoAprobarSuscripcion: boolean = false;
  permisoAnularSuscripcion: boolean = false;
  permisoDenegar: boolean = false;

  selectedRows: ListaSuscripcionesItem[] = []; //Datos de las filas seleccionadas.
  numSelectedRows: number = 0; //Se usa para mostrar visualmente el numero de filas seleccionadas
  selectMultipleRows: boolean = true; //Seleccion multiples filas de la tabla
  selectAllRows: boolean = false; //Selecciona todas las filas de la pagina actual de la tabla
  rowsPerPage: number = 10; //Define el numero de filas mostradas por pagina
  first = 0;
  buscadores = [];
  currentDate: Date = new Date();

  progressSpinner: boolean = false;
  esColegiado: boolean; // Con esta variable se determina si el usuario conectado es un colegiado o no.

  constructor(
    private sigaServices: SigaServices, private translateService: TranslateService,
    private commonsService: CommonsService, private router: Router,
    private localStorageService: SigaStorageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    if(this.localStorageService.isLetrado){
      this.esColegiado = true;
    }
    else{
      this.esColegiado = false;
    }
    this.checkPermisos();
    this.initComboEstadoSuscripcion();
  }

  initComboEstadoSuscripcion() {
    //PENDIENTE
    let estadoPendiente = new ComboItem();
    estadoPendiente.label = this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.pendiente");
    estadoPendiente.value = "1";
    this.estadosSuscripcionObject.push(estadoPendiente);
    //DENEGADA
    let estadoDenegada = new ComboItem();
    estadoDenegada.label = this.translateService.instant("facturacion.productos.denegada");
    estadoDenegada.value = "2";
    this.estadosSuscripcionObject.push(estadoDenegada);
    //ACEPTADA
    let estadoAceptada = new ComboItem();
    estadoAceptada.label = this.translateService.instant("facturacion.productos.aceptada");
    estadoAceptada.value = "3";
    this.estadosSuscripcionObject.push(estadoAceptada);
    //ANULACIÓN SOLICITADA
    let estadoAnulacionSolicitada = new ComboItem();
    estadoAnulacionSolicitada.label = this.translateService.instant("facturacion.productos.anulacionSolicitada");
    estadoAnulacionSolicitada.value = "4";
    this.estadosSuscripcionObject.push(estadoAnulacionSolicitada);
    //ANULADA
    let estadoAnulada = new ComboItem();
    estadoAnulada.label = this.translateService.instant("facturacion.productos.anulada");
    estadoAnulada.value = "5";
    this.estadosSuscripcionObject.push(estadoAnulada);
  }

  checkPermisos() {
    this.getPermisoAprobarSuscripcion();
    this.getPermisoDenegar();
    this.getPermisoAnularSuscripcion();
  }

  checkAprobar() {
    let msg = this.commonsService.checkPermisos(this.permisoAprobarSuscripcion, undefined);

    if (msg != null) {
      this.msgs = msg;
    } else if(this.esColegiado){
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    }
    else {
      this.aprobarSuscripcion();
    }
  }

  checkDenegar() {
    let msg = null;
    msg = this.commonsService.checkPermisos(this.permisoDenegar, undefined);

    if (msg != null) {
      this.msgs = msg;
    } else {
      this.denegar();
    }
  }

  // REVISAR: Añadir comprobación de facturación
  checkAnularSuscripcion(){
    let msg = this.commonsService.checkPermisos(this.permisoAnularSuscripcion, undefined);

    
    if (msg != null) {
      this.msgs = msg;
    }  
    else {

      let susShow : ListaSuscripcionesItem[] = [];

      //Se comprueban los estados de las solicitudes
      if(this.selectedRows.filter(el => !((el.fechaEfectiva != null && el.fechaSolicitadaAnulacion != null) && el.fechaAnulada == null)) != undefined){
        susShow.concat(this.selectedRows.filter(el => !((el.fechaEfectiva != null && el.fechaSolicitadaAnulacion != null) && el.fechaAnulada == null)));
        this.selectedRows = this.selectedRows.filter( ( el ) => !susShow.includes( el ) );
      } 
      //Se comprueba que todos los servicios de la peticion tienen la propiedad ‘Solicitar baja por internet’ si el que lo solicita es un colegiado
      //Este parametro "solicitarBaja" de este objeto tiene una logica distinta a la de los servicios
      if(this.esColegiado && (this.selectedRows.filter(el => el.solicitarBaja != "0") != undefined)){
        susShow.concat(this.selectedRows.filter(el => el.solicitarBaja != "0"));
        this.selectedRows = this.selectedRows.filter( ( el ) => !susShow.includes( el ) );
      }
      //Se comprueba si hay algún servicio automatico ya que entonces no se puede realizar la accion
      if(this.selectedRows.filter(el => el.automatico == "1") != undefined){
        susShow.concat(this.selectedRows.filter(el => el.automatico = "1"));
        this.selectedRows = this.selectedRows.filter( ( el ) => !susShow.includes( el ) );
      }
      this.confirmAnular(susShow);
    }
  }

  confirmAnular(susShow) {

    let mess = this.translateService.instant(
      "facturacion.productos.anulConf"
    );

    //REVISAR LOGICA FACTURAS EN LA CONSULTA DE SUSCRIPCIONES
    //Se comprueba si alguna solicitud tiene alguna factura asoviada
    if(this.selectedRows.find(el => el.facturas != "0") != undefined) {
      mess = this.translateService.instant("facturacion.productos.factNoAnuladaPet");
    }

    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      key: 'anulPeticion',
      message: mess,
      icon: icon,
      accept: () => {
        this.anularPeticion(susShow);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: this.translateService.instant("general.boton.cancel"),
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  anularPeticion(susShow: ListaSuscripcionesItem[]){
    if(this.selectedRows.length > 0){
      this.progressSpinner = true;
      let peticion: FichaCompraSuscripcionItem[] = [];
      this.selectedRows.forEach(row => {
        let solicitud: FichaCompraSuscripcionItem = new FichaCompraSuscripcionItem();
        solicitud.nSolicitud = row.nSolicitud;
        solicitud.fechaAceptada = row.fechaEfectiva;
        solicitud.fechaDenegada = row.fechaDenegada;
        solicitud.fechaAnulada = row.fechaAnulada;
        solicitud.fechaSolicitadaAnulacion = row.fechaSolicitadaAnulacion;
        peticion.push(solicitud);
      });
      this.sigaServices.post('PyS_anularSuscripcionMultiple', peticion).subscribe(
        (n) => {
          if (n.status != 200) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          } else if(JSON.parse(n.body).error.description!="" || susShow.length > 0){
            let mess = "";
            for(let sus of susShow){
              mess += sus.nSolicitud + ", ";
            }
            mess = mess.substr(1,mess.length-3);
            this.showMessage("info", this.translateService.instant("facturacion.productos.solicitudesNoAlteradas"), this.translateService.instant("facturacion.productos.solicitudesNoAlteradasDesc") +JSON.parse(n.body).error.description+", "+mess);
          }else {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            //Se actualiza la información de la ficha
            this.actualizarLista.emit(true);
          }

          
          this.selectedRows = [];
          this.numSelectedRows = 0;
          this.progressSpinner = false;
        },
        (err) => {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          this.progressSpinner = false;
        }
      );
    }
    else{
      let mess = "";
      for(let sus of susShow){
        mess += sus.nSolicitud + ", ";
      }
      mess = mess.substr(1,mess.length-3);

      this.showMessage("info", this.translateService.instant("facturacion.productos.solicitudesNoAlteradas"), this.translateService.instant("facturacion.productos.solicitudesNoAlteradasDesc") + mess);
          
    }
  }

  checkFacturar(){
    this.msgs = [
      {
        severity: "info",
        summary: "En proceso",
        detail: "Boton no funcional actualmente"
      }
    ];
  }

  aprobarSuscripcion() {

    this.progressSpinner = true;
    let peticion: FichaCompraSuscripcionItem[] = [];
    this.selectedRows.forEach(row => {
      let solicitud: FichaCompraSuscripcionItem = new FichaCompraSuscripcionItem();
      solicitud.nSolicitud = row.nSolicitud;
      solicitud.fechaAceptada = row.fechaEfectiva;
      solicitud.fechaDenegada = row.fechaDenegada;
      peticion.push(solicitud);
    });
    this.sigaServices.post('PyS_aprobarSuscripcionMultiple', peticion).subscribe(
      (n) => {
        if (n.status != 200) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else if(JSON.parse(n.body).error.description!=""){
          this.showMessage("info", this.translateService.instant("facturacion.productos.solicitudesNoAlteradas"), this.translateService.instant("facturacion.productos.solicitudesNoAlteradasDesc") +JSON.parse(n.body).error.description);
        }else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          //Se actualiza la información de la ficha
          this.actualizarLista.emit(true);
        }

        
        this.selectedRows = [];
        this.numSelectedRows = 0;
        this.progressSpinner = false;
      },
      (err) => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    );
  }

  denegar() {
    this.progressSpinner = true;
    let peticion: FichaCompraSuscripcionItem[] = [];
    this.selectedRows.forEach(row => {
      let solicitud: FichaCompraSuscripcionItem = new FichaCompraSuscripcionItem();
      solicitud.nSolicitud = row.nSolicitud;
      solicitud.fechaAceptada = row.fechaEfectiva;
      solicitud.fechaDenegada = row.fechaDenegada;
      peticion.push(solicitud);
    });
    this.sigaServices.post('PyS_denegarPeticionMultiple', peticion).subscribe(
      (n) => {
        if (n.status != 200) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else if(JSON.parse(n.body).error.description!=""){
          this.showMessage("info", this.translateService.instant("facturacion.productos.solicitudesNoAlteradas"), this.translateService.instant("facturacion.productos.solicitudesNoAlteradasDesc") +JSON.parse(n.body).error.description);
        }else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          //Se actualiza la información de la ficha
          this.actualizarLista.emit(true);
        }

        


        this.selectedRows = [];
        this.numSelectedRows = 0;
        this.progressSpinner = false;
      },
      (err) => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }

    );
  }

  openTab(rowData) {
    this.progressSpinner = true;
    let suscripcion = new FichaCompraSuscripcionItem();
    suscripcion.nSolicitud = rowData.nSolicitud;
    suscripcion.servicios = [];
    suscripcion.fechaAceptada = rowData.fechaEfectiva;
    this.sigaServices.post('PyS_getFichaCompraSuscripcion', suscripcion).subscribe(
      (n) => {
        this.progressSpinner = false;
        sessionStorage.setItem("FichaCompraSuscripcion", n.body);
        this.router.navigate(["/fichaCompraSuscripcion"]);
      }
    );
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  getPermisoAprobarSuscripcion() {
    this.commonsService
      .checkAcceso(procesos_PyS.aprobarSuscripcion)
      .then((respuesta) => {
        this.permisoAprobarSuscripcion = respuesta;
      })
      .catch((error) => console.error(error));
  }

  getPermisoDenegar() {
    //Según la documentación funcional de Productos y Servicios, cualquier usuario que tenga acceso total puede realizar esta acción
    this.commonsService
      .checkAcceso(procesos_PyS.fichaCompraSuscripcion)
      .then((respuesta) => {
        this.permisoDenegar = respuesta;
      })
      .catch((error) => console.error(error));
  }

  //Metodo activado al pulsar sobre el checkbox Seleccionar todo
  onChangeSelectAllRows() {
    if (this.selectAllRows === true) {
      this.selectedRows = this.listaSuscripciones;
      this.numSelectedRows = this.listaSuscripciones.length;

    } else {
      this.selectedRows = [];
      this.numSelectedRows = 0;
    }
  }

  //Metodo para aplicar logica al deseleccionar filas
  onRowUnselect() {
    this.numSelectedRows = this.selectedRows.length;
  }
  //Metodo para aplicar logica al seleccionar filas
  onRowSelect() {
    this.numSelectedRows = this.selectedRows.length;
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

  //Borra el mensaje de notificacion p-growl mostrado en la esquina superior derecha cuando pasas el puntero del raton sobre el
  clear() {
    this.msgs = [];
  }

  onChangeRowsPerPages(event) {
    this.rowsPerPage = event.value;
    this.suscripcionesTable.reset();
  }

  getPermisoAnularSuscripcion(){
    //En la documentación no parece distinguir que se requiera una permiso especifico para esta acción
    this.commonsService
			.checkAcceso(procesos_PyS.anularSuscripcion)
			.then((respuesta) => {
				this.permisoAnularSuscripcion = respuesta;
			})
			.catch((error) => console.error(error));
  }

}
