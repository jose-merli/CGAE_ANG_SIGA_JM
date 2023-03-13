import { Component, OnInit, SimpleChanges, Input, HostListener, Output, ViewChild } from '@angular/core';
import { SigaServices } from '../../../../_services/siga.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { EJGItem } from '../../../../models/sjcs/EJGItem';
import { ActivatedRoute, Router } from '../../../../../../node_modules/@angular/router';
import { Location } from '@angular/common';
import { CommonsService } from '../../../../_services/commons.service';
import { TranslateService } from '../../../../commons/translate/translation.service';
import { procesos_ejg } from '../../../../permisos/procesos_ejg';
import { ServiciosTramitacionComponent } from './servicios-tramitacion/servicios-tramitacion.component';
import { EstadosComponent } from './estados/estados.component';
import { Message } from 'primeng/components/common/api';
import { ContrariosPreDesignacionComponent } from './contrarios-pre-designacion/contrarios-pre-designacion.component';
import { DefensaJuridicaComponent } from './defensa-juridica/defensa-juridica.component';
import { ProcuradorPreDesignacionComponent } from './procurador-pre-designacion/procurador-pre-designacion.component';
import { ListaIntercambiosAltaEjgComponent } from './lista-intercambios-alta-ejg/lista-intercambios-alta-ejg.component';
import { ListaIntercambiosDocumentacionEjgComponent } from './lista-intercambios-documentacion-ejg/lista-intercambios-documentacion-ejg.component';

@Component({
  selector: 'app-gestion-ejg',
  templateUrl: './gestion-ejg.component.html',
  styleUrls: ['./gestion-ejg.component.scss']
})
export class GestionEjgComponent implements OnInit {
  openFicha: boolean = true;
  showTarjeta: boolean = true;
  progressSpinner: boolean = false;
  permisos;
  nuevo;
  icono = "clipboard";
  msgs: Message[];
  body: EJGItem = new EJGItem();
  prueba: EJGItem = new EJGItem();
  datosFamiliares: any;
  datos;
  // datosItem: EJGItem;
  noAsocDes: boolean = false;

  idEJG;
  filtros;
  filtrosAux;
  modoEdicion: boolean = true;
  permisoEscrituraResumen;
  permisoEscrituraDatosGenerales;
  permisoEscrituraServiciosTramitacion;
  permisoEscrituraUnidadFamiliar;
  permisoEscrituraExpedientesEconomicos;
  permisoEscrituraRelaciones;
  permisoEscrituraEstados;
  permisoEscrituraDocumentacion;
  permisoEscrituraInformeCalif;
  permisoEscrituraResolucion;
  permisoEscrituraImpugnacion;
  permisoEscrituraRegtel;
  permisoEscrituraComunicaciones;
  permisoContrarios;
  permisoProcurador;
  permisoDefensaJuridica;
  permisoListasIntercambiosPericles;

  iconoTarjetaResumen = "clipboard";

  manuallyOpened: Boolean;
  tarjetaDatosGenerales: string;
  tarjetaServiciosTramitacion: string;
  tarjetaUnidadFamiliar: string;
  tarjetaExpedientesEconomicos: string;
  tarjetaRelaciones: string;
  tarjetaEstados: string;
  tarjetaDocumentacion: string;
  tarjetaInformeCalificacion: string;
  tarjetaResolucion: string;
  tarjetaImpugnacion: string;
  tarjetaRegtel: string;
  tarjetaComunicaciones: string;

  openTarjetaDatosGenerales: Boolean = false;
  openTarjetaServiciosTramitacion: Boolean = false;
  openTarjetaUnidadFamiliar: Boolean = false;
  openTarjetaContrarios: Boolean = false;
  openTarjetaExpedientesEconomicos: Boolean = false;
  openTarjetaRelaciones: Boolean = false;
  openTarjetaEstados: Boolean = false;
  openTarjetaDocumentacion: Boolean = false;
  openTarjetaInformeCalificacion: Boolean = false;
  openTarjetaResolucion: Boolean = false;
  openTarjetaImpugnacion: Boolean = false;
  openTarjetaRegtel: Boolean = false;
  openTarjetaComunicaciones: Boolean = false;
  openTarjetaFac: Boolean = false;
  openTarjetaDefensaJuridica: boolean;
  openTarjetaContrariosPreDesigna: boolean;
  openTarjetaProcuradorPreDesigna: boolean;
  openTarjetaListaIntercambiosAltaEjg: Boolean;
  openTarjetaListaIntercambiosDocumentacionEjg: Boolean;

