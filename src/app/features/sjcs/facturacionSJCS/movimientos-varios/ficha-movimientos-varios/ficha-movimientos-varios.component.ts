import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { ConfirmationService } from '../../../../../../../node_modules/primeng/primeng';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { BusquedaFisicaItem } from '../../../../../models/BusquedaFisicaItem';
import { ColegiadosSJCSItem } from '../../../../../models/ColegiadosSJCSItem';
import { MovimientosVariosService } from '../movimientos-varios.service';
import { MovimientosVariosFacturacionItem } from '../MovimientosVariosFacturacionItem';
import { procesos_facturacionSJCS } from '../../../../../permisos/procesos_facturacionSJCS';
import { MovimientosVariosFacturacionDTO } from '../../../../../models/sjcs/MovimientosVariosFacturacionDTO';
import { TarjetaCriteriosAplicacionComponent } from './tarjeta-criterios-aplicacion/tarjeta-criterios-aplicacion.component';
import { TarjetaDatosGeneralesComponent } from './tarjeta-datos-generales/tarjeta-datos-generales.component';

@Component({
  selector: 'app-ficha-movimientos-varios',
  templateUrl: './ficha-movimientos-varios.component.html',
  styleUrls: ['./ficha-movimientos-varios.component.scss']
})
export class FichaMovimientosVariosComponent implements OnInit {

  isLetrado: boolean = false;
  datos: MovimientosVariosFacturacionItem = new MovimientosVariosFacturacionItem();
  datosAux;
  modoEdicion;
  datosTarjetaResumen;
  bodyFisica: BusquedaFisicaItem = new BusquedaFisicaItem();
  datosColegiado: ColegiadosSJCSItem = new ColegiadosSJCSItem();
  datosTarjetaClientes;
  datosClientes;
  datosGenerales: MovimientosVariosFacturacionItem = new MovimientosVariosFacturacionItem();
  datosCriterios: MovimientosVariosFacturacionItem = new MovimientosVariosFacturacionItem();
  datosGuardar: MovimientosVariosFacturacionItem = new MovimientosVariosFacturacionItem();

  iconoTarjetaResumen = 'fas fa-clipboard';

  msgs;
  datosListadoPagos;
  progressSpinner: boolean = false;
  permisoEscritura: any;

  enlacesTarjetaResumen: any[] = [];
  manuallyOpened: Boolean = false;
  openDatosCliente: Boolean = false;
  openDatosGen: Boolean = false;
  openCriterios: Boolean = false;
  openListadoPagos: Boolean = false;
  // Movimiento vario que viene desde la tarjeta de facturación genérica en modo edición
  movVarioDesdeTarjFacGeneEdit = null;
  showCards: boolean = false;
  nuevoMonVarioDesdeTarjFacGene: boolean = false;

  @ViewChild(TarjetaCriteriosAplicacionComponent) tarjetaCriterios: TarjetaCriteriosAplicacionComponent;
  @ViewChild(TarjetaDatosGeneralesComponent) tarjetaDatosGenerales: TarjetaDatosGeneralesComponent;
  idMov: String;

  constructor(public datepipe: DatePipe, private translateService: TranslateService, private route: ActivatedRoute,
    private sigaServices: SigaServices, private location: Location, private persistenceService: PersistenceService,
    private router: Router, private commonsService: CommonsService, private confirmationService: ConfirmationService,
    private sigaStorageService: SigaStorageService,
    private movimientosVariosService: MovimientosVariosService,
    private sigaService: SigaServices) { }

  ngAfterViewInit(): void {
    this.enviarEnlacesTarjeta();
    //this.goTop();
  }


  ngOnInit() {
    this.cargaInicial();
  }

