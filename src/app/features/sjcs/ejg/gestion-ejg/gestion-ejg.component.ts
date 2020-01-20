import { Component, OnInit, SimpleChanges, Input, HostListener, Output } from '@angular/core';
import { SigaServices } from '../../../../_services/siga.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { EJGItem } from '../../../../models/sjcs/EJGItem';
import { ActivatedRoute, Router } from '../../../../../../node_modules/@angular/router';
import { Location } from '@angular/common'
import { CommonsService } from '../../../../_services/commons.service';
import { TranslateService } from '../../../../commons/translate/translation.service';
import { procesos_ejg } from '../../../../permisos/procesos_ejg';
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
  msgs;
  body: EJGItem = new EJGItem();
  datosFamiliares: any;
  datos;
  // datosItem: EJGItem;
  idEJG;
  filtros;
  filtrosAux;
  permisoEscritura: boolean = true;
  modoEdicion: boolean;
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

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private location: Location,
    private persistenceService: PersistenceService,
    private router: Router,
    private commonsService: CommonsService) { }

  ngOnInit() {
    this.commonsService.scrollTop();

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
          this.body = this.persistenceService.getDatos();
          this.datos = [
            {
              label: "Año/Numero EJG",
              value: this.body.numAnnioProcedimiento
            },
            {
              label: "Apellidos, Nombre Solicitante",
              value: this.body.nombreApeSolicitante
            },
      
            {
              label: "Estado EJG",
              value: this.body.estadoEJG
            },
            {
              label: "Apellidos, Nombre Designado",
              value: this.body.apellidosYNombre
            },
            {
              label: "Dictamen",
              value: this.body.dictamenSing
            },
            {
              label: "Resolución CAJG",
              value: this.body.resolucion
            },
            {
              label: "Impugnación",
              value: this.body.impugnacion
            },
          ];
          if (this.body != undefined) {
            this.modoEdicion = true;
            //  if (this.dato.fechabaja != null) {
            //    this.modoEdicion = true;
            //  }
          } else {
            //  hemos pulsado nuevo
            this.body = new EJGItem();
            this.modoEdicion = false;
          }

         }
         this.obtenerPermisos();
    }
    ).catch(error => console.error(error));
  }
    
  clear() {
    this.msgs = [];
  }
  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.idEJG = event.idEJG
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
  obtenerPermisos(){
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
  }
}