  enlacesTarjetaResumen = [];

  comunicaciones;

  @ViewChild(ServiciosTramitacionComponent) tramitacion;
  @ViewChild(EstadosComponent) tarjetaEstadosEJG;
  @ViewChild(ContrariosPreDesignacionComponent) contrariosPreDesigna;
  @ViewChild(DefensaJuridicaComponent) defensaJuridica;
  @ViewChild(ProcuradorPreDesignacionComponent) procuradorPreDesigna;
  @ViewChild(ListaIntercambiosAltaEjgComponent) listaIntercambiosAltaEjg: ListaIntercambiosAltaEjgComponent;
  @ViewChild(ListaIntercambiosDocumentacionEjgComponent) listaIntercambiosDocumentacionEjg: ListaIntercambiosDocumentacionEjgComponent;

  datosEntradaTarjGenerica: any;
  permisoEscrituraFacturaciones: any;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private location: Location,
    private persistenceService: PersistenceService,
    private router: Router,
    private commonsService: CommonsService) { }

  async ngOnInit() {
    //this.progressSpinner = true;

    //El padre de todas las tarjetas se encarga de enviar a sus hijos el objeto nuevo del EJG que se quiere mostrar
    //Para indicar que estamos en modo de creacion de representante
    if (sessionStorage.getItem("EJGItemDesigna")) {

      if (sessionStorage.getItem("EJGItemDesigna") == "nuevo") {
        //No parece que haya informacion en común entre la designación y el EJG que permita rellenar la tarjeta de datos generales.
        //this.body = JSON.parse(sessionStorage.getItem("Designacion"));
        this.body = new EJGItem();
        this.persistenceService.clearDatos();
        this.modoEdicion = false;
        this.openTarjetaDatosGenerales = true;
      } else {
        //obtiene un EJG desde la tarjeta relaciones de la ficha designacion
        this.body = JSON.parse(sessionStorage.getItem("EJGItemDesigna"));
        this.body.apellidosYNombre = "";
        this.persistenceService.setDatosEJG(this.body);
        this.modoEdicion = true;
        this.updateTarjResumen();
      }

      sessionStorage.removeItem("EJGItemDesigna");

    } else {
      this.body = this.persistenceService.getDatosEJG();
      if (this.body != null && this.body.annio == null && sessionStorage.getItem("EJGItem") != null) {
        this.body = JSON.parse(sessionStorage.getItem("EJGItem"));
        sessionStorage.removeItem("EJGItem");
        this.persistenceService.setDatosEJG(this.body);
        this.updateTarjResumen();
        this.modoEdicion = true;
      }
      if (this.body != null && this.body != undefined) {
        this.body.apellidosYNombre = "";
      }

      if (sessionStorage.getItem("fichaEJG") != null) {
        this.body = JSON.parse(sessionStorage.getItem("fichaEJG"));
        sessionStorage.removeItem("fichaEJG");
        this.persistenceService.setDatosEJG(this.body);
        this.updateTarjResumen();
      }

      if (sessionStorage.getItem("datosDesdeJusticiable")) {
        this.body = JSON.parse(sessionStorage.getItem("datosDesdeJusticiable"));
        sessionStorage.removeItem("datosDesdeJusticiable");
        this.persistenceService.setDatosEJG(this.body);
        this.updateTarjResumen();
      }

      if (this.body != undefined && this.body != null) {
        this.modoEdicion = true;
        this.updateTarjResumen();
      } else {
        //hemos pulsado nuevo 
        if (sessionStorage.getItem("Nuevo")) {
          this.nuevo = true;
          sessionStorage.removeItem("Nuevo");
          this.body = new EJGItem();
          this.modoEdicion = false;
          this.openTarjetaDatosGenerales = true;
        }
        //vuelve de asociar una unidad familiar
        else {
          this.body = JSON.parse(sessionStorage.getItem("EJGItem"));
          sessionStorage.removeItem("EJGItem");
          this.persistenceService.setDatosEJG(this.body);
          this.updateTarjResumen();
          this.modoEdicion = true;
        }
      }
    }
    this.progressSpinner = false;
    //sessionStorage.removeItem("EJGItem");
    //this.updateTarjResumen();
    this.datosEntradaTarjGenerica = this.body;
    this.obtenerPermisos();
    


    //this.commonsService.scrollTop();
    this.goTop();
    //console.log('nuevo 1: ', this.nuevo)
  }

  actualizaLetradoDesignado(event) {
    this.body.apellidosYNombre = event;
    this.updateTarjResumen();
  }

  updateTarjResumen() {
    if (!this.nuevo || (this.body != null && this.body != undefined)) {
      if(this.body.numAnnioProcedimiento== null || this.body.numAnnioProcedimiento == undefined){
        this.body.numAnnioProcedimiento = "E" + this.body.annio + "/" + this.body.numEjg;
      }
        this.datos = [
          {
            label: "Año/Numero EJG",
            value: this.body.numAnnioProcedimiento
          },
          {
            label: "Solicitante",
            value: this.body.nombreApeSolicitante
          },

          {
            label: "Estado EJG",
            value: this.body.estadoEJG
          },
          {
            label: "Designado",
            value: this.body.apellidosYNombre
          },
          {
            label: "Dictamen",
            value: this.body.dictamenSing
          },
          {
            label: "CAJG",
            value: this.body.resolucion
          },
          {
            label: "Impugnación",
            value: this.body.impugnacionDesc
          },
        ];
      }
  }

  goTop() {
    document.children[document.children.length - 1]
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }

  goResol() {
    document.children[document.children.length - 1]
    let resol = document.getElementById("resol");
    if (resol) {
      this.openTarjetaResolucion = true;
      resol.scrollIntoView();
      resol = null;
    }
  }

  clear() {
    this.msgs = [];
  }
  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.idEJG = event.idEJG
  }

  guardadoSend(event) {
    this.ngOnInit();
  }

  newEstado() {
    this.tarjetaEstadosEJG.getEstados(this.body);
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  asignNoAsocDes(event) {
    this.noAsocDes = event;
  }

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  backTo() {
    this.persistenceService.clearDatos();

    // Si viene de asistencias expres
    if (sessionStorage.getItem("filtroAsistenciaExpresBusqueda")){
      sessionStorage.setItem("vieneDeAsistenciaExpres", "true");
    }

    // Volver a asistencia.
    if (sessionStorage.getItem("idAsistencia")) {
      //sessionStorage.setItem("vieneDeFichaDesigna", "true");
      this.router.navigate(['/fichaAsistencia']);
    }
    //Para evitar complicaciones según se acceda desde la pantalla de busqueda de EJGs de comision o 
    //desde una ficha de acta directamente
    if (sessionStorage.getItem("actasItemAux") && sessionStorage.getItem("actasItem") == null) {
      sessionStorage.setItem("actasItem", sessionStorage.getItem("actasItemAux"));
      sessionStorage.removeItem("actasItemAux");
    }
    this.persistenceService.clearDatosEJG();
    this.persistenceService.setVolverEJG();
    this.location.back();
  }

  ngOnDestroy(){
    this.persistenceService.setVolverEJG();
  }

  async obtenerPermisos() {
    let recibidos = 0; //Determina cuantos servicios de los permisos se han terminado
    //TarjetaResumen
    this.commonsService.checkAcceso(procesos_ejg.tarjetaResumen)
      .then(respuesta => {
        this.permisoEscrituraResumen = respuesta;
        recibidos++;
        if (recibidos == 14) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

    //TarjetaDatosGenerales
    this.commonsService.checkAcceso(procesos_ejg.datosGenerales)
      .then(respuesta => {
        this.permisoEscrituraDatosGenerales = respuesta;
        recibidos++;
        if (recibidos == 14) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

    //ServiciosTramitacion
    this.commonsService.checkAcceso(procesos_ejg.serviciosTramitacion)
      .then(respuesta => {
        this.permisoEscrituraServiciosTramitacion = respuesta;
        recibidos++;
        if (recibidos == 14) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

    //UnidadFamiliar
    this.commonsService.checkAcceso(procesos_ejg.unidadFamiliar)
      .then(respuesta => {
        this.permisoEscrituraUnidadFamiliar = respuesta;
        recibidos++;
        if (recibidos == 14) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

    //ExpedientesEcon
    this.commonsService.checkAcceso(procesos_ejg.expedientesEconomicos)
      .then(respuesta => {
        this.permisoEscrituraExpedientesEconomicos = respuesta;
        recibidos++;
        if (recibidos == 14) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

    //Relaciones
    this.commonsService.checkAcceso(procesos_ejg.relaciones)
      .then(respuesta => {
        this.permisoEscrituraRelaciones = respuesta;
        recibidos++;
        if (recibidos == 14) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

    this.progressSpinner = false;

    //Estados
    this.commonsService.checkAcceso(procesos_ejg.estados)
      .then(respuesta => {
        this.permisoEscrituraEstados = respuesta;
        recibidos++;
        if (recibidos == 14) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

    //Documentacion
    this.commonsService.checkAcceso(procesos_ejg.documentacion)
      .then(respuesta => {
        this.permisoEscrituraDocumentacion = respuesta;
        recibidos++;
        if (recibidos == 14) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

    //informeCalif
    this.commonsService.checkAcceso(procesos_ejg.informeCalif)
      .then(respuesta => {
        this.permisoEscrituraInformeCalif = respuesta;
        recibidos++;
        if (recibidos == 14) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

    //Resolucion
    this.commonsService.checkAcceso(procesos_ejg.resolucion)
      .then(respuesta => {
        this.permisoEscrituraResolucion = respuesta;
        recibidos++;
        if (recibidos == 14) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

    //Impugnacion
    this.commonsService.checkAcceso(procesos_ejg.impugnacion)
      .then(respuesta => {
        this.permisoEscrituraImpugnacion = respuesta;
        recibidos++;
        if (recibidos == 14) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

    //Regtel
    this.commonsService.checkAcceso(procesos_ejg.regtel)
      .then(respuesta => {
        this.permisoEscrituraRegtel = respuesta;
        recibidos++;
        if (recibidos == 14) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

    //Comunicaciones
    this.commonsService.checkAcceso(procesos_ejg.comunicaciones)
      .then(respuesta => {
        this.permisoEscrituraComunicaciones = respuesta;
        recibidos++;
        if (recibidos == 14) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

    //   //Facturaciones
    // this.commonsService.checkAcceso(procesos_ejg.facturaciones)
    // .then(respuesta => {
    //   this.permisoEscrituraFacturaciones = respuesta;
    //   recibidos++;
    //   if (recibidos == 16) this.enviarEnlacesTarjeta();
    // }
    // ).catch(error => console.error(error));

    this.commonsService.checkAcceso(procesos_ejg.intercambiosPericles)
      .then(respuesta => {
        this.permisoListasIntercambiosPericles = respuesta;
        recibidos++;
        if (recibidos == 14) this.enviarEnlacesTarjeta();
      }
      ).catch(error => console.error(error));

    //Comprobar si el EJG tiene alguna designacion asignada.
    //Si es asi, esta ficha sera unicamente de consulta, no edicion.
    this.checkEJGDesignas();
  }

  enviarEnlacesTarjeta() {
    if (sessionStorage.getItem("actasItem")) {
      this.goResol();
    }

    this.enlacesTarjetaResumen = [];

    let pruebaTarjeta;

    setTimeout(() => {

      if (this.permisoEscrituraDatosGenerales != undefined) {
        pruebaTarjeta = {
          label: "general.message.datos.generales",
          value: document.getElementById("datosGenerales"),
          nombre: "datosGenerales",
        };

        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }

      if (this.permisoEscrituraServiciosTramitacion != undefined) {
        pruebaTarjeta = {
          label: "justiciaGratuita.ejg.datosGenerales.ServiciosTramit",
          value: document.getElementById("serviciosTramitacion"),
          nombre: "serviciosTramitacion",
        };

        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }

      if (this.permisoEscrituraUnidadFamiliar != undefined) {
        pruebaTarjeta = {
          label: "justiciaGratuita.justiciables.rol.unidadFamiliar",
          value: document.getElementById("unidadFamiliar"),
          nombre: "unidadFamiliar",
        };

        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }

      if (this.permisoEscrituraExpedientesEconomicos != undefined) {
        pruebaTarjeta = {
          label: "justiciaGratuita.ejg.datosGenerales.ExpedientesEconomicos",
          value: document.getElementById("expedientesEconomicos"),
          nombre: "expedientesEconomicos",
        };

        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }

      if (this.permisoEscrituraRelaciones != undefined) {
        pruebaTarjeta = {
          label: "justiciaGratuita.ejg.datosGenerales.Relaciones",
          value: document.getElementById("relaciones"),
          nombre: "relaciones",
        };

        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }

      if (this.permisoDefensaJuridica != undefined) {
        pruebaTarjeta = {
          label: "justiciaGratuita.ejg.preDesigna.defensaJuridica",
          value: document.getElementById("defensaJuridica"),
          nombre: "defensaJuridica",
        };

        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }

      if (this.permisoContrarios != undefined) {
        pruebaTarjeta = {
          label: "justiciaGratuita.ejg.preDesigna.contrarios",
          value: document.getElementById("contrariosPreDesigna"),
          nombre: "contrariosPreDesigna",
        };

        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }

      if (this.permisoProcurador != undefined) {
        pruebaTarjeta = {
          label: "justiciaGratuita.oficio.designas.contrarios.procurador",
          value: document.getElementById("procuradorPreDesigna"),
          nombre: "procuradorPreDesigna",
        };

        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }

      if (this.permisoEscrituraEstados != undefined) {
        pruebaTarjeta = {
          label: "censo.fichaIntegrantes.literal.estado",
          value: document.getElementById("estados"),
          nombre: "estados",
        };

        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }

      if (this.permisoEscrituraDocumentacion != undefined) {
        pruebaTarjeta = {
          label: "menu.facturacionSJCS.mantenimientoDocumentacionEJG",
          value: document.getElementById("documentacion"),
          nombre: "documentacion",
        };

        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }

      if (this.permisoEscrituraInformeCalif != undefined) {
        pruebaTarjeta = {
          label: "justiciaGratuita.ejg.datosGenerales.InformeCalificacion",
          value: document.getElementById("informeCalificacion"),
          nombre: "informeCalificacion",
        }

        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }

      if (this.permisoEscrituraResolucion != undefined) {
        pruebaTarjeta = {
          label: "justiciaGratuita.maestros.fundamentosResolucion.resolucion",
          value: document.getElementById("resolucion"),
          nombre: "resolucion",
        };

        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }

      if (this.permisoEscrituraImpugnacion != undefined) {
        pruebaTarjeta = {
          label: "justiciaGratuita.ejg.datosGenerales.Impugnacion",
          value: document.getElementById("impugnacion"),
          nombre: "impugnacion",
        };

        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }

      if (this.permisoEscrituraRegtel != undefined) {
        pruebaTarjeta = {
          label: "censo.regtel.literal.titulo",
          value: document.getElementById("regtel"),
          nombre: "regtel",
        };

        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }

      if (this.permisoEscrituraComunicaciones != undefined) {
        pruebaTarjeta = {
          label: "menu.enviosAGrupos",
          value: document.getElementById("comunicaciones"),
          nombre: "comunicaciones",
        };

        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }

      pruebaTarjeta = {
        label: "facturacionSJCS.tarjGenFac.facturaciones",
        value: document.getElementById("facSJCSTarjFacGene"),
        nombre: "facturaciones",
      };

      this.enlacesTarjetaResumen.push(pruebaTarjeta);

      if (this.permisoListasIntercambiosPericles != undefined) {
        pruebaTarjeta = {
          label: "justiciaGratuita.ejg.listaIntercambios.listaExpedientes",
          value: document.getElementById("listaIntercambiosAltaEjg"),
          nombre: "listaIntercambiosAltaEjg",
        };

        this.enlacesTarjetaResumen.push(pruebaTarjeta);

        pruebaTarjeta = {
          label: "justiciaGratuita.ejg.listaIntercambios.listaDocumentacion",
          value: document.getElementById("listaIntercambiosDocumentacionEjg"),
          nombre: "listaIntercambiosDocumentacionEjg",
        };

        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }
      
    }, 5)
    this.progressSpinner = false;
  }

  isCloseReceive(event) {
    if (event != undefined) {
      switch (event) {
        case "datosGenerales":
          this.openTarjetaDatosGenerales = this.manuallyOpened;
          break;
        case "serviciosTramitacion":
          this.openTarjetaServiciosTramitacion = this.manuallyOpened;
          break;
        case "unidadFamiliar":
          this.openTarjetaUnidadFamiliar = this.manuallyOpened;
          break;
        case "contrariosPreDesigna":
          this.openTarjetaContrarios = this.manuallyOpened;
          break;
        case "expedientesEconomicos":
          this.openTarjetaExpedientesEconomicos = this.manuallyOpened;
          break;
        case "relaciones":
          this.openTarjetaRelaciones = this.manuallyOpened;
          break;
        case "estados":
          this.openTarjetaEstados = this.manuallyOpened;
          break;
        case "documentacion":
          this.openTarjetaDocumentacion = this.manuallyOpened;
          break;
        case "informeCalificacion":
          this.openTarjetaInformeCalificacion = this.manuallyOpened;
          break;
        case "resolucion":
          this.openTarjetaResolucion = this.manuallyOpened;
          break;
        case "impugnacion":
          this.openTarjetaImpugnacion = this.manuallyOpened;
          break;
        case "regtel":
          this.openTarjetaRegtel = this.manuallyOpened;
          break;
        case "comunicaciones":
          this.openTarjetaComunicaciones = this.manuallyOpened;
          break;
        case "facturaciones":
          this.openTarjetaFac = this.manuallyOpened;
          break;
        case "listaIntercambiosAltaEjg":
          this.openTarjetaListaIntercambiosAltaEjg = this.manuallyOpened;
          break;
        case "listaIntercambiosDocumentacionEjg":
          this.openTarjetaListaIntercambiosDocumentacionEjg = this.manuallyOpened;
          break;
      }
    }
  }

  checkEJGDesignas() {
    //this.progressSpinner = true;
    this.sigaServices.post("gestionejg_getEjgDesigna", this.body).subscribe(
      n => {
        let ejgDesignas = JSON.parse(n.body).ejgDesignaItems;
        if (ejgDesignas.length == 0) {
          this.permisoContrarios = true;
          this.permisoDefensaJuridica = true;
          this.permisoProcurador = true;
        }
        else {
          this.permisoContrarios = false;
          this.permisoDefensaJuridica = false;
          this.permisoProcurador = -false;
        }
        this.progressSpinner = false;
      }
    );
  }

  isOpenReceive(event) {

    if (event != undefined) {
      switch (event) {
        case "datosGenerales":
          this.openTarjetaDatosGenerales = true;
          break;
        case "serviciosTramitacion":
          this.openTarjetaServiciosTramitacion = true;
          break;
        case "unidadFamiliar":
          this.openTarjetaUnidadFamiliar = true;
          break;
        case "contrariosPreDesigna":
            this.openTarjetaContrarios = true;
            break;
        case "expedientesEconomicos":
          this.openTarjetaExpedientesEconomicos = true;
          break;
        case "relaciones":
          this.openTarjetaRelaciones = true;
          break;
        case "estados":
          this.openTarjetaEstados = true;
          break;
        case "defensaJuridica":
          this.defensaJuridica.openDef = true;
          break;
        case "contrariosPreDesigna":
          this.contrariosPreDesigna.openCon = true;
          break;
        case "procuradorPreDesigna":
          this.procuradorPreDesigna.openPro = true;
          break;
        case "documentacion":
          this.openTarjetaDocumentacion = true;
          break;
        case "informeCalificacion":
          this.openTarjetaInformeCalificacion = true;
          break;
        case "resolucion":
          this.openTarjetaResolucion = true;
          break;
        case "impugnacion":
          this.openTarjetaImpugnacion = true;
          break;
        case "regtel":
          this.openTarjetaRegtel = true;
          break;
        case "comunicaciones":
          this.openTarjetaComunicaciones = true;
          break;
        case "facturaciones":
          this.openTarjetaFac = true;
        case "listaIntercambiosAltaEjg":
          this.openTarjetaListaIntercambiosAltaEjg = true;
          break;
        case "listaIntercambiosDocumentacionEjg":
          this.openTarjetaListaIntercambiosDocumentacionEjg = true;
          break;
      }
    }
  }

  guardarDatos() {
    this.persistenceService.setDatosEJG(this.body);
  }

  actualizarTarjetasIntercambios() {
    if (this.listaIntercambiosAltaEjg != undefined) {
      this.listaIntercambiosAltaEjg.actualizarDatosTarjeta();
    }
    if (this.listaIntercambiosDocumentacionEjg != undefined) {
      this.listaIntercambiosDocumentacionEjg.actualizarDatosTarjeta();
    }
  }

}