  async cargaInicial() {
    this.commonsService.checkAcceso(procesos_facturacionSJCS.busquedaMovimientosVarios).then(respuesta => {

      this.permisoEscritura = respuesta; //true, false, undefined

      if (this.permisoEscritura == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }
    }).catch(error => console.error(error));

    // Viene de la tarjeta de facturación genérica nuevo
    if (sessionStorage.getItem("datosNuevoMovimiento")) {
      const datos = JSON.parse(sessionStorage.getItem("datosNuevoMovimiento"));
      sessionStorage.removeItem("datosNuevoMovimiento");
      const letrado = await this.getLetrado(datos.colegiado, this.sigaStorageService.institucionActual).then(data => {
        const response = JSON.parse(data.body);
        return response.colegiadoItem[0];
      }).catch(err => {
        console.log(err);
      });
      this.datos = new MovimientosVariosFacturacionItem();
      this.datos.nif = letrado.nif;
      this.datos.apellido1 = letrado.apellidos1;
      this.datos.apellido2 = letrado.apellidos2;
      this.datos.nombre = letrado.soloNombre;
      this.datos.ncolegiado = letrado.numColegiado;
      this.datos.idPersona = letrado.idPersona;
      this.datos.descripcion = datos.descripcion;
      this.datos.cantidad = datos.cantidad;
      this.datos.idConcepto = datos.criterios.idConcepto;
      this.datos.idPartidaPresupuestaria = datos.criterios.idPartidaPresupuestaria;
      this.datos.idGrupoFacturacion = datos.criterios.idGrupoFacturacion;
      this.datos.idFacturacion = datos.criterios.idFacturacion;
      this.nuevoMonVarioDesdeTarjFacGene = true;
    }

    // Viene de la tarjeta de facturación genérica edición
    if (sessionStorage.getItem("datosEdicionMovimiento")) {
      const datos = JSON.parse(sessionStorage.getItem("datosEdicionMovimiento"));
      sessionStorage.removeItem("datosEdicionMovimiento");
      this.movVarioDesdeTarjFacGeneEdit = await this.getMovimientoVarioPorId(datos.idObjeto).then(
        (data: MovimientosVariosFacturacionDTO) => {
          let movimiento: MovimientosVariosFacturacionItem = null;
          if (data.error && data.error != null && data.error.description != null) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(data.error.description.toString()));
          } else {
            movimiento = data.facturacionItem[0];
          }

          return movimiento;
        }
      ).catch(err => {
        console.log(err);
      });
    }

    this.isLetrado = this.sigaStorageService.isLetrado;
    this.datosTarjetaResumen = [];
    this.datosTarjetaClientes = [];

    if (this.movimientosVariosService.modoEdicion || this.movVarioDesdeTarjFacGeneEdit != null) {
      this.modoEdicion = true;
    } else {
      this.modoEdicion = false;
    }

    if (this.modoEdicion) {
      if (this.movVarioDesdeTarjFacGeneEdit != null) {
        this.datos = JSON.parse(JSON.stringify(this.movVarioDesdeTarjFacGeneEdit));
      } else {
        this.datos = this.persistenceService.getDatos();
      }
      this.getDatosTarjetaClientes(this.datos);
      this.getDatosTarjetaResumen(this.datos);
      this.getPagos();
    } else {
      this.getTarjetaResumen(this.datosColegiado);
      if (sessionStorage.getItem("showDatosClientes")) {
        this.getTarjetaClientes(this.bodyFisica);
      } else {
        this.getTarjetaClientes(this.datosColegiado);
      }
    }

    this.showCards = true;
  }

  getPagos() {
    this.progressSpinner = true;
    this.datos.fechaAlta = null;


    this.sigaServices.post("movimientosVarios_getListadoPagos", this.datos).subscribe(
      n => {
        this.datosListadoPagos = JSON.parse(n.body).facturacionItem;
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
      }
    );
  }

  enviarEnlacesTarjeta() {

    this.enlacesTarjetaResumen = [];

    let tarjetaDatosCliente = {
      label: "facturacionSJCS.retenciones.ficha.colegiado",
      value: document.getElementById("tarjetaDatosCliente"),
      nombre: "tarjetaDatosCliente",
    };

    this.enlacesTarjetaResumen.push(tarjetaDatosCliente);

    let tarjetaDatosGenerales = {
      label: "facturacionSJCS.facturacionesYPagos.datosGenerales",
      value: document.getElementById("tarjetaDatosGenerales"),
      nombre: "tarjetaDatosGenerales",
    };

    this.enlacesTarjetaResumen.push(tarjetaDatosGenerales);

    let tarjetaCriteriosAplicacion = {
      label: "facturacionSJCS.movimientosVarios.criteriosAplicacion",
      value: document.getElementById("tarjetaCriteriosAplicacion"),
      nombre: "tarjetaCriteriosAplicacion",
    };

    this.enlacesTarjetaResumen.push(tarjetaCriteriosAplicacion);

    let tarjetaListadoPagos = {
      label: "facturacionSJCS.movimientosVarios.listadoPagos",
      value: document.getElementById("tarjetaListadoPagos"),
      nombre: "tarjetaListadoPagos",
    };

    this.enlacesTarjetaResumen.push(tarjetaListadoPagos);
  }

  isCloseReceive(event) {
    if (event != undefined) {
      switch (event) {
        case "tarjetaDatosCliente":
          this.openDatosCliente = this.manuallyOpened;
          break;
        case "tarjetaDatosGenerales":
          this.openDatosGen = this.manuallyOpened;
          break;
        case "tarjetaCriteriosAplicacion":
          this.openCriterios = this.manuallyOpened;
          break;
        case "tarjetaListadoPagos":
          this.openListadoPagos = this.manuallyOpened;
          break;
      }
    }
  }

  isOpenReceive(event) {

    if (event != undefined) {
      switch (event) {
        case "tarjetaDatosCliente":
          this.openDatosCliente = true;
          break;
        case "tarjetaDatosGenerales":
          this.openDatosGen = true;
          break;
        case "tarjetaCriteriosAplicacion":
          this.openCriterios = true;
          break;
        case "tarjetaListadoPagos":
          this.openListadoPagos = true;
          break;
      }
    }
  }


  getDatosTarjetaClientes(movimiento: any) {

    let datosClientes = [];
    datosClientes[0] = { label: "Identificación: ", value: movimiento.nif };
    datosClientes[1] = { label: "Nombre: ", value: movimiento.nombre };
    datosClientes[2] = { label: "Apellidos: ", value: movimiento.apellido1 + " " + movimiento.apellido2 };
    datosClientes[3] = { label: "Nº Colegiado: ", value: movimiento.ncolegiado };
    this.datosTarjetaClientes = datosClientes;

    sessionStorage.removeItem("datosColegiado");

  }

  getDatosTarjetaResumen(movimiento: any) {
    let datosResumen = [];
    datosResumen[0] = { label: "Nº Colegiado: ", value: movimiento.ncolegiado };
    datosResumen[1] = { label: "Nombre: ", value: movimiento.letrado };
    datosResumen[2] = { label: "Descripción: ", value: movimiento.descripcion };
    datosResumen[3] = { label: "Importe: ", value: movimiento.cantidad };
    this.datosTarjetaResumen = datosResumen;
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
  }



  getTarjetaClientes(movimiento: any) {

    let datosClientes = [];
    datosClientes[0] = { label: "Identificación: ", value: movimiento.nif };
    datosClientes[1] = { label: "Nombre: ", value: movimiento.nombre };
    datosClientes[2] = { label: "Apellidos: ", value: movimiento.apellidos };
    datosClientes[3] = { label: "Nº Colegiado: ", value: movimiento.nColegiado };
    this.datosTarjetaClientes = datosClientes;

  }

  getTarjetaResumen(movimiento: any) {
    let datosResumen = [];
    datosResumen[0] = { label: "Nº Colegiado: ", value: "" };
    datosResumen[1] = { label: "Nombre: ", value: "" };
    datosResumen[2] = { label: "Descripción: ", value: "" };
    datosResumen[3] = { label: "Importe: ", value: "" };
    this.datosTarjetaResumen = datosResumen;
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

  datosTarjetaResumenEvent(event) {
    if (event != undefined) {
      this.datosTarjetaResumen = event;
    }
  }

  datosColegiadoEvent(event) {
    this.datosColegiado = event;
  }

  bodyFisicaEvent(event) {
    this.bodyFisica = event;
  }

  datosClienteEvent(event) {
    this.datosClientes = event;
  }

  volver() {
    //this.location.back();
    this.router.navigate(["/movimientosVarios"]); //movimientosVarios búsqueda -- filtros
    this.movimientosVariosService.volverFicha = true; //PREGUNTAR
  }

  getMovimientoVarioPorId(id: string) {
    return this.sigaServices.getParam("movimientosVarios_getMovimientoVarioPorId", `?idMovimiento=${id}`).toPromise();
  }

  getLetrado(idPersona: string, idInstitucion: string) {
    const payload = {
      idPersona: idPersona,
      idInstitucion: idInstitucion
    };
    return this.sigaServices.post("busquedaPer_institucion", payload).toPromise();
  }

  guardar(){

    this.datosGenerales = this.tarjetaDatosGenerales.datos; //JSON.parse(JSON.stringify(this.datos)); ?¿
    this.datosCriterios = this.tarjetaCriterios.datos;

    //tenemos que comprobar que los datos del cliente están rellenos
    if(this.datosClientes != null || this.datosClientes != undefined){
      //ahora hay que comprobar que los datos de descripcion y cantidad estén rellenos
      if((this.datosGenerales.descripcion == null || this.datosGenerales.descripcion == undefined || this.datosGenerales.descripcion == "") || 
         (this.datosGenerales.cantidad == null || this.datosGenerales.cantidad == undefined || this.datosGenerales.cantidad == 0)){
          
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
      }else{ 
       let url;
       //según si es modoEdición creará o actualizará
        if (!this.modoEdicion) {
          url = "movimientosVarios_saveMovimientosVarios";
        } else {
          url = "movimientosVarios_updateMovimientosVarios";
        }
        this.callSaveService(url);
      }
    }else{
       this.showMessage("error", this.translateService.instant("general.message.incorrect"), "Deben estar los datos del Cliente rellenos");
   }
  }
  
  callSaveService(url) {
    this.progressSpinner = true;
            
        this.datosGuardar = JSON.parse(JSON.stringify(this.datosGenerales)); 
        
        if(this.datosGenerales.tipo == undefined || this.datosGenerales.tipo == null){
          this.datosGuardar.tipo = null;
        }else{
          this.datosGuardar.tipo = this.datosGenerales.tipo;
        }
  
        if(this.datosGenerales.motivo == undefined || this.datosGenerales.motivo == null){
          this.datosGuardar.motivo = null;
        }else{
          this.datosGuardar.motivo = this.datosGenerales.motivo;
        }
  
        if(this.datosGenerales.certificacion == undefined || this.datosGenerales.certificacion == null){
          this.datosGuardar.certificacion = null;
        }else{
          this.datosGuardar.certificacion = this.datos.certificacion;
        }
  
        if(this.datosClientes.idPersona == undefined || this.datosClientes.idPersona == null){
          this.datosGuardar.idPersona = null;
        }else{
          this.datosGuardar.idPersona = this.datosClientes.idPersona;
        }
  
        //datos criterios
        if(this.datosCriterios.idGrupoFacturacion == undefined || this.datosCriterios.idGrupoFacturacion == null){
          this.datosGuardar.idGrupoFacturacion = null;
        }else{
          this.datosGuardar.idGrupoFacturacion = this.datosCriterios.idGrupoFacturacion;
        }

        if(this.datosCriterios.idConcepto == undefined || this.datosCriterios.idConcepto == null){
          this.datosGuardar.idConcepto = null;
        }else{
          this.datosGuardar.idConcepto = this.datos.idConcepto;
        }

        if(this.datosCriterios.idPartidaPresupuestaria == undefined || this.datosCriterios.idPartidaPresupuestaria == null){
          this.datosGuardar.idPartidaPresupuestaria = null;
        }else{
          this.datosGuardar.idPartidaPresupuestaria = this.datosCriterios.idPartidaPresupuestaria;
        }

        if(this.datosCriterios.idFacturacion == undefined || this.datosCriterios.idFacturacion == null){
          this.datosGuardar.idFacturacion = null;
        }else{
          this.datosGuardar.idFacturacion = this.datosCriterios.idFacturacion;
        }

        //cambiar por la fecha de hoy
        this.datosGuardar.fechaAlta=null;
  
        if(!this.modoEdicion){
          this.datosGuardar.nombrefacturacion = null;
          this.datosGuardar.nombretipo = null;
          this.datosGuardar.idAplicadoEnPago= null
          this.datosGuardar.fechaApDesde = null;
          this.datosGuardar.fechaApHasta = null;
          this.datosGuardar.ncolegiado = null;
          this.datosGuardar.letrado = null;
          this.datosGuardar.cantidadAplicada = null;
          this.datosGuardar.cantidadRestante = null;
          this.datosGuardar.idInstitucion = null;
          this.datosGuardar.idMovimiento = null;
          this.datosGuardar.fechaModificacion = null;
          this.datosGuardar.usuModificacion = null;
          this.datosGuardar.contabilizado = null;
          this.datosGuardar.historico = null;
          this.datosGuardar.nif = null;
          this.datosGuardar.apellido1 = null;
          this.datosGuardar.apellido2 = null;
          this.datosGuardar.nombre = null;
          this.datosGuardar.nombrePago = null;
        }
        
      if(this.idMov != undefined && this.idMov != null){
        this.datosGuardar.idMovimiento = this.idMov;
      }
    
    this.sigaService.post(url, this.datosGuardar).subscribe(
      data => {
  
        this.datosAux = JSON.parse(JSON.stringify(this.datosGuardar));

        if(!this.modoEdicion){
          this.datos.idMovimiento = JSON.parse(data.body).id;
          this.idMov = this.datos.idMovimiento;
        }
  
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        this.modoEdicion = true;
        //this.movimientosVariosService.datosColegiadoFichaColegial(this.datosGenerales);
        this.datos = this.datosGuardar;

        if(this.datosClientes.idPersona != null && this.datosClientes.idPersona != undefined){
          this.datos.ncolegiado = this.datosClientes.ncolegiado;
          this.datos.letrado = this.datosClientes.letrado;
        }
        this.getDatosTarjetaResumen(this.datos);
        
        //this.router.navigate(["/fichaMovimientosVarios"]);
  
      },
      err => {
        this.progressSpinner = false;
  
        if (err.status == '403' || err.status == 403) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        } else {
  
          if (null != err.error && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
  
        }
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

}
