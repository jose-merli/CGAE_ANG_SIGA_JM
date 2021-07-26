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
  idEJG;
  filtros;
  filtrosAux;
  permisoEscritura: boolean = true;
  modoEdicion: boolean = true;
  permisoEscrituraResumen: boolean = false;
  permisoEscrituraDatosGenerales: boolean = false;
  permisoEscrituraServiciosTramitacion: boolean = false;
  permisoEscrituraUnidadFamiliar: boolean = false;
  permisoEscrituraExpedientesEconomicos: boolean = false;
  permisoEscrituraRelaciones: boolean = false;
  permisoEscrituraEstados: boolean = false;
  permisoEscrituraDocumentacion: boolean = false;
  permisoEscrituraInformeCalif: boolean = false;
  permisoEscrituraResolucion: boolean = false;
  permisoEscrituraImpugnacion: boolean = false;
  permisoEscrituraRegtel: boolean = false;
  permisoEscrituraComunicaciones: boolean = false;

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

  openTarjetaDatosGenerales: Boolean = true;
  openTarjetaServiciosTramitacion: Boolean = false;
  openTarjetaUnidadFamiliar: Boolean = false;
  openTarjetaExpedientesEconomicos: Boolean = false;
  openTarjetaRelaciones: Boolean = false;
  openTarjetaEstados: Boolean = false;
  openTarjetaDocumentacion: Boolean = false;
  openTarjetaInformeCalificacion: Boolean = false;
  openTarjetaResolucion: Boolean = false;
  openTarjetaImpugnacion: Boolean = false;
  openTarjetaRegtel: Boolean = false;
  openTarjetaComunicaciones: Boolean = false;

  enlacesTarjetaResumen = [];

  comunicaciones;

  @ViewChild(ServiciosTramitacionComponent) tramitacion;
  @ViewChild(EstadosComponent) tarjetaEstadosEJG;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private location: Location,
    private persistenceService: PersistenceService,
    private router: Router,
    private commonsService: CommonsService) { }

  ngOnInit() {
    this.progressSpinner = true;

    this.commonsService.checkAcceso(procesos_ejg.ejg)
      .then(respuesta => {
        this.permisoEscritura = respuesta;

        if (this.permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.progressSpinner = false;
          this.router.navigate(["/errorAcceso"]);
        } else {
          //El padre de todas las tarjetas se encarga de enviar a sus hijos el objeto nuevo del EJG que se quiere mostrar
          //Para indicar que estamos en modo de creacion de representante
          if(sessionStorage.getItem("EJGItemDesigna")){
            //obtiene un EJG desde la tarjeta relaciones de la ficha designacion
            this.body = JSON.parse(sessionStorage.getItem("EJGItemDesigna"));
            this.persistenceService.setDatos(this.body);
            this.modoEdicion = true;
            sessionStorage.removeItem("EJGItemDesigna")
          }else{
            this.body = this.persistenceService.getDatos();
            if (this.body != undefined && this.body != null) {
              this.modoEdicion = true;
              //  if (this.dato.fechabaja != null) {
              //    this.modoEdicion = true;
              //  }
            } else {
              //hemos pulsado nuevo 
              if(sessionStorage.getItem("Nuevo")){
                sessionStorage.removeItem("Nuevo");
                this.body = new EJGItem();
                this.modoEdicion = false;
              }
              //vuelve de asociar una unidad familiar
              else{
                this.body = JSON.parse(sessionStorage.getItem("EJGItem"));
                sessionStorage.removeItem("EJGItem");
                this.persistenceService.setDatos(this.body);
                this.modoEdicion = true;
              }
            }
          }

          sessionStorage.removeItem("EJGItem");
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
              value: this.body.impugnacion
            },
          ];
          
        }
        this.obtenerPermisos();
      }
      ).catch(error => console.error(error));
    //this.commonsService.scrollTop();
    this.goTop();
  }

  goTop() {
    document.children[document.children.length - 1]
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }

  }

  clear() {
    this.msgs = [];
  }
  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.idEJG = event.idEJG
  }

  guardadoSend(event){
    this.ngOnInit();
  }

  newEstado(){
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

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }
  
  backTo() {
    this.location.back();
  }

  obtenerPermisos() {
    //TarjetaResumen
    this.commonsService.checkAcceso(procesos_ejg.tarjetaResumen)
      .then(respuesta => {
        this.permisoEscrituraResumen = respuesta;
        this.persistenceService.setPermisos(this.permisoEscrituraResumen);
      }
      ).catch(error => console.error(error));

    //TarjetaDatosGenerales
    this.commonsService.checkAcceso(procesos_ejg.datosGenerales)
      .then(respuesta => {
        this.permisoEscrituraDatosGenerales = respuesta;
        this.persistenceService.setPermisos(this.permisoEscrituraDatosGenerales);
      }
      ).catch(error => console.error(error));

    //ServiciosTramitacion
    this.commonsService.checkAcceso(procesos_ejg.serviciosTramit)
      .then(respuesta => {
        this.permisoEscrituraServiciosTramitacion = respuesta;
        this.persistenceService.setPermisos(this.permisoEscrituraServiciosTramitacion);
      }
      ).catch(error => console.error(error));

    //UnidadFamiliar
    this.commonsService.checkAcceso(procesos_ejg.unidadFamiliar)
      .then(respuesta => {
        this.permisoEscrituraUnidadFamiliar = respuesta;
        this.persistenceService.setPermisos(this.permisoEscrituraUnidadFamiliar);
      }
      ).catch(error => console.error(error));

    //ExpedientesEcon
    this.commonsService.checkAcceso(procesos_ejg.expedientesEcon)
      .then(respuesta => {
        this.permisoEscrituraExpedientesEconomicos = respuesta;
        this.persistenceService.setPermisos(this.permisoEscrituraExpedientesEconomicos);
      }
      ).catch(error => console.error(error));

    //Relaciones
    this.commonsService.checkAcceso(procesos_ejg.relaciones)
      .then(respuesta => {
        this.permisoEscrituraRelaciones = respuesta;
        this.persistenceService.setPermisos(this.permisoEscrituraRelaciones);
      }
      ).catch(error => console.error(error));

    //Estados
    this.commonsService.checkAcceso(procesos_ejg.estados)
      .then(respuesta => {
        this.permisoEscrituraEstados = respuesta;
        this.persistenceService.setPermisos(this.permisoEscrituraEstados);
      }
      ).catch(error => console.error(error));

    //Documentacion
    this.commonsService.checkAcceso(procesos_ejg.documentacion)
      .then(respuesta => {
        this.permisoEscrituraDocumentacion = respuesta;
        this.persistenceService.setPermisos(this.permisoEscrituraDocumentacion);
      }
      ).catch(error => console.error(error));

    //informeCalif
    this.commonsService.checkAcceso(procesos_ejg.informeCalif)
      .then(respuesta => {
        this.permisoEscrituraInformeCalif = respuesta;
        this.persistenceService.setPermisos(this.permisoEscrituraInformeCalif);
      }
      ).catch(error => console.error(error));

    //Resolucion
    this.commonsService.checkAcceso(procesos_ejg.resolucion)
      .then(respuesta => {
        this.permisoEscrituraResolucion = respuesta;
        this.persistenceService.setPermisos(this.permisoEscrituraResolucion);
      }
      ).catch(error => console.error(error));

    //Impugnacion
    this.commonsService.checkAcceso(procesos_ejg.impugnacion)
      .then(respuesta => {
        this.permisoEscrituraImpugnacion = respuesta;
        this.persistenceService.setPermisos(this.permisoEscrituraImpugnacion);
      }
      ).catch(error => console.error(error));

    //Regtel
    this.commonsService.checkAcceso(procesos_ejg.regtel)
      .then(respuesta => {
        this.permisoEscrituraRegtel = respuesta;
        this.persistenceService.setPermisos(this.permisoEscrituraRegtel);
      }
      ).catch(error => console.error(error));
      
    //Comunicaciones
    this.commonsService.checkAcceso(procesos_ejg.comunicaciones)
      .then(respuesta => {
        this.permisoEscrituraComunicaciones = respuesta;
        this.persistenceService.setPermisos(this.permisoEscrituraComunicaciones);
      }
      ).catch(error => console.error(error));
    this.enviarEnlacesTarjeta();
  }

  enviarEnlacesTarjeta() {
    this.enlacesTarjetaResumen = [];

    let pruebaTarjeta = {
      label: "general.message.datos.generales",
      value: document.getElementById("datosGenerales"),
      nombre: "datosGenerales",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

    pruebaTarjeta = {
      label: "justiciaGratuita.ejg.datosGenerales.ServiciosTramit",
      value: document.getElementById("serviciosTramitacion"),
      nombre: "serviciosTramitacion",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

    pruebaTarjeta = {
      label: "justiciaGratuita.justiciables.rol.unidadFamiliar",
      value: document.getElementById("unidadFamiliar"),
      nombre: "unidadFamiliar",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

    pruebaTarjeta = {
      label: "justiciaGratuita.ejg.datosGenerales.ExpedientesEconomicos",
      value: document.getElementById("expedientesEconomicos"),
      nombre: "expedientesEconomicos",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

    pruebaTarjeta = {
      label: "justiciaGratuita.ejg.datosGenerales.Relaciones",
      value: document.getElementById("relaciones"),
      nombre: "relaciones",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

    pruebaTarjeta = {
      label: "censo.fichaIntegrantes.literal.estado",
      value: document.getElementById("estados"),
      nombre: "estados",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

    pruebaTarjeta = {
      label: "menu.facturacionSJCS.mantenimientoDocumentacionEJG",
      value: document.getElementById("documentacion"),
      nombre: "documentacion",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

    pruebaTarjeta = {
      label: "justiciaGratuita.ejg.datosGenerales.InformeCalificacion",
      value: document.getElementById("informeCalificacion"),
      nombre: "informeCalificacion",
    }

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

    pruebaTarjeta = {
      label: "justiciaGratuita.maestros.fundamentosResolucion.resolucion",
      value: document.getElementById("resolucion"),
      nombre: "resolucion",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

    pruebaTarjeta = {
      label: "justiciaGratuita.ejg.datosGenerales.Impugnacion",
      value: document.getElementById("impugnacion"),
      nombre: "impugnacion",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

    pruebaTarjeta = {
      label: "censo.regtel.literal.titulo",
      value: document.getElementById("regtel"),
      nombre: "regtel",
    };

    this.enlacesTarjetaResumen.push(pruebaTarjeta);

  
    pruebaTarjeta ={
    label: "menu.enviosAGrupos",
    value: document.getElementById("comunicaciones"),
     nombre: "comunicaciones",
     };

     this.enlacesTarjetaResumen.push(pruebaTarjeta);
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
      }
    }
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
        case "expedientesEconomicos":
          this.openTarjetaExpedientesEconomicos = true;
          break;
        case "relaciones":
          this.openTarjetaRelaciones = true;
          break;
        case "estados":
          this.openTarjetaEstados = true;
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
      }
    }
  }

}
